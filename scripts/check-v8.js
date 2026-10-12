#!/usr/bin/env node
/* Content checks for v8-alpha, the comic strip: the chapters and their panels (format, drawings that exist),
   the kitchen voice of every caption, bubble and title (the same banned words as v4 to v6), the strips with the real names
   (every term is a v6 term, every term of v6 is named), and no request to anywhere outside the folder.
   Run from the repository root: node scripts/check-v8.js */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { KITCHEN_BAN, banned, withoutBridges, words } = require("./check-voice.js");

const DIR = "v8-alpha";
const ZONES = ["start", "model", "harness", "control", "know", "tools", "orch", "ops"];
const BGS = ["kitchen", "market", "night", "plain"];
const KINDS = ["say", "think", "sign", "shout", "sfx"];
const TAILS = ["bl", "br", "tl", "tr", "l", "r"];
const FROMS = ["tl", "tr", "bl", "br"];
const LIMITS = { cap: 40, bubble: 24, lead: 40, title: 8, alt: 45, def: 36, panels: [4, 6], names: [1, 21] };

// The page files and the drawings, loaded as the browser does, without a document.
function load(root) {
  const base = path.join(root, DIR, "assets/js");
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  const files = ["draw.js", "props.js"];
  fs.readdirSync(path.join(base, "data")).filter((f) => /^props-(extra-.*|cover)\.js$/.test(f)).sort().forEach((f) => files.push("data/" + f));
  fs.readdirSync(path.join(base, "data")).filter((f) => /^page-\d+\.js$/.test(f)).sort().forEach((f) => files.push("data/" + f));
  files.forEach((f) => vm.runInContext("with (window) {" + fs.readFileSync(path.join(base, f), "utf8") + "\n}", sandbox, { filename: f }));
  const C = sandbox.window.COMIC;
  return { C, pages: (C.pages || []).slice().sort((a, b) => a.n - b.n) };
}
// The terms of v6 (their ids), read from its entries file.
function v6Terms(root) {
  const src = fs.readFileSync(path.join(root, "v6-alpha/assets/js/data/entries.js"), "utf8");
  return Array.from(src.matchAll(/^  "?([a-z-]+)"?: \{\n    chapter:/gm)).map((m) => m[1]);
}

function lint(text, at, err, loud) {
  if (typeof text !== "string" || !text.trim()) { err(at + ": missing text"); return; }
  const hits = banned(KITCHEN_BAN, withoutBridges(text));
  if (hits.length) err(at + ": technical word(s) outside a bold bridge: " + hits.join(", "));
  if (/—|–| - /.test(text)) err(at + ": no dashes; use a full stop or a comma");
  if (!loud && /!/.test(text)) err(at + ": no exclamation marks (only in shout and sfx)");
}

function check(root) {
  const errors = [], err = (m) => errors.push(m);
  let D;
  try { D = load(root); } catch (e) { return ["could not load " + DIR + ": " + e.message]; }
  const { C, pages } = D, terms = v6Terms(root), named = new Set();
  if (pages.length !== 10) err("expected 10 pages (a cover, eight chapters and the end), found " + pages.length);
  pages.forEach((pg, i) => {
    const at = "page " + pg.n + " (" + pg.id + ")";
    if (pg.n !== i) err(at + ": pages must be numbered 0, 1, 2 … without gaps");
    const hash = i === 0 ? "" : i === pages.length - 1 ? "ch-e" : "ch-" + i;
    if (pg.hash !== hash) err(at + ": hash must be " + JSON.stringify(hash));
    if (!ZONES.includes(pg.zone)) err(at + ": zone " + pg.zone);
    lint(pg.title, at + ".title", err); if (words(pg.title) > LIMITS.title) err(at + ".title: too long");
    lint(pg.lead, at + ".lead", err); if (words(pg.lead) > LIMITS.lead) err(at + ".lead: " + words(pg.lead) + " words, limit " + LIMITS.lead);
    if (!Array.isArray(pg.panels) || pg.panels.length < LIMITS.panels[0] || pg.panels.length > LIMITS.panels[1] + 1) { err(at + ": needs " + LIMITS.panels.join(" to ") + " panels"); return; }
    pg.panels.forEach((p, j) => {
      const pa = at + ".panels[" + j + "]";
      if (!["s", "w"].includes(p.size)) err(pa + ": size must be s or w");
      if (p.zone && !ZONES.includes(p.zone)) err(pa + ": zone " + p.zone);
      if (p.bg && !BGS.includes(p.bg)) err(pa + ": bg " + p.bg);
      lint(p.cap, pa + ".cap", err); if (words(p.cap) > LIMITS.cap) err(pa + ".cap: " + words(p.cap) + " words, limit " + LIMITS.cap);
      if (typeof p.alt !== "string" || !p.alt.trim()) err(pa + ": needs alt text for screen readers");
      else if (words(p.alt) > LIMITS.alt) err(pa + ".alt: too long");
      if (!Array.isArray(p.scene) || !p.scene.length) err(pa + ": needs a scene");
      (p.scene || []).forEach((it, k) => {
        const where = pa + ".scene[" + k + "]";
        if (!Array.isArray(it) || typeof it[0] !== "string" || typeof it[1] !== "number" || typeof it[2] !== "number") { err(where + ": must be [name, x, y, options]"); return; }
        const fn = C.props[it[0]];
        if (!fn) { err(where + ": no drawing called " + it[0]); return; }
        const w = p.size === "w" ? 820 : 400;
        if (it[1] < -40 || it[1] > w + 40 || it[2] < -40 || it[2] > 340) err(where + ": " + it[0] + " is outside the panel");
        const o = it[3] || {};
        if (o.fx && !(Array.isArray(o.fx) && o.fx.length === 2)) err(where + ": fx must be [dx, dy]");
        try {
          const shapes = fn(o);
          if (!Array.isArray(shapes) || !shapes.length) err(where + ": " + it[0] + " drew nothing");
          (function walk(s) {
            if (Array.isArray(s)) return s.forEach(walk);
            if (!s || !s.t) return err(where + ": " + it[0] + " returned something that is not a shape");
            const f = [s.o && s.o.f, s.o && s.o.k].filter(Boolean);
            f.forEach((t) => { if (!C.FILLS[t]) err(where + ": unknown colour token " + t); });
            if (s.kids) walk(s.kids);
          })(shapes);
        } catch (e) { err(where + ": " + it[0] + " failed to draw: " + e.message); }
      });
      (p.say || []).forEach((s, k) => {
        const sa = pa + ".say[" + k + "]", kind = s.k || "say";
        // A thought cloud may be empty (a blank mind): its text is spaces.
        if (!(kind === "think" && typeof s.t === "string" && s.t.length && !s.t.trim())) lint(s.t, sa, err, kind === "shout" || kind === "sfx");
        if (words(s.t) > LIMITS.bubble) err(sa + ": " + words(s.t) + " words, limit " + LIMITS.bubble);
        if (!KINDS.includes(kind)) err(sa + ": kind " + kind);
        if (s.tail && !TAILS.includes(s.tail)) err(sa + ": tail " + s.tail);
        if (s.from && !FROMS.includes(s.from)) err(sa + ": from " + s.from);
        if (!Array.isArray(s.at) || s.at.some((n) => typeof n !== "number" || n < 0 || n > 100)) err(sa + ": at must be [x, y] in percent");
      });
    });
    if (pg.names) {
      if (!Array.isArray(pg.names) || pg.names.length < LIMITS.names[0] || pg.names.length > LIMITS.names[1]) err(at + ".names: " + LIMITS.names.join(" to ") + " entries");
      (pg.names || []).forEach((n, k) => {
        const na = at + ".names[" + k + "]";
        if (!n.kw || !n.term || !n.def) err(na + ": needs kw, term and def");
        if (n.id && !terms.includes(n.id)) err(na + ": " + n.id + " is not a v6 term");
        if (n.def && words(n.def) > LIMITS.def) err(na + ".def: " + words(n.def) + " words, limit " + LIMITS.def);
        if (n.id && i !== pages.length - 1) named.add(n.id);
      });
    }
  });
  const last = pages[pages.length - 1];
  if (last && last.names) {
    const ids = last.names.map((n) => n.id);
    terms.forEach((t) => { if (!ids.includes(t)) err("the last page's index is missing the term " + t); });
  }
  terms.forEach((t) => { if (!named.has(t)) err("the term " + t + " is not named on any chapter page"); });

  // Nothing is requested from outside the folder: no http(s) URL in scripts or styles, and no @import.
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === "vendor" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
  walk(path.join(root, DIR, "assets")).filter((f) => /\.(js|css)$/.test(f)).forEach((f) => {
    const src = fs.readFileSync(f, "utf8").replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "");
    if (/https?:\/\//.test(src) || /@import/.test(src)) err(path.relative(root, f) + ": must not load or name anything outside the folder");
  });
  return errors;
}

function main() {
  const errors = check(path.resolve(__dirname, ".."));
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log(DIR + " content checks passed.");
}

module.exports = { check, load, v6Terms, DIR };
if (require.main === module) main();
