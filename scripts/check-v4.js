#!/usr/bin/env node
/* Content checks for v4-alpha (and, with the same rules, v5-alpha: scripts/check-v5.js). Run from the repository root: node scripts/check-v4.js
   Exits with code 1 and lists every problem when a check fails. Rules come from
   docs/superpowers/specs/2026-10-11-v4-alpha-design.md (sections 6, 7 and 10), plus the two voices (check-voice.js):
   the kitchen voice may use only the kitchen, the technical voice no picture at all. */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const CHAPTER_IDS = ["chef", "counter", "tools", "loop", "recipes", "locks", "helpers", "kitchen-ops"];
// coreWords: what one reader reads on the guided path in one voice (hero, chapters, recap). The technical voice is longer on purpose.
const LIMITS = { coreWords: { kitchen: 2500, tech: 3200 }, entryWords: 150, entriesPerChapter: 4, entries: 22, guides: 5, facts: 4, glossary: 60, learnPerGroup: 5, recap: 5 };
const V3_FILES = ["data/core.js", "data/entries.js", "data/sources.js", "data/guides.js",
  "data/voice-ui.js", "data/voice-kitchen-a.js", "data/voice-kitchen-b.js", "data/voice-tech.js", "data/voice-guides.js"];
const voice = require("./check-voice.js");

function loadScripts(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
  return ctx.window;
}
function loadV1(root) { return loadScripts([path.join(root, "v1-alpha/assets/js/data.js")]).AE; }
function loadV4(root, dir = "v4-alpha") { return loadScripts(V3_FILES.map((f) => path.join(root, dir, "assets/js", f))).AE3; }

