#!/usr/bin/env node
/* Content checks for v14-alpha: the kitchen story, the kitchen deep dive and the technical deep dive in one version.
   - the content: the rules of check-v4.js (both voices, word budgets, links, sources), without the v1 mapping v14 no longer has;
   - the story: the rules of check-v9.js (steps, things, voice of every caption, names over the kitchen);
   - the glossary and the long guides (v14-content.js): every term has an icon that icons.js draws, a kitchen sentence and links that resolve;
   - the bridge between story and deep dives: every name of the kitchen is a term with a glossary page in both deep dives and sits in the chapter the deep
     dives put it in, every term is named over the kitchen, every bold word in a caption leads to a term (data/bridges.js);
   - the three ways stay apart: the technical deep dive loads no kitchen drawing, script or data (the picture is not even in its pages), and the pages of one way
     link only inside it (its glossary, its guides), apart from the menu, the "twin" link of a kitchen page and the story's links;
   - the top bar is the same everywhere: the menu with the same six sections, the search in the middle, the version dropdown's place;
   - the search index and the hover texts are current (build-v14-pages.js), and every page is where the build says it is;
   - nothing in the folder refers to another version (the dropdown's two scripts are the only way out), and nothing is requested from outside the folder.
   Run from the repository root: node scripts/check-v14.js */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const v9 = require("./check-v9.js");
const v4 = require("./check-v4.js");
const build = require("./build-v14-pages.js");
const content = require("./v14-content.js");

const DIR = "v14-alpha";
const SECTIONS = ["story", "kitchen", "technical", "guides", "glossary", "about"];
// The guides of v14: the four long ones, the table, the build guide and the reading list (v4 allowed five).
v4.LIMITS.guides = 7;

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === "vendor" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);

// The bridges of the kitchen story, loaded as the browser does.
function loadBridges(root) {
  const sandbox = { window: { COMIC: {} } };
  vm.runInNewContext(fs.readFileSync(path.join(root, DIR, "assets/js/data/bridges.js"), "utf8"), sandbox);
  return sandbox.window.COMIC.bridges;
}

function bridgeChecks(root) {
  const errors = [], err = (m) => errors.push(m);
  const C = v9.load(root, DIR), D = v4.loadV4(root, DIR), bridges = loadBridges(root);
  const chapterOf = {};
  D.chapters.forEach((c) => c.entries.forEach((id) => { chapterOf[id] = c.n; }));

  C.names.forEach((n) => {
    if (!D.entries[n.id]) err("name " + n.id + ": no such term");
    else if (chapterOf[n.id] !== n.ch) err("name " + n.id + ": the story puts it in chapter " + n.ch + ", the deep dives in chapter " + chapterOf[n.id]);
    ["kitchen", "technical"].forEach((way) => {
      if (!fs.existsSync(path.join(root, DIR, way, "glossary", n.id, "index.html"))) err("name " + n.id + ": " + way + "/glossary/" + n.id + "/index.html does not exist");
    });
  });
  Object.keys(D.entries).forEach((id) => { if (!C.names.some((n) => n.id === id)) err("term " + id + ": not named over the kitchen, so its page cannot show where it sits"); });

  Object.keys(bridges).forEach((w) => {
    if (w !== w.toLowerCase()) err("bridge " + w + ": the key must be lower case");
    if (!D.entries[bridges[w]]) err("bridge " + w + ": no term called " + bridges[w]);
  });
  C.steps.forEach((s) => {
    if (s.map !== undefined) return;
    (String(s.cap).match(/\*\*[^*]+\*\*/g) || []).forEach((b) => {
      const w = b.slice(2, -2).toLowerCase();
      if (!bridges[w]) err("step " + s.id + ": the bold word \"" + w + "\" has no bridge in data/bridges.js");
    });
  });
  const used = new Set();
  C.steps.forEach((s) => (String(s.cap).match(/\*\*[^*]+\*\*/g) || []).forEach((b) => used.add(b.slice(2, -2).toLowerCase())));
  Object.keys(bridges).forEach((w) => { if (!used.has(w)) err("bridge " + w + ": no caption uses it any more"); });
  return errors;
}

// Nothing is requested from outside the folder: no http(s) address in the stylesheets or in the scripts of the pages (the data files hold the
// links of the sources and are the content), no @import, and no remote script, stylesheet, image or font in any page.
function outsideChecks(root) {
  const errors = [], all = walk(path.join(root, DIR));
  all.filter((f) => /assets\/css\/.*\.css$/.test(f) || /assets\/js\/[^/]+\.js$/.test(f)).forEach((f) => {
    const src = fs.readFileSync(f, "utf8").replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "");
    if (/https?:\/\/[a-z0-9]/i.test(src) || /@import/.test(src)) errors.push(path.relative(root, f) + ": must not load or name anything outside the folder");
  });
  all.filter((f) => /\.html$/.test(f)).forEach((f) => {
    const html = fs.readFileSync(f, "utf8");
    if (/<(script|img|iframe|source|video|audio|embed)\b[^>]*\bsrc="(https?:)?\/\//.test(html) || /<link\b[^>]*rel="(stylesheet|preload|icon)"[^>]*href="(https?:)?\/\//.test(html)) errors.push(path.relative(root, f) + ": loads something from outside");
  });
  return errors;
}

