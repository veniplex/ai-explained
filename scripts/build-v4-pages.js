#!/usr/bin/env node
/* Writes one small HTML page per term and per guide of v4-alpha, from v4-alpha/index.html:
     v4-alpha/terms/<id>/index.html   and   v4-alpha/guides/<id>/index.html
   (build-v5-pages.js does the same for v5-alpha.)
   The pages are the same shell as the home page with their own title, description and address,
   so a link shows a proper title and preview. app.js fills in the content from assets/js/data/.
   Run from the repository root:   node scripts/build-v4-pages.js          (write the pages)
                                   node scripts/build-v4-pages.js --check  (fail when a page is stale; check-v4.js does this too) */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { loadV4, plain } = require("./check-v4.js");

const SITE = "https://veniplex.github.io/ai-explained/";
const TAIL = " · Agentic AI, Explained";

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function oneLine(s, max) {
  const t = plain(s).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

// Replace exactly one occurrence, and fail loudly when the home page no longer has it (so the template cannot drift).
function swap(html, from, to) {
  if (typeof from === "string" ? !html.includes(from) : !from.test(html)) throw new Error("index.html no longer contains: " + from);
  return html.replace(from, () => to);
}

// Where the shell page is and how its paths change two levels down. v4 to v6 have the shell at the top of the version folder
// ("flat"); v10-alpha has it in dive/ (the folder itself is the kitchen story), so its pages are one level deeper than the shell.
const LAYOUTS = {
  flat: {
    shell: "index.html",
    homeBody: '<body data-page="home" data-base="">',
    base: "../../",
    paths(html) {
      // Everything the home page loads from the folder above (the other versions, versions.js, version-switcher.js) is two levels further away,
      // and so is everything it loads from assets/. The first rewrite must come before the second, which also produces "../".
      html = html.replace(/(href|src)="\.\.\//g, '$1="../../../');
      html = html.replace(/(href|src)="assets\//g, '$1="../../assets/');
      return swap(html, '<a class="brand" href="./"', '<a class="brand" href="../../"');
    }
  },
  dive: {
    shell: "dive/index.html",
    homeBody: '<body data-page="home" data-base="../">',
    base: "../../",
    paths(html) {
      // The shell sits in dive/, so everything it loads is one "../" away; from terms/<id>/ it is two. Its own tab ("./") is dive/.
      html = html.replace(/(href|src)="\.\.\//g, '$1="../../');
      return swap(html, '<a class="place" href="./"', '<a class="place" href="../../dive/"');
    }
  },
  // v12-alpha: the same shell in dive/, but the top bar has no tabs any more (the start page, index.html, is where the visitor picks a half).
  start: {
    shell: "dive/index.html",
    homeBody: '<body data-page="home" data-base="../">',
    base: "../../",
    paths(html) { return html.replace(/(href|src)="\.\.\//g, '$1="../../'); }
  }
};

function pageFor(home, dir, kind, id, title, description, layout) {
  const where = (kind === "entry" ? "terms/" : "guides/") + id + "/";
  let html = home;
  html = swap(html, /<title>[^<]*<\/title>/, "<title>" + esc(title + TAIL) + "</title>");
  html = swap(html, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">');
  html = swap(html, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + dir + "/" + where + '">');
  html = swap(html, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(title) + '">');
  html = swap(html, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(description) + '">');
  html = swap(html, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + SITE + dir + "/" + where + '">');
  html = layout.paths(html);
  html = swap(html, layout.homeBody, '<body data-page="' + kind + '" data-id="' + id + '" data-base="' + layout.base + '">');
  return html;
}

function pages(root, dir = "versions/v4-alpha", layoutName = "flat") {
  const layout = LAYOUTS[layoutName];
  const home = fs.readFileSync(path.join(root, dir, layout.shell), "utf8");
  const D = loadV4(root, dir);
  const out = {};
  Object.keys(D.entries).forEach((id) => {
    const e = D.entries[id];
    out[dir + "/terms/" + id + "/index.html"] = pageFor(home, dir, "entry", id, e.name, oneLine(e.short, 200), layout);
  });
  D.guideList.forEach((g) => {
    out[dir + "/guides/" + g.id + "/index.html"] = pageFor(home, dir, "guide", g.id, g.menu === g.title ? g.title : g.menu + ": " + g.title, oneLine((((D.tech || {}).guides || {})[g.id] || {}).lede || g.hint, 200), layout);
  });
  return out;
}

function existing(root, dir = "versions/v4-alpha") {
  const found = [];
  ["terms", "guides"].forEach((kind) => {
    const base = path.join(root, dir, kind);
    if (!fs.existsSync(base)) return;
    fs.readdirSync(base, { withFileTypes: true }).forEach((d) => { if (d.isDirectory()) found.push(dir + "/" + kind + "/" + d.name + "/index.html"); });
  });
  return found;
}

// Problems with the generated pages: missing, out of date, or left over from a term or guide that no longer exists.
function stale(root, dir = "versions/v4-alpha", layoutName = "flat") {
  const want = pages(root, dir, layoutName), problems = [];
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) problems.push(f + ": missing");
    else if (fs.readFileSync(p, "utf8") !== want[f]) problems.push(f + ": out of date");
  });
  existing(root, dir).forEach((f) => { if (!want[f]) problems.push(f + ": no such term or guide any more"); });
  return problems;
}

function write(root, dir = "versions/v4-alpha", layoutName = "flat") {
  const want = pages(root, dir, layoutName);
  existing(root, dir).forEach((f) => { if (!want[f]) fs.rmSync(path.dirname(path.join(root, f)), { recursive: true }); });
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, want[f]);
  });
  return Object.keys(want).length;
}

// The command line for a version folder; build-v4-pages.js and build-v5-pages.js both use it.
function cli(dir, script, layoutName = "flat") {
  const root = path.resolve(__dirname, "..");
  if (process.argv.includes("--check")) {
    const problems = stale(root, dir, layoutName);
    if (problems.length) { console.error(problems.length + " page(s) need rebuilding (node scripts/" + script + "):\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(dir + " pages are up to date.");
  } else {
    console.log("wrote " + write(root, dir, layoutName) + " pages");
  }
}

module.exports = { pages, stale, write, cli };

if (require.main === module) cli("versions/v4-alpha", "build-v4-pages.js");
