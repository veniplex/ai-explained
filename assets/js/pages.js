/* AI explained: the pages that are not the chapters of the deep dive: one term (glossary/<id>/), the glossary (glossary/), one guide (guides/<id>/), the list of
   guides (guides/) and the about page (about/). Each has its own address, so a link points to exactly this page. The chapters and the map are story.js.
   A term page and a guide have a list at their left edge, outside the text: the term page lists all terms (A to Z or by topic, the term you are on marked), the guide
   lists its own parts and ends with a button to all guides. Every term page has the same parts, in this order: where it sits in the kitchen (locator.js), the definition, related terms, the detailed
   technical description and the references. Every word in the text that is a term of the glossary links to its page (autolink). */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice, T = V3.terms;
  var h = sk.h, rich = sk.rich, url = sk.url;
  var chip = V3.guides.chip;

  var ENTRIES = D.entries;
  function chLabel(c) { return c.n === 8 ? "Epilogue" : "Chapter " + c.n; }
  function plainText(s) { return String(s || "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\[([^\]]+)\]\(https?:[^)\s]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1"); }

  /* ---------- Shared pieces ----------------------------------------------------------------- */
  function section(title, body, id) { return body ? h("div", { class: "bd-section", id: id || null }, h("h2", null, title), body) : null; }
  function paras(list) { return list && list.length ? h("div", { class: "prose" }, list.map(function (p) { return h("p", null, rich(p)); })) : null; }
  function pager(prev, next) {
    return h("nav", { class: "pager", "aria-label": "More" },
      h("a", { class: "pager-link pager-prev", href: prev.href, rel: "prev" }, h("span", { class: "eyebrow" }, prev.kind), h("b", null, prev.label)),
      h("a", { class: "pager-link pager-next", href: next.href, rel: "next" }, h("span", { class: "eyebrow" }, next.kind), h("b", null, next.label)));
  }
  function exampleBlock(title, text) {
    return h("div", { class: "bd-section" }, h("h2", null, title), h("p", { class: "bd-example" }, rich(text)));
  }
  function relatedChips(ids) {
    var list = (ids || []).filter(function (id) { return T.get(id); });
    return list.length ? section("Related terms", h("div", { class: "chips" }, list.map(function (r) { return chip(r); }))) : null;
  }
  function icon(name, cls, seed) { return sk.glyph ? sk.glyph(name, cls, seed, sk.reduced() ? null : 0.1) : null; }
  function referencesOf(list, title) {
    if (!list || !list.length) return null;
    return section(title || "References", V3.guides.linkList(list));
  }

  /* ---------- Links to the glossary ------------------------------------------------------------ */
  // Every place where the text names a term of the glossary (by its name, the short form in brackets, or an "also called" name) becomes a link to its page. The
  // first mention in each paragraph is enough. Words that are common English on their own are left alone unless they are written as the name is.
  var STOP = { effort: 1, team: 1, trace: 1, planning: 1, routing: 1, streaming: 1, alignment: 1, grounding: 1, assistant: 1, memory: 1, context: 1, tools: 1, tool: 1,
    prompt: 1, security: 1, cost: 1, governance: 1, knowledge: 1, skills: 1, hooks: 1, evals: 1, harness: 1, instructions: 1, background: 1, permissions: 1, sandbox: 1, reasoning: 1 };
  var ALIAS = null;
  function escapeRe(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function aliases() {
    if (ALIAS) return ALIAS;
    var map = {}, names = [];
    function add(form, id, exactOnly) {
      form = form.trim();
      var k = form.toLowerCase();
      if (form.length < 3 || (STOP[k] && !exactOnly) || map[k]) return;
      map[k] = { id: id, form: form };
      names.push(form);
    }
    // The main terms come first, so a name two terms share belongs to the main term.
    var order = T.list.filter(function (t) { return t.main; }).concat(T.list.filter(function (t) { return !t.main; }));
    order.forEach(function (t) {
      var head = t.name.replace(/\s*\(.*\)\s*$/, ""), par = t.name.match(/\(([^)]+)\)\s*$/);
      if (!t.main || head.indexOf(" ") !== -1) add(head, t.id);
      else if (!STOP[head.toLowerCase()]) add(head, t.id);
      if (par) add(par[1], t.id);
      (t.aka || []).forEach(function (a) { add(a, t.id); });
    });
    names.sort(function (a, b) { return b.length - a.length; });
    ALIAS = { map: map, re: new RegExp("(^|[^A-Za-z0-9-])(" + names.map(escapeRe).join("|") + ")(?:s|es)?(?![A-Za-z0-9-])", "gi") };
    return ALIAS;
  }
  var SKIP_IN = "a, code, pre, svg, button, h1, h2, h3, h4, h5, h6, .links, .gd-sources, .link-meta, .chips, .locator, .pager, .term-aka, .mini-map, .kmap, .fig, .formula, .note-grid, .gl-card, .side, .code, .eyebrow, label";
  function linkBlock(block, selfId) {
    var A = aliases(), seen = {}, walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) { if (n.parentNode && !n.parentNode.closest(SKIP_IN)) nodes.push(n); }
    nodes.forEach(function (node) {
      var text = node.nodeValue, re = new RegExp(A.re.source, "gi"), m, last = 0, frag = null;
      while ((m = re.exec(text))) {
        var hit = A.map[m[2].toLowerCase()];
        if (!hit || hit.id === selfId || seen[hit.id]) continue;
        // A short form such as "RAG" or "CoT" only counts when it is written the way the glossary writes it.
        if (hit.form.length <= 4 && m[2] !== hit.form) continue;
        seen[hit.id] = true;
        if (!frag) frag = document.createDocumentFragment();
        var start = m.index + m[1].length, end = re.lastIndex;
        if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        frag.appendChild(h("a", { class: "link-btn", href: url.entry(hit.id), "data-entry": hit.id }, text.slice(start, end)));
        last = end;
      }
      if (frag) {
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  }
  function autolink(root, selfId) {
    var BLOCKS = "p, li, td, th, dd, .def, .gd-callout b, .gd-callout span, .gd-steps b, .gd-steps span";
    Array.prototype.forEach.call(root.querySelectorAll(BLOCKS), function (block) {
      if (block.closest(SKIP_IN) && !block.matches(".def")) return;
      if (block.querySelector("p, li, td, th")) return;
      linkBlock(block, selfId);
    });
  }

  /* ---------- The order of the terms: A to Z (the default) or by topic ------------------------------ */
  function getOrder() { return sk.store("ae15-order") === "topic" ? "topic" : "az"; }
  function setOrder(v) { sk.store("ae15-order", v); }
  function letterOf(name) { var L = name.charAt(0).toUpperCase(); return /[A-Z]/.test(L) ? L : "#"; }
  // The two buttons that choose the order. onChange(order) runs after the choice is stored.
  function orderButtons(label, onChange) {
    var box = h("div", { class: "gl-view", role: "group", "aria-label": label });
    [["az", "A to Z"], ["topic", "By topic"]].forEach(function (v) {
      var b = h("button", { type: "button", class: "gl-chip", "data-view": v[0] }, v[1]);
      b.addEventListener("click", function () { setOrder(v[0]); sync(); onChange(v[0]); });
      box.appendChild(b);
    });
    function sync() {
      var now = getOrder();
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { var on = b.getAttribute("data-view") === now; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    }
    sync();
    return box;
  }

  /* ---------- The list at the left edge ---------------------------------------------------------------- */
  // A box that is open on a wide screen and a closed <details> above the text on a narrow one.
  function sideBox(title, content, cls) {
    var box = h("details", { class: "gl-side-box", open: true }, h("summary", null, h("span", null, title)), h("div", { class: "gl-side-body" }, content));
    var wide = window.matchMedia ? window.matchMedia("(min-width: 960px)") : null;
    function fit() { box.open = !wide || wide.matches; }
    fit();
    if (wide && wide.addEventListener) wide.addEventListener("change", fit);
    return h("aside", { class: "side gl-side" + (cls ? " " + cls : "") }, box);
  }
  function inView(list, current) {
    // The item you are on is in view when the list opens.
    if (!current) return;
    setTimeout(function () {
      if (list.scrollHeight <= list.clientHeight) return;
      var r = current.getBoundingClientRect(), n = list.getBoundingClientRect();
      list.scrollTop = Math.max(0, list.scrollTop + r.top - n.top - list.clientHeight / 2 + r.height / 2);
    }, 80);
  }

  function termsSidebar(currentId, body) {
    var input = h("input", { type: "search", id: "gl-filter", placeholder: "Filter terms", autocomplete: "off", spellcheck: "false", "aria-label": "Filter the terms" });
    var nav = h("nav", { class: "gl-side-list", "aria-label": "All terms" });
    var empty = h("p", { class: "gl-side-empty", hidden: true }, "No term matches.");
    var current = null;
    function item(t) {
      var a = h("a", { href: url.entry(t.id), "data-name": sk.stem(t.name + " " + t.aka.join(" ")), "data-nopop": "" }, h("span", null, t.name));
      if (t.id === currentId) { a.setAttribute("aria-current", "page"); current = a; }
      return h("li", { "data-id": t.id }, a);
    }
    function draw() {
      sk.clear(nav);
      if (getOrder() === "topic") {
        T.cats.forEach(function (c) {
          nav.appendChild(h("div", { class: "gl-side-group", "data-zone": c.zone },
            h("p", { class: "gl-side-head" }, h("i", { class: "zdot", "aria-hidden": "true" }), h("span", null, c.title)), h("ul", null, c.terms.map(item))));
        });
      } else {
        var letter = "", ul = null;
        T.list.forEach(function (t) {
          var L = letterOf(t.name);
          if (L !== letter) {
            letter = L;
            ul = h("ul", null);
            nav.appendChild(h("div", { class: "gl-side-group" }, h("p", { class: "gl-side-head gl-side-letter" }, h("span", null, L)), ul));
          }
          ul.appendChild(item(t));
        });
      }
      filter();
      inView(nav, current);
    }
    function filter() {
      var q = sk.stem(input.value).trim(), shown = 0;
      sk.$$("li", nav).forEach(function (li) { var on = !q || li.firstChild.getAttribute("data-name").indexOf(q) !== -1; li.hidden = !on; if (on) shown++; });
      sk.$$(".gl-side-group", nav).forEach(function (g) { g.hidden = !sk.$$("li:not([hidden])", g).length; });
      empty.hidden = shown > 0;
    }
    input.addEventListener("input", filter);
    draw();
    // Above: the parts of this page, to jump to one. Below: the other terms.
    var parts = body ? partsNav(body, ".bd-section > h2", "On this page", true) : null;
    return sideBox("Glossary", [
      parts ? h("div", { class: "gl-side-page" }, h("p", { class: "gl-side-sub" }, "On this page"), parts) : null,
      h("div", { class: "gl-side-terms" },
        h("p", { class: "gl-side-sub" }, "All terms"),
        h("div", { class: "gl-side-tools" }, orderButtons("Order of the terms", draw), input), nav, empty)]);
  }

  // The parts of a guide: its sections, the terms and the sources. Below the list, one button leads to all guides. The box does not scroll with the page, and it
  // does not scroll inside either unless the window is very short.
  // The list of the parts of a page (the headings with an id) with the one you are reading marked; clicking one scrolls to it smoothly.
  function partsNav(body, selector, label, needsId) {
    var heads = sk.$$(selector, body), items = [];
    heads.forEach(function (hd) {
      var sec = hd.parentNode, label2 = hd.querySelector(".gd-h");
      if (needsId && !sec.id) return;
      items.push({ id: sec.id, text: (label2 || hd).textContent.trim(), el: sec, head: hd, n: hd.querySelector(".gd-n") });
    });
    var list = h("ol", { class: "gd-side-list" }, items.map(function (it) {
      return h("li", null, h("a", { href: "#" + it.id, "data-nopop": "" }, it.n ? h("span", { class: "gd-side-n", "aria-hidden": "true" }, it.n.textContent) : null, h("span", null, it.text)));
    }));
    var links = sk.$$("a", list);
    guideScroll(items, links, body);
    return h("nav", { class: "gd-side-nav", "aria-label": label }, list);
  }
  function guideSidebar(body) {
    var nav = partsNav(body, ".gd-section > h2, .gd-section-plain > h2", "In this guide");
    var arrow = sk.s("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" });
    arrow.appendChild(sk.s("path", { d: "M5 12h14M13 6l6 6-6 6" }));
    var all = h("a", { class: "btn btn-sm gd-side-all", href: url.guides(), "data-nopop": "" }, "Explore all guides", arrow);
    return sideBox("In this guide", [nav, h("div", { class: "gd-side-foot" }, all)], "gd-side");
  }

  // Smooth scrolling to a part, the part you are in marked in the list, and the bar at the foot of the top bar that shows how far you have read.
  function smoothTo(el, hash) {
    var reduce = sk.reduced();
    if (hash && location.hash !== hash) { try { history.pushState(null, "", hash); } catch (e) { location.hash = hash; } }
    // A heading sticks under the top bar (stickhead.js), so it is the part around it that is scrolled to: a heading that has been pushed out above would answer with its place at the end of its part.
    var part = el.matches("h2") && el.parentNode && el.parentNode !== document.body ? el.parentNode : el;
    part.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    var head = el.matches("h2") ? el : el.querySelector("h2") || el;
    head.setAttribute("tabindex", "-1");
    try { head.focus({ preventScroll: true }); } catch (e) {}
    // The part flashes once it is in place: a short wash of colour behind its heading.
    var delay = reduce ? 0 : 280;
    setTimeout(function () {
      el.classList.remove("is-hit");
      void el.offsetWidth;
      el.classList.add("is-hit");
      setTimeout(function () { el.classList.remove("is-hit"); }, 1700);
    }, delay);
  }
  function guideScroll(items, links, body) {
    var article = body.closest ? body.closest("article") : null, bar = document.querySelector(".bar");
    var meter = h("div", { class: "read-progress", role: "progressbar", "aria-label": "Reading progress", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": "0" }, h("span", null));
    var fill = meter.firstChild, queued = false, current = -1;
    if (bar) bar.appendChild(meter);
    function mark(k) {
      if (k === current) return;
      current = k;
      links.forEach(function (a, i) { if (i === k) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
      // The part you are in is kept in view when the list itself has to scroll (a very short window).
      var a = links[k], sc = a && a.closest(".gd-side-nav");
      if (a && sc && sc.scrollHeight > sc.clientHeight) { var r = a.getBoundingClientRect(), n = sc.getBoundingClientRect(); if (r.top < n.top || r.bottom > n.bottom) sc.scrollTop += r.top - n.top - sc.clientHeight / 2; }
    }
    function update() {
      queued = false;
      var doc = document.documentElement, top = doc.scrollTop || document.body.scrollTop, vh = window.innerHeight;
      if (article) {
        // How far down the page you are: the scroll position over the furthest the page can scroll, so the bar is empty at the top, full at the very bottom and
        // moves steadily in between (measured against the article instead, it stopped short of the end and then jumped to full).
        var p = Math.max(0, Math.min(1, top / Math.max(1, doc.scrollHeight - vh)));
        fill.style.transform = "scaleX(" + p.toFixed(4) + ")";
        meter.setAttribute("aria-valuenow", String(Math.round(p * 100)));
        meter.classList.toggle("is-on", top > 8);
      }
      // The part in view: the last one whose heading has passed the line just under the top bar; at the very bottom, the last one.
      var line = (document.querySelector(".bar") ? document.querySelector(".bar").getBoundingClientRect().height : 60) + 90, k = 0;
      for (var i = 0; i < items.length; i++) if (items[i].el.getBoundingClientRect().top <= line) k = i;
      if (top + vh >= doc.scrollHeight - 2) k = items.length - 1;
      mark(k);
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // The page grows after it has loaded (the kitchen drawing, fonts, the list of references): measure again whenever its height changes.
    if (window.ResizeObserver) new ResizeObserver(queue).observe(document.body);
    setTimeout(update, 120);
    setTimeout(update, 900);
    // Every link to a part of this page (the list, the numbers of the sources, a link on a heading) scrolls smoothly and puts you at the heading.
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var id = decodeURIComponent(a.getAttribute("href").slice(1)), el = id ? document.getElementById(id) : null;
      if (!el || !body.contains(el)) return;
      e.preventDefault();
      // On a narrow screen the list is a box above the text: it closes when you pick a part, so the part is not pushed down by it.
      var box = a.closest(".gl-side-box");
      if (box && window.matchMedia && !window.matchMedia("(min-width: 960px)").matches) box.open = false;
      smoothTo(el, "#" + id);
    });
  }

  /* ---------- The page of a term ------------------------------------------------------------------- */
  // Every term has the same parts, in the same order: where it sits in the kitchen, the definition, related terms, the detailed technical description, the references.
  function definition(t) {
    if (!t.main) return section("Definition", h("p", { class: "def" }, rich(t.raw.def)));
    var v = voice.entry(t.id);
    return section("Definition", h("div", null, h("p", { class: "def" }, rich(v.line)), paras(v.how)));
  }
  function detail(t) {
    if (!t.main) return section("Detailed technical description", paras(T.more(t.id)));
    var id = t.id, e = ENTRIES[id], d = e.deeper || {};
    var body = h("div", null,
      paras(d.details),
      d.includes && d.includes.length ? h("div", { class: "bd-sub" }, h("h3", null, "Also covers"), h("ul", { class: "bd-list" }, d.includes.map(function (x) {
        return h("li", null, h("strong", null, x.name + ": "), rich(x.text));
      }))) : null);
    return section("Detailed technical description", body);
  }
  function termPage(id) {
    var t = T.get(id), c = T.cats.filter(function (x) { return x.id === t.cat; })[0];
    var i = T.list.indexOf(t), prev = T.list[(i + T.list.length - 1) % T.list.length], next = T.list[(i + 1) % T.list.length];
    var eyebrow = [c.title, t.main ? "main term" : null].filter(Boolean).join(" · ");
    var aka = t.aka && t.aka.length ? h("p", { class: "term-aka" }, "Also called ", t.aka.map(function (a, k) { return [k ? ", " : "", h("em", null, a)]; })) : null;
    var body = h("div", { class: "bd", "data-zone": t.zone },
      V3.locator ? V3.locator.section(t) : null,
      definition(t),
      relatedChips(t.related),
      detail(t),
      referencesOf(T.refs(id), "References"));
    autolink(body, id);
    // The parts of the page get an address, so the list at the left edge can jump to them.
    var PART_ID = { "Where it sits in the kitchen": "t-kitchen", "Definition": "t-definition", "Related terms": "t-related", "Detailed technical description": "t-details", "References": "t-references" };
    sk.$$(".bd-section", body).forEach(function (sec) { var hd = sec.querySelector("h2"), pid = hd && PART_ID[hd.textContent]; if (pid) sec.id = pid; });
    var article = h("article", { class: "page page-entry", "data-zone": t.zone },
      h("header", { class: "page-head term-head" },
        h("div", { class: "term-head-text" },
          h("p", { class: "eyebrow page-eyebrow" }, h("a", { href: url.glossary() }, "Glossary"), " · " + eyebrow),
          h("h1", { class: "page-title" }, t.name), aka),
        icon(t.icon, "term-icon", 17)),
      body,
      pager({ href: url.entry(prev.id), kind: "Previous term", label: prev.name }, { href: url.entry(next.id), kind: "Next term", label: next.name }));
    return h("div", { class: "side-layout" }, termsSidebar(id, body), article);
  }

  /* ---------- The glossary ----------------------------------------------------------------------- */
  // Draw an icon when its card comes near the screen, so 150 drawings do not hold the page up.
  var lazy = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      lazy.unobserve(e.target);
      var host = e.target, t = T.get(host.getAttribute("data-icon-of"));
      if (t) host.appendChild(icon(t.icon, "gl-icon", 5));
    });
  }, { rootMargin: "300px" }) : null;
  function iconHost(t) {
    var host = h("span", { class: "gl-icon-host", "data-icon-of": t.id, "aria-hidden": "true" });
    if (lazy) lazy.observe(host); else host.appendChild(icon(t.icon, "gl-icon", 5));
    return host;
  }
  function termCard(t) {
    return h("li", null, h("a", { class: "gl-card", href: url.entry(t.id), "data-zone": t.zone, "data-name": sk.stem(t.name + " " + t.aka.join(" ") + " " + T.line(t.id)), "data-entry": t.id, "data-nopop": "" },
      iconHost(t),
      h("span", { class: "gl-card-text" },
        h("b", null, t.name),
        h("span", { class: "gl-card-line" }, rich(plainText(T.line(t.id)))))));
  }
  function glossaryPage() {
    var count = T.list.length, catFilter = "all";
    var lede = count + " terms from the world of AI, from model to governance. Every term has the same page: where it sits in the kitchen of the story, a definition, related terms, a detailed technical description and references.";
    var input = h("input", { id: "gl-search", type: "search", placeholder: "Filter the glossary", autocomplete: "off", spellcheck: "false" });
    // The number of terms shown is announced to screen readers and not shown.
    var countEl = h("span", { class: "visually-hidden", "aria-live": "polite" });
    var listEl = h("div", { class: "gl-list" });
    // The topic filters only make sense when the terms are sorted by topic, so only then are they shown.
    var chips = h("div", { class: "gl-filter", role: "group", "aria-label": "Show one group" });
    function chipBtn(id, label, zone) {
      var b = h("button", { type: "button", class: "gl-chip" + (id === catFilter ? " is-on" : ""), "aria-pressed": id === catFilter ? "true" : "false", "data-cat": id, "data-zone": zone || null },
        zone ? h("i", { class: "zdot", "aria-hidden": "true" }) : null, label);
      b.addEventListener("click", function () { catFilter = id; sk.$$(".gl-chip", chips).forEach(function (x) { var on = x.getAttribute("data-cat") === id; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); }); draw(); });
      return b;
    }
    chips.appendChild(chipBtn("all", "All"));
    T.cats.forEach(function (c) { chips.appendChild(chipBtn(c.id, c.title, c.zone)); });
    var viewBtns = orderButtons("Order", function () { catFilter = "all"; sk.$$(".gl-chip", chips).forEach(function (x) { var on = x.getAttribute("data-cat") === "all"; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); }); draw(); });
    function matches(t, q) { return (catFilter === "all" || t.cat === catFilter) && (!q || sk.stem(t.name + " " + t.aka.join(" ") + " " + T.line(t.id)).indexOf(q) !== -1); }
    function draw() {
      var q = sk.stem(input.value).trim(), shown = 0, topic = getOrder() === "topic";
      chips.hidden = !topic;
      if (lazy) lazy.disconnect();
      sk.clear(listEl);
      if (topic) {
        T.cats.forEach(function (c) {
          var items = c.terms.filter(function (t) { return matches(t, q); });
          if (!items.length) return;
          shown += items.length;
          var hid = "gl-" + c.id;
          listEl.appendChild(h("section", { class: "ref-group", "data-zone": c.zone, "aria-labelledby": hid },
            h("h2", { class: "ref-group-title", id: hid }, h("i", { class: "zdot", "aria-hidden": "true" }), c.title, h("span", { class: "gl-group-n" }, String(items.length))),
            h("ul", { class: "gl-grid" }, items.map(termCard))));
        });
      } else {
        var items = T.list.filter(function (t) { return matches(t, q); }), letter = "", ul = null;
        shown = items.length;
        items.forEach(function (t) {
          var L = letterOf(t.name);
          if (L !== letter) {
            letter = L;
            listEl.appendChild(h("h2", { class: "gl-letter", id: "gl-letter-" + L }, L));
            ul = h("ul", { class: "gl-grid" });
            listEl.appendChild(ul);
          }
          ul.appendChild(termCard(t));
        });
      }
      if (!shown) listEl.appendChild(h("p", { class: "gloss-empty" }, "No term matches “" + input.value + "”."));
      countEl.textContent = shown === count ? "" : shown + (shown === 1 ? " term" : " terms") + " match";
    }
    input.addEventListener("input", draw);
    draw();
    return h("article", { class: "page page-list page-glossary" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "Look it up"),
        h("h1", { class: "page-title" }, "Glossary"),
        h("p", { class: "page-lede" }, lede)),
      h("div", { class: "gl-tools" },
        h("div", { class: "search-field gl-search" }, h("label", { class: "visually-hidden", for: "gl-search" }, "Filter the glossary"), input),
        viewBtns, countEl),
      chips, listEl);
  }

  /* ---------- A guide ------------------------------------------------------------------------ */
  function guidePage(id) {
    var list = D.guideList, k = list.map(function (x) { return x.id; }).indexOf(id), g = voice.guide(id);
    var prev = list[(k + list.length - 1) % list.length], next = list[(k + 1) % list.length];
    var lede = h("p", { class: "page-lede" }, rich(g.lede));
    lede.hidden = !g.lede;
    var body = h("div", { class: "page-body" }, V3.guides.render[id]());
    autolink(body);
    var article = h("article", { class: "page page-guide", "data-guide": id },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "Guide · " + g.minutes + " min read"),
        h("h1", { class: "page-title" }, g.title),
        lede),
      body,
      pager({ href: url.guide(prev.id), kind: "Previous guide", label: prev.menu }, { href: url.guide(next.id), kind: "Next guide", label: next.menu }));
    return h("div", { class: "side-layout side-layout-guide" }, guideSidebar(body), article);
  }

  /* ---------- The list of guides: a pinboard of notes ---------------------------------------------- */
  var NOTE_ZONE = { "how-it-works": "harness", context: "model", build: "tools", secure: "control", evaluate: "ops", compare: "orch", learn: "know" };
  function guidesPage() {
    return h("article", { class: "page page-list page-guides" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "Read in depth"),
        h("h1", { class: "page-title" }, "Guides"),
        h("p", { class: "page-lede" }, "Each guide takes one question from start to finish, with the mechanisms, the failure modes and what to do about them. Terms link to the glossary.")),
      h("ul", { class: "note-grid" }, D.guideList.map(function (g, i) {
        var m = voice.guide(g.id), a = h("a", { class: "note-card", href: url.guide(g.id), "data-zone": NOTE_ZONE[g.id] || "start", style: "--tilt:" + [-0.7, 0.5, -0.3, 0.7, -0.5, 0.4, -0.6][i % 7] + "deg" },
          h("span", { class: "note-tape", "aria-hidden": "true" }),
          icon(g.icon, "note-icon", 9 + i),
          h("b", { class: "note-title" }, g.menu),
          h("span", { class: "note-hint" }, g.hint),
          h("span", { class: "note-meta" }, h("span", null, m.minutes + " min read"), m.sections ? h("span", null, m.sections.length + " parts") : null));
        sk.sketchBox(a, { seed: 61 + i * 13, boil: false, sw: 1.4, radius: 8, fill: "zt" });
        return h("li", null, a);
      })));
  }

  /* ---------- About ------------------------------------------------------------------------------ */
  function aboutPage() {
    return h("article", { class: "page page-about" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "About"),
        h("h1", { class: "page-title" }, "About this site")),
      h("div", { class: "page-body" }, V3.guides.about()));
  }

  V3.pages = { term: termPage, glossary: glossaryPage, guide: guidePage, guides: guidesPage, about: aboutPage, chLabel: chLabel, exampleBlock: exampleBlock, autolink: autolink };
})();
