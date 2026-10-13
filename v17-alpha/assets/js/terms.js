/* AI explained (v17): every term in one list. The 21 main terms (AE3.entries, with a full page each) and the terms of the glossary (AE3.glossary, one
   page each too) are looked up the same way, by id. Exposes V3.terms:
     list      all terms, A to Z                  get(id)    one term: { id, name, label, main, cat, icon, zone, entry, chapter, aka, related }
     cats      the groups, with their terms       line(id)   the one-sentence definition of a term
     kitchen   the kitchen sentence of a term     refs(id)   its references to external knowledge
     chapterOf the story chapter that explains it (the chapter of the main term it belongs to), or null
   Plain ES5. Needs voice.js and the data files. */
(function () {
  "use strict";

  var V3 = window.V3, D = window.AE3;
  if (!V3 || !D) return;

  // The group of each main term: by the chapter it is introduced in.
  var CAT_OF_CHAPTER = { chef: "models", counter: "prompting", tools: "tools", loop: "agents", recipes: "knowledge", locks: "safety", helpers: "teams", "kitchen-ops": "ops" };
  var CATS = {}, list = [], byId = {}, chapterOfEntry = {};
  (D.glossaryCats || []).forEach(function (c) { CATS[c.id] = { id: c.id, title: c.title, zone: c.zone, terms: [] }; });
  D.chapters.forEach(function (c) { c.entries.forEach(function (id) { chapterOfEntry[id] = c; }); });

  function add(t) { byId[t.id] = t; list.push(t); if (CATS[t.cat]) CATS[t.cat].terms.push(t); }
  D.chapters.forEach(function (c) {
    c.entries.forEach(function (id) {
      var e = D.entries[id];
      add({ id: id, name: e.name, label: e.label || e.name, main: true, cat: CAT_OF_CHAPTER[c.id], icon: (D.glossaryIcons || {})[id] || "spark", zone: c.zone, entry: id, chapter: c, aka: [], related: e.related || [] });
    });
  });
  (D.glossary || []).forEach(function (g) {
    var cat = CATS[g.cat];
    add({ id: g.id, name: g.term, label: g.term, main: false, cat: g.cat, icon: g.icon, zone: cat ? cat.zone : "start", entry: g.entry || null,
      chapter: g.entry ? chapterOfEntry[g.entry] : null, aka: g.aka || [], related: g.related || [], raw: g });
  });
  function byName(a, b) { return a.name.toLowerCase().replace(/[^a-z0-9]/g, "").localeCompare(b.name.toLowerCase().replace(/[^a-z0-9]/g, "")); }
  list.sort(byName);
  Object.keys(CATS).forEach(function (k) { CATS[k].terms.sort(byName); });
  var cats = (D.glossaryCats || []).map(function (c) { return CATS[c.id]; });

  function get(id) { return Object.prototype.hasOwnProperty.call(byId, id) ? byId[id] : null; }
  // The one-sentence definition of a term; its kitchen sentence (where it sits in the kitchen of the story) is a separate field, only the glossary shows it.
  function line(id) {
    var t = get(id);
    if (!t) return "";
    return t.main ? D.entries[id].short : t.raw.def;
  }
  function kitchen(id) { return ((D.kitchen || {}).glossary || {})[id] || ""; }
  function more(id) {
    var t = get(id);
    return t && !t.main ? t.raw.more || [] : [];
  }
  // The references of a term: a main term cites the sources of its entry, any other term has its own list (data/glossary-refs.js).
  function refs(id) {
    var t = get(id);
    if (!t) return [];
    return t.main ? ((D.sources[id] || {}).sources || []) : (D.glossaryRefs || {})[id] || [];
  }

  V3.terms = { list: list, cats: cats, get: get, line: line, kitchen: kitchen, more: more, refs: refs, chapterOf: function (id) { var t = get(id); return t ? t.chapter : null; } };
})();
