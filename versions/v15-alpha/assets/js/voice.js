/* AI explained (v15): the words of the deep dive, the guides and the glossary. Everything outside the kitchen story is told in plain technical words
   (AE3.tech, plus the technical fields of AE3.entries), with no picture. This file hands the other scripts those words, so they never read the data files
   in two different ways. The kitchen only appears in the story and in the glossary's "Where it sits in the kitchen" (kitchen-place.js). */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  var T = D.tech;

  function ui() { return T.ui; }

  // A chapter: title, the one-sentence problem, the text and the example.
  function chapter(c) {
    var t = T.chapters[c.id];
    return { title: t.title, problem: t.problem, text: t.text, example: t.example };
  }

  // A main term: the one-sentence definition, the mechanism, the example and tips.
  function entry(id) {
    var e = D.entries[id];
    return { line: e.short, how: e.how, example: e.example, forYou: e.forYou };
  }

  // A guide: what the lists and the page show. The long guides (kind "article") have their sections in AE3.tech.longGuides; the three others (table, build,
  // list) have a lede and a note.
  function guide(id) {
    var g = D.guideList.filter(function (x) { return x.id === id; })[0];
    var t = T.guides[id] || {}, long = (T.longGuides || {})[id];
    var lede = "", note = "";
    if (id === "compare" || id === "build") { lede = t.lede; note = t.note; }
    else if (id === "learn") lede = t.lede;
    else if (long) lede = long.lede;
    return { id: id, menu: g.menu, hint: g.hint, title: g.title, kind: g.kind, icon: g.icon, minutes: long ? long.minutes : g.minutes,
      lede: lede || "", note: note || "", expect: long ? long.expect : null, sections: long ? long.sections : null, terms: long ? long.terms : null };
  }

  V3.voice = { ui: ui, chapter: chapter, entry: entry, guide: guide, recap: function () { return T.recap; }, hero: function () { return T.hero; },
    figure: function (i) { return T.figures.contextBars[i]; }, map: function () { return T.map; } };
})();
