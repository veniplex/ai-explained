/* Agentic AI, Explained (v13): the start page. Draws the pictures of the three ways in (the kitchen story, the kitchen deep dive, the technical deep dive)
   with the pen of sketch.js, and switches the colour theme. The cards themselves are plain links in index.html, so they work without this script. */
(function () {
  "use strict";

  var sk = window.V3 && window.V3.sk;
  if (!sk) return;

  [["pic-story", "chef", 31], ["pic-kitchen", "cards", 47]].forEach(function (p) {
    var svg = sk.$("#" + p[0] + " svg");
    if (svg) sk.sketchInto(svg, sk.PICS[p[1]](), p[2], { base: { r: 0.9 } });
  });

  // The technical card has no kitchen picture: the four parts of an agent as plain icons (model, context, tools, loop), drawn the way the
  // technical deep dive draws them. The icons follow <html data-mode>, so it is set to the technical one while they are drawn.
  var tech = sk.$("#pic-tech");
  if (tech) {
    var root = document.documentElement, before = root.getAttribute("data-mode");
    root.setAttribute("data-mode", "technical");
    [["model", "chef"], ["harness", "counter"], ["tools", "tools"], ["harness", "loop"]].forEach(function (p, i) {
      if (i) tech.appendChild(sk.h("span", { class: "pic-op", "aria-hidden": "true" }, "+"));
      tech.appendChild(sk.doodleSvg(p[0], "pic-icon", 21 + i, undefined, p[1]));
    });
    if (before === null) root.removeAttribute("data-mode"); else root.setAttribute("data-mode", before);
  }

  var root2 = document.documentElement;
  sk.$("#theme-toggle").addEventListener("click", function () {
    var next = root2.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root2.setAttribute("data-theme", next);
    sk.store("ae-theme", next);
  });
  // Without a saved choice, follow the system setting when it changes.
  var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
    var saved = sk.store("ae-theme");
    if (saved !== "light" && saved !== "dark") root2.setAttribute("data-theme", e.matches ? "dark" : "light");
  });
})();
