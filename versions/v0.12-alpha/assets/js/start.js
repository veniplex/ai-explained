/* Agentic AI, Explained (v12): the start page. Draws the two pictures of the two ways in (the kitchen story, the deep dive) with the pen of
   sketch.js, and switches the colour theme. The cards themselves are plain links in index.html, so they work without this script. */
(function () {
  "use strict";

  var sk = window.V3 && window.V3.sk;
  if (!sk) return;

  [["pic-story", "chef", 31], ["pic-dive", "cards", 47]].forEach(function (p) {
    var svg = sk.$("#" + p[0] + " svg");
    if (svg) sk.sketchInto(svg, sk.PICS[p[1]](), p[2], { base: { r: 0.9 } });
  });

  var root = document.documentElement;
  sk.$("#theme-toggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    sk.store("ae-theme", next);
  });
  // Without a saved choice, follow the system setting when it changes.
  var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
    var saved = sk.store("ae-theme");
    if (saved !== "light" && saved !== "dark") root.setAttribute("data-theme", e.matches ? "dark" : "light");
  });
})();
