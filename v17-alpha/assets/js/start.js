/* AI explained (v17): the start page. Draws the pictures of the two ways in (the kitchen story, the technical deep dive)
   with the pen of sketch.js, and switches the colour theme. The cards themselves are plain links in index.html, so they work without this script. */
(function () {
  "use strict";

  var sk = window.V3 && window.V3.sk;
  if (!sk) return;

  // The kitchen story's card: the chef thinking, with two options and a tick.
  var head = sk.head;
  var story = sk.$("#pic-story svg");
  if (story) sk.sketchInto(story, [
    { t: "circle", a: [78, 106, 58], fill: "paper" },
    { t: "circle", a: [62, 62, 32], fill: "paper" }, { t: "circle", a: [94, 62, 32], fill: "paper" }, { t: "circle", a: [78, 50, 38], fill: "paper" },
    { t: "rect", a: [58, 64, 40, 16], fill: "paper" },
    { t: "circle", a: [70, 104, 5], fill: "ink", r: 0.3 }, { t: "circle", a: [86, 104, 5], fill: "ink", r: 0.3 },
    { t: "path", a: "M70 118Q78 124 86 118", sw: 1.6 },
    { t: "circle", a: [114, 86, 7], fill: "paper" }, { t: "circle", a: [126, 73, 11], fill: "paper" },
    { t: "ellipse", a: [180, 50, 100, 66], fill: "zm" },
    { t: "line", a: [150, 42, 188, 42], sw: 2 }, { t: "lin", a: head(176, 42, 190, 42, 7), sw: 2 },
    { t: "line", a: [150, 58, 176, 58], sw: 2 },
    { t: "path", a: "M184 58l6 6 10-13", sw: 2.4 }
  ], 31, { base: { r: 0.9 } });

  // The deep dive's card has no kitchen picture: the four parts of an agent as plain icons (model, context, tools, loop).
  var tech = sk.$("#pic-tech");
  if (tech) {
    [["model", "chef"], ["harness", "counter"], ["tools", "tools"], ["harness", "loop"]].forEach(function (p, i) {
      if (i) tech.appendChild(sk.h("span", { class: "pic-op", "aria-hidden": "true" }, "+"));
      tech.appendChild(sk.doodleSvg(p[0], "pic-icon", 21 + i, undefined, p[1]));
    });
  }
})();
