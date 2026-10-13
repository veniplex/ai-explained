"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { check, selfContained, wayChecks, SECTIONS } = require("./check-v15.js");
const { pages, stale } = require("./build-v15-pages.js");
const content = require("./v15-content.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "v15-alpha", f), "utf8");
const TRAIL = '<script src="%versions.js"></script>\\s*<script src="%version-switcher.js"></script>\\s*</body>';

test("v15-alpha passes the content checks (voices, story, bridges, kitchen only where it belongs, top bar, generated files, self-containment)", () => {
  assert.deepEqual(check(root), []);
});

test("every term of the glossary has a page, and so has every guide, and the generated files are current", () => {
  const D = content.load(root), ids = Object.keys(D.entries).concat(D.glossary.map((g) => g.id));
  assert.ok(ids.length >= 180, "the start page promises over 180 terms");
  ids.forEach((id) => assert.ok(fs.existsSync(path.join(root, "v15-alpha", "glossary", id, "index.html")), "glossary/" + id));
  D.guideList.forEach((g) => assert.ok(fs.existsSync(path.join(root, "v15-alpha", "guides", g.id, "index.html")), "guides/" + g.id));
  ["glossary", "guides", "about"].forEach((d) => assert.ok(fs.existsSync(path.join(root, "v15-alpha", d, "index.html")), d));
  ["kitchen", "references"].forEach((d) => assert.ok(!fs.existsSync(path.join(root, "v15-alpha", d)), d + " is gone"));
  assert.deepEqual(stale(root), []);
});

test("every shell and generated page loads files that exist and the version dropdown from the right depth", () => {
  const files = Object.keys(pages(root)).map((f) => f.replace(/^v15-alpha\//, "")).concat(["index.html", "story/index.html", "technical/index.html"]);
  files.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, "v15-alpha", f)), depth = f.split("/").length - 1, up = "../".repeat(depth + 1);
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"#?]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
    assert.match(html, new RegExp(TRAIL.replace(/%/g, up.replace(/\./g, "\\."))), f + ": versions.js and version-switcher.js come last");
    assert.ok(html.includes('class="bar-actions"'), f + " has no header to put the dropdown in");
  });
});

test("the top bar lists the same sections in the same order on every page, with the search in the middle", () => {
  ["index.html", "story/index.html", "glossary/skills/index.html", "guides/build/index.html", "technical/index.html"].forEach((p) => {
    const html = read(p), ids = [...html.matchAll(/data-sec="([a-z]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids, SECTIONS, p);
    assert.match(html, /id="site-search"/, p + ": search field");
    assert.ok(html.indexOf('id="site-search"') < html.indexOf('class="bar-actions"'), p + ": search comes before the actions");
  });
});

test("only the story and the glossary load the kitchen; the deep dive, the guides and the about page do not name it", () => {
  const KITCHEN = /draw\.js|assets\/js\/props|js\/kitchen\.js|data\/(kitchen|story|names|bridges)\.js|locator\.js|voice-glossary-kitchen/;
  ["technical/index.html", "guides/index.html", "guides/context/index.html", "about/index.html"].forEach((p) => assert.doesNotMatch(read(p), KITCHEN, p));
  ["glossary/index.html", "glossary/mcp/index.html"].forEach((p) => assert.match(read(p), /voice-glossary-kitchen/, p));
  assert.deepEqual(wayChecks(root), []);
});

test("a term page carries the kitchen place, the sections in order, and its references", () => {
  const src = fs.readFileSync(path.join(root, "v15-alpha/assets/js/pages.js"), "utf8");
  const body = src.slice(src.indexOf("V3.locator ? V3.locator.section(t)"), src.indexOf("autolink(body, id)"));
  const order = ["V3.locator.section", "definition(t)", "relatedChips(t.related)", "detail(t)", "referencesOf(T.refs(id)"].map((x) => body.indexOf(x));
  order.forEach((i, n) => assert.ok(i >= 0, "the term page lacks part " + n));
  assert.deepEqual(order.slice().sort((a, b) => a - b), order, "the parts come in the order of the brief");
  ["Definition", "Related terms", "Detailed technical description", "References"].forEach((hd) => assert.ok(src.includes('"' + hd + '"'), hd));
  assert.doesNotMatch(src, /On Sunday|Want the real thing|build up/);
});

test("the start page links to both ways, the glossary and the guides; old root links are forwarded", () => {
  const html = read("index.html");
  ["story/", "technical/"].forEach((h) => assert.match(html, new RegExp('<a class="path-link" href="' + h + '"')));
  assert.match(html, /guides\//);
  assert.match(html, /glossary\//);
  assert.match(html, /#guide-/);
});

test("the hover texts and the search index cover every term of the glossary, in the technical voice only", () => {
  const D = content.load(root), all = Object.keys(D.entries).concat(D.glossary.map((x) => x.id));
  const g = read("assets/js/data/glance.js"), s = read("assets/js/data/search-index.js");
  all.forEach((id) => {
    assert.ok(g.includes('"' + id + '": {'), "glance: " + id);
    assert.ok(s.includes('"id":"' + id + '"'), "search index: " + id);
  });
  assert.match(g, /"t":"/);
  assert.doesNotMatch(g, /"k":"/, "glance holds a kitchen sentence");
});

test("a version named in v15's own files is reported", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ae15-"));
  fs.cpSync(path.join(root, "v15-alpha"), path.join(dir, "v15-alpha"), { recursive: true });
  fs.writeFileSync(path.join(dir, "v15-alpha/NOTES.md"), "builds on v12-alpha\n");
  const errors = selfContained(dir);
  assert.ok(errors.length > 0, "expected a report");
  fs.rmSync(dir, { recursive: true });
});
