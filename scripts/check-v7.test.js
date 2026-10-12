"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { check, load, v6Terms } = require("./check-v7.js");

const root = path.resolve(__dirname, "..");

test("the pages of v7-alpha pass the content checks", () => {
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
