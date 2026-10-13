/* AI explained: the versions of the site, in one place. Newest first: the first entry is the current version, the one at the root of the site (main: true).
   Every other version is a folder of this folder (versions/<id>/) and stays online unchanged. The version dropdown in the header of every version
   (version-switcher.js, next to this file) lists them all. A new release is added here, at the top, and nowhere else (see .claude/skills/new-version/SKILL.md).
   main: the version at the root of the site (exactly one, the first entry); it has no folder in versions/, and the older main version moves in as one when a new release replaces it.
   guided: has the guided path (#ch-1 …), so a chapter link carries over. pages: has a page per term and per guide (terms/<id>/, guides/<id>/).
   sections: has a page per glossary term and per guide (glossary/<id>/, guides/<id>/). */
window.AE_VERSIONS = {
  list: [
    { id: "v1.0", main: true, note: "The release: the kitchen story, the technical deep dive, seven guides and a glossary of AI terms, as an installable app", guided: true, pages: false, sections: true },
    { id: "v0.17-alpha", note: "A steadier top bar, a glossary with its own page outline and reading bar, a to-top button, and an installable app", guided: true, pages: false, sections: true },
    { id: "v0.16-alpha", note: "A simpler top bar with GitHub and a System theme, guides in one layout with sources and a reading bar, and a steadier glossary", guided: true, pages: false, sections: true },
    { id: "v0.15-alpha", note: "A glossary with a kitchen place for every term, a left sidebar, and guides with their own section list", guided: true, pages: false, sections: true },
    { id: "v0.14-alpha", note: "AI explained: a menu, guides as notes, and a glossary of AI terms", guided: true, pages: false },
    { id: "v0.13-alpha", note: "Three ways in: the kitchen story, the kitchen deep dive, and a technical deep dive with no analogy", guided: true, pages: false },
    { id: "v0.12-alpha", note: "v0.11 with a start page where you pick the kitchen story or the deep dive", guided: true, pages: true },
    { id: "v0.11-alpha", note: "v0.10, tested and tidied: touch, keyboard, reading and speed", guided: true, pages: true },
    { id: "v0.10-alpha", note: "The kitchen story, with a deep dive behind every name", guided: true, pages: true },
    { id: "v0.9-alpha", note: "One kitchen that builds itself, then the real names on top", guided: true, pages: false },
    { id: "v0.8-alpha", note: "The comic as one strip that grows from left to right", guided: true, pages: false },
    { id: "v0.7-alpha", note: "A hand-drawn comic that plays panel by panel", guided: true, pages: false },
    { id: "v0.6-alpha", note: "The map in the middle, with arrows from both voices", guided: true, pages: true },
    { id: "v0.5-alpha", note: "Kitchen and technical words side by side", guided: true, pages: true },
    { id: "v0.4-alpha", note: "Kitchen or technical words, one at a time", guided: true, pages: true },
    { id: "v0.3-alpha", note: "A guided path instead of one map", guided: true, pages: false },
    { id: "v0.1-alpha", note: "Every building block on one map", guided: false, pages: false }
  ]
};
