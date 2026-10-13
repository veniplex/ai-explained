#!/usr/bin/env node
/* Draws the six small icons of the top bar's places (Start, ELI5: AI as Kitchen Chef, AI Agents: Technical Deep Dive, Guides, Glossary, About) with rough.js,
   with fixed seeds so the drawings are the same every time, as one SVG sprite of <symbol>s (ni-start, ni-story, ni-tech, ni-guides, ni-glossary, ni-about, and ni-squig, the squiggle under the current place),
   each in a box of 24 x 24. The pages use them with <use href="#ni-...">; the colours come from custom properties of the link that holds the icon
   (--pi-fill for the soft fill, --pi-accent for the bright detail; the lines are currentColor), so one drawing serves light, dark, hover and the current place.
   Writes the sprite between the markers <!-- nav-icons:start --> and <!-- nav-icons:end --> of the three shells (index.html, story/index.html, technical/index.html)
   and docs/logo/nav-icons.svg plus a sheet to look at (docs/logo/nav-icons.png, needs Playwright with a Chromium).
   After running it: node scripts/build-pages.js. Run from the repository root:   node docs/logo/nav-icons.js */
"use strict";
const fs = require("fs"), path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require(path.join(process.env.PLAYWRIGHT_NODE_PATH || "/opt/node-tools/node_modules", "playwright"))); }

const ROOT = path.resolve(__dirname, "../..");
const rough = new Function(fs.readFileSync(path.join(ROOT, "assets/vendor/rough.js"), "utf8") + "; return rough;")();
const gen = rough.generator();
const num = (d) => d.replace(/(\d+\.\d{2})\d+/g, "$1").replace(/\.00(?!\d)/g, "").replace(/(\.\d)0(?!\d)/g, "$1");

const LINE = { roughness: 0.55, bowing: 0.8, disableMultiStroke: true };
let seed = 100;
const S = () => ({ ...LINE, seed: seed++ });
// kinds: "line" (an outline), "fill" (a soft solid shape, no outline of its own), "accent" (a bright solid detail)
function shape(kind, d, extra) {
  const o = { ...S(), ...(extra || {}) };
  if (kind === "line") return gen.toPaths(gen.path(d, { ...o, fill: undefined })).map((p) => ({ kind, d: num(p.d), w: 1.5 }));
  const solid = { ...o, fill: "#000", fillStyle: "solid", roughness: 0.15 };
  return gen.toPaths(gen.path(d, solid)).filter((p) => p.fill && p.fill !== "none").map((p) => ({ kind, d: num(p.d) }));
}
function line(x1, y1, x2, y2, w) { return gen.toPaths(gen.line(x1, y1, x2, y2, S())).map((p) => ({ kind: "line", d: num(p.d), w: w || 1.5 })); }
function circle(cx, cy, r, kind) {
  const o = kind === "line" ? { ...S(), fill: undefined } : { ...S(), roughness: 0.15, fill: "#000", fillStyle: "solid" };
  const ps = gen.toPaths(gen.circle(cx, cy, r * 2, o));
  return kind === "line" ? ps.filter((p) => p.stroke && p.stroke !== "none" && (!p.fill || p.fill === "none")).map((p) => ({ kind, d: num(p.d), w: 1.5 }))
    : ps.filter((p) => p.fill && p.fill !== "none").map((p) => ({ kind, d: num(p.d) }));
}
function both(d) { return shape("fill", d).concat(shape("line", d)); }

const ICONS = {
  // a house with a chimney and a bright door
  start: () => [].concat(
    both("M4 11.2L12 4.2L20 11.2V19.6H4Z"),
    shape("line", "M16 8V4.6H18.2V9.8"),
    shape("accent", "M10 19.6V13.6H14V19.6Z"),
    shape("line", "M10 19.6V13.6H14V19.6")),
  // a chef's hat: puffy top, a band, a bright stripe
  story: () => [].concat(
    both("M7 14.2C3.6 14 3.2 9.4 6.8 8.8C7 5.4 10.8 4.4 12 6.3C13.2 4.4 17 5.4 17.2 8.8C20.8 9.4 20.4 14 17 14.2Z"),
    both("M7.2 14.2H16.8V19.4H7.2Z"),
    shape("accent", "M7.4 16.4H16.6V17.6H7.4Z")),
  // three small nodes round a bright core, joined by lines (an agent and what it works with)
  tech: () => [].concat(
    line(8.3, 8.1, 10.2, 10.1), line(15.7, 7.7, 13.8, 10.1), line(12, 15.4, 12, 16.8),
    circle(6, 6.2, 2.4, "fill"), circle(6, 6.2, 2.4, "line"),
    circle(18.2, 5.8, 2.4, "fill"), circle(18.2, 5.8, 2.4, "line"),
    circle(12, 19.4, 2.4, "fill"), circle(12, 19.4, 2.4, "line"),
    circle(12, 12.4, 3.6, "accent"), circle(12, 12.4, 3.6, "line")),
  // an open book with a bright ribbon
  guides: () => [].concat(
    both("M12 7.2C9.4 5.4 6 5.2 3 6.2V18.2C6 17.2 9.4 17.4 12 19.2Z"),
    both("M12 7.2C14.6 5.4 18 5.2 21 6.2V18.2C18 17.2 14.6 17.4 12 19.2Z"),
    line(5.6, 9.4, 9.6, 10), line(5.6, 12.4, 9.6, 13),
    shape("accent", "M15.4 5.7V11L16.8 9.8L18.2 11V5.9")),
  // an index card with a bright tab and a letter A
  glossary: () => [].concat(
    both("M4.6 7.4H19.4V19H4.6Z"),
    shape("accent", "M4.6 7.4V5H10.4V7.4Z"),
    line(9.2, 16.4, 12, 10.2), line(12, 10.2, 14.8, 16.4), line(10.2, 14.3, 13.8, 14.3)),
  // a round "i"
  about: () => [].concat(
    circle(12, 12, 8.4, "fill"), circle(12, 12, 8.4, "line"),
    circle(12, 7.9, 1.2, "accent"),
    line(12, 11, 12, 16.6, 1.9)),
};

