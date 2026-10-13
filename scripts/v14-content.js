#!/usr/bin/env node
/* Content checks for what v0.14-alpha adds to the content of v13: the glossary (assets/js/data/glossary.js and voice-glossary-kitchen.js) and the long
   guides (voice-guides-long-tech-a.js, -b.js and voice-guides-long-kitchen-a.js, -b.js). Used by check-v14.js; from the command line it lints the data files while
   they are being written:
     node scripts/v14-content.js
   Run from the repository root. */
"use strict";
const path = require("node:path");
const voice = require("./check-voice.js");

const DIR = "versions/v0.14-alpha";
// The drawings of assets/js/icons.js, by name. icons.js must draw every one of them (check-v14.js verifies).
const ICONS = ["net", "book", "books", "lock", "key", "shield", "search", "link", "plug", "wrench", "gear", "loop", "clock", "calendar", "scales", "flask", "bars",
  "gauge", "coin", "team", "tree", "fork", "merge", "pencil", "note", "doc", "folder", "db", "cloud", "chip", "stack", "funnel", "target", "flag", "bell", "eye",
  "mask", "bug", "warning", "bubble", "cursor", "terminal", "window", "puzzle", "spark", "thermo", "dice", "squeeze", "hourglass", "camera", "mic", "ruler",
  "checklist", "gavel", "globe", "rocket", "hand", "box", "ladder", "graph", "tag"];
const CATS = ["models", "prompting", "tools", "agents", "knowledge", "safety", "teams", "ops", "uses"];
// Guides that are long articles (the others are a table, the build guide and a reading list, which have their own views).
const ARTICLES = ["how-it-works", "context", "secure", "evaluate"];
const LIMITS = {
  def: 60, moreParas: 3, morePara: 90, kitchenSentence: 45, kitchenMore: 70,
  techWords: [1100, 3200], kitchenWords: [300, 1100], sections: [4, 9], expect: [3, 5], minutes: [4, 25]
};

const words = voice.words;
const flat = (v) => voice.wordsOf(v);
const ids = (A) => new Set(Object.keys(A.entries || {}).concat((A.glossary || []).map((g) => g.id)));

function linksIn(value, at, known, err) {
  const walk = (v, p) => {
    if (typeof v === "string") {
      const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
      let m;
      while ((m = re.exec(v))) if (!known.has(m[1])) err(p + ": unknown link [[" + m[1] + "]]");
      const bare = voice.plainText(v);
      if (/\[\[|\]\]/.test(bare)) err(p + ": broken [[link]] markup");
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + "[" + i + "]"));
    else if (v && typeof v === "object") Object.keys(v).forEach((k) => walk(v[k], p + "." + k));
  };
  walk(value, at);
}

