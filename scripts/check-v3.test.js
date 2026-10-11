"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { check, wordCount, plain, prose, mentions, CHAPTER_IDS } = require("./check-v3.js");

// A minimal valid data set: one entry per chapter, each absorbing one v1 block.
function fixture() {
  const v1 = { blocks: {} };
  const v3 = {
    hero: { title: "How it works", line: "A short line." }, example: { task: "Find flights." },
    chapters: [], entries: {}, recap: [], guideList: [{ id: "about" }], sources: {},
    guides: { glossary: [], compare: { rows: [] }, build: { recipe: [], patterns: [], flows: [], protocols: [] }, learn: [] }
  };
  CHAPTER_IDS.forEach((cid, i) => {
    const id = "e" + i;
    v1.blocks["b" + i] = {};
    v3.chapters.push({ id: cid, n: i + 1, title: "T", problem: "P", kitchen: "K", real: ["R"], example: "X", entries: [id] });
    v3.entries[id] = {
      chapter: cid, name: "N", label: "L", kitchen: "K", short: "S", how: ["H"], example: "X", forYou: ["F"],
      deeper: { details: ["D"], includes: [] }, related: [], from: ["b" + i]
    };
    v3.sources[id] = { facts: [], sources: [{ title: "t", by: "b", url: "https://example.com/" + i, year: 2026 }] };
  });
  for (let i = 0; i < 5; i++) v3.recap.push({ t: "Idea", d: "Text", entries: ["e0"] });
  return { v1, v3 };
}

test("plain strips inline markup", () => {
  assert.equal(plain("A [[mcp|plug]] and [[tools]], **bold** `code` [link](https://x.y)"), "A plug and tools, bold code link");
});

test("wordCount counts words across nested arrays", () => {
  assert.equal(wordCount("one two", ["three", ["four five"]], null), 5);
});

test("a complete fixture passes", () => {
  const { v1, v3 } = fixture();
  assert.deepEqual(check(v1, v3), []);
});

test("an unmapped v1 block is reported", () => {
  const { v1, v3 } = fixture();
  v1.blocks.orphan = {};
  assert.ok(check(v1, v3).some((e) => e.includes("v1 block orphan")));
});

test("a v1 block mapped twice is reported", () => {
  const { v1, v3 } = fixture();
  v3.entries.e1.from.push("b0");
  v3.entries.e1.deeper.includes.push({ name: "x", text: "y" });
  assert.ok(check(v1, v3).some((e) => e.includes("v1 block b0: mapped to e0, e1")));
});

test("an unknown [[link]] is reported", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = ["See [[nope]]."];
  assert.ok(check(v1, v3).some((e) => e.includes("unknown link [[nope]]")));
});

test("the entry word budget is enforced", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = [Array(151).fill("word").join(" ")];
  assert.ok(check(v1, v3).some((e) => e.includes("entry e0: levels 1 and 2")));
});

test("the core path word budget is enforced", () => {
  const { v1, v3 } = fixture();
  v3.chapters[0].real = [Array(2500).fill("word").join(" ")];
  assert.ok(check(v1, v3).some((e) => e.startsWith("core path:")));
});

test("more than four entries in a chapter is reported", () => {
  const { v1, v3 } = fixture();
  v3.chapters[0].entries = ["e0", "e1", "e2", "e3", "e4"];
  assert.ok(check(v1, v3).some((e) => e.includes("introduces 5 entries")));
});

test("a merged entry without includes lines is reported", () => {
  const { v1, v3 } = fixture();
  v1.blocks.extra = {};
  v3.entries.e0.from.push("extra");
  assert.ok(check(v1, v3).some((e) => e.includes("entry e0: needs an includes line")));
});

test("duplicate source URLs within an entry are reported", () => {
  const { v1, v3 } = fixture();
  v3.sources.e0.sources.push(Object.assign({}, v3.sources.e0.sources[0]));
  assert.ok(check(v1, v3).some((e) => e.includes("sources e0: duplicate")));
});

test("a glossary term missing from the page is reported", () => {
  const { v1, v3 } = fixture();
  v3.guides.glossary.push({ term: "Zygomorphic (Z)", def: "d", entry: "e0" });
  assert.ok(check(v1, v3).some((e) => e.includes("glossary Zygomorphic (Z): term does not appear")));
});

