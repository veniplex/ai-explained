/* Agentic AI, Explained (v7): the hand-drawn pen. Turns lists of shapes into SVG, with rough.js (assets/vendor, MIT licence)
   doing the wobble. Everything is drawn from tokens (CSS custom properties), so both themes work.
   Exposes window.COMIC.s (shape helpers), COMIC.props (the drawings), COMIC.drawPanel(panel, seed).

   A shape is made with COMIC.s.* and has options o:
     f  fill token (see FILLS)           k  line token (default ink)       w  line width (default 2.2)
     r  roughness (default 0.9)          bow  bowing (default 0.8)         h  true: hatch the fill instead of a flat fill
     nostroke  true: no outline          dash  true: dashed line           cls  class on the shape (for ambient motion)
   Without rough.js everything falls back to plain SVG shapes. */
(function () {
  "use strict";

  var C = window.COMIC = window.COMIC || {};
  var NS = "http://www.w3.org/2000/svg";
  var RG = window.rough && window.rough.generator ? window.rough.generator() : null;

  /* ---------- Colour tokens ------------------------------------------------ */
  var ZONES = ["start", "model", "harness", "control", "know", "tools", "orch", "ops"];
  var FILLS = {
    paper: "var(--sk-paper)", ink: "var(--sk-ink)", ink3: "var(--ink-3)", clay: "var(--clay)", soft: "var(--clay-soft)", mid: "var(--clay-mid)",
    ok: "var(--ok)", oks: "var(--ok-soft)", bad: "var(--bad)", bads: "var(--bad-soft)", part: "var(--part)", parts: "var(--part-soft)",
    deep: "#2b2a27", p2: "var(--paper-2)", p3: "var(--paper-3)", surface: "var(--surface)", rule: "var(--rule-strong)"
  };
  ZONES.forEach(function (z) { FILLS["m-" + z] = "var(--m-" + z + ")"; FILLS["t-" + z] = "var(--t-" + z + ")"; FILLS["z-" + z] = "var(--z-" + z + ")"; });
  C.FILLS = FILLS;
  C.ZONES = ZONES;
  function fillOf(token) { return FILLS[token] || FILLS.paper; }

  /* ---------- Shape helpers ------------------------------------------------ */
  function sh(t, a, o) { return { t: t, a: a, o: o || {} }; }
  var S = C.s = {
    rect: function (x, y, w, h, o) { return sh("rect", [x, y, w, h], o); },
    // Rounded rectangle, as a path.
    rrect: function (x, y, w, h, r, o) {
      r = Math.min(r, w / 2, h / 2);
      return sh("path", ["M" + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) + "V" + (y + h - r) + "Q" + (x + w) + " " + (y + h) + " " + (x + w - r) + " " + (y + h) + "H" + (x + r) + "Q" + x + " " + (y + h) + " " + x + " " + (y + h - r) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "Z"], o);
    },
    ell: function (cx, cy, rx, ry, o) { return sh("ell", [cx, cy, rx, ry], o); },
    circ: function (cx, cy, r, o) { return sh("ell", [cx, cy, r, r], o); },
    line: function (x1, y1, x2, y2, o) { return sh("line", [x1, y1, x2, y2], o); },
    // Points as [[x, y], …]: open (lin), closed (poly) or smooth (curve).
    lin: function (pts, o) { return sh("lin", [pts], o); },
    poly: function (pts, o) { return sh("poly", [pts], o); },
    curve: function (pts, o) { return sh("curve", [pts], o); },
    // Arc of an ellipse: angles in radians.
    arc: function (cx, cy, rx, ry, a0, a1, closed, o) { return sh("arc", [cx, cy, rx, ry, a0, a1, !!closed], o); },
    // SVG path data.
    p: function (d, o) { return sh("path", [d], o); },
    // Text. o: size (default 14), anchor (middle), font (serif|sans|mono), weight, italic, f (fill token), rot (degrees).
    text: function (x, y, str, o) { return sh("text", [x, y, str], o); },
    // A group, for ambient motion: o.cls is the class (amb-bob, amb-spin, …), o.origin the transform origin ("50% 100%").
    g: function (cls, kids, o) { o = o || {}; o.cls = cls; return { t: "g", a: [], o: o, kids: kids }; },
    // Another prop inside a prop, moved and scaled: S.sub("padlock", 10, -40, {s: 0.7}).
    sub: function (name, x, y, o) { return { t: "sub", a: [name, x, y], o: o || {} }; },
    // A line with an arrowhead at the end. pts: two points draw a straight arrow, more draw a smooth one.
    arrow: function (pts, o) {
      o = o || {};
      var n = pts.length, last = pts[n - 1], prev = pts[n - 2];
      var ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]), hl = o.head || 11;
      var a1 = ang + Math.PI * 0.84, a2 = ang - Math.PI * 0.84;
      var body = n > 2 ? sh("curve", [pts], o) : sh("line", [pts[0][0], pts[0][1], last[0], last[1]], o);
      var head = sh("lin", [[[last[0] + Math.cos(a1) * hl, last[1] + Math.sin(a1) * hl], last, [last[0] + Math.cos(a2) * hl, last[1] + Math.sin(a2) * hl]]], o);
      return [body, head];
    },
    // A little sparkle: four short rays.
    spark: function (cx, cy, r, o) {
      return [S.line(cx - r, cy, cx + r, cy, o), S.line(cx, cy - r, cx, cy + r, o), S.line(cx - r * 0.6, cy - r * 0.6, cx + r * 0.6, cy + r * 0.6, o), S.line(cx - r * 0.6, cy + r * 0.6, cx + r * 0.6, cy - r * 0.6, o)];
    },
    star: function (cx, cy, r, o) {
      var pts = [], i;
      for (i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
      return S.poly(pts, o);
    }
  };

  /* ---------- Rough drawing ------------------------------------------------ */
  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]); });
    return e;
  }
  function ropts(o, seed) {
    return {
      roughness: o.r == null ? 0.9 : o.r, bowing: o.bow == null ? 0.8 : o.bow, seed: seed,
      strokeWidth: o.w || 2.2, maxRandomnessOffset: o.mo || 1.6, curveFitting: 0.95,
      disableMultiStroke: o.single !== false,
      fill: o.f ? "#111" : undefined, fillStyle: o.h ? "hachure" : "solid", hachureGap: o.gap || 5, fillWeight: o.fw || 1.2, hachureAngle: o.ang == null ? -42 : o.ang,
      stroke: "#000", preserveVertices: true
    };
  }
  function drawable(s, seed) {
    var a = s.a, o = ropts(s.o, seed);
    switch (s.t) {
      case "rect": return RG.rectangle(a[0], a[1], a[2], a[3], o);
      case "ell": return RG.ellipse(a[0], a[1], a[2] * 2, a[3] * 2, o);
      case "line": return RG.line(a[0], a[1], a[2], a[3], o);
      case "lin": return RG.linearPath(a[0], o);
      case "poly": return RG.polygon(a[0], o);
      case "curve": return RG.curve(a[0], o);
      case "arc": return RG.arc(a[0], a[1], a[2] * 2, a[3] * 2, a[4], a[5], a[6], o);
      default: return RG.path(a[0], o);
    }
  }
  // Plain SVG when rough.js is missing.
  function plain(s) {
    var a = s.a, f = s.o.f ? fillOf(s.o.f) : "none", e;
    switch (s.t) {
      case "rect": e = el("rect", { x: a[0], y: a[1], width: a[2], height: a[3] }); break;
      case "ell": e = el("ellipse", { cx: a[0], cy: a[1], rx: a[2], ry: a[3] }); break;
      case "line": e = el("line", { x1: a[0], y1: a[1], x2: a[2], y2: a[3] }); break;
      case "lin": e = el("polyline", { points: a[0].join(" ") }); f = "none"; break;
      case "poly": e = el("polygon", { points: a[0].join(" ") }); break;
      case "curve": e = el("polyline", { points: a[0].join(" ") }); f = "none"; break;
      default: e = el("path", { d: a[0] || "" });
    }
    e.setAttribute("fill", f);
    if (!s.o.nostroke) { e.setAttribute("stroke", fillOf(s.o.k || "ink")); e.setAttribute("stroke-width", s.o.w || 2.2); e.setAttribute("stroke-linecap", "round"); e.setAttribute("stroke-linejoin", "round"); }
    return e;
  }

  var seedAt = 0;
  function paint(parent, s) {
    var o = s.o;
    if (s.t === "g") {
      var g = el("g", { class: o.cls });
      if (o.origin) g.style.transformOrigin = o.origin;
      g.style.transformBox = "fill-box";
      s.kids.forEach(function (k) { paintAny(g, k); });
      parent.appendChild(g);
      return;
    }
    if (s.t === "sub") {
      var fn = C.props[s.a[0]], sg = el("g", { transform: "translate(" + s.a[1] + " " + s.a[2] + ") scale(" + (o.s || 1) + ")" });
      if (fn) paintAny(sg, fn(o));
      parent.appendChild(sg);
      return;
    }
    if (s.t === "text") {
      var a = s.a, t = el("text", {
        x: a[0], y: a[1], "text-anchor": o.anchor || "middle", "font-size": o.size || 14, "font-weight": o.weight || 500,
        "font-style": o.italic ? "italic" : "normal", fill: fillOf(o.f || "ink"), class: "sk-text" + (o.cls ? " " + o.cls : ""),
        "font-family": o.font === "mono" ? "var(--mono)" : o.font === "sans" ? "var(--sans)" : "var(--serif)"
      });
      if (o.rot) t.setAttribute("transform", "rotate(" + o.rot + " " + a[0] + " " + a[1] + ")");
      t.textContent = a[2];
      parent.appendChild(t);
      return;
    }
    seedAt += 1;
    if (!RG) { parent.appendChild(plain(s)); return; }
    var g2 = o.cls ? el("g", { class: o.cls }) : parent;
    RG.toPaths(drawable(s, seedAt)).forEach(function (p) {
      var isFill = p.fill && p.fill !== "none";
      if (isFill) {
        g2.appendChild(el("path", { d: p.d, fill: fillOf(o.f), stroke: "none", class: "sk-fill" }));
      } else if (o.f && o.h && p.stroke === "#111") {
        g2.appendChild(el("path", { d: p.d, fill: "none", stroke: fillOf(o.f), "stroke-width": o.fw || 1.2, "stroke-linecap": "round", class: "sk-hatch" }));
      } else if (!o.nostroke) {
        g2.appendChild(el("path", {
          d: p.d, fill: "none", stroke: fillOf(o.k || "ink"), "stroke-width": o.w || 2.2, "stroke-linecap": "round", "stroke-linejoin": "round",
          "stroke-dasharray": o.dash ? "6 6" : null, pathLength: o.dash ? null : "1", class: o.dash ? "sk-dash" : "sk-line"
        }));
      }
    });
    if (g2 !== parent) parent.appendChild(g2);
  }
  function paintAny(parent, s) {
    if (Array.isArray(s)) { s.forEach(function (x) { paintAny(parent, x); }); return; }
    if (s) paint(parent, s);
  }
  C.paintAny = paintAny;

  /* ---------- Scene --------------------------------------------------------- */
  C.props = C.props || {};

  // Draw one item of a scene: ["prop", x, y, {s: scale, r: rotation, flip, fx: [dx, dy] slide-in, d: extra delay in steps, amb: ambient class}].
  function drawItem(svg, item, index, base) {
    var name = item[0], x = item[1], y = item[2], o = item[3] || {}, fn = C.props[name];
    if (!fn) { if (window.console) console.warn("COMIC: no prop called " + name); return; }
    seedAt = base * 131 + index * 977;
    var tf = "translate(" + x + " " + y + ")" + (o.r ? " rotate(" + o.r + ")" : "") + " scale(" + (o.flip ? -(o.s || 1) : (o.s || 1)) + " " + (o.s || 1) + ")";
    var outer = el("g", { transform: tf, class: "item item-" + name });
    var inner = el("g", { class: "el" + (o.fx ? " has-fx" : "") });
    inner.style.setProperty("--i", String((index + (o.d || 0)) | 0));
    if (o.fx) { inner.style.setProperty("--fx", o.fx[0] + "px"); inner.style.setProperty("--fy", o.fx[1] + "px"); }
    var host = inner;
    if (o.amb) { host = el("g", { class: o.amb }); host.style.transformBox = "fill-box"; host.style.transformOrigin = o.origin || "50% 100%"; inner.appendChild(host); }
    paintAny(host, fn(o));
    outer.appendChild(inner);
    svg.appendChild(outer);
  }

  // The tinted backdrop of a panel. bg: kitchen | market | night | plain.
  function backdrop(svg, w, h, zone, bg, seed) {
    var g = el("g", { class: "bgnd" });
    seedAt = seed * 17;
    var t = "t-" + (zone || "start");
    paintAny(g, [S.rect(3, 3, w - 6, h - 6, { f: t, nostroke: true, r: 0.4 })]);
    var floor = h * 0.8;
    if (bg === "kitchen") {
      paintAny(g, [
        S.rect(3, floor, w - 6, h - floor - 3, { f: "p2", nostroke: true }),
        S.line(3, floor, w - 3, floor, { w: 1.6, k: "rule", r: 0.5 })
      ]);
      // Faint wall tiles.
      var ty = 14, k;
      for (k = 0; k < Math.floor(w / 58); k++) paintAny(g, [S.line(20 + k * 58, 10, 20 + k * 58, floor - 8, { w: 1, k: "rule", r: 0.4 })]);
      for (k = 0; k < 3; k++) paintAny(g, [S.line(10, ty + 40 * k + 20, w - 10, ty + 40 * k + 20, { w: 1, k: "rule", r: 0.4 })]);
    } else if (bg === "market") {
      paintAny(g, [S.rect(3, floor, w - 6, h - floor - 3, { f: "parts", nostroke: true }), S.line(3, floor, w - 3, floor, { w: 1.6, k: "rule", r: 0.5 })]);
    } else if (bg === "night") {
      paintAny(g, [S.rect(3, 3, w - 6, h - 6, { f: "p3", nostroke: true, r: 0.3 }), S.rect(3, floor, w - 6, h - floor - 3, { f: "p3", nostroke: true })]);
      paintAny(g, [S.line(3, floor, w - 3, floor, { w: 1.6, k: "ink3", r: 0.5 })]);
    } else if (bg === "plain") {
      /* only the tint */
    } else {
      paintAny(g, [S.line(3, floor, w - 3, floor, { w: 1.4, k: "rule", r: 0.5 })]);
    }
    svg.appendChild(g);
  }

  // A panel's picture: <svg viewBox="0 0 w h">. size: "s" (400 x 300) or "w" (820 x 300).
  C.SIZES = { s: [400, 300], w: [820, 300] };
  C.drawPanel = function (panel, seed) {
    var wh = C.SIZES[panel.size || "s"], w = wh[0], h = wh[1];
    var svg = el("svg", { viewBox: "0 0 " + w + " " + h, class: "pic", "aria-hidden": "true", focusable: "false", preserveAspectRatio: "xMidYMid meet" });
    backdrop(svg, w, h, panel.zone, panel.bg || "kitchen", seed);
    (panel.scene || []).forEach(function (item, i) { drawItem(svg, item, i + 1, seed); });
    return svg;
  };
  // A frame for the panel border, drawn once per panel at its pixel-free size.
  C.drawFrame = function (w, h, seed) {
    var svg = el("svg", { viewBox: "0 0 " + w + " " + h, class: "frame", "aria-hidden": "true", focusable: "false", preserveAspectRatio: "none", width: w, height: h });
    seedAt = seed * 29;
    paintAny(svg, [S.rect(2, 2, w - 4, h - 4, { w: 2.6, r: 1.1, bow: 0.6, mo: 2.2, single: false })]);
    return svg;
  };
})();
