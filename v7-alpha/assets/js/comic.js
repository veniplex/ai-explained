/* Agentic AI, Explained (v7): the reader. One page of the comic at a time; the panels of a page arrive one by one as you
   step (Next / Back, arrow keys, Space, a swipe, or a click on the next ghost), or by themselves with Play.
   State is a page (p) and the number of steps shown on it (k): the panels, then the strip with the real names.
   Pages come from COMIC.pages (data/*.js). Plain ES5, no frameworks. */
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

  /* ---------- Pages ------------------------------------------------------------ */
  var stage = $("#page-host"), nav = $("#pages"), dock = $("#dock");
  var el = { back: $("#btn-back"), next: $("#btn-next"), play: $("#btn-play"), where: $("#where"), ticks: $("#ticks"), live: $("#live") };
  var built = {};            // page index -> { root, cells, steps }
  var seen = {};
  var st = { p: 0, k: 0 };
  var playing = false, timer = 0;

  function stepsOf(page) { return page.panels.length + (page.names ? 1 : 0); }
  function hashOf(p) { return PAGES[p].hash || ""; }

  function underline(width) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "ul"); svg.setAttribute("viewBox", "0 0 " + width + " 12"); svg.setAttribute("preserveAspectRatio", "none"); svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M2 7Q" + (width * 0.2) + " 2 " + (width * 0.4) + " 7T" + (width * 0.8) + " 7T" + (width - 2) + " 5");
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    return svg;
  }

  function buildPage(p) {
    if (built[p]) return built[p];
    var page = PAGES[p], zone = page.zone || "start";
    var grid = h("div", { class: "grid" }), cells = [];
    page.panels.forEach(function (panel, i) {
      var size = panel.size || "s";
      var cell = h("div", { class: "cell size-" + size, "data-n": i + 1 });
      var cap = h("p", { class: "cap" }, rich(panel.cap));
      var fig = h("figure", { class: "panel", "data-zone": panel.zone || zone },
        h("div", { class: "art" }),
        h("figcaption", { class: "cap-bar" }, h("span", { class: "num", "aria-hidden": "true" }, i + 1), h("span", { class: "visually-hidden" }, "Panel " + (i + 1) + ". " + plain(panel.alt || "") + " "), cap)
      );
      cell.appendChild(fig);
      cell.addEventListener("click", function () { if (cell.classList.contains("is-next")) next(); });
      grid.appendChild(cell);
      cells.push({ el: cell, panel: panel, drawn: false, idx: i });
    });
    if (page.names) {
      var n = page.panels.length;
      var list = h("ul", { class: "names-list" });
      page.names.forEach(function (nm, i) {
        var chip = (nm.id ? h("a", { class: "name-chip", href: "../v6-alpha/terms/" + nm.id + "/", "data-zone": nm.zone || zone, "data-entry": nm.id }) : h("div", { class: "name-chip", "data-zone": nm.zone || zone }));
        chip.style.setProperty("--i", i);
        add(chip, h("span", { class: "pair" }, h("span", { class: "kw" }, nm.kw), h("span", { class: "arr", "aria-hidden": "true" }, "→"), h("strong", { class: "real" }, nm.term)));
        add(chip, h("span", { class: "def" }, nm.def));
        if (nm.id) add(chip, h("span", { class: "go" }, "More in v6 →"));
        list.appendChild(h("li", null, chip));
      });
      var ncell = h("div", { class: "cell names", "data-n": n + 1 }, h("section", { class: "panel", "data-zone": zone, "aria-label": page.namesTitle || "The real names" },
        h("div", { class: "names-head" }, h("h2", null, page.namesTitle || "The real names"), h("p", null, page.namesNote || "What the pictures are called in AI, and where to read more.")),
        list));
      grid.appendChild(ncell);
      cells.push({ el: ncell, drawn: true, idx: n, names: true });
    }
    var title = h("h1", { class: "page-title", id: "page-title", tabindex: "-1" }, page.title);
    var head = h("header", { class: "page-head" },
      h("p", { class: "eyebrow" }, page.kicker || (p === 0 ? "" : "Page " + p + " of " + (PAGES.length - 2))),
      title, page.lead ? h("p", { class: "page-lead" }, rich(page.lead)) : null);
    var sec = h("section", { class: "page", "aria-labelledby": "page-title", "data-page": p }, head, grid);
    built[p] = { root: sec, cells: cells, grid: grid, title: title };
    return built[p];
  }

  // Draw the picture, speech and frame of a panel the first time it is reached.
  function draw(cell, p) {
    if (cell.drawn) return;
    cell.drawn = true;
    var panel = cell.panel, art = $(".art", cell.el), page = PAGES[p];
    var pz = { size: panel.size, zone: panel.zone || page.zone, bg: panel.bg, scene: panel.scene };
    art.appendChild(C.drawPanel(pz, p * 100 + cell.idx + 3));
    (panel.say || []).forEach(function (s, i) {
      var at = s.at || [6, 6], fromRight = /r/.test(s.from || ""), fromBottom = /b/.test(s.from || "");
      var b = h("div", { class: "bub " + (s.k || "say") + (s.tail ? " t-" + s.tail : ""), role: s.k === "sfx" ? "presentation" : null }, rich(s.t));
      b.style[fromRight ? "right" : "left"] = (fromRight ? 100 - at[0] : at[0]) + "%";
      b.style[fromBottom ? "bottom" : "top"] = (fromBottom ? 100 - at[1] : at[1]) + "%";
      if (s.w) b.style.setProperty("--mw", s.w + "%");
      b.style.setProperty("--b", i);
      art.appendChild(b);
    });
    framePanel(cell);
    var fig = $(".panel", cell.el);
    fig.__cell = cell;
    if (ro) ro.observe(fig);
  }
  function framePanel(cell) {
    var fig = $(".panel", cell.el), w = Math.round(fig.offsetWidth), hh = Math.round(fig.offsetHeight);
    if (!w || !hh) return;
    var old = $(".frame", fig);
    var fr = C.drawFrame(w, hh, cell.idx + 11);
    if (old) fig.replaceChild(fr, old); else fig.appendChild(fr);
  }
  // Panels change height when the text wraps differently (resize, fonts loaded): redraw their frame at the new size.
  var rzTimer = 0, reframe = [];
  var ro = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (en) { var c = en.target.__cell; if (c && reframe.indexOf(c) < 0) reframe.push(c); });
    clearTimeout(rzTimer);
    rzTimer = setTimeout(function () { var list = reframe; reframe = []; list.forEach(function (c) { if (c.el.classList.contains("is-on")) framePanel(c); }); }, 120);
  }) : null;

  /* ---------- Showing ----------------------------------------------------------- */
  function chips() {
    clearChildren(nav);
    PAGES.forEach(function (pg, i) {
      var a = h("a", { class: "pg" + (seen[i] ? " is-seen" : ""), href: "#" + (pg.hash || "start"), "data-p": i, title: pg.title, "aria-label": (i === 0 ? "Start: " : i === PAGES.length - 1 ? "End: " : "Page " + i + ": ") + pg.title,
        "aria-current": i === st.p ? "page" : null }, i === 0 ? "Start" : i === PAGES.length - 1 ? "End" : String(i));
      a.addEventListener("click", function (e) { e.preventDefault(); stopPlay(); go(i, 0, { push: true, fresh: true }); });
      nav.appendChild(a);
    });
    var cur = $('[aria-current="page"]', nav);
    if (cur && nav.scrollTo) { var left = cur.offsetLeft - nav.clientWidth / 2 + cur.offsetWidth / 2; nav.scrollTo({ left: left, behavior: "auto" }); }
  }
  function clearChildren(e) { while (e.firstChild) e.removeChild(e.firstChild); }

  function scrollTo(y) {
    window.scrollTo({ top: y, behavior: motionOk() ? "smooth" : "auto" });
  }
  function keepInView(c) {
    var r = c.el.getBoundingClientRect(), bar = (($(".bar") || {}).offsetHeight || 0) + (nav.offsetHeight || 0) + 10, dockH = (dock.offsetHeight || 0) + 34;
    var top = bar, bottom = window.innerHeight - dockH;
    if (r.height > bottom - top) { if (Math.abs(r.top - top) > 8) scrollTo(window.pageYOffset + r.top - top); }
    else if (r.bottom > bottom) scrollTo(window.pageYOffset + r.bottom - bottom + 6);
    else if (r.top < top) scrollTo(window.pageYOffset + r.top - top);
  }

  // Show page p with k steps. opts.fresh: arrive as if turning to a new page; opts.push: add a history entry; opts.animate: the last step is new.
  function go(p, k, opts) {
    opts = opts || {};
    p = Math.max(0, Math.min(PAGES.length - 1, p));
    var b = buildPage(p), total = stepsOf(PAGES[p]);
    if (k === -1) k = total;
    k = Math.max(0, Math.min(total, k));
    var changed = st.p !== p || !stage.firstChild;
    if (changed) {
      clearChildren(stage);
      stage.appendChild(b.root);
      st.p = p;
      b.cells.forEach(function (c) { c.el.classList.remove("is-on", "is-new", "is-next", "is-gone"); });
      if (opts.fresh !== false) window.scrollTo({ top: 0, behavior: "auto" });
      document.title = (p === 0 ? "" : PAGES[p].title + " · ") + "How an AI agent works · Agentic AI, Explained";
      var hash = hashOf(p);
      if (opts.push) history.pushState({ p: p }, "", hash ? "#" + hash : location.pathname + location.search);
      else if (opts.replace) history.replaceState({ p: p }, "", hash ? "#" + hash : location.pathname + location.search);
    }
    var prev = changed ? 0 : st.k;
    st.k = k;
    seen[p] = true;
    b.cells.forEach(function (c, i) {
      var on = i < k;
      c.el.classList.toggle("is-next", i === k);
      if (on && !c.el.classList.contains("is-on")) {
        c.el.classList.add("is-on");
        var fresh = !!opts.animate && i === k - 1 && motionOk();
        c.el.classList.toggle("is-new", fresh);
        if (!c.names) draw(c, p);
        else c.el.classList.add("is-new-names");
      } else if (!on && c.el.classList.contains("is-on")) {
        c.el.classList.remove("is-on", "is-new");
      }
    });
    chips();
    controls();
    if (opts.animate && k > prev && k > 0) {
      var cur = b.cells[k - 1];
      keepInView(cur);
      if (cur.panel) announce(k, cur.panel, changed ? (p === 0 ? "" : "Page " + p + ": ") + PAGES[p].title + ". " : "");
      else announceText(PAGES[p].namesTitle || "The real names");
    }
    if (changed && opts.focus !== false) { /* keep focus where it is: the controls */ }
    return b;
  }

  function announce(k, panel, lead) {
    announceText((lead || "") + "Panel " + k + " of " + PAGES[st.p].panels.length + ". " + plain(panel.cap));
  }
  function announceText(t) { el.live.textContent = ""; setTimeout(function () { el.live.textContent = t; }, 30); }

  function controls() {
    var page = PAGES[st.p], total = stepsOf(page), last = st.p === PAGES.length - 1, atEnd = st.k >= total;
    el.back.disabled = st.p === 0 && st.k <= 1;
    var label = !atEnd ? "Next panel" : last ? "Start again" : "Next page";
    el.next.querySelector(".btn-label").textContent = label;
    el.next.setAttribute("aria-label", atEnd && !last ? "Next page: " + PAGES[st.p + 1].title : label);
    var where = (st.p === 0 ? "Start" : last ? "End" : "Page " + st.p) + " · " + Math.min(st.k, total) + "/" + total;
    el.where.firstChild.textContent = where;
    clearChildren(el.ticks);
    for (var i = 0; i < total; i++) el.ticks.appendChild(h("i", { class: i < st.k ? "on" : "" }));
  }

  function next() {
    var page = PAGES[st.p], total = stepsOf(page);
    if (st.k < total) { go(st.p, st.k + 1, { animate: true }); return true; }
    if (st.p < PAGES.length - 1) { go(st.p + 1, 1, { push: true, animate: true, fresh: true }); return true; }
    stopPlay();
    go(0, 1, { push: true, animate: true });
    return false;
  }
  function back() {
    if (st.k > 1) go(st.p, st.k - 1, {});
    else if (st.p > 0) { var q = st.p - 1; go(q, -1, { push: true, fresh: true }); }
  }

  /* ---------- Play -------------------------------------------------------------- */
  function dwell() {
    var page = PAGES[st.p], c = page.panels[st.k - 1], n = 0;
    if (c) { n += plain(c.cap).length; (c.say || []).forEach(function (s) { n += plain(s.t).length; }); }
    else n = 220;
    return Math.min(11000, 2600 + n * 55);
  }
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    timer = setTimeout(function () {
      if (!playing) return;
      var last = st.p === PAGES.length - 1 && st.k >= stepsOf(PAGES[st.p]);
      if (last) { stopPlay(); return; }
      next(); schedule();
    }, dwell());
  }
  function startPlay() {
    var last = st.p === PAGES.length - 1 && st.k >= stepsOf(PAGES[st.p]);
    if (last) go(0, 1, { push: true, animate: true, fresh: true });
    playing = true; el.play.setAttribute("aria-pressed", "true"); setPlayLabel(); schedule();
  }
  function stopPlay() { playing = false; clearTimeout(timer); el.play.setAttribute("aria-pressed", "false"); setPlayLabel(); }
  function setPlayLabel() {
    el.play.querySelector(".btn-label").textContent = playing ? "Pause" : "Play";
    el.play.querySelector(".ic-play").style.display = playing ? "none" : "";
    el.play.querySelector(".ic-pause").style.display = playing ? "" : "none";
  }

  /* ---------- Hash, keys, touch -------------------------------------------------- */
  function pageOfHash(hash) {
    hash = (hash || "").replace(/^#/, "");
    var i, m;
    if (!hash || hash === "start") return { p: 0 };
    if (hash === "map" || hash === "ch-e") return { p: PAGES.length - 1 };
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
  function openHash(hash, replace) {
    var t = pageOfHash(hash);
    if (!t) { go(0, 1, { replace: true, fresh: true }); return; }
    var b = go(t.p, -1, { replace: replace, fresh: true });
    if (t.entry) {
      var chip = b.root.querySelector('[data-entry="' + t.entry + '"]');
      if (chip) { chip.classList.add("is-hit"); setTimeout(function () { chip.scrollIntoView({ block: "center", behavior: motionOk() ? "smooth" : "auto" }); }, 60); }
    }
  }
  window.addEventListener("popstate", function () { stopPlay(); openHash(location.hash, false); });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target, tag = t && t.tagName, interactive = /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag || "") || (t && t.isContentEditable);
    var key = e.key;
    if (key === "Escape") { if (playing) { stopPlay(); } return; }
    if (key === "ArrowRight" || key === "PageDown" || (key === " " && !interactive) || (key === "Enter" && !interactive)) { e.preventDefault(); stopPlay(); next(); }
    else if (key === "ArrowLeft" || key === "PageUp") { if (tag === "INPUT" || tag === "SELECT") return; e.preventDefault(); stopPlay(); back(); }
    else if (key === "Home" && !interactive) { e.preventDefault(); stopPlay(); go(0, 1, { push: true, fresh: true }); }
    else if (key === "End" && !interactive) { e.preventDefault(); stopPlay(); go(PAGES.length - 1, -1, { push: true, fresh: true }); }
    else if ((key === "p" || key === "P") && !interactive) { e.preventDefault(); playing ? stopPlay() : startPlay(); }
  });
  var tx = 0, ty = 0, tid = null;
  stage.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") { tx = e.clientX; ty = e.clientY; tid = e.pointerId; } });
  stage.addEventListener("pointerup", function (e) {
    if (e.pointerId !== tid) return;
    tid = null;
    var dx = e.clientX - tx, dy = e.clientY - ty;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 45) { stopPlay(); if (dx < 0) next(); else back(); }
  });

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
  C.reader = { go: go, next: next, back: back, state: st, pages: PAGES };
  var first = pageOfHash(location.hash);
  if (location.hash && first) openHash(location.hash, true);
  else go(0, 1, { replace: true, animate: true, fresh: false });
  setPlayLabel();
})();
