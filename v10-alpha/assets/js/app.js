/* Agentic AI, Explained (v10): interaction (from v4). Search, the guides menu, theme, keyboard and in-page moves, then boot.
   Three kinds of page share this script: the start page of the deep dive (dive/index.html), one term (terms/<id>/) and one
   guide (guides/<id>/). <body data-page="home|entry|guide"> says which. Content: window.AE3. Drawing: sketch.js and map.js.
   The guided path: story.js. Terms and guides: pages.js. The words come in two voices (kitchen or technical,
   voice.js); a change of voice draws the page again and keeps the reader at the same place. */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  if (!V3 || !V3.sk || !V3.voice || !V3.story || !V3.guides || !V3.pages || !D) return;
  var sk = V3.sk, voice = V3.voice, h = sk.h, $ = sk.$, $$ = sk.$$, clear = sk.clear, rich = sk.rich, url = sk.url;
  var body = document.body, page = body.getAttribute("data-page") || "home", pageId = body.getAttribute("data-id") || "";

  /* ---------- Indexes ---------------------------------------------------------- */
  var ENTRIES = D.entries, ORDER = [], CHAP = {};
  D.chapters.forEach(function (c) { CHAP[c.id] = c; c.entries.forEach(function (id) { ORDER.push(id); }); });
  function hasEntry(id) { return Object.prototype.hasOwnProperty.call(ENTRIES, id); }
  function chapterOf(id) { return CHAP[ENTRIES[id].chapter]; }
  function guideMeta(id) { return D.guideList.filter(function (g) { return g.id === id; })[0]; }

  /* ---------- Old deep links ------------------------------------------------------ */
  // Before terms and guides had pages of their own, #e-<id> and #guide-<id> opened a drawer on the guided path.
  function forwardOldLink() {
    var m = (location.hash || "").match(/^#(e|guide)-([a-z0-9-]+)$/);
    if (!m) return false;
    if (m[1] === "e" && hasEntry(m[2])) { location.replace(url.entry(m[2])); return true; }
    if (m[1] === "guide" && guideMeta(m[2])) { location.replace(url.guide(m[2])); return true; }
    return false;
  }

  /* ---------- Guides menu --------------------------------------------------------- */
  var menu = $("#menu"), menuBtn = $("#menu-btn");
  function renderMenu() {
    var box = h("div", { class: "menu-group" }, h("h2", { class: "eyebrow" }, "Guides"));
    D.guideList.forEach(function (g) {
      box.appendChild(h("a", { class: "menu-item", href: url.guide(g.id), "aria-current": page === "guide" && pageId === g.id ? "page" : null },
        h("b", null, g.menu), h("span", null, g.hint)));
    });
    menu.appendChild(box);
  }
  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    var first = $(".menu-item", menu);
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(focusBtn) {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    if (focusBtn) menuBtn.focus({ preventScroll: true });
  }

  /* ---------- Moving around the page ----------------------------------------------- */
  // On the guided path this scrolls; on any other page it goes there. It leaves the address bar alone, so the back
  // button never jumps between chapters (the dots on the left update the address without adding a history entry).
  function goTo(id, keepAddress) {
    var el = document.getElementById(id);
    if (!el) { if (page !== "home") location.href = url.home(id); return; }
    closeMenu();
    el.scrollIntoView({ behavior: sk.reduced() ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
    if (keepAddress) { try { history.replaceState(history.state, "", "#" + id); } catch (e) { /* the address stays as it is */ } }
  }
  function scrollToHash() {
    var id = "";
    try { id = decodeURIComponent((location.hash || "").slice(1)); } catch (err) { id = ""; }
    // The story calls the last chapter ch-8; here its heading is ch-e.
    if (id === "ch-8") id = "ch-e";
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ block: "start" });
  }

  /* ---------- Search: entries, merged v1 terms and glossary terms ------------------ */
  var sWrap = $("#search"), sInput = $("#block-search"), sList = $("#search-results"), sHits = [];
  function haystack(id) {
    var e = ENTRIES[id], src = D.sources[id] || {};
    return sk.norm([id, e.name, e.label, (e.aka || []).join(" "), (src.aka || []).join(" "),
      (e.deeper.includes || []).map(function (x) { return x.name; }).join(" "), e.short, voice.entry(id).line].join(" "));
  }
  function find(q) {
    q = sk.norm(q).trim();
    if (!q) return [];
    var terms = q.split(/\s+/), hits = [];
    ORDER.forEach(function (id) {
      var e = ENTRIES[id], hs = haystack(id);
      if (!terms.every(function (t) { return hs.indexOf(t) !== -1; })) return;
      var title = sk.norm(e.label + " " + e.name + " " + (e.aka || []).join(" ") + " " + ((D.sources[id] || {}).aka || []).join(" "));
      var score = terms.reduce(function (a, t) { return a + (title.indexOf(t) !== -1 ? 2 : 1) + (sk.norm(e.label).indexOf(t) === 0 ? 2 : 0); }, 0);
      hits.push({ kind: "entry", id: id, score: score });
    });
    // One row per entry: a glossary term is listed only when no row for its entry exists yet.
    var seen = {};
    hits.forEach(function (x) { seen[x.id] = true; });
    (D.guides.glossary || []).forEach(function (g) {
      var name = sk.norm(g.term);
      if (!g.entry || !hasEntry(g.entry) || seen[g.entry] === true || !terms.every(function (t) { return name.indexOf(t) !== -1; })) return;
      seen[g.entry] = true;
      hits.push({ kind: "term", id: g.entry, term: g, score: 1.5 });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits;
  }
  function renderResults() {
    clear(sList);
    var q = sInput.value.trim(), status = $("#search-status");
    if (!q) { sList.hidden = true; status.textContent = ""; return; }
    if (!sHits.length) sList.appendChild(h("li", { class: "sr-empty" }, "Nothing matches. Try the glossary in Guides."));
    sHits.slice(0, 8).forEach(function (hit, i) {
      var e = ENTRIES[hit.id];
      sList.appendChild(h("li", null, h("a", { href: url.entry(hit.id), "data-entry": hit.id, "data-zone": chapterOf(hit.id).zone, class: i === 0 ? "is-first" : null },
        h("i", { class: "zdot", "aria-hidden": "true" }),
        hit.kind === "term" ? h("b", null, hit.term.term, h("em", { class: "sr-kind" }, " · in " + e.label)) : h("b", null, e.name),
        h("span", null, rich(hit.kind === "term" ? voice.glossary(hit.term) : voice.entry(hit.id).line)))));
    });
    sList.hidden = false;
    var shown = Math.min(sHits.length, 8);
    status.textContent = !sHits.length ? "Nothing matches." : shown + (shown === 1 ? " match" : " matches") + (sHits.length > shown ? " shown, " + (sHits.length - shown) + " more" : "") + ". Press Enter to open the first, or the down arrow to choose.";
  }
  function applySearch() {
    sHits = find(sInput.value);
    var ids = sHits.map(function (x) { return x.id; }), on = !!sInput.value.trim();
    $$(".kmap").forEach(function (m) { m.classList.toggle("is-search", on); });
    $$(".kmap .blk").forEach(function (b) { b.classList.toggle("is-match", ids.indexOf(b.getAttribute("data-entry")) !== -1); });
    renderResults();
  }
  function clearSearch() {
    sInput.value = "";
    sHits = [];
    $$(".kmap.is-search").forEach(function (m) { m.classList.remove("is-search"); });
    $$(".kmap .blk.is-match").forEach(function (b) { b.classList.remove("is-match"); });
    renderResults();
  }
  // The magnifier button (narrow screens) shows and hides the field; aria-expanded follows.
  function setSearchOpen(open) {
    sWrap.classList.toggle("is-open", open);
    $("#search-open").setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeSearchUI() { setSearchOpen(false); sList.hidden = true; }
  function initSearch() {
    setSearchOpen(false);
    sInput.addEventListener("input", applySearch);
    // Some browsers (Safari, Firefox on macOS) do not focus a link on mousedown, so the field's focusout would hide
    // the list before the click lands. Keeping the mousedown from moving focus lets the click through.
    sList.addEventListener("mousedown", function (e) { e.preventDefault(); });
    sInput.addEventListener("focus", function () { if (sInput.value.trim()) renderResults(); });
    sInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        var first = $("a", sList);
        if (first) { first.focus(); e.preventDefault(); }
      } else if (e.key === "Enter") {
        var hit = sHits[0];
        if (hit) location.href = url.entry(hit.id);
        e.preventDefault();
      } else if (e.key === "Escape") {
        clearSearch(); closeSearchUI(); sInput.blur();
        e.stopPropagation();
      }
    });
    sList.addEventListener("keydown", function (e) {
      var items = $$("a", sList), k = items.indexOf(document.activeElement);
      if (k === -1) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        var n = k + (e.key === "ArrowDown" ? 1 : -1);
        if (n < 0) sInput.focus(); else if (items[n]) items[n].focus();
        e.preventDefault();
      } else if (e.key === "Escape") { sInput.focus(); e.stopPropagation(); e.preventDefault(); }
    });
    sWrap.addEventListener("focusout", function (e) {
      if (e.relatedTarget && sWrap.contains(e.relatedTarget)) return;
      setTimeout(function () { if (!sWrap.contains(document.activeElement)) sList.hidden = true; }, 0);
    });
    $("#search-open").addEventListener("click", function () {
      var open = !sWrap.classList.contains("is-open");
      setSearchOpen(open);
      if (open) sInput.focus(); else clearSearch();
    });
    document.addEventListener("pointerdown", function (e) {
      if (!sWrap.contains(e.target)) { sList.hidden = true; if (!sInput.value) setSearchOpen(false); }
    });
  }

  /* ---------- Theme ------------------------------------------------------------------ */
  // The <head> script always sets data-theme, so the stylesheet needs no media query.
  function initTheme() {
    var root = document.documentElement;
    $("#theme-toggle").addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      sk.store("ae-theme", nextTheme);
    });
    // Without a saved choice, follow the system setting when it changes.
    var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
      var saved = sk.store("ae-theme");
      if (saved !== "light" && saved !== "dark") root.setAttribute("data-theme", e.matches ? "dark" : "light");
    });
  }

  /* ---------- Events ------------------------------------------------------------------ */
  function initEvents() {
    document.addEventListener("click", function (e) {
      var t = e.target, el;
      if (!(t instanceof Element)) return;
      if ((el = t.closest("[data-go]"))) {
        if (el.tagName === "A") e.preventDefault();
        goTo(el.getAttribute("data-go"), el.classList.contains("rail-item"));
        return;
      }
      if ((el = t.closest("[data-mode-set]"))) { sk.mode.set(el.getAttribute("data-mode-set")); return; }
      if ((el = t.closest("[data-ch-go]"))) { var n = +el.getAttribute("data-ch-go"); goTo(n === 8 ? "ch-e" : "ch-" + n); return; }
      if (!menu.hidden && !menu.contains(t) && !menuBtn.contains(t)) closeMenu();
    });
    menuBtn.addEventListener("click", function (e) { e.stopPropagation(); if (menu.hidden) openMenu(); else closeMenu(); });
    document.addEventListener("keydown", function (e) {
      var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        if (!menu.hidden) closeMenu(true);
        return;
      }
      if (typing) return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (getComputedStyle($(".search-field", sWrap)).display === "none") setSearchOpen(true);
        sInput.focus();
      }
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = $$(".menu-item", menu), k = items.indexOf(document.activeElement);
      items[(k + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
      e.preventDefault();
    });
    // Typing a new #chapter into the address bar, or following a link to one, scrolls there.
    window.addEventListener("hashchange", function () { if (page === "home") scrollToHash(); });
  }

  /* ---------- The voice ----------------------------------------------------------- */
  function drawPage() {
    var main = $("#main");
    clear(main);
    if (page === "home") V3.story.render(main);
    else if (page === "entry" && hasEntry(pageId)) main.appendChild(V3.pages.entry(pageId));
    else if (page === "guide" && guideMeta(pageId) && V3.guides.render[pageId]) main.appendChild(V3.pages.guide(pageId));
    else notFound(main);
  }
  // On the guided path the reader stays at the same spot of the same chapter; elsewhere at the same height.
  var spot = null;
  function noteSpot() {
    var main = $("#main"), ref = null, off = 0;
    if (page === "home") {
      var probe = window.innerHeight * 0.4;
      $$("#start, .chapter, #map", main).forEach(function (el) { if (el.getBoundingClientRect().top <= probe) { ref = el.id; off = el.getBoundingClientRect().top; } });
    }
    spot = { y: window.scrollY, ref: ref, off: off, hadFocus: main.contains(document.activeElement) && document.activeElement.hasAttribute("data-mode-set") };
  }
  function redraw(mode) {
    var y = spot.y, ref = spot.ref, off = spot.off, hadFocus = spot.hadFocus;
    drawPage();
    // Sketches and fonts settle a moment after drawing and move things, so the spot is put right again a few times
    // (unless the reader has scrolled in the meantime).
    var placed = -1;
    function restore() {
      if (placed !== -1 && Math.abs(window.scrollY - placed) > 2) return;
      var again = ref && document.getElementById(ref);
      window.scrollTo(0, again ? window.scrollY + again.getBoundingClientRect().top - off : y);
      placed = window.scrollY;
    }
    restore();
    requestAnimationFrame(function () { restore(); requestAnimationFrame(restore); });
    setTimeout(restore, 400);
    sk.modeSync();
    if (hadFocus) {
      var btn = $$("[data-mode-set='" + mode + "']").filter(function (b) { return b.offsetParent !== null; })[0];
      if (btn) btn.focus({ preventScroll: true });
    }
    if (sInput.value.trim()) applySearch();
    $("#mode-live").textContent = mode === "kitchen" ? "Now explained with the kitchen." : "Now explained in technical words.";
  }

  /* ---------- Boot ---------------------------------------------------------------------- */
  function notFound(main) {
    main.appendChild(h("article", { class: "page" }, h("header", { class: "page-head" },
      h("h1", { class: "page-title" }, "This page does not exist"),
      h("p", { class: "page-lede" }, h("a", { href: url.home() }, "Back to the deep dive")))));
  }
  if (page === "home" && forwardOldLink()) return;
  $("#mode-slot").appendChild(sk.modeSwitch());
  sk.mode.onBefore(noteSpot);
  sk.mode.onChange(redraw);
  drawPage();
  renderMenu();
  initSearch();
  initTheme();
  initEvents();
  scrollToHash();
})();