// Each version is for itself: no other version is named or linked in the folder. The two scripts of the version dropdown (../versions.js and
// ../version-switcher.js, at the end of every page) are the only reference to the rest of the repository.
function selfContained(root) {
  const errors = [];
  walk(path.join(root, DIR)).filter((f) => /\.(html|js|css|md)$/.test(f)).forEach((f) => {
    const rel = path.relative(root, f), text = fs.readFileSync(f, "utf8");
    const named = (text.match(/\bv\d+-(alpha|beta)\b/g) || []).filter((v) => v !== DIR);
    if (named.length) errors.push(rel + ": names another version (" + Array.from(new Set(named)).join(", ") + ")");
    if (/\.html$/.test(f)) {
      for (const m of text.matchAll(/(?:href|src)="((?:\.\.\/)+)([^"]*)"/g)) {
        const depth = (rel.split("/").length - 1), ups = m[1].length / 3, rest = m[2];
        // From the page up to the folder of the version, and one more up: the repository root. Nothing else may leave the folder.
        if (ups > depth + 1 || (ups === depth + 1 && !/^(versions\.js|version-switcher\.js|favicon\.svg|og\.png)$/.test(rest))) errors.push(rel + ": leaves the folder: " + m[0]);
      }
    }
  });
  return errors;
}

// The page of every way and the top bar.
function pageChecks(root) {
  const errors = [], err = (m) => errors.push(m), read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  const files = ["index.html", "story/index.html", "kitchen/index.html", "technical/index.html"]
    .concat(Object.keys(build.pages(root)).filter((f) => f.endsWith(".html")).map((f) => f.slice(DIR.length + 1)));
  files.forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, DIR, f));
    // Every script, stylesheet and font of a page exists.
    for (const m of html.matchAll(/<(?:script src|link rel="(?:stylesheet|preload)"[^>]*href)="([^"]+)"/g)) {
      if (!fs.existsSync(path.join(dir, m[1]))) err(f + ": " + m[1] + " does not exist");
    }
    // The top bar: the menu with the same six sections, the search, the actions, the dropdown scripts last.
    const secs = Array.from(html.matchAll(/data-sec="([a-z]+)"/g)).map((m) => m[1]);
    if (secs.join() !== SECTIONS.join()) err(f + ": the menu needs the sections " + SECTIONS.join(", ") + " (got " + secs.join(", ") + ")");
    if (!/<details class="site-menu" id="site-menu">/.test(html) || !/<nav class="site-menu-panel" aria-label="Sections">/.test(html)) err(f + ": no menu in the top bar");
    if (/<nav class="sections"/.test(html)) err(f + ": the row of sections is back (they are behind the menu)");
    ["id=\"search\"", "id=\"site-search\"", "id=\"search-results\"", "id=\"theme-toggle\"", 'class="bar-actions"'].forEach((s) => { if (!html.includes(s)) err(f + ": the top bar needs " + s); });
    const current = (html.match(/data-sec="[a-z]+"[^>]*aria-current="page"/g) || []).length;
    if (current !== (f === "index.html" ? 0 : 1)) err(f + ": " + (f === "index.html" ? "the start page is in no section" : "exactly one section is the current one") + " (found " + current + ")");
    if (!/<script src="(\.\.\/)*versions\.js"><\/script>\s*<script src="(\.\.\/)*version-switcher\.js"><\/script>\s*<\/body>/.test(html)) err(f + ": versions.js and version-switcher.js must come last");
    if (!/<script src="[^"]*assets\/js\/search\.js"><\/script>/.test(html)) err(f + ": loads no search.js");
    if (/data-mode-set|mode-slot|class="place"/.test(html)) err(f + ": a switch between voices or halves is back");
  });

  // The technical way has no picture and no kitchen data: no drawing script, no kitchen or story list, no locator, no kitchen voice, no way back to the story.
  const KITCHEN_SCRIPTS = /assets\/js\/(draw|props|locator|kitchen|data\/(props-[a-z-]+|kitchen|story|names|bridges|voice-(kitchen-[ab]|ui-kitchen|guides-kitchen)|glance-kitchen|search-index-kitchen))\.js/;
  files.filter((f) => f.startsWith("technical/")).forEach((f) => {
    const html = read(f);
    if (KITCHEN_SCRIPTS.test(html)) err(f + ": the technical way loads a kitchen script (" + html.match(KITCHEN_SCRIPTS)[0] + ")");
    if (/<html[^>]*data-mode="kitchen"/.test(html) || !/<html[^>]*data-mode="technical"/.test(html)) err(f + ": needs data-mode=\"technical\"");
    if (!/data-path="technical"/.test(html)) err(f + ": needs data-path=\"technical\"");
  });
  files.filter((f) => f.startsWith("kitchen/")).forEach((f) => {
    const html = read(f);
    if (!/<html[^>]*data-mode="kitchen"/.test(html) || !/data-path="kitchen"/.test(html)) err(f + ": needs data-mode and data-path \"kitchen\"");
  });
  // The page scripts do not switch voices, and the technical deep dive's own scripts never draw the kitchen.
  ["assets/js/app.js", "assets/js/pages.js", "assets/js/story.js", "assets/js/sketch.js"].forEach((f) => {
    if (/modeSwitch|modeSet|data-mode-set|ae10-mode/.test(read(f))) err(f + ": the voice is fixed by the page now; no switch");
  });
  return errors;
}

