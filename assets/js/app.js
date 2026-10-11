/* Agentic AI, Explained: rendering and interaction.
   Plain JavaScript, no build step, no dependencies. All content lives in data.js (window.AE). */
(function () {
  "use strict";

  var D = window.AE;
  if (!D) return;

  /* ---------- Helpers ---------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Tiny element builder. Children may be strings, nodes, arrays or null.
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  function s(tag, attrs, text) {
    var el = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  // Inline markup in data strings: `code`, **bold**, [[block-id]] or [[block-id|label]].
  function rich(text) {
    var frag = document.createDocumentFragment();
    if (!text) return frag;
    var re = /(`[^`]+`|\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var tok = m[0];
      if (tok[0] === "`") frag.appendChild(h("code", null, tok.slice(1, -1)));
      else if (tok[0] === "*") frag.appendChild(h("strong", null, tok.slice(2, -2)));
      else {
        var inner = tok.slice(2, -2).split("|");
        var id = inner[0], b = BLOCKS[id];
        if (b) frag.appendChild(h("button", { class: "link-btn", type: "button", "data-block": id }, inner[1] || b.label || b.name));
        else frag.appendChild(document.createTextNode(inner[1] || id));
      }
      last = m.index + tok.length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  var BLOCKS = D.blocks;
  var ZONES = {};
  D.zones.forEach(function (z) { ZONES[z.id] = z; });

  // Canonical block order: zone order, then order inside each zone.
  var ORDER = [];
  D.zones.forEach(function (z) {
    (z.groups ? z.groups.reduce(function (a, g) { return a.concat(g.blocks); }, []) : z.blocks).forEach(function (id) {
      if (BLOCKS[id]) { BLOCKS[id].zone = z.id; ORDER.push(id); }
    });
  });
  Object.keys(BLOCKS).forEach(function (id) { BLOCKS[id].id = id; });

  // Which steps each block appears in.
  D.steps.forEach(function (st, i) {
    st.blocks.forEach(function (id) {
      var b = BLOCKS[id];
      if (!b) return;
      (b._steps = b._steps || []).push(i);
    });
  });

  function chip(id, small) {
    var b = BLOCKS[id];
    if (!b) return null;
    return h("button", {
      class: "chip" + (small ? " chip-sm" : ""), type: "button",
      "data-block": id, "data-zone": b.zone, title: b.short
    }, b.label || b.name);
  }

  /* ---------- Map ---------------------------------------------------------- */
  var mapEl = $("#map-grid");

  function zoneHead(z) {
    return h("div", { class: "zone-head" },
      h("span", { class: "zone-name" }, z.name),
      h("span", { class: "zone-tag" }, z.tag));
  }
  function zoneLink(z) {
    if (!z.link) return null;
    return h("div", { class: "zone-link", "data-conn": z.link.conn },
      h("span", { class: "zl-arrow", "aria-hidden": "true" }, z.link.arrow),
      h("span", null, z.link.text));
  }
  function zoneEl(id) {
    var z = ZONES[id];
    return h("div", { class: "zone", "data-zone": id, role: "group", "aria-label": z.name },
      zoneHead(z), zoneLink(z),
      h("div", { class: "chips" }, z.blocks.map(function (b) { return chip(b); })));
  }
  function connEl(c) {
    return h("div", { class: "conn " + (c.vertical ? "conn-v" : "conn-h"), "data-conn": c.id, "aria-hidden": "true" },
      h("span", { class: "wire " + (c.dir || "both") }),
      h("span", { class: "conn-label" }, c.label, c.sub ? h("small", null, c.sub) : null));
  }

  function loopFigure() {
    // The agent loop as a mechanism: five stations and the edges between them.
    // Two layouts of the same drawing: wide for desktop, tall for phones.
    var label = "The agent loop: the harness assembles the context, the model decides, a tool call passes permission checks and hooks, the tool runs, and its result is added to the context for the next turn. A reply without a tool call ends the loop.";
    function make(W, H, cls, draw) {
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": label, class: cls });
      var id = "lf-ah-" + cls;
      var defs = s("defs");
      var mk = s("marker", { id: id, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
      mk.appendChild(s("path", { d: "M0 0L10 5L0 10z", class: "lf-arrowhead" }));
      defs.appendChild(mk); svg.appendChild(defs);
      draw({
        box: function (x, y, w, hgt, c, t1, t2) {
          svg.appendChild(s("rect", { x: x, y: y, width: w, height: hgt, rx: 7, class: "lf-box " + c }));
          svg.appendChild(s("text", { x: x + w / 2, y: y + (t2 ? 20 : 27), "text-anchor": "middle" }, t1));
          if (t2) svg.appendChild(s("text", { x: x + w / 2, y: y + 36, "text-anchor": "middle", class: "lf-small" }, t2));
        },
        edge: function (d, lx, ly, text, anchor, dashed) {
          var a = { d: d, class: "lf-edge", "marker-end": "url(#" + id + ")" };
          if (dashed) a["stroke-dasharray"] = "3 3";
          svg.appendChild(s("path", a));
          if (text) svg.appendChild(s("text", { x: lx, y: ly, "text-anchor": anchor || "middle", class: "lf-small" }, text));
        }
      });
      return svg;
    }
    var wide = make(520, 176, "loop-h", function (g) {
      g.box(4, 10, 132, 46, "lf-harness", "Assemble context", "prompt · history");
      g.box(194, 10, 132, 46, "lf-model", "Model decides", "think · reply or act");
      g.box(384, 10, 132, 46, "lf-control", "Check the action", "permissions · hooks");
      g.box(384, 120, 132, 46, "lf-tools", "Run the tool", "sandbox · MCP · API");
      g.box(4, 120, 132, 46, "lf-harness", "Append the result", "observation");
      g.edge("M136 33H190", 165, 26, "API call");
      g.edge("M326 33H380", 353, 26, "tool call");
      g.edge("M450 56V116", 457, 91, "allowed", "start");
      g.edge("M384 143H140", 262, 160, "result");
      g.edge("M70 120V60", 77, 94, "next turn", "start");
      g.edge("M260 56V82", 260, 100, "no tool call: final answer", "middle", true);
    });
    var tall = make(330, 334, "loop-v", function (g) {
      g.box(10, 8, 180, 46, "lf-harness", "Assemble context", "prompt · history");
      g.box(10, 98, 180, 46, "lf-model", "Model decides", "think · reply or act");
      g.box(10, 188, 180, 46, "lf-control", "Check the action", "permissions · hooks");
      g.box(10, 278, 180, 46, "lf-tools", "Run the tool", "sandbox · MCP · API");
      g.box(206, 150, 118, 46, "lf-harness", "Append result", "observation");
      g.edge("M100 54V94", 108, 80, "API call", "start");
      g.edge("M100 144V184", 108, 170, "tool call", "start");
      g.edge("M100 234V274", 108, 260, "allowed", "start");
      g.edge("M190 301H265V200", 272, 250, "result", "start");
      g.edge("M265 150V31H194", 272, 90, "next turn", "start");
      g.edge("M190 121H240", 215, 112, "answer", "middle", true);
    });
    return h("figure", { class: "loop-fig" },
      h("div", { class: "loop-scroll" }, wide, tall),
      h("figcaption", null, "The loop the harness runs. One pass is one turn; real tasks take dozens."));
  }

  function harnessEl() {
    var z = ZONES.harness, c = ZONES.control;
    return h("div", { class: "zone", "data-zone": "harness", role: "group", "aria-label": z.name },
      zoneHead(z),
      loopFigure(),
      z.groups.map(function (g) {
        return h("div", { class: "subgroup" },
          h("span", { class: "subgroup-name" }, g.name),
          h("div", { class: "chips" }, g.blocks.map(function (b) { return chip(b); })));
      }),
      h("div", { class: "control-band", "data-zone": "control", role: "group", "aria-label": c.name },
        zoneHead(c),
        h("div", { class: "chips" }, c.blocks.map(function (b) { return chip(b); }))));
  }

  function renderMap() {
    var conns = {};
    D.connectors.forEach(function (c) { conns[c.id] = c; });
    // DOM order is the reading order on narrow screens; the grid places items on wide screens.
    append(mapEl, [
      zoneEl("start"), connEl(conns["c-task"]), harnessEl(),
      connEl(conns["c-api"]), zoneEl("model"),
      connEl(conns["c-ctx"]), zoneEl("know"),
      connEl(conns["c-tool"]), zoneEl("tools"),
      connEl(conns["c-dele"]), zoneEl("orch"),
      connEl(conns["c-ops"]), zoneEl("ops")
    ]);
    var legend = $("#legend");
    D.zones.forEach(function (z) {
      legend.appendChild(h("span", { style: "--zc: var(--z-" + z.id + ")" }, h("i", { "aria-hidden": "true" }), z.short || z.name));
    });
  }

  /* ---------- Walkthrough --------------------------------------------------- */
  var cur = -1, timer = null;
  var player = $("#player");

  function renderRoute() {
    var route = $("#route");
    D.steps.forEach(function (st, i) {
      route.appendChild(h("button", {
        class: "route-stop", type: "button", "data-step": i,
        "aria-label": "Step " + (i + 1) + ": " + st.title, title: (i + 1) + ". " + st.title
      }, h("span")));
    });
  }

  function renderSteps() {
    var ol = $("#steps");
    D.steps.forEach(function (st, i) {
      ol.appendChild(h("li", { class: "step-item", id: "step-" + (i + 1) },
        h("span", { class: "step-num" }, String(i + 1).padStart(2, "0")),
        h("div", { class: "step-body" },
          h("h4", null, st.title, h("button", { class: "link-btn", type: "button", "data-step": i }, "Show on map")),
          h("p", null, rich(st.text)),
          h("div", { class: "chips" }, st.blocks.map(function (b) { return chip(b, true); }))),
        st.note ? h("p", { class: "loop-note" }, rich(st.note)) : null));
    });
  }

  function setStep(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= D.steps.length) return;
    clearSearch();
    cur = i;
    var st = D.steps[i];
    mapEl.classList.add("is-focus");
    mapEl.classList.toggle("is-loop", !!st.loop);
    $$(".chip", mapEl).forEach(function (c) { c.classList.toggle("is-on", st.blocks.indexOf(c.getAttribute("data-block")) !== -1); });
    $$("[data-conn]", mapEl).forEach(function (c) { c.classList.toggle("is-on", (st.conn || []).indexOf(c.getAttribute("data-conn")) !== -1); });
    $$(".route-stop").forEach(function (r, k) {
      r.classList.toggle("is-current", k === i);
      r.classList.toggle("is-done", k < i);
      if (k === i) r.setAttribute("aria-current", "step"); else r.removeAttribute("aria-current");
    });
    $$(".step-item").forEach(function (li, k) { li.classList.toggle("is-current", k === i); });
    player.classList.remove("is-idle");
    $("#p-count").textContent = "Step " + String(i + 1).padStart(2, "0") + " / " + D.steps.length;
    $("#p-name").textContent = st.title;
    var pt = $("#p-text"); pt.textContent = ""; pt.appendChild(rich(st.text));
    var pc = $("#p-chips"); pc.textContent = "";
    pc.appendChild(h("span", { class: "label" }, "In this step"));
    st.blocks.forEach(function (b) { pc.appendChild(chip(b, true)); });
    $("#p-prev").disabled = i === 0;
    $("#p-next").disabled = i === D.steps.length - 1;
    if (opts.scroll) $("#map").scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  }

  function resetSteps() {
    stopPlay();
    cur = -1;
    mapEl.classList.remove("is-focus", "is-loop");
    $$(".is-on", mapEl).forEach(function (c) { c.classList.remove("is-on"); });
    $$(".route-stop").forEach(function (r) { r.classList.remove("is-current", "is-done"); r.removeAttribute("aria-current"); });
    $$(".step-item").forEach(function (li) { li.classList.remove("is-current"); });
    player.classList.add("is-idle");
    $("#p-count").textContent = D.steps.length + " steps";
    $("#p-name").textContent = "Follow one run through the map";
    $("#p-prev").disabled = true;
    $("#p-next").disabled = false;
  }

  function prefersReduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function startPlay() {
    if (cur === -1 || cur === D.steps.length - 1) setStep(0);
    $(".i-play").hidden = true; $(".i-pause").hidden = false;
    $("#p-play").setAttribute("aria-label", "Pause walkthrough");
    timer = window.setInterval(function () {
      if (cur >= D.steps.length - 1) { stopPlay(); return; }
      setStep(cur + 1);
    }, 6500);
  }
  function stopPlay() {
    if (timer) { window.clearInterval(timer); timer = null; }
    $(".i-play").hidden = false; $(".i-pause").hidden = true;
    $("#p-play").setAttribute("aria-label", "Play walkthrough");
  }

  function initPlayer() {
    renderRoute();
    renderSteps();
    $("#p-prev").addEventListener("click", function () { stopPlay(); setStep(Math.max(0, cur - 1)); });
    $("#p-next").addEventListener("click", function () { stopPlay(); setStep(cur + 1); });
    $("#p-reset").addEventListener("click", resetSteps);
    $("#p-play").addEventListener("click", function () { if (timer) stopPlay(); else startPlay(); });
    $("#hero-play").addEventListener("click", function () {
      stopPlay(); setStep(0, { scroll: true }); startPlay();
    });
    document.addEventListener("keydown", function (e) {
      if (cur === -1 || drawerOpen) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { stopPlay(); setStep(Math.min(D.steps.length - 1, cur + 1)); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { stopPlay(); setStep(Math.max(0, cur - 1)); e.preventDefault(); }
    });
    resetSteps();
  }

  /* ---------- Search on the map --------------------------------------------- */
  var searchInput = $("#block-search");
  function norm(x) { return (x || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, ""); }
  function haystack(b) {
    return norm([b.id, b.name, b.label, (b.aka || []).join(" "), b.short, (b.examples || []).join(" ")].join(" "));
  }
  function findBlocks(q) {
    q = norm(q).trim();
    if (!q) return [];
    var terms = q.split(/\s+/);
    var scored = [];
    ORDER.forEach(function (id) {
      var b = BLOCKS[id], hs = haystack(b);
      if (!terms.every(function (t) { return hs.indexOf(t) !== -1; })) return;
      var title = norm((b.label || "") + " " + b.name + " " + (b.aka || []).join(" "));
      var score = terms.reduce(function (a, t) { return a + (title.indexOf(t) !== -1 ? 2 : 1); }, 0);
      scored.push({ id: id, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.map(function (x) { return x.id; });
  }
  function clearSearch() {
    if (!searchInput.value && !mapEl.classList.contains("is-search")) return;
    searchInput.value = "";
    mapEl.classList.remove("is-search");
    $$(".is-match", mapEl).forEach(function (c) { c.classList.remove("is-match"); });
    $("#search-status").textContent = "";
  }
  function initSearch() {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value;
      if (cur !== -1) { var v = q; resetSteps(); searchInput.value = v; }
      var hits = findBlocks(q);
      mapEl.classList.toggle("is-search", !!q.trim());
      $$(".chip", mapEl).forEach(function (c) { c.classList.toggle("is-match", hits.indexOf(c.getAttribute("data-block")) !== -1); });
      var st = $("#search-status");
      if (!q.trim()) st.textContent = "";
      else if (!hits.length) st.textContent = "No block matches. Try the glossary below.";
      else st.textContent = hits.length + (hits.length === 1 ? " block matches" : " blocks match") + ". Press Enter to open " + (BLOCKS[hits[0]].label || BLOCKS[hits[0]].name) + ".";
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { var hits = findBlocks(searchInput.value); if (hits.length) openBlock(hits[0]); e.preventDefault(); }
      if (e.key === "Escape") { clearSearch(); }
    });
  }

  /* ---------- Block detail (drawer + reference) ------------------------------ */
  var TYPE_LABEL = { definition: "Explainer", docs: "Docs", guide: "Guide", paper: "Paper", spec: "Spec", video: "Video", course: "Course", blog: "Essay", tool: "Tool", law: "Law", standard: "Standard", book: "Book" };

  function linkList(links) {
    return h("ul", { class: "links" }, links.map(function (l) {
      var meta = [l.by, l.year].filter(Boolean).join(" · ");
      return h("li", null,
        h("span", { class: "lt " + (l.type || "") }, TYPE_LABEL[l.type] || l.type || "Link"),
        h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.title),
        h("span", { class: "lm" }, meta + (l.note ? (meta ? " · " : "") + l.note : "")));
    }));
  }

  function section(title, body) {
    if (!body) return null;
    return h("div", { class: "bd-section" }, h("h4", null, title), body);
  }
  function bulletList(items, cls) {
    if (!items || !items.length) return null;
    return h("ul", { class: "bd-list " + (cls || "") }, items.map(function (t) { return h("li", null, h("span", null, rich(t))); }));
  }

  function blockBody(id, inDrawer) {
    var b = BLOCKS[id];
    var wrap = h("div", { class: "bd", style: "--zc: var(--z-" + b.zone + ")" });
    if (inDrawer) wrap.appendChild(h("p", { class: "bd-short" }, rich(b.short)));
    if (b.analogy) wrap.appendChild(h("p", { class: "bd-analogy" }, h("b", null, "Think of it as "), rich(b.analogy)));
    if (b.what) wrap.appendChild(section("What it is", h("div", { class: "prose" }, [].concat(b.what).map(function (p) { return h("p", null, rich(p)); }))));
    if (b._steps && b._steps.length) {
      wrap.appendChild(section("Where it enters a run", h("div", { class: "bd-steps" }, b._steps.map(function (i) {
        return h("button", { class: "bd-step", type: "button", "data-step": i, "data-close": "1" }, h("b", null, String(i + 1).padStart(2, "0")), D.steps[i].title);
      }))));
    }
    wrap.appendChild(section("Use it when", bulletList(b.when)));
    wrap.appendChild(section("Watch out", bulletList(b.avoid, "warn")));
    wrap.appendChild(section("Current practice (" + D.meta.snapshot + ")", bulletList(b.sota, "sota")));
    if (b.facts && b.facts.length) {
      wrap.appendChild(section("Status, " + D.meta.snapshot, h("ul", { class: "bd-facts" }, b.facts.map(function (f) {
        return h("li", null, rich(f.text), " ", f.source ? h("a", { href: f.source, target: "_blank", rel: "noopener" }, "source") : null);
      }))));
    }
    if (b.examples && b.examples.length) wrap.appendChild(section("Examples", h("div", { class: "bd-examples" }, b.examples.map(function (e) { return h("span", null, e); }))));
    if (b.links && b.links.length) wrap.appendChild(section("Learn more", linkList(b.links)));
    if (b.related && b.related.length) wrap.appendChild(section("Related blocks", h("div", { class: "bd-related" }, b.related.map(function (r) { return chip(r, true); }))));
    return wrap;
  }

  var drawer = $("#drawer"), scrim = $("#drawer-scrim"), drawerOpen = false, lastFocus = null, openId = null;

  function openBlock(id, opts) {
    opts = opts || {};
    var b = BLOCKS[id];
    if (!b) return;
    if (!drawerOpen) lastFocus = document.activeElement;
    openId = id;
    drawer.style.setProperty("--zc", "var(--z-" + b.zone + ")");
    $("#drawer-zone").textContent = ZONES[b.zone].name;
    $("#drawer-title").textContent = b.name;
    var body = $("#drawer-body"); body.textContent = ""; body.scrollTop = 0;
    body.appendChild(blockBody(id, true));
    body.appendChild(h("p", { class: "note", style: "margin-top:18px" },
      h("button", { class: "link-btn", type: "button", id: "copy-link" }, "Copy link to this block")));
    var k = ORDER.indexOf(id);
    var prev = ORDER[(k - 1 + ORDER.length) % ORDER.length], next = ORDER[(k + 1) % ORDER.length];
    var pb = $("#drawer-prev"), nb = $("#drawer-next");
    pb.textContent = "← " + (BLOCKS[prev].label || BLOCKS[prev].name); pb.setAttribute("data-block", prev);
    nb.textContent = (BLOCKS[next].label || BLOCKS[next].name) + " →"; nb.setAttribute("data-block", next);
    $$(".chip.is-selected").forEach(function (c) { c.classList.remove("is-selected"); });
    $$('.chip[data-block="' + id + '"]', mapEl).forEach(function (c) { c.classList.add("is-selected"); });
    if (!drawerOpen) {
      drawer.hidden = false; scrim.hidden = false;
      // Force layout so the transition runs.
      void drawer.offsetWidth;
      drawer.classList.add("is-open"); scrim.classList.add("is-open");
      document.body.classList.add("drawer-open");
      drawerOpen = true;
    }
    $("#drawer-close").focus({ preventScroll: true });
    if (!opts.fromHash && location.hash !== "#block-" + id) {
      try { history.pushState({ block: id }, "", "#block-" + id); } catch (e) { location.hash = "block-" + id; }
    }
  }

  function closeDrawer(opts) {
    opts = opts || {};
    if (!drawerOpen) return;
    drawerOpen = false; openId = null;
    drawer.classList.remove("is-open"); scrim.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    $$(".chip.is-selected").forEach(function (c) { c.classList.remove("is-selected"); });
    window.setTimeout(function () { if (!drawerOpen) { drawer.hidden = true; scrim.hidden = true; } }, prefersReduced() ? 0 : 260);
    if (!opts.fromHash && /^#block-/.test(location.hash)) {
      try { history.pushState({}, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
    }
    if (lastFocus && document.contains(lastFocus) && !opts.noFocus) lastFocus.focus({ preventScroll: true });
  }

  function initDrawer() {
    $("#drawer-close").addEventListener("click", function () { closeDrawer(); });
    scrim.addEventListener("click", function () { closeDrawer(); });
    document.addEventListener("keydown", function (e) {
      if (!drawerOpen) return;
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key === "Tab") {
        // Keep keyboard focus inside the dialog.
        var f = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', drawer).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
    drawer.addEventListener("click", function (e) {
      var c = e.target.closest("#copy-link");
      if (!c) return;
      var url = location.href.split("#")[0] + "#block-" + openId;
      var done = function () { c.textContent = "Link copied"; window.setTimeout(function () { c.textContent = "Copy link to this block"; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt && window.prompt("Copy this link:", url); });
      } else if (window.prompt) { window.prompt("Copy this link:", url); }
    });
  }

  // One delegated handler for every block chip and step button on the page.
  document.addEventListener("click", function (e) {
    var stepBtn = e.target.closest("[data-step]");
    if (stepBtn) {
      var n = parseInt(stepBtn.getAttribute("data-step"), 10);
      stopPlay();
      if (stepBtn.hasAttribute("data-close")) closeDrawer({ noFocus: true });
      setStep(n, { scroll: !stepBtn.classList.contains("route-stop") });
      return;
    }
    var blockBtn = e.target.closest("[data-block]");
    if (blockBtn) {
      if (blockBtn.closest(".map") && timer) stopPlay();
      openBlock(blockBtn.getAttribute("data-block"));
    }
  });

  /* ---------- Context window anatomy ---------------------------------------- */
  function renderContext() {
    var root = $("#ctx");
    var legendZones = {};
    D.context.rows.forEach(function (row) {
      var bar = h("div", { class: "ctx-bar", role: "img", "aria-label": row.title + ": " + row.segs.map(function (sg) { return sg.label + " " + sg.pct + "%"; }).join(", ") });
      row.segs.forEach(function (sg) {
        if (sg.zone) legendZones[sg.zone] = true;
        bar.appendChild(h("div", {
          class: "ctx-seg" + (sg.cls ? " " + sg.cls : ""), title: sg.label + ": about " + sg.pct + "% of the window",
          style: "flex: 0 0 " + sg.pct + "%;" + (sg.zone ? " --zc: var(--z-" + sg.zone + ")" : "")
        }, sg.pct >= 7 ? sg.label : ""));
      });
      var scroller = h("div", { class: "ctx-bar-scroll" });
      if (row.cache) {
        scroller.appendChild(h("div", { class: "ctx-cache", "aria-hidden": "true", style: "margin-top:18px" },
          h("span", { style: "width:" + row.cache + "%" }, h("em", null, "cached prefix: reused at a fraction of the cost"))));
      }
      scroller.appendChild(bar);
      var subs = null;
      if (row.subs) {
        subs = h("div", { class: "ctx-sub" }, h("span", null, row.subs.label),
          row.subs.bars.map(function (sb) {
            return h("span", { class: "ctx-mini", title: sb.title, role: "img", "aria-label": sb.title },
              sb.segs.map(function (sg) { return h("span", { class: "ctx-seg" + (sg.cls ? " " + sg.cls : ""), style: "flex: 0 0 " + sg.pct + "%; --zc: var(--z-" + (sg.zone || "start") + ")" }); }));
          }));
      }
      var brk = h("p", { class: "ctx-break" }, row.segs.filter(function (sg) { return !/free/.test(sg.cls || ""); }).map(function (sg, i) {
        return h("span", { style: "--zc: var(--z-" + (sg.zone || "start") + ")" }, h("i", { "aria-hidden": "true" }), (sg.full || sg.label) + " " + sg.pct + "%");
      }));
      root.appendChild(h("div", { class: "ctx-row" },
        h("div", { class: "ctx-row-head" }, h("h3", null, row.title), h("span", { class: "meta" }, row.meta)),
        scroller, brk, subs, h("p", { class: "cap" }, rich(row.caption))));
    });
    var lg = h("div", { class: "ctx-legend" });
    D.context.legend.forEach(function (l) {
      lg.appendChild(h("span", null, h("i", { style: "--zc: var(--z-" + l.zone + ")" }), l.label));
    });
    lg.appendChild(h("span", null, h("i", { style: "background: repeating-linear-gradient(135deg, var(--sunken) 0 3px, var(--surface) 3px 6px)" }), "Free space"));
    root.appendChild(lg);
    if (D.context.note) root.appendChild(h("p", { class: "note" }, rich(D.context.note)));
  }

  /* ---------- Compare table ---------------------------------------------------- */
  function renderCompare() {
    var c = D.compare;
    var tbl = h("table", { class: "compare-table" },
      h("thead", null, h("tr", null, c.columns.map(function (col) { return h("th", { scope: "col" }, col); }))),
      h("tbody", null, c.rows.map(function (r) {
        return h("tr", null,
          h("th", { scope: "row" }, r.block ? chip(r.block, true) : r.name),
          r.cells.map(function (cell, i) {
            if (i === c.detCol) {
              var cls = /^yes/i.test(cell) ? "yes" : /^no/i.test(cell) ? "no" : "part";
              return h("td", { class: "narrow" }, h("span", { class: "tag " + cls }, cell));
            }
            return h("td", null, rich(cell));
          }));
      })));
    $("#compare-table").appendChild(tbl);
  }

  /* ---------- Decision guide ------------------------------------------------- */
  function renderDecide() {
    var root = $("#decide-list");
    D.decide.forEach(function (d) {
      root.appendChild(h("div", { class: "decide-item" },
        h("p", { class: "need" }, d.need),
        h("div", { class: "use" }, h("span", { class: "arrow", "aria-hidden": "true" }, "→"), h("span", { class: "visually-hidden" }, "Use: "), d.use.map(function (u) { return chip(u, true); })),
        h("p", { class: "why" }, rich(d.why))));
    });
  }

  /* ---------- Patterns (mini diagrams) ---------------------------------------- */
  function patternSvg(p) {
    var g = p.svg;
    var svg = s("svg", { viewBox: "0 0 " + g.w + " " + g.h, role: "img", "aria-label": p.alt });
    var id = "pd-ah-" + p.id;
    var defs = s("defs");
    var mk = s("marker", { id: id, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6.5", markerHeight: "6.5", orient: "auto-start-reverse" });
    mk.appendChild(s("path", { d: "M0 0L10 5L0 10z", class: "pd-head" }));
    defs.appendChild(mk); svg.appendChild(defs);
    (g.edges || []).forEach(function (e) {
      var attrs = { d: e.d, class: "pd-edge" + (e.dashed ? " dashed" : ""), "marker-end": "url(#" + id + ")" };
      if (e.both) attrs["marker-start"] = "url(#" + id + ")";
      svg.appendChild(s("path", attrs));
      if (e.l) svg.appendChild(s("text", { x: e.lx, y: e.ly, "text-anchor": e.la || "middle", class: "pd-elabel" }, e.l));
    });
    (g.labels || []).forEach(function (lb) {
      svg.appendChild(s("text", { x: lb.x, y: lb.y, "text-anchor": lb.a || "middle", class: "pd-elabel" }, lb.t));
    });
    (g.nodes || []).forEach(function (n) {
      svg.appendChild(s("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: n.k === "io" ? n.h / 2 : 6, class: "pd-node pd-" + (n.k || "llm") }));
      var lines = n.t.split("\n");
      lines.forEach(function (ln, i) {
        svg.appendChild(s("text", { x: n.x + n.w / 2, y: n.y + n.h / 2 + 4 + (i - (lines.length - 1) / 2) * 13, "text-anchor": "middle", class: "pd-text" }, ln));
      });
    });
    return svg;
  }
  function meter(n) {
    return h("span", { class: "meter", "aria-label": n + " of 5" }, [1, 2, 3, 4, 5].map(function (k) { return h("i", { class: k <= n ? "on" : "" }); }));
  }
  function renderPatterns() {
    var root = $("#pattern-list");
    D.patterns.forEach(function (p) {
      root.appendChild(h("figure", { class: "pattern", id: "pattern-" + p.id },
        h("div", { class: "pattern-head" }, h("h3", null, p.name), h("span", { class: "kind" }, p.kind)),
        patternSvg(p),
        h("figcaption", { class: "visually-hidden" }, p.alt),
        h("p", null, rich(p.what)),
        h("p", null, h("strong", null, "Use when: "), rich(p.use)),
        h("p", null, h("strong", null, "Example: "), rich(p.example)),
        h("div", { class: "pattern-meta" },
          h("span", null, "Autonomy ", meter(p.autonomy)),
          h("span", null, "Cost ", meter(p.cost)),
          h("span", null, "Predictability ", meter(p.predictability))),
        p.blocks ? h("div", { class: "chips" }, p.blocks.map(function (b) { return chip(b, true); })) : null));
    });
  }

  /* ---------- Build section ---------------------------------------------------- */
  function renderBuild() {
    var ladder = $("#ladder");
    D.ladder.forEach(function (r, i) {
      ladder.appendChild(h("li", { class: "rung" },
        h("span", { class: "lvl" }, "Level", h("b", null, String(i))),
        h("h4", null, r.name),
        h("p", null, rich(r.what)),
        h("p", { class: "climb" }, h("b", null, "Climb when: "), rich(r.climb))));
    });
    var recipe = $("#recipe");
    D.recipe.forEach(function (r) {
      recipe.appendChild(h("li", null,
        h("h4", null, r.title),
        h("p", null, rich(r.text)),
        r.blocks ? h("div", { class: "chips" }, r.blocks.map(function (b) { return chip(b, true); })) : null));
    });
    var flows = $("#flows");
    D.flows.forEach(function (f) {
      var route = h("div", { class: "flow-route" });
      f.route.forEach(function (stop, i) {
        if (i) route.appendChild(h("span", { class: "sep", "aria-hidden": "true" }, "→"));
        route.appendChild(h("span", { class: "stage" }, chip(stop.b, true), stop.n ? h("span", { class: "stage-note" }, stop.n) : null));
      });
      flows.appendChild(h("article", { class: "flow" },
        h("h4", null, f.name),
        h("p", null, rich(f.goal)),
        route,
        f.why ? h("p", null, rich(f.why)) : null));
    });
    var pairs = $("#pairs");
    D.pairs.forEach(function (p) {
      pairs.appendChild(h("div", { class: "pair" },
        h("div", { class: "bad" }, h("span", null, rich(p.bad))),
        h("div", { class: "good" }, h("span", null, rich(p.good)))));
    });
    // Checklist with per-browser persistence.
    var saved = {};
    try { saved = JSON.parse(store("ae-checklist") || "{}") || {}; } catch (e) { saved = {}; }
    var list = $("#checklist");
    D.checklist.forEach(function (item, i) {
      var id = "chk-" + i;
      var input = h("input", { type: "checkbox", id: id, "data-key": item.k });
      input.checked = !!saved[item.k];
      list.appendChild(h("label", { for: id }, input, h("span", null, rich(item.t))));
    });
    function update() {
      var boxes = $$("#checklist input");
      var done = boxes.filter(function (b) { return b.checked; }).length;
      $("#check-count").textContent = done + " of " + boxes.length + " done";
      var state = {};
      boxes.forEach(function (b) { if (b.checked) state[b.getAttribute("data-key")] = 1; });
      store("ae-checklist", JSON.stringify(state));
    }
    list.addEventListener("change", update);
    $("#check-reset").addEventListener("click", function () { $$("#checklist input").forEach(function (b) { b.checked = false; }); update(); });
    var boxes0 = $$("#checklist input");
    $("#check-count").textContent = boxes0.filter(function (b) { return b.checked; }).length + " of " + boxes0.length + " done";
  }

  /* ---------- Protocols -------------------------------------------------------- */
  function renderProtocols() {
    var cols = ["Protocol", "Connects", "Origin", "Governance", "Status (" + D.meta.snapshot + ")"];
    var tbl = h("table", { class: "proto-table" },
      h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, D.protocols.map(function (p, i) {
        var grp = (i === 0 || D.protocols[i - 1].group !== p.group) && p.group ? h("tr", { class: "grp" }, h("th", { colspan: "5", scope: "colgroup" }, p.group)) : null;
        return [grp, h("tr", null,
          h("th", { scope: "row" },
            h("span", { class: "proto-name" }, p.name),
            p.url ? h("a", { class: "proto-link", href: p.url, target: "_blank", rel: "noopener" }, p.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]) : null,
            p.block ? h("div", { style: "margin-top:6px" }, chip(p.block, true)) : null),
          h("td", null, rich(p.connects)),
          h("td", null, rich(p.origin)),
          h("td", null, rich(p.governance)),
          h("td", null, rich(p.status), p.sources && p.sources.length ? h("span", null, " ", p.sources.map(function (src, i) {
            return h("a", { href: src, target: "_blank", rel: "noopener", class: "proto-link", "aria-label": "Source " + (i + 1) + " for " + p.name }, "[" + (i + 1) + "]");
          })) : null))];
      })));
    $("#protocol-table").appendChild(tbl);
  }

  /* ---------- Reference ------------------------------------------------------- */
  function renderReference() {
    var root = $("#reference-list");
    D.zones.forEach(function (z) {
      var ids = z.groups ? z.groups.reduce(function (a, g) { return a.concat(g.blocks); }, []) : z.blocks;
      var box = h("div", { class: "ref-zone", style: "--zc: var(--z-" + z.id + ")" },
        h("h3", null, z.name), h("p", null, z.tag));
      ids.forEach(function (id) {
        var b = BLOCKS[id];
        var d = h("details", { class: "ref", id: "ref-" + id, style: "--zc: var(--z-" + z.id + ")" },
          h("summary", null,
            h("span", { class: "t" }, b.name),
            h("span", { class: "s" }, rich(b.short)),
            h("span", { class: "tw" }, (b.links ? b.links.length : 0) + " sources")),
          h("div", { class: "ref-body" }));
        d.addEventListener("toggle", function () {
          var body = $(".ref-body", d);
          if (d.open && !body.childNodes.length) body.appendChild(blockBody(id, false));
        });
        box.appendChild(d);
      });
      root.appendChild(box);
    });
  }

  /* ---------- Glossary --------------------------------------------------------- */
  function renderGlossary() {
    var root = $("#gloss-list"), input = $("#gloss-search");
    var entries = D.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term, "en", { sensitivity: "base" }); });
    function draw(q) {
      root.textContent = "";
      q = norm(q).trim();
      var shown = entries.filter(function (e) { return !q || norm(e.term + " " + e.def).indexOf(q) !== -1; });
      var letter = "";
      var dl = null;
      shown.forEach(function (e) {
        var L = e.term[0].toUpperCase();
        if (!/[A-Z]/.test(L)) L = "#";
        if (L !== letter) {
          letter = L;
          root.appendChild(h("p", { class: "gloss-letter", "aria-hidden": "true" }, L));
          dl = h("dl"); root.appendChild(dl);
        }
        dl.appendChild(h("div", { class: "gloss-entry" },
          h("dt", null, e.term),
          h("dd", null, rich(e.def), e.block && BLOCKS[e.block] ? h("button", { class: "link-btn", type: "button", "data-block": e.block }, "Open block") : null)));
      });
      if (!shown.length) root.appendChild(h("p", { class: "gloss-empty" }, "No term matches “" + input.value + "”."));
      $("#gloss-count").textContent = shown.length + " of " + entries.length + " terms";
    }
    input.addEventListener("input", function () { draw(input.value); });
    draw("");
  }

  /* ---------- Learn ------------------------------------------------------------ */
  function renderLearn() {
    var root = $("#learn-list");
    D.learn.forEach(function (grp) {
      root.appendChild(h("div", { class: "learn-col" + (grp.wide ? " wide" : "") },
        h("h3", null, grp.title),
        grp.intro ? h("p", null, grp.intro) : null,
        linkList(grp.items)));
    });
  }

  /* ---------- Theme, nav, hash routing ------------------------------------------ */
  function initTheme() {
    var btn = $("#theme-toggle");
    btn.addEventListener("click", function () {
      var root = document.documentElement;
      var explicit = root.getAttribute("data-theme");
      var dark = explicit ? explicit === "dark" : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var nextTheme = dark ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      store("ae-theme", nextTheme);
    });
  }

  function initNav() {
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".site-nav a");
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[en.target.id];
        if (a) { a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) obs.observe(el); });
  }

  function fromHash() {
    var hsh = decodeURIComponent(location.hash || "");
    var m = hsh.match(/^#block-([a-z0-9-]+)$/);
    if (m && BLOCKS[m[1]]) { openBlock(m[1], { fromHash: true }); return; }
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    var st = hsh.match(/^#step-(\d+)$/);
    if (st) {
      var n = parseInt(st[1], 10) - 1;
      if (n >= 0 && n < D.steps.length) setStep(n);
    }
  }

  /* ---------- Boot -------------------------------------------------------------- */
  function boot() {
    if (D.meta.repo) { var rl = $("#repo-link"); if (rl) rl.href = D.meta.repo; }
    renderMap();
    initPlayer();
    initSearch();
    initDrawer();
    renderContext();
    renderCompare();
    renderDecide();
    renderPatterns();
    renderBuild();
    renderProtocols();
    renderReference();
    renderGlossary();
    renderLearn();
    initTheme();
    initNav();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
    fromHash();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
