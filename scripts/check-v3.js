#!/usr/bin/env node
/* Content checks for v0.3-alpha. Run from the repository root: node scripts/check-v3.js
   Exits with code 1 and lists every problem when a check fails. Rules come from
   docs/superpowers/specs/2026-10-11-v0.3-alpha-design.md (sections 6, 7 and 10). */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const CHAPTER_IDS = ["chef", "counter", "tools", "loop", "recipes", "locks", "helpers", "kitchen-ops"];
const LIMITS = { coreWords: 2500, entryWords: 150, entriesPerChapter: 4, entries: 22, guides: 5, facts: 4, glossary: 60, learnPerGroup: 5, recap: 5 };
const V3_FILES = ["data/core.js", "data/entries.js", "data/sources.js", "data/guides.js"];

function loadScripts(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
  return ctx.window;
}
function loadV1(root) { return loadScripts([path.join(root, "versions/v0.1-alpha/assets/js/data.js")]).AE; }
function loadV3(root) { return loadScripts(V3_FILES.map((f) => path.join(root, "versions/v0.3-alpha/assets/js", f))).AE3; }

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
// Lower-case visible text of the page: chapters, entries, recap and the compare and build guides, with
// identifier fields left out. The glossary (its own definitions) and the learn list do not count as page text.
function prose(v3) {
  const out = [];
  const guides = v3.guides || {};
  collectProse(v3.chapters, out);
  collectProse(v3.entries, out);
  collectProse(v3.recap, out);
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
    ["title", "problem", "kitchen", "example"].forEach((f) => { if (!c[f]) err("chapter " + c.id + ": missing " + f); });
    if (!Array.isArray(c.real) || !c.real.length) err("chapter " + c.id + ": missing real");
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
    ["name", "label", "kitchen", "short", "example"].forEach((f) => { if (!e[f]) err("entry " + id + ": missing " + f); });
    if (!Array.isArray(e.how) || !e.how.length) err("entry " + id + ": missing how");
    if (!Array.isArray(e.forYou) || e.forYou.length < 1 || e.forYou.length > 3) err("entry " + id + ": forYou needs 1 to 3 items");
    const d = e.deeper || {};
    if (!Array.isArray(d.details) || !d.details.length) err("entry " + id + ": missing deeper.details");
    if (!Array.isArray(e.from) || !e.from.length) err("entry " + id + ": missing from");
    else if ((d.includes || []).length < e.from.length - 1) err("entry " + id + ": needs an includes line for each merged block");
    const words = wordCount(e.kitchen, e.short, e.how, e.example, e.forYou);
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
  const core = wordCount(v3.hero && v3.hero.title, v3.hero && v3.hero.line, v3.example && v3.example.task,
    chapters.map((c) => [c.title, c.problem, c.kitchen, c.real, c.example]),
    (v3.recap || []).map((r) => [r.t, r.d]));
  if (core > LIMITS.coreWords) err("core path: " + core + " words, limit " + LIMITS.coreWords);
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

  return errors;
}

module.exports = { CHAPTER_IDS, LIMITS, plain, wordCount, prose, mentions, check, loadV1, loadV3 };

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  let errors = [];
  let v1, v3;
  try { v1 = loadV1(root); v3 = loadV3(root); } catch (e) { errors = ["could not load data: " + e.message]; }
  if (!errors.length) {
    try { errors = check(v1, v3); } catch (e) { errors = ["checker crashed: " + e.message]; }
  }
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log("v0.3-alpha content checks passed.");
}
