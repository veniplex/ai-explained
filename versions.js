/* Agentic AI, Explained: the versions of the site, in one place. Newest first: the first entry is the current version.
   The root index.html forwards to it, and the version dropdown in the header of every version (version-switcher.js) lists them all.
   A new version is added here, at the top, and nowhere else (see .claude/skills/new-version/SKILL.md).
   guided: has the guided path (#ch-1 …), so a chapter link carries over. pages: has a page per term and per guide (terms/<id>/, guides/<id>/). */
window.AE_VERSIONS = {
  list: [
    { id: "v7-alpha", note: "A hand-drawn comic that plays panel by panel", guided: true, pages: false },
    { id: "v6-alpha", note: "The map in the middle, with arrows from both voices", guided: true, pages: true },
    { id: "v5-alpha", note: "Kitchen and technical words side by side", guided: true, pages: true },
    { id: "v4-alpha", note: "Kitchen or technical words, one at a time", guided: true, pages: true },
    { id: "v3-alpha", note: "A guided path instead of one map", guided: true, pages: false },
    { id: "v1-alpha", note: "Every building block on one map", guided: false, pages: false }
  ]
};
