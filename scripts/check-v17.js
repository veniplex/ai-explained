#!/usr/bin/env node
/* Content checks for v17-alpha: the kitchen story and the technical deep dive, with a glossary, guides and an about page shared by both.
   - the content: the rules of check-v4.js for the technical voice (word budgets, links, sources), without the kitchen voice of the chapters, the guides
     and the small texts (the kitchen is only in the story and in the glossary);
   - the story: the rules of check-v9.js (steps, things, voice of every caption, names over the kitchen);
   - the glossary and the long guides (v17-content.js): every term has an icon that icons.js draws, a kitchen sentence, a place in the kitchen, a detailed
     description, references, and links that resolve;
   - the bridge between story and glossary: every name of the kitchen is a term with a glossary page and sits in the chapter the deep dive puts it in, every
     term is named over the kitchen, every bold word in a caption leads to a term (data/bridges.js);
   - the kitchen stays where it belongs: only the glossary pages load a kitchen script, drawing or text; the technical deep dive, the guides, the about page
     and the hover cards do not, and their text does not name the kitchen;
   - the top bar is the same everywhere: the brand, the five places, the search, the GitHub button, the theme button and the menu (the same places, for a narrow window), with the
     version tab hanging under the bar; every page links the manifest and loads pwa.js, and every page that can be long loads totop.js;
   - the app: manifest.webmanifest names icons that exist, sw.js sits in the folder (its scope), makes no request to another site, and its cache name and list are current;
   - the theme is set by one script (theme.js, first in the head) with three choices; the one request to a third party is the star count (github.js), nothing else fetches;
   - the search index and the hover texts are current (build-v17-pages.js), and every page is where the build says it is;
   - nothing in the folder refers to another version (the dropdown's two scripts are the only way out), and nothing is requested from outside the folder.
   Run from the repository root: node scripts/check-v17.js */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const v9 = require("./check-v9.js");
const v4 = require("./check-v4.js");
const build = require("./build-v17-pages.js");
const content = require("./v17-content.js");

const DIR = "v17-alpha";
const SECTIONS = ["story", "technical", "guides", "glossary", "about"];
const PLACES = SECTIONS;
// The guides of v17: the four long ones, the table, the build guide and the reading list (v4 allowed five).
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
    else if (chapterOf[n.id] !== n.ch) err("name " + n.id + ": the story puts it in chapter " + n.ch + ", the deep dive in chapter " + chapterOf[n.id]);
    if (!fs.existsSync(path.join(root, DIR, "glossary", n.id, "index.html"))) err("name " + n.id + ": glossary/" + n.id + "/index.html does not exist");
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
// The one exception: github.js asks the public GitHub API for the number of stars of this repository (GET, no cookies); it may name that one address and nothing
// else may fetch, send or open a connection.
const STARS_API = "https://api.github.com/repos/veniplex/ai-explained";
function outsideChecks(root) {
  const errors = [], all = walk(path.join(root, DIR));
  all.filter((f) => /assets\/css\/.*\.css$/.test(f) || /assets\/js\/[^/]+\.js$/.test(f)).forEach((f) => {
    const rel = path.relative(root, f), isStars = rel === DIR + "/assets/js/github.js";
    let src = fs.readFileSync(f, "utf8").replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "");
    if (isStars) {
      if (!src.includes(STARS_API)) errors.push(rel + ": must ask " + STARS_API);
      src = src.split(STARS_API).join("");
    }
    if (/https?:\/\/[a-z0-9]/i.test(src) || /@import/.test(src)) errors.push(rel + ": must not load or name anything outside the folder");
    if (!isStars && /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource)\b/.test(src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, ""))) errors.push(rel + ": makes a request; only github.js may (the star count)");
  });
  // The app's two files name nothing outside the folder either; the worker may fetch, but only what the page asked for (it never names an address).
  ["sw.js", "manifest.webmanifest"].forEach((f) => {
    const src = fs.readFileSync(path.join(root, DIR, f), "utf8");
    if (/https?:\/\/[a-z0-9]/i.test(src)) errors.push(DIR + "/" + f + ": names an address outside the folder");
  });
  try {
    const m = JSON.parse(fs.readFileSync(path.join(root, DIR, "manifest.webmanifest"), "utf8"));
    if (m.scope !== "./" || m.start_url !== "./" || m.display !== "standalone") errors.push("manifest.webmanifest: scope and start_url ./ and display standalone");
    if (!(m.icons || []).some((i) => i.sizes === "192x192") || !(m.icons || []).some((i) => i.sizes === "512x512" && i.purpose === "maskable")) errors.push("manifest.webmanifest: needs a 192 icon and a 512 maskable icon");
    (m.icons || []).concat(...(m.shortcuts || []).map((x) => x.icons || [])).forEach((i) => { if (!fs.existsSync(path.join(root, DIR, i.src))) errors.push("manifest.webmanifest: " + i.src + " does not exist"); });
  } catch (e) { errors.push("manifest.webmanifest: " + e.message); }
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

