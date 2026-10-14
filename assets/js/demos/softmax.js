/* Demo "From scores to a pick": the made-up scores (logits) of a model for the next word, turned into chances by softmax at a temperature you choose, and a row of draws. Computed live. */
(function () {
  "use strict";
  V3.demos.define("softmax", function (c) {
    var h = c.h;
    // Made-up scores for the next word after "The capital of France is".
    var TOK = [[" Paris", 9.0], [" the", 6.2], [" a", 5.6], [" located", 5.1], [" Lyon", 4.8], [" not", 4.3], [" famous", 3.6], [" Berlin", 2.9]];
    var temp = 1, last = null;

    function chances(t) {
      var m = Math.max.apply(null, TOK.map(function (x) { return x[1]; })), e = TOK.map(function (x) { return Math.exp((x[1] - m) / t); });
      var sum = e.reduce(function (a, b) { return a + b; }, 0);
      return e.map(function (v) { return v / sum; });
    }
    function pct(v) { return v < 0.001 ? "under 0.1%" : (v >= 0.1 ? Math.round(v * 100) : Math.round(v * 1000) / 10) + "%"; }

    var rows = h("ul", { class: "dm-sm-rows" });
    var draws = h("p", { class: "dm-sm-draws", "aria-live": "polite" }, "Press the button to draw ten next words from these chances.");
    var summary = h("p", { class: "dm-sm-sum", "aria-live": "polite" });

    function draw() {
      var p = chances(temp);
      c.sk.clear(rows);
      TOK.forEach(function (x, i) {
        var bar = h("span", { class: "dm-sm-bar" }); bar.style.width = (p[i] * 100).toFixed(1) + "%";
        rows.appendChild(h("li", { class: "dm-sm-row" }, h("code", { class: "dm-sm-tok" }, x[0].replace(" ", "·")), h("span", { class: "dm-sm-score" }, "score " + x[1].toFixed(1)), h("span", { class: "dm-sm-track" }, bar), h("b", { class: "dm-sm-pct" }, pct(p[i]))));
      });
      var top = p[0];
      summary.textContent = temp <= 0.15
        ? "At a temperature this low the top word takes almost everything (" + pct(top) + "): nearly the same pick every time."
        : "The top word gets " + pct(top) + ", and the rest share " + pct(1 - top) + ". " + (temp > 1.4 ? "Flat chances: odd words get picked now and then." : "Lower the temperature to sharpen this, raise it to flatten it.");
      if (last) { last = null; draws.textContent = "The chances changed. Draw again."; }
    }
    function sample() {
      var p = chances(temp), counts = TOK.map(function () { return 0; }), picks = [];
      for (var n = 0; n < 10; n++) {
        var r = Math.random(), acc = 0, k = 0;
        for (; k < p.length - 1; k++) { acc += p[k]; if (r < acc) break; }
        counts[k]++; picks.push(TOK[k][0].trim());
      }
      last = picks;
      draws.textContent = "Ten draws: " + picks.join(", ") + ".";
    }

    var t = c.slider("Temperature", { min: 5, max: 200, step: 5, value: 100 }, function (v) { return (v / 100).toFixed(2); }, function (v) { temp = v / 100; draw(); });
    var btn = h("button", { type: "button", class: "btn btn-sm btn-ink" }, "Draw ten words");
    btn.addEventListener("click", sample);
    c.body.appendChild(h("div", { class: "dm-controls" }, t, btn));
    c.body.appendChild(summary);
    c.body.appendChild(rows);
    c.body.appendChild(draws);
    draw();
  });
})();
