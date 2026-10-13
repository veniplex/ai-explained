#!/usr/bin/env node
/* Writes what v0.14-alpha generates from its content (assets/js/data/) and its two shells:
     v0.14-alpha/<way>/glossary/index.html            the glossary                  (way: kitchen or technical)
     v0.14-alpha/<way>/glossary/<id>/index.html       one page per term (the 21 main terms and the terms only the glossary has)
     v0.14-alpha/<way>/guides/index.html              the guides, shown as notes
     v0.14-alpha/<way>/guides/<id>/index.html         one page per guide
     v0.14-alpha/<way>/about/index.html               the about page
     v0.14-alpha/assets/js/data/glance-<way>.js       the sentence of every term for the hover card (popover.js)
     v0.14-alpha/assets/js/data/search-index-<way>.js what the search (search.js) looks through
   The pages are the shells (v0.14-alpha/kitchen/index.html and v0.14-alpha/technical/index.html) with their own title, description and address, so a link
   shows a proper title and preview; app.js fills in the content. Each also carries its text in a <noscript> block, so a reader without JavaScript, a link
   preview or a search engine finds the content too (in the words of its own way: the kitchen pages in the kitchen voice, the technical pages in the
   technical one).
   Run from the repository root:   node scripts/build-v14-pages.js          (write everything)
                                   node scripts/build-v14-pages.js --check  (fail when something is stale; check-v14.js does this too) */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { plain } = require("./check-v4.js");
const content = require("./v14-content.js");
const v9 = require("./check-v9.js");

const DIR = "versions/v0.14-alpha";
const WAYS = ["kitchen", "technical"];
const SITE = "https://veniplex.github.io/ai-explained/";
const TAIL = " · AI explained";
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
  const D = content.load(root), C = v9.load(root, DIR);
  const zoneOf = {}, chapterOf = {};
  D.chapters.forEach((c) => c.entries.forEach((id) => { zoneOf[id] = c.zone; chapterOf[id] = c; }));
  // The group of a main term: the group of the chapter it belongs to (terms.js does the same in the browser).
  const CAT_OF_CHAPTER = { chef: "models", counter: "prompting", tools: "tools", loop: "agents", recipes: "knowledge", locks: "safety", helpers: "teams", "kitchen-ops": "ops" };
  const cats = {};
  D.glossaryCats.forEach((c) => { cats[c.id] = c; });
  const terms = [];
  D.chapters.forEach((c) => c.entries.forEach((id) => terms.push({ id, main: true, name: D.entries[id].name, cat: CAT_OF_CHAPTER[c.id], zone: c.zone, chapter: c })));
  D.glossary.forEach((g) => terms.push({ id: g.id, main: false, name: g.term, cat: g.cat, zone: cats[g.cat].zone, chapter: g.entry ? chapterOf[g.entry] : null, raw: g }));
  terms.sort((a, b) => a.name.toLowerCase().replace(/[^a-z0-9]/g, "").localeCompare(b.name.toLowerCase().replace(/[^a-z0-9]/g, "")));
  return { D, C, zoneOf, chapterOf, K: D.kitchen, T: D.tech, terms, cats };
}

const WORDS = { kitchen: "Kitchen", technical: "Technical" };
const SECTION_OF = { term: "glossary", glossary: "glossary", guide: "guides", guides: "guides", about: "about" };
const FOLDER_OF = { term: "glossary/", glossary: "glossary/", guide: "guides/", guides: "guides/", about: "about/" };

function pageFor(shell, way, kind, id, title, description, noscript) {
  const deep = kind === "term" || kind === "guide";
  const where = way + "/" + FOLDER_OF[kind] + (deep ? id + "/" : "");
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
  // The section the page belongs to is the current one in the menu.
  const sec = SECTION_OF[kind];
  html = html.replace(/ aria-current="page"(?=>)/g, "");
  const link = new RegExp('(data-sec="' + sec + '"(?: data-follow)?)>');
  if (!link.test(html)) throw new Error("the shell has no link for the section " + sec);
  html = html.replace(link, (m, a) => a + ' aria-current="page">');
  html = swap(html, '<body data-page="home" data-path="' + way + '" data-base="../">',
    '<body data-page="' + kind + '"' + (deep ? ' data-id="' + id + '"' : "") + ' data-path="' + way + '" data-base="' + up + '">');
  html = swap(html, /<noscript>\s*<p class="noscript">/, '<noscript>\n      <article class="page">\n        ' + noscript + '\n      </article>\n      <p class="noscript">');
  return html;
}

