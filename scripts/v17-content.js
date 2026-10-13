#!/usr/bin/env node
/* Content checks for the glossary of v0.17-alpha (assets/js/data/glossary.js, glossary-refs.js and voice-glossary-kitchen.js) and the long guides
   (voice-guides-long-tech-a.js, -b.js, -c.js). Used by check-v17.js; from the command line it lints the data files while
   they are being written:
     node scripts/v17-content.js
   Run from the repository root. */
"use strict";
const path = require("node:path");
const voice = require("./check-voice.js");

const DIR = "versions/v0.17-alpha";
// The drawings of assets/js/icons.js, by name. icons.js must draw every one of them (check-v17.js verifies).
const ICONS = ["net", "book", "books", "lock", "key", "shield", "search", "link", "plug", "wrench", "gear", "loop", "clock", "calendar", "scales", "flask", "bars",
  "gauge", "coin", "team", "tree", "fork", "merge", "pencil", "note", "doc", "folder", "db", "cloud", "chip", "stack", "funnel", "target", "flag", "bell", "eye",
  "mask", "bug", "warning", "bubble", "cursor", "terminal", "window", "puzzle", "spark", "thermo", "dice", "squeeze", "hourglass", "camera", "mic", "ruler",
  "checklist", "gavel", "globe", "rocket", "hand", "box", "ladder", "graph", "tag"];
const CATS = ["models", "prompting", "tools", "agents", "knowledge", "safety", "teams", "ops", "uses"];
// All seven guides are articles with one layout. A section can carry a view (a table, the ladder, ...) or a reading list (a group of guides.learn).
const ARTICLES = ["how-it-works", "context", "build", "secure", "evaluate", "compare", "learn"];
const VIEWS = ["compare-table", "ladder", "recipe", "patterns", "flows", "protocols", "checklist"];
const LIMITS = {
  def: 60, moreParas: 3, morePara: 90, kitchenSentence: 45,
  techWords: [1500, 5200], sections: [5, 10], expect: [3, 5], minutes: [4, 25], short: [8, 45], sources: [6, 30], terms: 6, links: 8
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
    if (!(A.entries || {})[g.entry]) err(at + ": entry must be the main term whose spot in the kitchen it sits at (got " + g.entry + ")");
    (g.related || []).forEach((r) => { if (!known.has(r)) err(at + ": unknown related " + r); else if (r === g.id) err(at + ": relates to itself"); });
    (g.aka || []).forEach((a) => { if (typeof a !== "string" || !a) err(at + ": aka must be non-empty strings"); });
    if (!g.def || typeof g.def !== "string") err(at + ": missing def");
    else if (words(voice.plainText(g.def)) > LIMITS.def) err(at + ".def: " + words(voice.plainText(g.def)) + " words, limit " + LIMITS.def);
    const more = g.more || [];
    if (!more.length) err(at + ".more: every term has a detailed technical description");
    if (more.length > LIMITS.moreParas) err(at + ".more: at most " + LIMITS.moreParas + " paragraphs");
    more.forEach((p, i) => { if (words(voice.plainText(p)) > LIMITS.morePara) err(at + ".more[" + i + "]: " + words(voice.plainText(p)) + " words, limit " + LIMITS.morePara); });
    voice.lintTechText({ term: g.term, aka: g.aka, def: g.def, more: g.more }, at, err);
    linksIn({ def: g.def, more: g.more }, at, known, err);
    const refs = (A.glossaryRefs || {})[g.id];
    if (!Array.isArray(refs) || refs.length < 2 || refs.length > 4) err("glossaryRefs[" + g.id + "]: two to four references");
    else {
      const urls = new Set();
      refs.forEach((r, i) => {
        ["type", "title", "by", "url", "year"].forEach((f) => { if (!r[f]) err("glossaryRefs[" + g.id + "][" + i + "]: missing " + f); });
        if (!/^https:\/\//.test(r.url || "")) err("glossaryRefs[" + g.id + "][" + i + "]: the address must be https");
        if (urls.has(r.url)) err("glossaryRefs[" + g.id + "]: duplicate " + r.url);
        urls.add(r.url);
      });
    }
  });
  // Where each term sits in the kitchen: one kitchen sentence for the 21 main terms and for every other term.
  Object.keys(A.entries || {}).concat((A.glossary || []).map((g) => g.id)).forEach((id) => {
    const k = K[id], at = "kitchen.glossary[" + id + "]";
    if (typeof k !== "string" || !k) { err(at + ": missing"); return; }
    if (words(voice.plainText(k)) > LIMITS.kitchenSentence) err(at + ": " + words(voice.plainText(k)) + " words, limit " + LIMITS.kitchenSentence);
    voice.lintKitchenText(k, at, err);
    linksIn(k, at, known, err);
  });
  Object.keys(K).forEach((id) => { if (!seen.has(id) && !(A.entries || {})[id]) err("kitchen.glossary[" + id + "]: no such term"); });
  Object.keys(A.glossaryRefs || {}).forEach((id) => { if (!seen.has(id)) err("glossaryRefs[" + id + "]: no such glossary term"); });
  return errors;
}

