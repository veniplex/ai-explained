/* The drawings of the README. Each scene is an SVG of the size it is saved at; art.html?scene=<name>&theme=<light|dark> draws one of them,
   render.js saves them all as PNG. They are drawn with the pen of the site (draw.js: rough.js shapes from tokens), so the light and the dark
   picture are the same drawing in two palettes. Plain ES5. */
(function () {
  "use strict";

  var C = window.COMIC, S = C.s, K = C.kitchen, NS = "http://www.w3.org/2000/svg";
  var q = new URLSearchParams(location.search), SCENE = q.get("scene") || "banner";
  var svg = document.getElementById("art");

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function size(w, h, x, y) {
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", (x || 0) + " " + (y || 0) + " " + w + " " + h);
  }
  // A group at (x, y) holding shapes made with COMIC.s.
  function put(parent, shapes, x, y, scale, cls) {
    var g = el("g", { transform: "translate(" + (x || 0) + " " + (y || 0) + ")" + (scale ? " scale(" + scale + ")" : "") }, parent);
    if (cls) g.setAttribute("class", cls);
    C.paintAny(g, shapes);
    return g;
  }
  function prop(parent, name, x, y, o, scale) {
    var s = (o && o.s) || 1;
    return put(parent, C.props[name](o || {}), x, y, scale ? scale * s : 0);
  }
  function T(x, y, str, o) { return S.text(x, y, str, o); }
  // Colour the real tokens by zone: a tinted, hand-drawn card with a dark rim.
  function card(x, y, w, h, o) { return S.rrect(x, y, w, h, 18, o || {}); }

  /* ---------- the kitchen, as built in the story ---------- */
  var POSE = { owner: "happy/cheer", chef: "proud/hips", h1: "happy/give", h2: "happy/give", h3: "happy/give", judge1: "happy/down", judge2: "happy/down", judge3: "happy/down", courier: "calm/give", courier2: "happy/give", inspector: "calm/down" };
  var LAYERS = ["wall", "furn", "top", "floor", "people", "front"];
  function kitchen(parent, ids) {
    var g = el("g", { id: "kitchen" }, parent), layers = {};
    LAYERS.forEach(function (l) { layers[l] = el("g", { class: "layer-" + l }, g); });
    K.actors.forEach(function (a) {
      if (ids.indexOf(a.id) < 0) return;
      var b = {};
      Object.keys(a).forEach(function (k) { b[k] = a[k]; });
      if (b.poses) { b.poses = [POSE[a.id] || b.poses[0]]; }
      var o = {};
      Object.keys(b.o || {}).forEach(function (k) { if (k !== "fx") o[k] = b.o[k]; });
      if (!b.poses && POSE[a.id]) { var po = C.poseOpts(POSE[a.id]); o.mood = po.mood; o.arms = po.arms; }
      b.o = o;
      var n = C.actor(b);
      if (!n) return;
      n.classList.add("on");
      Array.prototype.forEach.call(n.querySelectorAll(".pose"), function (p) { p.classList.add("on"); });
      layers[b.layer || "top"].appendChild(n);
    });
    return g;
  }

  C.FILLS.ink2 = "var(--ink-2)";

  var SCENES = {};

  /* ---------- 1. the banner ---------- */
  SCENES.banner = function () {
    var W = 1600, H = 640;
    size(W, H, -50, 80);
    var room = C.room(520);
    svg.appendChild(room);
    kitchen(svg, ["window", "stall1", "stall2", "stall3", "stall4", "owner", "chef", "books1", "books2", "books3", "books4", "spoon",
      "counter", "order", "pile", "pile2", "counter2", "block", "phone", "orderbook", "oven", "pot", "sockets", "shelf",
      "counter3", "cab1", "cab2", "cab3", "sandbox", "till", "h1", "hc1", "bowl1", "h2", "hc2", "bowl2", "h3", "hc3", "bowl3", "rulebook",
      ]);
    // The title, on the wall.
    var g = el("g", {}, svg);
    put(g, [
      S.rrect(540, 118, 700, 192, 24, { f: "paper", w: 3, r: 1.1 }),
      T(890, 232, "AI explained", { size: 108, weight: 600, font: "serif" }),
      S.curve([[680, 252], [820, 262], [980, 250], [1120, 260]], { w: 3.4, k: "clay" }),
      T(890, 288, "How AI agents work, in a kitchen story and in technical words", { size: 21, italic: true, font: "serif", f: "ink3" }),
      S.spark(530, 126, 12, { w: 2.6, k: "clay" }), S.spark(1252, 300, 9, { w: 2.2, k: "clay" })
    ], 0, 0);
  };

  /* ---------- the picture of a thing, big, on a plain card ---------- */
  function sheetBg(w, h) {
    el("rect", { x: 0, y: 0, width: w, height: h, fill: "var(--paper)" }, svg);
  }

  /* ---------- 2. the eight chapters, as a path ---------- */
  var STOPS = [
    { n: 1, zone: "model", title: "The chef", terms: "Language model · Reasoning", draw: function (g) { prop(g, "chef", 0, 0, { mood: "think", arms: "think" }); } },
    { n: 2, zone: "harness", title: "The counter", terms: "Context window · Prompt", draw: function (g) { prop(g, "counter", 0, 0, { w: 140, h: 40 }); prop(g, "pile", -34, -40, { n: 9, s: 1.2 }); prop(g, "ticket", 38, -40, { t: "Sat" }); } },
    { n: 3, zone: "tools", title: "Knives, pots and one plug", terms: "Tools · MCP", draw: function (g) { prop(g, "phone", -52, 0, {}); prop(g, "pot", 8, 0, { steam: true }); prop(g, "knife", 62, -4, {}); } },
    { n: 4, zone: "harness", title: "Taste, adjust, taste again", terms: "Agent loop · Harness", draw: function (g) { prop(g, "cycle", 0, -50, { r: 46 }); prop(g, "tomato", 0, -34, { s: 1.1 }); } },
    { n: 5, zone: "know", title: "Recipe cards and a notebook", terms: "Skills · Search & RAG · Memory", draw: function (g) { prop(g, "cookbook", -42, 0, {}); prop(g, "notebook", 44, 0, {}); } },
    { n: 6, zone: "control", title: "Locks and your OK", terms: "Permissions · Sandbox · Hooks", draw: function (g) { prop(g, "padlock", 0, 0, { s: 1.8 }); prop(g, "key", 62, -22, { s: 1.2 }); } },
    { n: 7, zone: "orch", title: "Helpers and the night shift", terms: "Sub-agents · Background agents", draw: function (g) { prop(g, "person", -34, 0, { mood: "happy", arms: "give" }); prop(g, "person", 38, 0, { mood: "calm", arms: "down", shirt: "ok" }); } },
    { n: 8, zone: "ops", title: "Running the kitchen", terms: "Evals · Cost · Governance", draw: function (g) { prop(g, "scorecard", -42, 0, { t: "9" }, 1.5); prop(g, "camera", 42, -4, {}, 1.2); } }
  ];
  SCENES.chapters = function () {
    var W = 1600, H = 600;
    size(W, H);
    sheetBg(W, H);
    var g = el("g", {}, svg), i, xs = [], ys = [];
    for (i = 0; i < 8; i++) { xs.push(110 + i * 197); ys.push(i % 2 ? 360 : 300); }
    // The path: a dashed wobbly line through all numbers.
    var pts = xs.map(function (x, k) { return [x, ys[k] - 150 + (k % 2 ? 24 : -4)]; });
    put(g, [S.curve([[30, 148]].concat(pts).concat([[1580, 150]]), { w: 3, k: "rule", dash: true, r: 0.8 })], 0, 0);
    STOPS.forEach(function (s, k) {
      var x = xs[k], y = ys[k], zc = "z-" + s.zone, tc = "t-" + s.zone;
      var stop = el("g", { transform: "translate(" + x + " " + y + ")" }, g);
      put(stop, [S.rrect(-88, -128, 176, 262, 20, { f: tc, k: zc, w: 2.4, r: 0.9 })], 0, 0);
      var art = el("g", { transform: "translate(0 40)" }, stop);
      s.draw(art);
      put(stop, [
        S.circ(0, -150, 22, { f: "surface", k: zc, w: 2.6 }),
        T(0, -142, String(s.n), { size: 26, weight: 700, font: "serif", f: zc }),
      ], 0, 0);
      // The title in up to three lines, then the real names in mono.
      var words = s.title.split(" "), lines = [], cur = "";
      words.forEach(function (w) { if ((cur + " " + w).trim().length > 15) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
      lines.push(cur);
      lines.forEach(function (ln, j) { put(stop, [T(0, 74 + j * 22, ln, { size: 19, weight: 600, font: "serif" })], 0, 0); });
    });
    // The real names, under each card.
    STOPS.forEach(function (s, k) {
      var x = xs[k], y = ys[k] + 148;
      var terms = s.terms.split(" · ");
      terms.forEach(function (t, j) { put(g, [T(x, y + 12 + j * 18, t, { size: 13.5, font: "mono", f: "z-" + s.zone, weight: 500 })], 0, 0); });
    });
    put(g, [T(800, 38, "Eight chapters, one kitchen", { size: 30, weight: 600, font: "serif" }),
      T(800, 64, "the story in everyday words, the real name of every part underneath", { size: 17, italic: true, font: "serif", f: "ink3" })], 0, 0);
  };

  /* ---------- 3. one agent loop ---------- */
  SCENES.loop = function () {
    var W = 1600, H = 760;
    size(W, H);
    sheetBg(W, H);
    var g = el("g", {}, svg);
    put(g, [T(800, 50, "What an AI agent does, in one picture", { size: 32, weight: 600, font: "serif" }),
      T(800, 78, "each step in kitchen words, with the technical word underneath", { size: 17, italic: true, font: "serif", f: "ink3" })], 0, 0);
    // The harness: the frame around everything.
    put(g, [S.rrect(250, 106, 1100, 614, 30, { f: "t-harness", k: "z-harness", dash: true, w: 3, r: 1.1 }),
      T(284, 142, "HARNESS: the app around the model", { size: 15, font: "mono", f: "z-harness", weight: 600, anchor: "start" })], 0, 0);
    // In: the goal. Out: the result.
    prop(g, "ticket", 120, 330, { t: "Sat" }, 1.8);
    put(g, [T(120, 366, "Your goal", { size: 24, weight: 600, font: "serif" }), T(120, 392, "a task in words", { size: 14.5, font: "mono", f: "ink3" }),
      S.arrow([[176, 326], [254, 326]], { w: 3.4, k: "clay", head: 14 })], 0, 0);
    prop(g, "plate", 1478, 336, {}, 1.8);
    put(g, [T(1478, 366, "The result", { size: 24, weight: 600, font: "serif" }), T(1478, 392, "answer, file or change", { size: 14.5, font: "mono", f: "ink3" }),
      S.arrow([[1348, 326], [1428, 326]], { w: 3.4, k: "clay", head: 14 })], 0, 0);
    // The loop in the middle: four steps on a circle, the chef inside.
    var cx = 800, cy = 430, R = 125;
    prop(g, "cycle", cx, cy, { r: R, k: "clay", spin: false });
    prop(g, "chef", cx, cy + 50, { mood: "think", arms: "think", s: 1.15 });
    put(g, [T(cx, cy + 92, "repeat until done", { size: 17, italic: true, font: "serif", f: "z-harness" })], 0, 0);
    function step(x, y, k, t, c, tx, ty, anchor) {
      put(g, [S.circ(x, y, 17, { f: "t-" + c, k: "z-" + c, w: 2.6 }),
        T(tx, ty, k, { size: 30, weight: 700, font: "serif", anchor: anchor }),
        T(tx, ty + 24, t, { size: 14.5, font: "mono", f: "ink3", anchor: anchor })], 0, 0);
    }
    step(cx, cy - R, "Look", "context is assembled", "model", cx, cy - R - 58, "middle");
    step(cx + R, cy, "Pick", "the model picks a tool call", "model", cx + R + 34, cy - 2, "start");
    step(cx, cy + R, "Do", "the harness runs the tool", "tools", cx, cy + R + 52, "middle");
    step(cx - R, cy, "See", "the result joins the context", "know", cx - R - 34, cy - 2, "end");
    // The four corners: what feeds the loop and what watches it.
    function corner(x, y, draw, title, sub, zone) {
      var cg = el("g", { transform: "translate(" + x + " " + y + ")" }, g);
      draw(cg);
      put(cg, [T(0, 46, title, { size: 21, weight: 600, font: "serif" }), T(0, 68, sub, { size: 14, font: "mono", f: "z-" + zone })], 0, 0);
    }
    corner(430, 238, function (c) { prop(c, "cookbook", -46, 0, {}, 1.4); prop(c, "notebook", 46, 0, {}, 1.4); }, "Recipe cards and a notebook", "skills · search · memory", "know");
    corner(1170, 238, function (c) { prop(c, "phone", -50, 0, {}, 1.4); prop(c, "knife", 52, -2, {}, 1.4); }, "Knives, phones, one plug", "tools · MCP", "tools");
    corner(430, 592, function (c) { prop(c, "padlock", -30, 0, { s: 1.5 }); prop(c, "alarm", 40, 0, {}, 1.2); }, "Locks, your OK, a smoke alarm", "permissions · sandbox · hooks", "control");
    corner(1170, 592, function (c) { prop(c, "scorecard", -46, 0, { t: "9" }, 1.4); prop(c, "camera", 44, -2, {}, 1.2); }, "A taste panel and cameras", "evals · traces · cost", "ops");
  };

  /* ---------- 4. the ways in, and what else is inside ---------- */
  function pill(parent, x, y, w, text, zone) {
    put(parent, [S.rrect(x, y, w, 50, 25, { f: "ink", w: 2.4, r: 0.8 }), T(x + w / 2, y + 33, text, { size: 20, weight: 600, font: "sans", f: "paper" })], 0, 0);
  }
  function lines(parent, x, y, rows, size, gap) {
    rows.forEach(function (r, i) { put(parent, [T(x, y + i * (gap || 28), r, { size: size || 19, font: "serif", f: "ink2", anchor: "start", weight: 400 })], 0, 0); });
  }
  SCENES.ways = function () {
    var W = 1600, H = 900;
    size(W, H);
    sheetBg(W, H);
    var g = el("g", {}, svg);
    put(g, [T(800, 54, "Two ways in, and a library behind them", { size: 34, weight: 600, font: "serif" })], 0, 0);

    // The kitchen story.
    put(g, [S.rrect(60, 92, 720, 454, 26, { f: "t-harness", k: "z-harness", w: 2.8, r: 1 })], 0, 0);
    put(g, [T(100, 140, "FOR A FIRST LOOK", { size: 15, font: "mono", f: "z-harness", weight: 600, anchor: "start" }),
      T(100, 188, "The kitchen story", { size: 40, weight: 600, font: "serif", anchor: "start" })], 0, 0);
    var ka = el("g", { transform: "translate(0 -12)" }, g);
    prop(ka, "chef", 190, 440, { mood: "think", arms: "think" }, 1.32);
    put(ka, [S.ell(412, 292, 124, 44, { f: "paper", w: 2.6 }), S.circ(312, 350, 7, { f: "paper", w: 2 }), S.circ(292, 368, 4, { f: "paper", w: 1.8 }),
      T(412, 288, "Twenty kilos of", { size: 18, italic: true, font: "serif" }), T(412, 310, "firm tomatoes, please.", { size: 18, italic: true, font: "serif" })], 0, 0);
    prop(ka, "counter", 590, 450, { w: 250, h: 52 });
    prop(ka, "pot", 560, 398, { steam: true }, 1.3);
    prop(ka, "tomato", 640, 398, { s: 1.6 });
    prop(ka, "tomato", 680, 398, { s: 1.4 });
    put(g, [T(100, 462, "A restaurant kitchen builds itself on one screen.", { size: 19, font: "serif", f: "ink2", anchor: "start" })], 0, 0);
    pill(g, 100, 482, 260, "Watch the story  →");
    put(g, [T(386, 514, "Everyday words only.", { size: 17, font: "serif", italic: true, f: "ink3", anchor: "start" })], 0, 0);

    // The technical deep dive.
    put(g, [S.rrect(820, 92, 720, 454, 26, { f: "t-orch", k: "z-orch", w: 2.8, r: 1 })], 0, 0);
    put(g, [T(860, 140, "FOR THE FULL PICTURE", { size: 15, font: "mono", f: "z-orch", weight: 600, anchor: "start" }),
      T(860, 188, "The technical deep dive", { size: 40, weight: 600, font: "serif", anchor: "start" })], 0, 0);
    var ta = el("g", {}, g);
    function node(x, y, w, t, z) { put(ta, [S.rrect(x - w / 2, y - 22, w, 44, 12, { f: "surface", k: "z-" + z, w: 2.4 }), T(x, y + 6, t, { size: 15.5, font: "mono", weight: 500, f: "z-" + z })], 0, 0); }
    put(ta, [
      S.arrow([[1130, 264], [1170, 305]], { w: 2.6, k: "ink3", head: 9 }),
      S.arrow([[1300, 264], [1260, 305]], { w: 2.6, k: "ink3", head: 9 }),
      S.arrow([[1022, 358], [1114, 350]], { w: 2.6, k: "ink3", head: 9 }),
      S.arrow([[1388, 358], [1318, 350]], { w: 2.6, k: "ink3", head: 9 }),
      S.arrow([[1215, 354], [1215, 398]], { w: 2.6, k: "ink3", head: 9 })
    ], 0, 0);
    node(1215, 330, 190, "Agent loop", "harness");
    node(1100, 240, 150, "Model", "model");
    node(1330, 240, 150, "Tools", "tools");
    node(940, 358, 150, "Memory", "know");
    node(1455, 358, 140, "Guardrails", "control");
    node(1215, 420, 150, "Evals", "ops");
    put(g, [T(860, 462, "Eight chapters in precise terms, a map that grows as you read.", { size: 19, font: "serif", f: "ink2", anchor: "start" })], 0, 0);
    pill(g, 860, 482, 290, "Open the deep dive  →");
    put(g, [T(1176, 514, "Dated facts, with sources.", { size: 17, font: "serif", italic: true, f: "ink3", anchor: "start" })], 0, 0);

    // The library: guides, glossary, and what the site promises.
    function small(x, zone, title, kicker) {
      put(g, [S.rrect(x, 586, 480, 290, 24, { f: "t-" + zone, k: "z-" + zone, w: 2.6, r: 1 }), T(x + 32, 630, kicker, { size: 14.5, font: "mono", f: "z-" + zone, weight: 600, anchor: "start" }),
        T(x + 32, 674, title, { size: 31, weight: 600, font: "serif", anchor: "start" })], 0, 0);
    }
    small(60, "know", "Guides", "SEVEN LONG READS");
    [[-6, 0], [4, 1], [14, 2]].forEach(function (n) { prop(g, "note", 0, 0, {}, 0); });
    var gx = 100;
    ["How it works", "Context", "Build", "Secure", "Evaluate"].forEach(function (t, i) {
      prop(g, "note", gx + 66 + (i % 3) * 132, 758 + Math.floor(i / 3) * 52, { w: 118, h: 40, t: t, size: 14, f: i % 2 ? "paper" : "surface" }, 1);
    });
    put(g, [T(100, 850, "Every one with sources, in order.", { size: 17, font: "serif", italic: true, f: "ink3", anchor: "start" })], 0, 0);

    small(560, "tools", "Glossary", "OVER 180 TERMS");
    ["A", "B", "C", "D", "E", "F"].forEach(function (c, i) {
      var x = 604 + i * 62, y = 714 + (i % 2 ? 14 : 0);
      put(g, [S.rrect(x, y, 50, 56, 8, { f: i % 2 ? "paper" : "surface", w: 2.2 }), T(x + 25, y + 38, c, { size: 30, weight: 700, font: "serif" })], 0, 0);
    });
    put(g, [T(592, 816, "Each term: where it sits in the kitchen,", { size: 17, font: "serif", f: "ink2", anchor: "start" }), T(592, 840, "a definition, the detail, the sources.", { size: 17, font: "serif", f: "ink2", anchor: "start" })], 0, 0);

    small(1060, "ops", "Made to be kept", "NO ACCOUNT, NO TRACKING");
    put(g, [S.rrect(1098, 692, 62, 100, 12, { f: "surface", w: 2.6 }), S.rrect(1106, 703, 46, 64, 4, { f: "t-ops", w: 1.8 }), T(1129, 743, "AI", { size: 20, weight: 700, font: "serif", f: "z-ops" }), S.circ(1129, 780, 4, { f: "ink", nostroke: true })], 0, 0);
    prop(g, "rays", 1238, 745, { n: 8, r0: 26, r1: 40 });
    put(g, [S.circ(1238, 745, 22, { f: "paper", w: 2.6 })], 0, 0);
    prop(g, "moon", 1352, 748, {}, 1.4);
    put(g, [T(1092, 826, "Light and dark, keyboard friendly,", { size: 17, font: "serif", f: "ink2", anchor: "start" }), T(1092, 850, "installable, works offline.", { size: 17, font: "serif", f: "ink2", anchor: "start" })], 0, 0);
  };

  /* ---------- 5. a look inside: real screenshots of the site, pinned up like photographs ---------- */
  var SHOTS = [
    { id: "story", cap: "The kitchen story: a kitchen builds itself, one step at a time", r: -1.1 },
    { id: "technical", cap: "The deep dive: eight chapters in precise terms", r: 0.9 },
    { id: "glossary", cap: "A glossary page: where a term sits in the kitchen", r: 0.7 },
    { id: "guide", cap: "A guide: long, with sources and its own section list", r: -0.8 }
  ];
  SCENES.screens = function () {
    var W = 1600, H = 1240, theme = q.get("theme") === "dark" ? "dark" : "light";
    size(W, H);
    sheetBg(W, H);
    var g = el("g", {}, svg), loading = [];
    put(g, [T(800, 56, "A look inside", { size: 34, weight: 600, font: "serif" }), T(800, 84, "real pages of the site, in the light and the dark theme", { size: 17, italic: true, font: "serif", f: "ink3" })], 0, 0);
    SHOTS.forEach(function (s, i) {
      var x = 84 + (i % 2) * 776, y = 130 + Math.floor(i / 2) * 560, w = 680, h = 425;
      var f = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + s.r + " " + w / 2 + " " + h / 2 + ")" }, g);
      put(f, [S.rrect(-14, -14, w + 28, h + 28, 10, { f: "surface", w: 2.4, r: 0.9 })], 0, 0);
      var img = el("image", { x: 0, y: 0, width: w, height: h, preserveAspectRatio: "xMidYMid slice", href: "/__shots/" + s.id + "-" + theme + ".png" }, f);
      loading.push(new Promise(function (ok, fail) {
        var probe = new Image();
        probe.onload = ok;
        probe.onerror = function () { fail(new Error("no screenshot " + s.id)); };
        probe.src = "/__shots/" + s.id + "-" + theme + ".png";
      }));
      put(f, [S.rect(0, 0, w, h, { w: 1.6, r: 0.4, k: "rule" }), S.poly([[w / 2 - 44, -26], [w / 2 + 44, -20], [w / 2 + 40, -2], [w / 2 - 48, -8]], { f: "m-tools", w: 1.2, r: 0.4, k: "z-tools" }),
        T(w / 2, h + 52, s.cap, { size: 21, italic: true, font: "serif", f: "ink2" })], 0, 0);
    });
    return Promise.all(loading);
  };

  Promise.resolve((SCENES[SCENE] || SCENES.banner)()).then(function () {
    document.documentElement.setAttribute("data-ready", "1");
  }, function (e) {
    document.documentElement.setAttribute("data-error", String(e && e.message || e));
    document.documentElement.setAttribute("data-ready", "1");
  });
})();
