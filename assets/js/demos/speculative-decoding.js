/* Demo "A small model drafts, a big one checks": a hand-written run of speculative decoding, three rounds, with the draft, what the big model accepts, and how many words come out of one pass of the big model. Scripted. */
(function () {
  "use strict";
  V3.demos.define("speculative-decoding", function (c) {
    var h = c.h;
    // Each round: the small model drafts words, the big model checks them in one pass and keeps the first n; it adds one word of its own.
    var ROUNDS = [
      { draft: ["The", "cat", "sat", "on"], keep: 4, own: "the" },
      { draft: ["mat", "and", "purred", "loudly"], keep: 3, own: "softly", note: "The big model would not have said “loudly”, so the draft is cut there and its own word is used." },
      { draft: ["until", "morning", "came", "."], keep: 4, own: "Then" }
    ];
    var at = 0;
    var out = h("p", { class: "dm-sd-out", "aria-live": "polite" }), row = h("div", { class: "dm-sd-row" }), msg = h("p", { class: "dm-sd-msg" });
    var st = c.stepper(go);

    function go(i) {
      at = i;
      var r = ROUNDS[i], text = [];
      for (var k = 0; k < i; k++) { text = text.concat(ROUNDS[k].draft.slice(0, ROUNDS[k].keep), [ROUNDS[k].own]); }
      c.sk.clear(row);
      r.draft.forEach(function (w, j) { row.appendChild(h("span", { class: "dm-sd-w " + (j < r.keep ? "is-ok" : "is-cut") }, w)); });
      row.appendChild(h("span", { class: "dm-sd-w is-own" }, r.own));
      var made = r.keep + 1;
      msg.textContent = "Round " + (i + 1) + ": the small model drafts " + r.draft.length + " words fast. The big model checks all of them in one pass and keeps the first " + r.keep + ". It adds one word of its own. That is " + made + " words from one pass of the big model" + (made > 1 ? ", where plain decoding makes 1." : ".") + (r.note ? " " + r.note : "");
      var all = text.concat(r.draft.slice(0, r.keep), [r.own]);
      out.textContent = all.join(" ");
      st.set(i, ROUNDS.length);
    }
    c.body.appendChild(h("div", { class: "dm-sd-legend" }, h("span", { class: "dm-sd-w is-ok" }, "kept draft word"), h("span", { class: "dm-sd-w is-cut" }, "draft word cut"), h("span", { class: "dm-sd-w is-own" }, "word of the big model")));
    c.body.appendChild(row);
    c.body.appendChild(msg);
    c.body.appendChild(h("p", { class: "dm-sd-h" }, "Text so far"));
    c.body.appendChild(out);
    c.body.appendChild(st.el);
    go(0);
  });
})();
