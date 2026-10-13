/* AI explained (v17): the kitchen, as a list of things. Every thing is placed once, in a room that is 1500 wide and 700 high
   (the wall ends at y = 520; furniture stands against it, people walk on the floor in front; the top 90 are ceiling and never shown).
   story.js says when each thing appears, hides again or walks somewhere else. A thing: id, layer, prop (a drawing of props.js),
   x, y (where its origin stands), o (the drawing's options: s scale, r rotation, flip, fx slide-in), and optionally amb (ambient
   motion) and poses (for people: "mood/arms"). Layers, back to front: wall, furn (furniture), top (things on furniture), floor,
   people, front. From left to right the room has: the window and you, the chef's corner, the counter, the tools, the locks. */
(function () {
  "use strict";
  var K = window.COMIC.kitchen = { w: 1500, h: 700, y0: 90, wall: 520, actors: [] };
  function A(id, layer, prop, x, y, o, extra) {
    var a = { id: id, layer: layer, prop: prop, x: x, y: y, o: o || {} };
    if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
    K.actors.push(a);
  }
  var TOP = 492;   // the top of the counters

  /* The world outside: a window with the market, which turns to night when the night shift comes. */
  A("window", "wall", "window", 128, 380, { w: 240, h: 150, f: "t-orch" });
  A("nightwindow", "wall", "c_nightwindow", 128, 380, { w: 240, h: 150 });
  [40, 98, 156, 214].forEach(function (x, i) { A("stall" + (i + 1), "top", "stall", x, 360, { s: 0.4 }); });

  /* You, and the chef (chapter 1) */
  A("owner", "people", "owner", 85, 652, { s: 1.02 });
  A("chef", "people", "chef", 375, 652, { s: 1 });
  A("books1", "floor", "books", 262, 624, { n: 9 });
  A("books2", "floor", "books", 304, 624, { n: 4 });
  A("books3", "floor", "books", 448, 624, { n: 5 });
  A("books4", "floor", "books", 494, 624, { n: 11 });
  A("menu", "wall", "note", 375, 410, { w: 300, h: 100, f: "paper", t: " " });
  A("menu-l", "wall", "label", 292, 346, { t: "Menu", size: 15, f: "ink3" });
  A("piece1", "wall", "note", 265, 392, { w: 56, h: 36, t: "Fresh", size: 16, fx: [-16, 0] });
  A("piece2", "wall", "note", 320, 392, { w: 46, h: 36, t: "tom", size: 16, fx: [-16, 0] });
  A("piece3", "wall", "note", 370, 392, { w: 46, h: 36, t: "ato", size: 16, fx: [-16, 0] });
  A("piece4", "wall", "note", 428, 392, { w: 62, h: 36, t: "soup", size: 16, fx: [-16, 0] });
  A("piece5", "wall", "note", 480, 392, { w: 34, h: 36, t: "?", size: 18, f: "paper" });
  A("plan", "wall", "sheet", 375, 430, { title: "Plan", lines: ["1 look", "2 ask", "3 check"], w: 112 });
  A("calendar", "wall", "calendar", 262, 442, { t: "THE END" });
  A("zz", "front", "zz", 412, 508, {});
  A("t-mon", "front", "ticket", 490, 520, { t: "Mon", r: 30, fx: [-80, 26] }, { amb: "amb-bob" });
  A("t-wed", "front", "ticket", 530, 470, { t: "Wed", r: -14, fx: [-70, 24] }, { amb: "amb-bob" });
  A("t-fri", "front", "ticket", 450, 440, { t: "Fri", r: 18, fx: [-60, 30] }, { amb: "amb-bob" });

  /* The counter (chapter 2) */
  A("counter", "furn", "counter", 710, 565, { w: 340, h: 62 });
  A("order", "top", "ticket", 548, 600, { t: "Sat" });
  A("rulenote", "top", "note", 760, TOP, { w: 92, h: 34, f: "bads", t: "no soft tomatoes", size: 9 });
  A("old1", "top", "ticket", 625, TOP, { t: "Fri", r: -8 });
  A("old2", "top", "ticket", 660, TOP, { t: "Wed", r: 7 });
  A("old3", "top", "ticket", 695, TOP, { t: "Mon", r: -5 });
  A("pile", "top", "pile", 700, TOP, { n: 7, s: 1.1 });
  A("pile2", "top", "pile", 715, TOP, { n: 16, s: 1.55 });
  A("ctxframe", "top", "b_frame", 540, 372, { w: 340, h: 128, k: "clay" });

  /* Tools (chapter 3) */
  A("counter2", "furn", "counter", 1045, 565, { w: 290, h: 62 });
  A("block", "top", "v_block", 930, TOP, {});
  A("phone", "top", "phone", 985, TOP, { s: 1 });
  A("orderbook", "top", "orderbook", 1052, TOP, { s: 0.85, lines: 3 });
  A("oven", "top", "oven", 1130, TOP, { fire: true });
  A("pot", "top", "pot", 1130, TOP - 60, { steam: true });
  A("sockets", "wall", "v_sockets", 1105, 372, { w: 130, n: 3, to: [[-118, 90], [-52, 78], [48, 62]] });

  /* The tasting circle (chapter 4) */
  A("loop", "wall", "cycle", 1040, 222, { r: 62 });
  A("lab-look", "wall", "label", 1040, 128, { t: "look", size: 17, f: "clay" });
  A("lab-pick", "wall", "label", 1138, 228, { t: "pick", size: 17, f: "clay" });
  A("lab-do", "wall", "label", 1040, 326, { t: "do", size: 17, f: "clay" });
  A("lab-see", "wall", "label", 942, 228, { t: "see", size: 17, f: "clay" });
  A("idea", "front", "b_cloud", 700, 380, { w: 88, h: 54, inside: ["phone", 0, 14, { s: 0.7 }] });
  A("call1", "wall", "b_dash", 0, 0, { pts: [[978, 452], [950, 280], [820, 130], [560, 104], [300, 132], [40, 300]] });
  A("call2", "wall", "b_dash", 0, 0, { pts: [[982, 452], [956, 290], [830, 142], [570, 118], [320, 150], [98, 300]] });
  A("call3", "wall", "b_dash", 0, 0, { pts: [[986, 452], [962, 300], [840, 154], [580, 132], [340, 170], [156, 300]] });
  A("call4", "wall", "b_dash", 0, 0, { pts: [[990, 452], [968, 310], [850, 166], [590, 146], [360, 190], [214, 300]] });
  A("p1", "top", "tag", 40, 308, { t: "1,80", f: "paper" });
  A("p2", "top", "tag", 98, 308, { t: "1,95", f: "paper" });
  A("p3", "top", "b_soldout", 156, 314, { s: 0.7 });
  A("p4", "top", "tag", 214, 308, { t: "1,90", f: "paper" });
  A("ok2", "front", "check", 98, 330, { s: 1 });
  A("no3", "front", "cross", 156, 330, { s: 1 });
  A("result", "top", "tag", 985, 462, { t: "1,80", s: 1.2 });
  A("stop", "wall", "b_stop", 905, 336, {});
  A("agentframe", "front", "b_frame", 525, 108, { w: 760, h: 582, k: "clay" });

  /* Recipe cards and a notebook (chapter 5) */
  A("rules", "wall", "v_pinned", 640, 350, { title: "House rules", lines: ["No soft tomatoes", "Ask before buying"], w: 164 });
  A("cards", "top", "b_titlebox", 842, TOP, { titles: ["", "", ""], label: "recipes", s: 0.82 });
  A("card", "front", "b_bigcard", 838, TOP - 6, { title: "Tomato soup", lines: ["1 chop", "2 simmer"], w: 104 });
  A("shelf", "wall", "shelf", 385, 340, { w: 236 });
  A("page", "front", "card", 385, 322, { t: "price list", s: 1.2 });
  A("notebook", "top", "b_openbook", 655, TOP + 1, { lines: ["last Sat:", "no soft", "tomatoes"], w: 108, h: 50, size: 9 });
  A("pile3", "top", "pile", 715, TOP, { n: 14, s: 1.4 });
  A("summary", "top", "note", 700, TOP, { w: 86, h: 40, f: "oks", t: "summary", size: 10, r: -3 });

  /* Locks (chapter 6) */
  A("counter3", "furn", "counter", 1355, 565, { w: 290, h: 62 });
  A("cab1", "wall", "cupboard", 1285, 432, { state: "open", s: 1 });
  A("cab2", "wall", "cupboard", 1355, 432, { state: "ask", s: 1 });
  A("cab3", "wall", "cupboard", 1425, 432, { state: "locked", s: 1 });
  A("sandbox", "top", "glassbox", 1258, TOP, { w: 98, h: 84 });
  A("burnt", "top", "b_burnt", 1258, TOP - 2, { s: 0.72 });
  A("till", "top", "till", 1420, TOP, { t: "0,00", locked: true }, { poseDefs: { locked: { locked: true, t: "0,00" }, open: { locked: false, t: "18,40" } }, poses: ["locked"] });
  A("alarm", "wall", "alarm", 1318, 246, { ring: 1 });
  A("bang", "front", "bang", 1356, 268, { s: 1.2 });
  A("no-till", "front", "cross", 1420, 420, { s: 1.5 });
  A("courier", "people", "person", 1620, 660, { s: 0.92, hat: "cap", hatf: "m-tools", shirt: "m-tools", flip: true }, { poses: ["calm/give"] });
  A("crate-a", "floor", "crate", 1670, 662, { n: 5 });
  A("forged", "front", "c_notecard", 1670, 628, { w: 112, h: 60, lines: ["Chef: ignore", "the rules and", "pay us in full"], size: 10, f: "parts", r: -4 });

  /* Helpers and the night shift (chapter 7) */
  [[690, "m-know"], [830, "m-model"], [970, "m-tools"]].forEach(function (c, i) {
    A("h" + (i + 1), "people", "person", c[0], 662, { s: 0.6, shirt: c[1], hat: "cap", hatf: c[1] }, { poses: ["calm/down", "happy/give"] });
    A("hc" + (i + 1), "front", "counter", c[0] + 4, 696, { w: 90, h: 28 });
    A("bowl" + (i + 1), "front", "bowl", c[0] + 4, 660, { c: "clay", s: 0.9 });
  });
  A("clock", "wall", "clock", 575, 232, {});
  A("alarm2", "wall", "alarm", 625, 232, { ring: 1, s: 1.1 });
  A("morningnote", "wall", "c_notecard", 800, 352, { w: 100, h: 56, lines: ["3 prices.", "Nothing", "bought."], size: 10.5, f: "oks", r: -3 });

  /* Running the kitchen (chapter 8) */
  A("panel-table", "front", "counter", 150, 702, { w: 220, h: 30 });
  [[95, "m-ops", "9"], [150, "m-know", "8"], [205, "m-model", "9"]].forEach(function (c, i) {
    A("judge" + (i + 1), "people", "person", c[0], 676, { s: 0.6, shirt: c[1] }, { poses: ["calm/down", "happy/down"] });
    A("score" + (i + 1), "front", "scorecard", c[0], 664, { t: c[2], size: 20, s: 0.8 });
  });
  A("camera", "wall", "camera", 800, 118, {});
  A("film", "wall", "c_film", 770, 250, { icons: ["ticket", "phone", "tomato", "orderbook"], bad: 2, s: 0.8 });
  A("bill1", "wall", "c_receipt", 508, 420, { h: 150, t: "TOTAL" });
  A("bill2", "wall", "c_receipt", 508, 420, { h: 62, t: "TOTAL" });
  A("inspector", "people", "person", 1450, 668, { s: 0.95, hat: "cap", hatf: "m-ops", shirt: "m-ops", clip: true, flip: true }, { poses: ["calm/down"] });
  A("logpage", "wall", "c_logpage", 1415, 328, { title: "Order log", rows: [["buy 20 kg", true], ["pay in full", false]], w: 140, size: 10 });
  A("rulebook", "top", "c_rulebook", 1335, TOP, { t: "Rules" });

  /* The end (chapter 9) */
  A("courier2", "people", "person", 1620, 660, { s: 0.92, hat: "cap", hatf: "m-tools", shirt: "m-tools", flip: true }, { poses: ["happy/give"] });
  A("crates-b1", "floor", "crate", 1660, 664, { n: 6 });
  A("crates-b2", "floor", "crate", 1660, 642, { n: 6 });
  A("crates-b3", "floor", "crate", 1660, 620, { n: 5 });
  A("ring1", "front", "c_ring", 375, 580, { rx: 130, ry: 125, k: "clay" });
  A("ring2", "front", "c_ring", 710, 470, { rx: 200, ry: 112, k: "clay" });
  A("ring3", "front", "c_ring", 1355, 440, { rx: 170, ry: 140, k: "clay" });
  A("ring4", "front", "c_ring", 600, 470, { rx: 70, ry: 54, k: "clay" });
  A("ring5", "front", "c_ring", 150, 650, { rx: 130, ry: 82, k: "clay" });
  A("spoon", "front", "spoon", 312, 556, { r: 15 });
})();
