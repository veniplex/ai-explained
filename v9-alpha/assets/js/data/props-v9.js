/* Agentic AI, Explained (v9): drawings made for the one-room kitchen. Names start with "v_". Same rules as props.js. */
(function () {
  "use strict";
  var C = window.COMIC, S = C.s, P = C.props;

  // A socket board on the wall with identical sockets; a cord with the same plug runs from each socket down to an appliance.
  // Origin: the middle of the board's bottom edge. o.w (board width), o.n (sockets), o.to: [[dx, dy], …] where the cords end (relative to the origin).
  P.v_sockets = function (o) {
    var n = o.n || 3, w = o.w || 150, x0 = -w / 2, sh = [], k;
    sh.push(S.rrect(x0, -30, w, 30, 7, { f: "p3", w: 2.4 }));
    for (k = 0; k < n; k++) {
      var cx = x0 + (w / (n + 1)) * (k + 1);
      sh.push(S.rrect(cx - 12, -23, 24, 16, 4, { f: "paper", w: 1.6 }), S.line(cx - 5, -18, cx - 5, -12, { w: 2 }), S.line(cx + 5, -18, cx + 5, -12, { w: 2 }));
    }
    (o.to || []).forEach(function (t, i) {
      var cx = x0 + (w / (n + 1)) * (i + 1);
      sh.push(S.curve([[cx, 4], [cx + (t[0] - cx) * 0.15, 4 + t[1] * 0.4], [cx + (t[0] - cx) * 0.8, t[1] * 0.75], [t[0], t[1]]], { w: 2.6 }));
      sh.push(S.rrect(cx - 7, 2, 14, 12, 3, { f: "paper", w: 1.8 }));
    });
    return sh;
  };

  // A bar on the wall with knives hanging from it, blade down. Origin: the middle of the bar. o.n (knives).
  P.v_knives = function (o) {
    var n = o.n || 3, w = n * 22 + 14, x0 = -w / 2, sh = [], k;
    sh.push(S.rrect(x0, -6, w, 12, 4, { f: "part", w: 2 }));
    for (k = 0; k < n; k++) {
      var cx = x0 + 18 + k * 22, len = 40 + (k % 2) * 8;
      sh.push(S.rect(cx - 3, 6, 6, 18, { f: "ink", w: 1.4 }), S.p("M" + (cx - 4) + " 24L" + (cx - 4) + " " + (24 + len) + "Q" + (cx + 4) + " " + (24 + len - 4) + " " + (cx + 4) + " 24Z", { f: "p3", w: 1.8 }));
    }
    return sh;
  };

  // A knife block standing on the counter: a wooden block with three handles sticking out. Origin: the middle of its bottom edge.
  P.v_block = function () {
    return [S.p("M-24 0L-20 -34L20 -34L24 0Z", { f: "part", w: 2 }), S.rect(-14, -46, 7, 14, { f: "ink", w: 1.4 }), S.rect(-3, -50, 7, 18, { f: "ink", w: 1.4 }), S.rect(8, -44, 7, 12, { f: "ink", w: 1.4 })];
  };

  // A framed note hung on the wall (the house rules); a sheet of paper with a heading and a few lines, wider than the sheet prop.
  P.v_pinned = function (o) {
    var lines = o.lines || [], w = o.w || 130, h = 36 + lines.length * 18, x = -w / 2, sh = [], k;
    sh.push(S.rect(x, -h, w, h, { f: "paper", w: 2.2 }), S.circ(0, -h + 6, 3.4, { f: "bad", w: 1.4 }));
    if (o.title) sh.push(S.text(0, -h + 26, o.title, { size: 13, weight: 700, italic: true }));
    for (k = 0; k < lines.length; k++) sh.push(S.text(x + 12, -h + 46 + k * 18, lines[k], { size: 11.5, anchor: "start", font: "sans", weight: 500 }));
    return sh;
  };

  // Footprints-free helper marker: a small hand-drawn arrow curving over an area. o.pts, o.k. Drawn dashed so it reads as a path.
  P.v_path = function (o) { return S.arrow(o.pts, { w: o.w || 2.6, k: o.k || "clay", head: 10, dash: true }); };
})();