const pad = (n) => Array(n).fill("word").join(" ");

test("levels 1 and 2 pass at exactly 150 words", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = [pad(146)]; // kitchen, short, example and forYou add the other 4
  assert.deepEqual(check(v1, v3), []);
});

test("levels 1 and 2 fail at 151 words", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = [pad(147)];
  assert.ok(check(v1, v3).includes("entry e0: levels 1 and 2 have 151 words, limit 150"));
});

test("the core path passes at exactly 2500 words and fails at 2501", () => {
  const { v1, v3 } = fixture();
  v3.hero.line = pad(2445); // with the rest of the fixture the core path is then exactly 2500
  assert.deepEqual(check(v1, v3), []);
  v3.hero.line = pad(2446);
  assert.ok(check(v1, v3).includes("core path: 2501 words, limit 2500"));
});

test("a glossary term that only matches a v1 block id is reported", () => {
  const { v1, v3 } = fixture();
  v3.guides.glossary.push({ term: "B0", def: "d", entry: "e0" });
  assert.ok(check(v1, v3).includes("glossary B0: term does not appear on the page"));
});

test("a glossary term inside a longer word is reported", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = ["Average results."];
  v3.guides.glossary.push({ term: "RAG", def: "d", entry: "e0" });
  assert.ok(check(v1, v3).includes("glossary RAG: term does not appear on the page"));
});

test("a glossary term with no words to look for is reported", () => {
  const { v1, v3 } = fixture();
  v3.guides.glossary.push({ term: "(Z)", def: "d", entry: "e0" });
  assert.ok(check(v1, v3).includes("glossary (Z): term has no words to look for"));
});

test("a glossary term passes on its plural", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = ["Agents work."];
  v3.guides.glossary.push({ term: "Agent", def: "d", entry: "e0" });
  assert.deepEqual(check(v1, v3), []);
});

test("malformed data is reported, not thrown", () => {
  const { v1, v3 } = fixture();
  v3.guides.learn.push({ title: "G" });
  v3.guides.glossary.push({ def: "d", entry: "e0" });
  v3.entries.e1 = null;
  v3.guides.build.flows = [{ name: "F", route: [null, { e: "e0" }] }];
  let errors;
  assert.doesNotThrow(() => { errors = check(v1, v3); });
  assert.ok(errors.includes("learn G: missing items"));
  assert.ok(errors.includes("glossary entry without term"));
  assert.ok(errors.includes("entry e1: is not an object"));
});

test("chapters out of order are reported", () => {
  const { v1, v3 } = fixture();
  [v3.chapters[0], v3.chapters[1]] = [v3.chapters[1], v3.chapters[0]];
  assert.ok(check(v1, v3).some((e) => e.startsWith("chapters: expected chef, counter")));
});

test("an unknown related id is reported", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.related = ["nope"];
  assert.ok(check(v1, v3).includes("entry e0: unknown related nope"));
});

test("a missing sources entry is reported", () => {
  const { v1, v3 } = fixture();
  delete v3.sources.e1;
  assert.ok(check(v1, v3).includes("sources: missing e1"));
});

test("mentions matches the head as a whole word, ignoring case", () => {
  assert.equal(mentions("The RAG pipeline", "RAG"), true);
  assert.equal(mentions("the rag pipeline", "RAG"), true);
  assert.equal(mentions("Average results", "RAG"), false);
  assert.equal(mentions("an agentic loop", "Agent"), false);
});

test("mentions accepts the plural forms s and es", () => {
  assert.equal(mentions("two agents", "Agent"), true);
  assert.equal(mentions("two boxes", "Box"), true);
});

test("mentions drops a trailing parenthetical and refuses an empty head", () => {
  assert.equal(mentions("zygomorphic shapes", "Zygomorphic (Z)"), true);
  assert.equal(mentions("anything at all", "(Z)"), false);
  assert.equal(mentions("anything at all", "   "), false);
});

test("prose keeps visible text and leaves out identifier fields", () => {
  const { v3 } = fixture();
  const text = prose(v3);
  assert.ok(text.includes("idea"));
  assert.ok(!text.includes("b0"));
  assert.ok(!text.includes("chef"));
});
