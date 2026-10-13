/* AI explained: the search. The top bar holds a field-like button in the middle; it opens a window that floats over the page (a modal dialog, full screen on a
   phone) with the field and the hits. It searches all of the site: the glossary (every term has its own page), the chapters of the deep dive, the guides and the
   chapters of the kitchen story. The index (data/search-index.js, written by scripts/build-pages.js from the content files) is loaded the first time the window
   opens, so no page pays for it before. Keys: / and Ctrl or Cmd + K open it, Enter opens the first hit, the arrow keys choose, Esc closes. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var body = document.body, wrap = document.getElementById("search");
  if (!wrap) return;
  var input = document.getElementById("site-search"), list = document.getElementById("search-results"), status = document.getElementById("search-status"), openBtn = document.getElementById("search-open"),
    modal = document.getElementById("search-modal"), hint = document.getElementById("search-hint"), closeBtn = document.getElementById("search-close");
  if (!input || !list || !modal || !openBtn) return;
  // The window sits directly in the body, so no part of the bar (its stacking, its sticky position) can hold it back.
  document.body.appendChild(modal);
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
  var kbd = openBtn.querySelector("kbd");
  if (kbd) kbd.textContent = mac ? "⌘K" : "Ctrl K";
  var BASE = body.getAttribute("data-base") || "";

  function norm(x) { return String(x || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, ""); }
  // The ends of words (-ing, -ed, -es, -s, -e) are dropped on both sides, so "prompt cache" finds "prompt caching".
  function stem(x) { return norm(x).replace(/[a-z0-9]+/g, function (w) { return w.length > 4 ? w.replace(/(ing|ed|es|s|e)$/, "") : w; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  /* ---------- The index ---------------------------------------------------------------- */
  var docs = null, failed = false, loading = false, waiting = false;
  function prepare() {
    docs = (window.AE_SEARCH && window.AE_SEARCH.docs) || [];
    docs.forEach(function (d) {
      var f = fields(d);
      d._s = { head: stem(f.head.join(" ")), body: stem(f.body || ""), title: stem(f.title + " " + (d.l || "") + " " + (d.a || "")), label: stem(d.l || "") };
    });
  }
  function load() {
    if (docs || loading) return;
    if (window.AE_SEARCH) { prepare(); return; }
    loading = true;
    var s = document.createElement("script");
    s.src = BASE + "assets/js/data/search-index.js";
    s.onload = function () { loading = false; prepare(); if (waiting) run(); };
    s.onerror = function () { loading = false; failed = true; if (waiting) run(); };
    document.head.appendChild(s);
  }

  // What a document says: words to find it by (head), the rest of its text (body), its title and its one line.
  function fields(d) {
    switch (d.k) {
      case "ref": return { head: [d.id, d.n, d.l, d.a, d.tl], body: d.tb, title: d.n, line: d.tl };
      case "chapter": return { head: [d.tt], body: d.tb, title: (d.c === 8 ? "Epilogue" : "Chapter " + d.c) + " · " + d.tt, line: d.tl };
      case "guide": return { head: [d.t, d.h], body: d.tb, title: d.t, line: d.h };
      default: return { head: [d.t], body: d.b, title: d.lbl, line: d.l };
    }
  }
  var HEAD_SCORE = { chapter: 1.4, guide: 1.4, story: 1.3 }, BODY_SCORE = { ref: 0.5, chapter: 0.4, guide: 0.4, story: 0.35 };

  function score(d, terms) {
    var s = d._s, full = s.head + " " + s.body;
    if (terms.every(function (t) { return s.head.indexOf(t) !== -1; })) {
      if (d.k !== "ref") return HEAD_SCORE[d.k];
      return terms.reduce(function (a, t) { return a + (s.title.indexOf(t) !== -1 ? 2 : 1) + (s.label.indexOf(t) === 0 ? 2 : 0); }, 0);
    }
    if (BODY_SCORE[d.k] && terms.every(function (t) { return full.indexOf(t) !== -1; })) return BODY_SCORE[d.k];
    return 0;
  }

  // The page a document leads to.
  function target(d) {
    if (d.k === "ref") return BASE + "glossary/" + d.id + "/";
    if (d.k === "guide") return BASE + (d.id === "about" ? "about/" : "guides/" + d.id + "/");
    if (d.k === "chapter") return BASE + "technical/#" + (d.c === 8 ? "ch-e" : "ch-" + d.c);
    return BASE + "story/" + (d.id ? "#" + d.id : "");
  }
  function kindOf(d) { return d.k === "ref" ? "glossary" : d.k === "chapter" ? "deep dive" : d.k === "guide" ? (d.id === "about" ? "about" : "guide") : "kitchen story"; }

  function find(q) {
    var terms = stem(q).trim().split(/\s+/).filter(Boolean), hits = [];
    if (!terms.length || !docs) return hits;
    docs.forEach(function (d) {
      var sc = score(d, terms);
      if (!sc) return;
      var f = fields(d);
      hits.push({ d: d, score: sc, title: f.title, line: f.line, href: target(d), zone: d.z || "start", entry: d.k === "ref" ? (d.m ? d.id : d.e || "") : "" });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits;
  }

  /* ---------- The list ----------------------------------------------------------------- */
  var hits = [], isOpen = false, lastFocus = null;
  function render() {
    while (list.firstChild) list.removeChild(list.firstChild);
    var q = input.value.trim();
    if (hint) hint.hidden = !!q;
    if (!q) { list.hidden = true; status.textContent = ""; return; }
    if (failed) list.appendChild(el("li", "sr-empty", "The search could not load. The glossary and the guides in the menu list everything."));
    else if (!docs) list.appendChild(el("li", "sr-empty", "Searching…"));
    else if (!hits.length) list.appendChild(el("li", "sr-empty", "Nothing matches. The glossary in the menu lists every term."));
    hits.slice(0, 8).forEach(function (hit, i) {
      var a = el("a", i === 0 ? "is-first" : "");
      a.href = hit.href;
      a.setAttribute("data-zone", hit.zone);
      a.setAttribute("data-nopop", "");
      a.appendChild(el("i", "zdot"));
      a.lastChild.setAttribute("aria-hidden", "true");
      var b = el("b", "", hit.title);
      b.appendChild(el("em", "sr-kind", " · " + kindOf(hit.d)));
      a.appendChild(b);
      if (hit.line) a.appendChild(el("span", "", hit.line.length > 150 ? hit.line.slice(0, 147).replace(/\s+\S*$/, "") + "…" : hit.line));
      list.appendChild(el("li")).appendChild(a);
    });
    list.hidden = false;
    var shown = Math.min(hits.length, 8);
    status.textContent = failed ? "The search could not load." : !docs ? "Searching." : !hits.length ? "Nothing matches." :
      shown + (shown === 1 ? " match" : " matches") + (hits.length > shown ? " shown, " + (hits.length - shown) + " more" : "") + ". Press Enter to open the first, or the down arrow to choose.";
  }
  // The deep dive's map marks the terms that match while the window is open (app.js listens).
  function announce(on) {
    var ids = on ? hits.filter(function (x) { return x.entry; }).map(function (x) { return x.entry; }) : [];
    try { document.dispatchEvent(new CustomEvent("ae:search", { detail: { ids: ids, on: on } })); } catch (e) { /* old browser */ }
  }
  function run() {
    waiting = false;
    var on = !!input.value.trim();
    if (on && !docs && !failed) { waiting = true; load(); }
    hits = on ? find(input.value) : [];
    announce(on && !!docs);
    render();
  }

  /* ---------- The window --------------------------------------------------------------- */
  function open() {
    if (isOpen) { input.focus(); input.select(); return; }
    isOpen = true;
    lastFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : openBtn;
    modal.hidden = false;
    document.documentElement.classList.add("sm-open");
    openBtn.setAttribute("aria-expanded", "true");
    load();
    if (input.value.trim()) run(); else render();
    input.focus();
    input.select();
  }
  function close(restore) {
    if (!isOpen) return;
    isOpen = false;
    modal.hidden = true;
    document.documentElement.classList.remove("sm-open");
    openBtn.setAttribute("aria-expanded", "false");
    announce(false);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", function () { close(); });
  modal.querySelector(".sm-backdrop").addEventListener("click", function () { close(); });
  input.addEventListener("input", run);
  // Some browsers do not focus a link on mousedown, so a click on a hit would first take the focus away from the field.
  list.addEventListener("mousedown", function (e) { e.preventDefault(); });
  // A hit that leads to the page you are on (only the # changes) leaves the window open otherwise.
  list.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a") && !e.defaultPrevented) close(false); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      var first = list.querySelector("a");
      if (first) { first.focus(); e.preventDefault(); }
    } else if (e.key === "Enter") {
      if (hits[0]) { var href = hits[0].href; close(false); location.href = href; }
      e.preventDefault();
    }
  });
  list.addEventListener("keydown", function (e) {
    var items = Array.prototype.slice.call(list.querySelectorAll("a")), k = items.indexOf(document.activeElement);
    if (k === -1) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      var n = k + (e.key === "ArrowDown" ? 1 : -1);
      if (n < 0) input.focus(); else if (items[n]) items[n].focus();
      e.preventDefault();
    }
  });
  // Tab stays inside the window while it is open. No other key leaves it: the kitchen story steps on the arrow keys and Space, and must not while you search.
  modal.addEventListener("keydown", function (e) {
    e.stopPropagation();
    if (e.key !== "Tab") return;
    var items = Array.prototype.slice.call(modal.querySelectorAll("input, button, a[href]")).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
    if (!items.length) return;
    var firstEl = items[0], lastEl = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) { close(); e.preventDefault(); e.stopPropagation(); return; }
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "k" || e.key === "K")) { e.preventDefault(); open(); return; }
    var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (typing || e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    open();
  }, true);
})();
