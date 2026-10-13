/* Agentic AI, Explained: rendering and interaction.
   Plain JavaScript, no build step. All content lives in data.js (window.AE).
   The hand-drawn shapes come from rough.js (assets/vendor, MIT licence); without it
   the page falls back to plain shapes.
   The entry page is only the map. Details (drawer), guides (sheet) and the
   walkthrough (player) open on interaction and have their own deep links. */
(function () {
  "use strict";

  var D = window.AE;
  if (!D) return;
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

  // Inline markup in data strings: `code`, **bold**, [[block-id]] or [[block-id|label]], [text](https://…).
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
        var id = inner[0], b = BLOCKS[id];
        if (b) frag.appendChild(h("button", { class: "link-btn", type: "button", "data-block": id }, inner[1] || b.label || b.name));
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

  /* ---------- Data indexes ------------------------------------------------- */
  var BLOCKS = D.blocks, ZONES = {}, CONNS = {}, ORDER = [];
  D.zones.forEach(function (z) { ZONES[z.id] = z; });
  D.connectors.forEach(function (c) { CONNS[c.id] = c; });
  function zoneBlocks(z) { return z.groups ? z.groups.reduce(function (a, g) { return a.concat(g.blocks); }, []) : z.blocks; }
  D.zones.forEach(function (z) {
    zoneBlocks(z).forEach(function (id) { if (BLOCKS[id]) { BLOCKS[id].zone = z.id; ORDER.push(id); } });
  });
  Object.keys(BLOCKS).forEach(function (id) { BLOCKS[id].id = id; });
  D.steps.forEach(function (st, i) {
    st.blocks.forEach(function (id) { var b = BLOCKS[id]; if (b) (b._steps = b._steps || []).push(i); });
  });
  var SOURCE_COUNT = ORDER.reduce(function (a, id) { return a + (BLOCKS[id].links || []).length; }, 0);

  function chip(id) {
    var b = BLOCKS[id];
    if (!b) return null;
    return h("button", { class: "chip", type: "button", "data-block": id, "data-zone": b.zone }, b.label || b.name);
  }
  function zoneChip(zid) {
    var z = ZONES[zid];
    return h("button", { class: "chip", type: "button", "data-zone-open": zid, "data-zone": zid }, z.name);
  }

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
  function doodleSvg(zid, cls, seed, animDelay) {
    var svg = s("svg", { class: cls || "zone-doodle", viewBox: "0 0 48 48", "aria-hidden": "true", focusable: "false" });
    if (DOODLE[zid]) sketchInto(svg, DOODLE[zid](), seed || 3, { base: { r: 0.7, bow: 0.8 }, anim: animDelay != null, delay: animDelay || 0, stagger: 0.05 });
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

  /* ---------- The map ------------------------------------------------------ */
  var mapEl = $("#map"), stageEl = $("#main");
  var DELAY = { start: 0, ctask: 0.12, harness: 0.16, control: 0.34, model: 0.3, capi: 0.42, tools: 0.36, ctool: 0.48,
    know: 0.48, cctx: 0.6, orch: 0.54, cdele: 0.66, cops: 0.72, ops: 0.78, ctas: 0.86, cap: 0.94, stamp: 1 };
  var animate = !reduced();

  function delayStyle(key) { return "--d:" + (DELAY[key] || 0) + "s"; }
  function blkItem(id) {
    var b = BLOCKS[id];
    return h("li", null, h("button", { class: "blk", type: "button", "data-block": id },
      h("i", { class: "zdot blk-dot", "aria-hidden": "true" }), h("span", { class: "blk-t" }, b.label || b.name)));
  }
  function zoneHead(z) {
    return h("div", { class: "zone-head" },
      h("h2", { class: "zone-h" }, h("button", { class: "zone-title", type: "button", "data-zone-open": z.id, id: "zt-" + z.id }, z.name)),
      h("span", { class: "zone-nick" }, z.nick));
  }
  function zoneEl(id, extra) {
    var z = ZONES[id];
    var el = h("section", { class: "zone" + (extra ? " " + extra : ""), "data-zone": id, "data-area": id, "aria-labelledby": "zt-" + id, style: delayStyle(id) },
      zoneHead(z), h("ul", { class: "blk-list" }, z.blocks.map(blkItem)));
    el.appendChild(doodleSvg(id, "zone-doodle", 3 + id.length, animate ? (DELAY[id] || 0) + 0.45 : null));
    sketchBox(el, { seed: 11 + id.length * 17 });
    return el;
  }
  function controlEl() {
    var z = ZONES.control;
    var el = h("section", { class: "zone zone-control", "data-zone": "control", "aria-labelledby": "zt-control", style: delayStyle("control") },
      zoneHead(z), h("ul", { class: "blk-list" }, z.blocks.map(blkItem)));
    el.appendChild(doodleSvg("control", "zone-doodle", 5, animate ? DELAY.control + 0.45 : null));
    sketchBox(el, { seed: 211 });
    return el;
  }
  function harnessEl() {
    var z = ZONES.harness;
    var loopBtn = h("button", { class: "loop", type: "button", "data-block": "agent-loop", "aria-label": LOOP_LABEL });
    var el = h("section", { class: "zone zone-harness", "data-zone": "harness", "data-area": "harness", "aria-labelledby": "zt-harness", style: delayStyle("harness") },
      zoneHead(z),
      loopBtn,
      h("div", { class: "groups" }, z.groups.map(function (g) {
        return h("div", { class: "group" }, h("span", { class: "eyebrow group-name" }, g.name), h("ul", { class: "blk-list" }, g.blocks.map(blkItem)));
      })),
      controlEl());
    el.appendChild(doodleSvg("harness", "zone-doodle", 9, animate ? DELAY.harness + 0.45 : null));
    sketchBox(el, { seed: 97, sw: 1.4 });
    return { el: el, loop: loopBtn };
  }
  function connEl(id, area) {
    var c = CONNS[id], a = ZONES[c.from], b = ZONES[c.to];
    var el = h("button", {
      class: "conn " + (c.vertical ? "conn-v" : "conn-h"), type: "button", "data-conn": id, "data-area": area, style: delayStyle(area),
      "aria-label": c.label + ": between the " + a.name.toLowerCase() + " and the " + b.name.toLowerCase() + (c.sub ? ", " + c.sub : "")
    },
      h("span", { class: "conn-text" },
        h("span", { class: "conn-glyph", "aria-hidden": "true" }, c.dir === "both" ? "⇅" : "↑"),
        h("span", { class: "conn-label" }, c.label),
        c.sub ? h("span", { class: "conn-sub" }, c.sub) : null,
        h("span", { class: "conn-to" }, "with the harness")));
    drawConnector(el, c, 300 + area.length * 13);
    return el;
  }
  function connAxis(el) { return (getComputedStyle(el).getPropertyValue("--conn-axis") || "h").trim(); }
  function drawConnector(el, c, seed) {
    var svg = s("svg", { class: "sk-conn", "aria-hidden": "true", focusable: "false" });
    el.insertBefore(svg, el.firstChild);
    var first = true;
    watch(el, function () {
      var w = el.offsetWidth, ht = el.offsetHeight, axis = connAxis(el), key = w + "x" + ht + axis;
      if (svg._k === key) return;
      svg._k = key;
      clear(svg);
      if (axis === "none" || !w || !ht) return;
      svg.setAttribute("viewBox", "0 0 " + w + " " + ht);
      var anim = first && isDrawing(el);
      first = false;
      var x1, y1, x2, y2;
      if (axis === "h") { y1 = y2 = Math.round(ht / 2); x1 = 7; x2 = w - 7; }
      else { x1 = x2 = Math.round(w / 2); y1 = 5; y2 = ht - 5; }
      var g = s("g"), o = { sw: 1.7, r: 0.8, bow: 1.4, anim: anim };
      paint(g, assign(o, { t: "line", a: [x1, y1, x2, y2] }), seed);
      if (c.dir === "both" || c.dir === "right") paint(g, assign(o, { t: "lin", a: head(x1, y1, x2, y2, 9) }), seed + 3);
      if (c.dir === "both") paint(g, assign(o, { t: "lin", a: head(x2, y2, x1, y1, 9) }), seed + 5);
      svg.appendChild(g);
      // Moving dots, shown while the walkthrough uses this connection.
      var off = c.dir === "both" ? 4 : 0;
      if (axis === "h") {
        svg.appendChild(s("path", { class: "conn-flow", d: "M" + (x1 + 12) + " " + (y1 - off) + "H" + (x2 - 12) }));
        if (off) svg.appendChild(s("path", { class: "conn-flow conn-flow-rev", d: "M" + (x1 + 12) + " " + (y1 + off) + "H" + (x2 - 12) }));
      } else {
        svg.appendChild(s("path", { class: "conn-flow", d: "M" + (x1 - off) + " " + (y1 + 10) + "V" + (y2 - 10) }));
        if (off) svg.appendChild(s("path", { class: "conn-flow conn-flow-rev", d: "M" + (x1 + off) + " " + (y1 + 10) + "V" + (y2 - 10) }));
      }
    });
  }
  function ctaArrow(seed) {
    var svg = s("svg", { class: "cta-doodle", viewBox: "0 0 74 40", "aria-hidden": "true", focusable: "false" });
    sketchInto(svg, [
      { t: "path", a: "M6 5C10 24 30 34 60 29", sw: 1.5, r: 0.7 },
      { t: "lin", a: head(52, 31, 62, 28.6, 8, 0.55), sw: 1.5, r: 0.5 }
    ], seed, animate ? { anim: true, delay: DELAY.ctas + 0.3, stagger: 0.2 } : null);
    return svg;
  }
  var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var ICON_HAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 14.5C5 14 3.8 11.7 4.8 9.8c.9-1.7 3-2.1 4.3-1.1C9.8 6.7 10.8 5.8 12 5.8s2.2.9 2.9 2.9c1.3-1 3.4-.6 4.3 1.1 1 1.9-.2 4.2-2.7 4.7"/><path d="M7.5 14.5v4h9v-4"/><path d="M7.5 16.3h9"/></svg>';
  function iconSvg(svgText) { var sp = document.createElement("span"); sp.innerHTML = svgText; return sp.firstChild; }

  var LOOP_LABEL = "The agent loop: the harness assembles the context, the model decides, the action is checked, the tool runs and its result is added to the context; then the next turn starts. A reply without a tool call ends the loop with the final answer. Open the agent loop.";
  var LOOP = null;

  function renderMap() {
    var hz = harnessEl();
    var caption = h("p", { class: "map-caption", "data-area": "cap", style: delayStyle("cap") },
      h("b", null, "An agent is a model that uses tools in a loop."), " Everything else on this map helps that loop see, act and stay safe. ",
      h("span", { class: "cap-hint" }, "Tap any block to open it."));
    var ctas = h("div", { class: "map-ctas" },
      h("div", { class: "cta", "data-area": "cta-l", style: delayStyle("ctas") },
        h("button", { class: "btn btn-ink", type: "button", id: "btn-play", "data-tour": "0" }, iconSvg(ICON_PLAY), "Watch one run"),
        h("span", { class: "cta-note" }, D.steps.length + " steps, from the task to the result"),
        ctaArrow(5)),
      h("div", { class: "cta", "data-area": "cta-r", style: delayStyle("ctas") },
        h("button", { class: "btn", type: "button", id: "btn-story", "data-guide": "story" }, iconSvg(ICON_HAT), "Explain it like I'm 5"),
        h("span", { class: "cta-note" }, "the same map, as a restaurant kitchen"),
        ctaArrow(8)));
    var stamp = h("div", { class: "map-stamp", "data-area": "stamp", style: delayStyle("stamp") },
      h("span", { class: "stamp-mark" }, "Snapshot · " + D.meta.snapshot),
      h("span", { class: "stamp-line" }, ORDER.length + " blocks · " + SOURCE_COUNT + " checked sources"),
      h("span", { class: "stamp-line" },
        h("button", { class: "link-btn", type: "button", "data-guide": "about" }, "About this map"), " · ",
        h("a", { href: D.meta.repo, target: "_blank", rel: "noopener" }, "GitHub")));
    clear(mapEl);
    append(mapEl, [
      caption, ctas,
      zoneEl("start", "zone-row"), connEl("c-task", "ctask"), hz.el,
      connEl("c-api", "capi"), zoneEl("model", "zone-side"),
      connEl("c-ctx", "cctx"), zoneEl("know", "zone-side"),
      connEl("c-tool", "ctool"), zoneEl("tools", "zone-side"),
      connEl("c-dele", "cdele"), zoneEl("orch", "zone-side"),
      connEl("c-ops", "cops"), zoneEl("ops", "zone-row"),
      stamp
    ]);
    LOOP = buildLoop(hz.loop);
    if (animate) {
      mapEl.classList.add("is-drawing");
      setTimeout(function () { mapEl.classList.remove("is-drawing"); }, 2600);
    }
  }

  // On desktops the whole map should fit on one screen. Shrink it gently (never below 84 %) when the window is short.
  var fitRaf = 0;
  function fitMap() {
    fitRaf = 0;
    if (!("zoom" in document.documentElement.style)) return;
    mapEl.style.zoom = "";
    if (window.innerWidth <= 1080) return;
    var avail = window.innerHeight - $(".bar").offsetHeight - 36, natural = mapEl.offsetHeight;
    if (natural > avail + 2) mapEl.style.zoom = Math.max(0.84, avail / natural).toFixed(3);
  }
  function queueFit() { if (!fitRaf) fitRaf = requestAnimationFrame(fitMap); }

  /* ---------- The agent loop drawing --------------------------------------- */
  var STATIONS = [
    { id: "assemble", name: ["Assemble", "context"], sub: "prompt, notes, results", zone: "harness" },
    { id: "model", name: ["Model", "decides"], sub: "answer, or call a tool?", zone: "model" },
    { id: "check", name: ["Check", "the action"], sub: "permissions, hooks", zone: "control" },
    { id: "run", name: ["Run", "the tool"], sub: "sandbox, MCP, API", zone: "tools" },
    { id: "result", name: ["Add", "the result"], sub: "back into the context", zone: "harness" }
  ];
  var LOOP_GEO = {
    wide: {
      w: 520, h: 206, cx: 260, cy: 106, rx: 134, ry: 64, oneLine: true, ang: [198, 270, 342, 54, 126],
      lab: [[118, 82, "end"], [276, 16, "start"], [402, 82, "start"], [352, 180, "start"], [168, 180, "end"]],
      exit: { d: "M253 38C240 24 224 15 204 12", hx: [212, 13.2, 203, 12], lx: 198, ly: 16, anchor: "end" }
    },
    narrow: {
      w: 340, h: 300, cx: 170, cy: 168, rx: 90, ry: 98, oneLine: false, ang: [198, 270, 342, 54, 126],
      lab: [[70, 134, "end"], [186, 38, "start"], [270, 134, "start"], [236, 270, "start"], [104, 270, "end"]],
      exit: { d: "M163 66C152 50 140 40 124 33", hx: [131, 35.5, 123, 32.6], lx: 118, ly: 36, anchor: "end" }
    }
  };
  function buildLoop(btn) {
    var svg = s("svg", { "aria-hidden": "true", focusable: "false" });
    btn.appendChild(svg);
    var geo = null, mode = null, path = null, L = 1, stLen = [], token = null, glow = null, exitPath = null, exitL = 1;
    var DWELL = 700, TRAVEL = 9400, fast = false;
    // state "run": the token circles on its own; "hold": it rests at holdLen (or at the end of the exit path).
    var state = "run", cycleT = 0, holdLen = 0, holdExit = false, holdId = null, tween = null;
    var raf = 0, lastTs = 0, visible = true;

    function idx(id) { for (var i = 0; i < STATIONS.length; i++) if (STATIONS[i].id === id) return i; return -1; }
    function ptAt(deg) { var a = deg * Math.PI / 180; return [geo.cx + geo.rx * Math.cos(a), geo.cy + geo.ry * Math.sin(a)]; }
    function nearestLen(p) {
      var best = 0, bd = Infinity;
      for (var i = 0; i <= 400; i++) {
        var l = L * i / 400, q = path.getPointAtLength(l), d = (q.x - p[0]) * (q.x - p[0]) + (q.y - p[1]) * (q.y - p[1]);
        if (d < bd) { bd = d; best = l; }
      }
      return best;
    }
    function draw() {
      var keepLen = path ? currentLen() / L : 0;
      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + geo.w + " " + geo.h);
      var anim = isDrawing(btn), g = s("g"), base = DELAY.harness + 0.35;
      paint(g, { t: "ellipse", a: [geo.cx, geo.cy, geo.rx * 2, geo.ry * 2], sw: 1.8, r: 0.7, bow: 0.5, anim: anim, delay: base }, 41);
      [234, 306, 18, 90, 162].forEach(function (deg, i) {
        var p1 = ptAt(deg - 6), p2 = ptAt(deg);
        paint(g, { t: "lin", a: head(p1[0], p1[1], p2[0], p2[1], 8, 0.6), sw: 1.8, r: 0.5, anim: anim, delay: base + 0.5 }, 50 + i);
      });
      var ex = geo.exit;
      paint(g, { t: "path", a: ex.d, sw: 1.5, r: 0.5, dash: "4 4", single: true }, 61);
      paint(g, { t: "lin", a: head(ex.hx[0], ex.hx[1], ex.hx[2], ex.hx[3], 8), sw: 1.5, r: 0.4, anim: anim, delay: base + 0.6 }, 62);
      svg.appendChild(g);
      svg.appendChild(s("text", { x: geo.cx, y: geo.cy - 2, "text-anchor": "middle", class: "lp-center" }, "the agent loop"));
      svg.appendChild(s("text", { x: geo.cx, y: geo.cy + 17, "text-anchor": "middle", class: "lp-center-sub" }, "repeat until done"));
      svg.appendChild(s("text", { x: ex.lx, y: ex.ly, "text-anchor": ex.anchor, class: "lp-exit-label", "data-st": "exit" }, geo.oneLine ? "no tool call: final answer" : "final answer"));
      STATIONS.forEach(function (st, i) {
        var p = ptAt(geo.ang[i]), lb = geo.lab[i];
        var sg = s("g", { class: "lp-st", "data-st": st.id, "data-zone": st.zone });
        var node = s("g", { class: "lp-node" });
        paint(node, { t: "circle", a: [p[0], p[1], 15], fill: "zm", sw: 1.6, r: 0.5, anim: anim, delay: base + 0.2 + i * 0.08 }, 70 + i);
        sg.appendChild(node);
        if (geo.oneLine) {
          sg.appendChild(s("text", { x: lb[0], y: lb[1], "text-anchor": lb[2], class: "lp-name" }, st.name.join(" ")));
          sg.appendChild(s("text", { x: lb[0], y: lb[1] + 15, "text-anchor": lb[2], class: "lp-sub" }, st.sub));
        } else {
          sg.appendChild(s("text", { x: lb[0], y: lb[1], "text-anchor": lb[2], class: "lp-name" }, st.name[0]));
          sg.appendChild(s("text", { x: lb[0], y: lb[1] + 16, "text-anchor": lb[2], class: "lp-name" }, st.name[1]));
        }
        svg.appendChild(sg);
      });
      var cx = geo.cx, cy = geo.cy, rx = geo.rx, ry = geo.ry;
      path = s("path", { d: "M" + (cx - rx) + " " + cy + "A" + rx + " " + ry + " 0 1 1 " + (cx + rx) + " " + cy + "A" + rx + " " + ry + " 0 1 1 " + (cx - rx) + " " + cy, fill: "none", stroke: "none" });
      exitPath = s("path", { d: ex.d, fill: "none", stroke: "none" });
      svg.appendChild(path);
      svg.appendChild(exitPath);
      L = path.getTotalLength() || 1;
      exitL = exitPath.getTotalLength() || 1;
      stLen = STATIONS.map(function (st, i) { return nearestLen(ptAt(geo.ang[i])); });
      glow = s("circle", { r: 13, class: "lp-glow" });
      token = s("circle", { r: 6.5, class: "lp-token" });
      svg.appendChild(glow);
      svg.appendChild(token);
      // A layout switch keeps the token at the same place in the cycle.
      if (state === "hold") holdLen = holdId && idx(holdId) >= 0 ? stLen[idx(holdId)] : keepLen * L;
      tween = null;
      render();
    }
    function layout() {
      var m = btn.clientWidth < 470 ? "narrow" : "wide";
      if (m === mode && svg.firstChild) return;
      mode = m; geo = LOOP_GEO[m];
      draw();
    }
    function segLen(i) { var a = stLen[i], b = i + 1 < stLen.length ? stLen[i + 1] : stLen[0] + L; return b - a; }
    function travelMs(i) { return (fast ? TRAVEL * 0.45 : TRAVEL) * segLen(i) / L; }
    function cycleMs() { var t = 0; for (var i = 0; i < stLen.length; i++) t += DWELL + travelMs(i); return t; }
    function stationTime(k) { var t = 0; for (var i = 0; i < k; i++) t += DWELL + travelMs(i); return t; }
    function ease(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function unease(y) { return y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt(2 * (1 - y)) / 2; }
    function posAt(t) {
      var total = cycleMs();
      t = ((t % total) + total) % total;
      for (var i = 0; i < stLen.length; i++) {
        if (t < DWELL) return { len: stLen[i] % L, at: i };
        t -= DWELL;
        var tr = travelMs(i);
        if (t < tr) return { len: (stLen[i] + segLen(i) * ease(t / tr)) % L, at: -1 };
        t -= tr;
      }
      return { len: stLen[0], at: 0 };
    }
    function timeForLen(len) {
      for (var k = 0; k < stLen.length; k++) {
        var d = ((len - stLen[k]) % L + L) % L;
        if (d < 0.5) return stationTime(k);
        if (d < segLen(k)) return stationTime(k) + DWELL + travelMs(k) * unease(d / segLen(k));
      }
      return 0;
    }
    function currentLen() { return state === "run" ? posAt(cycleT).len : holdLen; }
    function placeAt(pt) {
      var x = pt.x.toFixed(1), y = pt.y.toFixed(1);
      token.setAttribute("cx", x); token.setAttribute("cy", y);
      glow.setAttribute("cx", x); glow.setAttribute("cy", y);
    }
    function highlight(id) {
      $$("[data-st]", svg).forEach(function (el) { el.classList.toggle("is-here", el.getAttribute("data-st") === id); });
    }
    function render() {
      if (!path) return;
      if (tween) {
        var f = Math.min(1, (performance.now() - tween.t0) / tween.dur), e = ease(f);
        if (tween.kind === "loop") placeAt(path.getPointAtLength((tween.from + tween.dist * e) % L));
        else placeAt(exitPath.getPointAtLength(exitL * (tween.back ? 1 - e : e)));
        if (f >= 1) { var done = tween.done; tween = null; if (done) done(); }
        return;
      }
      if (state === "run") {
        var p = posAt(cycleT);
        placeAt(path.getPointAtLength(p.len));
        highlight(p.at >= 0 ? STATIONS[p.at].id : null);
      } else {
        placeAt(holdExit ? exitPath.getPointAtLength(exitL) : path.getPointAtLength(holdLen));
        highlight(holdId);
      }
    }
    // Pause while a guide covers the map.
    function shouldRun() { return visible && !document.hidden && !sheetOpen && (!!tween || (state === "run" && !reduced())); }
    function frame(ts) {
      raf = 0;
      var dt = lastTs ? Math.min(100, ts - lastTs) : 16;
      lastTs = ts;
      if (state === "run" && !tween && !reduced()) cycleT += dt;
      render();
      if (shouldRun()) raf = requestAnimationFrame(frame);
      else lastTs = 0;
    }
    function kick() {
      if (raf) return;
      if (shouldRun()) { lastTs = 0; raf = requestAnimationFrame(frame); }
      else render();
    }
    function hold(len, id, onExit) { state = "hold"; holdLen = len; holdId = id; holdExit = !!onExit; }
    function tweenLoop(target, done) {
      var from = currentLen(), dist = ((target - from) % L + L) % L;
      hold(from, null, false);
      if (reduced() || dist < 1) { done(); render(); return; }
      tween = { kind: "loop", from: from, dist: dist, t0: performance.now(), dur: Math.min(1500, 350 + dist * 2.4), done: done };
      kick();
    }
    function tweenExit(back, done) {
      if (reduced()) { done(); render(); return; }
      tween = { kind: "exit", back: back, t0: performance.now(), dur: back ? 450 : 700, done: done };
      kick();
    }
    function leaveExit(then) {
      if (state === "hold" && holdExit) tweenExit(true, function () { hold(stLen[1], null, false); then(); });
      else then();
    }
    if (RO) new ResizeObserver(function () { layout(); }).observe(btn);
    else window.addEventListener("resize", layout);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(btn);
    document.addEventListener("visibilitychange", kick);
    layout();
    kick();
    return {
      // Rest at a station ("assemble", "model", "check", "run", "result" or "exit"); null freezes in place.
      park: function (id) {
        if (!path) return;
        tween = null;
        if (!id) { if (!(state === "hold" && holdExit)) hold(currentLen(), null, false); else holdId = null; render(); return; }
        leaveExit(function () {
          if (id === "exit") {
            tweenLoop(stLen[1], function () {
              hold(stLen[1], "model", false);
              tweenExit(false, function () { hold(stLen[1], "exit", true); render(); });
            });
            return;
          }
          var k = Math.max(0, idx(id));
          tweenLoop(stLen[k], function () { hold(stLen[k], id, false); render(); });
        });
      },
      wake: function () { kick(); },
      // Circle on its own again; fast for the "Loop" step of the walkthrough.
      run: function (isFast) {
        if (!path) return;
        tween = null;
        leaveExit(function () {
          if (state === "run" && fast === !!isFast) { kick(); return; }
          var len = currentLen();
          fast = !!isFast;
          cycleT = timeForLen(len);
          state = "run"; holdExit = false; holdId = null;
          kick();
        });
      }
    };
  }

  /* ---------- Overlay plumbing: scrim, focus, history --------------------------- */
  var scrim = $("#scrim"), bodyLocks = 0;
  var lastHash = location.hash;
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
      setTimeout(function () { if (!drawerOpen && !sheetOpen) scrim.hidden = true; }, reduced() ? 0 : 260);
    }
    document.body.classList.toggle("is-locked", on);
  }
  function topDialog() { return drawerOpen ? drawer : sheetOpen ? sheet : null; }
  function trapTab(e) {
    var dlg = topDialog();
    if (!dlg) return;
    var f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', dlg).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], act = document.activeElement;
    if (!dlg.contains(act)) { first.focus(); e.preventDefault(); return; }
    if (f.indexOf(act) === -1) { (e.shiftKey ? last : first).focus(); e.preventDefault(); return; }
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
  function underlyingHash() { return sheetOpen && sheetId ? "#" + sheetId : ""; }

  /* ---------- Drawer: block, zone and connection details ------------------------ */
  var drawer = $("#drawer"), drawerOpen = false, drawerReturn = null, drawerKey = null;
  var TYPE_LABEL = { definition: "Explainer", docs: "Docs", guide: "Guide", paper: "Paper", spec: "Spec", video: "Video", course: "Course", blog: "Essay", tool: "Tool", law: "Law", standard: "Standard", book: "Book" };

  function linkList(links) {
    return h("ul", { class: "links" }, links.map(function (l) {
      var meta = [l.by, l.year].filter(Boolean).join(" · ");
      return h("li", null,
        h("span", { class: "badge link-type" + (l.type ? " link-type-" + l.type : "") }, TYPE_LABEL[l.type] || l.type || "Link"),
        h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.title),
        h("span", { class: "link-meta" }, meta + (l.note ? (meta ? " · " : "") + l.note : "")));
    }));
  }
  function section(title, body) {
    if (!body) return null;
    return h("div", { class: "bd-section" }, h("h3", null, title), body);
  }
  function bulletList(items, cls) {
    if (!items || !items.length) return null;
    return h("ul", { class: "bd-list" + (cls ? " bd-list-" + cls : "") }, items.map(function (t) { return h("li", null, rich(t)); }));
  }
  function stepChips(idx, title) {
    if (!idx || !idx.length) return null;
    return h("div", { class: "enter" },
      h("span", { class: "eyebrow def-label" }, title),
      h("div", { class: "enter-steps" }, idx.map(function (i) {
        return h("button", { class: "step-chip", type: "button", "data-step": i, title: "Show step " + (i + 1) + " on the map" }, h("b", { class: "badge badge-clay" }, pad2(i + 1)), D.steps[i].title);
      })));
  }
  function eli5Card(text, zid, label) {
    var card = h("div", { class: "eli5", "data-zone": zid },
      h("div", null, h("span", { class: "eyebrow eli5-label" }, label || "Like I'm 5"), h("p", { class: "eli5-text" }, rich(text))),
      doodleSvg(zid, "eli5-doodle", 13, animate ? 0.15 : null));
    sketchBox(card, { seed: 29 + zid.length, boil: false, sw: 1.3 });
    return card;
  }
  function blockBody(id) {
    var b = BLOCKS[id];
    var wrap = h("div", { class: "bd", "data-zone": b.zone });
    if (b.eli5) wrap.appendChild(eli5Card(b.eli5, b.zone));
    wrap.appendChild(h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, "In one sentence"), rich(b.short)));
    wrap.appendChild(stepChips(b._steps, "Where it enters a run"));
    var deep = h("div", { class: "deep" }, h("p", { class: "eyebrow deep-title" }, "The details"));
    if (b.what) deep.appendChild(section("What it is", h("div", { class: "prose" }, [].concat(b.what).map(function (p) { return h("p", null, rich(p)); }))));
    deep.appendChild(section("Use it when", bulletList(b.when)));
    deep.appendChild(section("Watch out", bulletList(b.avoid, "warn")));
    deep.appendChild(section("Current practice", bulletList(b.sota, "sota")));
    if (b.facts && b.facts.length) {
      deep.appendChild(section("Status, " + D.meta.snapshot, h("ul", { class: "bd-facts" }, b.facts.map(function (f) {
        return h("li", null, rich(f.text), " ", f.source ? h("a", { href: f.source, target: "_blank", rel: "noopener" }, "source") : null);
      }))));
    }
    if (b.examples && b.examples.length) deep.appendChild(section("Examples", h("div", { class: "bd-examples" }, b.examples.map(function (e) { return h("span", null, e); }))));
    if (b.links && b.links.length) deep.appendChild(section("Learn more", linkList(b.links)));
    if (b.related && b.related.length) deep.appendChild(section("Related blocks", h("div", { class: "chips" }, b.related.map(chip))));
    wrap.appendChild(deep);
    wrap.appendChild(copyRow("#block-" + id));
    return wrap;
  }
  function zoneBody(zid) {
    var z = ZONES[zid];
    var wrap = h("div", { class: "bd", "data-zone": zid });
    wrap.appendChild(eli5Card(z.eli5, zid));
    wrap.appendChild(h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, "In one sentence"), rich(z.tag)));
    var links = D.connectors.filter(function (c) { return c.from === zid || c.to === zid; });
    if (zid === "control") links = [];
    var linkBox = zid === "control"
      ? h("p", { class: "prose-s" }, "Part of the ", h("button", { class: "link-btn", type: "button", "data-zone-open": "harness" }, "harness"), ": it checks every tool call before and after it runs.")
      : links.length ? h("ul", { class: "conn-list" }, links.map(function (c) {
        return h("li", null, h("button", { class: "card", type: "button", "data-conn-open": c.id }, h("b", null, c.label), h("span", null, rich(c.text))));
      })) : null;
    wrap.appendChild(section("How it connects", linkBox));
    var ids = zoneBlocks(z);
    if (zid === "harness") ids = ids.concat(ZONES.control.blocks);
    wrap.appendChild(section("Its building blocks", h("ul", { class: "zone-view-blocks" }, ids.map(function (bid) {
      var b = BLOCKS[bid];
      return h("li", null, h("button", { type: "button", "data-block": bid, "data-zone": b.zone }, h("i", { class: "zdot", "aria-hidden": "true" }), h("b", null, b.name), h("span", null, rich(b.short))));
    }))));
    wrap.appendChild(copyRow("#zone-" + zid));
    return wrap;
  }
  function connBody(cid) {
    var c = CONNS[cid];
    var other = c.from === "harness" ? c.to : c.from;
    var wrap = h("div", { class: "bd", "data-zone": other });
    wrap.appendChild(eli5Card(c.eli5, other));
    wrap.appendChild(h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, "What flows here"), rich(c.text)));
    var idx = D.steps.map(function (st, i) { return (st.conn || []).indexOf(cid) !== -1 ? i : -1; }).filter(function (i) { return i >= 0; });
    wrap.appendChild(stepChips(idx, "When it is used in a run"));
    wrap.appendChild(section("It connects", h("div", { class: "chips" }, [zoneChip(c.from), zoneChip(c.to)])));
    wrap.appendChild(copyRow("#link-" + cid.slice(2)));
    return wrap;
  }
  function copyRow(hash) {
    return h("p", { class: "copy-row" }, h("button", { class: "link-btn", type: "button", "data-copy": hash }, "Copy a link to this"));
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
  function arrowFor(c) { return c.dir === "both" ? " ⇄ " : " → "; }
  function fillDrawer(o) {
    var body = $("#drawer-body");
    unwatchWithin(body);
    clear(body);
    drawer.setAttribute("data-zone", o.zone);
    var eb = $("#drawer-eyebrow");
    clear(eb);
    eb.appendChild(h("i", { class: "zdot", "aria-hidden": "true" }));
    eb.appendChild(document.createTextNode(o.eyebrow));
    $("#drawer-title").textContent = o.title;
    body.appendChild(o.body);
    body.scrollTop = 0;
    var pb = $("#drawer-prev"), nb = $("#drawer-next");
    pb.textContent = "← " + o.prev.label; nb.textContent = o.next.label + " →";
    [[pb, o.prev], [nb, o.next]].forEach(function (pair) {
      ["data-block", "data-zone-open", "data-conn-open"].forEach(function (a) { pair[0].removeAttribute(a); });
      pair[0].setAttribute(pair[1].attr, pair[1].id);
    });
    $$(".blk.is-selected", mapEl).forEach(function (x) { x.classList.remove("is-selected"); });
    if (o.kind === "block") $$('.blk[data-block="' + o.id + '"]', mapEl).forEach(function (x) { x.classList.add("is-selected"); });
    flashDraw(body, 1500);
    showDrawer(o.hash, o.fromHash);
  }
  function showDrawer(hash, fromHash) {
    var wasOpen = drawerOpen;
    closeMenu();
    if (playing) pause();
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
  function neighbour(list, id, step) { var k = list.indexOf(id); return list[(k + step + list.length) % list.length]; }
  function openBlock(id, opts) {
    opts = opts || {};
    var b = BLOCKS[id];
    if (!b) return;
    var z = ZONES[b.zone], prev = neighbour(ORDER, id, -1), next = neighbour(ORDER, id, 1);
    drawerKey = "block:" + id;
    fillDrawer({
      kind: "block", id: id, zone: b.zone, eyebrow: z.name, title: b.name, body: blockBody(id), hash: "#block-" + id, fromHash: opts.fromHash,
      prev: { attr: "data-block", id: prev, label: BLOCKS[prev].label || BLOCKS[prev].name },
      next: { attr: "data-block", id: next, label: BLOCKS[next].label || BLOCKS[next].name }
    });
  }
  function openZone(zid, opts) {
    opts = opts || {};
    var z = ZONES[zid];
    if (!z) return;
    var ids = D.zones.map(function (x) { return x.id; }), prev = neighbour(ids, zid, -1), next = neighbour(ids, zid, 1);
    drawerKey = "zone:" + zid;
    fillDrawer({
      kind: "zone", id: zid, zone: zid, eyebrow: "Zone · " + z.nick, title: z.name, body: zoneBody(zid), hash: "#zone-" + zid, fromHash: opts.fromHash,
      prev: { attr: "data-zone-open", id: prev, label: ZONES[prev].name }, next: { attr: "data-zone-open", id: next, label: ZONES[next].name }
    });
  }
  function openConn(cid, opts) {
    opts = opts || {};
    var c = CONNS[cid];
    if (!c) return;
    var ids = D.connectors.map(function (x) { return x.id; }), prev = neighbour(ids, cid, -1), next = neighbour(ids, cid, 1);
    var other = c.from === "harness" ? c.to : c.from;
    var title = c.label.charAt(0).toUpperCase() + c.label.slice(1);
    drawerKey = "conn:" + cid;
    fillDrawer({
      kind: "conn", id: cid, zone: other, eyebrow: "Connection · " + ZONES[c.from].name + arrowFor(c) + ZONES[c.to].name, title: title, body: connBody(cid), hash: "#link-" + cid.slice(2), fromHash: opts.fromHash,
      prev: { attr: "data-conn-open", id: prev, label: CONNS[prev].label }, next: { attr: "data-conn-open", id: next, label: CONNS[next].label }
    });
  }
  function closeDrawer(opts) {
    opts = opts || {};
    if (!drawerOpen) return;
    drawerOpen = false; drawerKey = null;
    drawer.classList.remove("is-open");
    $$(".blk.is-selected", mapEl).forEach(function (x) { x.classList.remove("is-selected"); });
    setTimeout(function () { if (!drawerOpen) drawer.hidden = true; }, reduced() ? 0 : 320);
    syncScrim();
    if (!opts.fromHash) setHash(underlyingHash(), true);
    if (!opts.noFocus) {
      var back = sheetOpen && drawerReturn && !sheet.contains(drawerReturn) ? $("#sheet-close") : drawerReturn;
      if (back && document.contains(back)) back.focus({ preventScroll: true });
    }
  }

  /* ---------- Sheet: the guides ------------------------------------------------- */
  var sheet = $("#sheet"), sheetOpen = false, sheetId = null, sheetReturn = null, GCACHE = {};
  function openGuide(id, opts) {
    opts = opts || {};
    var g = D.guides[id];
    if (!g || !RENDER[id]) return;
    closeMenu();
    if (!player.hidden) closeTour({ silent: true });
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    $("#sheet-eyebrow").textContent = g.eyebrow;
    $("#sheet-title").textContent = g.title;
    var lede = $("#sheet-lede");
    clear(lede);
    if (g.lede) lede.appendChild(rich(g.lede));
    lede.hidden = !g.lede;
    var body = $("#sheet-body");
    clear(body);
    var node = GCACHE[id] || (GCACHE[id] = RENDER[id]());
    body.appendChild(node);
    if (node._open) node._open();
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
    if (!opts.fromHash) setHash("#" + id, wasOpen);
    else lastHash = location.hash;
  }
  function closeSheet(opts) {
    opts = opts || {};
    if (!sheetOpen) return;
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    sheetOpen = false; sheetId = null;
    sheet.classList.remove("is-open");
    if (LOOP) LOOP.wake();
    setTimeout(function () { if (!sheetOpen) sheet.hidden = true; }, reduced() ? 0 : 380);
    syncScrim();
    if (!opts.fromHash) setHash("", true);
    if (!opts.noFocus && sheetReturn && document.contains(sheetReturn)) sheetReturn.focus({ preventScroll: true });
  }

  /* ---------- Guide renderers ---------------------------------------------------- */
  function renderStory() {
    var k = 0, n = D.story.length;
    var svg = s("svg", { viewBox: "0 0 240 160", role: "img" });
    var fig = h("figure", { class: "story-fig" }, svg);
    var count = h("p", { class: "story-count" }), title = h("h3", { class: "story-title" }), text = h("p", { class: "story-text" });
    var blocks = h("div", { class: "story-blocks" });
    var prev = h("button", { class: "btn btn-sm", type: "button" }, "← Back");
    var next = h("button", { class: "btn btn-ink btn-sm", type: "button" }, "Next →");
    var dots = h("div", { class: "story-dots", role: "group", "aria-label": "Pictures" });
    D.story.forEach(function (sl, i) {
      dots.appendChild(h("button", { type: "button", "aria-label": "Picture " + (i + 1) + ": " + sl.title, onclick: function () { go(i); } }));
    });
    var col = h("div", { class: "story-col" }, count, title, text, blocks, h("div", { class: "story-nav" }, prev, dots, next));
    var root = h("div", { class: "story" }, fig, col);
    function go(i) {
      k = Math.max(0, Math.min(n - 1, i));
      var sl = D.story[k];
      fig.setAttribute("data-zone", sl.zone);
      svg.setAttribute("aria-label", sl.title + ". " + (PIC_ALT[sl.id] || ""));
      flashDraw(fig, 2200);
      sketchInto(svg, PICS[sl.id] ? PICS[sl.id]() : [], 17 + k * 13, { base: { r: 0.9 }, anim: animate, delay: 0.05, stagger: 0.035 });
      count.textContent = pad2(k + 1) + " / " + pad2(n);
      title.textContent = sl.title;
      clear(text); text.appendChild(rich(sl.text));
      clear(blocks);
      blocks.appendChild(h("span", { class: "eyebrow" }, "On the map"));
      blocks.appendChild(h("div", { class: "chips" }, sl.blocks.map(chip)));
      prev.disabled = k === 0;
      next.textContent = k === n - 1 ? "Explore the map →" : "Next →";
      $$("button", dots).forEach(function (d, j) { if (j === k) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current"); });
      col.classList.remove("story-slide"); void col.offsetWidth; col.classList.add("story-slide");
    }
    prev.addEventListener("click", function () { go(k - 1); });
    next.addEventListener("click", function () { if (k === n - 1) closeSheet(); else go(k + 1); });
    root._open = function () { go(0); };
    root._key = function (e) {
      if (e.key === "ArrowRight") { if (k < n - 1) go(k + 1); return true; }
      if (e.key === "ArrowLeft") { if (k > 0) go(k - 1); return true; }
      return false;
    };
    return root;
  }
  function renderIdeas() {
    return h("ol", { class: "ideas" }, D.ideas.map(function (it, i) {
      return h("li", null, h("span", { class: "idea-num", "aria-hidden": "true" }, String(i + 1)), h("h3", null, it.t), h("p", null, rich(it.d)),
        h("div", { class: "chips" }, (it.blocks || []).map(chip)));
    }));
  }
  function renderSteps() {
    return h("ol", { class: "steps-list" }, D.steps.map(function (st, i) {
      return h("li", { class: i >= 3 && i <= 9 ? "is-in-loop" : null },
        h("span", { class: "num" }, pad2(i + 1)),
        h("div", null,
          h("h3", null, st.title, h("button", { class: "link-btn", type: "button", "data-step": i }, "Show on the map")),
          h("p", null, rich(st.text)),
          h("div", { class: "chips" }, st.blocks.map(chip)),
          st.note ? h("p", { class: "loop-note" }, rich(st.note)) : null));
    }));
  }
  function renderContext() {
    var root = h("div", { class: "ctx-wrap" });
    D.context.rows.forEach(function (row, ri) {
      var bar = h("div", { class: "ctx-bar", role: "img", "aria-label": row.title + ": " + row.segs.map(function (sg) { return sg.label + " " + sg.pct + "%"; }).join(", ") });
      row.segs.forEach(function (sg) {
        bar.appendChild(h("div", {
          class: "ctx-seg" + (sg.cls ? " ctx-seg-" + sg.cls : ""), "data-zone": sg.zone || "start", title: sg.label + ": about " + sg.pct + "% of the window",
          style: "flex: 0 0 " + sg.pct + "%"
        }, sg.pct >= 7 ? sg.label : ""));
      });
      sketchOutline(bar, 400 + ri * 9);
      var scroller = h("div", { class: "ctx-bar-scroll" });
      if (row.cache) scroller.appendChild(h("div", { class: "ctx-cache", "aria-hidden": "true" }, h("span", { style: "width:" + row.cache + "%" }, h("em", null, "cached prefix: reused at a fraction of the cost"))));
      scroller.appendChild(bar);
      var subs = null;
      if (row.subs) {
        subs = h("div", { class: "ctx-sub" }, h("span", null, row.subs.label),
          row.subs.bars.map(function (sb) {
            return h("span", { class: "ctx-mini", title: sb.title, role: "img", "aria-label": sb.title },
              sb.segs.map(function (sg) { return h("span", { class: "ctx-seg" + (sg.cls ? " ctx-seg-" + sg.cls : ""), "data-zone": sg.zone || "start", style: "flex: 0 0 " + sg.pct + "%" }); }));
          }));
      }
      var brk = h("p", { class: "ctx-break" }, row.segs.filter(function (sg) { return !/free/.test(sg.cls || ""); }).map(function (sg) {
        return h("span", { "data-zone": sg.zone || "start" }, h("i", { "aria-hidden": "true" }), (sg.full || sg.label) + " " + sg.pct + "%");
      }));
      root.appendChild(h("div", { class: "ctx-row" },
        h("div", { class: "ctx-row-head" }, h("h3", null, row.title), h("span", { class: "meta" }, row.meta)),
        scroller, brk, subs, h("p", { class: "cap" }, rich(row.caption))));
    });
    var lg = h("div", { class: "ctx-legend" });
    D.context.legend.forEach(function (l) { lg.appendChild(h("span", { "data-zone": l.zone }, h("i"), l.label)); });
    lg.appendChild(h("span", null, h("i", { class: "free-i" }), "Free space"));
    root.appendChild(lg);
    if (D.context.note) root.appendChild(h("p", { class: "sheet-note" }, rich(D.context.note)));
    return root;
  }
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
  function renderCompare() {
    var c = D.compare, g = D.guides.compare;
    var tbl = h("table", { class: "cmp" },
      h("thead", null, h("tr", null, c.columns.map(function (col) { return h("th", { scope: "col" }, col); }))),
      h("tbody", null, c.rows.map(function (r) {
        return h("tr", null,
          h("th", { scope: "row" }, r.block ? chip(r.block) : r.name),
          r.cells.map(function (cell, i) {
            if (i === c.detCol) {
              var cls = /^yes/i.test(cell) ? "yes" : /^no/i.test(cell) ? "no" : "part";
              return h("td", null, h("span", { class: "tag tag-" + cls }, cell));
            }
            return h("td", null, rich(cell));
          }));
      })));
    return h("div", null, h("div", { class: "card table-scroll" }, tbl), g.note ? h("p", { class: "sheet-note" }, rich(g.note)) : null);
  }
  function renderDecide() {
    return h("div", { class: "decide" }, D.decide.map(function (d) {
      return h("div", { class: "card decide-item" },
        h("p", { class: "need" }, h("span", { class: "eyebrow need-pre" }, "I want my agent to "), d.need),
        h("div", { class: "use" }, h("span", { class: "arrow", "aria-hidden": "true" }, "→"), h("span", { class: "visually-hidden" }, "Use: "), d.use.map(chip)),
        h("p", { class: "why" }, rich(d.why)));
    }));
  }
  var KIND_FILL = { io: "paper", llm: "model", tool: "tools", gate: "control", human: "start", agent: "harness" };
  function pathPoints(d) {
    var pts = [], x = 0, y = 0, re = /([MLHV])\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?/g, m;
    while ((m = re.exec(d))) {
      if (m[1] === "M" || m[1] === "L") { x = +m[2]; y = +m[3]; }
      else if (m[1] === "H") x = +m[2];
      else y = +m[2];
      pts.push([x, y]);
    }
    return pts;
  }
  function patternSvg(p) {
    var g = p.svg, seed = p.id.length * 31;
    var svg = s("svg", { viewBox: "0 0 " + g.w + " " + g.h, role: "img", "aria-label": p.alt });
    var lay = s("g");
    (g.edges || []).forEach(function (e, i) {
      var pts = pathPoints(e.d), n = pts.length;
      paint(lay, { t: "path", a: e.d, sw: 1.4, r: 0.5, bow: 0.4, dash: e.dashed ? "4 4" : null, single: !!e.dashed }, seed + i);
      paint(lay, { t: "lin", a: head(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], 7), sw: 1.4, r: 0.3 }, seed + 50 + i);
      if (e.both) paint(lay, { t: "lin", a: head(pts[1][0], pts[1][1], pts[0][0], pts[0][1], 7), sw: 1.4, r: 0.3 }, seed + 80 + i);
      if (e.l) lay.appendChild(s("text", { x: e.lx, y: e.ly, "text-anchor": e.la || "middle", class: "pd-elabel" }, e.l));
    });
    (g.labels || []).forEach(function (lb) { lay.appendChild(s("text", { x: lb.x, y: lb.y, "text-anchor": lb.a || "middle", class: "pd-elabel" }, lb.t)); });
    (g.nodes || []).forEach(function (nd, i) {
      var k = nd.k || "llm";
      if (k === "io") paint(lay, { t: "ellipse", a: [nd.x + nd.w / 2, nd.y + nd.h / 2, nd.w, nd.h], fill: KIND_FILL[k], sw: 1.4, r: 0.6 }, seed + 120 + i);
      else paint(lay, { t: "rect", a: [nd.x, nd.y, nd.w, nd.h], fill: KIND_FILL[k], sw: 1.4, r: 0.6, bow: 0.4 }, seed + 120 + i);
      var lines = nd.t.split("\n");
      lines.forEach(function (ln, j) {
        lay.appendChild(s("text", { x: nd.x + nd.w / 2, y: nd.y + nd.h / 2 + 4 + (j - (lines.length - 1) / 2) * 13, "text-anchor": "middle", class: "pd-text" }, ln));
      });
    });
    svg.appendChild(lay);
    return svg;
  }
  function meter(n) {
    return h("span", { class: "meter", role: "img", "aria-label": n + " of 5" }, [1, 2, 3, 4, 5].map(function (k) { return h("i", { class: k <= n ? "is-on" : null }); }));
  }
  function renderPatterns() {
    var g = D.guides.patterns;
    return h("div", null,
      h("div", { class: "patterns" }, D.patterns.map(function (p) {
        return h("figure", { class: "card pattern", id: "pattern-" + p.id },
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
          p.blocks ? h("div", { class: "chips" }, p.blocks.map(chip)) : null);
      })),
      g.note ? h("p", { class: "sheet-note" }, rich(g.note)) : null);
  }
  function renderBuild() {
    var root = h("div");
    root.appendChild(h("div", { class: "build-grid" },
      h("div", null,
        h("h3", { class: "subhead" }, "The complexity ladder"),
        h("p", { class: "sub-lede" }, "Start on the lowest rung that could work. Climb only when your evals show the current rung fails."),
        h("ol", { class: "ladder" }, D.ladder.map(function (r, i) {
          return h("li", { class: "card rung" },
            h("span", { class: "lvl" }, "Level", h("b", null, String(i))),
            h("h4", null, r.name), h("p", null, rich(r.what)),
            h("p", { class: "climb" }, h("b", null, "Climb when: "), rich(r.climb)));
        }))),
      h("div", null,
        h("h3", { class: "subhead" }, "Twelve steps to a reliable flow"),
        h("ol", { class: "recipe" }, D.recipe.map(function (r) {
          return h("li", null, h("h4", null, r.title), h("p", null, rich(r.text)), r.blocks ? h("div", { class: "chips" }, r.blocks.map(chip)) : null);
        })))));
    root.appendChild(h("h3", { class: "subhead" }, "Four example flows"));
    root.appendChild(h("p", { class: "sub-lede" }, "Typical routes through the map. Each stop is a building block; open it to read more."));
    root.appendChild(h("div", { class: "flows" }, D.flows.map(function (f) {
      var route = h("div", { class: "flow-route" });
      f.route.forEach(function (stop, i) {
        if (i) route.appendChild(h("span", { class: "sep", "aria-hidden": "true" }, "→"));
        route.appendChild(h("span", { class: "flow-stop" }, chip(stop.b), stop.n ? h("span", { class: "flow-stop-note" }, stop.n) : null));
      });
      return h("article", { class: "card flow" }, h("h4", null, f.name), h("p", null, rich(f.goal)), route, f.why ? h("p", null, rich(f.why)) : null);
    })));
    root.appendChild(h("h3", { class: "subhead" }, "Common mistakes and what to do instead"));
    root.appendChild(h("div", { class: "pairs" }, D.pairs.map(function (p) {
      return h("div", { class: "card pair" },
        h("div", { class: "pair-bad" }, h("span", { class: "visually-hidden" }, "Mistake: "), rich(p.bad)),
        h("div", { class: "pair-good" }, h("span", { class: "visually-hidden" }, "Instead: "), rich(p.good)));
    })));
    root.appendChild(h("h3", { class: "subhead" }, "Pre-launch checklist"));
    var saved = {};
    try { saved = JSON.parse(store("ae-checklist") || "{}") || {}; } catch (e) { saved = {}; }
    var list = h("div", { class: "checklist" });
    D.checklist.forEach(function (item, i) {
      var input = h("input", { type: "checkbox", id: "chk-" + i, "data-key": item.k });
      input.checked = !!saved[item.k];
      list.appendChild(h("label", { for: "chk-" + i }, input, h("span", null, rich(item.t))));
    });
    var count = h("span");
    var reset = h("button", { class: "link-btn", type: "button" }, "Clear all");
    function update(save) {
      var boxes = $$("input", list), done = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = done + " of " + boxes.length + " done";
      if (!save) return;
      var state = {};
      boxes.forEach(function (b) { if (b.checked) state[b.getAttribute("data-key")] = 1; });
      store("ae-checklist", JSON.stringify(state));
    }
    list.addEventListener("change", function () { update(true); });
    reset.addEventListener("click", function () { $$("input", list).forEach(function (b) { b.checked = false; }); update(true); });
    update(false);
    root.appendChild(list);
    root.appendChild(h("div", { class: "checklist-meta" }, count, reset));
    return root;
  }
  function renderProtocols() {
    var cols = ["Protocol", "Connects", "Origin", "Governance", "Status (" + D.meta.snapshot + ")"];
    var tbl = h("table", { class: "proto" },
      h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, D.protocols.map(function (p, i) {
        var grp = (i === 0 || D.protocols[i - 1].group !== p.group) && p.group ? h("tr", { class: "grp" }, h("th", { colspan: "5", scope: "colgroup" }, p.group)) : null;
        return [grp, h("tr", null,
          h("th", { scope: "row" },
            h("span", { class: "proto-name" }, p.name),
            p.url ? h("a", { class: "proto-link", href: p.url, target: "_blank", rel: "noopener" }, p.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]) : null,
            p.block ? h("div", { class: "proto-chip" }, chip(p.block)) : null),
          h("td", null, rich(p.connects)),
          h("td", null, rich(p.origin)),
          h("td", null, rich(p.governance)),
          h("td", null, rich(p.status), p.sources && p.sources.length ? h("span", null, " ", p.sources.map(function (src, j) {
            return h("a", { href: src, target: "_blank", rel: "noopener", class: "proto-link", "aria-label": "Source " + (j + 1) + " for " + p.name }, "[" + (j + 1) + "]");
          })) : null))];
      })));
    return h("div", { class: "card table-scroll" }, tbl);
  }
  function renderBlocksIndex() {
    return h("div", { class: "index" }, D.zones.map(function (z) {
      return h("section", { class: "index-zone", "data-zone": z.id },
        h("h3", null, h("button", { class: "zone-title", type: "button", "data-zone-open": z.id }, z.name)),
        h("p", null, z.nick),
        h("ul", { class: "zone-view-blocks" }, zoneBlocks(z).map(function (bid) {
          var b = BLOCKS[bid];
          return h("li", null, h("button", { type: "button", "data-block": bid, "data-zone": b.zone }, h("i", { class: "zdot", "aria-hidden": "true" }), h("b", null, b.name), h("span", null, rich(b.short))));
        })));
    }));
  }
  function renderGlossary() {
    var listEl = h("div", { class: "gloss" });
    var input = h("input", { id: "gloss-search", type: "search", placeholder: "Filter terms", autocomplete: "off", spellcheck: "false" });
    var countEl = h("span", { class: "gloss-count", "aria-live": "polite" });
    var entries = D.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term, "en", { sensitivity: "base" }); });
    function draw(q) {
      clear(listEl);
      q = norm(q).trim();
      var shown = entries.filter(function (e) { return !q || norm(e.term + " " + e.def).indexOf(q) !== -1; });
      var letter = "", dl = null;
      shown.forEach(function (e) {
        var L = e.term[0].toUpperCase();
        if (!/[A-Z]/.test(L)) L = "#";
        if (L !== letter) {
          letter = L;
          listEl.appendChild(h("p", { class: "gloss-letter", "aria-hidden": "true" }, L));
          dl = h("dl"); listEl.appendChild(dl);
        }
        dl.appendChild(h("div", { class: "gloss-entry" },
          h("dt", null, e.term),
          h("dd", null, rich(e.def), e.block && BLOCKS[e.block] ? h("button", { class: "link-btn", type: "button", "data-block": e.block }, "Open block") : null)));
      });
      if (!shown.length) listEl.appendChild(h("p", { class: "gloss-empty" }, "No term matches “" + input.value + "”."));
      countEl.textContent = shown.length + " of " + entries.length + " terms";
    }
    input.addEventListener("input", function () { draw(input.value); });
    draw("");
    return h("div", null,
      h("div", { class: "gloss-tools" },
        h("div", { class: "search-field" },
          iconSvg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>'),
          h("label", { class: "visually-hidden", for: "gloss-search" }, "Filter the glossary"), input),
        countEl),
      listEl);
  }
  function renderLearn() {
    return h("div", { class: "learn-grid" }, D.learn.map(function (grp) {
      return h("div", { class: "learn-col" + (grp.wide ? " learn-col-wide" : "") }, h("h3", null, grp.title), grp.intro ? h("p", null, grp.intro) : null, linkList(grp.items));
    }));
  }
  function renderAbout() {
    return h("div", { class: "about" },
      h("div", null,
        h("h3", null, "What this is"),
        h("p", null, "A free, open-source explainer of agentic AI as of ", h("strong", null, D.meta.snapshot), ". The field moves fast: product names and versions change, but the building blocks and the reasons behind them change slowly."),
        h("p", null, "Every block starts with a simple picture from a restaurant kitchen, then gives the precise definition, the moment it enters a run, when to use it, what to watch out for, current practice, dated status notes and vetted sources."),
        h("h3", null, "How sources were chosen"),
        h("ul", null,
          h("li", null, "Primary sources first: vendor documentation and engineering blogs, specifications, standards bodies and regulators."),
          h("li", null, "Seminal or widely cited papers, linked to their arXiv or publisher pages."),
          h("li", null, "Videos only from large, reputable channels known for careful explanations."),
          h("li", null, "Every link was checked when the snapshot was made. Dated facts say when they were true.")),
        h("h3", null, "Corrections"),
        h("p", null, "Found an error or a broken link? ", h("a", { href: D.meta.repo + "/issues", target: "_blank", rel: "noopener" }, "Open an issue on GitHub"),
          ". All content lives in one file, ", h("code", null, "assets/js/data.js"), "."),
        h("p", null, "Last updated: ", h("time", { datetime: D.meta.updated }, fmtDate(D.meta.updated)), ".")),
      h("div", null,
        h("h3", null, "Privacy"),
        h("ul", null,
          h("li", null, "No cookies, no analytics, no tracking."),
          h("li", null, "Fonts and scripts are self-hosted, so no requests go to third parties."),
          h("li", null, "Videos are plain links rather than embeds."),
          h("li", null, "Your theme choice and checklist are stored only in your own browser.")),
        h("h3", null, "Credits"),
        h("p", null, "Typefaces: Source Serif 4, DM Sans and DM Mono, under the SIL Open Font License. Hand-drawn shapes: rough.js by Preet Shihn, MIT licence."),
        h("p", null, "An independent project, not affiliated with any company or product mentioned on this page.")));
  }
  var RENDER = {
    story: renderStory, ideas: renderIdeas, steps: renderSteps, context: renderContext, compare: renderCompare,
    patterns: renderPatterns, protocols: renderProtocols, decide: renderDecide, build: renderBuild,
    blocks: renderBlocksIndex, glossary: renderGlossary, learn: renderLearn, about: renderAbout
  };

  /* ---------- Guides menu --------------------------------------------------- */
  var menu = $("#menu"), menuBtn = $("#menu-btn");
  function renderMenu() {
    var groups = [], byName = {};
    Object.keys(D.guides).forEach(function (id) {
      var g = D.guides[id];
      if (!byName[g.group]) { byName[g.group] = []; groups.push(g.group); }
      byName[g.group].push(id);
    });
    groups.forEach(function (name) {
      var box = h("div", { class: "menu-group" }, h("h2", { class: "eyebrow" }, name));
      if (name === groups[0]) {
        box.appendChild(h("button", { class: "menu-item", type: "button", "data-tour": "0" }, h("b", null, "Watch one run"), h("span", null, "The walkthrough, on the map")));
      }
      byName[name].forEach(function (id) {
        var g = D.guides[id];
        box.appendChild(h("button", { class: "menu-item", type: "button", "data-guide": id }, h("b", null, g.menu), h("span", null, g.hint)));
      });
      menu.appendChild(box);
    });
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

  /* ---------- Walkthrough (player) ---------------------------------------------- */
  var player = $("#player"), cur = -1, playing = false, stepTimer = 0;
  function stepDur(i) {
    var words = (D.steps[i].text + " " + (D.steps[i].note || "")).split(/\s+/).length;
    return Math.max(6000, Math.min(17000, 2600 + words * 240));
  }
  function renderRoute() {
    var route = $("#route");
    D.steps.forEach(function (st, i) {
      route.appendChild(h("button", { class: "route-dot", type: "button", "data-step": i, "aria-label": "Step " + (i + 1) + ": " + st.title, title: (i + 1) + ". " + st.title }));
    });
  }
  function openTour(i, opts) {
    opts = opts || {};
    closeMenu();
    clearSearch();
    if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
    if (sheetOpen) closeSheet({ fromHash: true, noFocus: true });
    var wasOpen = !player.hidden;
    player.hidden = false;
    stageEl.classList.add("has-player");
    mapEl.classList.add("is-focus");
    setStep(i, { fromHash: opts.fromHash, push: !wasOpen });
    if (opts.autoplay && !reduced()) play(); else pause();
    if (!wasOpen) $("#p-play").focus({ preventScroll: true });
  }
  function setStep(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= D.steps.length) return;
    cur = i;
    var st = D.steps[i];
    $$(".blk", mapEl).forEach(function (b) { b.classList.toggle("is-on", st.blocks.indexOf(b.getAttribute("data-block")) !== -1); });
    $$(".conn", mapEl).forEach(function (c) { c.classList.toggle("is-on", (st.conn || []).indexOf(c.getAttribute("data-conn")) !== -1); });
    $("#p-count").textContent = "Step " + pad2(i + 1) + " / " + D.steps.length;
    $("#p-title").textContent = st.title;
    var pt = $("#p-text");
    clear(pt);
    pt.appendChild(h("p", null, rich(st.text)));
    if (st.note) pt.appendChild(h("p", { class: "player-note" }, rich(st.note)));
    pt.scrollTop = 0;
    $$(".route-dot").forEach(function (r, k) {
      r.classList.toggle("is-current", k === i);
      r.classList.toggle("is-done", k < i);
      if (k === i) r.setAttribute("aria-current", "step"); else r.removeAttribute("aria-current");
    });
    $("#p-prev").disabled = i === 0;
    $("#p-next").disabled = i === D.steps.length - 1;
    if (LOOP) {
      if (st.station === "result") LOOP.run(true);
      else LOOP.park(st.station || null);
    }
    if (!opts.fromHash) setHash("#step-" + (i + 1), !opts.push);
    else lastHash = location.hash;
    if (playing) schedule();
    requestAnimationFrame(revealActive);
  }
  function revealActive() {
    var els = $$(".blk.is-on, .conn.is-on", mapEl).filter(function (e) { return e.offsetParent !== null; });
    if (!els.length) return;
    var top = Infinity, bottom = -Infinity;
    els.forEach(function (e) { var r = e.getBoundingClientRect(); top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom); });
    var viewTop = $(".bar").getBoundingClientRect().bottom + 10, viewBottom = player.getBoundingClientRect().top - 10;
    if (top >= viewTop && bottom <= viewBottom) return;
    var span = bottom - top, band = viewBottom - viewTop;
    var delta = span <= band ? (top - viewTop) - (band - span) / 2 : top - viewTop;
    window.scrollBy({ top: delta, behavior: reduced() ? "auto" : "smooth" });
  }
  function schedule() {
    clearTimeout(stepTimer);
    var dur = stepDur(cur);
    player.style.setProperty("--dur", dur + "ms");
    var dot = $(".route-dot.is-current");
    if (dot) { dot.classList.remove("is-timing"); void dot.offsetWidth; dot.classList.add("is-timing"); }
    stepTimer = setTimeout(function () {
      if (cur < D.steps.length - 1) setStep(cur + 1);
      else pause();
    }, dur);
  }
  function setPlayIcon() {
    $(".i-play", player).toggleAttribute("hidden", playing);
    $(".i-pause", player).toggleAttribute("hidden", !playing);
    $("#p-play").setAttribute("aria-label", playing ? "Pause" : "Play");
    player.classList.toggle("is-playing", playing);
  }
  function play() {
    playing = true;
    if (cur >= D.steps.length - 1) setStep(0);
    setPlayIcon();
    schedule();
  }
  function pause() {
    playing = false;
    clearTimeout(stepTimer);
    $$(".route-dot.is-timing").forEach(function (d) { d.classList.remove("is-timing"); });
    setPlayIcon();
  }
  function closeTour(opts) {
    opts = opts || {};
    if (player.hidden) return;
    pause();
    player.hidden = true;
    cur = -1;
    stageEl.classList.remove("has-player");
    mapEl.classList.remove("is-focus");
    $$(".is-on", mapEl).forEach(function (x) { x.classList.remove("is-on"); });
    if (LOOP) LOOP.run(false);
    if (!opts.fromHash && !opts.silent && /^#step-/.test(location.hash)) setHash("", true);
    if (!opts.silent) { var b = $("#btn-play"); if (b) b.focus({ preventScroll: true }); }
  }
  function initPlayer() {
    renderRoute();
    $("#p-prev").addEventListener("click", function () { pause(); setStep(cur - 1); });
    $("#p-next").addEventListener("click", function () { pause(); setStep(cur + 1); });
    $("#p-play").addEventListener("click", function () { if (playing) pause(); else play(); });
    $("#p-close").addEventListener("click", function () { closeTour(); });
  }

  /* ---------- Search ------------------------------------------------------------- */
  var sWrap = $("#search"), sInput = $("#block-search"), sList = $("#search-results"), sHits = [];
  function haystack(b) { return norm([b.id, b.name, b.label, (b.aka || []).join(" "), b.short, (b.examples || []).join(" ")].join(" ")); }
  function findBlocks(q) {
    q = norm(q).trim();
    if (!q) return [];
    var terms = q.split(/\s+/), scored = [];
    ORDER.forEach(function (id) {
      var b = BLOCKS[id], hs = haystack(b);
      if (!terms.every(function (t) { return hs.indexOf(t) !== -1; })) return;
      var title = norm((b.label || "") + " " + b.name + " " + (b.aka || []).join(" "));
      var score = terms.reduce(function (a, t) { return a + (title.indexOf(t) !== -1 ? 2 : 1) + (norm(b.label || b.name).indexOf(t) === 0 ? 2 : 0); }, 0);
      scored.push({ id: id, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.map(function (x) { return x.id; });
  }
  function renderResults() {
    clear(sList);
    var q = sInput.value.trim(), status = $("#search-status");
    if (!q) { sList.hidden = true; status.textContent = ""; return; }
    if (!sHits.length) sList.appendChild(h("li", { class: "sr-empty" }, "No block matches. Try the glossary in Guides."));
    sHits.slice(0, 8).forEach(function (id, i) {
      var b = BLOCKS[id];
      sList.appendChild(h("li", null, h("button", { type: "button", "data-block": id, "data-zone": b.zone, class: i === 0 ? "is-first" : null },
        h("i", { class: "zdot", "aria-hidden": "true" }), h("b", null, b.name), h("span", null, rich(b.short)))));
    });
    sList.hidden = false;
    status.textContent = !sHits.length ? "No block matches." : sHits.length + (sHits.length === 1 ? " block matches" : " blocks match") + ". Press Enter to open " + BLOCKS[sHits[0]].name + ", or the down arrow to choose.";
  }
  function applySearch() {
    var q = sInput.value;
    sHits = findBlocks(q);
    var on = !!q.trim();
    if (on && !player.hidden) closeTour({ silent: true });
    mapEl.classList.toggle("is-search", on);
    $$(".blk", mapEl).forEach(function (b) { b.classList.toggle("is-match", sHits.indexOf(b.getAttribute("data-block")) !== -1); });
    renderResults();
  }
  function clearSearch() {
    if (!sInput.value && !mapEl.classList.contains("is-search")) { sList.hidden = true; return; }
    sInput.value = "";
    sHits = [];
    mapEl.classList.remove("is-search");
    $$(".blk.is-match", mapEl).forEach(function (b) { b.classList.remove("is-match"); });
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
        var id = sHits[0];
        if (id) { clearSearch(); closeSearchUI(); openBlock(id); }
        e.preventDefault();
      } else if (e.key === "Escape") {
        clearSearch(); closeSearchUI(); sInput.blur();
        e.stopPropagation();
      }
    });
    // Arrow keys move between results; Escape goes back to the field.
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
      if (open) sInput.focus(); else { clearSearch(); }
    });
    document.addEventListener("pointerdown", function (e) {
      if (!sWrap.contains(e.target)) { sList.hidden = true; if (!sInput.value) sWrap.classList.remove("is-open"); }
    });
  }

  /* ---------- Theme -------------------------------------------------------------- */
  // The <head> script always sets data-theme, so the stylesheet needs no media query.
  function initTheme() {
    var root = document.documentElement;
    $("#theme-toggle").addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      store("ae-theme", nextTheme);
    });
    // Without a saved choice, follow the system setting when it changes.
    var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
      var saved = store("ae-theme");
      if (saved !== "light" && saved !== "dark") root.setAttribute("data-theme", e.matches ? "dark" : "light");
    });
  }

  /* ---------- Events ------------------------------------------------------------- */
  function initEvents() {
    document.addEventListener("click", function (e) {
      var t = e.target, el;
      if (!(t instanceof Element)) return;
      if ((el = t.closest("[data-copy]"))) { copyLink(el); return; }
      if ((el = t.closest("[data-step]"))) {
        var n = parseInt(el.getAttribute("data-step"), 10);
        if (el.classList.contains("route-dot")) { pause(); setStep(n); } else openTour(n, { autoplay: false });
        return;
      }
      if ((el = t.closest("[data-tour]"))) { openTour(parseInt(el.getAttribute("data-tour"), 10) || 0, { autoplay: true }); return; }
      if ((el = t.closest("[data-guide]"))) { openGuide(el.getAttribute("data-guide")); return; }
      if ((el = t.closest("[data-zone-open]"))) { openZone(el.getAttribute("data-zone-open")); return; }
      if ((el = t.closest("[data-conn-open]"))) { openConn(el.getAttribute("data-conn-open")); return; }
      if ((el = t.closest(".conn[data-conn]"))) { openConn(el.getAttribute("data-conn")); return; }
      if ((el = t.closest("[data-block]"))) {
        if (el.closest("#search-results")) { clearSearch(); closeSearchUI(); }
        openBlock(el.getAttribute("data-block"));
        return;
      }
      if (!menu.hidden && !menu.contains(t) && !menuBtn.contains(t)) closeMenu();
    });
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    $("#drawer-close").addEventListener("click", function () { closeDrawer(); });
    $("#sheet-close").addEventListener("click", function () { closeSheet(); });
    scrim.addEventListener("click", function () { if (drawerOpen) closeDrawer(); else if (sheetOpen) closeSheet(); });
    // Clicks on the empty area around the sheet panel close it as well.
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", function (e) {
      var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        if (!menu.hidden) { closeMenu(true); return; }
        if (drawerOpen) { closeDrawer(); return; }
        if (sheetOpen) { closeSheet(); return; }
        if (!player.hidden) { closeTour(); return; }
        return;
      }
      if (e.key === "Tab" && (drawerOpen || sheetOpen)) { trapTab(e); return; }
      if (typing) return;
      if (e.key === "/" && !drawerOpen && !sheetOpen) {
        e.preventDefault();
        if (getComputedStyle($(".search-field", sWrap)).display === "none") sWrap.classList.add("is-open");
        sInput.focus();
        return;
      }
      if (sheetOpen && !drawerOpen && sheetId && GCACHE[sheetId] && GCACHE[sheetId]._key) {
        if (GCACHE[sheetId]._key(e)) e.preventDefault();
        return;
      }
      if (!player.hidden && !drawerOpen && !sheetOpen) {
        if (e.key === "ArrowRight") { pause(); setStep(Math.min(D.steps.length - 1, cur + 1)); e.preventDefault(); }
        else if (e.key === "ArrowLeft") { pause(); setStep(Math.max(0, cur - 1)); e.preventDefault(); }
        else if (e.key === " " && (!t || t === document.body || t.closest(".map"))) { if (playing) pause(); else play(); e.preventDefault(); }
      }
    });
    if (menu) menu.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = $$(".menu-item", menu), k = items.indexOf(document.activeElement);
      items[(k + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
      e.preventDefault();
    });
  }

  /* ---------- Deep links ----------------------------------------------------------- */
  function fromHash() {
    if (location.hash === lastHash && (drawerOpen || sheetOpen || !player.hidden || !location.hash)) return;
    lastHash = location.hash;
    var hsh = decodeURIComponent((location.hash || "").slice(1)), m;
    if (!hsh) { closeDrawer({ fromHash: true, noFocus: true }); closeSheet({ fromHash: true, noFocus: true }); closeTour({ fromHash: true, silent: true }); return; }
    if ((m = hsh.match(/^block-([a-z0-9-]+)$/)) && BLOCKS[m[1]]) { openBlock(m[1], { fromHash: true }); return; }
    if ((m = hsh.match(/^zone-([a-z]+)$/)) && ZONES[m[1]]) { openZone(m[1], { fromHash: true }); return; }
    if ((m = hsh.match(/^link-([a-z]+)$/)) && CONNS["c-" + m[1]]) { openConn("c-" + m[1], { fromHash: true }); return; }
    if ((m = hsh.match(/^step-(\d+)$/))) {
      var n = parseInt(m[1], 10) - 1;
      if (n >= 0 && n < D.steps.length) { openTour(n, { fromHash: true, autoplay: false }); return; }
    }
    if (D.guides[hsh]) {
      if (drawerOpen) closeDrawer({ fromHash: true, noFocus: true });
      openGuide(hsh, { fromHash: true });
      return;
    }
    if (hsh === "map" || hsh === "main") { closeDrawer({ fromHash: true, noFocus: true }); closeSheet({ fromHash: true, noFocus: true }); }
  }

  /* ---------- Boot ----------------------------------------------------------------- */
  renderMap();
  fitMap();
  window.addEventListener("resize", queueFit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);
  renderMenu();
  initPlayer();
  initSearch();
  initTheme();
  initEvents();
  lastHash = null;
  fromHash();
  window.addEventListener("popstate", fromHash);
  window.addEventListener("hashchange", fromHash);
})();
