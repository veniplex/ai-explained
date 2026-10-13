"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { check, selfContained, wayChecks, SECTIONS } = require("./check-v16.js");
const { pages, stale } = require("./build-v16-pages.js");
const content = require("./v16-content.js");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, "v16-alpha", f), "utf8");
const TRAIL = '<script src="%versions.js"></script>\\s*<script src="%version-switcher.js"></script>\\s*</body>';

test("v16-alpha passes the content checks (voices, story, bridges, kitchen only where it belongs, top bar, generated files, self-containment)", () => {
  assert.deepEqual(check(root), []);
});

test("every term of the glossary has a page, and so has every guide, and the generated files are current", () => {
  const D = content.load(root), ids = Object.keys(D.entries).concat(D.glossary.map((g) => g.id));
  assert.ok(ids.length >= 180, "the start page promises over 180 terms");
  ids.forEach((id) => assert.ok(fs.existsSync(path.join(root, "v16-alpha", "glossary", id, "index.html")), "glossary/" + id));
  D.guideList.forEach((g) => assert.ok(fs.existsSync(path.join(root, "v16-alpha", "guides", g.id, "index.html")), "guides/" + g.id));
  ["glossary", "guides", "about"].forEach((d) => assert.ok(fs.existsSync(path.join(root, "v16-alpha", d, "index.html")), d));
  ["kitchen", "references"].forEach((d) => assert.ok(!fs.existsSync(path.join(root, "v16-alpha", d)), d + " is gone"));
  assert.deepEqual(stale(root), []);
});

test("every shell and generated page loads files that exist and the version dropdown from the right depth", () => {
  const files = Object.keys(pages(root)).map((f) => f.replace(/^v16-alpha\//, "")).concat(["index.html", "story/index.html", "technical/index.html"]);
  files.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, "v16-alpha", f)), depth = f.split("/").length - 1, up = "../".repeat(depth + 1);
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"#?]+)"/g)) assert.ok(fs.existsSync(path.join(dir, m[1])), f + ": " + m[1]);
    assert.match(html, new RegExp(TRAIL.replace(/%/g, up.replace(/\./g, "\\."))), f + ": versions.js and version-switcher.js come last");
    assert.ok(html.includes('class="bar-actions"'), f + " has no header to put the dropdown in");
  });
});

