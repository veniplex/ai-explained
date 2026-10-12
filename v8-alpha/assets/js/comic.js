/* Agentic AI, Explained (v8): the reader. One long strip that grows from left to right like a storyline: a title card for each
   chapter, then its panels, then the strip with the real names. Each step (Next / arrow keys / Space / a click on the dashed
   ghost, or Play) adds the next item at the right end and the camera slides along to it. You can also scroll the strip sideways
   yourself (trackpad, wheel, drag, touch, scrollbar). State is k, the number of items shown, and p, the chapter in view.
   Chapters come from COMIC.pages (data/*.js). Plain ES5, no frameworks. */
(function () {
  "use strict";

  var C = window.COMIC;
  var PAGES = (C.pages || []).slice().sort(function (a, b) { return a.n - b.n; });
  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var root = document.documentElement;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function h(tag, attrs) {
    var e = document.createElement(tag), i;
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") e.className = v; else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") e.addEventListener(k.slice(2), v);
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
  // **bold** and `code` in data strings.
  function rich(text) {
    var f = document.createDocumentFragment(), re = /(\*\*[^*]+\*\*|`[^`]+`)/g, last = 0, m;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > last) f.appendChild(document.createTextNode(text.slice(last, m.index)));
      f.appendChild(h(m[0][0] === "*" ? "strong" : "code", null, m[0].slice(m[0][0] === "*" ? 2 : 1, m[0][0] === "*" ? -2 : -1)));
      last = m.index + m[0].length;
    }
    if (last < text.length) f.appendChild(document.createTextNode(text.slice(last)));
    return f;
  }
  function plain(text) { return String(text || "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1"); }
  function motionOk() { return !(reduced && reduced.matches); }

  /* ---------- The strip -------------------------------------------------------- */
  var reel = $("#reel"), track = $("#track"), nav = $("#pages"), dock = $("#dock"), fill = $("#rail-fill");
  var el = { back: $("#btn-back"), next: $("#btn-next"), play: $("#btn-play"), where: $("#where"), ticks: $("#ticks"), live: $("#live") };
  var BASE = "How an AI agent works · Agentic AI, Explained";
  var items = [];            // every item of the story in order: { kind: chapter | panel | names, p, i, el, panel, drawn }
  var chapterAt = [], chapterEnd = [];   // per chapter: index of its title card, and the index after its last item
  var st = { k: 0, p: 0 };   // k: how many items are shown; p: the chapter in view
  var seenTo = 0;            // the most items ever shown, for the chips
  var playing = false, timer = 0, hashTimer = 0;
  var LAST = PAGES.length - 1;

  function hashOf(p) { return PAGES[p].hash || ""; }
  function urlOf(p) { var hash = hashOf(p); return hash ? "#" + hash : location.pathname + location.search; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function underline(width) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "ul"); svg.setAttribute("viewBox", "0 0 " + width + " 12"); svg.setAttribute("preserveAspectRatio", "none"); svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M2 7Q" + (width * 0.2) + " 2 " + (width * 0.4) + " 7T" + (width * 0.8) + " 7T" + (width - 2) + " 5");
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    return svg;
  }
  // The little hand-drawn arrow in the gap before an item: the thread of the story. n wobbles it a little differently each time.
  function join(n) {
    var svg = document.createElementNS(NS, "svg"), w = n % 3, a = document.createElementNS(NS, "path"), b = document.createElementNS(NS, "path");
    svg.setAttribute("class", "join"); svg.setAttribute("viewBox", "0 0 56 28"); svg.setAttribute("aria-hidden", "true");
    a.setAttribute("d", "M3 " + (15 + w) + "Q16 " + (10 - w * 2) + " 28 " + (14 + w) + "T51 " + (13 - w));
    b.setAttribute("d", "M42 " + (6 + w) + "L52 " + (13 - w) + "L41 " + (21 - w));
    a.setAttribute("pathLength", "1"); b.setAttribute("pathLength", "1");
    svg.appendChild(a); svg.appendChild(b);
    return svg;
  }

  function chapterItem(page, p) {
    var zone = page.zone || "start", cover = p === 0, hTag = cover ? "h1" : "h2", id = "ch-title-" + p;
    var head = h(hTag, { class: "ch-title", id: id }, page.title);
    head.appendChild(underline(Math.max(120, page.title.length * 14)));
    var sec = h("section", { class: "card-ch", "data-zone": zone, "aria-labelledby": id },
      h("p", { class: "eyebrow" }, page.kicker || "Chapter " + p + " of " + (LAST - 1)),
      p > 0 && p < LAST ? h("span", { class: "ch-num", "aria-hidden": "true" }, p) : null,
      head, page.lead ? h("p", { class: "ch-lead" }, rich(page.lead)) : null);
    return { kind: "chapter", p: p, i: -1, el: h("li", { class: "cell kind-chapter" + (cover ? " is-cover" : ""), "data-ghost": cover ? "" : "Chapter " + p }, sec), drawn: true };
  }
  function panelItem(page, p, i) {
    var panel = page.panels[i], zone = page.zone || "start";
    var fig = h("figure", { class: "panel", "data-zone": panel.zone || zone },
      h("div", { class: "art" }),
      h("figcaption", { class: "cap-bar" }, h("span", { class: "num", "aria-hidden": "true" }, i + 1),
        h("span", { class: "visually-hidden" }, "Panel " + (i + 1) + ". " + plain(panel.alt || "") + " "), h("p", { class: "cap" }, rich(panel.cap))));
    return { kind: "panel", p: p, i: i, panel: panel, el: h("li", { class: "cell kind-panel size-" + (panel.size || "s"), "data-ghost": i + 1 }, fig), drawn: false };
  }
  function namesItem(page, p) {
    var zone = page.zone || "start", list = h("ul", { class: "names-list" });
    page.names.forEach(function (nm, i) {
      var chip = nm.id ? h("a", { class: "name-chip", href: "../v6-alpha/terms/" + nm.id + "/", "data-zone": nm.zone || zone, "data-entry": nm.id }) : h("div", { class: "name-chip", "data-zone": nm.zone || zone });
      chip.style.setProperty("--i", i);
      add(chip, h("span", { class: "pair" }, h("span", { class: "kw" }, nm.kw), h("span", { class: "arr", "aria-hidden": "true" }, "→"), h("strong", { class: "real" }, nm.term)));
      add(chip, h("span", { class: "def" }, nm.def));
      if (nm.id) add(chip, h("span", { class: "go" }, "More in v6 →"));
      list.appendChild(h("li", null, chip));
    });
    var sec = h("section", { class: "panel", "data-zone": zone, "aria-label": page.namesTitle || "The real names" },
      h("div", { class: "names-head" }, h("h3", null, page.namesTitle || "The real names"), h("p", null, page.namesNote || "What the pictures are called in AI, and where to read more.")), list);
    return { kind: "names", p: p, i: -1, el: h("li", { class: "cell kind-names" + (p === LAST ? " is-index" : ""), "data-ghost": "The real names" }, sec), drawn: true };
  }

  function buildAll() {
    PAGES.forEach(function (page, p) {
      chapterAt[p] = items.length;
      items.push(chapterItem(page, p));
      page.panels.forEach(function (panel, i) { items.push(panelItem(page, p, i)); });
      if (page.names) items.push(namesItem(page, p));
      chapterEnd[p] = items.length;
    });
    items.forEach(function (it, n) {
      it.n = n;
      it.el.__item = it;
      if (n) it.el.appendChild(join(n));
      it.el.addEventListener("click", function () { if (it.el.classList.contains("is-next")) { stopPlay(); next(); } });
      track.appendChild(it.el);
      if (io) io.observe(it.el);
    });
  }

  // Draw the picture, speech and frame of a panel the first time it is needed.
  function draw(it) {
    if (it.drawn) return;
    it.drawn = true;
    var panel = it.panel, art = $(".art", it.el), page = PAGES[it.p];
    var pz = { size: panel.size, zone: panel.zone || page.zone, bg: panel.bg, scene: panel.scene };
    art.appendChild(C.drawPanel(pz, it.p * 100 + it.i + 3));
    (panel.say || []).forEach(function (s, i) {
      var at = s.at || [6, 6], fromRight = /r/.test(s.from || ""), fromBottom = /b/.test(s.from || "");
      var b = h("div", { class: "bub " + (s.k || "say") + (s.tail ? " t-" + s.tail : ""), role: s.k === "sfx" ? "presentation" : null }, rich(s.t));
      b.style[fromRight ? "right" : "left"] = (fromRight ? 100 - at[0] : at[0]) + "%";
      b.style[fromBottom ? "bottom" : "top"] = (fromBottom ? 100 - at[1] : at[1]) + "%";
      if (s.w) b.style.setProperty("--mw", s.w + "%");
      b.style.setProperty("--b", i);
      art.appendChild(b);
    });
    framePanel(it);
    var fig = $(".panel", it.el);
    fig.__item = it;
    if (ro) ro.observe(fig);
  }
  function framePanel(it) {
    var fig = $(".panel", it.el), w = Math.round(fig.offsetWidth), hh = Math.round(fig.offsetHeight);
    if (!w || !hh) return;
    var old = $(".frame", fig);
    var fr = C.drawFrame(w, hh, it.i + 11);
    if (old) fig.replaceChild(fr, old); else fig.appendChild(fr);
  }
  // Panels change size when the window does or the fonts arrive: redraw their frame at the new size.
  var rzTimer = 0, reframe = [];
  var ro = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (en) { var c = en.target.__item; if (c && reframe.indexOf(c) < 0) reframe.push(c); });
    clearTimeout(rzTimer);
    rzTimer = setTimeout(function () { var list = reframe; reframe = []; list.forEach(function (c) { if (c.el.classList.contains("is-on")) framePanel(c); }); }, 120);
  }) : null;
  // Panels that are shown but far away are drawn when they come near the screen (a jump to a later chapter shows the ones before it, undrawn).
  var io = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var it = en.target.__item;
      if (en.isIntersecting && it && it.kind === "panel" && it.el.classList.contains("is-on")) draw(it);
    });
  }, { root: reel, rootMargin: "0px 900px 0px 900px" }) : null;

  /* ---------- Chips and the rail ------------------------------------------------- */
  function chips() {
    PAGES.forEach(function (pg, i) {
      var a = h("a", { class: "pg", href: "#" + (pg.hash || "start"), "data-p": i, title: pg.title,
        "aria-label": (i === 0 ? "Start: " : i === LAST ? "End: " : "Chapter " + i + ": ") + pg.title }, i === 0 ? "Start" : i === LAST ? "End" : String(i));
      a.addEventListener("click", function (e) { e.preventDefault(); stopPlay(); open(i, "card", { push: true }); });
      nav.appendChild(a);
    });
  }
  function markChips() {
    var cur = null;
    Array.prototype.forEach.call(nav.children, function (a, i) {
      var seen = chapterAt[i] < seenTo, here = i === st.p;
      a.classList.toggle("is-seen", seen && !here);
      if (here) { a.setAttribute("aria-current", "true"); cur = a; } else a.removeAttribute("aria-current");
    });
    if (cur && nav.scrollTo) nav.scrollTo({ left: cur.offsetLeft - nav.clientWidth / 2 + cur.offsetWidth / 2, behavior: "auto" });
  }
  function clearChildren(e) { while (e.firstChild) e.removeChild(e.firstChild); }

  /* ---------- The camera ---------------------------------------------------------- */
  function gutter() { return parseFloat(getComputedStyle(root).getPropertyValue("--gutter")) || 16; }
  // Slide the strip so that item n sits in the middle of the window (or at the left edge, if it is wider than the window).
  function look(n, smooth) {
    var e = items[n].el, rw = reel.clientWidth, w = e.offsetWidth, left;
    if (w > rw - 2 * gutter()) left = e.offsetLeft - gutter();
    else left = e.offsetLeft - (rw - w) / 2;
    left = clamp(left, 0, Math.max(0, reel.scrollWidth - rw));
    reel.scrollTo({ left: left, behavior: smooth && motionOk() ? "smooth" : "auto" });
  }
  // Which chapter is in the middle of the window? Keeps the chips, the title and the address in step with what you see.
  var ticking = false;
  function viewing() {
    var mid = reel.scrollLeft + reel.clientWidth / 2, best = 0, bd = Infinity, n;
    for (n = 0; n < st.k; n++) {
      var e = items[n].el, d = Math.abs(e.offsetLeft + e.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = n; }
    }
    setView(items[best].p);
  }
  function setView(p) {
    if (p === st.p) return;
    st.p = p;
    document.title = (p === 0 ? "" : PAGES[p].title + " · ") + BASE;
    markChips();
    clearTimeout(hashTimer);
    hashTimer = setTimeout(function () { try { history.replaceState({ p: p }, "", urlOf(p)); } catch (e) { /* sandboxed */ } }, 250);
  }
  reel.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; viewing(); }); } }, { passive: true });

  /* ---------- Showing ------------------------------------------------------------- */
  // Show the first k items. opts.animate: the newest one is new (it inks in); opts.look: slide to item n (default: the newest).
  function show(k, opts) {
    opts = opts || {};
    k = clamp(k, 1, items.length);
    var prev = st.k;
    st.k = k;
    seenTo = Math.max(seenTo, k);
    items.forEach(function (it, n) {
      var c = it.el.classList, on = n < k;
      c.toggle("is-next", n === k);
      c.toggle("is-off", n > k);
      if (on && !c.contains("is-on")) {
        c.add("is-on");
        c.toggle("is-new", !!opts.animate && n === k - 1 && motionOk());
        if (it.kind === "panel" && (n === k - 1 || !io)) draw(it);
      } else if (!on && c.contains("is-on")) {
        c.remove("is-on", "is-new");
      }
    });
    controls();
    var n = typeof opts.look === "number" ? opts.look : k - 1;
    if (opts.look !== false) look(n, !!opts.smooth);
    if (opts.animate && k > prev) announceItem(items[k - 1]);
    viewing();
    markChips();
  }
  function announceItem(it) {
    var page = PAGES[it.p], t;
    if (it.kind === "chapter") t = (it.p === 0 ? "" : it.p === LAST ? "The end. " : "Chapter " + it.p + ": ") + page.title + ". " + plain(page.lead || "");
    else if (it.kind === "panel") t = "Panel " + (it.i + 1) + " of " + page.panels.length + ". " + plain(it.panel.cap);
    else t = page.namesTitle || "The real names";
    announceText(t);
  }
  function announceText(t) { el.live.textContent = ""; setTimeout(function () { el.live.textContent = t; }, 30); }

  function controls() {
    var k = st.k, atEnd = k >= items.length, cur = items[k - 1], p = cur.p, nx = items[k];
    var total = chapterEnd[p] - chapterAt[p] - 1, done = clamp(k - chapterAt[p] - 1, 0, total);
    el.back.disabled = k <= 1;
    var label = atEnd ? "Start again" : nx.kind === "chapter" ? "Next chapter" : nx.kind === "names" ? "The real names" : "Next panel";
    el.next.querySelector(".btn-label").textContent = label;
    el.next.setAttribute("aria-label", !atEnd && nx.kind === "chapter" ? "Next chapter: " + PAGES[nx.p].title : label);
    el.where.firstChild.textContent = (p === 0 ? "Start" : p === LAST ? "End" : "Chapter " + p) + " · " + done + "/" + total;
    clearChildren(el.ticks);
    for (var i = 0; i < total; i++) el.ticks.appendChild(h("i", { class: i < done ? "on" : "" }));
    fill.style.width = (k / items.length * 100).toFixed(1) + "%";
  }

  function next() {
    if (st.k < items.length) { show(st.k + 1, { animate: true, smooth: true }); return true; }
    stopPlay();
    show(1, { animate: true, smooth: true });
    return false;
  }
  function back() {
    if (st.k > 1) show(st.k - 1, { smooth: true });
  }
  // Go to chapter p. mode "card": at least its title card, so the story continues from there; "chapter": all of it.
  function open(p, mode, opts) {
    opts = opts || {};
    var need = mode === "chapter" ? chapterEnd[p] : chapterAt[p] + 1;
    if (opts.push) { try { history.pushState({ p: p }, "", urlOf(p)); } catch (e) { /* sandboxed */ } }
    var grow = need > st.k;
    show(Math.max(st.k, need), { look: chapterAt[p], smooth: !opts.instant, animate: grow && mode === "card" });
    if (opts.entry) {
      var chip = reel.querySelector('[data-entry="' + opts.entry + '"]');
      if (chip) { chip.classList.add("is-hit"); setTimeout(function () { chip.scrollIntoView({ inline: "center", block: "nearest", behavior: motionOk() ? "smooth" : "auto" }); }, 60); }
    }
  }

  /* ---------- Play -------------------------------------------------------------- */
  function dwell() {
    var it = items[st.k - 1], n = 0;
    if (it.kind === "panel") { n += plain(it.panel.cap).length; (it.panel.say || []).forEach(function (s) { n += plain(s.t).length; }); }
    else if (it.kind === "chapter") n = plain(PAGES[it.p].lead || "").length;
    else n = 220;
    return Math.min(11000, 2600 + n * 55);
  }
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    timer = setTimeout(function () {
      if (!playing) return;
      if (st.k >= items.length) { stopPlay(); return; }
      next(); schedule();
    }, dwell());
  }
  function startPlay() {
    if (st.k >= items.length) show(1, { animate: true, smooth: false });
    playing = true; el.play.setAttribute("aria-pressed", "true"); setPlayLabel(); schedule();
  }
  function stopPlay() { playing = false; clearTimeout(timer); el.play.setAttribute("aria-pressed", "false"); setPlayLabel(); }
  function setPlayLabel() {
    el.play.querySelector(".btn-label").textContent = playing ? "Pause" : "Play";
    el.play.querySelector(".ic-play").style.display = playing ? "none" : "";
    el.play.querySelector(".ic-pause").style.display = playing ? "" : "none";
  }

  /* ---------- Hash, keys, wheel, drag ---------------------------------------------- */
  function pageOfHash(hash) {
    hash = (hash || "").replace(/^#/, "");
    var i, m;
    if (!hash || hash === "start") return { p: 0 };
    if (hash === "map" || hash === "ch-e") return { p: LAST };
    for (i = 0; i < PAGES.length; i++) if (PAGES[i].hash === hash) return { p: i };
    m = /^e-(.+)$/.exec(hash);
    if (m) {
      for (i = 0; i < PAGES.length; i++) {
        var names = PAGES[i].names || [], j;
        for (j = 0; j < names.length; j++) if (names[j].id === m[1]) return { p: i, entry: m[1] };
      }
    }
    return null;
  }
  function openHash(hash) {
    var t = pageOfHash(hash);
    if (!t) { show(1, { animate: true }); return; }
    if (t.p === 0 && !t.entry) { show(Math.max(st.k, 1), { look: 0, smooth: false }); return; }
    open(t.p, "chapter", { entry: t.entry, instant: true });
    if (t.entry) look(chapterEnd[t.p] - 1, false);
  }
  window.addEventListener("popstate", function () { stopPlay(); openHash(location.hash); });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target, tag = t && t.tagName, interactive = /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag || "") || (t && t.isContentEditable);
    var key = e.key;
    if (key === "Escape") { if (playing) { stopPlay(); } return; }
    if (key === "ArrowRight" || key === "PageDown" || (key === " " && !interactive) || (key === "Enter" && !interactive)) { e.preventDefault(); stopPlay(); next(); }
    else if (key === "ArrowLeft" || key === "PageUp") { if (tag === "INPUT" || tag === "SELECT") return; e.preventDefault(); stopPlay(); back(); }
    else if (key === "Home" && !interactive) { e.preventDefault(); stopPlay(); look(0, true); }
    else if (key === "End" && !interactive) { e.preventDefault(); stopPlay(); show(items.length, { smooth: true }); }
    else if ((key === "p" || key === "P") && !interactive) { e.preventDefault(); playing ? stopPlay() : startPlay(); }
  });
  // The wheel scrolls the strip sideways, unless the page itself needs to scroll up and down.
  reel.addEventListener("wheel", function (e) {
    if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY) || reel.scrollWidth <= reel.clientWidth) return;
    var d = document.documentElement;
    if (d.scrollHeight - d.clientHeight > 4) return;
    e.preventDefault();
    reel.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 32 : 1);
  }, { passive: false });
  // A mouse can grab the strip and pull it. A touch scrolls it natively.
  var drag = null;
  reel.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, left: reel.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; reel.classList.add("is-drag"); stopPlay(); if (window.getSelection) window.getSelection().removeAllRanges(); }
    if (drag.moved) reel.scrollLeft = drag.left - dx;
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.moved) {
      var swallow = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      reel.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(function () { reel.removeEventListener("click", swallow, true); }, 0);
    }
    drag = null; reel.classList.remove("is-drag");
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  el.next.addEventListener("click", function () { stopPlay(); next(); });
  el.back.addEventListener("click", function () { stopPlay(); back(); });
  el.play.addEventListener("click", function () { playing ? stopPlay() : startPlay(); });

  /* ---------- Theme -------------------------------------------------------------- */
  var tt = $("#theme-toggle");
  if (tt) tt.addEventListener("click", function () {
    var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    store("ae-theme", nextTheme);
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onMq = function (e) { var saved = store("ae-theme"); if (saved !== "light" && saved !== "dark") root.setAttribute("data-theme", e.matches ? "dark" : "light"); };
    if (mq.addEventListener) mq.addEventListener("change", onMq);
  }

  /* ---------- Boot ---------------------------------------------------------------- */
  if (!PAGES.length) return;
  buildAll();
  chips();
  C.reader = { show: show, next: next, back: back, open: open, state: st, items: items, pages: PAGES };
  if (location.hash && pageOfHash(location.hash)) openHash(location.hash);
  else show(1, { animate: true });
  setPlayLabel();
})();
