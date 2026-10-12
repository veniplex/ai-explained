"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { check, wordCount, plain, prose, mentions, CHAPTER_IDS } = require("./check-v4.js");

const words = (n) => Array(n).fill("word").join(" ");

// A minimal valid data set: one entry per chapter, each absorbing one v1 block, told in both voices.
function fixture() {
  const v1 = { blocks: {} };
  const v3 = {
    hero: { title: "How it works" }, chapters: [], entries: {}, recap: [], guideList: [{ id: "about" }], sources: {},
    figures: { contextBars: [[{ pct: 50 }, { pct: 50 }]] },
    guides: { glossary: [], compare: { rows: [] }, build: { ladder: [], recipe: [], patterns: [], flows: [], protocols: [] }, learn: [] },
    kitchen: {
      hero: { line: "A short line.", task: "Find stalls." }, recap: [], chapters: {}, entries: {}, glossary: {},
      compare: { lede: "L", note: "N", rows: {} }, build: { lede: "L", intro: "I", ladder: [] },
      figures: { contextBars: [{ title: "T", caption: "C", segs: ["a", "b"] }] }, ui: { hub: "H" }, map: map()
    },
    tech: {
      hero: { line: "A short line.", task: "Find flights." }, recap: [], chapters: {},
      guides: { compare: { lede: "L" }, build: { lede: "L" }, learn: { lede: "L" } },
      figures: { contextBars: [{ title: "T", caption: "C", segs: ["a", "b"] }] }, ui: { hub: "H" }, map: map()
    }
  };
  CHAPTER_IDS.forEach((cid, i) => {
    const id = "e" + i;
    v1.blocks["b" + i] = {};
    v3.chapters.push({ id: cid, n: i + 1, zone: "model", entries: [id] });
    v3.kitchen.chapters[cid] = { title: "T", problem: "P", lead: "K", text: ["R"], example: "X" };
    v3.tech.chapters[cid] = { title: "T", problem: "P", text: [words(70), words(70)], example: "X" };
    v3.kitchen.entries[id] = { line: "K", how: ["H"], example: "X", forYou: ["F"] };
    v3.entries[id] = {
      chapter: cid, name: "N", label: "L", short: "S", how: ["H"], example: "X", forYou: ["F"],
      deeper: { details: ["D"], includes: [] }, related: [], from: ["b" + i]
    };
    v3.sources[id] = { facts: [], sources: [{ title: "t", by: "b", url: "https://example.com/" + i, year: 2026 }] };
  });
  for (let i = 0; i < 5; i++) {
    v3.recap.push({ entries: ["e0"] });
    v3.kitchen.recap.push({ t: "Idea", d: "Text" });
    v3.tech.recap.push({ t: "Idea", d: "Text" });
  }
  return { v1, v3 };
}
function map() {
  const st = { name: ["a", "b"], sub: "s" };
  return { you: "y", conns: { cA: {}, cB: {}, cC: {}, cD: {} }, loop: { stations: [st, st, st, st, st] } };
}
// A glossary term with a definition in both voices.
function addTerm(v3, term, def, entry) {
  v3.guides.glossary.push({ term, def, entry: entry || "e0" });
  v3.kitchen.glossary[term] = "A picture.";
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
  v3.entries.e0.how = [words(151)];
  assert.ok(check(v1, v3).some((e) => e.includes("entry e0: levels 1 and 2")));
});

