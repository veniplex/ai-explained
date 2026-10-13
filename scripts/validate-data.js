#!/usr/bin/env node
/* Checks the content in <version>/assets/js/data.js for broken references and missing fields.
   Usage: node scripts/validate-data.js [version-folder ...]   (default: every folder of versions/ that has a data.js, v0.1-alpha etc.)
   Exits 1 if any error is found; warnings never fail the run. */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var REQUIRED = ["name", "label", "short", "eli5", "what", "when", "avoid", "sota", "examples", "related"];
var STATIONS = ["assemble", "model", "check", "run", "result", "exit"];
var SOURCE_TYPES = null; // filled from the data: every type seen at least twice is treated as known

function load(file) {
  var sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  if (!sandbox.window.AE) throw new Error("data.js did not define window.AE");
  return sandbox.window.AE;
}

function isUrl(s) { return typeof s === "string" && /^https:\/\/[^\s]+$/.test(s); }
function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + "T00:00:00Z")); }

function validate(file) {
  var errors = [], warnings = [];
  var err = function (where, msg) { errors.push(where + ": " + msg); };
  var warn = function (where, msg) { warnings.push(where + ": " + msg); };

  var D;
  try { D = load(file); } catch (e) { return { errors: ["load: " + e.message], warnings: [] }; }

  var BLOCKS = D.blocks || {}, ZONES = {}, CONNS = {};
  (D.zones || []).forEach(function (z) { ZONES[z.id] = z; });
  (D.connectors || []).forEach(function (c) { CONNS[c.id] = c; });
  var hasBlock = function (id) { return Object.prototype.hasOwnProperty.call(BLOCKS, id); };

  // meta
  if (!D.meta || !isDate(D.meta.updated)) err("meta.updated", "missing or not a YYYY-MM-DD date");

  // zones: every listed block exists, and every block sits in exactly one zone
  var placed = {};
  (D.zones || []).forEach(function (z) {
    var ids = z.groups ? z.groups.reduce(function (a, g) { return a.concat(g.blocks || []); }, []) : (z.blocks || []);
    ["name", "nick", "eli5", "tag"].forEach(function (f) { if (!z[f]) err("zone " + z.id, "missing " + f); });
    ids.forEach(function (id) {
      if (!hasBlock(id)) err("zone " + z.id, "unknown block '" + id + "'");
      if (placed[id]) err("zone " + z.id, "block '" + id + "' is also in zone " + placed[id]);
      placed[id] = z.id;
    });
  });
  Object.keys(BLOCKS).forEach(function (id) { if (!placed[id]) err("block " + id, "not placed in any zone"); });

  // connectors
  (D.connectors || []).forEach(function (c) {
    ["from", "to"].forEach(function (f) { if (!ZONES[c[f]]) err("connector " + c.id, f + " is not a zone: '" + c[f] + "'"); });
    if (!c.text || !c.eli5) err("connector " + c.id, "missing text or eli5");
  });

  // blocks: required fields
  Object.keys(BLOCKS).forEach(function (id) {
    var b = BLOCKS[id];
    REQUIRED.forEach(function (f) {
      var v = b[f];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) err("block " + id, "missing " + f);
    });
    if (!(b.links || []).length) warn("block " + id, "has no SOURCES entry");
  });

  // steps
  (D.steps || []).forEach(function (st, i) {
    var where = "step " + (i + 1);
    if (!st.title || !st.text) err(where, "missing title or text");
    if (st.station && STATIONS.indexOf(st.station) === -1) err(where, "unknown station '" + st.station + "'");
  });

  // sources (attached to blocks as .links) and facts
  var typeCount = {};
  Object.keys(BLOCKS).forEach(function (id) { (BLOCKS[id].links || []).forEach(function (l) { typeCount[l.type] = (typeCount[l.type] || 0) + 1; }); });
  SOURCE_TYPES = Object.keys(typeCount).filter(function (t) { return typeCount[t] > 1; });
  Object.keys(BLOCKS).forEach(function (id) {
    var seen = {};
    (BLOCKS[id].links || []).forEach(function (l, i) {
      var where = "SOURCES." + id + "[" + i + "]";
      if (!l.title) err(where, "missing title");
      if (!isUrl(l.url)) err(where, "url is not an https URL: " + l.url);
      if (l.type && SOURCE_TYPES.indexOf(l.type) === -1) warn(where, "unusual type '" + l.type + "' (typo?)");
      if (l.year && (l.year < 1940 || l.year > new Date().getFullYear() + 1)) warn(where, "odd year " + l.year);
      if (seen[l.url]) warn(where, "duplicate url in this block");
      seen[l.url] = true;
    });
    (BLOCKS[id].facts || []).forEach(function (f, i) {
      var where = "FACTS." + id + "[" + i + "]";
      if (!f.text) err(where, "missing text");
      if (!isUrl(f.source)) err(where, "source is not an https URL: " + f.source);
    });
  });

  // Generic walk: id references by key name, and inline markup in every string
  function walk(node, where, key) {
    if (typeof node === "string") {
      var re = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, m;
      while ((m = re.exec(node))) if (!hasBlock(m[1])) err(where, "[[" + m[1] + "]] is not a block id");
      var lm = /\[([^\]]+)\]\(([^)]*)\)/g;
      while ((m = lm.exec(node))) {
        if (m[0].indexOf("[[") === 0) continue;
        if (!/^https?:[^)\s]+$/.test(m[2])) err(where, "malformed link '" + m[0] + "' (needs an http(s) URL without spaces)");
        else if (!/^https:/.test(m[2])) warn(where, "plain http link " + m[2]);
      }
      if ((node.match(/\*\*/g) || []).length % 2) warn(where, "unbalanced ** bold markers");
      if ((node.match(/`/g) || []).length % 2) warn(where, "unbalanced ` code markers");
      return;
    }
    if (Array.isArray(node)) { node.forEach(function (x, i) { walk(x, where + "[" + i + "]", key); }); return; }
    if (!node || typeof node !== "object") return;
    Object.keys(node).forEach(function (k) {
      var v = node[k], here = where ? where + "." + k : k;
      var refBlocks = (k === "block" || k === "related" || (k === "blocks" && where !== ""));
      if (refBlocks && (typeof v === "string" || Array.isArray(v))) {
        [].concat(v).forEach(function (id) { if (typeof id === "string" && !hasBlock(id)) err(here, "unknown block '" + id + "'"); });
      }
      if (k === "conn" && Array.isArray(v)) v.forEach(function (id) { if (!CONNS[id]) err(here, "unknown connector '" + id + "'"); });
      walk(v, here, k);
    });
  }
  walk(D, "", null);

  return { errors: errors, warnings: warnings };
}

