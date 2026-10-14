/* Demo "Break the loop": a hand-written run of an agent whose fix does not work, with three safeguards that can be switched on. The costs are made up. */
(function () {
  "use strict";
  V3.demos.define("loop-break", function (c) {
    var h = c.h, num = c.num;
    var KINDS = { think: "Think", act: "Act", observe: "Observe", stop: "Stopped" };
    var MAXN = 20, LIMIT = 8, BUDGET = 40000, REPEATS = 3;
    var FAIL = "1 failed: total() counts the last item twice.";
    // The script: think once, then edit, test, see the same failure, again and again.
    function line(n) {
      if (n === 1) return ["think", "The test fails. I will read the error and fix the code."];
      if (n === 2) return ["act", "run_tests()"];
      if (n === 3) return ["observe", FAIL];
      var k = (n - 4) % 3;
      return k === 0 ? ["act", "edit_file(\"cart.py\")"] : k === 1 ? ["act", "run_tests()"] : ["observe", FAIL];
    }
    function tokensOf(n) { return 1500 + 450 * n; } // each step sends the whole history again, so a step costs more than the last
    var on = { limit: false, repeat: false, budget: false }, token = 0, timer = 0;
    var log = h("ol", { class: "dm-lb-log", "aria-live": "off" }), sum = h("p", { class: "dm-lb-sum", "aria-live": "polite" }), meter = h("p", { class: "dm-lb-meter" });
    var runBtn = h("button", { type: "button", class: "btn btn-sm btn-ink" }, "Run the agent");

    function simulate() {
      var lines = [], total = 0, fails = 0, reason = null;
      for (var n = 1; n <= MAXN; n++) {
        var l = line(n); total += tokensOf(n);
        lines.push({ kind: l[0], text: l[1], n: n, total: total });
        if (l[0] === "observe") fails++;
        if (on.limit && n >= LIMIT) { reason = "Step limit: " + LIMIT + " steps reached. The harness stops the loop and reports what was tried."; break; }
        if (on.repeat && fails >= REPEATS) { reason = "The same failure " + REPEATS + " times in a row. The harness stops the loop and hands the problem to a person."; break; }
        if (on.budget && total >= BUDGET) { reason = "Token budget of " + num(BUDGET) + " used up. The harness stops the loop."; break; }
      }
      return { lines: lines, reason: reason, total: total };
    }
    function play() {
      clearTimeout(timer);
      var my = ++token, r = simulate(), i = 0;
      c.sk.clear(log); sum.textContent = ""; sum.className = "dm-lb-sum"; meter.textContent = "";
      runBtn.disabled = true;
      function add() {
        if (my !== token) return;
        if (i >= r.lines.length) { finish(); return; }
        var l = r.lines[i++];
        log.appendChild(h("li", { class: "dm-lb-ls dm-lb-" + l.kind }, h("span", { class: "dm-lb-n" }, String(l.n)), h("span", { class: "dm-lb-kind" }, KINDS[l.kind]), l.kind === "act" ? h("code", null, l.text) : h("span", null, l.text)));
        meter.textContent = num(l.total) + " tokens used so far";
        timer = setTimeout(add, c.reduced ? 0 : 320);
      }
      function finish() {
        runBtn.disabled = false;
        if (r.reason) { log.appendChild(h("li", { class: "dm-lb-ls dm-lb-stop" }, h("span", { class: "dm-lb-n" }, "·"), h("span", { class: "dm-lb-kind" }, KINDS.stop), h("span", null, r.reason))); sum.textContent = "Stopped after " + r.lines.length + " steps and about " + num(r.total) + " tokens."; sum.className = "dm-lb-sum is-ok"; }
        else { sum.textContent = "Nothing stopped it. This run was cut off by the demo at " + MAXN + " steps, after about " + num(r.total) + " tokens, and the loop would have gone on. The model never decided to stop, because every try looked like progress."; sum.className = "dm-lb-sum is-bad"; }
      }
      if (c.reduced) { while (i < r.lines.length) add(); finish(); } else timer = setTimeout(add, 200);
    }
    runBtn.addEventListener("click", play);
    function sw(key, text, hint) { return c.toggle(text, false, function (v) { on[key] = v; }, hint); }
    c.body.appendChild(h("div", { class: "dm-controls dm-cw-sw" },
      sw("limit", "Step limit: stop after " + LIMIT + " steps", "A counter in the harness, outside the model."),
      sw("repeat", "Stop on the same failure " + REPEATS + " times in a row", "The harness compares the results; the model is not asked."),
      sw("budget", "Token budget: stop at " + num(BUDGET) + " tokens", "The harness adds up what each step sends and receives.")));
    c.body.appendChild(h("div", { class: "dm-steps" }, runBtn, meter));
    c.body.appendChild(log);
    c.body.appendChild(sum);
  });
})();
