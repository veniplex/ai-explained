"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { checkPoints } = require("./check-v6.js");
const { loadV4 } = require("./check-v4.js");

const root = path.resolve(__dirname, "..");
const load = () => loadV4(root, "v6-alpha");

test("the arrow targets of v6-alpha are all valid", () => {
  assert.deepEqual(checkPoints(load()), []);
});

test("a passage without a target is reported", () => {
  const D = load();
  D.points.chef.kitchen.text[0] = [];
  assert.match(checkPoints(D).join("\n"), /points\.chef\.kitchen\.text\[0\]: needs at least one target/);
});

test("a paragraph without its own list is reported", () => {
  const D = load();
  D.points.counter.technical.text.pop();
  assert.match(checkPoints(D).join("\n"), /points\.counter\.technical\.text: needs one list for each of the 3 paragraphs/);
});

test("an arrow may not point at a piece that is not on the map yet", () => {
  const D = load();
  D.points.chef.technical.example = ["hooks"];
  assert.match(checkPoints(D).join("\n"), /hooks is not on the map until chapter 6/);
});

test("an unknown entry is reported", () => {
  const D = load();
  D.points.tools.kitchen.example = ["nonsense"];
  assert.match(checkPoints(D).join("\n"), /unknown entry nonsense/);
});
