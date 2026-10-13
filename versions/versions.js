/* AI explained: the versions of the site, in one place. Newest first: the first entry is the current version, the one at the root of the site (main: true).
   Every other version is a folder of this folder (versions/<id>/) and stays online unchanged. The version dropdown in the header of every version
   (version-switcher.js, next to this file) lists them all. A new release is added here, at the top, and nowhere else (see .claude/skills/new-version/SKILL.md).
   main: the version at the root of the site (exactly one, the first entry); it has no folder in versions/, and the older main version moves in as one when a new release replaces it.
   guided: has the guided path (#ch-1 …), so a chapter link carries over. pages: has a page per term and per guide (terms/<id>/, guides/<id>/).
   sections: has a page per glossary term and per guide (glossary/<id>/, guides/<id>/).
   codename: a herb or spice, one word, given in alphabetical order as the versions come (Anise, Basil, Chervil … ); the dropdown shows it next to the id ("v1.0 · Saffron"). */
window.AE_VERSIONS = {
  list: [
    { id: "v1.0", main: true, codename: "Saffron", guided: true, pages: false, sections: true },
    { id: "v0.17-alpha", codename: "Rue", guided: true, pages: false, sections: true },
    { id: "v0.16-alpha", codename: "Rosemary", guided: true, pages: false, sections: true },
    { id: "v0.15-alpha", codename: "Parsley", guided: true, pages: false, sections: true },
    { id: "v0.14-alpha", codename: "Oregano", guided: true, pages: false },
    { id: "v0.13-alpha", codename: "Nutmeg", guided: true, pages: false },
    { id: "v0.12-alpha", codename: "Marjoram", guided: true, pages: true },
    { id: "v0.11-alpha", codename: "Lovage", guided: true, pages: true },
    { id: "v0.10-alpha", codename: "Juniper", guided: true, pages: true },
    { id: "v0.9-alpha", codename: "Hyssop", guided: true, pages: false },
    { id: "v0.8-alpha", codename: "Garlic", guided: true, pages: false },
    { id: "v0.7-alpha", codename: "Fennel", guided: true, pages: false },
    { id: "v0.6-alpha", codename: "Epazote", guided: true, pages: true },
    { id: "v0.5-alpha", codename: "Dill", guided: true, pages: true },
    { id: "v0.4-alpha", codename: "Chervil", guided: true, pages: true },
    { id: "v0.3-alpha", codename: "Basil", guided: true, pages: false },
    { id: "v0.1-alpha", codename: "Anise", guided: false, pages: false }
  ]
};
