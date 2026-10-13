/* AI explained (v17): extra drawings for chapters 7 to 9 (prefix c_). Same rules as props.js. */
(function () {
  "use strict";

  var C = window.COMIC, S = C.s, P = C.props;
  var PI = Math.PI;

  /* A note with several short lines. o: w, h, lines [], f (fill token), size, rot is the item's. */
  P.c_notecard = function (o) {
    var w = o.w || 100, h = o.h || 52, ls = o.lines || [], sh = [], k, x = -w / 2;
    sh.push(S.rect(x, -h, w, h, { f: o.f || "parts" }), S.circ(0, -h + 3, 2.6, { f: "clay", w: 1.4 }));
    for (k = 0; k < ls.length; k++) sh.push(S.text(0, -h + 20 + k * (o.size || 11) * 1.35, ls[k], { size: o.size || 11, weight: 600, italic: true }));
    return sh;
  };

  /* A film strip with small pictures. o: icons [prop names], bad (index of the frame that went wrong, drawn in red). */
  P.c_film = function (o) {
    var icons = o.icons || ["ticket", "phone", "tomato", "orderbook"], n = icons.length, fw = 60, gap = 8, w = n * (fw + gap) + gap, x0 = -w / 2, sh = [], k;
    sh.push(S.rect(x0, -86, w, 86, { f: "ink" }));
    for (k = 0; k < n; k++) {
      var fx = x0 + gap + k * (fw + gap), cx = fx + fw / 2, bad = k === o.bad;
      sh.push(S.rect(fx, -74, fw, 58, { f: bad ? "bads" : "paper", w: 1.6, k: bad ? "bad" : "ink" }));
      var ic = icons[k];
      if (ic === "tomato") sh.push(S.sub("tomato", cx, -26, { s: 1.2, soft: bad }));
      else if (ic === "ticket") sh.push(S.sub("ticket", cx, -22, { s: 0.85 }));
      else if (ic === "phone") sh.push(S.sub("phone", cx, -24, { s: 1.15 }));
      else if (ic === "orderbook") sh.push(S.sub("orderbook", cx, -24, { s: 0.58 }));
      else sh.push(S.sub(ic, cx, -24, { s: 0.9 }));
      sh.push(S.rect(fx + 8, -83, 8, 5, { f: "paper", nostroke: true }), S.rect(fx + fw - 16, -83, 8, 5, { f: "paper", nostroke: true }));
      sh.push(S.rect(fx + 8, -11, 8, 5, { f: "paper", nostroke: true }), S.rect(fx + fw - 16, -11, 8, 5, { f: "paper", nostroke: true }));
    }
    return sh;
  };

  /* A hand-drawn ring, to circle something. o: rx, ry, k (line token). */
  P.c_ring = function (o) {
    return [S.ell(0, 0, o.rx || 40, o.ry || 40, { w: 3.4, k: o.k || "bad", r: 1.3 })];
  };

  /* A receipt of any length, standing on its bottom edge. o: h (height), t (total text). */
  P.c_receipt = function (o) {
    var h = o.h || 72, n = Math.max(1, Math.floor((h - 36) / 9)), sh = [], k, w = 24;
    sh.push(S.p("M-24 0L-24 -" + h + "L24 -" + h + "L24 0L18 -6L12 0L6 -6L0 0L-6 -6L-12 0L-18 -6Z", { f: "paper" }));
    for (k = 0; k < n; k++) sh.push(S.line(-16, -h + 12 + k * 9, 16 - (k % 3) * 6, -h + 12 + k * 9, { w: 1.4, k: "ink3" }));
    sh.push(S.line(-16, -24, 16, -24, { w: 1.4 }), S.text(0, -12, o.t || "TOTAL", { size: 10, font: "mono", weight: 500, f: o.f || "ink" }));
    return sh;
  };

  /* Stairs going up to the right. o: n (steps), w (width of a step), h (height of a step). */
  P.c_stairs = function (o) {
    var n = o.n || 3, w = o.w || 84, h = o.h || 26, sh = [], k;
    for (k = 0; k < n; k++) sh.push(S.rect(-n * w / 2 + k * w, -(k + 1) * h, w, (k + 1) * h, { f: k % 2 ? "p3" : "parts", w: 2 }));
    return sh;
  };

  /* A thick rule book. o: t (title on the cover). */
  P.c_rulebook = function (o) {
    return [S.rect(-30, -44, 60, 44, { f: "m-ops" }), S.rect(-30, -44, 9, 44, { f: "z-ops", w: 1.6 }), S.rect(-15, -34, 38, 16, { f: "paper", w: 1.4 }), S.text(4, -22, o.t || "Rules", { size: 10, font: "sans", weight: 700 }), S.line(-28, -4, 28, -4, { w: 1.2, k: "paper" })];
  };

  /* A hanging lamp with a pool of light. o: w (width of the light). */
  P.c_lamp = function (o) {
    var w = o.w || 120, l = o.l || 70;
    return [S.line(0, -90, 0, -34, { w: 2 }), S.p("M-18 -30Q-16 -44 0 -44Q16 -44 18 -30Z", { f: "part", w: 2 }), S.poly([[-10, -28], [10, -28], [w / 2, l], [-w / 2, l]], { f: "soft", nostroke: true, r: 0.3 })];
  };

  /* Night shading: a hatched wash over the whole backdrop. o: w, h (the panel), k (hatch token). */
  P.c_nightwash = function (o) {
    return [S.rect(8, 8, (o.w || 400) - 16, (o.h || 300) - 16, { f: o.k || "z-orch", h: true, gap: o.gap || 11, fw: 1.1, ang: -38, nostroke: true, r: 0.2 })];
  };

  /* A sky with a moon and stars, in a window frame. o: w, h. */
  P.c_nightwindow = function (o) {
    var w = o.w || 90, h = o.h || 70, x = -w / 2;
    return [S.rect(x, -h, w, h, { f: "z-orch" }), S.sub("moon", -w / 5, -h * 0.58, { s: 1.1 }), S.spark(w / 4, -h * 0.7, 4, { w: 1.4, k: "paper" }), S.spark(w / 3, -h * 0.3, 3, { w: 1.2, k: "paper" }),
      S.line(0, -h, 0, 0, { w: 2.2 }), S.line(x, -h / 2, x + w, -h / 2, { w: 2.2 }), S.rect(x - 4, -2, w + 8, 6, { f: "p3" })];
  };

  /* A small round smiling chef's head with a hat, for crowds. */
  P.c_minichef = function (o) {
    return [S.sub("chef", 0, 0, { s: o.s || 0.5, mood: o.mood || "happy", arms: o.arms || "down" })];
  };

  /* A tick box with a line of text (a log entry). o: t, ok (true: tick, false: cross). */
  P.c_logline = function (o) {
    var sh = [];
    sh.push(S.rect(-8, -8, 16, 16, { f: "paper", w: 1.6 }));
    if (o.ok === false) sh.push(S.line(-5, -5, 5, 5, { w: 2.6, k: "bad" }), S.line(-5, 5, 5, -5, { w: 2.6, k: "bad" }));
    else sh.push(S.lin([[-5, 0], [-1, 5], [6, -6]], { w: 2.8, k: "ok" }));
    sh.push(S.text(15, 4, o.t || "", { size: o.size || 11, anchor: "start", font: "sans", weight: 500 }));
    return sh;
  };

  /* A little arrow-shaped sign pointing right or left. o: t, w, flip is the item's. */
  P.c_arrowsign = function (o) {
    var w = o.w || 90;
    return [S.poly([[-w / 2, -16], [w / 2 - 12, -16], [w / 2, -2], [w / 2 - 12, 12], [-w / 2, 12]], { f: o.f || "parts", w: 1.8 }), S.text(-6, 0, o.t || "", { size: o.size || 11, weight: 700, italic: true })];
  };

  /* A page of a log hung on the wall, standing on its bottom edge. o: title, rows [[text, ok]], w. */
  P.c_logpage = function (o) {
    var rows = o.rows || [], w = o.w || 210, h = 46 + rows.length * 28, x = -w / 2, sh = [], k;
    sh.push(S.rect(x, -h, w, h, { f: "paper" }), S.circ(0, -h + 3, 3, { f: "clay", w: 1.4 }));
    if (o.title) sh.push(S.text(0, -h + 24, o.title, { size: 13, weight: 700, italic: true }), S.line(x + 12, -h + 31, x + w - 12, -h + 31, { w: 1.4 }));
    for (k = 0; k < rows.length; k++) sh.push(S.sub("c_logline", x + 20, -h + 52 + k * 28, { t: rows[k][0], ok: rows[k][1], size: o.size || 11 }));
    return sh;
  };
})();
