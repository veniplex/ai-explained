"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { check, load, v6Terms } = require("./check-v9.js");

const root = path.resolve(__dirname, "..");

test("the story of v0.9-alpha passes the content checks", () => {
  assert.deepEqual(check(root), []);
});

test("every v6 term is named over the kitchen", () => {
  const ids = load(root).names.map((n) => n.id);
  assert.deepEqual(v6Terms(root).filter((t) => !ids.includes(t)), []);
});

test("any step can be reached: the chapters of the story run from the start to the names", () => {
  const { steps, chapters } = load(root);
  assert.equal(steps[0].ch, 0);
  assert.equal(steps[steps.length - 1].ch, 10);
  assert.equal(chapters[chapters.length - 1].hash, "map");
});

test("index.html loads files that exist and has the elements the reader needs", () => {
  const html = fs.readFileSync(path.join(root, "versions/v0.9-alpha/index.html"), "utf8");
  for (const m of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, "versions/v0.9-alpha", m[1])), m[1]);
  const js = fs.readFileSync(path.join(root, "versions/v0.9-alpha/assets/js/kitchen.js"), "utf8");
  for (const m of js.matchAll(/\$\("#([a-z-]+)"\)/g)) assert.ok(html.includes('id="' + m[1] + '"'), "#" + m[1] + " is missing from index.html");
  assert.match(html, /<script src="\.\.\/versions\.js"><\/script>\s*<script src="\.\.\/version-switcher\.js"><\/script>\s*<\/body>/);
});
