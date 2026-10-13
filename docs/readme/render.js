#!/usr/bin/env node
/* Writes the pictures of the README (docs/readme/<scene>.png and <scene>-dark.png) from art.html, in a headless browser.
   Needs Playwright with a Chromium (the one the sandbox sets up, or `npx playwright install chromium`), and the repository served over HTTP,
   which this script does itself. Run from the repository root:   node docs/readme/render.js [scene ...]
   The README shows the dark picture to a reader on a dark theme (<picture> with prefers-color-scheme). */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require(path.join(process.env.PLAYWRIGHT_NODE_PATH || "/opt/node-tools/node_modules", "playwright"))); }

const ROOT = path.resolve(__dirname, "../..");
const SCENES = ["banner", "ways", "chapters", "loop"];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const want = process.argv.slice(2).length ? process.argv.slice(2) : SCENES;
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  for (const scene of want) {
    for (const theme of ["light", "dark"]) {
      await page.goto(`http://127.0.0.1:${port}/docs/readme/art.html?scene=${scene}&theme=${theme}`);
      await page.waitForSelector("html[data-ready]");
      await page.evaluate(() => document.fonts.ready);
      const out = path.join(__dirname, scene + (theme === "dark" ? "-dark" : "") + ".png");
      await page.locator("#art").screenshot({ path: out });
      console.log("wrote " + path.relative(ROOT, out));
    }
  }
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
