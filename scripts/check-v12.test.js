"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { check, bridgeChecks } = require("./check-v12.js");
const { pages, stale } = require("./build-v12-pages.js");
const { loadV4 } = require("./check-v4.js");
const v9 = require("./check-v9.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "versions/v12-alpha", f), "utf8");

test("v12-alpha passes the content checks (story, deep dive, bridges)", () => {
  assert.deepEqual(check(root), []);
});

test("every term has a page and a name over the kitchen", () => {
  const D = loadV4(root, "versions/v12-alpha"), C = v9.load(root, "versions/v12-alpha");
  Object.keys(D.entries).forEach((id) => {
    assert.ok(fs.existsSync(path.join(root, "versions/v12-alpha/terms", id, "index.html")), "terms/" + id + "/");
    assert.ok(C.names.some((n) => n.id === id), id + " is named over the kitchen");
  });
});

test("a bold word in a caption without a bridge is reported", () => {
  const dir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "ae12-"));
  fs.cpSync(path.join(root, "versions/v12-alpha"), path.join(dir, "versions/v12-alpha"), { recursive: true });
  const f = path.join(dir, "versions/v12-alpha/assets/js/data/bridges.js");
  fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace('    "sandbox": "sandbox",\n', ""));
  const errors = bridgeChecks(dir);
  assert.ok(errors.some((e) => /"sandbox" has no bridge/.test(e)), errors.join("\n"));
  fs.rmSync(dir, { recursive: true });
});

test("the term and guide pages come from dive/index.html, one level below the shell's own paths", () => {
  const D = loadV4(root, "versions/v12-alpha"), list = Object.keys(pages(root));
  assert.equal(list.length, Object.keys(D.entries).length + D.guideList.length);
  const html = pages(root)["versions/v12-alpha/terms/mcp/index.html"];
  assert.match(html, /<body data-page="entry" data-id="mcp" data-base="..\/..\/">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/veniplex\.github\.io\/ai-explained\/versions\/v12-alpha\/terms\/mcp\/">/);
  assert.match(html, /<link rel="stylesheet" href="..\/..\/assets\/css\/style\.css">/);
  assert.doesNotMatch(html, /class="places?"/, "no switch between the halves in the top bar");
  assert.match(html, /<a class="brand" href="..\/..\/" aria-label="Agentic AI, Explained: back to the start">/);
  assert.match(html, /<script src="..\/..\/..\/versions\.js"><\/script>/);
  assert.doesNotMatch(html, /(href|src)="(assets|\.\.\/assets)\//);
  assert.deepEqual(stale(root), []);
});

test("the kitchen story and the deep dive load files that exist", () => {
  for (const f of ["index.html", "story/index.html", "dive/index.html"]) {
    const html = read(f), dir = path.dirname(path.join(root, "versions/v12-alpha", f));
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
  }
  for (const f of ["index.html", "story/index.html"]) {
    const up = f === "index.html" ? "\\.\\./" : "\\.\\./\\.\\./";
    assert.match(read(f), new RegExp('<script src="' + up + 'versions\\.js"></script>\\s*<script src="' + up + 'version-switcher\\.js"></script>\\s*</body>'), f);
  }
  assert.match(read("dive/index.html"), /<script src="\.\.\/\.\.\/versions\.js"><\/script>\s*<script src="\.\.\/\.\.\/version-switcher\.js"><\/script>\s*<\/body>/);
});

test("the reader finds every element it needs in the kitchen page", () => {
  const html = read("story/index.html"), js = read("assets/js/kitchen.js");
  for (const m of js.matchAll(/\$\("#([a-z-]+)"\)/g)) assert.ok(html.includes('id="' + m[1] + '"'), "#" + m[1] + " is missing from story/index.html");
});

test("the top bar has no switch between the halves; the start page offers both, and every page leads back to it", () => {
  for (const f of ["index.html", "story/index.html", "dive/index.html", "terms/skills/index.html", "guides/glossary/index.html"]) {
    assert.doesNotMatch(read(f), /class="places?"/, f + " has a tab switch");
    assert.match(read(f), /<a class="brand" href="(\.\/|(\.\.\/)+)"/, f + ": the brand leads to the start page");
  }
  const start = read("index.html");
  assert.match(start, /<a class="path-link" href="story\/"/);
  assert.match(start, /<a class="path-link" href="dive\/"/);
  assert.match(start, /<a href="dive\/#map">/);
  assert.match(read("story/index.html"), /<a class="brand" href="\.\.\/"/);
  assert.match(read("dive/index.html"), /<a class="brand" href="\.\.\/"/);
});

test("links made for the kitchen story at the version root (#ch-3, #map, #e-skills, #guide-glossary) are forwarded to story/", () => {
  const html = read("index.html"), m = /if \((\/\^#[^\n]*\/)\.test\(location\.hash\)\) location\.replace\("story\/"/.exec(html);
  assert.ok(m, "the start page forwards old links");
  const re = new RegExp(m[1].slice(1, m[1].lastIndexOf("/")), m[1].slice(m[1].lastIndexOf("/") + 1));
  for (const h of ["#ch-1", "#ch-8", "#ch-e", "#map", "#e-skills", "#e-agent-loop", "#guide-glossary"]) assert.ok(re.test(h), h);
  for (const h of ["", "#", "#ch-9", "#block-mcp", "#start"]) assert.ok(!re.test(h), h + " stays on the start page");
});

test("a term page carries its text for readers without JavaScript", () => {
  const html = read("terms/mcp/index.html");
  assert.match(html, /<noscript>\s*<article class="page page-entry">\s*<h1>MCP \(Model Context Protocol\)<\/h1>\s*<p>MCP, the Model Context Protocol/);
});

test("the names of the kitchen stay out of the tab order until they are shown", () => {
  const css = read("assets/css/kitchen.css");
  assert.match(css, /\.lab \{[^}]*visibility: hidden;/);
  assert.match(css, /\.stage\.is-map \.lab \{[^}]*visibility: visible;/);
});

test("the story answers #guide-<id> links and does not trust the hash as an object key", () => {
  const js = read("assets/js/kitchen.js");
  assert.match(js, /GUIDES\.indexOf\(m\[1\]\)/);
  assert.match(js, /var byName = Object\.create\(null\)/);
});

test("the site has a 404 page that loads nothing from outside and the root keeps the query string", () => {
  const html = fs.readFileSync(path.join(root, "404.html"), "utf8");
  assert.doesNotMatch(html, /(src|href)="https?:\/\//);
  assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /location\.search/);
});
