"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

// The version folders on disk, newest (highest number) first.
function folders() {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^v\d+-/.test(d.name))
    .map((d) => ({ name: d.name, n: parseInt(d.name.slice(1), 10) }))
    .sort((a, b) => b.n - a.n)
    .map((d) => d.name);
}
// versions.js is the one place that lists the versions: the first entry is the newest.
function versions() {
  const sandbox = { window: {} };
  vm.runInNewContext(read("versions.js"), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window.AE_VERSIONS.list));
}
const switcher = require("../version-switcher.js");

test("versions.js lists every version folder, newest first, once", () => {
  const ids = versions().map((v) => v.id);
  assert.deepEqual(ids, folders());
  assert.equal(new Set(ids).size, ids.length);
  versions().forEach((v) => {
    assert.ok(v.note && typeof v.guided === "boolean" && typeof v.pages === "boolean", v.id + " needs a note, guided and pages");
    assert.ok(fs.existsSync(path.join(root, v.id, "index.html")), v.id + " has no index.html");
  });
});

test("the site root forwards to the first version in versions.js", () => {
  const html = read("index.html");
  assert.match(html, /<script src="versions\.js"><\/script>/);
  assert.match(html, /AE_VERSIONS\.list\[0\]\.id/);
  assert.ok(fs.existsSync(path.join(root, "og.png")) && fs.existsSync(path.join(root, "favicon.svg")));
});

test("the root names no version except v1-alpha for its old deep links", () => {
  const html = read("index.html");
  const named = html.match(/v\d+-[a-z]+/g) || [];
  assert.deepEqual([...new Set(named)], ["v1-alpha"]);
});

test("deep links made for v1-alpha keep going to v1-alpha", () => {
  const html = read("index.html");
  assert.match(html, /block-\|zone-\|link-\|step-/);
  assert.match(html, /"v1-alpha"/);
});

test("every version and every generated page loads the version dropdown from the right place", () => {
  const files = [];
  versions().forEach((v) => {
    files.push([v.id + "/index.html", "../"]);
    ["terms", "guides"].forEach((kind) => {
      const base = path.join(root, v.id, kind);
      if (!fs.existsSync(base)) return;
      fs.readdirSync(base, { withFileTypes: true }).forEach((d) => {
        if (d.isDirectory()) files.push([v.id + "/" + kind + "/" + d.name + "/index.html", "../../../"]);
      });
    });
  });
  files.forEach(([f, up]) => {
    const html = read(f);
    assert.ok(html.includes('<script src="' + up + 'versions.js"></script>'), f + " must load " + up + "versions.js");
    assert.ok(html.includes('<script src="' + up + 'version-switcher.js"></script>'), f + " must load " + up + "version-switcher.js");
    assert.ok(html.indexOf("versions.js") < html.indexOf("version-switcher.js"), f + ": versions.js comes first");
    assert.ok(html.includes('class="bar-actions"'), f + " has no header to put the dropdown in");
  });
});

test("the dropdown keeps a term, guide or chapter when both versions have it, and falls back to the start page", () => {
  const list = versions(), t = switcher.target;
  assert.equal(t(list, "v6-alpha", "terms/skills/", "", "v5-alpha"), "v5-alpha/terms/skills/");
  assert.equal(t(list, "v6-alpha", "guides/build/", "", "v4-alpha"), "v4-alpha/guides/build/");
  assert.equal(t(list, "v6-alpha", "terms/skills/", "", "v3-alpha"), "v3-alpha/");
  assert.equal(t(list, "v6-alpha", "", "#ch-3", "v3-alpha"), "v3-alpha/#ch-3");
  assert.equal(t(list, "v5-alpha", "", "#map", "v6-alpha"), "v6-alpha/#map");
  assert.equal(t(list, "v6-alpha", "", "#ch-3", "v1-alpha"), "v1-alpha/");
  assert.equal(t(list, "v1-alpha", "", "#block-mcp", "v6-alpha"), "v6-alpha/");
  assert.equal(t(list, "v6-alpha", "", "", "v6-alpha"), "v6-alpha/");
  assert.equal(switcher.short("v6-alpha"), "v6");
  assert.equal(switcher.short("v10-beta"), "v10");
});
