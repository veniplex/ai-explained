#!/usr/bin/env node
/* Writes what v13-alpha generates from its content (assets/js/data/) and its two shells:
     v13-alpha/<way>/references/index.html          the list of references          (way: kitchen or technical)
     v13-alpha/<way>/references/<id>/index.html     one reference per term
     v13-alpha/<way>/guides/index.html              the list of guides
     v13-alpha/<way>/guides/<id>/index.html         one page per guide
     v13-alpha/assets/js/data/glance.js             the sentence of every term for the hover card (popover.js)
     v13-alpha/assets/js/data/search-index.js       what the search (search.js) looks through: both voices of everything
   The pages are the shells (v13-alpha/kitchen/index.html and v13-alpha/technical/index.html) with their own title, description and address, so a link
   shows a proper title and preview; app.js fills in the content. Each also carries its text in a <noscript> block, so a reader without JavaScript, a link
   preview or a search engine finds the content too (in the words of its own way: the kitchen pages in the kitchen voice, the technical pages in the
   technical one).
   Run from the repository root:   node scripts/build-v13-pages.js          (write everything)
                                   node scripts/build-v13-pages.js --check  (fail when something is stale; check-v13.js does this too) */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { loadV4, plain } = require("./check-v4.js");
const v9 = require("./check-v9.js");

const DIR = "v13-alpha";
const WAYS = ["kitchen", "technical"];
const SITE = "https://veniplex.github.io/ai-explained/";
const TAIL = " · Agentic AI, Explained";
const GLANCE = (way) => DIR + "/assets/js/data/glance-" + way + ".js", INDEX = (way) => DIR + "/assets/js/data/search-index-" + way + ".js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const oneLine = (s, max) => {
  const t = plain(s).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};
const para = (s) => "<p>" + esc(plain(s)) + "</p>";
const flat = (...parts) => parts.flat(Infinity).filter((x) => typeof x === "string");

// Replace exactly one occurrence, and fail loudly when the shell no longer has it (so the template cannot drift).
function swap(html, from, to) {
  if (typeof from === "string" ? !html.includes(from) : !from.test(html)) throw new Error("the shell no longer contains: " + from);
  return html.replace(from, () => to);
}

/* ---------- The pages ----------------------------------------------------------------- */
function context(root) {
  const D = loadV4(root, DIR), C = v9.load(root, DIR);
  const zoneOf = {}, chapterOf = {};
  D.chapters.forEach((c) => c.entries.forEach((id) => { zoneOf[id] = c.zone; chapterOf[id] = c; }));
  return { D, C, zoneOf, chapterOf, K: D.kitchen, T: D.tech };
}

const WORDS = { kitchen: "Kitchen", technical: "Technical" };

