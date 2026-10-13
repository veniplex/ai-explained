#!/usr/bin/env node
/* Content checks for v9-alpha, the kitchen that builds itself: the chapters and the steps (every step names things, people and
   poses that exist, coordinates lie in the room), the kitchen voice of every caption and bubble in the story (the same banned words
   as v4 to v8), the technical captions of the last chapter (no kitchen words), the names laid over the kitchen (every term is a
   v6 term, every term of v6 is named, outlines lie in the room), and no request to anywhere outside the folder.
   Run from the repository root: node scripts/check-v9.js */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { KITCHEN_BAN, TECH_BAN, banned, withoutBridges, plainText, words } = require("./check-voice.js");

const DIR = "versions/v9-alpha";
const ZONES = ["start", "model", "harness", "control", "know", "tools", "orch", "ops"];
const LAYERS = ["wall", "furn", "top", "floor", "people", "front"];
const KINDS = ["say", "think", "sign", "shout", "sfx"];
const TAILS = ["bl", "br", "tl", "tr", "l", "r"];
const MOODS = ["calm", "happy", "think", "oops", "sleepy", "worried", "proud", "taste"];
const ARMS = ["down", "out", "up", "cheer", "hold", "point", "pointl", "shrug", "give", "hips", "think"];
const PEOPLE = ["chef", "owner", "person"];
const LIMITS = { cap: 40, bubble: 24, title: 8, def: 36, steps: [40, 80], names: [1, 21] };

