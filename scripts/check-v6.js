#!/usr/bin/env node
/* Content checks for v0.6-alpha: the rules of v0.4-alpha and v0.5-alpha (both voices, word budgets, links, term and guide
   pages), plus the arrows: every passage of a chapter says which pieces of the map it is about.
   Run from the repository root: node scripts/check-v6.js */
"use strict";
const path = require("node:path");
const { loadV4, run } = require("./check-v4.js");

const DIR = "versions/v0.6-alpha";
const PAGES = ["./build-v6-pages.js", "node scripts/build-v6-pages.js"];

// Problems with AE3.points: one list per paragraph and one for the example, in each voice, only naming pieces that are
// already on the map in that chapter.
function checkPoints(D) {
  const errors = [], chapterOf = {};
  D.chapters.forEach((c) => c.entries.forEach((id) => { chapterOf[id] = c.n; }));
  const P = D.points || {};
  D.chapters.forEach((c) => {
    ["kitchen", "technical"].forEach((voice) => {
      const at = "points." + c.id + "." + voice, texts = (voice === "kitchen" ? D.kitchen : D.tech).chapters[c.id].text, p = (P[c.id] || {})[voice];
      if (!p) { errors.push(at + ": missing"); return; }
      if (!Array.isArray(p.text) || p.text.length !== texts.length) errors.push(at + ".text: needs one list for each of the " + texts.length + " paragraphs");
      const lists = (p.text || []).concat([p.example]);
      lists.forEach((list, i) => {
        const where = at + (i < texts.length ? ".text[" + i + "]" : ".example");
        if (!Array.isArray(list) || !list.length) { errors.push(where + ": needs at least one target"); return; }
        if (list.length > 3) errors.push(where + ": at most 3 targets");
        list.forEach((id) => {
          if (id === "you" || id === "zone") return;
          if (!D.entries[id]) errors.push(where + ": unknown entry " + id);
          else if (!(chapterOf[id] <= c.n)) errors.push(where + ": " + id + " is not on the map until chapter " + chapterOf[id]);
        });
      });
    });
  });
  return errors;
}

function main() {
  const root = path.resolve(__dirname, ".."), errors = run(root, DIR, PAGES[0], PAGES[1]);
  let more = [];
  try { more = checkPoints(loadV4(root, DIR)); } catch (e) { more = ["points check crashed: " + e.message]; }
  const all = errors.concat(more);
  if (all.length) { console.error(all.length + " problem(s):\n- " + all.join("\n- ")); process.exit(1); }
  console.log(DIR + " content checks passed.");
}

module.exports = { checkPoints };

if (require.main === module) main();
