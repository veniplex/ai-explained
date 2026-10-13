"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { check, selfContained, wayChecks, SECTIONS } = require("./check-v13.js");
const { pages, stale } = require("./build-v13-pages.js");
const { loadV4 } = require("./check-v4.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "versions/v0.13-alpha", f), "utf8");
const TRAIL = '<script src="%versions.js"></script>\\s*<script src="%version-switcher.js"></script>\\s*</body>';

test("v0.13-alpha passes the content checks (voices, story, bridges, three ways, top bar, generated files, self-containment)", () => {
  assert.deepEqual(check(root), []);
});

test("every term has a reference page and a guide list in both ways, and the generated files are current", () => {
  const D = loadV4(root, "versions/v0.13-alpha");
  ["kitchen", "technical"].forEach((way) => {
    Object.keys(D.entries).forEach((id) => assert.ok(fs.existsSync(path.join(root, "versions/v0.13-alpha", way, "references", id, "index.html")), way + "/references/" + id));
    D.guideList.forEach((g) => assert.ok(fs.existsSync(path.join(root, "versions/v0.13-alpha", way, "guides", g.id, "index.html")), way + "/guides/" + g.id));
    assert.ok(fs.existsSync(path.join(root, "versions/v0.13-alpha", way, "references", "index.html")));
    assert.ok(fs.existsSync(path.join(root, "versions/v0.13-alpha", way, "guides", "index.html")));
  });
  assert.deepEqual(stale(root), []);
});

test("every shell and generated page loads files that exist and the version dropdown from the right depth", () => {
  const files = Object.keys(pages(root)).map((f) => f.replace(/^versions\/v0.13-alpha\//, "")).concat(["index.html", "story/index.html", "kitchen/index.html", "technical/index.html"]);
  files.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, "versions/v0.13-alpha", f)), depth = f.split("/").length - 1, up = "../".repeat(depth + 1);
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"#?]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
    assert.match(html, new RegExp(TRAIL.replace(/%/g, up.replace(/\./g, "\\."))), f + ": versions.js and version-switcher.js come last");
    assert.ok(html.includes('class="bar-actions"'), f + " has no header to put the dropdown in");
  });
});

test("the top bar lists the same sections in the same order on every page, with the search in the middle", () => {
  const order = SECTIONS.map((s) => s.id || s);
  const f = ["index.html", "story/index.html", "kitchen/references/skills/index.html", "technical/guides/build/index.html"];
  f.forEach((p) => {
    const html = read(p), ids = [...html.matchAll(/data-sec="([a-z]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids, order, p);
    assert.match(html, /id="site-search"/, p + ": search field");
    assert.ok(html.indexOf('id="site-search"') < html.indexOf('class="bar-actions"'), p + ": search comes before the actions");
  });
});

test("the technical way loads no kitchen script or data and has no kitchen word in its static text", () => {
  ["technical/index.html", "technical/references/mcp/index.html", "technical/guides/compare/index.html"].forEach((p) => {
    assert.doesNotMatch(read(p), /draw\.js|props|js\/kitchen\.js|data\/(kitchen|story|names|bridges)\.js|locator\.js|voice-kitchen/, p);
    assert.match(read(p), /data-path="technical"/);
  });
  assert.deepEqual(wayChecks(root), []);
});

test("the start page links to the three ways; old root links are forwarded", () => {
  const html = read("index.html");
  ["story/", "kitchen/", "technical/"].forEach((h) => assert.match(html, new RegExp('<a class="path-link" href="' + h + '"')));
  assert.match(html, /kitchen\/guides\//);
  assert.match(html, /kitchen\/references\//);
  assert.match(html, /#guide-/);
});

test("the hover texts and the search index cover every term, one file per way, each in its own voice only", () => {
  const D = loadV4(root, "versions/v0.13-alpha");
  ["kitchen", "technical"].forEach((way) => {
    const g = read("assets/js/data/glance-" + way + ".js"), s = read("assets/js/data/search-index-" + way + ".js"), mine = way === "kitchen" ? "k" : "t", other = way === "kitchen" ? "t" : "k";
    Object.keys(D.entries).forEach((id) => {
      assert.ok(g.includes('"' + id + '": {'), way + " glance: " + id);
      assert.ok(s.includes('"id":"' + id + '"'), way + " search index: " + id);
    });
    assert.match(g, new RegExp('"' + mine + '":"'));
    assert.doesNotMatch(g, new RegExp('"' + other + '":"'), way + " glance holds the other voice");
    assert.doesNotMatch(s, new RegExp('"' + other + '[a-z]":'), way + " search index holds the other voice");
  });
  assert.doesNotMatch(read("assets/js/data/search-index-technical.js"), /"k":"story"/);
});

test("a version named in v13's own files is reported", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ae13-"));
  fs.cpSync(path.join(root, "versions/v0.13-alpha"), path.join(dir, "versions/v0.13-alpha"), { recursive: true });
  fs.writeFileSync(path.join(dir, "versions/v0.13-alpha/NOTES.md"), "builds on v0.12-alpha\n");
  const errors = selfContained(dir);
  assert.ok(errors.length > 0, "expected a report");
  fs.rmSync(dir, { recursive: true });
});
