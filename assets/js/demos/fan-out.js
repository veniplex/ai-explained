/* Demo "One worker or several": six equal jobs split across 1 to 6 workers. A scripted toy model: parallel work finishes sooner, and the setup and the merge cost tokens. */
(function () {
  "use strict";
  V3.demos.define("fan-out", function (c) {
    var h = c.h, num = c.num;
    var JOBS = 6, JOB_S = 40, JOB_TOK = 30000, SETUP_TOK = 2000, MERGE_S = 10, MERGE_TOK = 6000;
    var workers = 3;
    function model(w) {
      var rounds = Math.ceil(JOBS / w), merge = w > 1;
      return { rounds: rounds, merge: merge, time: rounds * JOB_S + (merge ? MERGE_S : 0), tokens: JOBS * JOB_TOK + (merge ? w * SETUP_TOK + MERGE_TOK : 0) };
    }
    var gantt = h("div", { class: "dm-fo-gantt", role: "img" }), stats = h("ul", { class: "dm-stats", "aria-live": "polite" }), line = h("p", { class: "dm-fo-line" });
    function draw() {
      var m = model(workers), one = model(1), total = one.time;
      c.sk.clear(gantt); c.sk.clear(stats);
      for (var w = 0; w < workers; w++) {
        var track = h("div", { class: "dm-fo-track" }, h("span", { class: "dm-fo-who" }, workers === 1 ? "Worker" : "Worker " + (w + 1)));
        var lane = h("div", { class: "dm-fo-lane" });
        var r = 0;
        for (var j = w; j < JOBS; j += workers, r++) lane.appendChild(h("span", { class: "dm-fo-job", style: "left:" + (r * JOB_S / total * 100).toFixed(2) + "%;width:" + (JOB_S / total * 100).toFixed(2) + "%" }, "Job " + (j + 1)));
        track.appendChild(lane);
        gantt.appendChild(track);
      }
      if (m.merge) {
        var lane2 = h("div", { class: "dm-fo-lane" }, h("span", { class: "dm-fo-merge", style: "left:" + (m.rounds * JOB_S / total * 100).toFixed(2) + "%;width:" + (MERGE_S / total * 100).toFixed(2) + "%", title: "Merge: " + MERGE_S + " s" }));
        gantt.appendChild(h("div", { class: "dm-fo-track" }, h("span", { class: "dm-fo-who" }, "Orchestrator"), lane2));
      }
      gantt.setAttribute("aria-label", workers + (workers === 1 ? " worker" : " workers") + " finish six jobs in " + m.time + " seconds");
      [[m.time + " s", "until everything is done"], [num(m.tokens), "tokens used in all"]].forEach(function (x) { stats.appendChild(h("li", null, h("b", null, x[0]), h("span", null, x[1]))); });
      if (workers > 1) {
        stats.appendChild(h("li", null, h("b", null, (one.time / m.time).toFixed(1) + "× faster"), h("span", null, "than one worker (" + one.time + " s)")));
        stats.appendChild(h("li", null, h("b", null, "+" + Math.round((m.tokens / one.tokens - 1) * 100) + "% tokens"), h("span", null, "for the setup of each worker and the merge")));
      }
      line.textContent = workers === 1 ? "One worker does the six jobs one after another. There is nothing to set up and nothing to merge." : "The six jobs are split over " + workers + " workers. Each one loads its own instructions (" + num(SETUP_TOK) + " tokens), and an orchestrator merges the results at the end (" + MERGE_S + " s, " + num(MERGE_TOK) + " tokens).";
    }
    c.body.appendChild(c.slider("Workers", { min: 1, max: 6, step: 1, value: workers }, function (v) { return v === 1 ? "1 worker" : v + " workers"; }, function (v) { workers = v; draw(); }));
    c.body.appendChild(line);
    c.body.appendChild(gantt);
    c.body.appendChild(h("p", { class: "dm-fo-legend" }, h("span", { class: "dm-fo-key dm-fo-job-key" }), " A job, " + JOB_S + " s   ", h("span", { class: "dm-fo-key dm-fo-merge-key" }), " The merge, " + MERGE_S + " s. The time runs from left to right."));
    c.body.appendChild(stats);
    draw();
  });
})();