// The sentence and the longer text of a term, in the voice of a way.
function lineOf(x, t, way) {
  if (t.main) return way === "kitchen" ? x.K.entries[t.id].line : x.D.entries[t.id].short;
  return way === "kitchen" ? (x.K.glossary || {})[t.id] || t.raw.def : t.raw.def;
}
function termText(x, way, t) {
  if (!t.main) {
    const more = way === "kitchen" ? (x.K.glossaryMore || {})[t.id] : t.raw.more;
    return ["<h1>" + esc(t.name) + "</h1>", para(lineOf(x, t, way)), ...(more || []).map(para)].join("\n        ");
  }
  const id = t.id, e = x.D.entries[id], d = e.deeper || {}, k = x.K.entries[id];
  if (way === "kitchen") return ["<h1>" + esc(e.name) + "</h1>", para(k.line), ...k.how.map(para), para(k.example), ...k.forYou.map(para)].join("\n        ");
  return ["<h1>" + esc(e.name) + "</h1>", para(e.short), ...(e.how || []).map(para), ...(d.details || []).map(para), ...(d.includes || []).map((i) => para(i.name + ": " + i.text))].join("\n        ");
}

// A long guide as text: the lede, what to expect, and every section's headline and paragraphs.
function longGuide(x, way, id) { return (way === "kitchen" ? x.K : x.T).longGuides[id]; }
function articleText(g, title) {
  return ["<h1>" + esc(title) + "</h1>", para(g.lede), "<ul>\n" + g.expect.map((l) => "          <li>" + esc(plain(l)) + "</li>").join("\n") + "\n        </ul>"]
    .concat(g.sections.flatMap((s) => ["<h2>" + esc(s.title) + "</h2>"].concat(s.text.map(para)))).join("\n        ");
}
const ABOUT = {
  description: "What AI explained is, how its pages are made, where the facts come from and what it keeps private.",
  text: "<h1>About</h1>\n        <p>AI explained is a free, hand-drawn guide to AI and AI agents. It loads nothing from outside, uses no analytics and stores only your theme and the way you read last, in your own browser. Every fact is dated and links to its sources.</p>"
};

function pages(root) {
  const x = context(root), out = {};
  WAYS.forEach((way) => {
    const shell = fs.readFileSync(path.join(root, DIR, way, "index.html"), "utf8"), kitchen = way === "kitchen";
    x.terms.forEach((t) => {
      out[DIR + "/" + way + "/glossary/" + t.id + "/index.html"] =
        pageFor(shell, way, "term", t.id, t.name + " · " + WORDS[way] + " glossary", oneLine(lineOf(x, t, way), 200), termText(x, way, t));
    });
    out[DIR + "/" + way + "/glossary/index.html"] = pageFor(shell, way, "glossary", "", "Glossary of AI terms: " + x.terms.length + " terms explained" + (kitchen ? " in plain words" : ""),
      "A short definition of each of " + x.terms.length + " AI terms, with an icon, what it is related to and where it fits.",
      "<h1>Glossary</h1>\n        <ul>\n" + x.terms.map((t) => '          <li><a href="' + t.id + '/">' + esc(t.name) + "</a>: " + esc(plain(lineOf(x, t, way))) + "</li>").join("\n") + "\n        </ul>");
    x.D.guideList.forEach((g) => {
      const long = content.ARTICLES.includes(g.id) ? longGuide(x, way, g.id) : null;
      const t = (x.T.guides || {})[g.id] || {}, lede = long ? long.lede : g.id === "compare" ? (kitchen ? x.K.compare : t).lede : g.id === "build" ? (kitchen ? x.K.build : t).lede : g.id === "learn" ? t.lede : "";
      out[DIR + "/" + way + "/guides/" + g.id + "/index.html"] = pageFor(shell, way, "guide", g.id, g.title + " · " + WORDS[way] + " guide",
        oneLine(lede || g.hint, 200), long ? articleText(long, g.title) : "<h1>" + esc(g.title) + "</h1>" + (lede ? "\n        " + para(lede) : ""));
    });
    out[DIR + "/" + way + "/guides/index.html"] = pageFor(shell, way, "guides", "", WORDS[way] + " guides",
      "Long guides on how agents work, how to give them context, build, secure and test them, plus short ones on what is easily confused and where to learn more.",
      "<h1>Guides</h1>\n        <ul>\n" + x.D.guideList.map((g) => '          <li><a href="' + g.id + '/">' + esc(g.title) + "</a>: " + esc(g.hint) + "</li>").join("\n") + "\n        </ul>");
    out[DIR + "/" + way + "/about/index.html"] = pageFor(shell, way, "about", "", "About", ABOUT.description, ABOUT.text);
  });
  WAYS.forEach((way) => { out[GLANCE(way)] = glance(x, way); out[INDEX(way)] = searchIndex(x, way); });
  return out;
}