test("the top bar lists the same places and sections in the same order on every page, with the search in the middle", () => {
  ["index.html", "story/index.html", "glossary/skills/index.html", "guides/build/index.html", "technical/index.html"].forEach((p) => {
    const html = read(p), ids = [...html.matchAll(/data-sec="([a-z]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids, SECTIONS.slice(0, 4).concat(SECTIONS), p);
    assert.match(html, /id="gh-pill" href="https:\/\/github\.com\/veniplex\/ai-explained"/, p + ": the GitHub button");
    assert.ok(html.indexOf('class="bar-links"') < html.indexOf('id="site-search"') && html.indexOf('id="gh-pill"') > html.indexOf('id="site-search"'), p + ": places, then search, then the GitHub button");
    assert.match(html, /id="site-search"/, p + ": search field");
    assert.ok(html.indexOf('id="site-search"') < html.indexOf('class="bar-actions"'), p + ": search comes before the actions");
  });
});

test("only the story and the glossary load the kitchen; the deep dive, the guides and the about page do not name it", () => {
  const KITCHEN = /draw\.js|assets\/js\/props|js\/kitchen\.js|data\/(kitchen|story|names|bridges)\.js|locator\.js|voice-glossary-kitchen/;
  ["technical/index.html", "guides/index.html", "guides/context/index.html", "about/index.html"].forEach((p) => assert.doesNotMatch(read(p), KITCHEN, p));
  ["glossary/index.html", "glossary/mcp/index.html"].forEach((p) => assert.match(read(p), /voice-glossary-kitchen/, p));
  assert.deepEqual(wayChecks(root), []);
});

test("a term page carries the kitchen place, the sections in order, and its references", () => {
  const src = fs.readFileSync(path.join(root, "v16-alpha/assets/js/pages.js"), "utf8");
  const body = src.slice(src.indexOf("V3.locator ? V3.locator.section(t)"), src.indexOf("autolink(body, id)"));
  const order = ["V3.locator.section", "definition(t)", "relatedChips(t.related)", "detail(t)", "referencesOf(T.refs(id)"].map((x) => body.indexOf(x));
  order.forEach((i, n) => assert.ok(i >= 0, "the term page lacks part " + n));
  assert.deepEqual(order.slice().sort((a, b) => a - b), order, "the parts come in the order of the brief");
  ["Definition", "Related terms", "Detailed technical description", "References"].forEach((hd) => assert.ok(src.includes('"' + hd + '"'), hd));
  assert.doesNotMatch(src, /On Sunday|Want the real thing|build up/);
});

test("the start page links to both ways, the glossary and the guides; old root links are forwarded", () => {
  const html = read("index.html");
  ["story/", "technical/"].forEach((h) => assert.match(html, new RegExp('<a class="path-link" href="' + h + '"')));
  assert.match(html, /guides\//);
  assert.match(html, /glossary\//);
  assert.match(html, /#guide-/);
});

test("the hover texts and the search index cover every term of the glossary, in the technical voice only", () => {
  const D = content.load(root), all = Object.keys(D.entries).concat(D.glossary.map((x) => x.id));
  const g = read("assets/js/data/glance.js"), s = read("assets/js/data/search-index.js");
  all.forEach((id) => {
    assert.ok(g.includes('"' + id + '": {'), "glance: " + id);
    assert.ok(s.includes('"id":"' + id + '"'), "search index: " + id);
  });
  assert.match(g, /"t":"/);
  assert.doesNotMatch(g, /"k":"/, "glance holds a kitchen sentence");
});

test("a version named in v16's own files is reported", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ae16-"));
  fs.cpSync(path.join(root, "v16-alpha"), path.join(dir, "v16-alpha"), { recursive: true });
  fs.writeFileSync(path.join(dir, "v16-alpha/NOTES.md"), "builds on v12-alpha\n");
  const errors = selfContained(dir);
  assert.ok(errors.length > 0, "expected a report");
  fs.rmSync(dir, { recursive: true });
});

/* ---------- The theme and the star count: the two small scripts of the top bar ---------------------------------------- */
const vm = require("node:vm");
function fakeStorage(init) { const m = Object.assign({}, init); return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; }, m }; }
function fakeEl(extra) {
  const attrs = {};
  return Object.assign({ attrs, hidden: true, textContent: "", className: "", listeners: {}, setAttribute(k, v) { attrs[k] = v; }, getAttribute: (k) => attrs[k], addEventListener(t, f) { this.listeners[t] = f; } }, extra);
}

test("theme.js: System by default, then Light, Dark, System again; only Light and Dark are stored", () => {
  const run = (stored, dark) => {
    const root = fakeEl(), btn = fakeEl(), storage = fakeStorage(stored ? { "ae-theme": stored } : {}), mq = { matches: dark, addEventListener() {} };
    const sandbox = { window: { matchMedia: () => mq, addEventListener() {} }, localStorage: storage, document: { documentElement: root, readyState: "complete", getElementById: (id) => (id === "theme-toggle" ? btn : null) } };
    sandbox.window.document = sandbox.document;
    vm.runInNewContext(read("assets/js/theme.js"), sandbox);
    return { root, btn, storage };
  };
  let t = run(null, true);
  assert.equal(t.root.attrs["data-theme"], "dark");
  assert.equal(t.root.attrs["data-theme-pref"], "system");
  assert.match(t.btn.attrs["aria-label"], /System.*Light/);
  t.btn.listeners.click({ stopPropagation() {} });
  assert.equal(t.root.attrs["data-theme-pref"], "light");
  assert.equal(t.root.attrs["data-theme"], "light");
  assert.equal(t.storage.m["ae-theme"], "light");
  t.btn.listeners.click({ stopPropagation() {} });
  assert.equal(t.root.attrs["data-theme"], "dark");
  assert.equal(t.storage.m["ae-theme"], "dark");
  t.btn.listeners.click({ stopPropagation() {} });
  assert.equal(t.root.attrs["data-theme-pref"], "system");
  assert.ok(!("ae-theme" in t.storage.m), "System is stored as no choice at all");
  t = run("light", true);
  assert.equal(t.root.attrs["data-theme"], "light", "a saved choice wins over the system setting");
  t = run("nonsense", false);
  assert.equal(t.root.attrs["data-theme-pref"], "system", "an unknown saved value means System");
  assert.equal(t.root.attrs["data-theme"], "light");
});

test("github.js: shows the star count, shortened; a failed request leaves the count hidden", async () => {
  const run = async (reply, session) => {
    const pill = fakeEl({ hidden: false }), box = fakeEl(), out = fakeEl(), calls = [], store = fakeStorage(session || {});
    const els = { "gh-pill": pill, "gh-stars": box, "gh-count": out };
    const sandbox = { document: { getElementById: (id) => els[id] }, sessionStorage: store, Date, JSON, fetch: (url, opts) => { calls.push([url, opts]); return reply(); } };
    sandbox.window = { fetch: sandbox.fetch };
    vm.runInNewContext(read("assets/js/github.js"), sandbox);
    await new Promise((r) => setTimeout(r, 20));
    return { box, out, pill, calls, store };
  };
  const ok = (n) => () => Promise.resolve({ ok: true, json: () => Promise.resolve({ stargazers_count: n }) });
  let r = await run(ok(1234));
  assert.equal(r.calls.length, 1);
  assert.equal(r.calls[0][0], "https://api.github.com/repos/veniplex/ai-explained");
  assert.equal(r.calls[0][1].credentials, "omit");
  assert.equal(r.out.textContent, "1.2k");
  assert.equal(r.box.hidden, false);
  assert.match(r.pill.attrs["aria-label"], /1234 stars/);
  assert.equal((await run(ok(0))).out.textContent, "0");
  assert.equal((await run(ok(950))).out.textContent, "950");
  assert.equal((await run(ok(12500))).out.textContent, "12.5k");
  assert.equal((await run(ok(1000))).out.textContent, "1k");
  assert.equal((await run(ok(2000000))).out.textContent, "2M");
  r = await run(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }));
  assert.equal(r.box.hidden, true, "a rate limit hides the count");
  r = await run(() => Promise.reject(new Error("offline")));
  assert.equal(r.box.hidden, true, "offline hides the count");
  r = await run(ok(5), { "ae-stars": JSON.stringify({ n: 7, t: Date.now() }) });
  assert.equal(r.calls.length, 0, "a count kept for ten minutes is not asked for again");
  assert.equal(r.out.textContent, "7");
});