function checkGlossary(A) {
  const errors = [], err = (m) => errors.push(m), K = (A.kitchen || {}).glossary || {};
  const cats = new Set((A.glossaryCats || []).map((c) => c.id)), known = ids(A), seen = new Set(), terms = new Set();
  CATS.forEach((c) => { if (!cats.has(c)) err("glossaryCats: missing " + c); });
  Object.keys(A.entries || {}).forEach((id) => { if (!ICONS.includes((A.glossaryIcons || {})[id])) err("glossaryIcons." + id + ": needs one of the icons"); });
  (A.glossary || []).forEach((g) => {
    const at = "glossary[" + (g && g.id) + "]";
    if (!g || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.id || "")) { err(at + ": id must be lower-case words joined by hyphens"); return; }
    if (seen.has(g.id)) err(at + ": duplicate id");
    seen.add(g.id);
    if ((A.entries || {})[g.id]) err(at + ": the id belongs to a main term (the glossary lists the other terms)");
    if (!g.term || typeof g.term !== "string") err(at + ": missing term");
    else { const t = g.term.toLowerCase(); if (terms.has(t)) err(at + ": duplicate term " + g.term); terms.add(t); }
    if (!cats.has(g.cat)) err(at + ": cat " + g.cat + " is not a group");
    if (!ICONS.includes(g.icon)) err(at + ": icon " + g.icon + " is not one of the drawn icons");
    if (g.entry !== undefined && !(A.entries || {})[g.entry]) err(at + ": unknown entry " + g.entry);
    (g.related || []).forEach((r) => { if (!known.has(r)) err(at + ": unknown related " + r); else if (r === g.id) err(at + ": relates to itself"); });
    (g.aka || []).forEach((a) => { if (typeof a !== "string" || !a) err(at + ": aka must be non-empty strings"); });
    if (!g.def || typeof g.def !== "string") err(at + ": missing def");
    else if (words(voice.plainText(g.def)) > LIMITS.def) err(at + ".def: " + words(voice.plainText(g.def)) + " words, limit " + LIMITS.def);
    const more = g.more || [];
    if (more.length > LIMITS.moreParas) err(at + ".more: at most " + LIMITS.moreParas + " paragraphs");
    more.forEach((p, i) => { if (words(voice.plainText(p)) > LIMITS.morePara) err(at + ".more[" + i + "]: " + words(voice.plainText(p)) + " words, limit " + LIMITS.morePara); });
    voice.lintTechText({ term: g.term, aka: g.aka, def: g.def, more: g.more }, at, err);
    linksIn({ def: g.def, more: g.more }, at, known, err);
    const k = K[g.id];
    if (typeof k !== "string" || !k) err("kitchen.glossary[" + g.id + "]: missing");
    else {
      if (words(voice.plainText(k)) > LIMITS.kitchenSentence) err("kitchen.glossary[" + g.id + "]: " + words(voice.plainText(k)) + " words, limit " + LIMITS.kitchenSentence);
      voice.lintKitchenText(k, "kitchen.glossary[" + g.id + "]", err);
      linksIn(k, "kitchen.glossary[" + g.id + "]", known, err);
    }
    const km = ((A.kitchen || {}).glossaryMore || {})[g.id];
    if (km !== undefined) {
      if (!Array.isArray(km) || km.length > LIMITS.moreParas) err("kitchen.glossaryMore[" + g.id + "]: an array of up to " + LIMITS.moreParas + " paragraphs");
      else km.forEach((p, i) => { if (words(voice.plainText(p)) > LIMITS.kitchenMore) err("kitchen.glossaryMore[" + g.id + "][" + i + "]: " + words(voice.plainText(p)) + " words, limit " + LIMITS.kitchenMore); });
      voice.lintKitchenText(km, "kitchen.glossaryMore[" + g.id + "]", err);
    }
  });
  Object.keys(K).forEach((id) => { if (!seen.has(id)) err("kitchen.glossary[" + id + "]: no such glossary term"); });
  Object.keys((A.kitchen || {}).glossaryMore || {}).forEach((id) => { if (!seen.has(id)) err("kitchen.glossaryMore[" + id + "]: no such glossary term"); });
  return errors;
}

// One section of a long guide: id, title, text (1 to 4 paragraphs), and optionally list, steps, code, callout, table, example, ch.
function checkSection(s, at, tech, known, err) {
  if (!s || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id || "")) err(at + ": section id must be lower-case words joined by hyphens");
  if (!s || !s.title) { err(at + ": missing title"); return; }
  if (!Array.isArray(s.text) || s.text.length < 1 || s.text.length > 5) err(at + ": text needs 1 to 5 paragraphs");
  (s.text || []).forEach((p, i) => { if (words(voice.plainText(p)) > 170) err(at + ".text[" + i + "]: " + words(voice.plainText(p)) + " words, limit 170"); });
  if (s.list !== undefined && (!Array.isArray(s.list) || !s.list.length)) err(at + ".list: a non-empty array");
  if (s.steps !== undefined && (!Array.isArray(s.steps) || s.steps.some((x) => !x || !x.t || !x.d))) err(at + ".steps: an array of { t, d }");
  if (s.callout !== undefined && (!s.callout || !s.callout.t || !s.callout.d)) err(at + ".callout: { t, d }");
  if (s.table !== undefined) {
    const t = s.table;
    if (!t || !Array.isArray(t.head) || !Array.isArray(t.rows) || t.rows.some((r) => !Array.isArray(r) || r.length !== t.head.length)) err(at + ".table: { head: [...], rows: [[...]] } with as many cells as heads");
  }
  if (s.code !== undefined) {
    if (!tech) err(at + ".code: only the technical guides have code");
    else if (!s.code || !s.code.text || !s.code.label) err(at + ".code: { label, text }");
  }
  if (s.example !== undefined) {
    if (typeof s.example !== "string" || !s.example) err(at + ".example: a text");
    if (!Number.isInteger(s.ch) || s.ch < 1 || s.ch > 8) err(at + ": a section with an example needs ch, the number (1 to 8) of the story chapter that explains it");
  } else if (s.ch !== undefined && (!Number.isInteger(s.ch) || s.ch < 1 || s.ch > 8)) err(at + ".ch: a chapter number, 1 to 8");
  const lint = tech ? voice.lintTechText : voice.lintKitchenText;
  const body = Object.assign({}, s, { id: undefined, code: tech && s.code ? { label: s.code.label } : undefined });
  lint(body, at, err);
  linksIn(body, at, known, err);
}

