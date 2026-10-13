"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { check, bridgeChecks } = require("./check-v10.js");
const { pages, stale } = require("./build-v10-pages.js");
const { loadV4 } = require("./check-v4.js");
const v9 = require("./check-v9.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "versions/v0.10-alpha", f), "utf8");

test("v0.10-alpha passes the content checks (story, deep dive, bridges)", () => {
  assert.deepEqual(check(root), []);
});

test("every term has a page and a name over the kitchen", () => {
  const D = loadV4(root, "versions/v0.10-alpha"), C = v9.load(root, "versions/v0.10-alpha");
  Object.keys(D.entries).forEach((id) => {
    assert.ok(fs.existsSync(path.join(root, "versions/v0.10-alpha/terms", id, "index.html")), "terms/" + id + "/");
    assert.ok(C.names.some((n) => n.id === id), id + " is named over the kitchen");
  });
});

test("a bold word in a caption without a bridge is reported", () => {
  const dir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "ae10-"));
  fs.cpSync(path.join(root, "versions/v0.10-alpha"), path.join(dir, "versions/v0.10-alpha"), { recursive: true });
  const f = path.join(dir, "versions/v0.10-alpha/assets/js/data/bridges.js");
  fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace('    "sandbox": "sandbox",\n', ""));
  const errors = bridgeChecks(dir);
  assert.ok(errors.some((e) => /"sandbox" has no bridge/.test(e)), errors.join("\n"));
  fs.rmSync(dir, { recursive: true });
});

test("the term and guide pages come from dive/index.html, one level below the shell's own paths", () => {
  const D = loadV4(root, "versions/v0.10-alpha"), list = Object.keys(pages(root));
  assert.equal(list.length, Object.keys(D.entries).length + D.guideList.length);
  const html = pages(root)["versions/v0.10-alpha/terms/mcp/index.html"];
  assert.match(html, /<body data-page="entry" data-id="mcp" data-base="..\/..\/">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/veniplex\.github\.io\/ai-explained\/versions\/v0.10-alpha\/terms\/mcp\/">/);
  assert.match(html, /<link rel="stylesheet" href="..\/..\/assets\/css\/style\.css">/);
  assert.match(html, /<a class="place" href="..\/..\/" data-place="story"/);
  assert.match(html, /<a class="place" href="..\/..\/dive\/" data-place="dive" aria-current="page"/);
  assert.match(html, /<script src="..\/..\/..\/versions\.js"><\/script>/);
  assert.doesNotMatch(html, /(href|src)="(assets|\.\.\/assets)\//);
  assert.deepEqual(stale(root), []);
});

test("the kitchen story and the deep dive load files that exist", () => {
  for (const f of ["index.html", "dive/index.html"]) {
    const html = read(f), dir = path.dirname(path.join(root, "versions/v0.10-alpha", f));
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
  }
  assert.match(read("index.html"), /<script src="\.\.\/versions\.js"><\/script>\s*<script src="\.\.\/version-switcher\.js"><\/script>\s*<\/body>/);
  assert.match(read("dive/index.html"), /<script src="\.\.\/\.\.\/versions\.js"><\/script>\s*<script src="\.\.\/\.\.\/version-switcher\.js"><\/script>\s*<\/body>/);
});

test("the reader finds every element it needs in the kitchen page", () => {
  const html = read("index.html"), js = read("assets/js/kitchen.js");
  for (const m of js.matchAll(/\$\("#([a-z-]+)"\)/g)) assert.ok(html.includes('id="' + m[1] + '"'), "#" + m[1] + " is missing from index.html");
});

test("the tabs of the two halves lead to each other from the kitchen, the start page of the deep dive and a term page", () => {
  assert.match(read("index.html"), /<a class="place" href="dive\/" id="place-dive"/);
  assert.match(read("dive/index.html"), /<a class="place" href="\.\.\/" data-place="story"/);
  assert.match(read("terms/skills/index.html"), /<a class="place" href="\.\.\/\.\.\/" data-place="story"/);
  assert.match(read("guides/glossary/index.html"), /<a class="place" href="\.\.\/\.\.\/dive\/" data-place="dive" aria-current="page"/);
});
