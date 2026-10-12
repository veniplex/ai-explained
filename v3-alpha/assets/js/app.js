/* Agentic AI, Explained (v3): interaction. The drawer (one entry), the sheet (the guides), the guides menu,
   search, theme, keyboard and deep links, then boot. Content: window.AE3. Drawing: sketch.js and map.js.
   The page itself: story.js. Overlay plumbing is adapted from v1-alpha. */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  if (!V3 || !V3.sk || !V3.story || !V3.guides || !D) return;
  var sk = V3.sk, h = sk.h, $ = sk.$, $$ = sk.$$, clear = sk.clear, rich = sk.rich, chip = V3.guides.chip;

  /* ---------- Indexes ---------------------------------------------------------- */
  var ENTRIES = D.entries, ORDER = [], CHAP = {};
  D.chapters.forEach(function (c) { CHAP[c.id] = c; c.entries.forEach(function (id) { ORDER.push(id); }); });
  function chapterOf(id) { return CHAP[ENTRIES[id].chapter]; }
  function chLabel(c) { return c.n === 8 ? "Epilogue" : "Chapter " + c.n; }
  function guideMeta(id) { return D.guideList.filter(function (g) { return g.id === id; })[0]; }

  /* ---------- Overlay plumbing: scrim, focus, history ---------------------------- */
  var scrim = $("#scrim"), lastHash = location.hash;
  var drawer = $("#drawer"), drawerOpen = false, drawerReturn = null;
  var sheet = $("#sheet"), sheetOpen = false, sheetId = null, sheetReturn = null, GCACHE = {};
  var menu = $("#menu"), menuBtn = $("#menu-btn");

  function setHash(hash, replace) {
    if ((location.hash || "") === (hash || "")) return;
    var url = hash ? hash : location.pathname + location.search;
    try { history[replace ? "replaceState" : "pushState"]({}, "", url); } catch (e) { if (hash) location.hash = hash; }
    lastHash = location.hash;
  }
  function syncScrim() {
    var on = drawerOpen || sheetOpen;
    if (on) {
      if (scrim.hidden) { scrim.hidden = false; void scrim.offsetWidth; }
      scrim.classList.add("is-open");
    } else {
      scrim.classList.remove("is-open");
      setTimeout(function () { if (!drawerOpen && !sheetOpen) scrim.hidden = true; }, sk.reduced() ? 0 : 260);
    }
    document.body.classList.toggle("is-locked", on);
    if (!on) document.dispatchEvent(new Event("v3:wake"));
  }
  function topDialog() { return drawerOpen ? drawer : sheetOpen ? sheet : null; }
  function trapTab(e) {
    var dlg = topDialog();
    if (!dlg) return;
    var f = $$('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])', dlg).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], act = document.activeElement;
    if (!dlg.contains(act)) { first.focus(); e.preventDefault(); return; }
    if (f.indexOf(act) === -1) { (e.shiftKey ? last : first).focus(); e.preventDefault(); return; }
    if (e.shiftKey && act === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && act === last) { first.focus(); e.preventDefault(); }
  }
  function underlyingHash() { return sheetOpen && sheetId ? "#guide-" + sheetId : ""; }

  /* ---------- Drawer: one entry, in three levels --------------------------------- */
  function section(title, body) { return body ? h("div", { class: "bd-section" }, h("h3", null, title), body) : null; }
  function paras(list) { return h("div", { class: "prose" }, list.map(function (p) { return h("p", null, rich(p)); })); }
  function bullets(items) { return items && items.length ? h("ul", { class: "bd-list" }, items.map(function (t) { return h("li", null, rich(t)); })) : null; }
  function kitchenCard(text, zone) {
    var card = h("div", { class: "eli5", "data-zone": zone },
      h("div", null, h("span", { class: "eyebrow eli5-label" }, "In the kitchen"), h("p", { class: "eli5-text" }, rich(text))),
      sk.doodleSvg(zone, "eli5-doodle", 13, sk.reduced() ? null : 0.15));
    sk.sketchBox(card, { seed: 29 + zone.length, boil: false, sw: 1.3 });
    return card;
  }
  function deeper(id) {
    var e = ENTRIES[id], src = D.sources[id] || { facts: [], sources: [], v1: [] };
    var box = h("details", { class: "deeper" }, h("summary", null, "Go deeper", h("span", { class: "deeper-hint" }, "details, facts and sources")));
    sk.append(box, [
      section("Details", paras(e.deeper.details)),
      section("Also covers", e.deeper.includes && e.deeper.includes.length ? h("ul", { class: "bd-list" }, e.deeper.includes.map(function (x) {
        return h("li", null, h("strong", null, x.name + ": "), rich(x.text));
      })) : null),
      section("Status, " + D.meta.snapshot, src.facts.length ? h("ul", { class: "bd-facts" }, src.facts.map(function (f) {
        return h("li", null, rich(f.text), " ", f.source ? h("a", { href: f.source, target: "_blank", rel: "noopener" }, "source") : null);
      })) : null),
      section("Sources", src.sources.length ? h("div", null, V3.guides.linkList(src.sources.slice(0, 3)),
        src.sources.length > 3 ? h("details", { class: "more-sources" }, h("summary", null, "All sources (" + src.sources.length + ")"), V3.guides.linkList(src.sources.slice(3))) : null) : null),
      src.v1 && src.v1.length ? h("p", { class: "v1-ref" }, "Full detail in v1-alpha: ", src.v1.map(function (b, i) {
        return [i ? ", " : "", h("a", { href: D.meta.v1 + "#block-" + b.id }, b.name)];
      })) : null
    ]);
    return box;
  }
  function entryBody(id) {
    var e = ENTRIES[id], c = chapterOf(id);
    var wrap = h("div", { class: "bd", "data-zone": c.zone });
    sk.append(wrap, [
      kitchenCard(e.kitchen, c.zone),
      h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, "In one sentence"), rich(e.short)),
      section("How it works", paras(e.how)),
      section("In our example", h("p", { class: "bd-example" }, rich(e.example))),
      section("What it means for you", bullets(e.forYou)),
      deeper(id),
      e.related && e.related.length ? section("Related", h("div", { class: "chips" }, e.related.map(function (r) { return chip(r); }))) : null,
      h("p", { class: "copy-row" }, h("button", { class: "link-btn", type: "button", "data-copy": "#e-" + id }, "Copy a link to this"))
    ]);
    return wrap;
  }
  function copyLink(btn) {
    var url = location.href.split("#")[0] + btn.getAttribute("data-copy");
    function done() { btn.textContent = "Link copied"; setTimeout(function () { btn.textContent = "Copy a link to this"; }, 1800); }
    function fallback() {
      var inp = h("input", { class: "copy-input", type: "text", value: url, readonly: true, "aria-label": "Link" });
      btn.parentNode.replaceChild(inp, btn);
      inp.focus(); inp.select();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fallback);
    else fallback();
  }
  function neighbour(list, id, step) { var k = list.indexOf(id); return list[(k + step + list.length) % list.length]; }
  function openEntry(id, opts) {
    opts = opts || {};
    if (!ENTRIES[id]) return;
    var c = chapterOf(id), prev = neighbour(ORDER, id, -1), next = neighbour(ORDER, id, 1);
    var body = $("#drawer-body");
    sk.unwatchWithin(body);
    clear(body);
    drawer.setAttribute("data-zone", c.zone);
    var eb = $("#drawer-eyebrow");
    clear(eb);
    eb.appendChild(h("i", { class: "zdot", "aria-hidden": "true" }));
    eb.appendChild(document.createTextNode(chLabel(c) + " · " + c.title));
    $("#drawer-title").textContent = ENTRIES[id].name;
    body.appendChild(entryBody(id));
    body.scrollTop = 0;
    var pb = $("#drawer-prev"), nb = $("#drawer-next");
    pb.textContent = "← " + ENTRIES[prev].label; pb.setAttribute("data-entry", prev);
    nb.textContent = ENTRIES[next].label + " →"; nb.setAttribute("data-entry", next);
    $$(".blk.is-selected").forEach(function (x) { x.classList.remove("is-selected"); });
    $$('.blk[data-entry="' + id + '"]').forEach(function (x) { x.classList.add("is-selected"); });
    sk.flashDraw(body, 1500);
    showDrawer("#e-" + id, opts.fromHash);
  }
  function showDrawer(hash, fromHash) {
    var wasOpen = drawerOpen;
    closeMenu();
    if (!drawerOpen) {
      drawerReturn = document.activeElement;
      drawer.hidden = false;
      void drawer.offsetWidth;
      drawer.classList.add("is-open");
      drawerOpen = true;
      syncScrim();
    }
    drawer.focus({ preventScroll: true });
    if (!fromHash) setHash(hash, wasOpen);
    else lastHash = location.hash;
  }
  function closeDrawer(opts) {
    opts = opts || {};
    if (!drawerOpen) return;
    drawerOpen = false;
    drawer.classList.remove("is-open");
    $$(".blk.is-selected").forEach(function (x) { x.classList.remove("is-selected"); });
    setTimeout(function () { if (!drawerOpen) drawer.hidden = true; }, sk.reduced() ? 0 : 320);
    syncScrim();
    if (!opts.fromHash) setHash(underlyingHash(), true);
    if (!opts.noFocus) {
      var back = sheetOpen && drawerReturn && !sheet.contains(drawerReturn) ? $("#sheet-close") : drawerReturn;
      if (back && document.contains(back)) back.focus({ preventScroll: true });
    }
  }

  /* ---------- Sheet: the guides ------------------------------------------------- */
  function openGuide(id, opts) {
    opts = opts || {};
    var g = guideMeta(id), render = V3.guides.render[id];
    if (!g || !render) return;
    closeMenu();
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    $("#sheet-eyebrow").textContent = g.eyebrow;
    $("#sheet-title").textContent = g.title;
    var lede = $("#sheet-lede");
    clear(lede);
    if (g.lede) lede.appendChild(rich(g.lede));
    lede.hidden = !g.lede;
    var body = $("#sheet-body");
    clear(body);
    body.appendChild(GCACHE[id] || (GCACHE[id] = render()));
    body.scrollTop = 0;
    var wasOpen = sheetOpen;
    if (!sheetOpen) {
      sheetReturn = document.activeElement;
      sheet.hidden = false;
      void sheet.offsetWidth;
      sheet.classList.add("is-open");
      sheetOpen = true;
      syncScrim();
    }
    sheetId = id;
    sheet.setAttribute("data-sheet", id);
    $(".sheet-panel", sheet).focus({ preventScroll: true });
    if (!opts.fromHash) setHash("#guide-" + id, wasOpen);
    else lastHash = location.hash;
  }
  function closeSheet(opts) {
    opts = opts || {};
    if (!sheetOpen) return;
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    sheetOpen = false; sheetId = null;
    sheet.classList.remove("is-open");
    setTimeout(function () { if (!sheetOpen) sheet.hidden = true; }, sk.reduced() ? 0 : 380);
    syncScrim();
    if (!opts.fromHash) setHash("", true);
    if (!opts.noFocus && sheetReturn && document.contains(sheetReturn)) sheetReturn.focus({ preventScroll: true });
  }

  /* ---------- Guides menu --------------------------------------------------------- */
  function renderMenu() {
    var box = h("div", { class: "menu-group" }, h("h2", { class: "eyebrow" }, "Guides"));
    D.guideList.forEach(function (g) {
      box.appendChild(h("button", { class: "menu-item", type: "button", "data-guide": g.id }, h("b", null, g.menu), h("span", null, g.hint)));
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
  // Scrolls without touching the address bar, so the back button never jumps between chapters.
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    closeMenu();
    if (drawerOpen) closeDrawer({ noFocus: true });
    if (sheetOpen) closeSheet({ noFocus: true });
    el.scrollIntoView({ behavior: sk.reduced() ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }

  /* ---------- Search: entries, merged v1 terms and glossary terms ------------------ */
  var sWrap = $("#search"), sInput = $("#block-search"), sList = $("#search-results"), sHits = [];
  function haystack(id) {
    var e = ENTRIES[id], src = D.sources[id] || {};
    return sk.norm([id, e.name, e.label, (e.aka || []).join(" "), (src.aka || []).join(" "),
      (e.deeper.includes || []).map(function (x) { return x.name; }).join(" "), e.short].join(" "));
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
    (D.guides.glossary || []).forEach(function (g) {
      var name = sk.norm(g.term);
      if (!g.entry || !ENTRIES[g.entry] || !terms.every(function (t) { return name.indexOf(t) !== -1; })) return;
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
      sList.appendChild(h("li", null, h("button", { type: "button", "data-entry": hit.id, "data-zone": chapterOf(hit.id).zone, class: i === 0 ? "is-first" : null },
        h("i", { class: "zdot", "aria-hidden": "true" }),
        hit.kind === "term" ? h("b", null, hit.term.term, h("em", { class: "sr-kind" }, " · in " + e.label)) : h("b", null, e.name),
        h("span", null, rich(hit.kind === "term" ? hit.term.def : e.short)))));
    });
    sList.hidden = false;
    status.textContent = !sHits.length ? "Nothing matches." : sHits.length + (sHits.length === 1 ? " match" : " matches") + ". Press Enter to open the first, or the down arrow to choose.";
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
  function closeSearchUI() { sWrap.classList.remove("is-open"); sList.hidden = true; }
  function initSearch() {
    sInput.addEventListener("input", applySearch);
    sInput.addEventListener("focus", function () { if (sInput.value.trim()) renderResults(); });
    sInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        var first = $("button", sList);
        if (first) { first.focus(); e.preventDefault(); }
      } else if (e.key === "Enter") {
        var hit = sHits[0];
        if (hit) { clearSearch(); closeSearchUI(); openEntry(hit.id); }
        e.preventDefault();
      } else if (e.key === "Escape") {
        clearSearch(); closeSearchUI(); sInput.blur();
        e.stopPropagation();
      }
    });
    sList.addEventListener("keydown", function (e) {
      var items = $$("button", sList), k = items.indexOf(document.activeElement);
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
      sWrap.classList.toggle("is-open", open);
      if (open) sInput.focus(); else clearSearch();
    });
    document.addEventListener("pointerdown", function (e) {
      if (!sWrap.contains(e.target)) { sList.hidden = true; if (!sInput.value) sWrap.classList.remove("is-open"); }
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
      if ((el = t.closest("[data-copy]"))) { copyLink(el); return; }
      if ((el = t.closest("[data-guide]"))) { openGuide(el.getAttribute("data-guide")); return; }
      if ((el = t.closest("[data-go]"))) { goTo(el.getAttribute("data-go")); return; }
      if ((el = t.closest("[data-ch-go]"))) { var n = +el.getAttribute("data-ch-go"); goTo(n === 8 ? "ch-e" : "ch-" + n); return; }
      if ((el = t.closest("[data-entry]"))) {
        if (el.closest("#search-results")) { clearSearch(); closeSearchUI(); }
        openEntry(el.getAttribute("data-entry"));
        return;
      }
      if (!menu.hidden && !menu.contains(t) && !menuBtn.contains(t)) closeMenu();
    });
    menuBtn.addEventListener("click", function (e) { e.stopPropagation(); if (menu.hidden) openMenu(); else closeMenu(); });
    $("#drawer-close").addEventListener("click", function () { closeDrawer(); });
    $("#sheet-close").addEventListener("click", function () { closeSheet(); });
    scrim.addEventListener("click", function () { if (drawerOpen) closeDrawer(); else if (sheetOpen) closeSheet(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", function (e) {
      var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        if (!menu.hidden) closeMenu(true);
        else if (drawerOpen) closeDrawer();
        else if (sheetOpen) closeSheet();
        return;
      }
      if (e.key === "Tab" && (drawerOpen || sheetOpen)) { trapTab(e); return; }
      if (typing) return;
      if (e.key === "/" && !drawerOpen && !sheetOpen) {
        e.preventDefault();
        if (getComputedStyle($(".search-field", sWrap)).display === "none") sWrap.classList.add("is-open");
        sInput.focus();
      }
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = $$(".menu-item", menu), k = items.indexOf(document.activeElement);
      items[(k + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
      e.preventDefault();
    });
  }

  /* ---------- Deep links ---------------------------------------------------------------- */
  function fromHash() {
    if (location.hash === lastHash && (drawerOpen || sheetOpen || !location.hash)) return;
    lastHash = location.hash;
    var hsh = decodeURIComponent((location.hash || "").slice(1)), m;
    if (!hsh) { closeDrawer({ fromHash: true, noFocus: true }); closeSheet({ fromHash: true, noFocus: true }); return; }
    if ((m = hsh.match(/^e-([a-z0-9-]+)$/)) && ENTRIES[m[1]]) { openEntry(m[1], { fromHash: true }); return; }
    if ((m = hsh.match(/^guide-([a-z]+)$/)) && guideMeta(m[1])) {
      if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
      openGuide(m[1], { fromHash: true });
      return;
    }
    if (/^(ch-[1-7]|ch-e|map)$/.test(hsh)) {
      closeDrawer({ fromHash: true, noFocus: true });
      closeSheet({ fromHash: true, noFocus: true });
      var el = document.getElementById(hsh);
      if (el) el.scrollIntoView({ block: "start" });
    }
  }

  /* ---------- Boot ---------------------------------------------------------------------- */
  V3.story.render($("#main"));
  renderMenu();
  initSearch();
  initTheme();
  initEvents();
  lastHash = null;
  fromHash();
  window.addEventListener("popstate", fromHash);
  window.addEventListener("hashchange", fromHash);
})();