// The kitchen scripts: the pen, the drawings, the kitchen, the story, the names and the kitchen sentences.
const KITCHEN_SCRIPTS = /assets\/js\/(draw|locator|kitchen|data\/(props-[a-z-]+|kitchen|story|names|bridges|voice-glossary-kitchen))\.js|assets\/js\/props\.js/;
const pageFiles = (root) => ["index.html", "story/index.html", "technical/index.html"].concat(Object.keys(build.pages(root)).filter((f) => f.endsWith(".html")).map((f) => f.slice(DIR.length + 1)));

// Every page and the top bar.
function pageChecks(root) {
  const errors = [], err = (m) => errors.push(m), read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  const files = pageFiles(root);
  files.forEach((f) => {
    const html = read(f), dir = path.dirname(path.join(root, DIR, f));
    // Every script, stylesheet and font of a page exists.
    for (const m of html.matchAll(/<(?:script src|link rel="(?:stylesheet|preload)"[^>]*href)="([^"]+)"/g)) {
      if (!fs.existsSync(path.join(dir, m[1]))) err(f + ": " + m[1] + " does not exist");
    }
    // The top bar: brand, the four places, the search, the GitHub button, the theme button, the menu (About and the version button's place).
    const barLinks = (html.match(/<nav class="bar-links"[\s\S]*?<\/nav>/) || [""])[0], panel = (html.match(/<nav class="site-menu-panel"[\s\S]*?<\/nav>/) || [""])[0];
    const secsOf = (h) => Array.from(h.matchAll(/data-sec="([a-z]+)"/g)).map((m) => m[1]).join();
    if (secsOf(barLinks) !== PLACES.join()) err(f + ": the bar needs the places " + PLACES.join(", ") + " (got " + secsOf(barLinks) + ")");
    if (secsOf(panel) !== SECTIONS.join()) err(f + ": the menu needs the sections " + SECTIONS.join(", ") + " (got " + secsOf(panel) + ")");
    if (!/<details class="site-menu" id="site-menu">/.test(html) || !/<nav class="site-menu-panel" aria-label="Menu">/.test(html)) err(f + ": no menu in the top bar");
    if (!/<div class="version-tab" data-version-slot><\/div>\s*<\/header>/.test(html)) err(f + ": the bar has no place for the version tab (data-version-slot), at the end of the header");
    if (!/<div class="menu-foot" data-version-menu><\/div>\s*<\/nav>/.test(html)) err(f + ": the menu needs a foot for the version button on a phone (data-version-menu)");
    if (/menu-more/.test(html)) err(f + ": the menu is one list again (About is a place like the others)");
    // The app: a manifest, an icon for the home screen, and the script that registers the service worker, on every page; the button to the top on every page that can be long.
    if (!/<link rel="manifest" href="(\.\.\/)*manifest\.webmanifest">/.test(html)) err(f + ": links no manifest");
    if (!/<link rel="apple-touch-icon" href="(\.\.\/)*assets\/icons\/apple-touch-icon\.png">/.test(html)) err(f + ": no apple-touch-icon");
    if (!/<script src="(\.\.\/)*assets\/js\/pwa\.js"><\/script>/.test(html)) err(f + ": loads no pwa.js");
    if (f !== "story/index.html" && !/<script src="(\.\.\/)*assets\/js\/totop\.js"><\/script>/.test(html)) err(f + ": loads no totop.js (the button to the top)");
    if (/<nav class="sections"/.test(html)) err(f + ": the row of sections is back");
    ["id=\"search\"", "id=\"site-search\"", "id=\"search-results\"", "id=\"theme-toggle\"", "id=\"gh-pill\"", "id=\"gh-stars\"", "id=\"gh-count\"", 'class="bar-actions"'].forEach((x) => { if (!html.includes(x)) err(f + ": the top bar needs " + x); });
    if (!/id="gh-pill" href="https:\/\/github\.com\/veniplex\/ai-explained" target="_blank" rel="noopener"/.test(html)) err(f + ": the GitHub button must open the repository in a new tab with rel=noopener");
    if (!/<head>[\s\S]*?<script src="(\.\.\/)*assets\/js\/theme\.js"><\/script>[\s\S]*?<\/head>/.test(html)) err(f + ": theme.js must be loaded in the head, before the first paint");
    if (/localStorage/.test(html.replace(/<noscript>[\s\S]*?<\/noscript>/g, ""))) err(f + ": no inline script touches the theme any more (theme.js does)");
    if (!/<script src="(\.\.\/)*assets\/js\/github\.js"><\/script>/.test(html)) err(f + ": loads no github.js");
    const iconCount = ["theme-icon-system", "theme-icon-light", "theme-icon-dark"].filter((c) => html.includes(c)).length;
    if (iconCount !== 3) err(f + ": the theme button needs the three icons (system, light, dark)");
    const current = (html.match(/data-sec="[a-z]+"[^>]*aria-current="page"/g) || []).length, perBar = [barLinks, panel].map((h) => (h.match(/aria-current="page"/g) || []).length);
    const inBar = 1;
    if (f === "index.html" ? current !== 0 : (perBar[1] !== 1 || perBar[0] !== inBar)) err(f + ": " + (f === "index.html" ? "the start page is in no section" : "the page's section is the current one, once in the bar and once in the menu") + " (found " + perBar.join("/") + ")");
    if (!/<script src="(\.\.\/)*versions\.js"><\/script>\s*<script src="(\.\.\/)*version-switcher\.js"><\/script>\s*<\/body>/.test(html)) err(f + ": versions.js and version-switcher.js must come last");
    if (!/<script src="[^"]*assets\/js\/search\.js"><\/script>/.test(html)) err(f + ": loads no search.js");
    if (f !== "story/index.html" && /data-mode|data-path|data-mode-set|mode-slot|class="place"/.test(html)) err(f + ": a voice or a way is fixed by the page again (no data-mode, no data-path)");
    // Only the pages of a glossary term and the glossary index load the kitchen.
    const kitchenPage = /^glossary\/(.+\/)?index\.html$/.test(f) || f === "story/index.html";
    if (!kitchenPage && KITCHEN_SCRIPTS.test(html)) err(f + ": loads a kitchen script (" + html.match(KITCHEN_SCRIPTS)[0] + "); only the story and the glossary may");
    if (/^glossary\/[^/]+\/index\.html$/.test(f) && (!/assets\/js\/locator\.js/.test(html) || !/assets\/js\/data\/voice-glossary-kitchen\.js/.test(html))) err(f + ": a term page needs locator.js and the kitchen sentences");
  });
  // The top bar is the same on every page: the same markup once the paths and the current section are taken out.
  const bars = files.map((f) => {
    const h = (read(f).match(/<header class="bar">[\s\S]*?<\/header>/) || [""])[0];
    return [f, h.replace(/(href|src)="(\.\.\/)*(?=(story|technical|guides|glossary|about)\/|")/g, '$1="').replace(/ aria-current="page"/g, "").replace(/href="\.\/"/g, 'href=""')];
  });
  bars.forEach(([f, h]) => { if (h !== bars[0][1]) err(f + ": the top bar differs from the one of " + bars[0][0]); });
  // The page scripts do not switch voices.
  ["assets/js/app.js", "assets/js/pages.js", "assets/js/story.js", "assets/js/sketch.js"].forEach((f) => {
    if (/modeSwitch|modeSet|data-mode-set|ae10-mode|ae14-path|ae-theme/.test(read(f))) err(f + ": there is one voice outside the glossary; no switch");
  });
  // The scripts of the deep dive, the guides, the hover cards and the search never name the kitchen.
  ["assets/js/popover.js", "assets/js/story.js", "assets/js/nav.js"].forEach((f) => {
    if (/kitchen/i.test(read(f))) err(f + ": names the kitchen; only the story, the glossary and the menu do");
  });
  return errors;
}