function pageFor(shell, way, kind, id, title, description, noscript) {
  const deep = kind === "reference" || kind === "guide";
  const where = way + "/" + (kind.startsWith("reference") ? "references/" : "guides/") + (deep ? id + "/" : "");
  const up = "../".repeat(deep ? 3 : 2);
  let html = shell;
  html = swap(html, /<title>[^<]*<\/title>/, "<title>" + esc(title + TAIL) + "</title>");
  html = swap(html, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">');
  html = swap(html, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + DIR + "/" + where + '">');
  html = swap(html, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(title) + '">');
  html = swap(html, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(description) + '">');
  html = swap(html, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + SITE + DIR + "/" + where + '">');
  // Everything the shell loads from the folders above is further away from here.
  html = html.replace(/(href|src)="\.\.\//g, "$1=\"" + up.slice(0, -3) + "../");
  // The section the page belongs to is the current one in the top bar.
  const sec = kind.startsWith("reference") ? "references" : "guides";
  html = html.replace(/ aria-current="page"(?=>)/g, "");
  const link = new RegExp('(data-sec="' + sec + '"(?: data-follow)?)>');
  if (!link.test(html)) throw new Error("the shell has no link for the section " + sec);
  html = html.replace(link, (m, a) => a + ' aria-current="page">');
  html = swap(html, '<body data-page="home" data-path="' + way + '" data-base="../">',
    '<body data-page="' + kind + '"' + (deep ? ' data-id="' + id + '"' : "") + ' data-path="' + way + '" data-base="' + up + '">');
  html = swap(html, /<noscript>\s*<p class="noscript">/, '<noscript>\n      <article class="page">\n        ' + noscript + '\n      </article>\n      <p class="noscript">');
  return html;
}

function referenceText(x, way, id) {
  const e = x.D.entries[id], d = e.deeper || {}, k = x.K.entries[id];
  if (way === "kitchen") return ["<h1>" + esc(e.name) + "</h1>", para(k.line), ...k.how.map(para), para(k.example), ...k.forYou.map(para)].join("\n        ");
  return ["<h1>" + esc(e.name) + "</h1>", para(e.short), ...(e.how || []).map(para), ...(d.details || []).map(para), ...(d.includes || []).map((i) => para(i.name + ": " + i.text))].join("\n        ");
}

function pages(root) {
  const x = context(root), out = {}, ids = Object.keys(x.D.entries);
  WAYS.forEach((way) => {
    const shell = fs.readFileSync(path.join(root, DIR, way, "index.html"), "utf8"), kitchen = way === "kitchen";
    const line = (id) => kitchen ? x.K.entries[id].line : x.D.entries[id].short;
    ids.forEach((id) => {
      const e = x.D.entries[id];
      out[DIR + "/" + way + "/references/" + id + "/index.html"] =
        pageFor(shell, way, "reference", id, e.name + " · " + WORDS[way] + " reference", oneLine(line(id), 200), referenceText(x, way, id));
    });
    out[DIR + "/" + way + "/references/index.html"] = pageFor(shell, way, "references", "", WORDS[way] + " references: every " + (kitchen ? "real name" : "term") + ", one page each",
      "One page for each of the " + ids.length + " " + (kitchen ? "real names behind the kitchen" : "terms of the technical deep dive") + ".",
      "<h1>References</h1>\n        <ul>\n" + ids.map((id) => '          <li><a href="' + id + '/">' + esc(x.D.entries[id].name) + "</a>: " + esc(plain(line(id))) + "</li>").join("\n") + "\n        </ul>");
    x.D.guideList.forEach((g) => {
      const t = (x.T.guides || {})[g.id] || {}, lede = g.id === "compare" ? (kitchen ? x.K.compare : t).lede : g.id === "build" ? (kitchen ? x.K.build : t).lede : g.id === "learn" ? t.lede : "";
      out[DIR + "/" + way + "/guides/" + g.id + "/index.html"] = pageFor(shell, way, "guide", g.id, (g.menu === g.title ? g.title : g.menu + ": " + g.title) + " · " + WORDS[way] + " guides",
        oneLine(lede || g.hint, 200), "<h1>" + esc(g.title) + "</h1>" + (lede ? "\n        " + para(lede) : ""));
    });
    out[DIR + "/" + way + "/guides/index.html"] = pageFor(shell, way, "guides", "", WORDS[way] + " guides",
      "Longer pages on one question each: what is easily confused, how to build your own, the glossary, where to learn more, and what this site is.",
      "<h1>Guides</h1>\n        <ul>\n" + x.D.guideList.map((g) => '          <li><a href="' + g.id + '/">' + esc(g.menu) + "</a>: " + esc(g.hint) + "</li>").join("\n") + "\n        </ul>");
  });
  WAYS.forEach((way) => { out[GLANCE(way)] = glance(x, way); out[INDEX(way)] = searchIndex(x, way); });
  return out;
}

/* ---------- The hover card and the search --------------------------------------------- */
function glance(x, way) {
  const lines = Object.keys(x.D.entries).map((id) => {
    const e = x.D.entries[id];
    return "  " + JSON.stringify(id) + ": " + JSON.stringify(Object.assign({ n: e.name, c: x.chapterOf[id].n, z: x.zoneOf[id] }, way === "kitchen" ? { k: plain(x.K.entries[id].line) } : { t: plain(e.short) }));
  });
  return "/* Agentic AI, Explained (v13): the sentence of every term for the hover card (popover.js) of the "+way+" pages: n the name, c the chapter, z the zone, "+(way === "kitchen" ? "k the kitchen sentence" : "t the technical sentence")+".\n   Generated by scripts/build-v13-pages.js from the content files; do not edit by hand. */\nwindow.AE_GLANCE = {\n" + lines.join(",\n") + "\n};\n";
}

const SKIP_KEYS = new Set(["url", "entry", "e", "entries", "id", "route", "type", "year", "zone", "figure", "n", "svg", "chapter", "related", "source"]);
function texts(value, out) {
  out = out || [];
  if (typeof value === "string") out.push(plain(value));
  else if (Array.isArray(value)) value.forEach((v) => texts(v, out));
  else if (value && typeof value === "object") Object.keys(value).forEach((k) => { if (!SKIP_KEYS.has(k)) texts(value[k], out); });
  return out;
}
const join = (...parts) => parts.flat(Infinity).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

function searchIndex(x, way) {
  const docs = [], D = x.D, K = x.K, T = x.T;
  Object.keys(D.entries).forEach((id) => {
    const e = D.entries[id], k = K.entries[id], src = D.sources[id] || { aka: [], facts: [] }, d = e.deeper || {};
    docs.push({
      k: "ref", id, n: e.name, l: e.label, z: x.zoneOf[id], c: x.chapterOf[id].n, a: join(src.aka, e.aka),
      kl: plain(k.line), tl: plain(e.short),
      kb: join(flat(k.how, k.example, k.forYou).map(plain)),
      tb: join(flat(e.how, e.example, e.forYou, d.details, (d.includes || []).map((i) => i.name + ": " + i.text), (src.facts || []).map((f) => f.text)).map(plain))
    });
  });
  D.chapters.forEach((c) => {
    const k = K.chapters[c.id], t = T.chapters[c.id];
    docs.push({ k: "chapter", id: c.n === 8 ? "ch-e" : "ch-" + c.n, c: c.n, z: c.zone, kt: k.title, tt: t.title, kl: plain(k.lead), tl: plain(t.problem),
      kb: join(flat(k.problem, k.text, k.example).map(plain)), tb: join(flat(t.problem, t.text, t.example).map(plain)) });
  });
  D.guideList.forEach((g) => {
    const G = D.guides[g.id], t = (T.guides || {})[g.id] || {};
    let kb = "", tb = "";
    if (g.id === "compare") { kb = join(texts(K.compare)); tb = join(texts(G), t.lede, t.note); }
    else if (g.id === "build") { kb = join(texts(K.build)); tb = join(texts(G), t.lede); }
    else if (g.id === "learn") { kb = tb = join(texts((G || []).map((grp) => ({ title: grp.title, intro: grp.intro, items: grp.items.map((i) => ({ title: i.title, by: i.by })) }))), t.lede); }
    docs.push({ k: "guide", id: g.id, t: g.menu, h: g.hint, z: "start", kb, tb });
  });
  (D.guides.glossary || []).forEach((g) => {
    if (!g.entry || !D.entries[g.entry]) return;
    docs.push({ k: "gloss", t: g.term, e: g.entry, z: x.zoneOf[g.entry], kd: plain((K.glossary || {})[g.term] || g.def), td: plain(g.def) });
  });
  x.C.chapters.forEach((c) => {
    const caps = x.C.steps.filter((s) => s.ch === c.n).map((s) => plain(s.cap));
    if (!caps.length) return;
    docs.push({ k: "story", id: c.hash, c: c.n, z: c.zone, t: c.title, lbl: c.n >= 1 && c.n <= 8 ? "Chapter " + c.n + " · " + c.title : c.title, b: join(caps), l: oneLine(caps[0], 140) });
  });
  // One index per way: the other voice's fields are left out, so a technical page never receives a kitchen sentence (and the story, a kitchen page, has its chapters only in the kitchen index).
  const drop = way === "kitchen" ? /^t[a-z]$/ : /^k[a-z]$/, own = way === "kitchen" ? docs : docs.filter((d) => d.k !== "story");
  own.forEach((d) => Object.keys(d).forEach((key) => { if (drop.test(key)) delete d[key]; }));
  const what = way === "kitchen" ? "references, chapters of the kitchen deep dive, guides, glossary terms and chapters of the kitchen story" : "references, chapters of the technical deep dive, guides and glossary terms";
  return "/* Agentic AI, Explained (v13): what the search (search.js) looks through on the " + way + " pages: " + what + ".\n   Generated by scripts/build-v13-pages.js from the content files; do not edit by hand. */\nwindow.AE_SEARCH = { docs: [\n" +
    own.map((d) => "  " + JSON.stringify(d)).join(",\n") + "\n] };\n";
}

/* ---------- Writing and checking ---------------------------------------------------------- */
function existing(root) {
  const found = [];
  const walk = (dir) => {
    if (!fs.existsSync(path.join(root, dir))) return;
    fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach((d) => {
      if (d.isDirectory()) walk(dir + "/" + d.name);
      else if (d.name === "index.html") found.push(dir + "/index.html");
    });
  };
  WAYS.forEach((way) => { walk(DIR + "/" + way + "/references"); walk(DIR + "/" + way + "/guides"); });
  return found;
}

function stale(root) {
  const want = pages(root), problems = [];
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) problems.push(f + ": missing");
    else if (fs.readFileSync(p, "utf8") !== want[f]) problems.push(f + ": out of date");
  });
  existing(root).forEach((f) => { if (!want[f]) problems.push(f + ": no such term or guide any more"); });
  return problems;
}

function write(root) {
  const want = pages(root);
  existing(root).forEach((f) => { if (!want[f]) fs.rmSync(path.dirname(path.join(root, f)), { recursive: true }); });
  Object.keys(want).forEach((f) => {
    const p = path.join(root, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, want[f]);
  });
  return Object.keys(want).length;
}

module.exports = { DIR, WAYS, pages, stale, write, glance, searchIndex, context };

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  if (process.argv.includes("--check")) {
    const problems = stale(root);
    if (problems.length) { console.error(problems.length + " file(s) need rebuilding (node scripts/build-v13-pages.js):\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(DIR + " pages are up to date.");
  } else {
    console.log("wrote " + write(root) + " files");
  }
}
