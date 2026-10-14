/* Demo "One try or many": pass@k (at least one of k runs works) and pass^k (all k runs work) from the chance of success on one try. Computed live. */
(function () {
  "use strict";
  V3.demos.define("pass-k", function (c) {
    var h = c.h, s = c.sk.s, p = 0.8, k = 5, KMAX = 20;
    var W = 560, H = 230, L = 44, R = 70, T = 14, B = 34;
    function x(i) { return L + (W - L - R) * (i - 1) / (KMAX - 1); }
    function y(v) { return T + (H - T - B) * (1 - v); }
    function atLeast(i) { return 1 - Math.pow(1 - p, i); }
    function every(i) { return Math.pow(p, i); }
    function pct(v) {
      var r = v * 100;
      if (v >= 1) return "100%";
      if (v >= 0.9999) return "over 99.99%";
      if (r >= 99) return r.toFixed(2) + "%";
      if (r < 0.05) return "under 0.1%";
      return (r < 10 ? r.toFixed(1) : String(Math.round(r))) + "%";
    }

    var svg = s("svg", { viewBox: "0 0 " + W + " " + H, class: "dm-pk-svg", "aria-hidden": "true" });
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      svg.appendChild(s("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "dm-pk-grid" }));
      svg.appendChild(s("text", { x: L - 8, y: y(v) + 4, class: "dm-pk-tick", "text-anchor": "end" }, Math.round(v * 100) + "%"));
    });
    [1, 5, 10, 15, 20].forEach(function (i) { svg.appendChild(s("text", { x: x(i), y: H - 18, class: "dm-pk-tick", "text-anchor": "middle" }, String(i))); });
    svg.appendChild(s("text", { x: (L + W - R) / 2, y: H - 3, class: "dm-pk-tick", "text-anchor": "middle" }, "number of runs (k)"));
    var lineA = s("path", { class: "dm-pk-a", fill: "none" }), lineB = s("path", { class: "dm-pk-b", fill: "none" });
    var dotA = s("circle", { r: 5, class: "dm-pk-dot dm-pk-dot-a" }), dotB = s("circle", { r: 5, class: "dm-pk-dot dm-pk-dot-b" });
    var labA = s("text", { class: "dm-pk-lab dm-pk-lab-a", x: W - R + 8 }), labB = s("text", { class: "dm-pk-lab dm-pk-lab-b", x: W - R + 8 });
    var guide = s("line", { class: "dm-pk-guide", y1: T, y2: H - B });
    [guide, lineA, lineB, dotA, dotB, labA, labB].forEach(function (n) { svg.appendChild(n); });

    var summary = h("p", { class: "dm-pk-sum", "aria-live": "polite" });
    var tbody = h("tbody");
    var table = h("table", { class: "dm-pk-table" }, h("thead", null, h("tr", null, h("th", { scope: "col" }, "Runs"), h("th", { scope: "col" }, "At least one works"), h("th", { scope: "col" }, "Every run works"))), tbody);

    function draw() {
      var a = "", b = "";
      for (var i = 1; i <= KMAX; i++) { a += (i === 1 ? "M" : "L") + x(i).toFixed(1) + " " + y(atLeast(i)).toFixed(1); b += (i === 1 ? "M" : "L") + x(i).toFixed(1) + " " + y(every(i)).toFixed(1); }
      lineA.setAttribute("d", a); lineB.setAttribute("d", b);
      dotA.setAttribute("cx", x(k)); dotA.setAttribute("cy", y(atLeast(k)));
      dotB.setAttribute("cx", x(k)); dotB.setAttribute("cy", y(every(k)));
      guide.setAttribute("x1", x(k)); guide.setAttribute("x2", x(k));
      var ya = y(atLeast(KMAX)), yb = y(every(KMAX)), gap = Math.abs(ya - yb);
      labA.setAttribute("y", (gap < 16 ? Math.min(ya, yb) - 6 : ya) + 4); labB.setAttribute("y", (gap < 16 ? Math.max(ya, yb) + 6 : yb) + 4);
      labA.textContent = "at least one"; labB.textContent = "every run";
      summary.textContent = "On one try it works " + pct(p) + " of the time. Run it " + k + " " + (k === 1 ? "time" : "times") + ": the chance that at least one run works is " + pct(atLeast(k)) + ", and the chance that every run works is " + pct(every(k)) + ".";
      c.sk.clear(tbody);
      [1, 3, 5, 10, 20].forEach(function (i) { tbody.appendChild(h("tr", { class: i === k ? "is-now" : null }, h("td", null, String(i)), h("td", null, pct(atLeast(i))), h("td", null, pct(every(i))))); });
    }
    var sp = c.slider("Success on one try", { min: 10, max: 100, step: 1, value: 80 }, function (v) { return v + "%"; }, function (v) { p = v / 100; draw(); });
    var sk = c.slider("Number of runs (k)", { min: 1, max: KMAX, step: 1, value: 5 }, function (v) { return String(v); }, function (v) { k = v; draw(); });
    c.body.appendChild(h("div", { class: "dm-controls" }, sp, sk));
    c.body.appendChild(summary);
    c.body.appendChild(svg);
    c.body.appendChild(table);
    draw();
  });
})();
