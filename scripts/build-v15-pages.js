#!/usr/bin/env node
/* Writes what v0.15-alpha generates from its content (assets/js/data/) and its shell (v0.15-alpha/technical/index.html):
     v0.15-alpha/glossary/index.html             the glossary
     v0.15-alpha/glossary/<id>/index.html        one page per term (the 21 main terms and every other term of the glossary)
     v0.15-alpha/guides/index.html               the guides, shown as notes
     v0.15-alpha/guides/<id>/index.html          one page per guide
     v0.15-alpha/about/index.html                the about page
     v0.15-alpha/assets/js/data/glance.js        the sentence of every term for the hover card (popover.js)
     v0.15-alpha/assets/js/data/search-index.js  what the search (search.js) looks through
   The pages are the shell with their own title, description and address, so a link shows a proper title and preview; app.js fills in the content. The pages of
   the glossary also load the kitchen of the story (the drawing script, the kitchen, the names and the kitchen sentences), because every term shows where it sits
   in the kitchen; the guides and the about page load none of it. Each page also carries its text in a <noscript> block, so a reader without JavaScript, a link
   preview or a search engine finds the content too.
   Run from the repository root:   node scripts/build-v15-pages.js          (write everything)
                                   node scripts/build-v15-pages.js --check  (fail when something is stale; check-v15.js does this too) */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { plain } = require("./check-v4.js");
const content = require("./v15-content.js");
const v9 = require("./check-v9.js");

const DIR = "versions/v0.15-alpha";
const SITE = "https://veniplex.github.io/ai-explained/";
const TAIL = " · AI explained";
const GLANCE = DIR + "/assets/js/data/glance.js", INDEX = DIR + "/assets/js/data/search-index.js";

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

const SECTION_OF = { term: "glossary", glossary: "glossary", guide: "guides", guides: "guides", about: "about" };
const FOLDER_OF = { term: "glossary/", glossary: "glossary/", guide: "guides/", guides: "guides/", about: "about/" };
// What the glossary pages load besides the shell's scripts: the pen, the drawings, the kitchen, the story, the names and the kitchen sentences, and the
// script that draws "Where it sits in the kitchen". The shell's own relative paths are rewritten with everything else.
const KITCHEN_SCRIPTS = ["assets/js/draw.js", "assets/js/props.js", "assets/js/data/props-extra-a.js", "assets/js/data/props-extra-b.js", "assets/js/data/props-extra-c.js",
  "assets/js/data/props-kitchen.js", "assets/js/data/kitchen.js", "assets/js/data/story.js", "assets/js/data/names.js", "assets/js/data/voice-glossary-kitchen.js"];

