/* AI explained (v16): extra drawings made for chapters 1 to 3. Names start with "a_". */
(function () {
  "use strict";
  var C = window.COMIC, S = C.s, P = C.props;

  // A cord from an appliance down into a socket: o.pts are absolute points (first at the appliance, last at the socket). Ends in a small plug.
  P.a_cord = function (o) {
    var pts = o.pts, last = pts[pts.length - 1], x = last[0], y = last[1];
    return [
      S.curve(pts, { w: 2.8 }),
      S.rrect(x - 7, y - 4, 14, 13, 3, { f: "paper", w: 2 }),
      S.line(x - 3, y + 9, x - 3, y + 14, { w: 2.6 }), S.line(x + 3, y + 9, x + 3, y + 14, { w: 2.6 })
    ];
  };
  // A dashed line, for a call or a message travelling through the air.
  P.a_wire = function (o) { return [S.curve(o.pts, { w: 2.2, dash: true, k: o.k || "ink3" })]; };
})();
