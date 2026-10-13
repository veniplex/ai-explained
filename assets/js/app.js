/* AI explained: interaction of the deep dives. In-page moves, the map's search highlight, then boot.
   Six kinds of page share this script: the chapters and map of the deep dive (technical/), the glossary and the list of guides, one term
   (glossary/<id>/), one guide (guides/<id>/) and the about page. <body data-page="home|glossary|term|guides|guide|about"> says which. Content: window.AE3. Drawing: sketch.js and map.js. The chapters: story.js. The pages: pages.js. Search (search.js) and the
   hover cards (popover.js) are shared with the story and the start page. */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  if (!V3 || !V3.sk || !V3.voice || !V3.terms || !V3.story || !V3.guides || !V3.pages || !D) return;
  var sk = V3.sk, h = sk.h, $ = sk.$, $$ = sk.$$, clear = sk.clear, url = sk.url;
  var body = document.body, page = body.getAttribute("data-page") || "home", pageId = body.getAttribute("data-id") || "";

  /* ---------- Indexes ---------------------------------------------------------- */
  function guideMeta(id) { return D.guideList.filter(function (g) { return g.id === id; })[0]; }
  function hasTerm(id) { return !!V3.terms.get(id); }

  /* ---------- Old deep links ------------------------------------------------------ */
  // Links made for the story's old addresses: #e-<id> and #guide-<id> lead to the glossary page or the guide.
  function forwardOldLink() {
    var m = (location.hash || "").match(/^#(e|guide)-([a-z0-9-]+)$/);
    if (!m) return false;
    if (m[1] === "e" && hasTerm(m[2])) { location.replace(url.entry(m[2])); return true; }
    if (m[1] === "guide" && m[2] === "glossary") { location.replace(url.glossary()); return true; }
    if (m[1] === "guide" && m[2] === "about") { location.replace(url.about()); return true; }
    if (m[1] === "guide" && guideMeta(m[2])) { location.replace(url.guide(m[2])); return true; }
    return false;
  }

  /* ---------- Moving around the page ----------------------------------------------- */
  // On the guided path this scrolls; on any other page it goes there. It leaves the address bar alone, so the back
  // button never jumps between chapters (the dots on the left update the address without adding a history entry).
  function goTo(id, keepAddress) {
    var el = document.getElementById(id);
    if (!el) { if (page !== "home") location.href = url.home(id); return; }
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

  /* ---------- The map follows the search ---------------------------------------------------- */
  // search.js says which terms match what is typed; the map on the chapter page marks them.
  document.addEventListener("ae:search", function (e) {
    var ids = (e.detail && e.detail.ids) || [], on = !!(e.detail && e.detail.on);
    $$(".kmap").forEach(function (m) { m.classList.toggle("is-search", on); });
    $$(".kmap .blk").forEach(function (b) { b.classList.toggle("is-match", on && ids.indexOf(b.getAttribute("data-entry")) !== -1); });
  });

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
      if ((el = t.closest("[data-ch-go]"))) { var n = +el.getAttribute("data-ch-go"); goTo(n === 8 ? "ch-e" : "ch-" + n); }
    });
    // Typing a new #chapter into the address bar, or following a link to one, scrolls there.
    window.addEventListener("hashchange", function () { if (page === "home") scrollToHash(); });
  }

  /* ---------- Drawing the page ------------------------------------------------------ */
  function drawPage() {
    var main = $("#main");
    clear(main);
    if (page === "home") {
      V3.story.render(main);
      $$(".chapter, .recap", main).forEach(function (el) { V3.pages.autolink(el); });
    }
    else if (page === "term" && hasTerm(pageId)) main.appendChild(V3.pages.term(pageId));
    else if (page === "glossary") main.appendChild(V3.pages.glossary());
    else if (page === "about") main.appendChild(V3.pages.about());
    else if (page === "guide" && guideMeta(pageId) && V3.guides.render[pageId]) main.appendChild(V3.pages.guide(pageId));
    else if (page === "guides") main.appendChild(V3.pages.guides());
    else notFound(main);
  }

  /* ---------- Boot ---------------------------------------------------------------------- */
  function notFound(main) {
    main.appendChild(h("article", { class: "page" }, h("header", { class: "page-head" },
      h("h1", { class: "page-title" }, "This page does not exist"),
      h("p", { class: "page-lede" }, h("a", { href: url.home() }, "Back to the chapters")))));
  }
  if (page === "home" && forwardOldLink()) return;
  drawPage();
  initEvents();
  scrollToHash();

  /* The pages are drawn by script, so the browser has nothing to scroll to when it tries to put you back where you were. We note
     the height ourselves and, when you come back with the Back button, put it right again as the sketches settle. */
  (function keepPlace() {
    var key = "ae11-y:" + location.pathname, timer = 0, nav = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    function save() { try { sessionStorage.setItem(key, String(Math.round(window.scrollY))); } catch (e) { /* private mode */ } }
    try { history.scrollRestoration = "manual"; } catch (e) { /* old browser */ }
    window.addEventListener("scroll", function () { clearTimeout(timer); timer = setTimeout(save, 150); }, { passive: true });
    window.addEventListener("pagehide", save);
    var y = 0;
    try { y = parseInt(sessionStorage.getItem(key), 10) || 0; } catch (e) { /* private mode */ }
    if (!(nav && nav.type === "back_forward") || location.hash || y < 40) return;
    var placed = -1;
    function put() { if (placed !== -1 && Math.abs(window.scrollY - placed) > 2) return; window.scrollTo(0, y); placed = window.scrollY; }
    put();
    requestAnimationFrame(function () { put(); requestAnimationFrame(put); });
    setTimeout(put, 400);
    setTimeout(put, 1000);
  })();
})();
