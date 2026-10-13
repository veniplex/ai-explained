/* AI explained: extra drawings made for chapters 4 to 6. Names start with "b_". */
(function () {
  "use strict";
  var C = window.COMIC, S = C.s, P = C.props;
  var PI = Math.PI;

  // A small framed picture inside a picture. Origin at its centre.
  P.b_card = function (o) {
    var w = o.w || 190, h = o.h || 110;
    return [S.rrect(-w / 2, -h / 2, w, h, 12, { f: o.f || "paper", w: 2.2 })];
  };
  // A circled number, origin at its centre.
  P.b_num = function (o) {
    return [S.circ(0, 0, 11, { f: o.f || "clay", w: 2 }), S.text(0, 5, String(o.t || "1"), { size: 14, weight: 700, f: "paper" })];
  };
  // A dashed line for a call or message in the air: o.pts are absolute points.
  P.b_dash = function (o) { return [S.curve(o.pts, { w: o.w || 2.2, dash: true, k: o.k || "ink3" })]; };
  // Small thought-bubble dots: o.pts are absolute points, o.rs their radii.
  P.b_dots = function (o) {
    return o.pts.map(function (p, i) { return S.circ(p[0], p[1], (o.rs || [3, 4.5])[i] || 3, { f: "paper", w: 1.8 }); });
  };
  // A dashed round-cornered frame with its origin at the top left; o.w, o.h.
  P.b_frame = function (o) {
    return [S.rrect(0, 0, o.w || 300, o.h || 200, 16, { w: 2.4, dash: true, k: o.k || "ink3" })];
  };
  // A thought cloud, origin at its centre; o.w, o.h; inside it goes one other prop: o.inside = ["prop", dx, dy, {opts}].
  P.b_cloud = function (o) {
    var w = o.w || 80, h = o.h || 50, sh = [], a = w / 2, b = h / 2;
    sh.push(S.p("M" + (-a + 8) + " 0Q" + (-a - 4) + " " + (-b * 0.6) + " " + (-a * 0.55) + " " + (-b * 0.7) + "Q" + (-a * 0.3) + " " + (-b * 1.25) + " 0 " + (-b * 0.85) + "Q" + (a * 0.4) + " " + (-b * 1.25) + " " + (a * 0.7) + " " + (-b * 0.6) + "Q" + (a + 6) + " " + (-b * 0.2) + " " + (a - 4) + " " + (b * 0.35) + "Q" + (a * 0.8) + " " + (b * 1.15) + " " + (a * 0.3) + " " + (b * 0.8) + "Q0 " + (b * 1.3) + " " + (-a * 0.4) + " " + (b * 0.85) + "Q" + (-a - 2) + " " + (b * 0.9) + " " + (-a + 8) + " 0Z", { f: "paper", w: 2.2 }));
    if (o.inside) sh.push(S.sub(o.inside[0], o.inside[1], o.inside[2], o.inside[3] || {}));
    return sh;
  };
  // A stall's SOLD OUT board, origin at its bottom centre.
  P.b_soldout = function () {
    return [S.rect(-42, -26, 84, 26, { f: "bads", w: 2.2 }), S.text(0, -9, "SOLD OUT", { size: 13, weight: 700, font: "sans", f: "bad" })];
  };
  // A red stop sign, origin at its bottom centre (it stands on a short post).
  P.b_stop = function (o) {
    var r = o.r || 26, cy = -r - 16, pts = [], k;
    for (k = 0; k < 8; k++) { var a = PI / 8 + k * PI / 4; pts.push([Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return [S.line(0, -16, 0, 0, { w: 4 }), S.poly(pts, { f: "bad", w: 2.2 }), S.text(0, cy + 5, o.t || "STOP", { size: 13, weight: 700, font: "sans", f: "paper" })];
  };
  // A piece of tape or a pin to hold a sheet to the wall.
  P.b_tape = function (o) {
    return [S.p("M-14 -6L14 -9L16 3L-12 6Z", { f: "mid", w: 1.4 })];
  };
  // A recipe card, big enough to read: o.title, o.lines. Origin at its bottom centre.
  P.b_bigcard = function (o) {
    var lines = o.lines || [], w = o.w || 112, h = 34 + lines.length * 15 + 6, x = -w / 2, k, sh = [];
    sh.push(S.rect(x, -h, w, h, { f: "paper", w: 2.2 }), S.line(x, -h + 24, x + w, -h + 24, { w: 2, k: "clay" }));
    sh.push(S.text(0, -h + 17, o.title || "", { size: 12, weight: 700, italic: true }));
    for (k = 0; k < lines.length; k++) sh.push(S.text(x + 9, -h + 41 + k * 15, lines[k], { size: 10, anchor: "start", font: "sans" }));
    return sh;
  };
  // A card box with the cards' titles on their tops, origin at its bottom centre. o.titles: short words.
  P.b_titlebox = function (o) {
    var t = o.titles || ["", "", ""], n = t.length, sh = [], k, w = 100, x = -w / 2;
    for (k = 0; k < n; k++) {
      var cx = x + 17 + k * ((w - 34) / Math.max(n - 1, 1)), up = 18 + (k % 2) * 8;
      sh.push(S.rect(cx - 15, -26 - up, 30, up + 4, { f: "paper", w: 1.8 }));
      sh.push(S.line(cx - 10, -26 - up + 6, cx + 10, -26 - up + 6, { w: 1.4, k: "ink3" }));
      if (t[k]) sh.push(S.line(cx - 10, -26 - up + 12, cx + 4, -26 - up + 12, { w: 1.4, k: "ink3" }));
    }
    sh.push(S.p("M" + x + " -28L" + (x + 6) + " 0L" + (-x - 6) + " 0L" + (-x) + " -28Z", { f: "parts" }));
    sh.push(S.text(0, -9, o.label || "", { size: 10, font: "sans", weight: 600 }));
    return sh;
  };
  // An open notebook lying on the counter, origin at its bottom centre. o.lines: short handwritten lines.
  P.b_openbook = function (o) {
    var lines = o.lines || [], sh = [], k, w = o.w || 120, h = o.h || 56, x = -w / 2;
    sh.push(S.p("M" + x + " -2L0 -8L" + (-x) + " -2L" + (-x) + " " + (-h) + "L0 " + (-h - 6) + "L" + x + " " + (-h) + "Z", { f: "paper", w: 2.2 }));
    sh.push(S.line(0, -8, 0, -h - 6, { w: 1.8 }));
    for (k = 0; k < lines.length; k++) sh.push(S.text(x + 9, -h + 12 + k * 13, lines[k], { size: o.size || 10, anchor: "start", font: "sans", italic: true }));
    return sh;
  };
  // A rule wall sign pinned up: a small bunting flag row is not needed; this is a ribbon label with ink text.
  P.b_ribbon = function (o) {
    var w = o.w || 120, x = -w / 2;
    return [S.p("M" + x + " -18L" + (-x) + " -18L" + (-x - 8) + " -9L" + (-x) + " 0L" + x + " 0L" + (x + 8) + " -9Z", { f: o.f || "paper", w: 2 }), S.text(0, -5, o.t || "", { size: o.size || 12, weight: 700, font: "sans" })];
  };
  // A little burnt pot, for the test kitchen.
  P.b_burnt = function () {
    return [S.rect(-22, -28, 44, 28, { f: "ink" }), S.line(-30, -22, -22, -22, { w: 3 }), S.line(22, -22, 30, -22, { w: 3 }), S.p("M-24 -28Q0 -40 24 -28Z", { f: "p3" }),
      S.g("amb-steam", [S.curve([[-8, -44], [-12, -52], [-6, -60], [-10, -70]], { w: 2, k: "ink3" }), S.curve([[6, -44], [2, -52], [8, -60], [4, -70]], { w: 2, k: "ink3" })], { origin: "50% 100%" })];
  };
})();
