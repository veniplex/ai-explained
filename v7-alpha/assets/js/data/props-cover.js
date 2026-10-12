/* Agentic AI, Explained (v7): drawings only the cover uses. */
(function () {
  "use strict";
  var S = window.COMIC.s, P = window.COMIC.props;
  // A button like the ones in the dock: o.t the text, o.w the width, o.f the fill.
  P.pill = function (o) {
    var w = o.w || 120;
    return [S.rrect(-w / 2, -22, w, 44, 22, { f: o.f || "paper", w: 2.4 }), S.text(0, 6, o.t || "", { size: 17, font: "sans", weight: 600, f: o.tf || "ink", italic: false })];
  };
  // A key on a keyboard.
  P.keycap = function (o) {
    return [S.rrect(-22, -40, 44, 40, 7, { f: "paper", w: 2.4 }), S.rrect(-16, -35, 32, 28, 5, { f: "p2", w: 1.2, k: "rule" }), S.text(0, -13, o.t || "", { size: 22, font: "sans", weight: 600, italic: false })];
  };
})();