function checkLongGuides(A) {
  const errors = [], err = (m) => errors.push(m), known = ids(A);
  const T = (A.tech || {}).longGuides || {}, K = (A.kitchen || {}).longGuides || {}, list = (A.guideList || []).map((g) => g.id);
  ARTICLES.forEach((id) => { if (!list.includes(id)) err("guideList: missing the guide " + id); });
  [[T, true, "tech"], [K, false, "kitchen"]].forEach(([set, tech, name]) => {
    Object.keys(set).forEach((id) => { if (!ARTICLES.includes(id)) err(name + ".longGuides." + id + ": not a long guide"); });
    ARTICLES.forEach((id) => {
      const g = set[id], at = name + ".longGuides." + id;
      if (!g) { err(at + ": missing"); return; }
      if (!g.lede || typeof g.lede !== "string") err(at + ": missing lede");
      if (!Array.isArray(g.expect) || g.expect.length < LIMITS.expect[0] || g.expect.length > LIMITS.expect[1]) err(at + ".expect: " + LIMITS.expect.join(" to ") + " short lines on what the reader will know afterwards");
      if (!Number.isInteger(g.minutes) || g.minutes < LIMITS.minutes[0] || g.minutes > LIMITS.minutes[1]) err(at + ".minutes: a whole number of minutes, " + LIMITS.minutes.join(" to "));
      if (!Array.isArray(g.sections) || g.sections.length < LIMITS.sections[0] || g.sections.length > LIMITS.sections[1]) { err(at + ".sections: " + LIMITS.sections.join(" to ") + " sections"); return; }
      const seen = new Set();
      g.sections.forEach((s, i) => { checkSection(s, at + ".sections[" + i + "]", tech, known, err); if (s && seen.has(s.id)) err(at + ": duplicate section id " + s.id); if (s) seen.add(s.id); });
      (g.terms || []).forEach((t) => { if (!known.has(t)) err(at + ".terms: unknown id " + t); });
      if (!Array.isArray(g.terms) || g.terms.length < 4) err(at + ".terms: the ids of at least four terms of the glossary used in the guide");
      const lint = tech ? voice.lintTechText : voice.lintKitchenText;
      lint({ lede: g.lede, expect: g.expect }, at, err);
      linksIn({ lede: g.lede, expect: g.expect }, at, known, err);
      const n = flat([g.lede, g.expect, g.sections.map((s) => [s.text, s.list, (s.steps || []).map((x) => [x.t, x.d]), s.callout && [s.callout.t, s.callout.d], s.example, s.table && [s.table.head, s.table.rows]])]);
      const lim = tech ? LIMITS.techWords : LIMITS.kitchenWords;
      if (n < lim[0] || n > lim[1]) err(at + ": " + n + " words, expected " + lim[0] + " to " + lim[1]);
    });
  });
  return errors;
}

function load(root) {
  const fs = require("node:fs"), p = path.join(root, DIR, "assets/js/data");
  const files = ["core.js", "entries.js", "sources.js", "guides.js", "glossary.js", "voice-kitchen-a.js", "voice-kitchen-b.js", "voice-tech.js", "voice-guides-kitchen.js",
    "voice-guides-tech.js", "voice-glossary-kitchen.js", "voice-guides-long-tech-a.js", "voice-guides-long-tech-b.js", "voice-guides-long-kitchen-a.js", "voice-guides-long-kitchen-b.js"].map((f) => path.join(p, f)).filter((f) => fs.existsSync(f));
  return voice.loadScripts(files);
}

function check(root) { const A = load(root); return checkGlossary(A).concat(checkLongGuides(A)); }

module.exports = { ICONS, CATS, ARTICLES, LIMITS, checkGlossary, checkLongGuides, check, load };

if (require.main === module) {
  const errors = check(path.resolve(__dirname, ".."));
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log("v14 glossary and long guides: ok");
}
