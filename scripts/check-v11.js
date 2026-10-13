#!/usr/bin/env node
/* Content checks for v0.11-alpha: the kitchen story and the deep dive in one version.
   - the story: the rules of v0.9-alpha (check-v9.js: steps, things, voice of every caption, names over the kitchen);
   - the deep dive: the rules of v0.4-alpha (check-v4.js: both voices, word budgets, links, term and guide pages);
   - the bridge between them: every name of the kitchen is a term with a page and sits in the chapter the deep dive puts it in, every
     bold word of a caption leads to a term (data/bridges.js), and the page of every term can draw its place in the kitchen;
   - nothing is requested from outside the folder.
   Run from the repository root: node scripts/check-v11.js */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const v9 = require("./check-v9.js");
const v4 = require("./check-v4.js");

const DIR = "versions/v0.11-alpha";

// The bridges of the kitchen story, loaded as the browser does.
function loadBridges(root) {
  const sandbox = { window: { COMIC: {} } };
  require("node:vm").runInNewContext(fs.readFileSync(path.join(root, DIR, "assets/js/data/bridges.js"), "utf8"), sandbox);
  return sandbox.window.COMIC.bridges;
}

function bridgeChecks(root) {
  const errors = [], err = (m) => errors.push(m);
  const C = v9.load(root, DIR), D = v4.loadV4(root, DIR), bridges = loadBridges(root);
  const chapterOf = {};
  D.chapters.forEach((c) => c.entries.forEach((id) => { chapterOf[id] = c.n; }));

  // Names: a term with a page, in the chapter of the deep dive.
  C.names.forEach((n) => {
    if (!D.entries[n.id]) err("name " + n.id + ": no such term in the deep dive");
    else if (chapterOf[n.id] !== n.ch) err("name " + n.id + ": the story puts it in chapter " + n.ch + ", the deep dive in chapter " + chapterOf[n.id]);
    if (!fs.existsSync(path.join(root, DIR, "terms", n.id, "index.html"))) err("name " + n.id + ": terms/" + n.id + "/index.html does not exist");
  });
  Object.keys(D.entries).forEach((id) => { if (!C.names.some((n) => n.id === id)) err("term " + id + ": not named over the kitchen, so its page cannot show where it sits"); });

  // Bridges: every value is a term, every bold word of a caption has one.
  Object.keys(bridges).forEach((w) => {
    if (w !== w.toLowerCase()) err("bridge " + w + ": the key must be lower case");
    if (!D.entries[bridges[w]]) err("bridge " + w + ": no term called " + bridges[w]);
  });
  C.steps.forEach((s) => {
    if (s.map !== undefined) return;
    (String(s.cap).match(/\*\*[^*]+\*\*/g) || []).forEach((b) => {
      const w = b.slice(2, -2).toLowerCase();
      if (!bridges[w]) err("step " + s.id + ": the bold word \"" + w + "\" has no bridge in data/bridges.js");
    });
  });
  const used = new Set();
  C.steps.forEach((s) => (String(s.cap).match(/\*\*[^*]+\*\*/g) || []).forEach((b) => used.add(b.slice(2, -2).toLowerCase())));
  Object.keys(bridges).forEach((w) => { if (!used.has(w)) err("bridge " + w + ": no caption uses it any more"); });
  return errors;
}

// Nothing is requested from outside the folder: no http(s) address in the stylesheets or in the scripts of the pages (the data files
// hold the links of the sources and are the content), no @import, and no remote script, stylesheet, image or font in any page.
function outsideChecks(root) {
  const errors = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === "vendor" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
  const all = walk(path.join(root, DIR));
  all.filter((f) => /assets\/css\/.*\.css$/.test(f) || (/assets\/js\/[^/]+\.js$/.test(f))).forEach((f) => {
    const src = fs.readFileSync(f, "utf8").replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "");
    if (/https?:\/\/[a-z0-9]/i.test(src) || /@import/.test(src)) errors.push(path.relative(root, f) + ": must not load or name anything outside the folder");
  });
  all.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = fs.readFileSync(f, "utf8");
    if (/<(script|img|iframe|source|video|audio|embed)\b[^>]*\bsrc="(https?:)?\/\//.test(html) || /<link\b[^>]*rel="(stylesheet|preload|icon)"[^>]*href="(https?:)?\/\//.test(html)) errors.push(path.relative(root, f) + ": loads something from outside");
  });
  return errors;
}

function check(root) {
  let errors = v9.check(root, { dir: DIR, terms: DIR, scan: false });
  try { errors = errors.concat(bridgeChecks(root)); } catch (e) { errors.push("bridge check crashed: " + e.message); }
  errors = errors.concat(outsideChecks(root));
  errors = errors.concat(v4.run(root, DIR, "./build-v11-pages.js", "node scripts/build-v11-pages.js"));
  return errors;
}

function main() {
  const errors = check(path.resolve(__dirname, ".."));
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log(DIR + " content checks passed.");
}

module.exports = { check, bridgeChecks, outsideChecks, loadBridges, DIR };
if (require.main === module) main();
