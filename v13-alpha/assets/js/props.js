/* Agentic AI, Explained (v13): the drawings. Each prop is a function of its options that returns a list of shapes
   (see draw.js) around the origin (0, 0). People and furniture stand on the origin (feet, floor); things that sit on a
   surface have the origin at their bottom centre. In a scene an item is ["name", x, y, {options}] with the common options
   s (scale), r (rotation in degrees), flip (mirror), fx ([dx, dy]: slides in from there), d (extra delay in steps), amb (ambient motion).

   People:    chef {mood, arms}   owner {mood, arms, shirt, hair}   person {mood, arms, shirt, hair, hat, clip}
              moods: calm happy think oops sleepy worried proud taste     arms: down out up cheer hold point pointl shrug give hips think
   Furniture: counter {w, h}   stall {t}   shelf {w}   cupboard {state: open|ask|locked, t}   door   window   glassbox {w, h}   till {locked}
   Things:    ticket {t}   note {t, w, h}   sheet {title, lines}   cookbook {zone}   books {n}   cardbox   card {t}   notebook   orderbook {lines}
              phone {ring}   knife   pot {steam}   pan   oven {fire}   tomato {soft, r}   crate {n}   plug   strip {n}   padlock {open}   key   bowl {c}
              alarm {ring}   fire   clock {min}   moon   camera   receipt {t}   scorecard {t}   calendar {t}   tag {t}   pile {n}   spoon   stars {n}
              plate {c}   cloche
   Marks:     check   cross   bang   ques   steam   rays {n, r0, r1}   cycle {r, n}   arrowline {pts}   label {t, size, f, italic, rot}   zz */