test("the core path word budget is enforced for each voice", () => {
  const { v1, v3 } = fixture();
  v3.kitchen.hero.line = words(2500);
  assert.ok(check(v1, v3).some((e) => e.startsWith("core path (kitchen):")));
  const other = fixture();
  other.v3.tech.hero.line = words(3200);
  assert.ok(check(other.v1, other.v3).some((e) => e.startsWith("core path (technical):")));
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

const pad = words;

test("levels 1 and 2 pass at exactly 150 words", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = [pad(147)]; // short, example and forYou add the other 3
  assert.deepEqual(check(v1, v3), []);
});

test("levels 1 and 2 fail at 151 words", () => {
  const { v1, v3 } = fixture();
  v3.entries.e0.how = [pad(148)];
  assert.ok(check(v1, v3).includes("entry e0: levels 1 and 2 have 151 words, limit 150"));
});

test("the kitchen core path passes at exactly 2500 words and fails at 2501", () => {
  const { v1, v3 } = fixture();
  v3.kitchen.hero.line = pad(2445); // with the rest of the fixture the kitchen core path is then exactly 2500
  assert.deepEqual(check(v1, v3), []);
  v3.kitchen.hero.line = pad(2446);
  assert.ok(check(v1, v3).includes("core path (kitchen): 2501 words, limit 2500"));
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
  addTerm(v3, "Agent", "d");
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
  v3.tech.chapters.chef.title = "Zeta chapter";
  const text = prose(v3);
  assert.ok(text.includes("idea"));
  assert.ok(text.includes("zeta chapter"));
  assert.ok(!text.includes("b0"));
});

test("prose counts the compare and build guides but not the glossary or learn list", () => {
  const { v3 } = fixture();
  v3.guides.compare.rows.push({ name: "Alphafoo", entry: "e0", cells: ["Betabar"] });
  v3.guides.build.patterns.push({ id: "gammabaz", name: "Deltaqux", entries: ["e1"], svg: { nodes: [{ t: "Epsilonzed" }] }, alt: "Zetahum" });
  v3.guides.build.protocols.push({ name: "Etapow", url: "https://thetaurl.example", sources: ["https://iotasrc.example"], entry: "e2" });
  v3.guides.build.flows.push({ name: "Kappaflow", route: [{ e: "e3", n: 1 }] });
  v3.guides.glossary.push({ term: "Muterm", def: "Nudefinition", entry: "e0" });
  v3.guides.learn.push({ title: "Xigroup", items: [{ title: "Omicronbook", url: "https://pisrc.example" }] });
  const text = prose(v3);
  ["alphafoo", "betabar", "deltaqux", "zetahum", "etapow", "kappaflow"].forEach((w) => assert.ok(text.includes(w), w));
  ["gammabaz", "epsilonzed", "thetaurl", "iotasrc", "muterm", "nudefinition", "xigroup", "omicronbook", "pisrc"].forEach((w) => assert.ok(!text.includes(w), w));
});

test("a glossary term that appears only in a build pattern name passes", () => {
  const { v1, v3 } = fixture();
  v3.guides.build.patterns.push({ id: "chaining", name: "Prompt chaining", entries: ["e0"] });
  addTerm(v3, "Prompt chaining", "A fixed series of model calls.");
  assert.deepEqual(check(v1, v3), []);
});

test("a glossary term that appears only in its own definition is still reported", () => {
  const { v1, v3 } = fixture();
  v3.guides.glossary.push({ term: "Zorkmid", def: "A Zorkmid is a made-up coin.", entry: "e0" });
  assert.ok(check(v1, v3).includes("glossary Zorkmid: term does not appear on the page"));
});

test("a kitchen text that slips into technical words is reported", () => {
  const { v1, v3 } = fixture();
  v3.kitchen.chapters.chef.text = ["The chef reads the file and the **prompt**."];
  const errors = check(v1, v3);
  assert.ok(errors.some((e) => e.startsWith("kitchen.chapters.chef.text[0]: technical word") && e.includes("file") && !e.includes("prompt")));
});

test("a technical text that uses the kitchen picture is reported", () => {
  const { v1, v3 } = fixture();
  v3.tech.chapters.chef.text = [words(70), words(69) + " chef"];
  v3.entries.e1.short = "Like a cook.";
  const errors = check(v1, v3);
  assert.ok(errors.some((e) => e.startsWith("tech.chapters.chef.text[1]: kitchen word")));
  assert.ok(errors.some((e) => e.startsWith("entries.e1.short: kitchen word")));
});

test("a missing kitchen entry, chapter or glossary definition is reported", () => {
  const { v1, v3 } = fixture();
  delete v3.kitchen.entries.e2;
  delete v3.kitchen.chapters.tools;
  v3.guides.glossary.push({ term: "Words", def: "d", entry: "e0" });
  v3.entries.e0.how = ["Words."];
  const errors = check(v1, v3);
  assert.ok(errors.includes("kitchen.entries.e2: missing"));
  assert.ok(errors.includes("kitchen.chapters.tools: missing"));
  assert.ok(errors.includes("kitchen.glossary[Words]: missing"));
});

test("the technical voice needs enough words and the kitchen voice stays short", () => {
  const { v1, v3 } = fixture();
  v3.tech.chapters.loop.text = [words(40), words(40)];
  v3.kitchen.entries.e3.how = [words(150)];
  const errors = check(v1, v3);
  assert.ok(errors.some((e) => e.startsWith("tech.chapters.loop.text: 80 words in all; the technical voice needs at least")));
  assert.ok(errors.some((e) => e.startsWith("kitchen.entries.e3:") && e.includes("limit 150")));
});