// The kitchen words outside the story and the glossary: not in the text of the deep dive, the guides and the about page. The menu names the story, and
// the about page may say what the story is.
function wayChecks(root) {
  const errors = [], read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  Object.keys(build.pages(root)).filter((f) => f.endsWith(".html")).forEach((f) => {
    const rel = f.slice(DIR.length + 1);
    if (!/^guides\//.test(rel)) return;
    const text = read(rel).replace(/<nav class="(site-menu-panel|bar-links)"[\s\S]*?<\/nav>/g, "").replace(/<title>[\s\S]*?<\/title>|<head>[\s\S]*<\/head>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
    if (/\b(kitchen|chef|restaurant)\b/i.test(text)) errors.push(rel + ": the page text names the kitchen");
    if (/href="(\.\.\/)+story\//.test(text)) errors.push(rel + ": a guide links into the story outside the top bar");
  });
  const tech = read("technical/index.html").replace(/<nav class="(site-menu-panel|bar-links)"[\s\S]*?<\/nav>/g, "").replace(/<head>[\s\S]*<\/head>/, "").replace(/<script[\s\S]*?<\/script>/g, "");
  if (/\b(kitchen|chef|restaurant)\b/i.test(tech)) errors.push("technical/index.html: the page text names the kitchen");
  // The data the deep dive and the guides read: the voice files hold no kitchen picture.
  ["voice-tech.js", "voice-ui-tech.js", "voice-guides-long-tech-a.js", "voice-guides-long-tech-b.js", "voice-guides-long-tech-c.js", "voice-guides-long-tech-d.js", "glance.js"].forEach((f) => {
    // Ids such as chef or kitchen-ops are keys; the words are the values.
    const src = read("assets/js/data/" + f).replace(/^\/\*[\s\S]*?\*\//, "").split("\n").filter((l) => !/^\s*"?[\w-]+"?\s*:\s*\{\s*$/.test(l)).join("\n");
    if (/\b(kitchen|chef|restaurant)\b/i.test(src)) errors.push("assets/js/data/" + f + ": names the kitchen");
  });
  return errors;
}

// What v17 adds: the glossary (>= 180 terms with the main terms), the icons that draw every name, the long guides, and the files the pages need.
function glossaryChecks(root) {
  const errors = content.check(root), read = (f) => fs.readFileSync(path.join(root, DIR, f), "utf8");
  const A = content.load(root), count = Object.keys(A.entries).length + A.glossary.length;
  if (count < 180) errors.push("glossary: " + count + " terms with the main terms, the start page promises over 180");
  ["assets/js/icons.js", "assets/js/terms.js", "assets/css/pages.css"].forEach((f) => { if (!fs.existsSync(path.join(root, DIR, f))) errors.push(f + " does not exist"); });
  const icons = fs.existsSync(path.join(root, DIR, "assets/js/icons.js")) ? read("assets/js/icons.js") : "";
  content.ICONS.forEach((n) => { if (!new RegExp("(^|[\\s,{])\"?" + n + "\"?\\s*:").test(icons)) errors.push("icons.js: no drawing for the icon " + n); });
  const guides = fs.readdirSync(path.join(root, DIR, "guides"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  if (guides.join() !== A.guideList.map((g) => g.id).sort().join()) errors.push("guides: the pages " + guides.join(", ") + " do not match guideList");
  return errors;
}

// The generated pages, the search index and the hover texts are current.
function generatedChecks(root) {
  const problems = build.stale(root);
  return problems.length ? problems.concat(["run: node scripts/build-v17-pages.js"]) : [];
}

function check(root) {
  let errors = [];
  // the guides of v17 are checked by v17-content.js
  try { errors = errors.concat(v4.check(null, v4.loadV4(root, DIR), { techOnly: true }).filter((e) => !/^tech\.guides\.\w+: missing lede$/.test(e))); } catch (e) { errors.push("content check crashed: " + e.message); }
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