function pageFor(shell, kind, id, title, description, noscript) {
  const deep = kind === "term" || kind === "guide";
  const where = FOLDER_OF[kind] + (deep ? id + "/" : "");
  const up = "../".repeat(deep ? 2 : 1);
  let html = shell;
  html = swap(html, /<title>[^<]*<\/title>/, "<title>" + esc(title + TAIL) + "</title>");
  html = swap(html, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">');
  html = swap(html, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + DIR + "/" + where + '">');
  html = swap(html, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(title) + '">');
  html = swap(html, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(description) + '">');
  html = swap(html, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + SITE + DIR + "/" + where + '">');
  if (kind === "term" || kind === "glossary") {
    // The kitchen of the story, for "Where it sits in the kitchen" (the locator draws it from the same lists as the story).
    const block = KITCHEN_SCRIPTS.map((f) => '  <script src="../' + f + '"></script>\n').join("");
    html = swap(html, '  <script src="../assets/js/sketch.js"></script>\n', block + '  <script src="../assets/js/sketch.js"></script>\n');
    html = swap(html, '  <script src="../assets/js/pages.js"></script>\n', '  <script src="../assets/js/locator.js"></script>\n  <script src="../assets/js/pages.js"></script>\n');
  }
  // Everything the shell loads from the folders above is further away from here.
  html = html.replace(/(href|src)="\.\.\//g, "$1=\"" + up);
  // The section the page belongs to is the current one in the menu.
  const sec = SECTION_OF[kind];
  html = html.replace(/ aria-current="page"(?=>)/g, "");
  const link = new RegExp('(data-sec="' + sec + '")>');
  if (!link.test(html)) throw new Error("the shell has no link for the section " + sec);
  html = html.replace(link, (m, a) => a + ' aria-current="page">');
  html = swap(html, '<body data-page="home" data-base="../">', '<body data-page="' + kind + '"' + (deep ? ' data-id="' + id + '"' : "") + ' data-base="' + up + '">');
  html = swap(html, /<noscript>\s*<p class="noscript">/, '<noscript>\n      <article class="page">\n        ' + noscript + '\n      </article>\n      <p class="noscript">');
  return html;
}

// The text of a term for a reader without JavaScript: the kitchen sentence, the definition, and the longer text.
function termText(x, t) {
  const kitchen = (x.K.glossary || {})[t.id];
  if (!t.main) return ["<h1>" + esc(t.name) + "</h1>", "<h2>Where it sits in the kitchen</h2>", para(kitchen), "<h2>Definition</h2>", para(t.raw.def),
    "<h2>Detailed technical description</h2>", ...(t.raw.more || []).map(para)].join("\n        ");
  const e = x.D.entries[t.id], d = e.deeper || {};
  return ["<h1>" + esc(e.name) + "</h1>", "<h2>Where it sits in the kitchen</h2>", para(kitchen), "<h2>Definition</h2>", para(e.short), ...(e.how || []).map(para),
    "<h2>Detailed technical description</h2>", ...(d.details || []).map(para), ...(d.includes || []).map((i) => para(i.name + ": " + i.text))].join("\n        ");
}

// A long guide as text: the lede, what to expect, and every section's headline and paragraphs.
function articleText(g, title) {
  return ["<h1>" + esc(title) + "</h1>", para(g.lede), "<ul>\n" + g.expect.map((l) => "          <li>" + esc(plain(l)) + "</li>").join("\n") + "\n        </ul>"]
    .concat(g.sections.flatMap((s) => ["<h2>" + esc(s.title) + "</h2>"].concat(s.text.map(para)))).join("\n        ");
}
const ABOUT = {
  description: "What AI explained is, how its pages are made, where the facts come from and what it keeps private.",
  text: "<h1>About</h1>\n        <p>AI explained is a free, hand-drawn guide to AI and AI agents. It loads nothing from outside, uses no analytics and stores only your theme, how you sort the glossary and your checklist, in your own browser. Every fact is dated and links to its sources.</p>"
};

function pages(root) {
  const x = context(root), out = {};
  const shell = fs.readFileSync(path.join(root, DIR, "technical", "index.html"), "utf8");
  x.terms.forEach((t) => {
    out[DIR + "/glossary/" + t.id + "/index.html"] = pageFor(shell, "term", t.id, t.name + " · Glossary", oneLine(t.main ? x.D.entries[t.id].short : t.raw.def, 200), termText(x, t));
  });
  out[DIR + "/glossary/index.html"] = pageFor(shell, "glossary", "", "Glossary of AI terms: " + x.terms.length + " terms explained",
    "Every one of " + x.terms.length + " AI terms has a page: where it sits in the kitchen of the story, a definition, related terms, a detailed technical description and references.",
    "<h1>Glossary</h1>\n        <ul>\n" + x.terms.map((t) => '          <li><a href="' + t.id + '/">' + esc(t.name) + "</a>: " + esc(plain(t.main ? x.D.entries[t.id].short : t.raw.def)) + "</li>").join("\n") + "\n        </ul>");
  x.D.guideList.forEach((g) => {
    const long = content.ARTICLES.includes(g.id) ? x.T.longGuides[g.id] : null;
    const t = (x.T.guides || {})[g.id] || {}, lede = long ? long.lede : t.lede || "";
    out[DIR + "/guides/" + g.id + "/index.html"] = pageFor(shell, "guide", g.id, g.title + " · Guide", oneLine(lede || g.hint, 200),
      long ? articleText(long, g.title) : "<h1>" + esc(g.title) + "</h1>" + (lede ? "\n        " + para(lede) : ""));
  });
  out[DIR + "/guides/index.html"] = pageFor(shell, "guides", "", "Guides",
    "Long guides on how agents work, how to give them context, build, secure and test them, plus short ones on what is easily confused and where to learn more.",
    "<h1>Guides</h1>\n        <ul>\n" + x.D.guideList.map((g) => '          <li><a href="' + g.id + '/">' + esc(g.title) + "</a>: " + esc(g.hint) + "</li>").join("\n") + "\n        </ul>");
  out[DIR + "/about/index.html"] = pageFor(shell, "about", "", "About", ABOUT.description, ABOUT.text);
  out[GLANCE] = glance(x);
  out[INDEX] = searchIndex(x);
  return out;
}

/* ---------- The hover card and the search --------------------------------------------- */
function glance(x) {
  const lines = x.terms.map((t) => {
    const o = { n: t.name, z: t.zone, g: x.cats[t.cat].title };
    if (t.chapter) o.c = t.chapter.n;
    if (!t.main) o.x = 1;
    o.t = plain(t.main ? x.D.entries[t.id].short : t.raw.def);
    return "  " + JSON.stringify(t.id) + ": " + JSON.stringify(o);
  });
  return "/* AI explained (v15): the sentence of every term for the hover card (popover.js): n the name, c the chapter (when the story explains it), z the zone, g the group, x set for a term that is only in the glossary, t the technical sentence.\n   Generated by scripts/build-v15-pages.js from the content files; do not edit by hand. */\nwindow.AE_GLANCE = {\n" + lines.join(",\n") + "\n};\n";
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

function searchIndex(x) {
  const docs = [], D = x.D, T = x.T;
  x.terms.forEach((t) => {
    const id = t.id, base = { k: "ref", id, n: t.name, z: t.zone, g: x.cats[t.cat].title };
    if (t.chapter) base.c = t.chapter.n;
    if (t.main) {
      const e = D.entries[id], src = D.sources[id] || { aka: [] }, d = e.deeper || {};
      docs.push(Object.assign(base, {
        m: 1, l: e.label, a: join(src.aka, e.aka), tl: plain(e.short),
        tb: join(flat(e.how, e.example, e.forYou, d.details, (d.includes || []).map((i) => i.name + ": " + i.text)).map(plain))
      }));
    } else {
      const g = t.raw;
      if (g.entry) base.e = g.entry;
      docs.push(Object.assign(base, { a: join(g.aka), tl: plain(g.def), tb: join(flat(g.more).map(plain)) }));
    }
  });
  D.chapters.forEach((c) => {
    const t = T.chapters[c.id];
    docs.push({ k: "chapter", id: c.n === 8 ? "ch-e" : "ch-" + c.n, c: c.n, z: c.zone, tt: t.title, tl: plain(t.problem), tb: join(flat(t.problem, t.text, t.example).map(plain)) });
  });
  D.guideList.forEach((g) => {
    const G = D.guides[g.id], t = (T.guides || {})[g.id] || {};
    let tb = "";
    const articleBody = (L) => join(L.lede, L.expect, L.sections.map((s) => [s.title, s.text, s.list, (s.steps || []).map((p) => [p.t, p.d]), s.callout && [s.callout.t, s.callout.d], s.example, s.table && [s.table.head, s.table.rows]]).flat(Infinity).map(plain));
    if (T.longGuides[g.id]) tb = articleBody(T.longGuides[g.id]);
    else if (g.id === "compare") tb = join(texts(G), t.lede, t.note);
    else if (g.id === "build") tb = join(texts(G), t.lede);
    else if (g.id === "learn") tb = join(texts((G || []).map((grp) => ({ title: grp.title, intro: grp.intro, items: grp.items.map((i) => ({ title: i.title, by: i.by })) }))), t.lede);
    docs.push({ k: "guide", id: g.id, t: g.title, h: g.hint, z: "start", tb });
  });
  docs.push({ k: "guide", id: "about", t: "About", h: ABOUT.description, z: "start", tb: "" });
  x.C.chapters.forEach((c) => {
    const caps = x.C.steps.filter((s) => s.ch === c.n).map((s) => plain(s.cap));
    if (!caps.length) return;
    docs.push({ k: "story", id: c.hash, c: c.n, z: c.zone, t: c.title, lbl: c.n >= 1 && c.n <= 8 ? "Chapter " + c.n + " · " + c.title : c.title, b: join(caps), l: oneLine(caps[0], 140) });
  });
  return "/* AI explained (v15): what the search (search.js) looks through: glossary terms, chapters of the deep dive, guides and chapters of the kitchen story.\n   Generated by scripts/build-v15-pages.js from the content files; do not edit by hand. */\nwindow.AE_SEARCH = { docs: [\n" +
    docs.map((d) => "  " + JSON.stringify(d)).join(",\n") + "\n] };\n";
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
  ["glossary", "guides", "about"].forEach((d) => walk(DIR + "/" + d));
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

module.exports = { DIR, KITCHEN_SCRIPTS, pages, stale, write, glance, searchIndex, context };

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  if (process.argv.includes("--check")) {
    const problems = stale(root);
    if (problems.length) { console.error(problems.length + " file(s) need rebuilding (node scripts/build-v15-pages.js):\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(DIR + " pages are up to date.");
  } else {
    console.log("wrote " + write(root) + " files");
  }
}
