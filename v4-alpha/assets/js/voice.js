/* Agentic AI, Explained (v4): the two voices. The page is told twice, once with the restaurant kitchen (AE3.kitchen)
   and once in plain technical words (AE3.tech). This file hands the other scripts the words of the voice that is
   switched on (sk.mode), so they never choose between two texts themselves. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3;
  var K = D.kitchen, T = D.tech;

  function isKitchen() { return sk.mode.get() === "kitchen"; }
  function ui() { return isKitchen() ? K.ui : T.ui; }
  function bits() { return isKitchen() ? K : T; }

  // A chapter: title, the one-sentence problem, the text and the example of the voice that is on. In the kitchen voice
  // there is also a lead (next to the picture) and `term`, the real name of the chapter's subject.
  function chapter(c) {
    var k = K.chapters[c.id], t = T.chapters[c.id];
    if (isKitchen()) return { title: k.title, term: t.title, problem: k.problem, lead: k.lead, text: k.text, example: k.example };
    return { title: t.title, term: null, problem: t.problem, lead: null, text: t.text, example: t.example };
  }

  // A term: what its page and the search show. Kitchen: one picture sentence, the kitchen mechanism, the Saturday step
  // and tips. Technical: the one-sentence definition, the mechanism, the example step and tips.
  function entry(id) {
    var e = D.entries[id];
    if (isKitchen()) { var k = K.entries[id]; return { line: k.line, how: k.how, example: k.example, forYou: k.forYou }; }
    return { line: e.short, how: e.how, example: e.example, forYou: e.forYou };
  }

  function glossary(g) { return isKitchen() ? K.glossary[g.term] || g.def : g.def; }

  function guide(id) {
    var g = D.guideList.filter(function (x) { return x.id === id; })[0];
    var k = isKitchen() ? K : null;
    var t = T.guides[id] || {};
    var lede = "", note = "";
    if (id === "compare") { lede = (k ? K.compare : t).lede; note = (k ? K.compare : t).note; }
    else if (id === "build") { lede = (k ? K.build : t).lede; note = t.note; }
    else if (id === "learn") lede = t.lede;
    return { id: id, menu: g.menu, hint: g.hint, eyebrow: g.eyebrow, title: g.title, lede: lede || "", note: note || "" };
  }

  function recapText() { return bits().recap; }
  function hero() { return bits().hero; }
  function figure(i) { return bits().figures.contextBars[i]; }

  V3.voice = { kitchen: isKitchen, ui: ui, chapter: chapter, entry: entry, glossary: glossary, guide: guide, recap: recapText, hero: hero, figure: figure, map: function () { return bits().map; } };
})();
