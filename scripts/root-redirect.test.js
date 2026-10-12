"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

// The newest version is the folder with the highest number (v6-alpha, v10-alpha, …).
function newest() {
  const found = fs.readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^v\d+-/.test(d.name))
    .map((d) => ({ name: d.name, n: parseInt(d.name.slice(1), 10) }))
    .sort((a, b) => b.n - a.n);
  return found[0].name;
}

test("the site root forwards to the newest version", () => {
  const latest = newest(), html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, new RegExp('<meta http-equiv="refresh" content="0; url=' + latest + '/">'));
  assert.match(html, new RegExp('<link rel="canonical" href="https://veniplex\\.github\\.io/ai-explained/' + latest + '/">'));
  assert.match(html, new RegExp('"v1-alpha/" : "' + latest + '/"'));
  assert.ok(fs.existsSync(path.join(root, latest, "assets/img/og.png")) && fs.existsSync(path.join(root, latest, "assets/img/favicon.svg")));
});

test("deep links made for v1-alpha keep going to v1-alpha", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /block-\|zone-\|link-\|step-/);
});
