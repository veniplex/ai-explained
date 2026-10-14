/* AI explained: the reader of the kitchen story (story/; the start page offers it next to the deep dive). One room, one screen. The kitchen is a list of things (data/kitchen.js) and the story is a list
   of steps (data/story.js); each step shows or hides things, sends someone walking, and says one line. Next, the arrow keys, Space, a
   click on the kitchen, a swipe, the scrubber, a chapter chip or Play move along the steps. Play goes on by itself, 1, 2 or 3 seconds
   per step. The last steps lay the real names (data/names.js) over the faded kitchen. State is only the number of the step: what the
   kitchen looks like at step n is worked out from steps 0 to n, so any step can be opened directly. Every real name and every bold
   bridge in a caption leads to its glossary page (../glossary/<id>/). Plain ES5, no frameworks. */
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
  // A caption: **bold** words are the real names. Where there is a page for one (data/bridges.js), the word is a link to it, with a hover card (popover.js).
  var BRIDGES = Object.create(null);
  Object.keys(C.bridges || {}).forEach(function (k) { BRIDGES[k] = C.bridges[k]; });
  function caption(text) {
    var f = document.createDocumentFragment(), re = /\*\*([^*]+)\*\*/g, last = 0, m, id;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > last) f.appendChild(document.createTextNode(text.slice(last, m.index)));
      id = BRIDGES[m[1].toLowerCase()];
      f.appendChild(id
        ? h("a", { class: "bridge", href: "../glossary/" + id + "/", "data-entry": id }, h("strong", null, m[1]))
        : h("strong", null, m[1]));
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
    card: $("#defcard"), cardKw: $("#def-kw"), cardTerm: $("#def-term"), cardText: $("#def-text"), cardMore: $("#def-more"), cardChapter: $("#def-chapter"), cardClose: $("#def-close"), console: $("#console")
  };
  var BASE = "How an AI agent works · AI explained";

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
  var labEls = Object.create(null), haloEls = Object.create(null);
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
      var lab = h("button", { class: "lab", type: "button", "data-zone": nm.zone, "data-ch": nm.ch, "data-id": nm.id, "aria-label": nm.term, "aria-haspopup": "dialog", "aria-expanded": "false" },
        h("span", { class: "lab-n", "aria-hidden": "true" }, i + 1), h("span", { class: "lab-t" }, nm.short || nm.term));
      lab.style.left = nm.lab[0] + "px";
      lab.style.top = nm.lab[1] + "px";
      lab.style.setProperty("--ld", (0.1 + i * 0.09) + "s");
      // A click (or Enter) pins the card open; one that comes while the card is only there because the pointer rests on the label pins it instead of closing it.
      lab.addEventListener("click", function (e) {
        e.stopPropagation(); stopPlay();
        if (openId === nm.id && !pinned) { pinned = true; scheduleHash(); return; }
        pinned = true;
        toggleTerm(nm.id, e.detail === 0);
      });
      // With a mouse, resting on a label is enough: it comes into focus (the others step back) and its card opens, and both go when the pointer leaves
      // the label and the card. A touch screen has no hover: a tap opens the card as before.
      lab.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hoverIn(nm.id); });
      lab.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hoverOut(); });
      labs.appendChild(lab);
      labEls[nm.id] = lab;
    });
  }

  /* ---------- Camera ------------------------------------------------------------ */
  var VH = K.h - K.y0, MID = [K.w / 2, K.y0 + VH / 2];
  var view = { W: 0, H: 0, u: 1, narrow: false }, camTarget = MID, mapFocus = null, chefAt = null;
  // The part of the kitchen that the real names of one chapter cover (their outlines and labels), or null when they are spread over the whole kitchen
  // (or are the whole kitchen, like the harness): a small screen zooms in on it.
  var focusBoxes = Object.create(null);
  function focusOf(ch) {
    if (focusBoxes[ch] !== undefined) return focusBoxes[ch];
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
    NAMES.forEach(function (nm) {
      if (nm.ch !== ch) return;
      (nm.boxes || [nm.box]).forEach(function (b) {
        if (b[2] > K.w * 0.6) return;
        x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[0] + b[2]); y1 = Math.max(y1, b[1] + b[3]); n++;
      });
      x0 = Math.min(x0, nm.lab[0] - 70); x1 = Math.max(x1, nm.lab[0] + 70); y0 = Math.min(y0, nm.lab[1] - 30); y1 = Math.max(y1, nm.lab[1] + 30);
    });
    focusBoxes[ch] = n && x1 - x0 < K.w * 0.6 ? [x0, y0, x1, y1] : null;
    return focusBoxes[ch];
  }
  // Where the middle of a view of this size must lie so that the span [lo, hi] is inside it (as little moved from c as possible).
  function keepIn(c, lo, hi, span) { return hi - lo >= span ? (lo + hi) / 2 : clamp(c, hi - span / 2, lo + span / 2); }
  function layout() {
    // A little air at both sides, so the room does not touch the edges of the window.
    var r = stage.getBoundingClientRect(), W = r.width, H = r.height, fit = Math.min(W / (K.w + 72), H / VH);
    view.W = W; view.H = H;
    view.narrow = W < 960;
    stage.classList.toggle("is-narrow", view.narrow);
    stage.classList.toggle("is-short", H < 300);
    var isMap = stage.classList.contains("is-map"), zoom = false, fx = null, cx, cy;
    // Big screens see the whole kitchen. On a small one the camera comes closer and follows the chef (but for the real names it shows the whole kitchen, or the part of one chapter).
    var u = fit, tgt = camTarget;
    if (fit < 0.62) {
      if (!isMap) u = clamp(Math.min(H / VH, 0.8), fit, 0.8);
      else if (typeof mapFocus === "number" && (fx = focusOf(mapFocus))) {
        var uz = Math.min(W / (fx[2] - fx[0] + 120), H / (fx[3] - fx[1] + 120), 0.62);
        if (uz > fit * 1.25) { u = uz; zoom = true; tgt = [(fx[0] + fx[2]) / 2, (fx[1] + fx[3]) / 2]; }
      }
    }
    view.u = u;
    stage.classList.toggle("is-zoom", zoom);
    hworld.style.setProperty("--bfs", Math.max(16, (view.narrow ? 14 : 12) / u).toFixed(1) + "px");
    hworld.style.setProperty("--lfs", Math.max(15, (zoom ? 14 : view.narrow ? 12 : 12.5) / u).toFixed(1) + "px");
    // Speech is never narrower than about 130 screen pixels, however far the camera is: the text stays readable.
    hworld.style.setProperty("--bmin", view.narrow ? (130 / u).toFixed(0) + "px" : "0px");
    var vw = W / u, vh = H / u;
    cx = vw >= K.w ? K.w / 2 : clamp(tgt[0], vw / 2, K.w - vw / 2);
    cy = vh >= VH ? MID[1] : clamp(tgt[1], K.y0 + vh / 2, K.h - vh / 2);
    // On a small screen the speech and the chef must be in view, whatever the step says about the camera.
    if (!isMap && (vw < K.w || vh < VH)) {
      var bl = 1e9, bt = 1e9, br = -1e9, bb = -1e9, m = 14 / u, any = false;
      Array.prototype.forEach.call(bubs.children, function (b) {
        var l = parseFloat(b.style.left) || 0, t = parseFloat(b.style.top) || 0;
        bl = Math.min(bl, l - m); br = Math.max(br, l + b.offsetWidth + m); bt = Math.min(bt, t - 20 - m); bb = Math.max(bb, t + b.offsetHeight + 20 + m); any = true;
      });
      var cl = 1e9, ct = 1e9, cr = -1e9, cb = -1e9, chef = !!chefAt;
      if (chef) { cl = chefAt[0] - 60; cr = chefAt[0] + 60; ct = chefAt[1] - 180; cb = chefAt[1] + 30; }
      if (any || chef) {
        var ul = Math.min(bl, cl), ur = Math.max(br, cr), ut = Math.min(bt, ct), ub = Math.max(bb, cb);
        if (any && ur - ul > vw) { ul = bl; ur = br; }
        if (any && ub - ut > vh) { ut = bt; ub = bb; }
        if (vw < K.w) cx = clamp(keepIn(cx, ul, ur, vw), vw / 2, K.w - vw / 2);
        if (vh < VH) cy = clamp(keepIn(cy, ut, ub, vh), K.y0 + vh / 2, K.h - vh / 2);
      }
    }
    var tf = "translate(" + (W / 2 - cx * u).toFixed(1) + "px," + (H / 2 - cy * u).toFixed(1) + "px) scale(" + u.toFixed(4) + ")";
    world.style.transform = tf;
    hworld.style.transform = tf;
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
    mapFocus = typeof step.map === "number" ? step.map : null;
    chefAt = st.on.chef ? st.pos.chef : null;

    // Which real names are in front.
    Object.keys(labEls).forEach(function (id) {
      var nm = byName[id], dim = st.map !== null && st.map !== "all" && nm.ch !== st.map;
      labEls[id].classList.toggle("dim", dim);
      (haloEls[id] || []).forEach(function (g) { g.classList.toggle("dim", dim); });
    });
    if (!opts.keepCard) closeTerm({ quiet: true });

    speech(step, jump);
    layout();
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
  function chapterLabel(ch) { return ch === 0 ? "Start" : ch === 9 ? "The end" : ch === 10 ? "Technical" : "Chapter " + ch; }
  function words(s, step, prev) {
    var ch = CH[step.ch], first = s === 0 || STEPS[s - 1].ch !== step.ch;
    el.chno.textContent = chapterLabel(step.ch);
    el.chname.textContent = ch.title;
    el.stepn.textContent = (s + 1) + " / " + STEPS.length;
    el.cap.textContent = "";
    if (first && s > 0) el.cap.appendChild(h("span", { class: "visually-hidden" }, chapterLabel(step.ch) + ": " + ch.title + ". "));
    el.cap.appendChild(step.map === undefined ? caption(step.cap) : rich(step.cap));
    (step.say || []).forEach(function (sa) { el.cap.appendChild(h("span", { class: "visually-hidden" }, " Someone says: " + String(sa.t).replace(/\*\*/g, "") + ".")); });
    if (s === 0 && !touched) el.cap.appendChild(h("span", { class: "cap-hint" }, " Press Next (or the right arrow key) to build it. The whole walk takes about five minutes."));
    // The names chapter ends in the deep dive: every one of them has a glossary page.
    if (step.map !== undefined) {
      el.cap.appendChild(document.createTextNode(" "));
      el.cap.appendChild(h("a", { class: "cap-more", href: diveOf(step.map === "all" ? 10 : step.map === 8 ? 8 : step.map) },
        step.map === "all" ? "Every name has a page in the glossary" : "Chapter " + step.map + " in the deep dive", " →"));
    }
    el.cap.classList.remove("is-new");
    if (prev !== s && prev >= 0 && motionOk()) { void el.cap.offsetWidth; el.cap.classList.add("is-new"); }
    [el.console, el.banner].forEach(function (e) { e.setAttribute("data-zone", ch.zone); });
    el.bannerN.textContent = step.ch > 0 && step.ch < 9 ? step.ch : "";
    el.bannerT.textContent = ch.title;
    el.banner.classList.toggle("is-on", first);
    document.title = (step.ch === 0 ? "" : ch.title + " · ") + BASE;
  }
  // Where the technical deep dive tells the same thing: its chapters are numbered like ours, the end and the names lead to its map.
  function diveOf(ch) { return "../technical/" + (ch === 0 ? "" : ch === 8 ? "#ch-e" : ch >= 9 ? "#map" : "#ch-" + ch); }
  var firstOf = [];
  STEPS.forEach(function (st, i) { if (firstOf[st.ch] === undefined) firstOf[st.ch] = i; });
  var nav = $("#pages");
  // One chip per chapter, and after each chip a row of small dots, one per step of that chapter. Only the row of the chapter you are in is open (it makes room
  // with a short animation); a dot goes to its step.
  var dotRows = [];
  function plain(s) { return String(s || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim(); }
  function chips() {
    CH.forEach(function (c, i) {
      var a = h("a", { class: "pg" + (i === 10 ? " is-map" : ""), href: "#" + (c.hash || "start"), "data-ch": i, title: c.title,
        "aria-label": (i === 0 ? "Start: " : i === 9 ? "End: " : i === 10 ? "Technical: " : "Chapter " + i + ": ") + c.title }, c.short);
      a.addEventListener("click", function (e) { e.preventDefault(); stopPlay(); go(firstOf[i], { push: true }); });
      nav.appendChild(a);
      var n = 0, row = h("span", { class: "pg-steps", role: "group", "aria-label": c.title + ": steps" });
      STEPS.forEach(function (st, k) {
        if (st.ch !== i) return;
        n++;
        var d = h("button", { class: "pgs", type: "button", "data-step": k, title: plain(st.cap).slice(0, 90) + (plain(st.cap).length > 90 ? "…" : ""),
          "aria-label": (i === 0 ? "Start" : i === 9 ? "End" : i === 10 ? "Technical" : "Chapter " + i) + ", step " + n + " of " + STEPS.filter(function (x) { return x.ch === i; }).length });
        d.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); stopPlay(); touched = true; go(k); });
        row.appendChild(d);
      });
      row.style.setProperty("--n", n);
      nav.appendChild(row);
      dotRows[i] = row;
    });
  }
  var seenTo = 0, touched = false, centreTimer = 0;
  // Keep the chapter you are in, and the row of its steps, in the middle of a chip row that scrolls (a phone). The row opens with a short animation, so it is
  // done again when that has run.
  function centreChip() {
    var here = nav.querySelector(".pg[aria-current]");
    if (!here || !nav.scrollTo) return;
    var row = dotRows[+here.getAttribute("data-ch")], w = here.offsetWidth + (row ? row.scrollWidth : 0);
    nav.scrollTo({ left: here.offsetLeft + w / 2 - nav.clientWidth / 2, behavior: "auto" });
  }
  function chrome(s) {
    seenTo = Math.max(seenTo, s);
    var ch = STEPS[s].ch;
    Array.prototype.forEach.call(nav.querySelectorAll(".pg"), function (a, i) {
      var here = i === ch, seen = firstOf[i] < seenTo;
      a.classList.toggle("is-seen", seen && !here);
      if (here) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    dotRows.forEach(function (row, i) {
      row.classList.toggle("is-open", i === ch);
      Array.prototype.forEach.call(row.children, function (d) {
        var k = +d.getAttribute("data-step");
        d.classList.toggle("is-seen", k <= seenTo && k !== s);
        if (k === s) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current");
      });
    });
    centreChip();
    clearTimeout(centreTimer);
    if (motionOk()) centreTimer = setTimeout(centreChip, 360);
    el.back.setAttribute("aria-disabled", s <= 0 ? "true" : "false");
    el.next.querySelector(".btn-label").textContent = s >= LAST ? "Deep dive" : "Next";
    el.next.setAttribute("aria-label", s >= LAST ? "Open the technical deep dive" : "Next step");
    el.next.classList.toggle("is-hint", s === 0 && !touched);
    setPlayLabel();
    el.scrub.value = s;
    el.scrub.style.setProperty("--p", (s / LAST * 100).toFixed(1) + "%");
    el.scrub.setAttribute("aria-valuetext", "Step " + (s + 1) + " of " + STEPS.length + ", " + CH[STEPS[s].ch].title);
  }

  /* ---------- The real names: the card with the explanation ---------------------------- */
  var byName = Object.create(null), openId = null, pinned = false, hovering = false, hoverTimer = 0, leaveTimer = 0;
  NAMES.forEach(function (nm) { byName[nm.id] = nm; });
  // Hover: a short rest on a label opens its card (so a pointer passing over several labels opens none); after the pointer has left the label and the card,
  // the card closes unless it was pinned by a click.
  // The names come in one after another with a delay of their own; a term coming into focus (or going out of it) must not wait for that delay.
  var quickTimer = 0;
  function quick() { stage.classList.add("is-quick"); clearTimeout(quickTimer); quickTimer = setTimeout(function () { stage.classList.remove("is-quick"); }, 450); }
  function hoverIn(id) {
    hovering = true;
    clearTimeout(leaveTimer);
    clearTimeout(hoverTimer);
    if (!stage.classList.contains("is-map") || openId === id) return;
    hoverTimer = setTimeout(function () { if (hovering && openId !== id) openTerm(id, { hover: true }); }, 110);
  }
  function hoverOut() {
    hovering = false;
    clearTimeout(hoverTimer);
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function () { if (!hovering && !pinned && openId) closeTerm(); }, 280);
  }
  function toggleTerm(id, byKey) { if (openId === id) closeTerm(); else openTerm(id, { focus: byKey }); }
  function openTerm(id, opts) {
    var nm = byName[id];
    if (!nm) return;
    openId = id;
    if (!(opts && opts.hover)) clearTimeout(leaveTimer);
    else pinned = false;
    el.card.setAttribute("data-zone", nm.zone);
    el.cardKw.textContent = nm.kw ? "In the kitchen: " + nm.kw : "";
    el.cardTerm.textContent = nm.term;
    el.cardText.textContent = nm.def;
    el.cardMore.setAttribute("href", "../glossary/" + nm.id + "/");
    el.cardChapter.setAttribute("href", diveOf(nm.ch));
    el.cardChapter.textContent = "Chapter " + nm.ch + " in the deep dive";
    el.card.hidden = false;
    Object.keys(labEls).forEach(function (k) {
      labEls[k].classList.toggle("is-open", k === id); labEls[k].setAttribute("aria-expanded", k === id ? "true" : "false");
      (haloEls[k] || []).forEach(function (g) { g.classList.toggle("is-open", k === id); });
    });
    stage.classList.add("has-open");
    quick();
    document.title = nm.term + " · The real names · " + BASE;
    placeCard();
    if (!(opts && opts.hover)) scheduleHash();
    if (opts && opts.focus) el.cardTerm.focus();
  }
  // A card that had the keyboard focus hands it back to its label, so the next Tab goes on from there.
  function closeTerm(opts) {
    if (!openId) return;
    var id = openId, hadFocus = el.card.contains(document.activeElement);
    openId = null;
    pinned = false;
    el.card.hidden = true;
    stage.classList.remove("has-open");
    quick();
    Object.keys(labEls).forEach(function (k) { labEls[k].classList.remove("is-open"); labEls[k].setAttribute("aria-expanded", "false"); (haloEls[k] || []).forEach(function (g) { g.classList.remove("is-open"); }); });
    if (cur >= 0) document.title = (STEPS[cur].ch === 0 ? "" : CH[STEPS[cur].ch].title + " · ") + BASE;
    if (hadFocus) (stage.classList.contains("is-map") ? labEls[id] : el.next).focus();
    if (!opts || !opts.quiet) scheduleHash();
  }
  // Put the card next to its label (below it, or above when there is no room), inside the stage. On a phone it sits at the bottom.
  function placeCard() {
    if (!openId) return;
    var lab = labEls[openId], sr = stage.getBoundingClientRect(), lr = lab.getBoundingClientRect(), c = el.card, cw = c.offsetWidth, chh = c.offsetHeight;
    var x = lr.left + lr.width / 2 - sr.left - cw / 2, y = lr.bottom - sr.top + 12;
    // On a phone the card sits at the bottom, or at the top when its label is in the lower half, so that the label stays in sight.
    if (view.narrow) { x = (sr.width - cw) / 2; y = lr.top + lr.height / 2 - sr.top > sr.height / 2 ? 8 : sr.height - chh - 8; }
    else if (y + chh > sr.height - 8) y = lr.top - sr.top - chh - 12;
    c.style.left = clamp(x, 8, Math.max(8, sr.width - cw - 8)) + "px";
    c.style.top = clamp(y, 8, Math.max(8, sr.height - chh - 8)) + "px";
  }
  el.cardClose.addEventListener("click", function (e) { e.stopPropagation(); closeTerm(); });
  el.card.addEventListener("click", function (e) { e.stopPropagation(); });
  el.card.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hovering = true; clearTimeout(leaveTimer); } });
  el.card.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hoverOut(); });

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
    touched = true;
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
    el.speed.setAttribute("aria-label", "Speed: " + speed + (speed === 1 ? " second" : " seconds") + " per step. Press to change.");
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
    playing = true; setPlayLabel(); applySpeed(); schedule();
  }
  function stopPlay() { if (!playing) return; playing = false; clearTimeout(timer); setPlayLabel(); applySpeed(); }
  function setPlayLabel() {
    var label = playing ? "Pause" : cur >= LAST ? "Replay" : "Play";
    el.play.querySelector(".btn-label").textContent = label;
    el.play.setAttribute("aria-label", label + " the story");
    el.play.classList.toggle("is-on", playing);
    el.play.querySelector(".ic-play").style.display = playing ? "none" : "";
    el.play.querySelector(".ic-pause").style.display = playing ? "" : "none";
  }

  /* ---------- Links, keys, clicks and swipes -------------------------------------------- */
  var GUIDES = ["about", "build", "compare", "context", "evaluate", "glossary", "how-it-works", "learn", "secure"];
  function stepOfHash(hash) {
    hash = (hash || "").replace(/^#/, "");
    var i, m;
    if (!hash || hash === "start") return { s: 0 };
    for (i = 0; i < CH.length; i++) if (CH[i].hash === hash) return { s: firstOf[i] };
    m = /^e-(.+)$/.exec(hash);
    if (m && byName[m[1]]) return { s: firstOf[10], term: m[1] };
    m = /^guide-(.+)$/.exec(hash);
    if (m && GUIDES.indexOf(m[1]) >= 0) return { s: 0, guide: m[1] };
    return null;
  }
  function openHash(hash) {
    var t = stepOfHash(hash);
    if (!t) { render(0, { jump: true }); return; }
    if (t.guide) { location.replace("../" + (t.guide === "glossary" ? "glossary/" : t.guide === "about" ? "about/" : "guides/" + t.guide + "/")); return; }
    render(t.s, { jump: true });
    if (t.term) openTerm(t.term);
  }
  window.addEventListener("popstate", function () { if (!stepOfHash(location.hash.replace(/^#/, ""))) return; stopPlay(); openHash(location.hash); });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target, tag = t && t.tagName, interactive = /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag || "") || (t && t.isContentEditable);
    var key = e.key;
    if (t && t.closest && t.closest(".vs, .defcard") && key !== "Escape") return;
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
  stage.addEventListener("pointercancel", function () { swipe = null; });
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
  el.next.addEventListener("click", function () { touched = true; stopPlay(); if (cur >= LAST) location.href = diveOf(STEPS[cur].ch); else next(); });
  el.back.addEventListener("click", function () { touched = true; stopPlay(); back(); });
  el.play.addEventListener("click", function () { playing ? stopPlay() : startPlay(); });
  el.speed.addEventListener("click", cycleSpeed);
  el.scrub.setAttribute("max", LAST);
  el.scrub.addEventListener("input", function () { stopPlay(); go(parseInt(el.scrub.value, 10) || 0, { jump: true }); });
  // Clicks on the buttons and chips must not count as a click on the kitchen.
  [el.console, $(".chapbar")].forEach(function (e) { e.addEventListener("click", function (ev) { ev.stopPropagation(); }); });

  /* ---------- Boot ---------------------------------------------------------------------- */
  if (!STEPS.length) return;
  var saved = parseInt(store("ae-speed"), 10);
  if (SPEEDS.indexOf(saved) >= 0) speed = saved;
  build();
  buildNames();
  chips();
  applySpeed();
  setPlayLabel();
  // On a small screen the words under the kitchen keep the height of the longest caption (on a phone on its side, of most of them), so the picture does not change size from step to step.
  var tight = window.matchMedia ? window.matchMedia("(max-width: 900px)") : null;
  function reserveCaption() {
    if (!tight || !tight.matches) { root.style.removeProperty("--cap-h"); return; }
    var probe = h("p", { class: "cap", "aria-hidden": "true" }), tops = [], w = el.cap.offsetWidth, top;
    if (!w) return;
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;min-height:0;width:" + w + "px";
    el.cap.parentNode.appendChild(probe);
    STEPS.forEach(function (st) {
      probe.textContent = "";
      probe.appendChild(rich(st.cap));
      if (st.map !== undefined) probe.appendChild(document.createTextNode(" Chapter 8 in the deep dive →"));
      tops.push(probe.offsetHeight);
    });
    // On a phone on its side the picture is short already: the longest captions may push it a little rather than every step.
    tops.sort(function (p, q) { return p - q; });
    top = tops[window.innerHeight <= 520 ? Math.floor(tops.length * 0.75) : tops.length - 1];
    el.cap.parentNode.removeChild(probe);
    root.style.setProperty("--cap-h", top + "px");
  }
  var rzTimer = 0;
  function onResize() { clearTimeout(rzTimer); rzTimer = setTimeout(function () { reserveCaption(); stage.classList.add("is-jump"); layout(); setTimeout(function () { stage.classList.remove("is-jump"); }, 60); }, 80); }
  reserveCaption();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { reserveCaption(); layout(); });
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(stage); else window.addEventListener("resize", onResize);
  C.reader = { go: go, next: next, back: back, state: function () { return cur; }, steps: STEPS, openTerm: openTerm };
  var t0 = stepOfHash(location.hash);
  if (t0 && location.hash) openHash(location.hash); else render(0, { jump: true });
})();
