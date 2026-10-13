/* Agentic AI, Explained (v6): the two voices. The page is told twice, side by side: once with the restaurant kitchen
   (AE3.kitchen) and once in plain technical words (AE3.tech). This file hands the other scripts the words of each voice
   as one object, voice.kitchen and voice.tech, with the same methods, so a view builds both columns with the same code.
   What both voices say alike is told once, in the middle (voice.problem): the question a chapter answers. */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  var K = D.kitchen, T = D.tech;

  function make(kind) {
    var isK = kind === "kitchen", W = isK ? K : T;

    // A chapter: title, the text and the example, and for each paragraph and the example what it is about (the arrows
    // to the map follow `points`). In the kitchen voice there is also a lead (under the picture); `term` is the real
    // name of the chapter's subject, shown next to the kitchen title.
    function chapter(c) {
      var w = W.chapters[c.id], p = D.points[c.id][kind];
      return { title: w.title, term: isK ? T.chapters[c.id].title : null, lead: isK ? w.lead : null, text: w.text, example: w.example, points: p };
    }

    // A term: what its page and the search show. Kitchen: one picture sentence, the kitchen mechanism, the Saturday step
    // and tips. Technical: the one-sentence definition, the mechanism, the example step and tips.
    function entry(id) {
      var e = D.entries[id];
      if (isK) { var k = K.entries[id]; return { line: k.line, how: k.how, example: k.example, forYou: k.forYou }; }
      return { line: e.short, how: e.how, example: e.example, forYou: e.forYou };
    }

    function glossary(g) { return isK ? K.glossary[g.term] || g.def : g.def; }

    function guide(id) {
      var g = D.guideList.filter(function (x) { return x.id === id; })[0];
      var t = T.guides[id] || {};
      var lede = "", note = "";
      if (id === "compare") { lede = (isK ? K.compare : t).lede; note = (isK ? K.compare : t).note; }
      else if (id === "build") { lede = (isK ? K.build : t).lede; note = t.note; }
      else if (id === "learn") lede = t.lede;
      return { id: id, menu: g.menu, hint: g.hint, eyebrow: g.eyebrow, title: g.title, lede: lede || "", note: note || "" };
    }

    return { kind: kind, kitchen: isK, ui: W.ui, chapter: chapter, entry: entry, glossary: glossary, guide: guide,
      recap: W.recap, hero: W.hero, figure: function (i) { return W.figures.contextBars[i]; }, map: W.map };
  }

  // The question a chapter answers is the same in both voices, so it is told once (in plain technical words).
  function problem(c) { return T.chapters[c.id].problem; }

  V3.voice = { kitchen: make("kitchen"), tech: make("technical"), kinds: ["kitchen", "technical"], problem: problem };
})();