// The kitchen words in the technical way: not in its pages' text (the content lint covers the data), and the glossary and guides of a way link inside it.
function wayChecks(root) {
  const errors = [], read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  Object.keys(build.pages(root)).filter((f) => f.endsWith(".html")).forEach((f) => {
    const rel = f.slice(DIR.length + 1), way = rel.split("/")[0], html = read(rel);
    const other = way === "kitchen" ? "technical" : "kitchen";
    // Links to the other way are the menu's own and, on a kitchen term page, the twin link, which the script makes.
    const text = html.replace(/<nav class="site-menu-panel"[\s\S]*?<\/nav>/, "");
    if (new RegExp('href="(\\.\\./)+' + other + '/').test(text)) errors.push(rel + ": links into the " + other + " way outside the top bar");
    if (way === "technical" && /\b(kitchen|chef|restaurant)\b/i.test(text.replace(/<title>[\s\S]*?<\/title>|<head>[\s\S]*<\/head>/g, "").replace(/<script[\s\S]*?<\/script>/g, ""))) errors.push(rel + ": the technical way's page text names the kitchen");
  });
  return errors;
}

// What v14 adds: the glossary (>= 180 terms with the main terms), the icons that draw every name, the long guides, and the files the pages need.
function glossaryChecks(root) {
  const errors = content.check(root), read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  const A = content.load(root), count = Object.keys(A.entries).length + A.glossary.length;
  if (count < 180) errors.push("glossary: " + count + " terms with the main terms, the start page promises over 180");
  ["assets/js/icons.js", "assets/js/terms.js", "assets/css/pages.css"].forEach((f) => { if (!fs.existsSync(path.join(root, DIR, f))) errors.push(f + " does not exist"); });
  const icons = fs.existsSync(path.join(root, DIR, "assets/js/icons.js")) ? read("assets/js/icons.js") : "";
  content.ICONS.forEach((n) => { if (!new RegExp("(^|[\\s,{])\"?" + n + "\"?\\s*:").test(icons)) errors.push("icons.js: no drawing for the icon " + n); });
  const guides = fs.readdirSync(path.join(root, DIR, "kitchen/guides"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  if (guides.join() !== A.guideList.map((g) => g.id).sort().join()) errors.push("guides: the pages " + guides.join(", ") + " do not match guideList");
  return errors;
}

// The generated pages, the search index and the hover texts are current.
function generatedChecks(root) {
  const problems = build.stale(root);
  return problems.length ? problems.concat(["run: node scripts/build-v14-pages.js"]) : [];
}

function check(root) {
  let errors = [];
  try { errors = errors.concat(v4.check(null, v4.loadV4(root, DIR))); } catch (e) { errors.push("content check crashed: " + e.message); }
  try { errors = errors.concat(v9.check(root, { dir: DIR, terms: DIR, scan: false })); } catch (e) { errors.push("story check crashed: " + e.message); }
  if (errors.length) return errors;
  [glossaryChecks, bridgeChecks, outsideChecks, selfContained, pageChecks, wayChecks, generatedChecks].forEach((fn) => {
    try { errors = errors.concat(fn(root)); } catch (e) { errors.push(fn.name + " crashed: " + e.message); }
  });
  return errors;
}

function main() {
  const errors = check(path.resolve(__dirname, ".."));
  if (errors.length) { console.error(errors.length + " problem(s):\n- " + errors.join("\n- ")); process.exit(1); }
  console.log(DIR + " content checks passed.");
}

module.exports = { check, glossaryChecks, bridgeChecks, outsideChecks, selfContained, pageChecks, wayChecks, generatedChecks, loadBridges, DIR, SECTIONS };
if (require.main === module) main();
