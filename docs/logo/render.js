#!/usr/bin/env node
/* Draws the mark of the site (a small hand-drawn network of nodes with a sparkle, the look of AI) with rough.js, with a fixed seed so the drawing is the same
   every time, and writes everything that carries it:
     favicon.svg                         the icon of the browser tab (light and dark background)
     assets/icons/*.png                  the app icons (any, maskable), the icon for the home screen of an iPhone
     docs/logo/mark.svg, docs/logo/preview.png   the mark alone, and a sheet to look at
   and prints the paths of the inline mark of the top bar (the shells index.html, story/index.html and technical/index.html hold them; paste them in when the
   mark changes, then run `node scripts/build-pages.js`).
   Needs Playwright with a Chromium for the PNG files. Run from the repository root:   node docs/logo/render.js */
"use strict";
const fs = require("fs"), path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require(path.join(process.env.PLAYWRIGHT_NODE_PATH || "/opt/node-tools/node_modules", "playwright"))); }

const ROOT = path.resolve(__dirname, "../..");
const rough = new Function(fs.readFileSync(path.join(ROOT, "assets/vendor/rough.js"), "utf8") + "; return rough;")();
const gen = rough.generator();
const INK = "#141413", CLAY = "#d97757", PAPER = "#f0eee6", PAPER_DARK = "#262624", INK_DARK = "#f2f0e8";

