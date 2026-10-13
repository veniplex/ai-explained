/* AI explained: the words of the deep dive, the guides and the glossary. Everything outside the kitchen story is told in plain technical words
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

  // A guide: what the lists and the page show. All seven guides are long guides (AE3.tech.longGuides): a lede, who it is for, what you will know afterwards,
  // numbered sections (each with an "In short" line and the sources it rests on), the terms used and the list of sources.
  function guide(id) {
    var g = D.guideList.filter(function (x) { return x.id === id; })[0], long = (T.longGuides || {})[id] || {};
    return { id: id, menu: g.menu, hint: g.hint, title: g.title, icon: g.icon, minutes: long.minutes || g.minutes, lede: long.lede || "", audience: long.audience || "",
      expect: long.expect || [], sections: long.sections || [], terms: long.terms || [], sources: long.sources || [] };
  }

  V3.voice = { ui: ui, chapter: chapter, entry: entry, guide: guide, recap: function () { return T.recap; }, hero: function () { return T.hero; },
    figure: function (i) { return T.figures.contextBars[i]; }, map: function () { return T.map; } };
})();
