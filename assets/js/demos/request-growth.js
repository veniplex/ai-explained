/* Demo "The request is sent again every turn": four turns of one task, the tokens sent each turn, and what caching does to the bill. Computed live. */
(function () {
  "use strict";
  V3.demos.define("request-growth", function (c) {
    var h = c.h, num = c.num;
    var PREFIX = 2400; // instructions and tool definitions, the same on every turn
    // What each turn adds to the conversation after it (the model's reply and the tool result), and what the user writes on turn 1.
    var USER = 200, ADDED = [1950, 3320, 1100, 0];
    var LABELS = ["You ask. The model calls a tool.", "It reads a long file.", "It edits and runs the tests.", "The model answers."];
    var turns = [];
    for (var i = 0; i < 4; i++) {
      // prev = everything the previous request already held; fresh = what is new on this turn.
      var total = i === 0 ? PREFIX + USER : turns[i - 1].total + ADDED[i - 1];
      turns.push({ total: total, prev: i === 0 ? 0 : turns[i - 1].total, fresh: total - (i === 0 ? 0 : turns[i - 1].total), label: LABELS[i] });
    }
    var max = turns[3].total, at = 0, cache = false, price = 3, cached = 0.3;

    function cost(upTo, useCache) {
      var sum = 0;
      for (var i = 0; i <= upTo; i++) {
        var t = turns[i];
        sum += useCache ? (t.prev * cached + t.fresh * price) : t.total * price;
      }
      return sum / 1e6;
    }
    function money(v) { return "$" + (v < 0.01 ? v.toFixed(4) : v.toFixed(3)); }

    var rows = h("div", { class: "dm-rg-rows" }), stats = h("ul", { class: "dm-stats", "aria-live": "polite" });
    var st = c.stepper(function (i) { at = i; draw(); });
    function seg(cls, tokens, text) { return tokens > 0 ? h("span", { class: "dm-rg-seg " + cls, style: "width:" + (tokens / max * 100).toFixed(2) + "%", title: text + ": " + num(tokens) + " tokens" }) : null; }
    function draw() {
      c.sk.clear(rows); c.sk.clear(stats);
      var sent = 0;
      turns.forEach(function (t, i) {
        if (i > at) return;
        sent += t.total;
        var seen = t.prev; // the part of this request that the last one already held
        var bar = h("div", { class: "dm-rg-bar", role: "img", "aria-label": "Turn " + (i + 1) + " sends " + num(t.total) + " tokens" + (cache && seen ? ", of which " + num(seen) + " are cached" : "") },
          seg(cache ? "dm-rg-cached" : "dm-rg-old", seen, cache ? "Cached" : "Sent again"),
          seg("dm-rg-new", t.fresh, "New this turn"));
        rows.appendChild(h("div", { class: "dm-rg-row" },
          h("div", { class: "dm-rg-lab" }, h("b", null, "Turn " + (i + 1)), h("span", null, t.label)),
          bar,
          h("div", { class: "dm-rg-n" }, num(t.total))));
      });
      var plain = cost(at, false), withCache = cost(at, true), shown = cache ? withCache : plain;
      [[num(sent), "tokens sent so far"], [num(turns[at].total), "tokens in this turn's request"], [money(shown), cache ? "input cost with caching" : "input cost"]].forEach(function (s) { stats.appendChild(h("li", null, h("b", null, s[0]), h("span", null, s[1]))); });
      if (cache && at > 0) stats.appendChild(h("li", null, h("b", null, Math.round((1 - withCache / plain) * 100) + "% less"), h("span", null, "than without caching (" + money(plain) + ")")));
      st.set(at, turns.length);
    }
    var legend = h("p", { class: "dm-rg-legend" },
      h("span", { class: "dm-rg-key dm-rg-old" }), " Sent again from the last turn  ", h("span", { class: "dm-rg-key dm-rg-cached" }), " Read from the cache  ", h("span", { class: "dm-rg-key dm-rg-new" }), " New this turn");
    var cacheBox = c.toggle("Cache the part that has not changed", false, function (v) { cache = v; draw(); }, "Everything the last request held is the same prefix again, so it is read from the cache at a lower price.");
    var p1 = h("input", { type: "number", min: "0", step: "0.1", value: String(price), id: "dm-rg-p1", class: "dm-pm-in dm-rg-num" });
    var p2 = h("input", { type: "number", min: "0", step: "0.01", value: String(cached), id: "dm-rg-p2", class: "dm-pm-in dm-rg-num" });
    p1.addEventListener("input", function () { price = Math.max(0, parseFloat(p1.value) || 0); draw(); });
    p2.addEventListener("input", function () { cached = Math.max(0, parseFloat(p2.value) || 0); draw(); });
    var prices = h("div", { class: "dm-controls" },
      h("label", { class: "dm-rg-field", for: "dm-rg-p1" }, "Input price, dollars per million tokens", p1),
      h("label", { class: "dm-rg-field", for: "dm-rg-p2" }, "Cached input price, dollars per million", p2));

    c.body.appendChild(st.el);
    c.body.appendChild(legend);
    c.body.appendChild(rows);
    c.body.appendChild(stats);
    c.body.appendChild(cacheBox);
    c.body.appendChild(prices);
    draw();
  });
})();