// The older versions live in versions/; a folder can be named with or without that prefix (v0.1-alpha or versions/v0.1-alpha).
function versions() {
  return fs.readdirSync(path.join(ROOT, "versions")).filter(function (d) {
    return /^v\d/.test(d) && fs.existsSync(path.join(ROOT, "versions", d, "assets/js/data.js"));
  }).map(function (d) { return "versions/" + d; });
}

var targets = process.argv.slice(2).filter(function (a) { return a[0] !== "-"; });
var quiet = process.argv.indexOf("--quiet") !== -1;
if (!targets.length) targets = versions();

var failed = false;
targets.forEach(function (v) {
  var dir = fs.existsSync(path.join(ROOT, v)) ? v : path.join("versions", v);
  var file = path.isAbsolute(v) && /\.js$/.test(v) ? v : path.join(ROOT, dir, "assets/js/data.js");
  var r = validate(file);
  var label = path.relative(ROOT, file).replace(/\\/g, "/");
  if (r.errors.length) failed = true;
  if (r.errors.length || !quiet) {
    console.log(label + ": " + r.errors.length + " error(s), " + r.warnings.length + " warning(s)");
    r.errors.forEach(function (e) { console.log("  ERROR " + e); });
    if (!quiet) r.warnings.forEach(function (w) { console.log("  warn  " + w); });
  }
});
process.exit(failed ? 1 : 0);
