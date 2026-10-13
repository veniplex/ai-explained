/* Agentic AI, Explained (v6): shared helpers and the hand-drawn sketching.
   Copied from v0.1-alpha/assets/js/app.js and trimmed. Exposes window.V3.sk; the other scripts build on it.
   The hand-drawn shapes come from rough.js (assets/vendor, MIT licence); without it shapes fall back to plain SVG. */
(function () {
  "use strict";

  var V3 = window.V3 = window.V3 || {};
  // Every page knows the way back to the folder of the guided path (data-base on <body>: "" on the home page,
  // "../../" on a term or guide page), so links to terms and guides are plain, shareable addresses.
  var BASE = (document.body && document.body.getAttribute("data-base")) || "";
  var url = {
    base: BASE,
    entry: function (id) { return BASE + "terms/" + id + "/"; },
    guide: function (id) { return BASE + "guides/" + id + "/"; },
    home: function (hash) { return BASE + (hash ? "#" + hash : (BASE ? "" : "./")); }
  };
  var RG = window.rough && window.rough.generator ? window.rough.generator() : null;
  /* ---------- The two voices ----------------------------------------------- */
  // Every section is told twice, side by side: once with the restaurant kitchen and once in plain technical words.
  // There is no switch; voice.js hands each script the words of one voice, and VOICES says how a voice is shown.
  var VOICES = {
    kitchen: { label: "In the kitchen", short: "Kitchen", d: ["M7 14.5h10V19H7z", "M7 14.5C4.8 14 3.5 12.3 3.5 10.4c0-2 1.5-3.5 3.5-3.5.5-1.9 2.2-3 4-3 1.4 0 2.6.6 3.4 1.6.3-.1.6-.1.9-.1 2 0 3.6 1.5 3.6 3.5 0 1.9-1.3 3.6-3.3 4.1"] },
    technical: { label: "In technical words", short: "Technical", d: ["M7.5 7.5h9v9h-9z", "M10.5 10.5h3v3h-3z", "M10 4v3.5M14 4v3.5M10 16.5V20M14 16.5V20M4 10h3.5M4 14h3.5M16.5 10H20M16.5 14H20"] }
  };
  // The small tag that names the voice of a column: a chef's hat for the kitchen, a chip for the technical one.
  function voiceTag(kind, text) {
    var v = VOICES[kind];
    var svg = s("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" });
    v.d.forEach(function (d) { svg.appendChild(s("path", { d: d })); });
    return h("span", { class: "vtag vtag-" + kind }, svg, text || v.label);
  }

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
        var id = inner[0], b = ((window.AE3 || {}).entries || {})[id];
        if (b) frag.appendChild(h("a", { class: "link-btn", href: url.entry(id), "data-entry": id }, inner[1] || b.label || b.name));
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
  var DOODLE = {
    start: function () {
      return [
        { t: "poly", a: [[11, 6], [37, 6]].concat(teeth(11, 37, 38, 8, 4)), fill: "zm" },
        { t: "line", a: [16, 14, 32, 14], sw: 1.3 }, { t: "line", a: [16, 21, 29, 21], sw: 1.3 }, { t: "line", a: [16, 28, 31, 28], sw: 1.3 }
      ];
    },
    model: function () {
      return [
        { t: "circle", a: [15, 21, 17], fill: "paper" }, { t: "circle", a: [33, 21, 17], fill: "paper" }, { t: "circle", a: [24, 14, 20], fill: "paper" },
        { t: "rect", a: [13, 24, 22, 13], fill: "zm" }
      ];
    },
    harness: function () {
      return [
        { t: "path", a: "M18 15c-2.5-2.5 1.5-4.5-.5-7.5", sw: 1.3 }, { t: "path", a: "M24 15c-2.5-2.5 1.5-4.5-.5-7.5", sw: 1.3 }, { t: "path", a: "M30 15c-2.5-2.5 1.5-4.5-.5-7.5", sw: 1.3 },
        { t: "path", a: "M9 21H39V31C39 37 35 41 29 41H19C13 41 9 37 9 31Z", fill: "zm" },
        { t: "line", a: [6, 21, 42, 21], sw: 2 }, { t: "line", a: [9, 25, 4, 25], sw: 1.8 }, { t: "line", a: [39, 25, 44, 25], sw: 1.8 }
      ];
    },
    control: function () {
      return [
        { t: "path", a: "M16 22V16C16 11 19.5 8 24 8C28.5 8 32 11 32 16V22", sw: 2 },
        { t: "rect", a: [11, 21, 26, 20], fill: "zm" },
        { t: "circle", a: [24, 29, 5], fill: "ink", r: 0.3 }, { t: "line", a: [24, 31, 24, 36], sw: 2 }
      ];
    },
    counter: function () {
      return [
        { t: "poly", a: [[8, 6], [26, 6]].concat(teeth(8, 26, 26, 4, 3)), fill: "paper" },
        { t: "line", a: [12, 12, 22, 12], sw: 1.2 }, { t: "line", a: [12, 17, 20, 17], sw: 1.2 },
        { t: "path", a: "M28 31C28 24 32 21 36 21C40 21 44 24 44 31Z", fill: "zm" },
        { t: "circle", a: [36, 18, 3], fill: "ink", r: 0.3 },
        { t: "rect", a: [4, 31, 42, 6], fill: "paper" }, { t: "line", a: [8, 41, 42, 41], sw: 1.6 }
      ];
    },
    know: function () {
      return [
        { t: "path", a: "M24 13C19 10 12 9 6 11V38C12 36 19 37 24 40Z", fill: "paper" },
        { t: "path", a: "M24 13C29 10 36 9 42 11V38C36 36 29 37 24 40Z", fill: "zm" },
        { t: "line", a: [10, 18, 20, 19], sw: 1.1 }, { t: "line", a: [10, 24, 20, 25], sw: 1.1 }, { t: "line", a: [10, 30, 18, 31], sw: 1.1 }
      ];
    },
    tools: function () {
      return [
        { t: "line", a: [20, 5, 20, 13], sw: 2.2 }, { t: "line", a: [28, 5, 28, 13], sw: 2.2 },
        { t: "rect", a: [15, 13, 18, 14], fill: "zm" },
        { t: "path", a: "M24 27V33C24 39 29 42 35 42H44", sw: 1.8 }
      ];
    },
    orch: function () {
      var out = [];
      [[11, 34], [24, 25], [37, 34]].forEach(function (p) {
        var x = p[0], y = p[1];
        out.push(
          { t: "circle", a: [x - 3.5, y - 6, 9], fill: "paper", sw: 1.3 }, { t: "circle", a: [x + 3.5, y - 6, 9], fill: "paper", sw: 1.3 },
          { t: "circle", a: [x, y - 9.5, 10], fill: "paper", sw: 1.3 }, { t: "rect", a: [x - 5.5, y - 4, 11, 8], fill: "zm", sw: 1.3 });
      });
      return out;
    },
    ops: function () {
      return [
        { t: "rect", a: [11, 8, 26, 34], fill: "paper" }, { t: "rect", a: [18, 5, 12, 6], fill: "zm" },
        { t: "path", a: "M15 19l3 3 5-6", sw: 1.8 }, { t: "path", a: "M15 30l3 3 5-6", sw: 1.8 },
        { t: "line", a: [26, 20, 33, 20], sw: 1.3 }, { t: "line", a: [26, 31, 33, 31], sw: 1.3 }
      ];
    }
  };
  // The technical voice has no kitchen picture, but it keeps the small drawings, as plain symbols of the same things:
  // a neural net, a context window, a wrench, a loop, a document, a shield, a tree of agents, a chart. By zone for the
  // map, and by chapter where two chapters share a zone (the counter and the loop).
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
  // `technical` draws the plain symbol instead of the kitchen drawing.
  function doodleSvg(zid, cls, seed, animDelay, chapter, technical) {
    var svg = s("svg", { class: cls || "zone-doodle", viewBox: "0 0 48 48", "aria-hidden": "true", focusable: "false" });
    var shapes = technical ? TICON[TCHAPTER[chapter] || TZONE[zid]] : (DOODLE[chapter] || DOODLE[zid]);
    if (shapes) sketchInto(svg, shapes(), seed || 3, { base: { r: 0.7, bow: 0.8 }, anim: animDelay != null, delay: animDelay || 0, stagger: 0.05 });
    return svg;
  }

  /* ---------- The story pictures (240 × 160) --------------------------------- */
  function arcPt(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  var PICS = {
    order: function () {
      return [
        { t: "line", a: [14, 26, 226, 26], sw: 2.6, r: 0.5 },
        { t: "poly", a: [[30, 27], [60, 27]].concat(teeth(30, 60, 80, 6, 5)), fill: "paper" },
        { t: "rect", a: [30, 27, 30, 9], fill: "orch", r: 0.6 },
        { t: "line", a: [36, 48, 54, 48], sw: 1.2 }, { t: "line", a: [36, 58, 50, 58], sw: 1.2 },
        { t: "poly", a: [[72, 27], [128, 27]].concat(teeth(72, 128, 118, 8, 6)), fill: "paper" },
        { t: "rect", a: [72, 27, 56, 14], fill: "zm", r: 0.6 },
        { t: "line", a: [80, 56, 120, 56], sw: 1.4 }, { t: "line", a: [80, 68, 114, 68], sw: 1.4 }, { t: "line", a: [80, 80, 118, 80], sw: 1.4 }, { t: "line", a: [80, 92, 102, 92], sw: 1.4 },
        { t: "path", a: "M156 120C156 96 167 86 182 86C197 86 208 96 208 120Z", fill: "clay" },
        { t: "rect", a: [146, 120, 72, 9], fill: "ink", r: 0.5 },
        { t: "circle", a: [182, 81, 10], fill: "ink", r: 0.4 },
        { t: "line", a: [214, 92, 226, 84], sw: 1.6 }, { t: "line", a: [216, 104, 230, 104], sw: 1.6 }, { t: "line", a: [150, 92, 138, 84], sw: 1.6 }
      ];
    },
    chef: function () {
      return [
        { t: "circle", a: [78, 106, 58], fill: "paper" },
        { t: "circle", a: [62, 62, 32], fill: "paper" }, { t: "circle", a: [94, 62, 32], fill: "paper" }, { t: "circle", a: [78, 50, 38], fill: "paper" },
        { t: "rect", a: [58, 64, 40, 16], fill: "paper" },
        { t: "circle", a: [70, 104, 5], fill: "ink", r: 0.3 }, { t: "circle", a: [86, 104, 5], fill: "ink", r: 0.3 },
        { t: "path", a: "M70 118Q78 124 86 118", sw: 1.6 },
        { t: "circle", a: [114, 86, 7], fill: "paper" }, { t: "circle", a: [126, 73, 11], fill: "paper" },
        { t: "ellipse", a: [180, 50, 100, 66], fill: "zm" },
        { t: "line", a: [150, 42, 188, 42], sw: 2 }, { t: "lin", a: head(176, 42, 190, 42, 7), sw: 2 },
        { t: "line", a: [150, 58, 176, 58], sw: 2 },
        { t: "path", a: "M184 58l6 6 10-13", sw: 2.4 }
      ];
    },
    counter: function () {
      return [
        { t: "line", a: [14, 30, 226, 30], sw: 1.4 }, { t: "line", a: [14, 23, 14, 37], sw: 1.4 }, { t: "line", a: [226, 23, 226, 37], sw: 1.4 },
        { t: "text", x: 120, y: 22, text: "fixed size" },
        { t: "rect", a: [28, 58, 24, 34], fill: "paper" },
        { t: "line", a: [33, 66, 47, 66], sw: 1.2 }, { t: "line", a: [33, 73, 45, 73], sw: 1.2 }, { t: "line", a: [33, 80, 46, 80], sw: 1.2 },
        { t: "poly", a: [[62, 66], [94, 62], [97, 90], [65, 92]], fill: "know" },
        { t: "path", a: "M104 92C104 77 115 70 128 70C141 70 152 77 152 92Z", fill: "tools" },
        { t: "rect", a: [161, 80, 46, 12], fill: "paper" }, { t: "rect", a: [164, 70, 42, 10], fill: "paper" }, { t: "rect", a: [160, 61, 46, 9], fill: "paper" },
        { t: "rect", a: [14, 92, 212, 14], fill: "zm" },
        { t: "line", a: [30, 106, 30, 148], sw: 2 }, { t: "line", a: [210, 106, 210, 148], sw: 2 },
        { t: "poly", a: [[213, 64], [226, 69], [221, 82], [208, 77]], fill: "control" },
        { t: "line", a: [229, 58, 233, 52], sw: 1.4 }, { t: "line", a: [233, 66, 238, 62], sw: 1.4 }
      ];
    },
    cards: function () {
      return [
        { t: "rect", a: [168, 20, 52, 42], fill: "paper" },
        { t: "circle", a: [194, 22, 6], fill: "clay" },
        { t: "line", a: [176, 34, 212, 34], sw: 1.2 }, { t: "line", a: [176, 43, 206, 43], sw: 1.2 }, { t: "line", a: [176, 52, 210, 52], sw: 1.2 },
        { t: "rect", a: [34, 64, 26, 30], fill: "paper" }, { t: "rect", a: [58, 56, 26, 38], fill: "paper" }, { t: "rect", a: [82, 66, 26, 28], fill: "paper" },
        { t: "rect", a: [26, 84, 96, 52], fill: "zm" },
        { t: "poly", a: [[112, 24], [150, 17], [157, 63], [119, 70]], fill: "paper" },
        { t: "line", a: [121, 34, 146, 30], sw: 1.2 }, { t: "line", a: [122, 44, 148, 40], sw: 1.2 }, { t: "line", a: [123, 54, 141, 51], sw: 1.2 },
        { t: "path", a: "M94 58C96 46 102 40 110 37", sw: 1.4, dash: "3 4", single: true },
        { t: "rect", a: [160, 84, 60, 13], fill: "tools" }, { t: "rect", a: [170, 98, 54, 13], fill: "orch" }, { t: "rect", a: [164, 112, 62, 14], fill: "model" }
      ];
    },
    tools: function () {
      return [
        { t: "rect", a: [172, 38, 50, 66], fill: "paper" },
        { t: "rect", a: [186, 56, 5, 15], fill: "ink", r: 0.3 }, { t: "rect", a: [203, 56, 5, 15], fill: "ink", r: 0.3 },
        { t: "text", x: 197, y: 94, text: "MCP" },
        { t: "path", a: "M110 72C88 72 84 38 60 38C40 38 30 50 16 50", sw: 2 },
        { t: "rect", a: [110, 56, 32, 32], fill: "zm" },
        { t: "line", a: [142, 63, 168, 63], sw: 3, r: 0.4 }, { t: "line", a: [142, 81, 168, 81], sw: 3, r: 0.4 },
        { t: "ellipse", a: [60, 124, 66, 26], fill: "start" },
        { t: "line", a: [92, 127, 128, 139], sw: 4, r: 0.4 },
        { t: "path", a: "M48 106c-3-4 2-7-1-11", sw: 1.3 }, { t: "path", a: "M62 104c-3-4 2-7-1-11", sw: 1.3 }
      ];
    },
    locks: function () {
      return [
        { t: "rect", a: [24, 36, 104, 104], fill: "zt" },
        { t: "line", a: [76, 36, 76, 140], sw: 1.6 },
        { t: "circle", a: [68, 74, 6], fill: "ink", r: 0.3 }, { t: "circle", a: [84, 74, 6], fill: "ink", r: 0.3 },
        { t: "path", a: "M68 104V97C68 92 71.5 89 76 89C80.5 89 84 92 84 97V104", sw: 2.2 },
        { t: "rect", a: [64, 102, 24, 20], fill: "zm" },
        { t: "circle", a: [76, 110, 4], fill: "ink", r: 0.3 }, { t: "line", a: [76, 112, 76, 117], sw: 1.8 },
        { t: "ellipse", a: [184, 40, 52, 24], fill: "paper" }, { t: "ellipse", a: [184, 40, 20, 9], fill: "clay" },
        { t: "path", a: "M150 30Q144 40 150 50", sw: 1.6 }, { t: "path", a: "M218 30Q224 40 218 50", sw: 1.6 },
        { t: "path", a: "M142 24Q134 40 142 56", sw: 1.4 }, { t: "path", a: "M226 24Q234 40 226 56", sw: 1.4 },
        { t: "circle", a: [166, 118, 20], fill: "clay" }, { t: "circle", a: [166, 118, 6], fill: "page" },
        { t: "line", a: [176, 118, 216, 118], sw: 3, r: 0.4 }, { t: "line", a: [206, 118, 206, 127], sw: 2.4 }, { t: "line", a: [214, 118, 214, 129], sw: 2.4 }
      ];
    },
    taste: function () {
      var cx = 196, cy = 98, r = 29, a2 = 2.55, p1 = arcPt(cx, cy, r, a2 - 0.25), p2 = arcPt(cx, cy, r, a2);
      return [
        { t: "path", a: "M64 66c-4-5 3-9-1-15", sw: 1.4 }, { t: "path", a: "M88 62c-4-5 3-9-1-15", sw: 1.4 }, { t: "path", a: "M112 66c-4-5 3-9-1-15", sw: 1.4 },
        { t: "path", a: "M40 82H140V112C140 128 128 138 112 138H68C52 138 40 128 40 112Z", fill: "zm" },
        { t: "line", a: [32, 82, 148, 82], sw: 2.6, r: 0.5 },
        { t: "line", a: [156, 30, 114, 70], sw: 3.2, r: 0.4 },
        { t: "ellipse", a: [108, 75, 20, 12], fill: "paper" },
        { t: "arc", a: [cx, cy, r * 2, r * 2, -2.35, a2, false], sw: 2, r: 0.6 },
        { t: "lin", a: head(p1[0], p1[1], p2[0], p2[1], 9, 0.55), sw: 2, r: 0.4 },
        { t: "text", x: cx, y: cy - 2, text: "taste" }, { t: "text", x: cx, y: cy + 12, text: "adjust" }
      ];
    },
    helpers: function () {
      var out = [
        { t: "ellipse", a: [120, 32, 104, 28], fill: "paper" },
        { t: "circle", a: [104, 29, 13], fill: "know" }, { t: "circle", a: [121, 27, 15], fill: "harness" }, { t: "circle", a: [137, 31, 11], fill: "tools" },
        { t: "path", a: "M50 92C54 70 70 54 90 47", sw: 1.6 }, { t: "lin", a: head(84, 49, 92, 46.5, 8), sw: 1.6 },
        { t: "line", a: [120, 82, 120, 52], sw: 1.6 }, { t: "lin", a: head(120, 60, 120, 51, 8), sw: 1.6 },
        { t: "path", a: "M190 92C186 70 170 54 150 47", sw: 1.6 }, { t: "lin", a: head(156, 49, 148, 46.5, 8), sw: 1.6 }
      ];
      [44, 120, 196].forEach(function (x, i) {
        var y = i === 1 ? 106 : 116;
        out.push(
          { t: "circle", a: [x - 6, y - 10, 13], fill: "paper" }, { t: "circle", a: [x + 6, y - 10, 13], fill: "paper" },
          { t: "circle", a: [x, y - 15, 15], fill: "paper" }, { t: "rect", a: [x - 8, y - 7, 16, 9], fill: "paper" },
          { t: "path", a: "M" + (x - 22) + " " + (y + 8) + "C" + (x - 22) + " " + (y + 26) + " " + (x + 22) + " " + (y + 26) + " " + (x + 22) + " " + (y + 8) + "Z", fill: "zm" });
      });
      return out;
    },
    critics: function () {
      return [
        { t: "rect", a: [22, 28, 62, 96], fill: "paper" }, { t: "rect", a: [40, 21, 26, 12], fill: "zm" },
        { t: "poly", a: star(37, 50, 8), fill: "clay", r: 0.4, sw: 1.3 }, { t: "poly", a: star(53, 50, 8), fill: "clay", r: 0.4, sw: 1.3 }, { t: "poly", a: star(69, 50, 8), fill: "paper", r: 0.4, sw: 1.3 },
        { t: "line", a: [32, 72, 74, 72], sw: 1.3 }, { t: "line", a: [32, 84, 70, 84], sw: 1.3 }, { t: "line", a: [32, 96, 66, 96], sw: 1.3 }, { t: "line", a: [32, 108, 60, 108], sw: 1.3 },
        { t: "line", a: [133, 88, 116, 134], sw: 1.8 }, { t: "line", a: [133, 88, 150, 134], sw: 1.8 }, { t: "line", a: [133, 88, 133, 136], sw: 1.8 },
        { t: "rect", a: [112, 42, 16, 8], fill: "zm" }, { t: "rect", a: [104, 48, 58, 40], fill: "zm" },
        { t: "circle", a: [133, 68, 26], fill: "paper" }, { t: "circle", a: [133, 68, 10], fill: "ink", r: 0.3 },
        { t: "poly", a: [[176, 32], [222, 32]].concat(teeth(176, 222, 124, 8, 6)), fill: "paper" },
        { t: "line", a: [184, 46, 214, 46], sw: 1.2 }, { t: "line", a: [184, 58, 208, 58], sw: 1.2 }, { t: "line", a: [184, 70, 212, 70], sw: 1.2 }, { t: "line", a: [184, 82, 204, 82], sw: 1.2 },
        { t: "line", a: [184, 104, 214, 104], sw: 2 }
      ];
    }
  };
  var PIC_ALT = {
    order: "Order tickets hang on a rail next to a service bell.",
    chef: "A chef in a tall hat thinks; a thought bubble shows two options and a tick.",
    counter: "A crowded counter with a ticket, a recipe card, a bowl and a pile of papers. One item falls off the edge. A line above it says fixed size.",
    cards: "A box of recipe cards with one card pulled out, house rules pinned to the wall, and a stack of cookbooks.",
    tools: "A plug whose cable leads to a wall socket labelled MCP, and a frying pan.",
    locks: "A cupboard with a padlock, a ringing smoke alarm and a key.",
    taste: "A steaming pot with a spoon, and a circular arrow labelled taste, adjust.",
    helpers: "Three helpers with bowls send their results up to one shared plate.",
    critics: "A clipboard with star ratings, a camera on a tripod and a long receipt."
  };
  V3.sk = {
    $: $, $$: $$, h: h, append: append, s: s, clear: clear, rich: rich, store: store, reduced: reduced, norm: norm, pad2: pad2,
    assign: assign, fmtDate: fmtDate, paint: paint, sketchInto: sketchInto, sketchBox: sketchBox, sketchOutline: sketchOutline,
    watch: watch, unwatchWithin: unwatchWithin, isDrawing: isDrawing, flashDraw: flashDraw, head: head, rrect: rrect,
    doodleSvg: doodleSvg, PICS: PICS, PIC_ALT: PIC_ALT, url: url, VOICES: VOICES, voiceTag: voiceTag
  };
})();
