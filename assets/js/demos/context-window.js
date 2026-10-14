/* Demo "Fill a context window": a scripted coding task in a small window, with three remedies. The numbers are toy numbers; the mechanics are real. */
(function () {
  "use strict";
  V3.demos.define("context-window", function (c) {
    var h = c.h, num = c.num;
    var BUDGET = 8000, SUMMARY = 400, LIMIT = 0.8;
    var BASE = { system: 600, tools: 1800 };
    // Each step adds to the history, and some add a tool result. big marks the results a helper could read instead (a long file, a wide search).
    var STEPS = [
      { text: "You ask the agent to fix a failing test.", history: 120, result: 0 },
      { text: "It runs the tests. The log of the failure comes back.", history: 80, result: 900 },
      { text: "It reads cart.py, a long file.", history: 60, result: 2200, big: true },
      { text: "It edits the file. The diff is added.", history: 150, result: 100 },
      { text: "It runs the tests again.", history: 60, result: 900 },
      { text: "It searches the whole project for other uses of the function.", history: 60, result: 1600, big: true },
      { text: "It writes its answer.", history: 200, result: 0 }
    ];
    var opts = { compact: false, search: false, helper: false }, at = 0;

    // The state after step i (replayed from the start, so the switches always apply to the whole run).
    function replay(upTo) {
      var s = { system: BASE.system, tools: opts.search ? 300 : BASE.tools, history: 0, results: 0, summary: 0 }, notes = [];
      for (var i = 0; i <= upTo; i++) {
        var st = STEPS[i];
        notes = [];
        s.history += st.history;
        if (st.result) {
          if (opts.helper && st.big) { s.history += 150; notes.push("A helper read it in a window of its own. Only a 150-token summary came back."); }
          else s.results += st.result;
        }
        if (opts.compact && used(s) >= BUDGET * LIMIT && (s.history + s.results) > SUMMARY) {
          var before = s.history + s.results;
          s.summary = SUMMARY; s.history = 0; s.results = 0;
          notes.push("The window is " + Math.round(BUDGET * LIMIT / BUDGET * 100) + "% full, so the older turns were replaced by a summary: " + num(before) + " tokens became " + num(SUMMARY) + ". Details such as the exact test log are gone.");
        }
      }
      return { s: s, notes: notes };
    }
    function used(s) { return s.system + s.tools + s.history + s.results + s.summary; }

    var bar = h("div", { class: "dm-cw-bar", role: "img" }), keys = h("ul", { class: "dm-cw-keys" }), says = h("p", { class: "dm-cw-says", "aria-live": "polite" }), notes = h("div", { class: "dm-cw-notes" });
    var st = c.stepper(function (i) { at = i; draw(); });
    var LAYERS = [["system", "Instructions", "dm-cw-system"], ["tools", "Tool definitions", "dm-cw-tools"], ["summary", "Summary of older turns", "dm-cw-summary"], ["history", "Conversation", "dm-cw-history"], ["results", "Tool results", "dm-cw-results"]];
    function draw() {
      var r = replay(at), s = r.s, u = used(s), over = u > BUDGET;
      c.sk.clear(bar); c.sk.clear(keys); c.sk.clear(notes);
      var scale = Math.max(BUDGET, u);
      LAYERS.forEach(function (L) {
        var v = s[L[0]];
        if (v > 0) bar.appendChild(h("span", { class: "dm-cw-seg " + L[2], style: "width:" + (v / scale * 100).toFixed(2) + "%", title: L[1] + ": " + num(v) + " tokens" }));
        keys.appendChild(h("li", null, h("span", { class: "dm-cw-key " + L[2] }), L[1] + " ", h("b", null, num(v))));
      });
      if (over) bar.appendChild(h("span", { class: "dm-cw-over", style: "left:" + (BUDGET / scale * 100).toFixed(2) + "%" }, "limit"));
      bar.setAttribute("aria-label", num(u) + " of " + num(BUDGET) + " tokens used" + (over ? ", over the limit" : ""));
      says.textContent = STEPS[at].text + " " + num(u) + " of " + num(BUDGET) + " tokens in use" + (over ? ": over the limit." : ".");
      says.className = "dm-cw-says" + (over ? " is-over" : "");
      if (over) notes.appendChild(h("p", { class: "dm-cw-warn" }, "Over the limit. A real harness would now have to cut something or the request would fail. Try one of the switches below."));
      r.notes.forEach(function (n) { notes.appendChild(h("p", { class: "dm-cw-note" }, n)); });
      st.set(at, STEPS.length);
    }
    function sw(key, text, hint) { return c.toggle(text, false, function (v) { opts[key] = v; draw(); }, hint); }
    c.body.appendChild(st.el);
    c.body.appendChild(bar);
    c.body.appendChild(keys);
    c.body.appendChild(says);
    c.body.appendChild(notes);
    c.body.appendChild(h("div", { class: "dm-controls dm-cw-sw" },
      sw("compact", "Compact at 80% full", "Replace the older turns with a short summary."),
      sw("search", "Search for tools instead of loading all of them", "Only the tool names are in the window; a definition is loaded when it is needed."),
      sw("helper", "Let a helper read the big files", "A sub-agent reads the long file and the search results in its own window and returns a summary.")));
    draw();
  });
})();
