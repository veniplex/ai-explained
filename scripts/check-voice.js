#!/usr/bin/env node
/* Checks for the two voices of v0.4-alpha: the kitchen voice (AE3.kitchen) and the technical voice (AE3.tech, plus the
   technical fields of AE3.entries). The kitchen voice may not slip into technical words, the technical voice may not
   use the kitchen picture. check-v4.js runs the full check; from the command line this lints single files while writing:
     node scripts/check-voice.js v0.4-alpha/assets/js/data/voice-kitchen-a.js [more files…]
   It loads the base data, then the files given, and reports problems for what those files define. */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const L = "(?<![\\p{L}\\p{N}-])", R = "(?![\\p{L}\\p{N}-])";
// Words that belong to the technical world. In the kitchen voice they are allowed only as a bold bridge, a link label or code.
const KITCHEN_BAN = new RegExp(L + "(flights?|lisbon|spreadsheets?|travel(?:l?ing|l?ed)?|documents?|files?|apps?|software|servers?|apis?|databases?|code|emails?|web|websites?|internet|computers?|programs?|tokens?|json|url|data|users?|chats?|chatbots?|prompts?)" + R, "giu");
// Words that belong to the kitchen picture. The technical voice has no picture.
const TECH_BAN = new RegExp(L + "(chef|kitchen|cook(?:s|ed|ing)?|dish(?:es)?|pantry|cupboards?|oven|knife|knives|banquet|brigade|counters?|recipes?)" + R, "giu");

const BUDGET = {
  kChapter: { title: 6, problem: 28, lead: 60, textEach: 90, textTotal: 190, example: 80 },
  tChapter: { title: 8, problem: 28, textEach: 110, textMin: 130, textTotal: 320, example: 90 },
  kEntry: { total: 150, line: 35 },
  kGlossary: 32
};