// The drawing, in a box of 32 x 32. Three versions to choose from (VARIANT, the first argument of the script; "agent" is the one the site uses):
//   agent    a small robot-like head: a rounded face with two glowing eyes, ears, and an antenna that ends in a sparkle (an assistant that acts)
//   orbit    a big sparkle with a tilted orbit and a node travelling on it (a core that works with its tools)
//   network  three nodes around a core, joined by lines, and a sparkle
const VARIANT = process.argv[2] || "agent";
function sparkle(cx, cy, r, w) { // a four-pointed star with curved sides
  return "M" + cx + " " + (cy - r) + "Q" + (cx + w) + " " + (cy - w) + " " + (cx + r) + " " + cy + "Q" + (cx + w) + " " + (cy + w) + " " + cx + " " + (cy + r) +
    "Q" + (cx - w) + " " + (cy + w) + " " + (cx - r) + " " + cy + "Q" + (cx - w) + " " + (cy - w) + " " + cx + " " + (cy - r) + "Z";
}
function rrect(x, y, w, h, r) {
  return "M" + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) + "V" + (y + h - r) + "Q" + (x + w) + " " + (y + h) + " " + (x + w - r) + " " + (y + h) +
    "H" + (x + r) + "Q" + x + " " + (y + h) + " " + x + " " + (y + h - r) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "Z";
}
function pathsOf(d) { return gen.toPaths(d); }
const SMOOTH = { roughness: 0.4, disableMultiStroke: true };
const CORE_FILL = { stroke: CLAY, fill: CLAY, fillStyle: "solid" };
function drawing(variant) {
  const out = { lines: [], nodes: [], core: [], spark: [] };
  if (variant === "agent") {
    out.nodes.push(...pathsOf(gen.path(rrect(6, 12.5, 20, 15.5, 5), { seed: 5, roughness: 0.22, disableMultiStroke: true, bowing: 0.3, fill: "#faf9f5", fillStyle: "solid" })));
    out.lines.push(...pathsOf(gen.line(16, 12.5, 16, 8.6, { seed: 6, roughness: 0.4, disableMultiStroke: true })));
    out.lines.push(...pathsOf(gen.line(3.2, 18, 3.2, 23, { seed: 7, roughness: 0.3, disableMultiStroke: true })));
    out.lines.push(...pathsOf(gen.line(28.8, 18, 28.8, 23, { seed: 8, roughness: 0.3, disableMultiStroke: true })));
    out.core.push(...pathsOf(gen.circle(12, 20, 4.2, { seed: 9, roughness: 0.3, disableMultiStroke: true, ...CORE_FILL })));
    out.core.push(...pathsOf(gen.circle(20, 20, 4.2, { seed: 10, roughness: 0.3, disableMultiStroke: true, ...CORE_FILL })));
    out.spark.push(...pathsOf(gen.path(sparkle(16, 4.8, 4.6, 0.95), { seed: 41, roughness: 0.12, disableMultiStroke: true, ...CORE_FILL })));
  } else if (variant === "orbit") {
    const pts = [], rx = 13.5, ry = 5.4, rot = -0.5;
    for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2, x = rx * Math.cos(a), y = ry * Math.sin(a); pts.push([16 + x * Math.cos(rot) - y * Math.sin(rot), 16.5 + x * Math.sin(rot) + y * Math.cos(rot)]); }
    out.lines.push(...pathsOf(gen.curve(pts, { seed: 3, roughness: 0.5, disableMultiStroke: true })));
    out.nodes.push(...pathsOf(gen.circle(26.6, 10.7, 5, { seed: 4, ...SMOOTH, fill: "#faf9f5", fillStyle: "solid" })));
    out.spark.push(...pathsOf(gen.path(sparkle(15.5, 16.5, 8.4, 1.5), { seed: 41, roughness: 0.15, disableMultiStroke: true, ...CORE_FILL })));
  } else {
    const NODES = [[7, 10], [8.5, 25], [25, 23.5]], CORE = [16, 16.5];
    NODES.forEach((n, i) => {
      const dx = n[0] - CORE[0], dy = n[1] - CORE[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      out.lines.push(...pathsOf(gen.line(CORE[0] + ux * 3.6, CORE[1] + uy * 3.6, n[0] - ux * 3.1, n[1] - uy * 3.1, { seed: 11 + i, roughness: 0.5, bowing: 0.6, disableMultiStroke: true })));
      out.nodes.push(...pathsOf(gen.circle(n[0], n[1], 6, { seed: 21 + i, roughness: 0.35, disableMultiStroke: true, fill: "#faf9f5", fillStyle: "solid" })));
    });
    out.core.push(...pathsOf(gen.circle(CORE[0], CORE[1], 7.4, { seed: 31, roughness: 0.4, disableMultiStroke: true, ...CORE_FILL })));
    out.spark.push(...pathsOf(gen.path(sparkle(24.5, 8, 5.8, 1.2), { seed: 41, roughness: 0.12, disableMultiStroke: true, ...CORE_FILL })));
  }
  return out;
}
const round = (s) => s.replace(/(\d+\.\d{2})\d+/g, "$1");
// kind: "ink" paths get a stroke, "fill" paths a fill. Colours as parameters, so the same drawing serves the light and dark icon.
function svgBody(dr, c) {
  const p = (list, attrs) => list.map((x) => '<path d="' + round(x.d) + '" ' + attrs(x) + "/>").join("");
  const stroked = (x) => (x.fill && x.fill !== "none" ? 'fill="' + x.fill + '" ' : 'fill="none" ') + (x.stroke && x.stroke !== "none" ? 'stroke="' + x.stroke + '" stroke-width="' + x.strokeWidth + '" stroke-linecap="round" stroke-linejoin="round"' : "");
  return p(dr.lines, () => 'fill="none" stroke="' + c.ink + '" stroke-width="2.2" stroke-linecap="round"') +
    p(dr.nodes, (x) => (x.fill !== "none" ? 'fill="' + c.node + '" stroke="none"' : 'fill="none" stroke="' + c.ink + '" stroke-width="2.2" stroke-linecap="round"')) +
    p(dr.core, (x) => (x.fill !== "none" ? 'fill="' + c.clay + '" stroke="none"' : 'fill="none" stroke="' + c.clay + '" stroke-width="1.2" stroke-linecap="round"')) +
    p(dr.spark, (x) => (x.fill !== "none" ? 'fill="' + c.clay + '" stroke="none"' : 'fill="none" stroke="' + c.clay + '" stroke-width="1.2" stroke-linejoin="round"'));
}
const LIGHT = { ink: INK, node: "#faf9f5", clay: CLAY }, DARK = { ink: INK_DARK, node: PAPER_DARK, clay: CLAY };

