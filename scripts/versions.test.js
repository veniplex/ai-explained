"use strict";
// The layout of the repository: the main version (the release) is the site at the root, every older version is a folder of versions/, and
// versions/versions.js is the one list of them all. These tests keep the list, the folders, the dropdown and the old addresses in step.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const exists = (f) => fs.existsSync(path.join(root, f));

// The version folders on disk (versions/<id>/), newest (highest number) first. An id is v<number>-<stage> (v17-alpha) or v<x.y.z> (v1.0.0).
const rank = (id) => id.replace(/^v/, "").replace(/-.*$/, "").split(".").map(Number);
const newer = (a, b) => { const x = rank(a), y = rank(b); for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (y[i] || 0) - (x[i] || 0); return 0; };
function folders() {
  return fs.readdirSync(path.join(root, "versions"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort(newer);
}
// versions/versions.js is the one place that lists the versions: the first entry is the main one.
function versions() {
  const sandbox = { window: {} };
  vm.runInNewContext(read("versions/versions.js"), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window.AE_VERSIONS.list));
}
const switcher = require("../versions/version-switcher.js");

// Every index.html under a folder of the repository, as paths from the root.
function pagesIn(dir) {
  const out = [];
  const walk = (d) => fs.readdirSync(path.join(root, d), { withFileTypes: true }).forEach((e) => {
    if (e.isDirectory()) walk(d + "/" + e.name); else if (e.name === "index.html") out.push(d + "/" + e.name);
  });
  walk(dir);
  return out;
}

test("versions.js has one main version, first, and then every folder of versions/, newest first, once", () => {
  const list = versions(), ids = list.map((v) => v.id);
  assert.ok(list[0].main === true, "the first entry is the main version");
  assert.equal(list.filter((v) => v.main).length, 1, "exactly one main version");
  assert.deepEqual(ids.slice(1), folders());
  assert.equal(new Set(ids).size, ids.length);
  list.forEach((v) => {
    assert.ok(v.note && typeof v.guided === "boolean" && typeof v.pages === "boolean", v.id + " needs a note, guided and pages");
    assert.ok(v.sections === undefined || typeof v.sections === "boolean", v.id + ": sections is true or false");
    assert.ok(exists(v.main ? "index.html" : "versions/" + v.id + "/index.html"), v.id + " has no index.html");
  });
  assert.ok(exists("og.png") && exists("favicon.svg") && exists("versions/favicon.svg"));
});

test("the main version is no folder of versions/, and no older version is named as the release", () => {
  const main = versions()[0].id;
  assert.ok(!folders().includes(main), main + " is the site at the root, not a folder of versions/");
  assert.match(main, /^v\d+\.\d+\.\d+$/);
});

test("the root is the main version: its start page loads the dropdown and does not forward to a version", () => {
  const html = read("index.html");
  assert.ok(html.includes('<script src="versions/versions.js"></script>') && html.includes('<script src="versions/version-switcher.js"></script>'));
  assert.ok(html.indexOf("versions/versions.js") < html.indexOf("versions/version-switcher.js"));
  const named = (html.match(/versions\/v\d+-[a-z]+/g) || []).filter((v, i, a) => a.indexOf(v) === i);
  assert.deepEqual(named, ["versions/v1-alpha"], "only v1-alpha is named, for its old deep links");
  assert.ok(!/AE_VERSIONS\.list\[0\]/.test(html), "the root no longer forwards to the first version of the list");
});

// Run the script of the root start page that forwards old links, with a fake address; it returns where it sent the visitor, or null.
function forward(file, hash, pathname, search) {
  const html = read(file), scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let to = null;
  const location = { hash: hash || "", pathname: pathname || "/ai-explained/", search: search || "", replace: (u) => { to = u; } };
  scripts.forEach((code) => { try { vm.runInNewContext(code, { location, window: {}, document: {} }); } catch (e) { /* a script that needs the page */ } });
  return to;
}

test("deep links made for v1-alpha keep going to v1-alpha, which now sits in versions/", () => {
  ["#block-mcp", "#zone-model", "#link-a", "#step-3", "#story", "#ideas", "#steps", "#context", "#compare", "#patterns", "#protocols", "#decide", "#build", "#blocks", "#glossary", "#learn", "#about"].forEach((h) => {
    assert.equal(forward("index.html", h), "versions/v1-alpha/" + h, h);
  });
  // The links of the release itself are not v1-alpha's.
  assert.equal(forward("index.html", "#ch-3"), "story/#ch-3");
  assert.equal(forward("index.html", "#guide-glossary"), "glossary/");
});

test("old addresses of a version (/v12-alpha/…) are forwarded to versions/ by the 404 page, with the query and the hash", () => {
  assert.equal(forward("404.html", "#e-skills", "/ai-explained/v12-alpha/story/", "?x=1"), "/ai-explained/versions/v12-alpha/story/?x=1#e-skills");
  assert.equal(forward("404.html", "#block-mcp", "/ai-explained/v1-alpha/", ""), "/ai-explained/versions/v1-alpha/#block-mcp");
  assert.equal(forward("404.html", "", "/ai-explained/v6-alpha/terms/mcp/", ""), "/ai-explained/versions/v6-alpha/terms/mcp/");
  assert.equal(forward("404.html", "", "/ai-explained/v17-alpha", ""), "/ai-explained/versions/v17-alpha/", "a folder address without the closing slash");
  assert.equal(forward("404.html", "", "/v9-alpha/", ""), "/versions/v9-alpha/", "a site served from the root of a domain");
});

test("the 404 page does not forward an address that is already in versions/, or one that names no version", () => {
  assert.equal(forward("404.html", "", "/ai-explained/versions/v12-alpha/nothing/", ""), null);
  assert.equal(forward("404.html", "", "/ai-explained/versions/v99-alpha/", ""), null);
  assert.equal(forward("404.html", "", "/ai-explained/nothing/", ""), null);
  assert.equal(forward("404.html", "", "/ai-explained/glossary/nothing/", ""), null);
  const html = read("404.html");
  assert.ok(/href="\/ai-explained\/glossary\/"/.test(html) && /href="\/ai-explained\/guides\/"/.test(html), "it points to the glossary and the guides of the release");
  assert.ok(!/href="\/ai-explained\/v\d+-/.test(html), "it links to no folder of an old version");
});

test("every page of every older version loads the version dropdown from versions/", () => {
  const files = [];
  folders().forEach((id) => pagesIn("versions/" + id).forEach((f) => files.push([f, "../".repeat(f.split("/").length - 2)])));
  assert.ok(files.length > 1000, "found the pages");
  files.forEach(([f, up]) => {
    const html = read(f);
    assert.ok(html.includes('<script src="' + up + 'versions.js"></script>'), f + " must load " + up + "versions.js");
    assert.ok(html.includes('<script src="' + up + 'version-switcher.js"></script>'), f + " must load " + up + "version-switcher.js");
    assert.ok(html.indexOf("versions.js") < html.indexOf("version-switcher.js"), f + ": versions.js comes first");
    assert.ok(html.includes('class="bar-actions"') || html.includes("data-version-slot"), f + " has no header to put the dropdown in");
  });
});

test("every page of the main version loads the version dropdown from versions/", () => {
  const files = ["index.html"].concat(["story", "technical", "glossary", "guides", "about"].flatMap((d) => pagesIn(d)));
  assert.ok(files.length > 190, "found the pages");
  files.forEach((f) => {
    const up = "../".repeat(f.split("/").length - 1) + "versions/";
    const html = read(f);
    assert.ok(html.includes('<script src="' + up + 'versions.js"></script>'), f + " must load " + up + "versions.js");
    assert.ok(html.includes('<script src="' + up + 'version-switcher.js"></script>'), f + " must load " + up + "version-switcher.js");
    assert.ok(html.indexOf("versions.js") < html.indexOf("version-switcher.js"), f + ": versions.js comes first");
  });
});

test("the dropdown keeps a page when both versions have it, and falls back to the start page of the other version", () => {
  const list = versions(), t = switcher.target;
  const main = list[0].id;
  assert.equal(t(list, "v6-alpha", "terms/skills/", "", "v5-alpha"), "v5-alpha/terms/skills/");
  assert.equal(t(list, "v6-alpha", "guides/build/", "", "v4-alpha"), "v4-alpha/guides/build/");
  assert.equal(t(list, "v6-alpha", "terms/skills/", "", "v3-alpha"), "v3-alpha/");
  assert.equal(t(list, "v6-alpha", "", "#ch-3", "v3-alpha"), "v3-alpha/#ch-3");
  assert.equal(t(list, "v5-alpha", "", "#map", "v6-alpha"), "v6-alpha/#map");
  assert.equal(t(list, "v6-alpha", "", "#ch-3", "v1-alpha"), "v1-alpha/");
  assert.equal(t(list, "v1-alpha", "", "#block-mcp", "v6-alpha"), "v6-alpha/");
  assert.equal(t(list, "v6-alpha", "", "", "v6-alpha"), "v6-alpha/");
  // The main version is the site root, one level up from versions/.
  assert.equal(t(list, "v17-alpha", "", "", main), "../");
  assert.equal(t(list, "v17-alpha", "glossary/skills/", "", main), "../glossary/skills/");
  assert.equal(t(list, main, "guides/secure/", "", "v16-alpha"), "v16-alpha/guides/secure/");
  assert.equal(t(list, main, "glossary/skills/", "", "v14-alpha"), "v14-alpha/");
  assert.equal(t(list, main, "", "#ch-3", "v17-alpha"), "v17-alpha/#ch-3");
  assert.equal(t(list, "v8-alpha", "", "#ch-3", main), "../#ch-3");
  assert.equal(t(list, "v1-alpha", "", "#ch-3", main), "../");
  assert.equal(t(list, main, "", "", main), "../");
  assert.equal(switcher.short("v6-alpha"), "v6");
  assert.equal(switcher.short("v10-beta"), "v10");
  assert.equal(switcher.short("v1.0.0"), "v1.0.0");
});

test("the dropdown knows which version a page belongs to", () => {
  const list = versions(), w = switcher.where, main = list[0].id;
  assert.deepEqual(w(list, "/ai-explained/", "/ai-explained/"), { id: main, rest: "" });
  assert.deepEqual(w(list, "/ai-explained/glossary/model/", "/ai-explained/"), { id: main, rest: "glossary/model/" });
  assert.deepEqual(w(list, "/ai-explained/story/index.html", "/ai-explained/"), { id: main, rest: "story/" });
  assert.deepEqual(w(list, "/ai-explained/versions/v6-alpha/terms/mcp/", "/ai-explained/"), { id: "v6-alpha", rest: "terms/mcp/" });
  assert.deepEqual(w(list, "/ai-explained/versions/v1-alpha/", "/ai-explained/"), { id: "v1-alpha", rest: "" });
  assert.deepEqual(w(list, "/versions/v9-alpha/", "/"), { id: "v9-alpha", rest: "" });
  assert.deepEqual(w(list, "/technical/", "/"), { id: main, rest: "technical/" });
});

test("archiving the release at the root leaves a folder whose pages still find the dropdown, the icon and the worker's shared files", () => {
  const os = require("node:os");
  const cp = require("node:child_process");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ae-archive-"));
  try {
    for (const f of ["versions.js", "version-switcher.js", "version-switcher.css", "favicon.svg"]) {
      fs.mkdirSync(path.join(tmp, "versions"), { recursive: true });
      fs.writeFileSync(path.join(tmp, "versions", f), "/* stand-in */");
    }
    const out = path.join(tmp, "versions", "v1.0.0");
    cp.execFileSync("node", [path.join(root, "scripts/archive-release.js"), "v1.0.0", "--out", out], { stdio: "pipe" });
    // refuses to overwrite an archived release
    assert.throws(() => cp.execFileSync("node", [path.join(root, "scripts/archive-release.js"), "v1.0.0", "--out", out], { stdio: "pipe" }));
    const pages = [];
    (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!["assets"].includes(e.name)) walk(p); } else if (e.name.endsWith(".html")) pages.push(p); } })(out);
    assert.ok(pages.length > 100, "the archived site has its pages");
    for (const p of pages) {
      const html = fs.readFileSync(p, "utf8");
      for (const m of html.matchAll(/(?:src|href)="((?:\.\.\/)*)(versions\.js|version-switcher\.js|version-switcher\.css|favicon\.svg)"/g)) {
        assert.ok(fs.existsSync(path.resolve(path.dirname(p), m[1] + m[2])), path.relative(out, p) + " cannot find " + m[1] + m[2]);
      }
      assert.ok(!/(?:src|href)="(?:\.\.\/)*versions\//.test(html), path.relative(out, p) + " still names versions/ as in the root");
      assert.ok(!html.includes("ai-explained/glossary/") || html.includes("ai-explained/versions/v1.0.0/"), path.relative(out, p) + " keeps a root address");
    }
    const sw = fs.readFileSync(path.join(out, "sw.js"), "utf8");
    assert.ok(sw.includes('"../versions.js"') && !sw.includes('"versions/versions.js"'), "the worker names the shared files one level up");
    assert.ok(fs.existsSync(path.join(out, "README.md")));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
