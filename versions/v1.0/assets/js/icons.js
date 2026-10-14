/* AI explained (v14): the glossary icons. One small hand-drawn picture (48 × 48) for each of the 60 names that glossary terms carry (data/glossary.js:
   `icon`; the 21 main terms are in AE3.glossaryIcons). They are plain symbols, the same in every way of reading, drawn with the pen of sketch.js in the
   colour of the group a term belongs to (the nearest [data-zone] gives --zm). Exposes V3.icons (name -> list of shapes) and V3.sk.glyph(name, class,
   seed, delay), which returns an <svg>. Plain ES5. Needs sketch.js. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3 && V3.sk;
  if (!sk) return;
  var rr = sk.rrect, head = sk.head;

  // The teeth of a gear: 8 teeth round a body.
  function gearPoints() {
    var pts = [], n = 8, i, a, r;
    for (i = 0; i < n * 4; i++) {
      a = (i / (n * 4)) * Math.PI * 2 - Math.PI / (n * 4) * 1.5;
      r = (i % 4 === 1 || i % 4 === 2) ? 21 : 15;
      pts.push([24 + r * Math.cos(a), 24 + r * Math.sin(a)]);
    }
    return pts;
  }
  function netNodes() {
    var out = [], L = [[9, 14], [9, 34]], M = [[24, 8], [24, 24], [24, 40]], R = [[39, 24]];
    L.forEach(function (p) { M.forEach(function (q) { out.push({ t: "line", a: [p[0], p[1], q[0], q[1]], sw: 1 }); }); });
    M.forEach(function (q) { out.push({ t: "line", a: [q[0], q[1], 39, 24], sw: 1 }); });
    L.concat(M, R).forEach(function (p, i) { out.push({ t: "circle", a: [p[0], p[1], 8], fill: i < 2 ? "paper" : "zm", sw: 1.3 }); });
    return out;
  }
  function person(x, y, fill) {
    return [{ t: "circle", a: [x, y - 6, 9], fill: "paper", sw: 1.3 }, { t: "path", a: "M" + (x - 9) + " " + (y + 12) + "C" + (x - 9) + " " + (y - 2) + " " + (x + 9) + " " + (y - 2) + " " + (x + 9) + " " + (y + 12) + "Z", fill: fill || "zm", sw: 1.3 }];
  }

  var I = {
    net: netNodes,
    book: function () {
      return [
        { t: "path", a: "M24 13C19 10 12 9 6 11V38C12 36 19 37 24 40Z", fill: "paper" },
        { t: "path", a: "M24 13C29 10 36 9 42 11V38C36 36 29 37 24 40Z", fill: "zm" },
        { t: "line", a: [10, 18, 20, 19], sw: 1.1 }, { t: "line", a: [10, 24, 20, 25], sw: 1.1 }, { t: "line", a: [10, 30, 18, 31], sw: 1.1 }
      ];
    },
    books: function () {
      return [
        { t: "rect", a: [6, 14, 9, 28], fill: "paper" }, { t: "rect", a: [16, 8, 10, 34], fill: "zm" },
        { t: "poly", a: [[28, 14], [36, 12], [41, 40], [33, 42]], fill: "paper" },
        { t: "line", a: [6, 42, 42, 42], sw: 2 }, { t: "line", a: [19, 16, 23, 16], sw: 1.1 }, { t: "line", a: [19, 20, 23, 20], sw: 1.1 }
      ];
    },
    lock: function () {
      return [
        { t: "path", a: "M16 22V16C16 11 19.5 8 24 8C28.5 8 32 11 32 16V22", sw: 2 },
        { t: "rect", a: [11, 21, 26, 20], fill: "zm" },
        { t: "circle", a: [24, 29, 5], fill: "ink", r: 0.3 }, { t: "line", a: [24, 31, 24, 36], sw: 2 }
      ];
    },
    key: function () {
      return [
        { t: "circle", a: [15, 17, 18], fill: "zm" }, { t: "circle", a: [12, 14, 5], fill: "page", sw: 1.1 },
        { t: "line", a: [22, 24, 41, 43], sw: 3 }, { t: "line", a: [33, 35, 38, 30], sw: 2.2 }, { t: "line", a: [38, 40, 42, 36], sw: 2.2 }
      ];
    },
    shield: function () {
      return [
        { t: "path", a: "M24 5L38 10V23C38 32 32 39 24 43C16 39 10 32 10 23V10Z", fill: "zm" },
        { t: "path", a: "M17 24l5 5 9-11", sw: 2.4 }
      ];
    },
    search: function () {
      return [
        { t: "line", a: [28, 28, 41, 41], sw: 4 },
        { t: "circle", a: [20, 20, 25], fill: "paper" }, { t: "path", a: "M12 17C13 13 16 11 19 11", sw: 1.3 }
      ];
    },
    link: function () {
      return [
        { t: "path", a: rr(4, 17, 24, 14, 7), fill: "zm" },
        { t: "path", a: rr(20, 17, 24, 14, 7), fill: "paper" },
        { t: "line", a: [17, 24, 31, 24], sw: 2.4 }
      ];
    },
    plug: function () {
      return [
        { t: "line", a: [19, 5, 19, 14], sw: 2.4 }, { t: "line", a: [29, 5, 29, 14], sw: 2.4 },
        { t: "rect", a: [13, 14, 22, 14], fill: "zm" },
        { t: "path", a: "M24 28V34C24 40 29 42 36 42H44", sw: 2 }
      ];
    },
    wrench: function () {
      return [
        { t: "line", a: [20, 20, 39, 39], sw: 6 },
        { t: "circle", a: [16, 16, 18], fill: "zm" }, { t: "poly", a: [[8, 7], [17, 15], [7, 17]], fill: "page", sw: 1.1 }
      ];
    },
    gear: function () {
      return [{ t: "poly", a: gearPoints(), fill: "zm" }, { t: "circle", a: [24, 24, 11], fill: "page", sw: 1.3 }];
    },
    loop: function () {
      return [
        { t: "path", a: "M13 29C9 21 13 11 23 9C28 8 33 10 36 14", sw: 2.2 }, { t: "lin", a: head(30, 9, 37, 14, 7), sw: 2.2 },
        { t: "path", a: "M35 19C39 27 35 37 25 39C20 40 15 38 12 34", sw: 2.2 }, { t: "lin", a: head(18, 39, 11, 34, 7), sw: 2.2 },
        { t: "circle", a: [24, 24, 8], fill: "zm", sw: 1.3 }
      ];
    },
    clock: function () {
      return [
        { t: "circle", a: [24, 24, 38], fill: "paper" },
        { t: "line", a: [24, 24, 24, 12], sw: 2.2 }, { t: "line", a: [24, 24, 33, 29], sw: 2.2 }, { t: "circle", a: [24, 24, 5], fill: "zm", sw: 1.2 },
        { t: "line", a: [24, 8, 24, 10], sw: 1.5 }, { t: "line", a: [40, 24, 38, 24], sw: 1.5 }, { t: "line", a: [24, 40, 24, 38], sw: 1.5 }, { t: "line", a: [8, 24, 10, 24], sw: 1.5 }
      ];
    },
    calendar: function () {
      var out = [
        { t: "rect", a: [7, 10, 34, 32], fill: "paper" }, { t: "rect", a: [7, 10, 34, 9], fill: "zm" },
        { t: "line", a: [15, 5, 15, 13], sw: 2.2 }, { t: "line", a: [33, 5, 33, 13], sw: 2.2 }
      ];
      [[14, 26], [24, 26], [34, 26], [14, 34], [24, 34]].forEach(function (p) { out.push({ t: "circle", a: [p[0], p[1], 4], fill: "ink", r: 0.3 }); });
      return out;
    },
    scales: function () {
      return [
        { t: "line", a: [24, 8, 24, 40], sw: 2 }, { t: "line", a: [14, 41, 34, 41], sw: 2.4 }, { t: "line", a: [9, 14, 39, 12], sw: 2 },
        { t: "line", a: [9, 14, 5, 28], sw: 1.2 }, { t: "line", a: [9, 14, 14, 28], sw: 1.2 }, { t: "path", a: "M4 28Q9.5 36 15 28Z", fill: "zm" },
        { t: "line", a: [39, 12, 34, 24], sw: 1.2 }, { t: "line", a: [39, 12, 43, 24], sw: 1.2 }, { t: "path", a: "M33 24Q38.5 32 44 24Z", fill: "paper" }
      ];
    },
    flask: function () {
      return [
        { t: "path", a: "M19 6H29V18L40 37C41 41 39 43 36 43H12C9 43 7 41 8 37L19 18Z", fill: "paper" },
        { t: "path", a: "M13 31H35L39 38C40 41 38 42 36 42H12C10 42 8 41 9 38Z", fill: "zm", noline: true },
        { t: "line", a: [16, 6, 32, 6], sw: 2 }, { t: "circle", a: [22, 35, 3], fill: "paper", sw: 1 }, { t: "circle", a: [28, 33, 2.5], fill: "paper", sw: 1 }
      ];
    },
    bars: function () {
      return [
        { t: "path", a: "M8 5V41H43", sw: 1.6 },
        { t: "rect", a: [13, 26, 7, 15], fill: "zm" }, { t: "rect", a: [24, 18, 7, 23], fill: "zm" }, { t: "rect", a: [35, 9, 7, 32], fill: "zm" }
      ];
    },
    gauge: function () {
      return [
        { t: "path", a: "M6 34C6 18 14 10 24 10C34 10 42 18 42 34Z", fill: "paper" },
        { t: "path", a: "M10 34C10 22 16 15 24 15", sw: 1.2, noline: false }, { t: "line", a: [24, 34, 33, 19], sw: 2.4 },
        { t: "circle", a: [24, 34, 7], fill: "zm", sw: 1.3 }, { t: "line", a: [6, 38, 42, 38], sw: 2 }
      ];
    },
    coin: function () {
      return [
        { t: "circle", a: [24, 24, 38], fill: "zm" }, { t: "circle", a: [24, 24, 26], fill: "paper", sw: 1.1 },
        { t: "path", a: "M28 19C26 16 20 16 20 20C20 24 28 23 28 28C28 32 22 32 19 29", sw: 1.8 }, { t: "line", a: [24, 13, 24, 35], sw: 1.4 }
      ];
    },
    team: function () {
      return person(11, 33, "zm").concat(person(37, 33, "zm"), person(24, 25, "paper"));
    },
    tree: function () {
      return [
        { t: "path", a: "M24 13V24", sw: 1.4 }, { t: "path", a: "M10 34V24H38V34", sw: 1.4 },
        { t: "rect", a: [17, 5, 14, 9], fill: "zm" },
        { t: "rect", a: [3, 34, 14, 9], fill: "paper" }, { t: "rect", a: [17, 34, 14, 9], fill: "paper" }, { t: "rect", a: [31, 34, 14, 9], fill: "paper" },
        { t: "line", a: [24, 24, 24, 34], sw: 1.4 }
      ];
    },
    fork: function () {
      return [
        { t: "line", a: [24, 43, 24, 25], sw: 2.2 }, { t: "path", a: "M24 25C24 18 13 17 11 10", sw: 2.2 }, { t: "path", a: "M24 25C24 18 35 17 37 10", sw: 2.2 },
        { t: "lin", a: head(13, 17, 11, 8, 7), sw: 2.2 }, { t: "lin", a: head(35, 17, 37, 8, 7), sw: 2.2 }, { t: "circle", a: [24, 40, 8], fill: "zm", sw: 1.3 }
      ];
    },
    merge: function () {
      return [
        { t: "path", a: "M11 6C13 14 24 16 24 26", sw: 2.2 }, { t: "path", a: "M37 6C35 14 24 16 24 26", sw: 2.2 }, { t: "line", a: [24, 26, 24, 42], sw: 2.2 },
        { t: "lin", a: head(24, 34, 24, 43, 7), sw: 2.2 }, { t: "circle", a: [11, 8, 8], fill: "paper", sw: 1.3 }, { t: "circle", a: [37, 8, 8], fill: "zm", sw: 1.3 }
      ];
    },
    pencil: function () {
      return [
        { t: "poly", a: [[8, 40], [10, 30], [32, 8], [40, 16], [18, 38]], fill: "zm" },
        { t: "line", a: [28, 12, 36, 20], sw: 1.3 }, { t: "poly", a: [[8, 40], [10, 30], [18, 38]], fill: "paper", sw: 1.2 }
      ];
    },
    note: function () {
      return [
        { t: "poly", a: [[8, 8], [40, 8], [40, 30], [30, 40], [8, 40]], fill: "zm" }, { t: "lin", a: [[30, 40], [30, 30], [40, 30]], sw: 1.3 },
        { t: "line", a: [14, 16, 34, 16], sw: 1.3 }, { t: "line", a: [14, 22, 32, 22], sw: 1.3 }, { t: "line", a: [14, 28, 24, 28], sw: 1.3 }
      ];
    },
    doc: function () {
      return [
        { t: "path", a: "M12 5H29L38 14V43H12Z", fill: "paper" }, { t: "path", a: "M29 5V14H38", sw: 1.3 },
        { t: "rect", a: [16, 19, 10, 5], fill: "zm", sw: 1.1 }, { t: "line", a: [16, 29, 34, 29], sw: 1.2 }, { t: "line", a: [16, 34, 31, 34], sw: 1.2 }
      ];
    },
    folder: function () {
      return [
        { t: "path", a: "M5 12H19L23 17H43V38C43 40 42 41 40 41H8C6 41 5 40 5 38Z", fill: "paper" },
        { t: "path", a: "M5 22H43V38C43 40 42 41 40 41H8C6 41 5 40 5 38Z", fill: "zm" }
      ];
    },
    db: function () {
      return [
        { t: "path", a: "M9 12V35C9 39 16 42 24 42S39 39 39 35V12", fill: "zm" },
        { t: "path", a: "M9 23C9 27 16 30 24 30S39 27 39 23", sw: 1.3 },
        { t: "ellipse", a: [24, 12, 30, 11], fill: "paper" }
      ];
    },
    cloud: function () {
      return [
        { t: "circle", a: [15, 28, 16], fill: "paper" }, { t: "circle", a: [27, 21, 20], fill: "paper" }, { t: "circle", a: [35, 29, 14], fill: "paper" },
        { t: "rect", a: [12, 28, 24, 9], fill: "zm" }, { t: "line", a: [12, 37, 36, 37], sw: 1.8 }
      ];
    },
    chip: function () {
      var out = [], i, p;
      for (i = 0; i < 4; i++) {
        p = 15 + i * 6;
        out.push({ t: "line", a: [p, 7, p, 12], sw: 1.6 }, { t: "line", a: [p, 36, p, 41], sw: 1.6 }, { t: "line", a: [7, p, 12, p], sw: 1.6 }, { t: "line", a: [36, p, 41, p], sw: 1.6 });
      }
      out.push({ t: "rect", a: [12, 12, 24, 24], fill: "zm" }, { t: "rect", a: [19, 19, 10, 10], fill: "paper", sw: 1.2 });
      return out;
    },
    stack: function () {
      return [
        { t: "poly", a: [[24, 22], [42, 30], [24, 38], [6, 30]], fill: "paper" },
        { t: "poly", a: [[24, 15], [42, 23], [24, 31], [6, 23]], fill: "zm" },
        { t: "poly", a: [[24, 8], [42, 16], [24, 24], [6, 16]], fill: "paper" }
      ];
    },
    funnel: function () {
      return [
        { t: "poly", a: [[5, 8], [43, 8], [28, 26], [28, 41], [20, 37], [20, 26]], fill: "zm" },
        { t: "line", a: [10, 13, 38, 13], sw: 1.2 }, { t: "circle", a: [14, 3, 3], fill: "ink", r: 0.2 }
      ];
    },
    target: function () {
      return [
        { t: "circle", a: [22, 26, 36], fill: "paper" }, { t: "circle", a: [22, 26, 23], fill: "zm" }, { t: "circle", a: [22, 26, 9], fill: "ink", r: 0.3 },
        { t: "line", a: [22, 26, 41, 7], sw: 2 }, { t: "lin", a: [[35, 6], [42, 6], [42, 13]], sw: 1.8 }
      ];
    },
    flag: function () {
      return [
        { t: "line", a: [11, 5, 11, 43], sw: 2.4 }, { t: "poly", a: [[11, 8], [39, 8], [32, 16], [39, 24], [11, 24]], fill: "zm" }, { t: "line", a: [6, 43, 18, 43], sw: 2 }
      ];
    },
    bell: function () {
      return [
        { t: "path", a: "M10 34C13 30 14 26 14 20C14 13 18 9 24 9C30 9 34 13 34 20C34 26 35 30 38 34Z", fill: "zm" },
        { t: "line", a: [8, 34, 40, 34], sw: 2 }, { t: "circle", a: [24, 39, 7], fill: "paper", sw: 1.3 }, { t: "line", a: [24, 5, 24, 9], sw: 2 }
      ];
    },
    eye: function () {
      return [
        { t: "path", a: "M4 24C10 13 18 9 24 9C30 9 38 13 44 24C38 35 30 39 24 39C18 39 10 35 4 24Z", fill: "paper" },
        { t: "circle", a: [24, 24, 15], fill: "zm" }, { t: "circle", a: [24, 24, 7], fill: "ink", r: 0.3 }, { t: "circle", a: [27, 21, 3], fill: "page", sw: 0.8, r: 0.2 }
      ];
    },
    mask: function () {
      return [
        { t: "path", a: "M6 11C6 9 8 8 10 8H38C40 8 42 9 42 11V24C42 34 34 42 24 42C14 42 6 34 6 24Z", fill: "zm" },
        { t: "ellipse", a: [16, 21, 10, 7], fill: "page" }, { t: "ellipse", a: [32, 21, 10, 7], fill: "page" },
        { t: "path", a: "M16 32C20 36 28 36 32 32", sw: 1.8 }
      ];
    },
    bug: function () {
      return [
        { t: "line", a: [14, 22, 5, 17], sw: 1.6 }, { t: "line", a: [14, 29, 4, 29], sw: 1.6 }, { t: "line", a: [14, 36, 6, 41], sw: 1.6 },
        { t: "line", a: [34, 22, 43, 17], sw: 1.6 }, { t: "line", a: [34, 29, 44, 29], sw: 1.6 }, { t: "line", a: [34, 36, 42, 41], sw: 1.6 },
        { t: "line", a: [20, 9, 16, 4], sw: 1.4 }, { t: "line", a: [28, 9, 32, 4], sw: 1.4 },
        { t: "ellipse", a: [24, 28, 20, 26], fill: "zm" }, { t: "circle", a: [24, 13, 11], fill: "paper" }, { t: "line", a: [24, 18, 24, 41], sw: 1.2 }
      ];
    },
    warning: function () {
      return [
        { t: "poly", a: [[24, 6], [43, 40], [5, 40]], fill: "zm" }, { t: "line", a: [24, 18, 24, 29], sw: 2.6 }, { t: "circle", a: [24, 34, 3.5], fill: "ink", r: 0.2 }
      ];
    },
    bubble: function () {
      return [
        { t: "path", a: rr(5, 7, 38, 26, 8) + "M14 33L12 43L24 33", fill: "zm" },
        { t: "line", a: [12, 16, 36, 16], sw: 1.3 }, { t: "line", a: [12, 22, 30, 22], sw: 1.3 }
      ];
    },
    cursor: function () {
      return [
        { t: "poly", a: [[11, 5], [11, 36], [19, 29], [25, 42], [31, 39], [25, 27], [36, 27]], fill: "zm" }
      ];
    },
    terminal: function () {
      return [
        { t: "rect", a: [5, 9, 38, 30], fill: "paper" }, { t: "line", a: [5, 17, 43, 17], sw: 1.3 },
        { t: "path", a: "M11 23l5 4-5 4", sw: 2 }, { t: "line", a: [20, 32, 31, 32], sw: 2 }
      ];
    },
    window: function () {
      return [
        { t: "rect", a: [6, 7, 36, 34], fill: "paper" }, { t: "line", a: [6, 14, 42, 14], sw: 1.3 },
        { t: "line", a: [11, 20, 37, 20], sw: 1.3 }, { t: "line", a: [11, 25, 31, 25], sw: 1.3 }, { t: "line", a: [11, 30, 34, 30], sw: 1.3 },
        { t: "rect", a: [11, 34, 26, 3], fill: "zm", sw: 1.1 }
      ];
    },
    puzzle: function () {
      return [{ t: "path", a: "M8 14H18C15 6 27 6 24 14H34V22C42 19 42 33 34 30V40H8Z", fill: "zm" }];
    },
    spark: function () {
      return [
        { t: "poly", a: [[22, 5], [27, 19], [41, 24], [27, 29], [22, 43], [17, 29], [3, 24], [17, 19]], fill: "zm" },
        { t: "poly", a: [[38, 5], [40, 10], [45, 12], [40, 14], [38, 19], [36, 14], [31, 12], [36, 10]], fill: "paper", sw: 1.1 }
      ];
    },
    thermo: function () {
      return [
        { t: "path", a: "M19 28V9C19 4 29 4 29 9V28C32 30 34 33 34 37C34 42 30 44 24 44C18 44 14 42 14 37C14 33 16 30 19 28Z", fill: "paper" },
        { t: "circle", a: [24, 37, 11], fill: "zm" }, { t: "line", a: [24, 36, 24, 14], sw: 2.4 },
        { t: "line", a: [32, 12, 38, 12], sw: 1.3 }, { t: "line", a: [32, 18, 36, 18], sw: 1.3 }, { t: "line", a: [32, 24, 38, 24], sw: 1.3 }
      ];
    },
    dice: function () {
      var out = [{ t: "path", a: rr(7, 7, 34, 34, 7), fill: "paper" }];
      [[16, 16], [32, 16], [24, 24], [16, 32], [32, 32]].forEach(function (p) { out.push({ t: "circle", a: [p[0], p[1], 5], fill: "ink", r: 0.3 }); });
      return out;
    },
    squeeze: function () {
      return [
        { t: "line", a: [3, 24, 17, 24], sw: 2.2 }, { t: "lin", a: head(10, 24, 18, 24, 7), sw: 2.2 },
        { t: "line", a: [45, 24, 31, 24], sw: 2.2 }, { t: "lin", a: head(38, 24, 30, 24, 7), sw: 2.2 },
        { t: "rect", a: [18, 12, 12, 24], fill: "zm" }, { t: "line", a: [24, 6, 24, 10], sw: 1.4 }, { t: "line", a: [24, 38, 24, 42], sw: 1.4 }
      ];
    },
    hourglass: function () {
      return [
        { t: "poly", a: [[11, 7], [37, 7], [24, 24]], fill: "paper" }, { t: "poly", a: [[24, 24], [37, 41], [11, 41]], fill: "zm" },
        { t: "line", a: [8, 6, 40, 6], sw: 2.4 }, { t: "line", a: [8, 42, 40, 42], sw: 2.4 }, { t: "poly", a: [[18, 12], [30, 12], [24, 19]], fill: "zm", sw: 1 }
      ];
    },
    camera: function () {
      return [
        { t: "rect", a: [16, 8, 14, 7], fill: "zm" }, { t: "path", a: rr(4, 14, 40, 27, 6), fill: "paper" },
        { t: "circle", a: [24, 27, 16], fill: "zm" }, { t: "circle", a: [24, 27, 7], fill: "page", sw: 1.2 }, { t: "circle", a: [37, 20, 3], fill: "ink", r: 0.2 }
      ];
    },
    mic: function () {
      return [
        { t: "path", a: rr(17, 4, 14, 24, 7), fill: "zm" }, { t: "path", a: "M11 22C11 33 37 33 37 22", sw: 2 },
        { t: "line", a: [24, 32, 24, 41], sw: 2 }, { t: "line", a: [16, 42, 32, 42], sw: 2.2 }, { t: "line", a: [20, 12, 28, 12], sw: 1.1 }, { t: "line", a: [20, 17, 28, 17], sw: 1.1 }
      ];
    },
    ruler: function () {
      var out = [{ t: "rect", a: [3, 15, 42, 18], fill: "zm" }], i;
      for (i = 0; i < 8; i++) out.push({ t: "line", a: [8 + i * 5, 15, 8 + i * 5, i % 2 ? 22 : 26], sw: 1.3 });
      return out;
    },
    checklist: function () {
      return [
        { t: "rect", a: [9, 7, 30, 36], fill: "paper" }, { t: "rect", a: [17, 4, 14, 7], fill: "zm" },
        { t: "path", a: "M14 19l3 3 5-6", sw: 1.8 }, { t: "path", a: "M14 29l3 3 5-6", sw: 1.8 },
        { t: "line", a: [26, 20, 34, 20], sw: 1.3 }, { t: "line", a: [26, 31, 34, 31], sw: 1.3 }, { t: "line", a: [14, 38, 22, 38], sw: 1.3 }
      ];
    },
    gavel: function () {
      return [
        { t: "poly", a: [[10, 15], [24, 6], [31, 17], [17, 26]], fill: "zm" }, { t: "line", a: [24, 21, 39, 39], sw: 4 },
        { t: "line", a: [24, 42, 44, 42], sw: 2.4 }
      ];
    },
    globe: function () {
      return [
        { t: "circle", a: [24, 24, 38], fill: "zm" }, { t: "ellipse", a: [24, 24, 16, 38], sw: 1.2 },
        { t: "line", a: [5, 24, 43, 24], sw: 1.2 }, { t: "path", a: "M9 14C17 17 31 17 39 14", sw: 1.1 }, { t: "path", a: "M9 34C17 31 31 31 39 34", sw: 1.1 }
      ];
    },
    rocket: function () {
      return [
        { t: "poly", a: [[18, 29], [10, 39], [19, 36]], fill: "paper" }, { t: "poly", a: [[30, 29], [38, 39], [29, 36]], fill: "paper" },
        { t: "poly", a: [[20, 37], [24, 45], [28, 37]], fill: "clay", sw: 1.1 },
        { t: "path", a: "M24 3C32 9 34 21 30 36H18C14 21 16 9 24 3Z", fill: "paper" }, { t: "circle", a: [24, 19, 9], fill: "zm", sw: 1.3 }
      ];
    },
    hand: function () {
      return [
        { t: "rect", a: [11, 11, 6, 20], fill: "paper" }, { t: "rect", a: [18, 6, 6, 24], fill: "paper" }, { t: "rect", a: [25, 7, 6, 23], fill: "paper" }, { t: "rect", a: [32, 12, 6, 19], fill: "paper" },
        { t: "path", a: "M10 28H39V34C39 40 35 43 29 43H20C14 43 10 40 10 34Z", fill: "zm" }, { t: "poly", a: [[11, 31], [5, 23], [9, 21], [14, 27]], fill: "paper" }
      ];
    },
    box: function () {
      return [
        { t: "poly", a: [[6, 14], [24, 22], [24, 42], [6, 34]], fill: "zm" }, { t: "poly", a: [[42, 14], [24, 22], [24, 42], [42, 34]], fill: "paper" },
        { t: "poly", a: [[24, 6], [42, 14], [24, 22], [6, 14]], fill: "paper" }, { t: "line", a: [15, 10, 33, 18], sw: 1.1 }
      ];
    },
    ladder: function () {
      var out = [{ t: "line", a: [13, 4, 13, 44], sw: 2.2 }, { t: "line", a: [35, 4, 35, 44], sw: 2.2 }], i;
      for (i = 0; i < 5; i++) out.push({ t: "line", a: [13, 9 + i * 8.5, 35, 9 + i * 8.5], sw: 1.8 });
      out.push({ t: "circle", a: [24, 17.5, 8], fill: "zm", sw: 1.2 });
      return out;
    },
    graph: function () {
      var P = [[10, 12], [36, 9], [24, 25], [9, 37], [38, 38]];
      var out = [[0, 2], [1, 2], [2, 3], [2, 4], [0, 3], [1, 4]].map(function (e) { return { t: "line", a: [P[e[0]][0], P[e[0]][1], P[e[1]][0], P[e[1]][1]], sw: 1.2 }; });
      P.forEach(function (p, i) { out.push({ t: "circle", a: [p[0], p[1], i === 2 ? 11 : 8], fill: i === 2 ? "zm" : "paper", sw: 1.3 }); });
      return out;
    },
    tag: function () {
      return [
        { t: "poly", a: [[5, 25], [24, 6], [42, 6], [42, 24], [23, 43]], fill: "zm" }, { t: "circle", a: [34, 14, 6], fill: "page", sw: 1.2 },
        { t: "line", a: [18, 28, 28, 18], sw: 1.2 }
      ];
    }
  };

  // The drawing of an icon, as an <svg> of 48 × 48. The pen runs when `delay` is a number (the page asks for it unless motion is reduced).
  function glyph(name, cls, seed, delay) {
    var svg = sk.s("svg", { class: cls || "glyph", viewBox: "0 0 48 48", "aria-hidden": "true", focusable: "false" });
    var make = I[name] || I.spark, k, h = 0;
    for (k = 0; k < name.length; k++) h += name.charCodeAt(k);
    sk.sketchInto(svg, make(), (seed || 3) + h, { base: { r: 0.7, bow: 0.8 }, anim: delay != null, delay: delay || 0, stagger: 0.05 });
    return svg;
  }

  V3.icons = I;
  sk.glyph = glyph;
})();
