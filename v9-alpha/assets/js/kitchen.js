/* Agentic AI, Explained (v9): the reader. One room, one screen. The kitchen is a list of things (data/kitchen.js) and the story is a list
   of steps (data/story.js); each step shows or hides things, sends someone walking, and says one line. Next, the arrow keys, Space, a
   click on the kitchen, a swipe, the scrubber, a chapter chip or Play move along the steps. Play goes on by itself, 1, 2 or 3 seconds
   per step. The last steps lay the real names (data/names.js) over the faded kitchen. State is only the number of the step: what the
   kitchen looks like at step n is worked out from steps 0 to n, so any step can be opened directly. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var C = window.COMIC, K = C.kitchen, CH = C.chapters, STEPS = C.steps, NAMES = C.names || [];
  var NS = "http://www.w3.org/2000/svg";
  var root = document.documentElement;
  var LAST = STEPS.length - 1;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function h(tag, attrs) {
    var e = document.createElement(tag), i;
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") e.className = v; else if (k === "text") e.textContent = v;
      else e.setAttribute(k, v === true ? "" : v);
    });
    for (i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { /* private mode */ }
    return null;
  }
  // **bold** in data strings.
  function rich(text) {
    var f = document.createDocumentFragment(), re = /\*\*([^*]+)\*\*/g, last = 0, m;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > last) f.appendChild(document.createTextNode(text.slice(last, m.index)));
      f.appendChild(h("strong", null, m[1]));
      last = m.index + m[0].length;
    }
    if (last < text.length) f.appendChild(document.createTextNode(text.slice(last)));
    return f;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function motionOk() { return !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

  var stage = $("#main"), world = $("#world"), hworld = $("#hworld"), bubs = $("#bubs"), labs = $("#labs"), halos = $("#halos");
  var el = {
    back: $("#btn-back"), next: $("#btn-next"), play: $("#btn-play"), speed: $("#btn-speed"), speedN: $("#speed-n"), scrub: $("#scrub"),
    chno: $("#chno"), chname: $("#chname"), stepn: $("#stepn"), cap: $("#cap"), banner: $("#banner"), bannerN: $("#banner-n"), bannerT: $("#banner-t"),
    card: $("#defcard"), cardKw: $("#def-kw"), cardTerm: $("#def-term"), cardText: $("#def-text"), cardMore: $("#def-more"), cardClose: $("#def-close"), console: $("#console")
  };
  var BASE = "How an AI agent works · Agentic AI, Explained";

  /* ---------- Build the kitchen ------------------------------------------------ */
  var byId = {}, actors = [];
  var RANK = { wall: 0, furn: 1, top: 2, floor: 3, people: 4, front: 5 };
  var PEOPLE = { chef: 1, owner: 1, person: 1 };

  function build() {
    $("#room").appendChild(C.room(K.wall));
    K.actors.forEach(function (a) { byId[a.id] = a; a.poseSet = a.poses ? a.poses.slice() : []; });
    STEPS.forEach(function (st) {
      Object.keys(st.pose || {}).forEach(function (id) {
        var a = byId[id];
        if (!a) { if (window.console) console.warn("story: no thing called " + id); return; }
        if (a.poseSet.indexOf(st.pose[id]) < 0) a.poseSet.push(st.pose[id]);
      });
    });
    var order = K.actors.map(function (a, i) { return { a: a, i: i }; }).sort(function (p, q) { return (RANK[p.a.layer] - RANK[q.a.layer]) || (p.i - q.i); });
    order.forEach(function (p) {
      var a = p.a;
      if (!a.poseSet.length && PEOPLE[a.prop]) a.poseSet = ["calm/down"];
      a.poses = a.poseSet;
      a.el = C.actor(a);
      if (!a.el) return;
      a.pos = [a.x, a.y];
      a.moving = !!PEOPLE[a.prop];
      (RANK[a.layer] >= RANK.people ? $("#front") : $("#back")).appendChild(a.el);
      actors.push(a);
    });
  }

  /* The real names: a dashed outline round the part of the kitchen, and a label on it. */
  var labEls = {}, haloEls = {};
  function buildNames() {
    NAMES.forEach(function (nm, i) {
      var boxes = nm.boxes || [nm.box];
      boxes.forEach(function (b, k) {
        var g = C.halo(b, nm.zone, nm.id + k);
        g.setAttribute("data-ch", nm.ch);
        if (nm.fill !== undefined) g.style.setProperty("--hf", nm.fill);
        g.style.setProperty("--hd", (0.1 + i * 0.09) + "s");
        halos.appendChild(g);
        (haloEls[nm.id] = haloEls[nm.id] || []).push(g);
      });
      var lab = h("button", { class: "lab", type: "button", "data-zone": nm.zone, "data-ch": nm.ch, "data-id": nm.id, "aria-label": nm.term + ": " + nm.def },
        h("span", { class: "lab-n", "aria-hidden": "true" }, i + 1), h("span", { class: "lab-t" }, nm.short || nm.term));
      lab.style.left = nm.lab[0] + "px";
      lab.style.top = nm.lab[1] + "px";
      lab.style.setProperty("--ld", (0.1 + i * 0.09) + "s");
      lab.addEventListener("click", function (e) { e.stopPropagation(); stopPlay(); toggleTerm(nm.id); });
      labs.appendChild(lab);
      labEls[nm.id] = lab;
    });
  }

  /* ---------- Camera ------------------------------------------------------------ */
  var VH = K.h - K.y0, MID = [K.w / 2, K.y0 + VH / 2];
  var view = { W: 0, H: 0, u: 1, narrow: false }, camTarget = MID;
  function layout() {
    var r = stage.getBoundingClientRect(), W = r.width, H = r.height, fit = Math.min(W / K.w, H / VH);
    view.W = W; view.H = H;
    view.narrow = W < 960;
    stage.classList.toggle("is-narrow", view.narrow);
    // Big screens see the whole kitchen. On a small one the camera comes closer and follows the chef (but not for the real names).
    var u = fit;
    if (fit < 0.62 && !stage.classList.contains("is-map")) u = clamp(Math.min(H / VH, 0.8), fit, 0.8);
    view.u = u;
    var vw = W / u, vh = H / u, cx = camTarget[0], cy = camTarget[1];
    cx = vw >= K.w ? K.w / 2 : clamp(cx, vw / 2, K.w - vw / 2);
    cy = vh >= VH ? MID[1] : clamp(cy, K.y0 + vh / 2, K.h - vh / 2);
    var tf = "translate(" + (W / 2 - cx * u).toFixed(1) + "px," + (H / 2 - cy * u).toFixed(1) + "px) scale(" + u.toFixed(4) + ")";
    world.style.transform = tf;
    hworld.style.transform = tf;
    hworld.style.setProperty("--bfs", Math.max(16, 12 / u).toFixed(1) + "px");
    hworld.style.setProperty("--lfs", Math.max(15, (view.narrow ? 10 : 12.5) / u).toFixed(1) + "px");
    if (openId) placeCard();
  }

  /* ---------- What the kitchen looks like at step s ------------------------------ */
  function derive(s) {
    var st = { on: {}, pos: {}, pose: {}, night: false, cam: null, map: null, order: {} }, i;
    actors.forEach(function (a) { st.pos[a.id] = a.pos0 || [a.x, a.y]; });
    for (i = 0; i <= s; i++) {
      var p = STEPS[i];
      (p.show || []).forEach(function (id) { st.on[id] = true; });
      (p.hide || []).forEach(function (id) { delete st.on[id]; });
      Object.keys(p.go || {}).forEach(function (id) { st.pos[id] = p.go[id]; });
      Object.keys(p.pose || {}).forEach(function (id) { st.pose[id] = p.pose[id]; });
      if (p.night !== undefined) st.night = p.night;
      if (p.cam) st.cam = p.cam;
    }
    st.map = STEPS[s].map === undefined ? null : STEPS[s].map;
    (STEPS[s].show || []).forEach(function (id, n) { st.order[id] = n; });
    return st;
  }

  var cur = -1, timers = [], jumpTimer = 0;
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  // opts.jump: no animation, everything simply is there. Otherwise things arrive, walk and speak.
  function render(s, opts) {
    opts = opts || {};
    s = clamp(s, 0, LAST);
    var prev = cur, st = derive(s), step = STEPS[s], jump = !!opts.jump || prev < 0 || !motionOk();
    var T = parseFloat(getComputedStyle(root).getPropertyValue("--t")) || 1;
    clearTimers();
    if (jump) {
      stage.classList.add("is-jump");
      clearTimeout(jumpTimer);
      jumpTimer = setTimeout(function () { stage.classList.remove("is-jump"); }, 60);
    }
    cur = s;

    actors.forEach(function (a) {
      var e = a.el, on = !!st.on[a.id], was = e.classList.contains("on"), pos = st.pos[a.id], moved = a.pos[0] !== pos[0] || a.pos[1] !== pos[1];
      e.classList.remove("is-new", "walking");
      if (on && !was) {
        e.classList.add("on");
        if (!jump && opts.step) {
          e.style.setProperty("--rd", ((0.15 + (st.order[a.id] || 0) * 0.3) * T).toFixed(2) + "s");
          void e.getBoundingClientRect();
          e.classList.add("is-new");
        }
      } else if (!on && was) {
        e.classList.remove("on");
      }
      if (moved) {
        a.pos = [pos[0], pos[1]];
        e.style.transform = "translate(" + pos[0] + "px," + pos[1] + "px)";
        if (!jump && a.moving && on) e.classList.add("walking");
      }
      if (a.poses.length) {
        var want = st.pose[a.id] || a.poses[0];
        Array.prototype.forEach.call(e.querySelectorAll(".pose"), function (pg) { pg.classList.toggle("on", pg.getAttribute("data-pose") === want); });
      }
    });
    later(function () { actors.forEach(function (a) { a.el.classList.remove("is-new", "walking"); }); }, (2600 + 400 * (step.show ? step.show.length : 0)) * T);

    stage.classList.toggle("is-night", !!st.night);
    stage.classList.toggle("is-map", st.map !== null);
    camTarget = st.cam || MID;
    layout();

    // Which real names are in front.
    Object.keys(labEls).forEach(function (id) {
      var nm = byName[id], dim = st.map !== null && st.map !== "all" && nm.ch !== st.map;
      labEls[id].classList.toggle("dim", dim);
      (haloEls[id] || []).forEach(function (g) { g.classList.toggle("dim", dim); });
    });
    if (!opts.keepCard) closeTerm();

    speech(step, jump);
    words(s, step, prev);
    chrome(s);
    if (opts.step || opts.push) schedulePath(s);
  }

  /* ---------- Speech, words and the rest of the screen ---------------------------- */
  function speech(step, jump) {
    while (bubs.firstChild) bubs.removeChild(bubs.firstChild);
    (step.say || []).forEach(function (sa, i) {
      var b = h("div", { class: "bub " + (sa.k || "say") + (sa.tail ? " t-" + sa.tail : "") }, rich(sa.t));
      b.style.left = sa.at[0] + "px";
      b.style.top = sa.at[1] + "px";
      if (sa.w) b.style.setProperty("--mw", sa.w + "px");
      b.style.setProperty("--b", i);
      bubs.appendChild(b);
    });
  }
  function chapterLabel(ch) { return ch === 0 ? "Start" : ch === 9 ? "The end" : ch === 10 ? "Names" : "Chapter " + ch; }
  function words(s, step, prev) {
    var ch = CH[step.ch], first = s === 0 || STEPS[s - 1].ch !== step.ch;
    el.chno.textContent = chapterLabel(step.ch);
    el.chname.textContent = ch.title;
    el.stepn.textContent = (s + 1) + " / " + STEPS.length;
    el.cap.textContent = "";
    el.cap.appendChild(rich(step.cap));
    el.cap.classList.remove("is-new");
    if (prev !== s && prev >= 0 && motionOk()) { void el.cap.offsetWidth; el.cap.classList.add("is-new"); }
    [el.console, el.banner].forEach(function (e) { e.setAttribute("data-zone", ch.zone); });
    el.bannerN.textContent = step.ch > 0 && step.ch < 9 ? step.ch : "";
    el.bannerT.textContent = ch.title;
    el.banner.classList.toggle("is-on", first);
    document.title = (step.ch === 0 ? "" : ch.title + " · ") + BASE;
  }
  var firstOf = [];
  STEPS.forEach(function (st, i) { if (firstOf[st.ch] === undefined) firstOf[st.ch] = i; });
  var nav = $("#pages");
  function chips() {
    CH.forEach(function (c, i) {
      var a = h("a", { class: "pg" + (i === 10 ? " is-map" : ""), href: "#" + (c.hash || "start"), "data-ch": i, title: c.title,
        "aria-label": (i === 0 ? "Start: " : i === 9 ? "End: " : i === 10 ? "" : "Chapter " + i + ": ") + c.title }, c.short);
      a.addEventListener("click", function (e) { e.preventDefault(); stopPlay(); go(firstOf[i], { push: true }); });
      nav.appendChild(a);
    });
  }
  var seenTo = 0;
  function chrome(s) {
    seenTo = Math.max(seenTo, s);
    var cur = null;
    Array.prototype.forEach.call(nav.children, function (a, i) {
      var here = i === STEPS[s].ch, seen = firstOf[i] < seenTo;
      a.classList.toggle("is-seen", seen && !here);
      if (here) { a.setAttribute("aria-current", "true"); cur = a; } else a.removeAttribute("aria-current");
    });
    if (cur && nav.scrollTo) nav.scrollTo({ left: cur.offsetLeft - nav.clientWidth / 2 + cur.offsetWidth / 2, behavior: "auto" });
    el.back.disabled = s <= 0;
    el.next.querySelector(".btn-label").textContent = s >= LAST ? "Again" : "Next";
    el.next.setAttribute("aria-label", s >= LAST ? "Start again" : "Next step");
    el.scrub.value = s;
    el.scrub.style.setProperty("--p", (s / LAST * 100).toFixed(1) + "%");
    el.scrub.setAttribute("aria-valuetext", "Step " + (s + 1) + " of " + STEPS.length + ", " + STEPS[s].cap.replace(/\*\*/g, ""));
  }

  /* ---------- The real names: the card with the explanation ---------------------------- */
  var byName = {}, openId = null;
  NAMES.forEach(function (nm) { byName[nm.id] = nm; });
  function toggleTerm(id) { if (openId === id) closeTerm(); else openTerm(id); }
  function openTerm(id) {
    var nm = byName[id];
    if (!nm) return;
    openId = id;
    el.card.setAttribute("data-zone", nm.zone);
    el.cardKw.textContent = nm.kw ? "In the kitchen: " + nm.kw : "";
    el.cardTerm.textContent = nm.term;
    el.cardText.textContent = nm.def;
    el.cardMore.setAttribute("href", "../v6-alpha/terms/" + nm.id + "/");
    el.card.hidden = false;
    Object.keys(labEls).forEach(function (k) { labEls[k].classList.toggle("is-open", k === id); });
    placeCard();
    scheduleHash();
  }
  function closeTerm() {
    if (!openId) return;
    openId = null;
    el.card.hidden = true;
    Object.keys(labEls).forEach(function (k) { labEls[k].classList.remove("is-open"); });
  }
  // Put the card next to its label (below it, or above when there is no room), inside the stage. On a phone it sits at the bottom.
  function placeCard() {
    if (!openId) return;
    var lab = labEls[openId], sr = stage.getBoundingClientRect(), lr = lab.getBoundingClientRect(), c = el.card, cw = c.offsetWidth, chh = c.offsetHeight;
    var x = lr.left + lr.width / 2 - sr.left - cw / 2, y = lr.bottom - sr.top + 12;
    if (view.narrow) { x = (sr.width - cw) / 2; y = sr.height - chh - 8; }
    else if (y + chh > sr.height - 8) y = lr.top - sr.top - chh - 12;
    c.style.left = clamp(x, 8, Math.max(8, sr.width - cw - 8)) + "px";
    c.style.top = clamp(y, 8, Math.max(8, sr.height - chh - 8)) + "px";
  }
  el.cardClose.addEventListener("click", function (e) { e.stopPropagation(); closeTerm(); });
  el.card.addEventListener("click", function (e) { e.stopPropagation(); });

  /* ---------- Moving along ------------------------------------------------------------- */
  function go(s, opts) {
    opts = opts || {};
    s = clamp(s, 0, LAST);
    if (opts.push) { try { history.pushState({ s: s }, "", urlOf(s)); } catch (e) { /* sandboxed */ } }
    var step = !opts.jump && s === cur + 1;
    render(s, { step: step, jump: !step && !opts.animate, push: !!opts.push, keepCard: opts.keepCard });
    if (!opts.push) scheduleHash();
  }
  function next() {
    if (cur < LAST) { go(cur + 1); return true; }
    stopPlay();
    go(0, { jump: true });
    return false;
  }
  function back() { if (cur > 0) render(cur - 1, { step: false, jump: false }), scheduleHash(); }

  var hashTimer = 0;
  function hashOf(s) {
    var step = STEPS[s], c = CH[step.ch];
    if (openId && step.map !== undefined) return "e-" + openId;
    return c.hash;
  }
  function urlOf(s) { var hs = hashOf(s); return hs ? "#" + hs : location.pathname + location.search; }
  function scheduleHash() {
    clearTimeout(hashTimer);
    hashTimer = setTimeout(function () { try { history.replaceState({ s: cur }, "", urlOf(cur)); } catch (e) { /* sandboxed */ } }, 250);
  }
  function schedulePath() { /* reserved */ }

  /* ---------- Play ------------------------------------------------------------------- */
  var playing = false, timer = 0, speed = 2;
  var SPEEDS = [1, 2, 3], SCALE = { 1: 0.45, 2: 0.8, 3: 1 };
  function applySpeed() {
    el.speed.setAttribute("data-speed", speed);
    el.speedN.textContent = speed + " s";
    el.speed.setAttribute("aria-label", "Seconds between steps: " + speed + ". Click to change.");
    root.style.setProperty("--t", playing ? SCALE[speed] : 1);
  }
  function cycleSpeed() {
    speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    store("ae-speed", String(speed));
    applySpeed();
    if (playing) schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    timer = setTimeout(function () {
      if (!playing) return;
      if (cur >= LAST) { stopPlay(); return; }
      go(cur + 1);
      schedule();
    }, speed * 1000);
  }
  function startPlay() {
    if (cur >= LAST) go(0, { jump: true });
    playing = true; el.play.setAttribute("aria-pressed", "true"); setPlayLabel(); applySpeed(); schedule();
  }
  function stopPlay() { if (!playing) return; playing = false; clearTimeout(timer); el.play.setAttribute("aria-pressed", "false"); setPlayLabel(); applySpeed(); }
  function setPlayLabel() {
    el.play.querySelector(".btn-label").textContent = playing ? "Pause" : "Play";
    el.play.querySelector(".ic-play").style.display = playing ? "none" : "";
    el.play.querySelector(".ic-pause").style.display = playing ? "" : "none";
  }

  /* ---------- Links, keys, clicks and swipes -------------------------------------------- */
  function stepOfHash(hash) {
    hash = (hash || "").replace(/^#/, "");
    var i, m;
    if (!hash || hash === "start") return { s: 0 };
    for (i = 0; i < CH.length; i++) if (CH[i].hash === hash) return { s: firstOf[i] };
    m = /^e-(.+)$/.exec(hash);
    if (m && byName[m[1]]) return { s: firstOf[10], term: m[1] };
    return null;
  }
  function openHash(hash) {
    var t = stepOfHash(hash);
    if (!t) { render(0, { jump: true }); return; }
    render(t.s, { jump: true });
    if (t.term) openTerm(t.term);
  }
  window.addEventListener("popstate", function () { stopPlay(); openHash(location.hash); });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target, tag = t && t.tagName, interactive = /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag || "") || (t && t.isContentEditable);
    var key = e.key;
    if (key === "Escape") { if (openId) closeTerm(); else stopPlay(); return; }
    if (key === "ArrowRight" || key === "PageDown" || (key === " " && !interactive) || (key === "Enter" && !interactive)) { if (tag === "INPUT") return; e.preventDefault(); stopPlay(); next(); }
    else if (key === "ArrowLeft" || key === "PageUp") { if (tag === "INPUT") return; e.preventDefault(); stopPlay(); back(); }
    else if (key === "Home" && !interactive) { e.preventDefault(); stopPlay(); go(0, { jump: true }); }
    else if (key === "End" && !interactive) { e.preventDefault(); stopPlay(); go(LAST, { jump: true }); }
    else if ((key === "p" || key === "P") && !interactive) { e.preventDefault(); playing ? stopPlay() : startPlay(); }
    else if ((key === "s" || key === "S") && !interactive) { e.preventDefault(); cycleSpeed(); }
  });
  // A click on the kitchen is "Next". A click on a name opens its card instead; a click anywhere else closes the card first.
  stage.addEventListener("click", function () {
    if (openId) { closeTerm(); return; }
    stopPlay(); next();
  });
  var swipe = null;
  stage.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") swipe = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener("pointerup", function (e) {
    if (!swipe) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 56 && Math.abs(dy) < 44) {
      var swallow = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      stage.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(function () { stage.removeEventListener("click", swallow, true); }, 0);
      stopPlay();
      if (dx < 0) next(); else back();
    }
  });
  el.next.addEventListener("click", function () { stopPlay(); next(); });
  el.back.addEventListener("click", function () { stopPlay(); back(); });
  el.play.addEventListener("click", function () { playing ? stopPlay() : startPlay(); });
  el.speed.addEventListener("click", cycleSpeed);
  el.scrub.setAttribute("max", LAST);
  el.scrub.addEventListener("input", function () { stopPlay(); go(parseInt(el.scrub.value, 10) || 0, { jump: true }); });
  // Clicks on the buttons and chips must not count as a click on the kitchen.
  [el.console, $(".chapbar")].forEach(function (e) { e.addEventListener("click", function (ev) { ev.stopPropagation(); }); });

  /* ---------- Theme -------------------------------------------------------------------- */
  var tt = $("#theme-toggle");
  if (tt) tt.addEventListener("click", function (e) {
    e.stopPropagation();
    var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    store("ae-theme", nextTheme);
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onMq = function (e) { var saved = store("ae-theme"); if (saved !== "light" && saved !== "dark") root.setAttribute("data-theme", e.matches ? "dark" : "light"); };
    if (mq.addEventListener) mq.addEventListener("change", onMq);
  }

  /* ---------- Boot ---------------------------------------------------------------------- */
  if (!STEPS.length) return;
  var saved = parseInt(store("ae-speed"), 10);
  if (SPEEDS.indexOf(saved) >= 0) speed = saved;
  build();
  buildNames();
  chips();
  applySpeed();
  setPlayLabel();
  var rzTimer = 0;
  function onResize() { clearTimeout(rzTimer); rzTimer = setTimeout(function () { stage.classList.add("is-jump"); layout(); setTimeout(function () { stage.classList.remove("is-jump"); }, 60); }, 80); }
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(stage); else window.addEventListener("resize", onResize);
  C.reader = { go: go, next: next, back: back, state: function () { return cur; }, steps: STEPS, openTerm: openTerm };
  var t0 = stepOfHash(location.hash);
  if (t0 && location.hash) openHash(location.hash); else render(0, { jump: true });
})();