// Inline markup to plain text: [[id|label]] -> label, [[id]] -> id, [t](url) -> t, **b** -> b, `c` -> c.
function plain(text) {
  return String(text || "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\(https?:[^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}
function wordCount(...parts) {
  return parts.flat(Infinity).reduce((n, t) => n + (plain(t).match(/\S+/g) || []).length, 0);
}
function eachString(value, fn, at) {
  if (typeof value === "string") fn(value, at);
  else if (Array.isArray(value)) value.forEach((v, i) => eachString(v, fn, at + "[" + i + "]"));
  else if (value && typeof value === "object") Object.keys(value).forEach((k) => eachString(value[k], fn, at + "." + k));
}

// Keys whose string values are identifiers or metadata, not visible text.
const PROSE_SKIP_KEYS = new Set(["from", "related", "chapter", "entries", "id", "zone", "figure", "n", "entry", "e", "url", "sources", "svg"]);
function collectProse(value, out) {
  if (typeof value === "string") out.push(plain(value).toLowerCase());
  else if (Array.isArray(value)) value.forEach((v) => collectProse(v, out));
  else if (value && typeof value === "object") Object.keys(value).forEach((k) => { if (!PROSE_SKIP_KEYS.has(k)) collectProse(value[k], out); });
}
// Lower-case visible text of the page in the technical voice: chapters, entries, recap and the compare and build
// guides, with identifier fields left out. The glossary (its own definitions) and the learn list do not count as page text.
function prose(v3) {
  const out = [];
  const guides = v3.guides || {};
  collectProse((v3.tech || {}).chapters, out);
  collectProse((v3.tech || {}).recap, out);
  collectProse(v3.entries, out);
  collectProse(guides.compare, out);
  collectProse(guides.build, out);
  return out.join(" \n ");
}
// The word a glossary term stands for: the term without a trailing parenthetical, trimmed, lower-cased.
function headOf(term) {
  return String(term || "").replace(/\s*\(.*\)\s*$/, "").trim().toLowerCase();
}
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
// True when the term's head appears in text as a whole word, optionally in the plural (s or es).
function mentions(text, term) {
  const head = headOf(term);
  if (!head) return false;
  const re = new RegExp("(?<![\\p{L}\\p{N}])" + escapeRegExp(head) + "(?:s|es)?(?![\\p{L}\\p{N}])", "u");
  return re.test(String(text).toLowerCase());
}

function check(v1, v3) {
  const errors = [];
  const err = (msg) => errors.push(msg);
  const entries = v3.entries || {};
  const ids = Object.keys(entries);
  const chapters = v3.chapters || [];
  const has = (id) => Object.prototype.hasOwnProperty.call(entries, id);
  const g = v3.guides || {};

  // 1. Chapters
  const chapterIds = chapters.map((c) => c.id);
  if (chapterIds.join() !== CHAPTER_IDS.join()) err("chapters: expected " + CHAPTER_IDS.join(", ") + ", got " + chapterIds.join(", "));
  chapters.forEach((c, i) => {
    if (c.n !== i + 1) err("chapter " + c.id + ": n should be " + (i + 1));
    if (!c.zone) err("chapter " + c.id + ": missing zone");
    const list = c.entries || [];
    if (list.length > LIMITS.entriesPerChapter) err("chapter " + c.id + ": introduces " + list.length + " entries, limit " + LIMITS.entriesPerChapter);
    list.forEach((id) => { if (!has(id)) err("chapter " + c.id + ": unknown entry " + id); });
  });

  // 2. Entries
  if (ids.length > LIMITS.entries) err("entries: " + ids.length + ", limit " + LIMITS.entries);
  ids.forEach((id) => {
    const e = entries[id];
    if (!e || typeof e !== "object") { err("entry " + id + ": is not an object"); return; }
    const homes = chapters.filter((c) => (c.entries || []).indexOf(id) !== -1);
    if (homes.length !== 1) err("entry " + id + ": listed in " + homes.length + " chapters, expected 1");
    else if (e.chapter !== homes[0].id) err("entry " + id + ": chapter is " + e.chapter + " but listed in " + homes[0].id);
    ["name", "label", "short", "example"].forEach((f) => { if (!e[f]) err("entry " + id + ": missing " + f); });
    if (!Array.isArray(e.how) || !e.how.length) err("entry " + id + ": missing how");
    if (!Array.isArray(e.forYou) || e.forYou.length < 1 || e.forYou.length > 3) err("entry " + id + ": forYou needs 1 to 3 items");
    const d = e.deeper || {};
    if (!Array.isArray(d.details) || !d.details.length) err("entry " + id + ": missing deeper.details");
    if (!Array.isArray(e.from) || !e.from.length) err("entry " + id + ": missing from");
    else if ((d.includes || []).length < e.from.length - 1) err("entry " + id + ": needs an includes line for each merged block");
    const words = wordCount(e.short, e.how, e.example, e.forYou);
    if (words > LIMITS.entryWords) err("entry " + id + ": levels 1 and 2 have " + words + " words, limit " + LIMITS.entryWords);
    (e.related || []).forEach((r) => { if (!has(r)) err("entry " + id + ": unknown related " + r); });
  });

  // 3. Every v1 block maps to exactly one entry
  const owner = {};
  ids.forEach((id) => ((entries[id] || {}).from || []).forEach((b) => { (owner[b] = owner[b] || []).push(id); }));
  Object.keys(v1.blocks).forEach((b) => {
    const o = owner[b] || [];
    if (o.length !== 1) err("v1 block " + b + ": mapped to " + (o.length ? o.join(", ") : "no entry"));
  });
  Object.keys(owner).forEach((b) => { if (!v1.blocks[b]) err("from: unknown v1 block " + b); });

  // 4. References
  eachString(v3, (s, at) => {
    const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    let m;
    while ((m = re.exec(s))) if (!has(m[1])) err(at + ": unknown link [[" + m[1] + "]]");
  }, "AE3");
  (v3.recap || []).forEach((r, i) => (r.entries || []).forEach((id) => { if (!has(id)) err("recap " + (i + 1) + ": unknown entry " + id); }));
  (g.glossary || []).forEach((t) => { if (t && t.entry && !has(t.entry)) err("glossary " + t.term + ": unknown entry " + t.entry); });
  ((g.compare || {}).rows || []).forEach((r) => { if (!has(r.entry)) err("compare " + r.name + ": unknown entry " + r.entry); });
  const b = g.build || {};
  (b.recipe || []).forEach((r) => (r.entries || []).forEach((id) => { if (!has(id)) err("recipe " + r.title + ": unknown entry " + id); }));
  (b.patterns || []).forEach((p) => (p.entries || []).forEach((id) => { if (!has(id)) err("pattern " + p.id + ": unknown entry " + id); }));
  (b.flows || []).forEach((f) => ((f && f.route) || []).forEach((st) => { if (st && !has(st.e)) err("flow " + f.name + ": unknown entry " + st.e); }));
  (b.protocols || []).forEach((p) => { if (p.entry && !has(p.entry)) err("protocol " + p.name + ": unknown entry " + p.entry); });

  // 5. Budgets
  const K = v3.kitchen || {}, T = v3.tech || {};
  const coreOf = (V) => wordCount(v3.hero && v3.hero.title, V.hero && V.hero.line, V.hero && V.hero.task,
    chapterIds.map((id) => { const c = (V.chapters || {})[id] || {}; return [c.title, c.problem, c.lead, c.text, c.example]; }),
    (V.recap || []).map((r) => [r.t, r.d]));
  if (coreOf(K) > LIMITS.coreWords.kitchen) err("core path (kitchen): " + coreOf(K) + " words, limit " + LIMITS.coreWords.kitchen);
  if (coreOf(T) > LIMITS.coreWords.tech) err("core path (technical): " + coreOf(T) + " words, limit " + LIMITS.coreWords.tech);
  if ((v3.recap || []).length !== LIMITS.recap) err("recap: expected " + LIMITS.recap + " items");
  if ((v3.guideList || []).length > LIMITS.guides) err("guides: " + v3.guideList.length + ", limit " + LIMITS.guides);
  if ((g.glossary || []).length > LIMITS.glossary) err("glossary: " + g.glossary.length + " terms, limit " + LIMITS.glossary);
  (g.learn || []).forEach((grp) => {
    if (!grp || !Array.isArray(grp.items)) { err("learn " + ((grp && grp.title) || "(untitled)") + ": missing items"); return; }
    if (grp.items.length > LIMITS.learnPerGroup) err("learn " + grp.title + ": " + grp.items.length + " items, limit " + LIMITS.learnPerGroup);
  });

  // 6. Sources and facts
  const src = v3.sources || {};
  ids.forEach((id) => {
    const s = src[id];
    if (!s) { err("sources: missing " + id); return; }
    if ((s.facts || []).length > LIMITS.facts) err("sources " + id + ": " + s.facts.length + " facts, limit " + LIMITS.facts);
    const seen = new Set();
    (s.sources || []).forEach((l) => {
      ["title", "by", "url", "year"].forEach((f) => { if (!l[f]) err("sources " + id + ": source without " + f + " (" + (l.url || l.title) + ")"); });
      if (seen.has(l.url)) err("sources " + id + ": duplicate " + l.url);
      seen.add(l.url);
    });
  });

  // 7. Glossary terms must appear in the v3 text as whole words
  const body = prose(v3);
  (g.glossary || []).forEach((t) => {
    if (!t || !t.term) { err("glossary entry without term"); return; }
    if (!headOf(t.term)) { err("glossary " + t.term + ": term has no words to look for"); return; }
    if (!mentions(body, t.term)) err("glossary " + t.term + ": term does not appear on the page");
  });

  // 8. The two voices
  voiceChecks(v3, chapterIds, ids, err);

  return errors;
}

function voiceChecks(v3, chapterIds, ids, err) {
  const K = v3.kitchen || {}, T = v3.tech || {}, g = v3.guides || {};
  chapterIds.forEach((id) => {
    if (!(K.chapters || {})[id]) err("kitchen.chapters." + id + ": missing"); else voice.checkKitchenChapter(id, K.chapters[id], err);
    if (!(T.chapters || {})[id]) err("tech.chapters." + id + ": missing"); else voice.checkTechChapter(id, T.chapters[id], err);
  });
  Object.keys(K.chapters || {}).concat(Object.keys(T.chapters || {})).forEach((id) => { if (chapterIds.indexOf(id) === -1) err("voice text for unknown chapter " + id); });
  ids.forEach((id) => {
    if (!(K.entries || {})[id]) err("kitchen.entries." + id + ": missing"); else voice.checkKitchenEntry(id, K.entries[id], err);
    const e = v3.entries[id];
    if (!e || typeof e !== "object") return;
    // The technical fields of an entry are the technical voice: no kitchen picture in them.
    voice.lintTechText({ short: e.short, how: e.how, example: e.example, forYou: e.forYou, deeper: e.deeper }, "entries." + id, err);
  });
  Object.keys(K.entries || {}).forEach((id) => { if (ids.indexOf(id) === -1) err("kitchen.entries." + id + ": unknown entry"); });
  (g.glossary || []).forEach((t) => {
    if (!t || !t.term) return;
    if (!(K.glossary || {})[t.term]) err("kitchen.glossary[" + t.term + "]: missing"); else voice.checkKitchenGlossaryDef(t.term, K.glossary[t.term], err);
    voice.lintTechText({ def: t.def }, "glossary[" + t.term + "]", err);
  });
  // Easily confused: the kitchen voice has a picture and a difference for each row; build: the six rungs.
  const rows = (K.compare || {}).rows || {};
  ((g.compare || {}).rows || []).forEach((r) => {
    if (!rows[r.name]) err("kitchen.compare.rows[" + r.name + "]: missing");
    else voice.lintKitchenText(rows[r.name], "kitchen.compare.rows[" + r.name + "]", err);
  });
  if (!(K.compare && K.compare.lede && K.compare.note)) err("kitchen.compare: needs lede and note"); else voice.lintKitchenText({ lede: K.compare.lede, note: K.compare.note }, "kitchen.compare", err);
  const ladder = (K.build || {}).ladder || [];
  if (ladder.length !== ((g.build || {}).ladder || []).length) err("kitchen.build.ladder: expected " + ((g.build || {}).ladder || []).length + " rungs");
  if (!(K.build && K.build.lede && K.build.intro)) err("kitchen.build: needs lede and intro"); else voice.lintKitchenText(K.build, "kitchen.build", err);
  ["compare", "build", "learn"].forEach((id) => { if (!((T.guides || {})[id] || {}).lede) err("tech.guides." + id + ": missing lede"); });
  voice.lintTechText({ guides: T.guides, compare: g.compare, ladder: (g.build || {}).ladder, recipe: (g.build || {}).recipe, patterns: (g.build || {}).patterns, flows: (g.build || {}).flows }, "tech", err);
  // The small texts of both voices.
  [["kitchen", K], ["tech", T]].forEach(([name, V]) => {
    const lint = name === "kitchen" ? voice.lintKitchenText : voice.lintTechText;
    if (!V.hero || !V.hero.line || !V.hero.task) err(name + ".hero: needs line and task");
    if (!Array.isArray(V.recap) || V.recap.length !== LIMITS.recap) err(name + ".recap: expected " + LIMITS.recap + " items");
    ["ui", "map", "figures", "hero", "recap"].forEach((f) => { if (V[f]) lint(V[f], name + "." + f, err); });
    const fig = (V.figures || {}).contextBars || [], want = (v3.figures || {}).contextBars || [];
    want.forEach((segs, i) => { if (!fig[i] || (fig[i].segs || []).length !== segs.length) err(name + ".figures.contextBars[" + i + "]: needs " + segs.length + " labels"); });
    const m = V.map || {};
    if (!m.loop || !Array.isArray(m.loop.stations) || m.loop.stations.length !== 5) err(name + ".map.loop: needs 5 stations");
    ["cA", "cB", "cC", "cD"].forEach((c) => { if (!(m.conns || {})[c]) err(name + ".map.conns." + c + ": missing"); });
  });
}

// The whole check for one version folder: the content, then the generated term and guide pages. Returns the problems.
function run(root, dir = "v4-alpha", pagesModule = "./build-v4-pages.js", pagesCommand = "node scripts/build-v4-pages.js") {
  let errors = [];
  let v1, v3;
  try { v1 = loadV1(root); v3 = loadV4(root, dir); } catch (e) { errors = ["could not load data: " + e.message]; }
  if (!errors.length) {
    try { errors = check(v1, v3); } catch (e) { errors = ["checker crashed: " + e.message]; }
  }
  // The term and guide pages are generated from index.html and the data (the build script of the version).
  if (!errors.length) {
    try { errors = require(pagesModule).stale(root); } catch (e) { errors = ["page check crashed: " + e.message]; }
    if (errors.length) errors.push("run: " + pagesCommand);
  }
  return errors;
}

function main(dir, pagesModule, pagesCommand) {
  const errors = run(path.resolve(__dirname, ".."), dir, pagesModule, pagesCommand);
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log(dir + " content checks passed.");
}

module.exports = { V3_FILES, CHAPTER_IDS, LIMITS, plain, wordCount, prose, mentions, check, loadV1, loadV4, run, main };

if (require.main === module) main("v4-alpha", "./build-v4-pages.js", "node scripts/build-v4-pages.js");