/* ---------- The hover card and the search --------------------------------------------- */
function glance(x, way) {
  const lines = x.terms.map((t) => {
    const o = { n: t.name, z: t.zone, g: x.cats[t.cat].title };
    if (t.chapter) o.c = t.chapter.n;
    if (!t.main) o.x = 1;
    o[way === "kitchen" ? "k" : "t"] = plain(lineOf(x, t, way));
    return "  " + JSON.stringify(t.id) + ": " + JSON.stringify(o);
  });
  return "/* AI explained (v14): the sentence of every term for the hover card (popover.js) of the " + way + " pages: n the name, c the chapter (when the story explains it), z the zone, g the group, x set for a term that is only in the glossary, " + (way === "kitchen" ? "k the kitchen sentence" : "t the technical sentence") + ".\n   Generated by scripts/build-v14-pages.js from the content files; do not edit by hand. */\nwindow.AE_GLANCE = {\n" + lines.join(",\n") + "\n};\n";
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
  x.terms.forEach((t) => {
    const id = t.id, base = { k: "ref", id, n: t.name, z: t.zone, g: x.cats[t.cat].title };
    if (t.chapter) base.c = t.chapter.n;
    if (t.main) {
      const e = D.entries[id], k = K.entries[id], src = D.sources[id] || { aka: [] }, d = e.deeper || {};
      docs.push(Object.assign(base, {
        m: 1, l: e.label, a: join(src.aka, e.aka), kl: plain(k.line), tl: plain(e.short),
        kb: join(flat(k.how, k.example, k.forYou).map(plain)),
        tb: join(flat(e.how, e.example, e.forYou, d.details, (d.includes || []).map((i) => i.name + ": " + i.text)).map(plain))
      }));
    } else {
      const g = t.raw;
      if (g.entry) base.e = g.entry;
      docs.push(Object.assign(base, {
        a: join(g.aka), kl: plain((K.glossary || {})[id] || g.def), tl: plain(g.def),
        kb: join(flat((K.glossaryMore || {})[id]).map(plain)), tb: join(flat(g.more).map(plain))
      }));
    }
  });
  D.chapters.forEach((c) => {
    const k = K.chapters[c.id], t = T.chapters[c.id];
    docs.push({ k: "chapter", id: c.n === 8 ? "ch-e" : "ch-" + c.n, c: c.n, z: c.zone, kt: k.title, tt: t.title, kl: plain(k.lead), tl: plain(t.problem),
      kb: join(flat(k.problem, k.text, k.example).map(plain)), tb: join(flat(t.problem, t.text, t.example).map(plain)) });
  });
  D.guideList.forEach((g) => {
    const G = D.guides[g.id], t = (T.guides || {})[g.id] || {};
    let kb = "", tb = "";
    const articleBody = (L) => join(L.lede, L.expect, L.sections.map((s) => [s.title, s.text, s.list, (s.steps || []).map((p) => [p.t, p.d]), s.callout && [s.callout.t, s.callout.d], s.example, s.table && [s.table.head, s.table.rows]]).flat(Infinity).map(plain));
    if (T.longGuides[g.id]) { kb = articleBody(K.longGuides[g.id]); tb = articleBody(T.longGuides[g.id]); }
    else if (g.id === "compare") { kb = join(texts(K.compare)); tb = join(texts(G), t.lede, t.note); }
    else if (g.id === "build") { kb = join(texts(K.build)); tb = join(texts(G), t.lede); }
    else if (g.id === "learn") { kb = tb = join(texts((G || []).map((grp) => ({ title: grp.title, intro: grp.intro, items: grp.items.map((i) => ({ title: i.title, by: i.by })) }))), t.lede); }
    docs.push({ k: "guide", id: g.id, t: g.title, h: g.hint, z: "start", kb, tb });
  });
  docs.push({ k: "guide", id: "about", t: "About", h: ABOUT.description, z: "start", kb: "", tb: "" });
  x.C.chapters.forEach((c) => {
    const caps = x.C.steps.filter((s) => s.ch === c.n).map((s) => plain(s.cap));
    if (!caps.length) return;
    docs.push({ k: "story", id: c.hash, c: c.n, z: c.zone, t: c.title, lbl: c.n >= 1 && c.n <= 8 ? "Chapter " + c.n + " · " + c.title : c.title, b: join(caps), l: oneLine(caps[0], 140) });
  });
  // One index per way: the other voice's fields are left out, so a technical page never receives a kitchen sentence (and the story, a kitchen page, has its chapters only in the kitchen index).
  const drop = way === "kitchen" ? /^t[a-z]$/ : /^k[a-z]$/, own = way === "kitchen" ? docs : docs.filter((d) => d.k !== "story");
  own.forEach((d) => Object.keys(d).forEach((key) => { if (drop.test(key)) delete d[key]; }));
  const what = way === "kitchen" ? "glossary terms, chapters of the kitchen deep dive, guides and chapters of the kitchen story" : "glossary terms, chapters of the technical deep dive and guides";
  return "/* AI explained (v14): what the search (search.js) looks through on the " + way + " pages: " + what + ".\n   Generated by scripts/build-v14-pages.js from the content files; do not edit by hand. */\nwindow.AE_SEARCH = { docs: [\n" +
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
  WAYS.forEach((way) => { ["glossary", "guides", "about", "references"].forEach((d) => walk(DIR + "/" + way + "/" + d)); });
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
    if (problems.length) { console.error(problems.length + " file(s) need rebuilding (node scripts/build-v14-pages.js):\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(DIR + " pages are up to date.");
  } else {
    console.log("wrote " + write(root) + " files");
  }
}