function words(t) { return (String(t || "").match(/\S+/g) || []).length; }
function wordsOf(...parts) { return parts.flat(Infinity).reduce((n, t) => n + words(t), 0); }
// Remove what is allowed to be technical in the kitchen voice: bold bridges, link labels, links and code.
function withoutBridges(text) {
  return String(text || "")
    .replace(/\*\*[^*]+\*\*/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[\[[^\]]+\]\]/g, " ")
    .replace(/\[[^\]]+\]\(https?:[^)\s]+\)/g, " ");
}
function plainText(text) {
  return String(text || "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\[([^\]]+)\]\(https?:[^)\s]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
function banned(re, text) { const m = String(text || "").match(re); return m ? Array.from(new Set(m.map((x) => x.toLowerCase()))) : []; }

// Strings of one object, with the path of each, skipping identifier-like keys.
function strings(value, at, out) {
  if (typeof value === "string") out.push([at, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, at + "[" + i + "]", out));
  else if (value && typeof value === "object") Object.keys(value).forEach((k) => strings(value[k], at + "." + k, out));
  return out;
}

function lintKitchenText(value, at, err) {
  strings(value, at, []).forEach(([where, s]) => {
    const hits = banned(KITCHEN_BAN, withoutBridges(s));
    if (hits.length) err(where + ": technical word(s) outside a bold bridge: " + hits.join(", "));
    if (/—|–/.test(s)) err(where + ": no dashes; use a full stop or a comma");
    if (/!/.test(s)) err(where + ": no exclamation marks");
  });
}
function lintTechText(value, at, err) {
  strings(value, at, []).forEach(([where, s]) => {
    const hits = banned(TECH_BAN, plainText(s));
    if (hits.length) err(where + ": kitchen word(s) in the technical voice: " + hits.join(", "));
    if (/—/.test(s)) err(where + ": no em-dashes");
    if (/!/.test(s)) err(where + ": no exclamation marks");
  });
}

function checkKitchenChapter(id, c, err) {
  const at = "kitchen.chapters." + id, B = BUDGET.kChapter;
  // The kitchen `problem` is optional: v0.6-alpha shows one shared problem line (the technical one) above both voices.
  ["title", "lead", "example"].concat(c && c.problem !== undefined ? ["problem"] : []).forEach((f) => { if (!c || !c[f] || typeof c[f] !== "string") err(at + ": missing " + f); });
  if (!c || !Array.isArray(c.text) || c.text.length < 1 || c.text.length > 3) { err(at + ": text needs 1 to 3 paragraphs"); return; }
  if (words(c.title) > B.title) err(at + ".title: " + words(c.title) + " words, limit " + B.title);
  if (c.problem !== undefined && words(c.problem) > B.problem) err(at + ".problem: " + words(c.problem) + " words, limit " + B.problem);
  if (words(c.lead) > B.lead) err(at + ".lead: " + words(c.lead) + " words, limit " + B.lead);
  c.text.forEach((p, i) => { if (words(p) > B.textEach) err(at + ".text[" + i + "]: " + words(p) + " words, limit " + B.textEach); });
  if (wordsOf(c.text) > B.textTotal) err(at + ".text: " + wordsOf(c.text) + " words in all, limit " + B.textTotal);
  if (words(c.example) > B.example) err(at + ".example: " + words(c.example) + " words, limit " + B.example);
  lintKitchenText(c, at, err);
}
function checkTechChapter(id, c, err) {
  const at = "tech.chapters." + id, B = BUDGET.tChapter;
  ["title", "problem", "example"].forEach((f) => { if (!c || !c[f] || typeof c[f] !== "string") err(at + ": missing " + f); });
  if (!c || !Array.isArray(c.text) || c.text.length < 2 || c.text.length > 4) { err(at + ": text needs 2 to 4 paragraphs"); return; }
  if (words(c.title) > B.title) err(at + ".title: " + words(c.title) + " words, limit " + B.title);
  if (words(c.problem) > B.problem) err(at + ".problem: " + words(c.problem) + " words, limit " + B.problem);
  c.text.forEach((p, i) => { if (words(p) > B.textEach) err(at + ".text[" + i + "]: " + words(p) + " words, limit " + B.textEach); });
  const total = wordsOf(c.text);
  if (total > B.textTotal) err(at + ".text: " + total + " words in all, limit " + B.textTotal);
  if (total < B.textMin) err(at + ".text: " + total + " words in all; the technical voice needs at least " + B.textMin);
  if (words(c.example) > B.example) err(at + ".example: " + words(c.example) + " words, limit " + B.example);
  lintTechText(c, at, err);
}
function checkKitchenEntry(id, e, err) {
  const at = "kitchen.entries." + id;
  ["line", "example"].forEach((f) => { if (!e || !e[f] || typeof e[f] !== "string") err(at + ": missing " + f); });
  if (!e || !Array.isArray(e.how) || e.how.length < 1 || e.how.length > 2) { err(at + ": how needs 1 or 2 paragraphs"); return; }
  if (!Array.isArray(e.forYou) || e.forYou.length < 1 || e.forYou.length > 3) { err(at + ": forYou needs 1 to 3 items"); return; }
  const n = wordsOf(e.line, e.how, e.example, e.forYou);
  if (n > BUDGET.kEntry.total) err(at + ": " + n + " words, limit " + BUDGET.kEntry.total);
  if (words(e.line) > BUDGET.kEntry.line) err(at + ".line: " + words(e.line) + " words, limit " + BUDGET.kEntry.line);
  lintKitchenText(e, at, err);
}
function checkKitchenGlossaryDef(term, def, err) {
  const at = "kitchen.glossary[" + term + "]";
  if (typeof def !== "string" || !def) { err(at + ": missing"); return; }
  if (words(def) > BUDGET.kGlossary) err(at + ": " + words(def) + " words, limit " + BUDGET.kGlossary);
  lintKitchenText(def, at, err);
}

function loadScripts(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
  return ctx.window.AE3;
}

// What the given files define, checked. `data` is the AE3 object after loading them.
function lintDefined(data) {
  const errors = [], err = (m) => errors.push(m);
  const K = data.kitchen || {}, T = data.tech || {};
  Object.keys(K.chapters || {}).forEach((id) => checkKitchenChapter(id, K.chapters[id], err));
  Object.keys(K.entries || {}).forEach((id) => {
    if (!data.entries || !data.entries[id]) err("kitchen.entries." + id + ": unknown entry");
    else checkKitchenEntry(id, K.entries[id], err);
  });
  Object.keys(K.glossary || {}).forEach((term) => {
    if (!((data.guides && data.guides.glossary) || []).some((g) => g.term === term)) err("kitchen.glossary[" + term + "]: no such glossary term");
    checkKitchenGlossaryDef(term, K.glossary[term], err);
  });
  Object.keys(T.chapters || {}).forEach((id) => checkTechChapter(id, T.chapters[id], err));
  return errors;
}

module.exports = { KITCHEN_BAN, TECH_BAN, BUDGET, words, wordsOf, withoutBridges, plainText, banned, lintKitchenText, lintTechText,
  checkKitchenChapter, checkTechChapter, checkKitchenEntry, checkKitchenGlossaryDef, loadScripts, lintDefined };

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  const given = process.argv.slice(2).map((f) => path.resolve(f));
  if (!given.length) { console.error("usage: node scripts/check-voice.js <voice file…>"); process.exit(2); }
  // The shared data (core, entries, sources, guides) sits next to the voice files, in v0.4-alpha or v0.5-alpha.
  const dataDir = path.dirname(given[0]);
  const base = ["core.js", "entries.js", "sources.js", "guides.js"].map((f) => path.join(dataDir, f));
  let data, own;
  try {
    data = loadScripts(base);
    own = loadScripts(given); // only what the given files define
  } catch (e) { console.error("could not load: " + e.message); process.exit(1); }
  const only = { entries: data.entries, guides: data.guides, kitchen: own.kitchen, tech: own.tech };
  const errors = lintDefined(only);
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  const K = own.kitchen || {}, T = own.tech || {};
  console.log("ok: " + Object.keys(K.chapters || {}).length + " kitchen chapters, " + Object.keys(K.entries || {}).length + " kitchen entries, " +
    Object.keys(K.glossary || {}).length + " kitchen glossary terms, " + Object.keys(T.chapters || {}).length + " technical chapters");
}
