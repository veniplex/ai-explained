"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pages, stale } = require("./build-v4-pages.js");
const { loadV4 } = require("./check-v4.js");

const root = path.resolve(__dirname, "..");

test("there is one page per term and per guide", () => {
  const D = loadV4(root), list = Object.keys(pages(root));
  assert.equal(list.length, Object.keys(D.entries).length + D.guideList.length);
  assert.ok(list.includes("v4-alpha/terms/agent-loop/index.html"));
  assert.ok(list.includes("v4-alpha/guides/glossary/index.html"));
});

test("a page points at its own address and reaches the assets two folders up", () => {
  const html = pages(root)["v4-alpha/terms/mcp/index.html"];
  assert.match(html, /<body data-page="entry" data-id="mcp" data-base="..\/..\/">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/veniplex\.github\.io\/ai-explained\/v4-alpha\/terms\/mcp\/">/);
  assert.match(html, /<link rel="stylesheet" href="..\/..\/assets\/css\/style\.css">/);
  assert.doesNotMatch(html, /(href|src)="assets\//);
});

test("titles and descriptions are escaped", () => {
  const html = pages(root)["v4-alpha/guides/compare/index.html"];
  assert.match(html, /<title>[^<"]+ · Agentic AI, Explained<\/title>/);
  assert.doesNotMatch(html, /<meta name="description" content="[^"]*"[^>]*"/);
});

test("the committed pages are up to date", () => {
  assert.deepEqual(stale(root), []);
});
