/* AI explained: the versions of the site, in one place. Newest first: the first entry is the current version, the one at the root of the site (main: true).
   Every other version is a folder of this folder (versions/<id>/) and stays online unchanged. The version dropdown in the header of every version
   (version-switcher.js, next to this file) lists them all. A new release is added here, at the top, and nowhere else (see .claude/skills/new-version/SKILL.md).
   main: the version at the root of the site (exactly one, the first entry); it has no folder in versions/, and the older main version moves in as one when a new release replaces it.
   guided: has the guided path (#ch-1 …), so a chapter link carries over. pages: has a page per term and per guide (terms/<id>/, guides/<id>/).
   sections: has a page per glossary term and per guide (glossary/<id>/, guides/<id>/).
   codename: the last name of a person whose work shaped AI as it is today, one word; year: the year of that key contribution. The names run in historical order as the versions come
   (Lovelace 1843 … Vaswani 2017), researchers and scientists only (the rule and the next names: docs/version-names.md). The dropdown shows the codename next to the id ("v1.0 · Vaswani"). */
window.AE_VERSIONS = {
  list: [
    { id: "v1.0", main: true, codename: "Vaswani", year: 2017, guided: true, pages: false, sections: true },
    { id: "v0.17-alpha", codename: "Hinton", year: 2012, guided: true, pages: false, sections: true },
    { id: "v0.16-alpha", codename: "Li", year: 2009, guided: true, pages: false, sections: true },
    { id: "v0.15-alpha", codename: "Bengio", year: 2003, guided: true, pages: false, sections: true },
    { id: "v0.14-alpha", codename: "Hochreiter", year: 1997, guided: true, pages: false },
    { id: "v0.13-alpha", codename: "Cortes", year: 1995, guided: true, pages: false },
    { id: "v0.12-alpha", codename: "Sutton", year: 1988, guided: true, pages: true },
    { id: "v0.11-alpha", codename: "Rumelhart", year: 1986, guided: true, pages: true },
    { id: "v0.10-alpha", codename: "Hopfield", year: 1982, guided: true, pages: true },
    { id: "v0.9-alpha", codename: "Fukushima", year: 1980, guided: true, pages: false },
    { id: "v0.8-alpha", codename: "Rosenblatt", year: 1958, guided: true, pages: false },
    { id: "v0.7-alpha", codename: "McCarthy", year: 1956, guided: true, pages: false },
    { id: "v0.6-alpha", codename: "Shannon", year: 1948, guided: true, pages: true },
    { id: "v0.5-alpha", codename: "McCulloch", year: 1943, guided: true, pages: true },
    { id: "v0.4-alpha", codename: "Turing", year: 1936, guided: true, pages: true },
    { id: "v0.3-alpha", codename: "Boole", year: 1854, guided: true, pages: false },
    { id: "v0.1-alpha", codename: "Lovelace", year: 1843, guided: false, pages: false }
  ]
};