// One section of a guide: id, title, short (the "In short" line), text (1 to 5 paragraphs), src (the numbers of the sources it rests on), and optionally list,
// steps, code, callout, table, example, view (a piece of the build guide or the table of easily confused things) or reading (a group of the reading list).
function checkSection(s, at, tech, known, err, A, nsrc) {
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
  }
  if (s.ch !== undefined) err(at + ".ch: the guides no longer lead to the story; remove it");
  if (typeof s.short !== "string" || !s.short) err(at + ".short: one plain sentence or two that say what the part is about, for a reader who is new to it");
  else if (words(voice.plainText(s.short)) < LIMITS.short[0] || words(voice.plainText(s.short)) > LIMITS.short[1]) err(at + ".short: " + words(voice.plainText(s.short)) + " words, " + LIMITS.short.join(" to "));
  if (!Array.isArray(s.src) || !s.src.length || s.src.some((n) => !Number.isInteger(n) || n < 1 || n > nsrc)) err(at + ".src: the numbers (1 to " + nsrc + ") of the sources it rests on, at least one");
  if (s.view !== undefined && !VIEWS.includes(s.view)) err(at + ".view: one of " + VIEWS.join(", "));
  if (s.reading !== undefined && !((A.guides || {}).learn || []).some((x) => x.title === s.reading)) err(at + ".reading: no group of the reading list is called " + s.reading);
  const lint = voice.lintTechText;
  const body = Object.assign({}, s, { id: undefined, src: undefined, view: undefined, reading: undefined, code: tech && s.code ? { label: s.code.label } : undefined });
  lint(body, at, err);
  linksIn(body, at, known, err);
}

// The pool of sources a guide can name by address: the sources of the terms, the references of the glossary and the reading list.
function sourcePool(A) {
  const pool = {}, add = (l) => { if (l && l.url && !pool[l.url]) pool[l.url] = l; };
  Object.keys(A.sources || {}).forEach((k) => (A.sources[k].sources || []).forEach(add));
  Object.keys(A.glossaryRefs || {}).forEach((k) => A.glossaryRefs[k].forEach(add));
  ((A.guides || {}).learn || []).forEach((g) => g.items.forEach(add));
  return pool;
}