function symbol(id, parts) {
  const body = parts.map((p) => {
    if (p.kind === "line") return '<path d="' + p.d + '" fill="none" stroke="currentColor" stroke-width="' + p.w + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (p.kind === "fill") return '<path d="' + p.d + '" style="fill:var(--pi-fill,transparent)" stroke="none"/>';
    return '<path d="' + p.d + '" style="fill:var(--pi-accent,currentColor)" stroke="none"/>';
  }).join("");
  return '<symbol id="ni-' + id + '" viewBox="0 0 24 24">' + body + "</symbol>";
}

const symbols = Object.keys(ICONS).map((id) => symbol(id, ICONS[id]()));
// The squiggle under the current place: one long wavy pen line (a box of 320 x 8) that the link crops to its own width (preserveAspectRatio slice, centred), so it is as wide as the
// item whatever the item is; the colour is the link's currentColor.
let wave = "M0 4Q4 0.6 8 4"; for (let x = 16; x <= 320; x += 8) wave += "T" + x + " 4";
symbols.push('<symbol id="ni-squig" viewBox="0 0 320 8" preserveAspectRatio="xMidYMid slice">' + shape("line", wave).map((p) => '<path d="' + p.d + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>').join("") + "</symbol>");
const sprite = '<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">' + symbols.join("") + "</svg>";
const block = "<!-- nav-icons:start -->\n  " + sprite + "\n  <!-- nav-icons:end -->";

["index.html", "story/index.html", "technical/index.html"].forEach((f) => {
  const p = path.join(ROOT, f);
  let t = fs.readFileSync(p, "utf8");
  if (/<!-- nav-icons:start -->[\s\S]*?<!-- nav-icons:end -->/.test(t)) t = t.replace(/<!-- nav-icons:start -->[\s\S]*?<!-- nav-icons:end -->/, () => block);
  else if (t.includes('  <header class="bar">')) t = t.replace('  <header class="bar">', () => "  " + block + '\n  <header class="bar">');
  else throw new Error(f + ": no <header class=\"bar\"> to put the sprite before");
  fs.writeFileSync(p, t);
});
fs.writeFileSync(path.join(ROOT, "docs/logo/nav-icons.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">' + symbols.join("") + "</svg>\n");

// A sheet to look at: every icon at 96px on light and dark paper, in the colours of its place.
const COLOURS = { start: ["#9e4a2d", "#f6e0d4", "#e9a385"], story: ["#855628", "#f2e6cd", "#dbb586"], tech: ["#2f6190", "#dce8f3", "#9cc0df"], guides: ["#56652c", "#e5e9d3", "#b8c38a"], glossary: ["#5b5486", "#e4e1f0", "#b9b3d8"], about: ["#983e5c", "#f4dee5", "#dfa6b9"] };
const COLOURS_D = { start: ["#f2a787", "#432e27", "#a9654a"], story: ["#ecc69c", "#403527", "#a17a50"], tech: ["#a9cbec", "#273645", "#5a84ab"], guides: ["#cdd7a0", "#323624", "#7b884e"], glossary: ["#c8c2ee", "#312e44", "#6f6898"], about: ["#f0abc1", "#432b34", "#a65c76"] };
function row(bg, ink, cols, accent) {
  return '<div style="display:flex;gap:28px;padding:20px 28px;background:' + bg + ';color:' + ink + '">' + Object.keys(ICONS).map((id) =>
    '<svg width="96" height="96" style="--pi-fill:' + cols[id][1] + ";--pi-accent:" + accent(cols[id]) + '"><use href="#ni-' + id + '"/></svg>').join("") + "</div>";
}
const html = "<body style='margin:0'>" + sprite + row("#faf9f5", "#3d3d3a", COLOURS, (c) => c[0]) + row("#1f1e1d", "#d4d1c7", COLOURS_D, (c) => c[0]) + "</body>";
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : { executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
  const page = await browser.newPage({ viewport: { width: 880, height: 300 } });
  await page.setContent(html);
  await page.screenshot({ path: path.join(ROOT, "docs/logo/nav-icons.png"), fullPage: true });
  await browser.close();
  console.log("icons drawn: " + Object.keys(ICONS).join(", "));
})();
