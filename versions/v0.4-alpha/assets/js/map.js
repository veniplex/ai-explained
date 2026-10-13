/* Agentic AI, Explained (v4): the map.
   One component draws every version of it: the map that grows beside the chapters, the small
   "map so far" sketches on phones, and the whole kitchen at the end. Each piece carries
   data-from="n" and appears once the reader reaches chapter n. Its words come from the voice that is on (voice.js);
   the page is drawn again when the voice changes. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice;
  var h = sk.h, s = sk.s, $ = sk.$, $$ = sk.$$, clear = sk.clear;
  var CH = {};
  D.chapters.forEach(function (c) { CH[c.id] = c; });

  /* ---------- Pieces ---------------------------------------------------------- */
  function blk(id) {
    var e = D.entries[id];
    return h("li", null, h("a", { class: "blk", href: sk.url.entry(id), "data-entry": id },
      h("i", { class: "zdot blk-dot", "aria-hidden": "true" }), h("span", { class: "blk-t" }, e.label || e.name)));
  }
  function head(c) {
    var t = voice.chapter(c);
    var where = c.n === 8 ? "the epilogue" : "chapter " + c.n;
    return h("div", { class: "zone-head" },
      h("h3", { class: "zone-h" }, h("button", { class: "zone-title", type: "button", "data-ch-go": c.n, title: "Go to " + where },
        h("span", { class: "zone-n", "aria-hidden": "true" }, c.n === 8 ? "E" : String(c.n)), t.title)),
      // In the kitchen voice the real name of the chapter's subject sits beside the picture.
      t.term ? h("span", { class: "zone-nick" }, t.term) : null);
  }
  function zone(cid, area, opts, cls) {
    var c = CH[cid];
    var el = h("section", { class: "zone" + (cls ? " " + cls : ""), "data-zone": c.zone, "data-area": area, "data-from": c.n, "data-ch": c.n },
      head(c), h("ul", { class: "blk-list" + (cls === "zone-row" ? " blk-row" : "") }, c.entries.map(blk)));
    if (!opts.mini) el.appendChild(sk.doodleSvg(c.zone, "zone-doodle", 3 + area.length, undefined, c.id));
    sk.sketchBox(el, { seed: 11 + area.length * 17 });
    return el;
  }
  function you(opts) {
    var el = h("div", { class: "zone zone-row zone-you", "data-zone": "start", "data-area": "you", "data-from": 1 },
      opts.mini ? null : sk.doodleSvg("start", "zone-doodle", 5),
      h("p", { class: "you-text" }, h("b", null, "You"), " " + voice.map().you));
    sk.sketchBox(el, { seed: 7, radius: 999 });
    return el;
  }
  // The kitchen holds three chapters: the counter (2), the loop and the harness (4), the locks (6).
  function kitchen(opts) {
    var counter = CH.counter, loop = CH.loop, locks = CH.locks;
    var el = h("section", { class: "zone zone-kitchen", "data-zone": "harness", "data-area": "kitchen", "data-from": counter.n });
    var top = h("div", { class: "kitchen-head", "data-from": loop.n, "data-ch": loop.n },
      head(loop), h("ul", { class: "blk-list blk-row" }, loop.entries.map(blk)),
      opts.mini ? null : sk.doodleSvg("harness", "zone-doodle", 9, undefined, "loop"));
    var cnt = h("section", { class: "counter", "data-zone": "harness", "data-from": counter.n, "data-ch": counter.n },
      head(counter), h("ul", { class: "blk-list blk-row" }, counter.entries.map(blk)), opts.mini ? null : sk.doodleSvg("harness", "zone-doodle", 5, undefined, "counter"));
    sk.sketchBox(cnt, { seed: 131, radius: 12, fill: "paper" });
    var lk = h("section", { class: "zone zone-locks", "data-zone": "control", "data-from": locks.n, "data-ch": locks.n },
      head(locks), h("ul", { class: "blk-list blk-row" }, locks.entries.map(blk)), opts.mini ? null : sk.doodleSvg("control", "zone-doodle", 7, undefined, "locks"));
    sk.sketchBox(lk, { seed: 211 });
    sk.append(el, [top, cnt, opts.ring ? loopButton({ "data-from": loop.n }) : null, lk]);
    return el;
  }

  /* ---------- Connectors (hub only): what flows between the zones -------------- */
  var CONNS = [
    { area: "cA", from: 2, dir: "both" },
    { area: "cB", from: 3, dir: "both" },
    { area: "cC", from: 5, dir: "right" },
    { area: "cD", from: 7, dir: "both" }
  ];
  function conn(c) {
    var words = voice.map().conns[c.area];
    var el = h("div", { class: "conn conn-h", "data-area": c.area, "data-from": c.from, "aria-hidden": "true" },
      h("span", { class: "conn-text" }, h("span", { class: "conn-label" }, words.label), h("span", { class: "conn-sub" }, words.sub)));
    var svg = s("svg", { class: "sk-conn", "aria-hidden": "true", focusable: "false" });
    el.insertBefore(svg, el.firstChild);
    sk.watch(el, function () {
      var w = el.offsetWidth, ht = el.offsetHeight, key = w + "x" + ht;
      if (!w || !ht || svg._k === key) return;
      svg._k = key;
      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + w + " " + ht);
      var y = Math.round(ht / 2), x1 = 7, x2 = w - 7, g = s("g"), o = { sw: 1.7, r: 0.8, bow: 1.4 }, seed = 300 + c.area.charCodeAt(1);
      sk.paint(g, sk.assign(o, { t: "line", a: [x1, y, x2, y] }), seed);
      sk.paint(g, sk.assign(o, { t: "lin", a: sk.head(x1, y, x2, y, 9) }), seed + 3);
      if (c.dir === "both") sk.paint(g, sk.assign(o, { t: "lin", a: sk.head(x2, y, x1, y, 9) }), seed + 5);
      svg.appendChild(g);
    });
    return el;
  }

  /* ---------- The agent loop (a link to the "Agent loop" term) ------------------ */
  var STATION_IDS = ["fill", "decide", "check", "run", "add"];
  // Geometry from v0.1-alpha (app.js, LOOP_GEO).
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

  function loopButton(attrs) {
    var words = voice.map().loop;
    var STATIONS = words.stations.map(function (st, i) { return { id: STATION_IDS[i], name: st.name, sub: st.sub }; });
    var btn = h("a", sk.assign({ class: "loop", href: sk.url.entry("agent-loop"), "data-entry": "agent-loop", "aria-label": words.aria }, attrs));
    var svg = s("svg", { "aria-hidden": "true", focusable: "false" });
    btn.appendChild(svg);
    var geo = null, mode = null, path = null, L = 1, stLen = [], token = null, glow = null;
    var DWELL = 700, TRAVEL = 9400, t = 0, raf = 0, lastTs = 0, visible = !("IntersectionObserver" in window);

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
      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + geo.w + " " + geo.h);
      var anim = sk.isDrawing(btn), g = s("g"), base = 0.2;
      sk.paint(g, { t: "ellipse", a: [geo.cx, geo.cy, geo.rx * 2, geo.ry * 2], sw: 1.8, r: 0.7, bow: 0.5, anim: anim, delay: base }, 41);
      [234, 306, 18, 90, 162].forEach(function (deg, i) {
        var p1 = ptAt(deg - 6), p2 = ptAt(deg);
        sk.paint(g, { t: "lin", a: sk.head(p1[0], p1[1], p2[0], p2[1], 8, 0.6), sw: 1.8, r: 0.5, anim: anim, delay: base + 0.5 }, 50 + i);
      });
      var ex = geo.exit;
      sk.paint(g, { t: "path", a: ex.d, sw: 1.5, r: 0.5, dash: "4 4", single: true }, 61);
      sk.paint(g, { t: "lin", a: sk.head(ex.hx[0], ex.hx[1], ex.hx[2], ex.hx[3], 8), sw: 1.5, r: 0.4, anim: anim, delay: base + 0.6 }, 62);
      svg.appendChild(g);
      svg.appendChild(s("text", { x: geo.cx, y: geo.cy - 2, "text-anchor": "middle", class: "lp-center" }, words.center));
      svg.appendChild(s("text", { x: geo.cx, y: geo.cy + 17, "text-anchor": "middle", class: "lp-center-sub" }, words.sub));
      svg.appendChild(s("text", { x: ex.lx, y: ex.ly, "text-anchor": ex.anchor, class: "lp-exit-label" }, geo.oneLine ? words.exitWide : words.exitNarrow));
      STATIONS.forEach(function (st, i) {
        var p = ptAt(geo.ang[i]), lb = geo.lab[i];
        var sg = s("g", { class: "lp-st", "data-st": st.id });
        var node = s("g", { class: "lp-node" });
        sk.paint(node, { t: "circle", a: [p[0], p[1], 15], fill: "zm", sw: 1.6, r: 0.5, anim: anim, delay: base + 0.2 + i * 0.08 }, 70 + i);
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
      svg.appendChild(path);
      L = path.getTotalLength() || 1;
      stLen = STATIONS.map(function (st, i) { return nearestLen(ptAt(geo.ang[i])); });
      glow = s("circle", { r: 13, class: "lp-glow" });
      token = s("circle", { r: 6.5, class: "lp-token" });
      svg.appendChild(glow);
      svg.appendChild(token);
      render();
    }
    function layout() {
      if (!btn.clientWidth) return;
      var m = btn.clientWidth < 470 ? "narrow" : "wide";
      if (m === mode && svg.firstChild) return;
      mode = m; geo = LOOP_GEO[m];
      draw();
    }
    function segLen(i) { var a = stLen[i], b = i + 1 < stLen.length ? stLen[i + 1] : stLen[0] + L; return b - a; }
    function travelMs(i) { return TRAVEL * segLen(i) / L; }
    function cycleMs() { var n = 0; for (var i = 0; i < stLen.length; i++) n += DWELL + travelMs(i); return n; }
    function ease(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function posAt(time) {
      var total = cycleMs();
      time = ((time % total) + total) % total;
      for (var i = 0; i < stLen.length; i++) {
        if (time < DWELL) return { len: stLen[i] % L, at: i };
        time -= DWELL;
        var tr = travelMs(i);
        if (time < tr) return { len: (stLen[i] + segLen(i) * ease(time / tr)) % L, at: -1 };
        time -= tr;
      }
      return { len: stLen[0], at: 0 };
    }
    function render() {
      if (!path) return;
      var p = posAt(t), pt = path.getPointAtLength(p.len), x = pt.x.toFixed(1), y = pt.y.toFixed(1);
      token.setAttribute("cx", x); token.setAttribute("cy", y);
      glow.setAttribute("cx", x); glow.setAttribute("cy", y);
      var here = p.at >= 0 ? STATIONS[p.at].id : null;
      $$("[data-st]", svg).forEach(function (el) { el.classList.toggle("is-here", el.getAttribute("data-st") === here); });
    }
    // Runs only while visible, and never with reduced motion.
    function shouldRun() { return visible && !document.hidden && !sk.reduced(); }
    function frame(ts) {
      raf = 0;
      var dt = lastTs ? Math.min(100, ts - lastTs) : 16;
      lastTs = ts;
      t += dt;
      render();
      if (shouldRun()) raf = requestAnimationFrame(frame); else lastTs = 0;
    }
    function kick() {
      // A loop that was drawn again (new voice) is no longer on the page: stop listening for it.
      if (btn._seen && !btn.isConnected) { document.removeEventListener("visibilitychange", kick); return; }
      if (btn.isConnected) btn._seen = true;
      if (!raf && shouldRun()) { lastTs = 0; raf = requestAnimationFrame(frame); }
    }
    if (window.ResizeObserver) new ResizeObserver(layout).observe(btn); else window.addEventListener("resize", layout);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(btn);
    document.addEventListener("visibilitychange", kick);
    layout();
    kick();
    return btn;
  }

  /* ---------- The map ---------------------------------------------------------- */
  function create(opts) {
    opts = opts || {};
    var layout = opts.layout || "tall";
    var root = h("div", { class: "kmap kmap-" + layout + (opts.mini ? " kmap-mini" : "") });
    var parts = [
      you(opts), zone("chef", "chef", opts), kitchen(opts), zone("tools", "tools", opts),
      zone("recipes", "recipes", opts), zone("helpers", "helpers", opts), zone("kitchen-ops", "ops", opts, "zone-row")
    ];
    if (layout === "hub") CONNS.forEach(function (c) { parts.push(conn(c)); });
    sk.append(root, parts);
    var api = { el: root, setStage: function (stage, current) { setStage(root, stage, current); } };
    api.setStage(opts.stage || 8, opts.current == null ? null : opts.current);
    return api;
  }

  // Show pieces up to chapter `stage`; mark chapter `current` and dim the ones before it.
  // Pieces that appear after the first render draw themselves in (unless motion is reduced).
  function setStage(root, stage, current) {
    var animate = !!root._staged && !sk.reduced();
    function flash(el) {
      el.classList.add("is-drawing");
      setTimeout(function () { el.classList.remove("is-drawing"); }, 1900);
    }
    root.setAttribute("data-stage", stage);
    $$("[data-from]", root).forEach(function (el) {
      var show = +el.getAttribute("data-from") <= stage;
      if (show && el.hidden && animate) flash(el);
      el.hidden = !show;
    });
    $$("[data-ch]", root).forEach(function (el) {
      var n = +el.getAttribute("data-ch");
      el.classList.toggle("is-current", current != null && n === current);
      el.classList.toggle("is-past", current != null && n < current);
    });
    var kit = $(".zone-kitchen", root), framed = stage >= CH.loop.n;
    kit.classList.toggle("is-framed", framed);
    if (framed && !kit._frame) {
      kit._frame = true;
      if (animate) flash(kit);
      sk.sketchBox(kit, { seed: 97, sw: 1.4 });
    }
    root._staged = true;
  }

  V3.map = { create: create, loop: function () { return loopButton(); } };
})();
