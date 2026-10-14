/* Demo "Fewer bits, smaller model": the memory the weights of a model need at a number of bits, and what rounding does to a row of weights. Computed live. */
(function () {
  "use strict";
  V3.demos.define("quantisation", function (c) {
    var h = c.h, s = c.sk.s;
    var SIZES = [[1, "1 billion"], [7, "7 billion"], [70, "70 billion"]];
    var BITS = [16, 8, 4, 3, 2];
    var DEVICES = [["a laptop with 8 GB", 8], ["16 GB", 16], ["a graphics card with 24 GB", 24], ["80 GB", 80]];
    // A made-up row of weights, most of them small, a few large, as in a real layer.
    var W = [0.05, -0.12, 0.31, -0.02, 0.08, -0.44, 0.15, 0.01, -0.07, 0.22, -0.9, 0.04, 0.11, -0.25, 0.03, 0.62, -0.09, 0.06, -0.18, 0.27, -0.01, 0.13, -0.33, 0.07];
    var size = 7, bits = 4;

    function gb(p, b) { return p * b / 8; } // billions of weights x bits / 8 = gigabytes
    function round(w, b, max) { var n = Math.pow(2, b) - 1, step = 2 * max / n; return Math.round((w + max) / step) * step - max; }
    function fmt(g) { return (g >= 10 ? Math.round(g) : Math.round(g * 10) / 10) + " GB"; }

    var out = h("ul", { class: "dm-stats", "aria-live": "polite" }), fits = h("ul", { class: "dm-q-fits" }), err = h("p", { class: "dm-q-err" });
    var svg = s("svg", { viewBox: "0 0 560 170", class: "dm-q-svg", role: "img" });
    var sizePick = c.pick("Model size", SIZES.map(function (x) { return [x[0], x[1] + " weights"]; }), 7, function (v) { size = +v; draw(); });
    var bitPick = c.pick("Bits per weight", BITS.map(function (b) { return [b, b + " bits" + (b === 16 ? " (the usual)" : "")]; }), 4, function (v) { bits = +v; draw(); });

    function draw() {
      c.sk.clear(out); c.sk.clear(fits); c.sk.clear(svg);
      var full = gb(size, 16), now = gb(size, bits);
      [[fmt(now), "memory for the weights at " + bits + " bits"], [fmt(full), "at 16 bits"], [Math.round(now / full * 100) + "%", "of the 16-bit size"]].forEach(function (x) { out.appendChild(h("li", null, h("b", null, x[0]), h("span", null, x[1]))); });
      DEVICES.forEach(function (d) {
        var ok = now <= d[1];
        fits.appendChild(h("li", { class: ok ? "is-yes" : "is-no" }, h("b", null, ok ? "Weights fit in " : "Too big for "), d[0]));
      });
      // The row of weights: the true value as a thin line, the rounded value as a dot.
      var max = 0.9, x0 = 20, dx = 520 / (W.length - 1), y0 = 85, k = 70 / max, totalErr = 0;
      var levels = bits <= 4 ? Math.pow(2, bits) : 0;
      for (var l = 0; l < levels; l++) {
        var lv = -max + l * 2 * max / (levels - 1);
        svg.appendChild(s("line", { x1: 8, x2: 552, y1: y0 - lv * k, y2: y0 - lv * k, class: "dm-q-level" }));
      }
      svg.appendChild(s("line", { x1: 8, x2: 552, y1: y0, y2: y0, class: "dm-q-zero" }));
      W.forEach(function (w, i) {
        var q = bits >= 16 ? w : round(w, bits, max), x = x0 + i * dx;
        totalErr += Math.abs(q - w);
        svg.appendChild(s("line", { x1: x, x2: x, y1: y0, y2: y0 - w * k, class: "dm-q-w" }));
        svg.appendChild(s("circle", { cx: x, cy: y0 - q * k, r: 4.5, class: "dm-q-dot" }));
      });
      svg.setAttribute("aria-label", "A row of " + W.length + " weights as lines and their rounded values as dots, at " + bits + " bits");
      err.textContent = bits >= 16 ? "At 16 bits the rounding is too small to see here." : "Each weight is rounded to one of " + Math.pow(2, bits) + " allowed values (the grey lines). The average change per weight is " + (totalErr / W.length).toFixed(3) + ", on weights whose average size is " + (W.reduce(function (a, w) { return a + Math.abs(w); }, 0) / W.length).toFixed(3) + ".";
    }
    c.body.appendChild(sizePick);
    c.body.appendChild(bitPick);
    c.body.appendChild(out);
    c.body.appendChild(fits);
    c.body.appendChild(svg);
    c.body.appendChild(err);
    draw();
  });
})();