(function () {
  "use strict";

  var C = window.COMIC, S = C.s, P = C.props;
  var PI = Math.PI;

  /* ---------- Faces and arms ------------------------------------------------ */
  function face(m, cx, cy) {
    var sh = [], e = 8, y = cy - 1;
    var eyes = [S.circ(cx - e, y, 2.4, { f: "ink", nostroke: true }), S.circ(cx + e, y, 2.4, { f: "ink", nostroke: true })];
    var mouth = S.p("M" + (cx - 6) + " " + (cy + 9) + "Q" + cx + " " + (cy + 13) + " " + (cx + 6) + " " + (cy + 9), { w: 1.8 });
    switch (m) {
      case "happy":
        eyes = [S.arc(cx - e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 }), S.arc(cx + e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 })];
        mouth = S.p("M" + (cx - 9) + " " + (cy + 6) + "Q" + cx + " " + (cy + 20) + " " + (cx + 9) + " " + (cy + 6) + "Z", { f: "paper", w: 1.8 });
        sh.push(S.circ(cx - 15, cy + 7, 3.4, { f: "mid", nostroke: true }), S.circ(cx + 15, cy + 7, 3.4, { f: "mid", nostroke: true }));
        break;
      case "proud":
        eyes = [S.arc(cx - e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 }), S.arc(cx + e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 })];
        mouth = S.p("M" + (cx - 7) + " " + (cy + 8) + "Q" + cx + " " + (cy + 15) + " " + (cx + 7) + " " + (cy + 8), { w: 1.8 });
        break;
      case "think":
        eyes = [S.circ(cx - e + 2, y - 1, 2.4, { f: "ink", nostroke: true }), S.circ(cx + e + 2, y - 1, 2.4, { f: "ink", nostroke: true })];
        mouth = S.line(cx - 5, cy + 10, cx + 4, cy + 8, { w: 1.8 });
        sh.push(S.line(cx + 3, y - 8, cx + 13, y - 11, { w: 1.8 }));
        break;
      case "oops":
        eyes = [S.circ(cx - e, y, 3.6, { f: "paper", w: 1.6 }), S.circ(cx + e, y, 3.6, { f: "paper", w: 1.6 }), S.circ(cx - e, y, 1.4, { f: "ink", nostroke: true }), S.circ(cx + e, y, 1.4, { f: "ink", nostroke: true })];
        mouth = S.ell(cx, cy + 11, 3.4, 4.4, { f: "ink", w: 1.4 });
        break;
      case "sleepy":
        eyes = [S.line(cx - e - 3, y + 1, cx - e + 3, y + 1, { w: 2 }), S.line(cx + e - 3, y + 1, cx + e + 3, y + 1, { w: 2 })];
        mouth = S.line(cx - 4, cy + 10, cx + 4, cy + 10, { w: 1.8 });
        break;
      case "worried":
        sh.push(S.line(cx - e - 4, y - 7, cx - e + 3, y - 10, { w: 1.8 }), S.line(cx + e + 4, y - 7, cx + e - 3, y - 10, { w: 1.8 }));
        mouth = S.p("M" + (cx - 6) + " " + (cy + 12) + "Q" + cx + " " + (cy + 7) + " " + (cx + 6) + " " + (cy + 12), { w: 1.8 });
        break;
      case "taste":
        eyes = [S.arc(cx - e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 }), S.arc(cx + e, y + 2, 4, 4, PI * 1.05, PI * 1.95, false, { w: 1.8 })];
        mouth = S.ell(cx + 1, cy + 10, 3, 2.4, { f: "ink", w: 1.4 });
        sh.push(S.circ(cx - 15, cy + 7, 3.4, { f: "mid", nostroke: true }), S.circ(cx + 15, cy + 7, 3.4, { f: "mid", nostroke: true }));
        break;
    }
    return [eyes, mouth, sh];
  }
  var ARMS = {
    down: [[-34, -32], [34, -32]], out: [[-54, -56], [54, -56]], up: [[-34, -32], [46, -108]], cheer: [[-46, -108], [46, -108]],
    hold: [[-9, -40], [9, -40]], point: [[-34, -32], [66, -72]], pointl: [[-66, -72], [34, -32]], shrug: [[-46, -62], [46, -62]],
    give: [[-34, -32], [58, -56]], hips: [[-38, -46], [38, -46]], think: [[-34, -32], [10, -86]], both: [[-52, -70], [52, -70]]
  };
  function arms(sh, pose, y0) {
    var a = ARMS[pose] || ARMS.down, i;
    for (i = 0; i < 2; i++) {
      var sx = i ? 24 : -24, sy = y0, hx = a[i][0], hy = a[i][1];
      var mx = (sx + hx) / 2 + (i ? 7 : -7), my = (sy + hy) / 2 + 6;
      sh.push(S.p("M" + sx + " " + sy + "Q" + mx + " " + my + " " + hx + " " + hy, { w: 3.4 }));
      sh.push(S.circ(hx, hy, 5.2, { f: "paper", w: 2 }));
    }
  }

  /* ---------- People --------------------------------------------------------- */
  P.chef = function (o) {
    var sh = [];
    sh.push(S.ell(0, 0, 32, 5, { f: "p3", nostroke: true }));
    sh.push(S.line(-10, -16, -10, -3, { w: 4 }), S.line(10, -16, 10, -3, { w: 4 }));
    sh.push(S.ell(-13, -2, 9, 3.6, { f: "ink" }), S.ell(13, -2, 9, 3.6, { f: "ink" }));
    arms(sh, o.arms, -66);
    sh.push(S.p("M-28 -14Q-33 -50 -24 -76Q0 -86 24 -76Q33 -50 28 -14Z", { f: "paper" }));
    sh.push(S.circ(0, -58, 2, { f: "ink", nostroke: true }), S.circ(0, -44, 2, { f: "ink", nostroke: true }), S.circ(0, -30, 2, { f: "ink", nostroke: true }));
    sh.push(S.poly([[-10, -80], [10, -80], [0, -64]], { f: "clay", w: 1.8 }));
    sh.push(S.circ(0, -100, 23, { f: "paper" }));
    sh.push(S.g("amb-blink", face(o.mood || "calm", 0, -100), { origin: "50% 50%" }));
    sh.push(S.p("M-20 -116Q-29 -128 -18 -134Q-18 -150 -3 -146Q8 -157 19 -145Q32 -144 25 -130Q29 -120 20 -116Z", { f: "paper" }));
    sh.push(S.rect(-20, -119, 40, 10, { f: "paper", w: 2 }));
    return sh;
  };
  function human(o, kind) {
    var sh = [], hair = o.hair || "ink", shirt = o.shirt || "soft";
    sh.push(S.ell(0, 0, 32, 5, { f: "p3", nostroke: true }));
    sh.push(S.line(-10, -16, -10, -3, { w: 4 }), S.line(10, -16, 10, -3, { w: 4 }));
    sh.push(S.ell(-13, -2, 9, 3.6, { f: "ink" }), S.ell(13, -2, 9, 3.6, { f: "ink" }));
    arms(sh, o.arms, -66);
    sh.push(S.p("M-28 -14Q-33 -50 -24 -76Q0 -86 24 -76Q33 -50 28 -14Z", { f: shirt }));
    sh.push(S.p("M-9 -80L0 -66L9 -80", { w: 1.8 }));
    sh.push(S.circ(0, -100, 23, { f: "paper" }));
    sh.push(S.g("amb-blink", face(o.mood || "calm", 0, -100), { origin: "50% 50%" }));
    if (o.hat === "cap") {
      sh.push(S.p("M-23 -106Q-22 -128 0 -128Q22 -128 23 -106Q0 -112 -23 -106Z", { f: o.hatf || "m-ops" }));
      sh.push(S.p("M-6 -108Q16 -112 30 -106Q16 -102 -6 -104Z", { f: o.hatf || "m-ops" }));
    } else {
      sh.push(S.p("M-24 -98Q-27 -126 0 -124Q27 -126 24 -98Q18 -113 2 -112Q-12 -113 -24 -98Z", { f: hair }));
    }
    if (o.clip) {
      sh.push(S.rect(26, -92, 24, 32, { f: "paper", w: 2 }), S.line(31, -82, 45, -82, { w: 1.4 }), S.line(31, -75, 45, -75, { w: 1.4 }), S.line(31, -68, 41, -68, { w: 1.4 }), S.rect(33, -95, 10, 5, { f: "part", w: 1.4 }));
    }
    return sh;
  }
  P.owner = function (o) { return human(o, "owner"); };
  P.person = function (o) { return human(o, "person"); };

  /* ---------- Furniture ------------------------------------------------------- */
  P.counter = function (o) {
    var w = o.w || 240, h = o.h || 50, x = -w / 2, sh = [];
    sh.push(S.rect(x, -h, w, h, { f: "p2" }));
    sh.push(S.rect(x - 7, -h - 11, w + 14, 12, { f: "p3" }));
    sh.push(S.line(x + w / 3, -h + 9, x + w / 3, -5, { w: 1.4, k: "rule" }), S.line(x + 2 * w / 3, -h + 9, x + 2 * w / 3, -5, { w: 1.4, k: "rule" }));
    sh.push(S.circ(x + w / 3 - 8, -h / 2 + 4, 2.2, { f: "ink", nostroke: true }), S.circ(x + w / 3 + 8, -h / 2 + 4, 2.2, { f: "ink", nostroke: true }));
    sh.push(S.circ(x + 2 * w / 3 - 8, -h / 2 + 4, 2.2, { f: "ink", nostroke: true }), S.circ(x + 2 * w / 3 + 8, -h / 2 + 4, 2.2, { f: "ink", nostroke: true }));
    return sh;
  };
  P.shelf = function (o) {
    var w = o.w || 150, x = -w / 2, sh = [], bx = x + 6, k = 0, hs = [34, 28, 38, 30, 36, 26, 32, 40, 29], zs = ["m-model", "m-harness", "m-know", "m-tools", "m-orch", "m-ops", "m-control"];
    while (bx < x + w - 14) {
      var bw = 10 + (k % 3) * 3, bh = hs[k % hs.length];
      sh.push(S.rect(bx, -bh - 6, bw, bh, { f: zs[k % zs.length], w: 1.8 }));
      bx += bw + 2; k++;
    }
    sh.push(S.rect(x, -6, w, 7, { f: "parts" }));
    return sh;
  };
  P.stall = function (o) {
    var sh = [], w = 140, x = -w / 2, k;
    sh.push(S.line(x + 6, -4, x + 6, -92, { w: 3 }), S.line(x + w - 6, -4, x + w - 6, -92, { w: 3 }));
    sh.push(S.rect(x, -34, w, 34, { f: "parts" }), S.line(x + 20, -34, x + 20, -2, { w: 1.4, k: "ink3" }), S.line(x + 70, -34, x + 70, -2, { w: 1.4, k: "ink3" }), S.line(x + 120, -34, x + 120, -2, { w: 1.4, k: "ink3" }));
    for (k = 0; k < 6; k++) {
      var x0 = x - 6 + k * ((w + 12) / 6), x1 = x0 + (w + 12) / 6;
      sh.push(S.poly([[x0, -108], [x1, -108], [x1 + 2, -86], [x0 + 2, -86]], { f: k % 2 ? "paper" : "clay", w: 1.8 }));
    }
    sh.push(S.rect(x + 22, -76, w - 44, 18, { f: "paper", w: 1.8 }));
    if (o.t) sh.push(S.text(0, -63, o.t, { size: 12, weight: 600, italic: true }));
    for (k = 0; k < 5; k++) sh.push(S.circ(x + 20 + k * 25, -41, 8, { f: "clay", w: 1.8 }));
    return sh;
  };
  P.cupboard = function (o) {
    var st = o.state || "locked", sh = [];
    sh.push(S.rect(-34, -86, 68, 86, { f: st === "open" ? "deep" : "parts" }));
    if (st === "open") {
      sh.push(S.rect(-28, -80, 56, 32, { f: "paper", w: 1.6 }), S.circ(-12, -58, 7, { f: "clay", w: 1.8 }), S.circ(8, -58, 7, { f: "clay", w: 1.8 }));
      sh.push(S.poly([[-34, -86], [-62, -78], [-62, -8], [-34, 0]], { f: "parts" }), S.circ(-56, -42, 2.4, { f: "ink", nostroke: true }));
    } else {
      sh.push(S.rect(-28, -80, 56, 74, { w: 1.6 }), S.circ(18, -42, 3, { f: "ink", nostroke: true }));
    }
    if (st === "locked") sh.push(S.sub("padlock", 16, -30, { s: 0.9 }));
    if (st === "ask") sh.push(S.sub("ques", 16, -50, {}));
    return sh;
  };
  P.door = function () {
    return [S.rect(-30, -110, 60, 110, { f: "parts" }), S.rect(-22, -100, 44, 40, { w: 1.6 }), S.rect(-22, -52, 44, 44, { w: 1.6 }), S.circ(20, -52, 3.2, { f: "ink", nostroke: true })];
  };
  P.window = function (o) {
    var w = o.w || 80, h = o.h || 64, x = -w / 2;
    return [S.rect(x, -h, w, h, { f: o.f || "paper" }), S.line(0, -h, 0, 0, { w: 1.8 }), S.line(x, -h / 2, x + w, -h / 2, { w: 1.8 })];
  };
  P.glassbox = function (o) {
    var w = o.w || 150, h = o.h || 120, x = -w / 2;
    return [S.rect(x, -h, w, h, { f: "t-control", dash: true, w: 2.6 }), S.line(x + 12, -h + 14, x + 12, -h + 44, { w: 2, k: "ink3" }), S.line(x + 20, -h + 14, x + 20, -h + 28, { w: 2, k: "ink3" })];
  };
  P.till = function (o) {
    var sh = [];
    sh.push(S.rect(-32, -22, 64, 22, { f: "p3" }), S.p("M-30 -22L-24 -46L24 -46L30 -22Z", { f: "paper" }));
    sh.push(S.rect(-18, -66, 36, 20, { f: "oks", w: 1.8 }), S.text(0, -51, o.t || "0,00", { size: 11, font: "mono" }));
    sh.push(S.circ(-14, -34, 3, { f: "m-tools", w: 1.4 }), S.circ(-4, -34, 3, { f: "m-tools", w: 1.4 }), S.circ(6, -34, 3, { f: "m-tools", w: 1.4 }), S.circ(16, -34, 3, { f: "m-tools", w: 1.4 }));
    if (o.locked) sh.push(S.sub("padlock", 24, -2, { s: 0.8 }));
    return sh;
  };
  P.padlock = function (o) {
    var op = !!o.open, sh = [];
    sh.push(S.p(op ? "M-9 -19L-9 -30Q-9 -40 0 -40Q9 -40 9 -30L9 -26" : "M-9 -19L-9 -30Q-9 -40 0 -40Q9 -40 9 -30L9 -19", { w: 3.4 }));
    sh.push(S.rrect(-15, -20, 30, 22, 4, { f: "part", w: 2.2 }));
    sh.push(S.circ(0, -10, 3, { f: "ink", nostroke: true }), S.line(0, -10, 0, -5, { w: 2 }));
    return sh;
  };
  P.key = function () {
    return [S.circ(-12, 0, 7, { f: "part", w: 2.2 }), S.circ(-12, 0, 2.2, { f: "paper", nostroke: true }), S.line(-5, 0, 22, 0, { w: 3 }), S.line(16, 0, 16, 7, { w: 2.6 }), S.line(22, 0, 22, 6, { w: 2.6 })];
  };

  /* ---------- Things on the counter ------------------------------------------- */
  P.ticket = function (o) {
    var sh = [];
    sh.push(S.rect(-17, -46, 34, 46, { f: "paper" }), S.circ(0, -43, 2.6, { f: "clay", w: 1.4 }));
    if (o.t) sh.push(S.text(0, -26, o.t, { size: 9.5, font: "mono", weight: 500 }), S.line(-10, -17, 10, -17, { w: 1.2, k: "ink3" }), S.line(-10, -10, 6, -10, { w: 1.2, k: "ink3" }));
    else sh.push(S.line(-10, -32, 10, -32, { w: 1.4, k: "ink3" }), S.line(-10, -25, 10, -25, { w: 1.4, k: "ink3" }), S.line(-10, -18, 10, -18, { w: 1.4, k: "ink3" }), S.line(-10, -11, 4, -11, { w: 1.4, k: "ink3" }));
    return sh;
  };
  P.note = function (o) {
    var w = o.w || 46, h = o.h || 44, sh = [], x = -w / 2;
    sh.push(S.rect(x, -h, w, h, { f: o.f || "parts" }));
    if (o.t) sh.push(S.text(0, -h / 2 + 4, o.t, { size: o.size || 10, weight: 600, italic: true }));
    else sh.push(S.line(x + 8, -h + 12, x + w - 8, -h + 12, { w: 1.4 }), S.line(x + 8, -h + 21, x + w - 8, -h + 21, { w: 1.4 }), S.line(x + 8, -h + 30, x + w - 18, -h + 30, { w: 1.4 }));
    return sh;
  };
  P.sheet = function (o) {
    var sh = [], lines = o.lines || [], w = o.w || 88, h = 28 + lines.length * 17 + 8, x = -w / 2, k;
    sh.push(S.rect(x, -h, w, h, { f: "paper" }), S.circ(0, -h + 2, 3.2, { f: "clay", w: 1.4 }));
    if (o.title) sh.push(S.text(0, -h + 20, o.title, { size: 11, weight: 700, italic: true }), S.line(x + 10, -h + 25, x + w - 10, -h + 25, { w: 1.4 }));
    for (k = 0; k < lines.length; k++) sh.push(S.text(x + 9, -h + 43 + k * 17, lines[k], { size: 10, anchor: "start", font: "sans" }));
    return sh;
  };
  P.cookbook = function (o) {
    var z = o.zone || "know", sh = [];
    sh.push(S.rect(-18, -48, 36, 48, { f: "m-" + z }), S.rect(-18, -48, 7, 48, { f: "z-" + z, w: 1.6 }), S.rect(-5, -38, 18, 12, { f: "paper", w: 1.4 }));
    return sh;
  };
  P.books = function (o) {
    var n = o.n || 3, sh = [], zs = ["m-model", "m-know", "m-tools", "m-orch", "m-ops", "m-harness"], k;
    for (k = 0; k < n; k++) {
      var w = 62 - (k % 3) * 6, dx = ((k * 7) % 9) - 4;
      sh.push(S.rect(-w / 2 + dx, -(k + 1) * 13, w, 13, { f: zs[k % zs.length], w: 1.8 }), S.line(-w / 2 + dx + 6, -(k + 1) * 13 + 6.5, -w / 2 + dx + 18, -(k + 1) * 13 + 6.5, { w: 1.2, k: "paper" }));
    }
    return sh;
  };
  P.cardbox = function (o) {
    var sh = [], k, n = o.n || 5, w = 84, x = -w / 2;
    for (k = 0; k < n; k++) {
      var cx = x + 8 + k * ((w - 20) / (n - 1)), up = 12 + (k % 2) * 5;
      sh.push(S.rect(cx - 8, -34 - up, 16, 34 + up - 8, { f: "paper", w: 1.6 }), S.line(cx - 5, -30 - up + 5, cx + 5, -30 - up + 5, { w: 1.2, k: "ink3" }));
    }
    sh.push(S.p("M" + x + " -34L" + (x + 6) + " 0L" + (-x - 6) + " 0L" + (-x) + " -34Z", { f: "parts" }));
    return sh;
  };
  P.card = function (o) {
    var sh = [S.rect(-24, -32, 48, 32, { f: "paper" }), S.line(-24, -24, 24, -24, { w: 1.4, k: "clay" })];
    if (o.t) sh.push(S.text(0, -10, o.t, { size: 8.5, font: "sans", weight: 600 }));
    else sh.push(S.line(-17, -15, 17, -15, { w: 1.2, k: "ink3" }), S.line(-17, -8, 8, -8, { w: 1.2, k: "ink3" }));
    return sh;
  };
  P.notebook = function (o) {
    var sh = [S.rect(-22, -52, 44, 52, { f: "m-know" }), S.rect(-22, -52, 8, 52, { f: "z-know", w: 1.6 }), S.rect(-6, -42, 22, 14, { f: "paper", w: 1.4 })];
    if (o.t) sh.push(S.text(5, -32, o.t, { size: 8, font: "sans", weight: 600 }));
    sh.push(S.line(14, -52, 14, -44, { w: 3, k: "clay" }));
    return sh;
  };
  P.orderbook = function (o) {
    var sh = [], n = o.lines == null ? 3 : o.lines, k;
    sh.push(S.p("M-44 -2L0 -8L44 -2L44 -38L0 -44L-44 -38Z", { f: "paper" }), S.line(0, -8, 0, -44, { w: 1.8 }));
    for (k = 0; k < Math.min(n, 4); k++) sh.push(S.curve([[-37, -34 + k * 7], [-28, -35.5 + k * 7], [-18, -33 + k * 7], [-7, -34.5 + k * 7]], { w: 1.4, k: "ink3" }));
    for (k = 0; k < Math.min(Math.max(n - 4, 0), 4); k++) sh.push(S.curve([[7, -34.5 + k * 7], [16, -33 + k * 7], [27, -35.5 + k * 7], [37, -34 + k * 7]], { w: 1.4, k: "ink3" }));
    return sh;
  };
  P.phone = function (o) {
    var sh = [];
    sh.push(S.p("M-24 0L-18 -16L18 -16L24 0Z", { f: "m-tools" }), S.circ(0, -8, 4.6, { f: "paper", w: 1.6 }));
    sh.push(S.p("M-26 -22Q-28 -31 -17 -31L17 -31Q28 -31 26 -22Q19 -26 13 -24L-13 -24Q-19 -26 -26 -22Z", { f: "paper" }));
    if (o.ring) sh.push(S.g("amb-ring", [S.arc(0, -34, 18, 12, PI * 1.15, PI * 1.85, false, { w: 2 }), S.arc(0, -34, 28, 20, PI * 1.2, PI * 1.8, false, { w: 2 })], { origin: "50% 100%" }));
    return sh;
  };
  P.knife = function () {
    return [S.p("M-4 -50L-4 -4L3 -4L3 -44Q0 -50 -4 -50Z", { f: "p3" }), S.rect(-4, -5, 7, 26, { f: "part", w: 1.8 })];
  };
  P.pot = function (o) {
    var sh = [];
    sh.push(S.rect(-26, -34, 52, 34, { f: "p3" }), S.line(-34, -26, -26, -26, { w: 3 }), S.line(26, -26, 34, -26, { w: 3 }));
    sh.push(S.p("M-28 -34Q0 -48 28 -34Z", { f: "p2" }), S.circ(0, -46, 3, { f: "ink", nostroke: true }));
    if (o.steam) sh.push(P.steam({ y: -58 }));
    return sh;
  };
  P.pan = function () {
    return [S.p("M-24 -12Q-24 0 0 0Q24 0 24 -12Z", { f: "ink" }), S.line(24, -8, 52, -14, { w: 5 })];
  };
  P.oven = function (o) {
    var sh = [];
    sh.push(S.rect(-34, -60, 68, 60, { f: "p3" }), S.rect(-26, -40, 52, 32, { f: "deep", w: 2 }), S.circ(-20, -51, 3.4, { f: "paper", w: 1.4 }), S.circ(-6, -51, 3.4, { f: "paper", w: 1.4 }), S.circ(8, -51, 3.4, { f: "paper", w: 1.4 }));
    if (o.fire) sh.push(S.g("amb-flicker", [S.p("M-12 -10Q-18 -20 -10 -28Q-8 -22 -4 -26Q-2 -16 -8 -10Z", { f: "clay", w: 1.4 }), S.p("M8 -10Q4 -18 10 -26Q14 -20 16 -14Q16 -10 8 -10Z", { f: "mid", w: 1.4 })], { origin: "50% 100%" }));
    return sh;
  };
  P.tomato = function (o) {
    var r = o.r || 11, sh = [];
    if (o.soft) {
      sh.push(S.ell(0, -r * 0.6, r * 1.25, r * 0.7, { f: "clay" }), S.ell(-3, -r * 0.55, r * 0.5, r * 0.28, { f: "bad", nostroke: true }), S.line(-r * 0.4, -r * 1.2, r * 0.2, -r * 1.35, { w: 1.6, k: "ok" }));
    } else {
      sh.push(S.circ(0, -r, r, { f: "clay" }), S.poly([[0, -2 * r + 1], [-5, -2 * r - 3], [-1, -2 * r - 1], [2, -2 * r - 5], [3, -2 * r - 1], [7, -2 * r - 3]], { f: "ok", w: 1.4 }), S.arc(-r * 0.2, -r, r * 0.6, r * 0.6, PI * 0.95, PI * 1.35, false, { w: 1.4, k: "paper" }));
    }
    return sh;
  };
  P.crate = function (o) {
    var n = o.n == null ? 6 : o.n, sh = [], k;
    sh.push(S.rect(-32, -22, 64, 22, { f: "parts" }), S.line(-32, -11, 32, -11, { w: 1.4, k: "ink3" }));
    for (k = 0; k < n; k++) sh.push(S.circ(-24 + (k % 5) * 12, -24 - Math.floor(k / 5) * 12, 8, { f: "clay", w: 1.8 }));
    return sh;
  };
  P.plug = function () {
    return [S.line(-8, -6, -8, 6, { w: 3 }), S.line(-8, 6, -52, 6, { w: 3 }), S.rrect(-30, -12, 22, 24, 5, { f: "paper" }), S.line(-8, -6, 4, -6, { w: 3.4 }), S.line(-8, 6, 4, 6, { w: 3.4 })];
  };
  P.strip = function (o) {
    var n = o.n || 3, w = n * 38 + 12, sh = [S.rrect(-w / 2, -26, w, 26, 6, { f: "p3" })], k;
    for (k = 0; k < n; k++) sh.push(S.rrect(-w / 2 + 8 + k * 38, -20, 28, 14, 3, { f: "paper", w: 1.6 }), S.line(-w / 2 + 16 + k * 38, -16, -w / 2 + 16 + k * 38, -10, { w: 2 }), S.line(-w / 2 + 26 + k * 38, -16, -w / 2 + 26 + k * 38, -10, { w: 2 }));
    return sh;
  };
  P.bowl = function (o) {
    return [S.p("M-20 -14Q-20 0 0 0Q20 0 20 -14Z", { f: "paper" }), S.p("M-17 -14Q-12 -26 0 -24Q12 -26 17 -14Z", { f: o.c || "clay", w: 1.8 })];
  };
  P.plate = function (o) {
    return [S.ell(0, -4, 30, 7, { f: "paper" }), S.ell(0, -5, 18, 3.6, { w: 1.2, k: "rule" }), S.circ(-6, -14, 8, { f: o.c || "clay", w: 1.8 }), S.circ(8, -12, 7, { f: o.c || "clay", w: 1.8 })];
  };
  P.cloche = function () {
    return [S.ell(0, -3, 34, 6, { f: "p3" }), S.p("M-28 -6Q-28 -40 0 -40Q28 -40 28 -6Z", { f: "p3" }), S.circ(0, -43, 4, { f: "ink", nostroke: true })];
  };
  P.spoon = function () {
    return [S.line(0, -6, 0, -44, { w: 3 }), S.ell(0, -4, 6, 8, { f: "p3", w: 2 })];
  };
  P.alarm = function (o) {
    var sh = [S.circ(0, 0, 16, { f: "paper" }), S.circ(0, 0, 8, { w: 1.6 }), S.circ(0, 0, 2.4, { f: "clay", nostroke: true })];
    if (o.ring) sh.push(S.g("amb-shake", [S.arc(0, 0, 24, 24, PI * 1.1, PI * 1.9, false, { w: 2.4, k: "bad" }), S.arc(0, 0, 33, 33, PI * 1.15, PI * 1.85, false, { w: 2.4, k: "bad" }), S.arc(0, 0, 24, 24, PI * 0.1, PI * 0.9, false, { w: 2.4, k: "bad" }), S.arc(0, 0, 33, 33, PI * 0.15, PI * 0.85, false, { w: 2.4, k: "bad" })], {}));
    return sh;
  };
  P.fire = function (o) {
    var s = o.s2 || 1;
    return [S.g("amb-flicker", [S.p("M-14 0Q-22 -18 -10 -34Q-8 -24 -2 -30Q0 -48 8 -54Q10 -38 18 -30Q22 -14 12 0Z", { f: "clay", w: 2 }), S.p("M-6 0Q-10 -10 -2 -20Q2 -14 6 -18Q10 -8 4 0Z", { f: "mid", w: 1.4 })], { origin: "50% 100%" })];
  };
  P.clock = function (o) {
    var sh = [S.circ(0, 0, 22, { f: "paper" })], k;
    for (k = 0; k < 12; k++) { var a = k * PI / 6; sh.push(S.line(Math.sin(a) * 17, -Math.cos(a) * 17, Math.sin(a) * 20, -Math.cos(a) * 20, { w: 1.4 })); }
    sh.push(S.line(0, 0, 0, -11, { w: 3 }));
    sh.push(S.g("amb-spin", [S.line(0, 0, 0, -17, { w: 2 }), S.circ(0, 0, 1.6, { f: "ink", nostroke: true })], { origin: "50% 100%" }));
    return sh;
  };
  P.moon = function () {
    return [S.p("M10 -22Q-12 -22 -12 0Q-12 22 10 22Q-4 12 -4 0Q-4 -12 10 -22Z", { f: "part", w: 2 }), S.spark(22, -16, 5, { w: 1.6 }), S.spark(26, 10, 3.4, { w: 1.4 })];
  };
  P.camera = function () {
    return [S.line(0, -26, 0, -12, { w: 3 }), S.rrect(-22, -12, 44, 22, 5, { f: "p3" }), S.circ(8, -1, 7, { f: "ink", w: 2 }), S.circ(8, -1, 2.4, { f: "paper", nostroke: true }), S.g("amb-blink", [S.circ(-14, -4, 2.8, { f: "clay", nostroke: true })], {})];
  };
  P.receipt = function (o) {
    var sh = [S.p("M-24 0L-24 -72L24 -72L24 0L18 -6L12 0L6 -6L0 0L-6 -6L-12 0L-18 -6Z", { f: "paper" })], k;
    for (k = 0; k < 4; k++) sh.push(S.line(-16, -60 + k * 9, 16 - (k % 2) * 8, -60 + k * 9, { w: 1.4, k: "ink3" }));
    sh.push(S.line(-16, -22, 16, -22, { w: 1.4 }), S.text(0, -11, o.t || "TOTAL", { size: 10, font: "mono", weight: 500 }));
    return sh;
  };
  P.scorecard = function (o) {
    return [S.rect(-18, -38, 36, 38, { f: "paper" }), S.text(0, -13, o.t || "9", { size: o.size || 24, weight: 700, f: o.f || "z-ops" })];
  };
  P.calendar = function (o) {
    var sh = [S.rect(-28, -50, 56, 50, { f: "paper" }), S.rect(-28, -50, 56, 14, { f: "clay", w: 1.8 })], k;
    sh.push(S.text(0, -39, o.t || "", { size: 9, font: "sans", weight: 700, f: "paper" }));
    for (k = 0; k < 3; k++) sh.push(S.line(-22, -30 + k * 9, 22, -30 + k * 9, { w: 1, k: "rule" }));
    sh.push(S.line(-8, -36, -8, -4, { w: 1, k: "rule" }), S.line(8, -36, 8, -4, { w: 1, k: "rule" }));
    return sh;
  };
  P.tag = function (o) {
    return [S.p("M-26 -10L-18 -20L22 -20L22 0L-18 0Z", { f: o.f || "paper" }), S.circ(-17, -10, 2.6, { f: "ink", nostroke: true }), S.text(4, -6, o.t || "", { size: 11, font: "mono", weight: 500 })];
  };
  P.pile = function (o) {
    var n = o.n || 6, sh = [], k;
    for (k = 0; k < n; k++) {
      var dx = ((k * 23) % 50) - 25, dy = -((k * 9) % 22) - 6, rot = ((k * 37) % 40) - 20;
      sh.push(S.g("", [S.rect(dx - 18, dy - 22, 36, 26, { f: k % 3 === 0 ? "parts" : "paper", w: 1.8 }), S.line(dx - 12, dy - 14, dx + 10, dy - 14, { w: 1.2, k: "ink3" }), S.line(dx - 12, dy - 8, dx + 4, dy - 8, { w: 1.2, k: "ink3" })], { origin: "50% 50%" }));
    }
    return sh;
  };
  P.stars = function (o) {
    var n = o.n == null ? 3 : o.n, sh = [], k;
    for (k = 0; k < n; k++) sh.push(S.star((k - (n - 1) / 2) * 24, 0, 10, { f: "part", w: 1.8 }));
    return sh;
  };

  /* ---------- Marks ----------------------------------------------------------- */
  P.check = function (o) { return [S.lin([[-9, 0], [-3, 7], [10, -9]], { w: 4, k: o.k || "ok" })]; };
  P.cross = function (o) { return [S.line(-8, -8, 8, 8, { w: 4, k: o.k || "bad" }), S.line(-8, 8, 8, -8, { w: 4, k: o.k || "bad" })]; };
  P.bang = function () { return [S.line(0, -26, 0, -10, { w: 4.6, k: "clay" }), S.circ(0, -1, 2.8, { f: "clay", k: "clay", w: 1.6 })]; };
  P.ques = function () { return [S.p("M-8 -22Q-8 -32 0 -32Q9 -32 9 -24Q9 -18 0 -14L0 -9", { w: 3.6, k: "clay" }), S.circ(0, -1, 2.6, { f: "clay", k: "clay", w: 1.6 })]; };
  P.steam = function (o) {
    var y = o.y || 0;
    return [S.g("amb-steam", [S.curve([[-8, y], [-12, y - 8], [-6, y - 16], [-10, y - 26]], { w: 1.8, k: "ink3" }), S.curve([[2, y], [-2, y - 8], [4, y - 16], [0, y - 26]], { w: 1.8, k: "ink3" }), S.curve([[12, y], [8, y - 8], [14, y - 16], [10, y - 26]], { w: 1.8, k: "ink3" })], { origin: "50% 100%" })];
  };
  P.rays = function (o) {
    var n = o.n || 7, r0 = o.r0 || 22, r1 = o.r1 || 34, a0 = o.a0 == null ? -PI : o.a0, a1 = o.a1 == null ? 0 : o.a1, sh = [], k;
    for (k = 0; k < n; k++) { var a = a0 + (a1 - a0) * (n === 1 ? 0.5 : k / (n - 1)); sh.push(S.line(Math.cos(a) * r0, Math.sin(a) * r0, Math.cos(a) * r1, Math.sin(a) * r1, { w: 2.4, k: o.k || "clay" })); }
    return sh;
  };
  // Circular arrows: n arcs round a circle of radius r, each with a head. Slowly turns.
  P.cycle = function (o) {
    var r = o.r || 50, n = o.n || 4, sh = [], k;
    for (k = 0; k < n; k++) {
      var a0 = k * 2 * PI / n + 0.35, a1 = (k + 1) * 2 * PI / n - 0.2, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
      sh.push(S.arc(0, 0, r, r, a0, a1, false, { w: 3.2, k: o.k || "clay" }));
      var tx = -Math.sin(a1), ty = Math.cos(a1), hl = 11;
      sh.push(S.lin([[x1 - tx * hl + Math.cos(a1) * 7, y1 - ty * hl + Math.sin(a1) * 7], [x1 + tx * 3, y1 + ty * 3], [x1 - tx * hl - Math.cos(a1) * 7, y1 - ty * hl - Math.sin(a1) * 7]], { w: 3.2, k: o.k || "clay" }));
    }
    return [S.g(o.spin === false ? "" : "amb-spin-slow", sh, { origin: "50% 50%" })];
  };
  P.arrowline = function (o) { return S.arrow(o.pts, { w: o.w || 3, k: o.k || "clay", head: o.head || 12 }); };
  P.label = function (o) {
    var sh = [S.text(0, 0, o.t || "", { size: o.size || 15, f: o.f || "ink", italic: o.italic !== false, weight: o.weight || 600, rot: o.rot, anchor: o.anchor, font: o.font })];
    if (o.u) { var w = (o.t || "").length * (o.size || 15) * 0.26; sh.push(S.curve([[-w, 6], [-w / 3, 8], [w / 3, 4], [w, 7]], { w: 2, k: o.uk || "clay" })); }
    return sh;
  };
  P.zz = function () {
    return [S.text(0, 0, "z", { size: 16, italic: true, f: "ink3" }), S.text(11, -13, "z", { size: 20, italic: true, f: "ink3" }), S.text(26, -30, "Z", { size: 25, italic: true, f: "ink3" })];
  };
})();