function checkLongGuides(A) {
  const errors = [], err = (m) => errors.push(m), known = ids(A), pool = sourcePool(A);
  const T = (A.tech || {}).longGuides || {}, list = (A.guideList || []).map((g) => g.id);
  ARTICLES.forEach((id) => { if (!list.includes(id)) err("guideList: missing the guide " + id); });
  [[T, true, "tech"]].forEach(([set, tech, name]) => {
    Object.keys(set).forEach((id) => { if (!ARTICLES.includes(id)) err(name + ".longGuides." + id + ": not a guide"); });
    ARTICLES.forEach((id) => {
      const g = set[id], at = name + ".longGuides." + id;
      if (!g) { err(at + ": missing"); return; }
      if (!g.lede || typeof g.lede !== "string") err(at + ": missing lede");
      if (!g.audience || typeof g.audience !== "string") err(at + ".audience: one or two sentences on who the guide is for and what they need to know already (usually nothing)");
      if (!Array.isArray(g.expect) || g.expect.length < LIMITS.expect[0] || g.expect.length > LIMITS.expect[1]) err(at + ".expect: " + LIMITS.expect.join(" to ") + " short lines on what the reader will know afterwards");
      if (!Number.isInteger(g.minutes) || g.minutes < LIMITS.minutes[0] || g.minutes > LIMITS.minutes[1]) err(at + ".minutes: a whole number of minutes, " + LIMITS.minutes.join(" to "));
      const nsrc = Array.isArray(g.sources) ? g.sources.length : 0;
      if (nsrc < LIMITS.sources[0] || nsrc > LIMITS.sources[1]) err(at + ".sources: " + LIMITS.sources.join(" to ") + " sources (web addresses from the pool of the terms and the glossary, or full entries)");
      const urls = new Set();
      (g.sources || []).forEach((x, i) => {
        const url = typeof x === "string" ? x : x && x.url;
        if (typeof x !== "string") ["type", "title", "by", "url", "year"].forEach((f) => { if (!x || !x[f]) err(at + ".sources[" + i + "]: a full entry needs " + f); });
        else if (!pool[x]) err(at + ".sources[" + i + "]: " + x + " is not in the pool of sources; give a full entry { type, title, by, url, year }");
        if (!/^https:\/\//.test(url || "")) err(at + ".sources[" + i + "]: the address must be https");
        if (urls.has(url)) err(at + ".sources[" + i + "]: duplicate " + url);
        urls.add(url);
      });
      if (!Array.isArray(g.sections) || g.sections.length < LIMITS.sections[0] || g.sections.length > LIMITS.sections[1]) { err(at + ".sections: " + LIMITS.sections.join(" to ") + " sections"); return; }
      const seen = new Set(), cited = new Set();
      g.sections.forEach((s, i) => {
        checkSection(s, at + ".sections[" + i + "]", tech, known, err, A, nsrc);
        if (s && seen.has(s.id)) err(at + ": duplicate section id " + s.id);
        if (s) { seen.add(s.id); (s.src || []).forEach((n) => cited.add(n)); }
      });
      for (let n = 1; n <= nsrc; n++) if (!cited.has(n)) err(at + ".sources[" + (n - 1) + "]: no section cites it (src); a source that nothing rests on is removed");
      // Every address named in the text is one of the sources.
      const text = JSON.stringify([g.lede, g.audience, g.expect, g.sections]);
      for (const m of text.matchAll(/\]\((https?:[^)\s"\\]+)\)/g)) if (!urls.has(m[1])) err(at + ": the text links to " + m[1] + ", which is not in sources");
      (g.terms || []).forEach((t) => { if (!known.has(t)) err(at + ".terms: unknown id " + t); });
      if (!Array.isArray(g.terms) || g.terms.length < LIMITS.terms) err(at + ".terms: the ids of at least " + LIMITS.terms + " terms of the glossary used in the guide");
      const nlinks = (text.match(/\[\[[^\]]+\]\]/g) || []).length;
      if (nlinks < LIMITS.links) err(at + ": " + nlinks + " [[links]] to the glossary, at least " + LIMITS.links + " (name a term as [[id]] or [[id|words]] where it is explained)");
      voice.lintTechText({ lede: g.lede, audience: g.audience, expect: g.expect }, at, err);
      linksIn({ lede: g.lede, audience: g.audience, expect: g.expect }, at, known, err);
      const n = flat([g.lede, g.audience, g.expect, g.sections.map((s) => [s.short, s.text, s.list, (s.steps || []).map((x) => [x.t, x.d]), s.callout && [s.callout.t, s.callout.d], s.example, s.table && [s.table.head, s.table.rows]])]);
      const lim = LIMITS.techWords;
      if (n < lim[0] || n > lim[1]) err(at + ": " + n + " words, expected " + lim[0] + " to " + lim[1]);
    });
  });
  return errors;
}

function load(root) {
  const fs = require("node:fs"), p = path.join(root, DIR, "assets/js/data");
  const files = ["core.js", "entries.js", "sources.js", "guides.js", "glossary.js", "glossary-refs.js", "voice-ui-tech.js", "voice-tech.js", 
    "voice-glossary-kitchen.js", "voice-guides-long-tech-a.js", "voice-guides-long-tech-b.js", "voice-guides-long-tech-c.js", "voice-guides-long-tech-d.js"].map((f) => path.join(p, f)).filter((f) => fs.existsSync(f));
  return voice.loadScripts(files);
}

function check(root) { const A = load(root); return checkGlossary(A).concat(checkLongGuides(A)); }

module.exports = { ICONS, CATS, ARTICLES, VIEWS, LIMITS, sourcePool, checkGlossary, checkLongGuides, check, load };

if (require.main === module) {
  const errors = check(path.resolve(__dirname, ".."));
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log("v17 glossary and long guides: ok");
}
