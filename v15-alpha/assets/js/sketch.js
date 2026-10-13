/* AI explained (v15): shared helpers and the hand-drawn sketching.
   Exposes window.V3.sk; the other scripts build on it.
   The hand-drawn shapes come from rough.js (assets/vendor, MIT licence); without it shapes fall back to plain SVG. */
(function () {
  "use strict";

  var V3 = window.V3 = window.V3 || {};
  // Every page knows the way back to the folder of the version (data-base on <body>: "../" on technical/ and story/, "../../" and "../../../" two and
  // three levels down), so links to terms and guides are plain, shareable addresses.
  //   home: the deep dive's chapters and map (technical/), entry: the glossary page of any term (a main term or one of the glossary), glossary, guide, guides, about: the
  //   pages of the glossary, the guides and the about page, kitchen: the kitchen story (story/).
  var BASE = (document.body && document.body.getAttribute("data-base")) || "";
  var url = {
    base: BASE,
    entry: function (id) { return BASE + "glossary/" + id + "/"; },
    guide: function (id) { return BASE + "guides/" + id + "/"; },
    glossary: function () { return BASE + "glossary/"; },
    guides: function () { return BASE + "guides/"; },
    about: function () { return BASE + "about/"; },
    home: function (hash) { return BASE + "technical/" + (hash ? "#" + hash : ""); },
    kitchen: function (hash) { return BASE + "story/" + (hash ? "#" + hash : ""); }
  };
  var RG = window.rough && window.rough.generator ? window.rough.generator() : null;
  /* ---------- Helpers ------------------------------------------------------ */
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
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  // A term by id: a main term (AE3.entries) or a term of the glossary (AE3.glossary), as { name, label }, or null.
  var TERMS = null;
  function termOf(id) {
    var A = window.AE3 || {};
    if (A.entries && A.entries[id]) return A.entries[id];
    if (!TERMS) { TERMS = {}; (A.glossary || []).forEach(function (g) { TERMS[g.id] = { name: g.term, label: g.term }; }); }
    return Object.prototype.hasOwnProperty.call(TERMS, id) ? TERMS[id] : null;
  }

  // A name is written with a capital in the list. In the middle of a sentence it is written as the words around it ("the system prompt"), unless it is a
  // proper name or an acronym (a second capital, a digit, a bracket).
  function inMid(text, at, name) {
    var before = text.slice(0, at).replace(/\s+$/, "");
    if (!before || /[.!?:]$/.test(before) || /\n$/.test(text.slice(0, at))) return name;
    return /^[A-Z][a-z]+( [a-z][a-z-]*)*$/.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
  }

  // Inline markup in data strings: `code`, **bold**, [[entry-id]] or [[entry-id|label]], [text](https://…).
  function rich(text) {
    var frag = document.createDocumentFragment();
    if (!text) return frag;
    var re = /(`[^`]+`|\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\[[^\]]+\]\(https?:[^)\s]+\))/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var tok = m[0];
      if (tok[0] === "`") frag.appendChild(h("code", null, tok.slice(1, -1)));
      else if (tok[0] === "*") frag.appendChild(h("strong", null, tok.slice(2, -2)));
      else if (tok[1] === "[") {
        var inner = tok.slice(2, -2).split("|");
        var id = inner[0], b = termOf(id);
        if (b) frag.appendChild(h("a", { class: "link-btn", href: url.entry(id), "data-entry": id }, inner[1] || inMid(text, m.index, b.label || b.name)));
        else frag.appendChild(document.createTextNode(inner[1] || id));
      } else {
        var lm = tok.match(/^\[([^\]]+)\]\((https?:[^)\s]+)\)$/);
        frag.appendChild(h("a", { href: lm[2], target: "_blank", rel: "noopener" }, lm[1]));
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
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function norm(x) { return (x || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, ""); }
  // For search: the ends of words (-ing, -ed, -es, -s, -e) are dropped on both sides, so "prompt cache" finds "prompt caching".
  function stem(x) { return norm(x).replace(/[a-z0-9]+/g, function (w) { return w.length > 4 ? w.replace(/(ing|ed|es|s|e)$/, "") : w; }); }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function assign(a, b) { return Object.assign({}, a, b); }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function fmtDate(iso) { var p = iso.split("-"); return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0]; }

  /* ---------- Sketching (rough.js) ------------------------------------------ */
  // A shape: { t: rect|ellipse|circle|line|poly|lin|curve|arc|path, a: args, fill, sw, r (roughness),
  //   bow, line (stroke colour), dash, single (one stroke), off (fill offset), anim, delay }.
  function rp(d) { return d.replace(/-?\d*\.\d+/g, function (n) { return String(Math.round(parseFloat(n) * 10) / 10); }); }
  function colour(f) {
    switch (f) {
      case "zm": return "var(--zm)";
      case "zt": return "var(--zt)";
      case "zc": return "var(--zc)";
      case "paper": return "var(--sk-paper)";
      case "page": return "var(--paper)";
      case "ink": return "var(--sk-ink)";
      case "clay": return "var(--clay)";
      default: return "var(--m-" + f + ")";
    }
  }
  function drawable(sh, seed) {
    var o = {
      stroke: sh.noline ? "none" : "INK", strokeWidth: sh.sw || 1.6,
      roughness: sh.r == null ? 1 : sh.r, bowing: sh.bow == null ? 1 : sh.bow,
      seed: 1 + Math.abs(((sh.seed || 0) + seed) % 2000000), disableMultiStroke: !!sh.single
    };
    if (sh.fill) {
      o.fill = "FILL";
      if (sh.hatch) { o.fillStyle = "hachure"; o.hachureGap = sh.gap || 5; o.fillWeight = sh.fw || 1.1; o.hachureAngle = sh.angle == null ? -41 : sh.angle; }
      else o.fillStyle = "solid";
    }
    var a = sh.a;
    switch (sh.t) {
      case "rect": return RG.rectangle(a[0], a[1], a[2], a[3], o);
      case "ellipse": return RG.ellipse(a[0], a[1], a[2], a[3], o);
      case "circle": return RG.circle(a[0], a[1], a[2], o);
      case "line": return RG.line(a[0], a[1], a[2], a[3], o);
      case "poly": return RG.polygon(a, o);
      case "lin": return RG.linearPath(a, o);
      case "curve": return RG.curve(a, o);
      case "arc": return RG.arc(a[0], a[1], a[2], a[3], a[4], a[5], !!a[6], o);
      default: return RG.path(a, o);
    }
  }
  // Plain SVG fallback when rough.js is unavailable.
  function plainShape(sh) {
    var a = sh.a, pts = function (list) { return list.map(function (p) { return p[0] + "," + p[1]; }).join(" "); };
    switch (sh.t) {
      case "rect": return s("rect", { x: a[0], y: a[1], width: a[2], height: a[3], rx: 6 });
      case "ellipse": return s("ellipse", { cx: a[0], cy: a[1], rx: a[2] / 2, ry: a[3] / 2 });
      case "circle": return s("circle", { cx: a[0], cy: a[1], r: a[2] / 2 });
      case "line": return s("line", { x1: a[0], y1: a[1], x2: a[2], y2: a[3] });
      case "poly": return s("polygon", { points: pts(a) });
      case "lin": case "curve": return s("polyline", { points: pts(a) });
      case "path": return s("path", { d: a });
      default: return null;
    }
  }
  function styleFor(el, kind, sh, sw) {
    var st = [];
    if (sh.delay != null) st.push("--d:" + sh.delay.toFixed(2) + "s");
    if (kind === "fill") {
      el.setAttribute("class", "sk-fill" + (sh.anim ? " sk-fade" : ""));
      st.push("fill:" + colour(sh.fill));
      if (sh.off) el.setAttribute("transform", "translate(" + sh.off[0] + " " + sh.off[1] + ")");
    } else if (kind === "hatch") {
      el.setAttribute("class", "sk-hatch" + (sh.anim ? " sk-fade" : ""));
      st.push("stroke:" + colour(sh.fill));
      el.setAttribute("stroke-width", sw);
    } else {
      el.setAttribute("class", "sk-line" + (sh.cls ? " " + sh.cls : "") + (sh.anim && !sh.dash ? " sk-draw" : ""));
      el.setAttribute("stroke-width", sw);
      if (sh.anim && !sh.dash) el.setAttribute("pathLength", "1");
      if (sh.dash) el.setAttribute("stroke-dasharray", sh.dash);
      if (sh.line) st.push("stroke:" + colour(sh.line));
    }
    if (st.length) el.setAttribute("style", st.join(";"));
  }
  function paint(parent, sh, seed) {
    if (!RG) {
      if (sh.fill) { var f = plainShape(sh); if (f) { styleFor(f, "fill", sh); parent.appendChild(f); } }
      if (!sh.noline) { var l = plainShape(sh); if (l) { styleFor(l, "line", assign(sh, { anim: false }), sh.sw || 1.6); parent.appendChild(l); } }
      return;
    }
    RG.toPaths(drawable(sh, seed || 0)).forEach(function (p) {
      var el = s("path", { d: rp(p.d) });
      if (p.fill && p.fill !== "none") styleFor(el, "fill", sh);
      else if (p.stroke === "FILL") styleFor(el, "hatch", sh, p.strokeWidth);
      else if (p.stroke === "INK") styleFor(el, "line", sh, p.strokeWidth);
      else return;
      parent.appendChild(el);
    });
  }
  // Draw a list of shapes into an SVG (cleared first). Text items: { t: "text", x, y, text, anchor, cls }.
  function sketchInto(svg, shapes, seed, opts) {
    opts = opts || {};
    clear(svg);
    var g = s("g");
    shapes.forEach(function (sh, i) {
      if (sh.t === "text") {
        g.appendChild(s("text", { x: sh.x, y: sh.y, "text-anchor": sh.anchor || "middle", class: sh.cls || "sk-label" }, sh.text));
        return;
      }
      var o = opts.base ? assign(opts.base, sh) : sh;
      if (opts.anim) o = assign(o, { anim: true, delay: (opts.delay || 0) + i * (opts.stagger || 0.04) });
      paint(g, o, (seed || 0) + i * 7);
    });
    svg.appendChild(g);
  }
  // Chevron at (x2, y2), pointing in the direction from (x1, y1).
  function head(x1, y1, x2, y2, k, spread) {
    var a = Math.atan2(y2 - y1, x2 - x1), sp = spread || 0.5;
    k = k || 8;
    return [[x2 - k * Math.cos(a - sp), y2 - k * Math.sin(a - sp)], [x2, y2], [x2 - k * Math.cos(a + sp), y2 - k * Math.sin(a + sp)]];
  }
  function teeth(x1, x2, y, n, d) {
    var pts = [], step = (x2 - x1) / n;
    for (var i = 0; i <= n; i++) pts.push([x2 - i * step, y + (i % 2 ? d : 0)]);
    return pts;
  }
  function star(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    return pts;
  }

  // Redraw sketches whenever their element changes size (fonts loading, resizes, layout switches).
  var RO = window.ResizeObserver ? new ResizeObserver(function (entries) { entries.forEach(function (en) { queueDraw(en.target); }); }) : null;
  var drawQueue = [], drawRaf = 0;
  function queueDraw(el) {
    if (drawQueue.indexOf(el) === -1) drawQueue.push(el);
    if (!drawRaf) drawRaf = requestAnimationFrame(function () {
      drawRaf = 0;
      var list = drawQueue; drawQueue = [];
      list.forEach(function (el) { if (el._sk) el._sk(); });
    });
  }
  function watch(el, fn) {
    el._sk = fn;
    el.setAttribute("data-sk", "");
    if (RO) RO.observe(el);
    queueDraw(el);
    if (!RO) window.addEventListener("resize", function () { queueDraw(el); });
  }
  function unwatchWithin(root) {
    if (!RO) return;
    $$("[data-sk]", root).forEach(function (el) { RO.unobserve(el); });
  }
  function isDrawing(el) { return !!el.closest(".is-drawing"); }
  var flashTimers = new WeakMap();
  function flashDraw(el, ms) {
    if (reduced()) return;
    el.classList.add("is-drawing");
    clearTimeout(flashTimers.get(el));
    flashTimers.set(el, setTimeout(function () { el.classList.remove("is-drawing"); }, ms || 1800));
  }

  // Rounded rectangle as a path, so rough.js draws soft corners.
  function rrect(x, y, w, ht, r) {
    r = Math.max(0, Math.min(r, w / 2, ht / 2));
    return "M" + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) +
      "V" + (y + ht - r) + "Q" + (x + w) + " " + (y + ht) + " " + (x + w - r) + " " + (y + ht) +
      "H" + (x + r) + "Q" + x + " " + (y + ht) + " " + x + " " + (y + ht - r) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "Z";
  }

  // A sketched card behind an element: a solid fill plus three outline variants that "boil" on hover.
  function sketchBox(el, opts) {
    opts = opts || {};
    var svg = s("svg", { class: "sk-bg" + (opts.boil === false ? "" : " boil"), "aria-hidden": "true", focusable: "false" });
    el.insertBefore(svg, el.firstChild);
    var first = true, seed = opts.seed || 7;
    watch(el, function () {
      var w = el.offsetWidth, ht = el.offsetHeight;
      if (!w || !ht) return;
      if (svg._w === w && svg._h === ht) return;
      svg._w = w; svg._h = ht;
      svg.setAttribute("viewBox", "-3 -3 " + (w + 6) + " " + (ht + 6));
      clear(svg);
      var anim = first && isDrawing(el);
      first = false;
      var fg = s("g");
      var R = opts.radius == null ? 16 : opts.radius, off = opts.off || [2.5, 3];
      paint(fg, { t: "path", a: rrect(1, 1, w - 2, ht - 2, R), fill: opts.fill || "zt", noline: true, r: opts.fr || 0.9, bow: 0.4, anim: anim, off: off }, seed);
      svg.appendChild(fg);
      var variants = opts.boil === false ? 1 : 3;
      for (var k = 0; k < variants; k++) {
        var g = s("g", { class: "v" + k });
        paint(g, { t: "path", a: rrect(0.5, 0.5, w - 1, ht - 1, R), line: opts.line || "zc", sw: opts.sw || 1.3, r: opts.r || 0.9, bow: 0.6, anim: anim && k === 0 }, seed + 101 * (k + 1));
        svg.appendChild(g);
      }
      el.classList.add("is-sketched");
    });
  }

  // A hand-drawn outline around an element (used by the context bars).
  function sketchOutline(el, seed) {
    var svg = s("svg", { class: "sk-bg", "aria-hidden": "true", focusable: "false" });
    el.appendChild(svg);
    watch(el, function () {
      var w = el.offsetWidth, ht = el.offsetHeight;
      if (!w || !ht || (svg._w === w && svg._h === ht)) return;
      svg._w = w; svg._h = ht;
      svg.setAttribute("viewBox", "0 0 " + w + " " + ht);
      clear(svg);
      paint(svg, { t: "rect", a: [1.5, 1.5, w - 3, ht - 3], sw: 1.4, r: 0.8, bow: 0.6 }, seed);
    });
  }

  /* ---------- Doodles: one small drawing per zone (48 × 48) ------------------ */
  // Plain symbols: a neural net, a context window, a wrench, a loop, a document, a shield, a tree of agents, a chart. By zone for the
  // map, and by chapter where two chapters share a zone (the context and the loop).
  function netNodes() {
    var out = [], L = [[10, 14], [10, 34]], M = [[24, 9], [24, 24], [24, 39]], R = [[38, 24]];
    L.forEach(function (p) { M.forEach(function (q) { out.push({ t: "line", a: [p[0], p[1], q[0], q[1]], sw: 1 }); }); });
    M.forEach(function (q) { out.push({ t: "line", a: [q[0], q[1], 38, 24], sw: 1 }); });
    L.concat(M, R).forEach(function (p, i) { out.push({ t: "circle", a: [p[0], p[1], 8], fill: i < 2 ? "paper" : "zm", sw: 1.3 }); });
    return out;
  }
  var TICON = {
    terminal: function () {
      return [
        { t: "rect", a: [5, 9, 38, 30], fill: "paper" }, { t: "line", a: [5, 17, 43, 17], sw: 1.3 },
        { t: "path", a: "M11 23l5 4-5 4", sw: 2 }, { t: "line", a: [20, 32, 31, 32], sw: 2 }
      ];
    },
    net: netNodes,
    window: function () {
      return [
        { t: "rect", a: [6, 7, 36, 34], fill: "paper" }, { t: "line", a: [6, 14, 42, 14], sw: 1.3 },
        { t: "line", a: [11, 20, 37, 20], sw: 1.3 }, { t: "line", a: [11, 25, 31, 25], sw: 1.3 }, { t: "line", a: [11, 30, 34, 30], sw: 1.3 },
        { t: "rect", a: [11, 34, 26, 3], fill: "zm", sw: 1.1 }
      ];
    },
    wrench: function () {
      return [
        { t: "line", a: [20, 20, 39, 39], sw: 6 },
        { t: "circle", a: [16, 16, 18], fill: "zm" }, { t: "poly", a: [[8, 7], [17, 15], [7, 17]], fill: "page", sw: 1.1 }
      ];
    },
    loop: function () {
      return [
        { t: "path", a: "M13 29C9 21 13 11 23 9C28 8 33 10 36 14", sw: 2.2 }, { t: "lin", a: head(30, 9, 37, 14, 7), sw: 2.2 },
        { t: "path", a: "M35 19C39 27 35 37 25 39C20 40 15 38 12 34", sw: 2.2 }, { t: "lin", a: head(18, 39, 11, 34, 7), sw: 2.2 },
        { t: "circle", a: [24, 24, 8], fill: "zm", sw: 1.3 }
      ];
    },
    doc: function () {
      return [
        { t: "path", a: "M12 5H29L38 14V43H12Z", fill: "paper" }, { t: "path", a: "M29 5V14H38", sw: 1.3 },
        { t: "rect", a: [16, 19, 10, 5], fill: "zm", sw: 1.1 }, { t: "line", a: [16, 29, 34, 29], sw: 1.2 }, { t: "line", a: [16, 34, 31, 34], sw: 1.2 }
      ];
    },
    shield: function () {
      return [
        { t: "path", a: "M24 5L38 10V23C38 32 32 39 24 43C16 39 10 32 10 23V10Z", fill: "zm" },
        { t: "path", a: "M17 24l5 5 9-11", sw: 2.4 }
      ];
    },
    tree: function () {
      return [
        { t: "path", a: "M24 13V24", sw: 1.4 }, { t: "path", a: "M10 34V24H38V34", sw: 1.4 },
        { t: "rect", a: [17, 5, 14, 9], fill: "zm" },
        { t: "rect", a: [3, 34, 14, 9], fill: "paper" }, { t: "rect", a: [17, 34, 14, 9], fill: "paper" }, { t: "rect", a: [31, 34, 14, 9], fill: "paper" },
        { t: "line", a: [24, 24, 24, 34], sw: 1.4 }
      ];
    },
    bars: function () {
      return [
        { t: "path", a: "M8 5V41H43", sw: 1.6 },
        { t: "rect", a: [13, 26, 7, 15], fill: "zm" }, { t: "rect", a: [24, 18, 7, 23], fill: "zm" }, { t: "rect", a: [35, 9, 7, 32], fill: "zm" }
      ];
    },
    db: function () {
      return [
        { t: "path", a: "M9 12V35C9 39 16 42 24 42S39 39 39 35V12", fill: "zm" },
        { t: "path", a: "M9 23C9 27 16 30 24 30S39 27 39 23", sw: 1.3 },
        { t: "ellipse", a: [24, 12, 30, 11], fill: "paper" }
      ];
    }
  };
  var TZONE = { start: "terminal", model: "net", harness: "loop", control: "shield", know: "db", tools: "wrench", orch: "tree", ops: "bars" };
  var TCHAPTER = { chef: "net", counter: "window", tools: "wrench", loop: "loop", recipes: "doc", locks: "shield", helpers: "tree", "kitchen-ops": "bars" };
  // `chapter` (optional) picks the technical symbol of a chapter; otherwise the zone's one.
  function doodleSvg(zid, cls, seed, animDelay, chapter) {
    var svg = s("svg", { class: cls || "zone-doodle", viewBox: "0 0 48 48", "aria-hidden": "true", focusable: "false" });
    var shapes = TICON[TCHAPTER[chapter] || TZONE[zid]];
    if (shapes) sketchInto(svg, shapes(), seed || 3, { base: { r: 0.7, bow: 0.8 }, anim: animDelay != null, delay: animDelay || 0, stagger: 0.05 });
    return svg;
  }

  V3.sk = {
    $: $, $$: $$, h: h, append: append, s: s, clear: clear, rich: rich, store: store, reduced: reduced, norm: norm, stem: stem, pad2: pad2,
    assign: assign, fmtDate: fmtDate, paint: paint, sketchInto: sketchInto, sketchBox: sketchBox, sketchOutline: sketchOutline,
    watch: watch, unwatchWithin: unwatchWithin, isDrawing: isDrawing, flashDraw: flashDraw, head: head, rrect: rrect,
    doodleSvg: doodleSvg, url: url
  };
})();
