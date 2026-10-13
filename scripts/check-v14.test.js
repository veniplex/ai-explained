"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { check, selfContained, wayChecks, SECTIONS } = require("./check-v14.js");
const { pages, stale } = require("./build-v14-pages.js");
const content = require("./v14-content.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "v14-alpha", f), "utf8");
const TRAIL = '<script src="%versions.js"></script>\\s*<script src="%version-switcher.js"></script>\\s*</body>';

test("v14-alpha passes the content checks (voices, story, bridges, three ways, top bar, generated files, self-containment)", () => {
  assert.deepEqual(check(root), []);
});

test("every term of the glossary has a page, and so has every guide, in both ways, and the generated files are current", () => {
  const D = content.load(root), ids = Object.keys(D.entries).concat(D.glossary.map((g) => g.id));
  assert.ok(ids.length >= 180, "the start page promises over 180 terms");
  ["kitchen", "technical"].forEach((way) => {
    ids.forEach((id) => assert.ok(fs.existsSync(path.join(root, "v14-alpha", way, "glossary", id, "index.html")), way + "/glossary/" + id));
    D.guideList.forEach((g) => assert.ok(fs.existsSync(path.join(root, "v14-alpha", way, "guides", g.id, "index.html")), way + "/guides/" + g.id));
    ["glossary", "guides", "about"].forEach((d) => assert.ok(fs.existsSync(path.join(root, "v14-alpha", way, d, "index.html")), way + "/" + d));
    assert.ok(!fs.existsSync(path.join(root, "v14-alpha", way, "references")), "the references are the glossary now");
  });
  assert.deepEqual(stale(root), []);
});

test("every shell and generated page loads files that exist and the version dropdown from the right depth", () => {
  const files = Object.keys(pages(root)).map((f) => f.replace(/^v14-alpha\//, "")).concat(["index.html", "story/index.html", "kitchen/index.html", "technical/index.html"]);
  files.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, "v14-alpha", f)), depth = f.split("/").length - 1, up = "../".repeat(depth + 1);
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"#?]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
    assert.match(html, new RegExp(TRAIL.replace(/%/g, up.replace(/\./g, "\\."))), f + ": versions.js and version-switcher.js come last");
    assert.ok(html.includes('class="bar-actions"'), f + " has no header to put the dropdown in");
  });
});

test("the top bar lists the same sections in the same order on every page, with the search in the middle", () => {
  const order = SECTIONS.map((s) => s.id || s);
  const f = ["index.html", "story/index.html", "kitchen/glossary/skills/index.html", "technical/guides/build/index.html"];
  f.forEach((p) => {
    const html = read(p), ids = [...html.matchAll(/data-sec="([a-z]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids, order, p);
    assert.match(html, /id="site-search"/, p + ": search field");
    assert.ok(html.indexOf('id="site-search"') < html.indexOf('class="bar-actions"'), p + ": search comes before the actions");
  });
});

test("the technical way loads no kitchen script or data and has no kitchen word in its static text", () => {
  ["technical/index.html", "technical/glossary/mcp/index.html", "technical/guides/compare/index.html"].forEach((p) => {
    assert.doesNotMatch(read(p), /draw\.js|props|js\/kitchen\.js|data\/(kitchen|story|names|bridges)\.js|locator\.js|voice-kitchen/, p);
    assert.match(read(p), /data-path="technical"/);
  });
  assert.deepEqual(wayChecks(root), []);
});

test("the start page links to the three ways; old root links are forwarded", () => {
  const html = read("index.html");
  ["story/", "kitchen/", "technical/"].forEach((h) => assert.match(html, new RegExp('<a class="path-link" href="' + h + '"')));
  assert.match(html, /kitchen\/guides\//);
  assert.match(html, /kitchen\/glossary\//);
  assert.match(html, /#guide-/);
});

test("the hover texts and the search index cover every term of the glossary, one file per way, each in its own voice only", () => {
  const D = content.load(root), all = Object.keys(D.entries).concat(D.glossary.map((x) => x.id));
  ["kitchen", "technical"].forEach((way) => {
    const g = read("assets/js/data/glance-" + way + ".js"), s = read("assets/js/data/search-index-" + way + ".js"), mine = way === "kitchen" ? "k" : "t", other = way === "kitchen" ? "t" : "k";
    all.forEach((id) => {
      assert.ok(g.includes('"' + id + '": {'), way + " glance: " + id);
      assert.ok(s.includes('"id":"' + id + '"'), way + " search index: " + id);
    });
    assert.match(g, new RegExp('"' + mine + '":"'));
    assert.doesNotMatch(g, new RegExp('"' + other + '":"'), way + " glance holds the other voice");
    assert.doesNotMatch(s, new RegExp('"' + other + '[a-z]":'), way + " search index holds the other voice");
  });
  assert.doesNotMatch(read("assets/js/data/search-index-technical.js"), /"k":"story"/);
});

test("a version named in v14's own files is reported", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ae14-"));
  fs.cpSync(path.join(root, "v14-alpha"), path.join(dir, "v14-alpha"), { recursive: true });
  fs.writeFileSync(path.join(dir, "v14-alpha/NOTES.md"), "builds on v12-alpha\n");
  const errors = selfContained(dir);
  assert.ok(errors.length > 0, "expected a report");
  fs.rmSync(dir, { recursive: true });
});