// The drawings, the kitchen, the story and the names, loaded as the browser does, without a document.
function load(root, dir = DIR) {
  const base = path.join(root, dir, "assets/js");
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  const files = ["draw.js", "props.js"];
  const data = fs.readdirSync(path.join(base, "data"));
  data.filter((f) => /^props-.*\.js$/.test(f)).sort().forEach((f) => files.push("data/" + f));
  ["kitchen.js", "story.js", "names.js"].forEach((f) => files.push("data/" + f));
  files.forEach((f) => vm.runInContext("with (window) {" + fs.readFileSync(path.join(base, f), "utf8") + "\n}", sandbox, { filename: f }));
  return sandbox.window.COMIC;
}
// The terms of v6 (their ids), read from its entries file.
function v6Terms(root, dir = "versions/v6-alpha") {
  const src = fs.readFileSync(path.join(root, dir, "assets/js/data/entries.js"), "utf8");
  return Array.from(src.matchAll(/^  "?([a-z-]+)"?: \{\n    chapter:/gm)).map((m) => m[1]);
}

function lintKitchen(text, at, err, loud) {
  if (typeof text !== "string" || !text.trim()) { err(at + ": missing text"); return; }
  const hits = banned(KITCHEN_BAN, withoutBridges(text));
  if (hits.length) err(at + ": technical word(s) outside a bold bridge: " + hits.join(", "));
  if (/—|–| - /.test(text)) err(at + ": no dashes; use a full stop or a comma");
  if (!loud && /!/.test(text)) err(at + ": no exclamation marks (only in shout and sfx)");
}
function lintTech(text, at, err) {
  if (typeof text !== "string" || !text.trim()) { err(at + ": missing text"); return; }
  const hits = banned(TECH_BAN, plainText(text));
  if (hits.length) err(at + ": kitchen word(s) in a technical text: " + hits.join(", "));
  if (/—|–| - /.test(text)) err(at + ": no dashes; use a full stop or a comma");
}

// opts.dir: the version folder to check (default v9-alpha); opts.terms: the version whose terms every name must be one of
// (default v6-alpha); opts.scan: false to skip the look for requests to outside the folder (v10-alpha has its own, because its
// deep dive holds the links of its sources).
function check(root, opts) {
  opts = opts || {};
  const dir = opts.dir || DIR, errors = [], err = (m) => errors.push(m);
  let C;
  try { C = load(root, dir); } catch (e) { return ["could not load " + dir + ": " + e.message]; }
  const K = C.kitchen, steps = C.steps || [], chapters = C.chapters || [], names = C.names || [], terms = v6Terms(root, opts.terms || "versions/v6-alpha");
  if (!K || !Array.isArray(K.actors)) return ["kitchen.js must define COMIC.kitchen with a list of actors"];
  const inRoom = (p, pad) => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === "number") && p[0] >= -pad && p[0] <= K.w + pad && p[1] >= -pad && p[1] <= K.h + pad;

  // The things of the kitchen.
  const actors = {};
  K.actors.forEach((a) => {
    const at = "actor " + a.id;
    if (!a.id || actors[a.id]) err(at + ": ids must be unique");
    actors[a.id] = a;
    if (!LAYERS.includes(a.layer)) err(at + ": layer " + a.layer);
    if (!inRoom([a.x, a.y], 300)) err(at + ": x, y are outside the room");
    const fn = C.props[a.prop];
    if (!fn) { err(at + ": no drawing called " + a.prop); return; }
    try {
      const shapes = fn(Object.assign({ pts: [[0, 0], [10, 10]] }, a.o || {}));
      if (!Array.isArray(shapes) || !shapes.length) err(at + ": " + a.prop + " drew nothing");
      (function walk(s) {
        if (Array.isArray(s)) return s.forEach(walk);
        if (!s || !s.t) return err(at + ": " + a.prop + " returned something that is not a shape");
        [s.o && s.o.f, s.o && s.o.k].filter(Boolean).forEach((t) => { if (!C.FILLS[t]) err(at + ": unknown colour token " + t); });
        if (s.kids) walk(s.kids);
      })(shapes);
    } catch (e) { err(at + ": " + a.prop + " failed to draw: " + e.message); }
  });

  // The chapters.
  if (chapters.length !== 11) err("expected 11 chapters (the start, eight chapters, the end and the names), found " + chapters.length);
  chapters.forEach((c, i) => {
    const at = "chapter " + c.n + " (" + c.id + ")";
    if (c.n !== i) err(at + ": chapters must be numbered 0, 1, 2 … without gaps");
    const hash = i === 0 ? "" : i === 9 ? "ch-e" : i === 10 ? "map" : "ch-" + i;
    if (c.hash !== hash) err(at + ": hash must be " + JSON.stringify(hash));
    if (!ZONES.includes(c.zone)) err(at + ": zone " + c.zone);
    if (i < 10) { lintKitchen(c.title, at + ".title", err); if (words(c.title) > LIMITS.title) err(at + ".title: too long"); }
    else lintTech(c.title, at + ".title", err);
  });

  // The steps.
  if (steps.length < LIMITS.steps[0] || steps.length > LIMITS.steps[1]) err("expected " + LIMITS.steps.join(" to ") + " steps, found " + steps.length);
  const ids = new Set(), seen = new Set(), shownAt = {};
  let lastCh = -1, mapSteps = 0;
  steps.forEach((s, i) => {
    const at = "step " + i + " (" + s.id + ")";
    if (!s.id || ids.has(s.id)) err(at + ": ids must be unique");
    ids.add(s.id);
    if (typeof s.ch !== "number" || s.ch < lastCh || s.ch > 10) err(at + ": ch must be 0 to 10 and never go back");
    if (s.ch !== lastCh) { seen.add(s.ch); lastCh = s.ch; }
    const isMap = s.map !== undefined;
    if (isMap !== (s.ch === 10)) err(at + ": only the steps of chapter 10 have a map, and all of them do");
    if (isMap) {
      mapSteps++;
      if (s.map !== "all" && !(Number.isInteger(s.map) && s.map >= 1 && s.map <= 8)) err(at + ": map must be \"all\" or a chapter from 1 to 8");
      lintTech(s.cap, at + ".cap", err);
    } else lintKitchen(s.cap, at + ".cap", err);
    if (words(s.cap) > LIMITS.cap) err(at + ".cap: " + words(s.cap) + " words, limit " + LIMITS.cap);
    ["show", "hide"].forEach((k) => (s[k] || []).forEach((id) => {
      if (!actors[id]) err(at + "." + k + ": no thing called " + id);
      else if (k === "show" && shownAt[id] === undefined) shownAt[id] = i;
    }));
    Object.keys(s.go || {}).forEach((id) => {
      if (!actors[id]) err(at + ".go: no thing called " + id);
      else if (!inRoom(s.go[id], 300)) err(at + ".go." + id + ": must be [x, y] in the room");
    });
    Object.keys(s.pose || {}).forEach((id) => {
      const a = actors[id], key = s.pose[id];
      if (!a) return err(at + ".pose: no thing called " + id);
      if (a.poseDefs) { if (!a.poseDefs[key]) err(at + ".pose." + id + ": " + key + " is not one of its poses"); return; }
      const m = /^([a-z]+)\/([a-z]+)$/.exec(key);
      if (!PEOPLE.includes(a.prop) || !m || !MOODS.includes(m[1]) || !ARMS.includes(m[2])) err(at + ".pose." + id + ": " + key + " must be mood/arms of a person");
    });
    if (s.cam && !inRoom(s.cam, 0)) err(at + ".cam: must be [x, y] in the room");
    if (s.night !== undefined && typeof s.night !== "boolean") err(at + ".night: true or false");
    (s.say || []).forEach((b, k) => {
      const sa = at + ".say[" + k + "]", kind = b.k || "say";
      if (!(kind === "think" && typeof b.t === "string" && b.t.length && !b.t.trim())) lintKitchen(b.t, sa, err, kind === "shout" || kind === "sfx");
      if (words(b.t) > LIMITS.bubble) err(sa + ": " + words(b.t) + " words, limit " + LIMITS.bubble);
      if (!KINDS.includes(kind)) err(sa + ": kind " + kind);
      if (b.tail && !TAILS.includes(b.tail)) err(sa + ": tail " + b.tail);
      if (!inRoom(b.at, 0)) err(sa + ": at must be [x, y] in the room");
    });
  });
  for (let n = 0; n <= 10; n++) if (!seen.has(n)) err("no step belongs to chapter " + n);
  if (mapSteps !== 9) err("expected 9 map steps (all names, then chapters 1 to 8), found " + mapSteps);
  if (steps[0] && steps[0].map !== undefined) err("the story cannot start on the map");
  K.actors.forEach((a) => { if (shownAt[a.id] === undefined && !(a.o && a.o.always)) err("actor " + a.id + " is never shown by any step"); });

  // The names laid over the kitchen.
  if (names.length < LIMITS.names[0] || names.length > LIMITS.names[1]) err("names: " + LIMITS.names.join(" to ") + " entries");
  const named = new Set();
  names.forEach((n, k) => {
    const na = "name " + n.id;
    if (!terms.includes(n.id)) err(na + ": not a term of " + (opts.terms || "versions/v6-alpha"));
    if (named.has(n.id)) err(na + ": named twice");
    named.add(n.id);
    if (!ZONES.includes(n.zone)) err(na + ": zone " + n.zone);
    if (!Number.isInteger(n.ch) || n.ch < 1 || n.ch > 8) err(na + ": ch must be 1 to 8");
    if (!n.short || !n.term || !n.kw || !n.def) err(na + ": needs short, term, kw and def");
    if (n.def) { lintTech(n.def, na + ".def", err); if (words(n.def) > LIMITS.def) err(na + ".def: " + words(n.def) + " words, limit " + LIMITS.def); }
    if (!inRoom(n.lab, 0)) err(na + ".lab: must be [x, y] in the room");
    const boxes = n.boxes || (n.box ? [n.box] : []);
    if (!boxes.length) err(na + ": needs box or boxes");
    boxes.forEach((b) => {
      if (!Array.isArray(b) || b.length !== 4 || b.some((v) => typeof v !== "number") || b[0] < 0 || b[1] < K.y0 || b[0] + b[2] > K.w || b[1] + b[3] > K.h || b[2] <= 0 || b[3] <= 0) err(na + ": box " + JSON.stringify(b) + " must be [x, y, w, h] inside the room");
    });
    if (n.fill !== undefined && !(n.fill >= 0 && n.fill <= 1)) err(na + ".fill: 0 to 1");
    if (k === 0 && n.id !== "harness") err("the first name must be the harness (the biggest outline, which the others lie on)");
  });
  terms.forEach((t) => { if (!named.has(t)) err("the term " + t + " is not named over the kitchen"); });

  // Nothing is requested from outside the folder: no http(s) URL in scripts or styles, and no @import.
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === "vendor" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
  if (opts.scan !== false) walk(path.join(root, dir, "assets")).filter((f) => /\.(js|css)$/.test(f)).forEach((f) => {
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
