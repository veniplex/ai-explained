"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pages, stale } = require("./build-v6-pages.js");
const { loadV4 } = require("./check-v4.js");

const root = path.resolve(__dirname, "..");

test("there is one page per term and per guide, inside v6-alpha", () => {
  const D = loadV4(root, "v6-alpha"), list = Object.keys(pages(root));
  assert.equal(list.length, Object.keys(D.entries).length + D.guideList.length);
  assert.ok(list.every((f) => f.startsWith("v6-alpha/")));
  assert.ok(list.includes("v6-alpha/terms/agent-loop/index.html"));
});

test("a page points at its own v6 address and reaches the assets two folders up", () => {
  const html = pages(root)["v6-alpha/terms/mcp/index.html"];
  assert.match(html, /<link rel="canonical" href="https:\/\/veniplex\.github\.io\/ai-explained\/v6-alpha\/terms\/mcp\/">/);
  assert.match(html, /<link rel="stylesheet" href="..\/..\/assets\/css\/style\.css">/);
  assert.doesNotMatch(html, /(href|src)="assets\//);
});

test("v6 has no voice switch left", () => {
  const html = pages(root)["v6-alpha/guides/compare/index.html"];
  assert.doesNotMatch(html, /mode-slot|data-mode|ae-mode/);
});

test("the committed pages are up to date", () => {
  assert.deepEqual(stale(root), []);
});
