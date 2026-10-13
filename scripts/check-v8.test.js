"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { check, load, v6Terms } = require("./check-v8.js");

const root = path.resolve(__dirname, "..");

test("the pages of v0.8-alpha pass the content checks", () => {
  assert.deepEqual(check(root), []);
});

test("every v6 term is a term of the index on the last page", () => {
  const { pages } = load(root), ids = pages[pages.length - 1].names.map((n) => n.id);
  assert.deepEqual(v6Terms(root).filter((t) => !ids.includes(t)), []);
});

test("the drawings all draw and the first page is the cover", () => {
  const { C, pages } = load(root);
  assert.equal(pages[0].hash, "");
  Object.keys(C.props).forEach((name) => assert.ok(Array.isArray(C.props[name]({ pts: [[0, 0], [10, 10]] })), name));
});

test("index.html loads files that exist and has the elements the reader needs", () => {
  const fs = require("node:fs");
  const html = fs.readFileSync(path.join(root, "versions/v0.8-alpha/index.html"), "utf8");
  for (const m of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, "versions/v0.8-alpha", m[1])), m[1]);
  const js = fs.readFileSync(path.join(root, "versions/v0.8-alpha/assets/js/comic.js"), "utf8");
  for (const m of js.matchAll(/\$\("#([a-z-]+)"\)/g)) assert.ok(html.includes('id="' + m[1] + '"'), "#" + m[1] + " is missing from index.html");
  assert.match(html, /<script src="\.\.\/versions\.js"><\/script>\s*<script src="\.\.\/version-switcher\.js"><\/script>\s*<\/body>/);
});
