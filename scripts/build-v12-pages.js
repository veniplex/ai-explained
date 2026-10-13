#!/usr/bin/env node
/* Writes one small HTML page per term and per guide of v12-alpha, from v12-alpha/dive/index.html (see build-v4-pages.js):
     v12-alpha/terms/<id>/index.html   and   v12-alpha/guides/<id>/index.html
   The shell is the start page of the deep dive (v12-alpha/index.html is the page where the visitor picks a half, v12-alpha/story/ the kitchen story).
   Since v11 a page also carries its text in a <noscript> block (the sentence, how it works, the details), so a reader without
   JavaScript, a link preview or a search engine finds the content too. The script draws the page as before.
   Run from the repository root:   node scripts/build-v12-pages.js          (write the pages)
                                   node scripts/build-v12-pages.js --check  (fail when a page is stale; check-v12.js does this too) */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const v4 = require("./build-v4-pages.js");
const { loadV4, plain } = require("./check-v4.js");

const DIR = "versions/v12-alpha";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const para = (s) => "<p>" + esc(plain(s)) + "</p>";

function plainText(D, id) {
  const e = D.entries[id], d = e.deeper || {};
  return [
    "<h1>" + esc(e.name) + "</h1>",
    para(e.short),
    ...(e.how || []).map(para),
    ...(d.details || []).map(para),
    ...(d.includes || []).map((x) => para(x.name + ": " + x.text))
  ].join("\n        ");
}

function pages(root) {
  const out = v4.pages(root, DIR, "start"), D = loadV4(root, DIR);
  Object.keys(out).forEach((f) => {
    const m = /terms\/([a-z0-9-]+)\/index\.html$/.exec(f);
    const text = m && D.entries[m[1]] ? plainText(D, m[1]) : "";
    if (!text) return;
    out[f] = out[f].replace(/<noscript>\s*<p class="noscript">/, '<noscript>\n      <article class="page page-entry">\n        ' + text + '\n      </article>\n      <p class="noscript">');
  });
  return out;
}

function existing(root) {
  const found = [];
  ["terms", "guides"].forEach((kind) => {
    const base = path.join(root, DIR, kind);
    if (!fs.existsSync(base)) return;
    fs.readdirSync(base, { withFileTypes: true }).forEach((d) => { if (d.isDirectory()) found.push(DIR + "/" + kind + "/" + d.name + "/index.html"); });
  });
  return found;
}

function stale(root) {
  const want = pages(root), problems = [];
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) problems.push(f + ": missing");
    else if (fs.readFileSync(p, "utf8") !== want[f]) problems.push(f + ": out of date");
  });
  existing(root).forEach((f) => { if (!want[f]) problems.push(f + ": no such term or guide any more"); });
  return problems;
}

function write(root) {
  const want = pages(root);
  existing(root).forEach((f) => { if (!want[f]) fs.rmSync(path.dirname(path.join(root, f)), { recursive: true }); });
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, want[f]);
  });
  return Object.keys(want).length;
}

module.exports = { pages, stale, write };

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  if (process.argv.includes("--check")) {
    const problems = stale(root);
    if (problems.length) { console.error(problems.length + " page(s) need rebuilding (node scripts/build-v12-pages.js):\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(DIR + " pages are up to date.");
  } else {
    console.log("wrote " + write(root) + " pages");
  }
}