function inline(dr) { // the mark of the top bar: classes, so the colours follow the theme
  const cls = (list, c) => list.map((x) => '          <path class="' + c(x) + '" d="' + round(x.d) + '"/>').join("\n");
  return [cls(dr.lines, () => "brand-line"), cls(dr.nodes, (x) => (x.fill !== "none" ? "brand-node-fill" : "brand-line")), cls(dr.core, (x) => (x.fill !== "none" ? "brand-core" : "brand-core-edge")), cls(dr.spark, (x) => (x.fill !== "none" ? "brand-core" : "brand-core-edge"))].join("\n");
}

const dr = drawing(VARIANT);
fs.writeFileSync(path.join(ROOT, "docs/logo/mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + svgBody(dr, LIGHT) + "</svg>\n");
// The icon of the browser tab: a rounded square in the paper colour of the site, dark in a dark browser.
const fav = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.bg{fill:' + PAPER + "}.lt{display:inline}.dk{display:none}@media (prefers-color-scheme:dark){.bg{fill:" + PAPER_DARK + "}.lt{display:none}.dk{display:inline}}</style>" +
  '<rect class="bg" width="32" height="32" rx="8"/><g class="lt">' + svgBody(dr, LIGHT) + '</g><g class="dk">' + svgBody(dr, DARK) + "</g></svg>\n";
fs.writeFileSync(path.join(ROOT, "favicon.svg"), fav);

function html(size, kind) { // kind: "round" (rounded square, transparent corners), "full" (full bleed), "mask" (full bleed, the mark inside the safe zone: 60%)
  const scale = kind === "mask" ? 0.6 : 0.78, pad = (1 - scale) / 2 * 100;
  const bg = kind === "round" ? "border-radius:22.5%;" : "";
  return '<html><body style="margin:0;background:transparent"><div style="width:' + size + "px;height:" + size + "px;background:" + PAPER + ";" + bg + 'position:relative"><svg viewBox="0 0 32 32" style="position:absolute;left:' + pad + "%;top:" + pad + "%;width:" + scale * 100 + "%;height:" + scale * 100 + '%">' + svgBody(dr, LIGHT) + "</svg></div></body></html>";
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : { executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
  const page = await browser.newPage();
  async function shot(size, kind, file, transparent) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html(size, kind));
    await page.screenshot({ path: path.join(ROOT, file), omitBackground: !!transparent });
    console.log("wrote " + file);
  }
  await shot(512, "round", "assets/icons/icon-512.png", true);
  await shot(192, "round", "assets/icons/icon-192.png", true);
  await shot(512, "mask", "assets/icons/icon-maskable-512.png", false);
  await shot(180, "full", "assets/icons/apple-touch-icon.png", false);
  // A sheet to look at: the three versions of the mark, light and dark, at 160, 64, 32 and 16px.
  const cell = (d, s, c, bg) => '<div style="display:inline-block;margin:6px;padding:10px;background:' + bg + ';border-radius:12px"><img width="' + s + '" height="' + s + '" src="data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + svgBody(d, c) + "</svg>").toString("base64") + '"></div>';
  const rows = ["agent", "orbit", "network"].map((v) => { const d = drawing(v); return "<div style='white-space:nowrap'><b style='display:inline-block;width:70px'>" + v + "</b>" + [160, 64, 32, 16].map((s) => cell(d, s, LIGHT, PAPER)).join("") + [160, 64, 32, 16].map((s) => cell(d, s, DARK, PAPER_DARK)).join("") + "</div>"; });
  await page.setViewportSize({ width: 1130, height: 700 });
  await page.setContent('<html><body style="margin:8px;background:#fff;font:14px sans-serif">' + rows.join("") + "</body></html>");
  await page.screenshot({ path: path.join(ROOT, "docs/logo/preview.png") });
  await browser.close();
  console.log("\ninline mark for the top bar (index.html, story/index.html, technical/index.html):\n" + inline(dr));
})();
