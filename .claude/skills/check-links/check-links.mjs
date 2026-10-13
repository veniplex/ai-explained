#!/usr/bin/env node
// Checks every external URL in versions/<version>/assets/js/data.js, or lists facts that may be stale.
//
//   node .claude/skills/check-links/check-links.mjs [--version v1-alpha] [--limit N]
//        [--concurrency 8] [--timeout 20] [--json report.json]
//   node .claude/skills/check-links/check-links.mjs --stale 6 [--version v1-alpha]
//
// Pages: HEAD, then GET if HEAD fails. YouTube videos: the oEmbed endpoint (as the README describes).
// Exit code 1 when at least one link is dead.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf("--" + name); return i === -1 ? def : (args[i + 1] ?? true); };

const versions = opt("version", null)
  ? [opt("version")]
  : fs.readdirSync(path.join(ROOT, "versions")).filter((d) => /^v\d/.test(d) && fs.existsSync(path.join(ROOT, "versions", d, "assets/js/data.js")));

function load(version) {
  const file = path.join(ROOT, "versions", version, "assets/js/data.js");
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window.AE;
}

// ---------------------------------------------------------------------------- stale facts
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function newestDate(text) {
  let best = null;
  const re = /\b(?:(\d{1,2})\s+)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi;
  let m;
  while ((m = re.exec(text))) {
    const d = new Date(Date.UTC(+m[3], MONTHS.indexOf(m[2].toLowerCase()), m[1] ? +m[1] : 1));
    if (!best || d > best) best = d;
  }
  if (!best) {
    const years = (text.match(/\b(19|20)\d{2}\b/g) || []).map(Number);
    if (years.length) best = new Date(Date.UTC(Math.max(...years), 0, 1));
  }
  return best;
}

if (opt("stale", null)) {
  const months = Number(opt("stale")) || 6;
  const cutoff = new Date(); cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  for (const v of versions) {
    const D = load(v);
    const old = [], undated = [];
    let papers = 0;
    for (const id of Object.keys(D.blocks)) {
      (D.blocks[id].facts || []).forEach((f, i) => {
        // Findings from papers are historical by nature; they do not go stale the way product facts do.
        if (/^https:\/\/(arxiv\.org|www\.nature\.com|doi\.org|openreview\.net|aclanthology\.org|proceedings\.)/.test(f.source)) { papers++; return; }
        const d = newestDate(f.text);
        const row = { where: `FACTS.${id}[${i}]`, text: f.text, source: f.source };
        if (!d) undated.push(row);
        else if (d < cutoff) old.push({ ...row, date: d.toISOString().slice(0, 7) });
      });
    }
    console.log(`\n${v}: snapshot ${D.meta.snapshot}, updated ${D.meta.updated} (${papers} facts from papers skipped)`);
    console.log(`\nNewest date mentioned is older than ${months} months (${old.length}). Historical facts can be fine; check the ones that describe "current" state:`);
    old.forEach((r) => console.log(`  [${r.date}] ${r.where}: ${r.text.slice(0, 140)}${r.text.length > 140 ? "…" : ""}\n            ${r.source}`));
    console.log(`\nNo date in the text (${undated.length}); these silently go stale:`);
    undated.forEach((r) => console.log(`  ${r.where}: ${r.text.slice(0, 140)}${r.text.length > 140 ? "…" : ""}`));
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------- link check
function collect(D) {
  const urls = new Map(); // url -> [where]
  const add = (url, where) => { if (!urls.has(url)) urls.set(url, []); urls.get(url).push(where); };
  (function walk(node, where) {
    if (typeof node === "string") {
      if (/^https?:\/\/\S+$/.test(node)) add(node, where);
      for (const m of node.matchAll(/\[[^\]]+\]\((https?:[^)\s]+)\)/g)) add(m[1], where);
      return;
    }
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${where}[${i}]`));
    if (node && typeof node === "object") for (const k of Object.keys(node)) {
      if (k === "links" || k === "facts") continue; // walked below with clearer names
      walk(node[k], where ? `${where}.${k}` : k);
    }
  })(D, "");
  for (const id of Object.keys(D.blocks)) {
    (D.blocks[id].links || []).forEach((l, i) => add(l.url, `SOURCES.${id}[${i}]`));
    (D.blocks[id].facts || []).forEach((f, i) => add(f.source, `FACTS.${id}[${i}]`));
  }
  return urls;
}

const TIMEOUT = Number(opt("timeout", 20)) * 1000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

async function request(url, method) {
  const res = await fetch(url, {
    method, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT),
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8", "accept-language": "en" }
  });
  try { await res.body?.cancel(); } catch {}
  return res;
}

const norm = (u) => u.replace(/^http:/, "https:").replace(/\/\/www\./, "//").replace(/[/#]+$/, "").toLowerCase();

async function check(url) {
  try {
    const yt = /^https:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/.test(url);
    if (yt) {
      const res = await request("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(url), "GET");
      if (res.ok || res.status === 401) return { status: "ok", code: res.status, note: res.status === 401 ? "embedding disabled, video exists" : "" };
      return { status: "dead", code: res.status, note: "YouTube oEmbed says the video is gone or private" };
    }
    let res = await request(url, "HEAD");
    if (res.status >= 400) res = await request(url, "GET");
    const code = res.status;
    if ([401, 403, 429, 999].includes(code)) return { status: "blocked", code, note: "bot protection or login; check in a browser" };
    if (code >= 400) return { status: "dead", code };
    if (norm(res.url) !== norm(url)) return { status: "redirected", code, final: res.url };
    return { status: "ok", code };
  } catch (e) {
    const cause = e.cause?.code || e.name;
    return { status: cause === "TimeoutError" ? "timeout" : "error", note: String(cause || e.message) };
  }
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let next = 0, done = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (next < items.length) {
      const i = next++; out[i] = await fn(items[i]);
      if (++done % 25 === 0) process.stderr.write(`  ${done}/${items.length} checked\n`);
    }
  }));
  return out;
}

let anyDead = false;
const report = {};
for (const v of versions) {
  const urls = [...collect(load(v)).entries()];
  const limit = Number(opt("limit", 0));
  const list = limit ? urls.slice(0, limit) : urls;
  process.stderr.write(`${v}: checking ${list.length} unique URLs…\n`);
  const results = await pool(list, Number(opt("concurrency", 8)), ([url]) => check(url));
  const rows = list.map(([url, where], i) => ({ url, where, ...results[i] }));
  report[v] = rows;

  const by = (s) => rows.filter((r) => r.status === s);
  const counts = ["ok", "redirected", "blocked", "timeout", "error", "dead"].map((s) => `${s} ${by(s).length}`).join(", ");
  console.log(`\n${v}: ${rows.length} URLs: ${counts}`);
  const show = (title, s, fmt) => { const r = by(s); if (!r.length) return; console.log(`\n${title} (${r.length})`); r.forEach((x) => console.log("  " + fmt(x))); };
  const loc = (x) => x.where.slice(0, 3).join(", ") + (x.where.length > 3 ? ` +${x.where.length - 3}` : "");
  show("DEAD", "dead", (x) => `${x.code} ${x.url}\n        used in ${loc(x)}${x.note ? " (" + x.note + ")" : ""}`);
  show("ERROR (DNS, TLS or connection)", "error", (x) => `${x.url} (${x.note})\n        used in ${loc(x)}`);
  show("TIMEOUT", "timeout", (x) => `${x.url}\n        used in ${loc(x)}`);
  show("BLOCKED (verify by hand)", "blocked", (x) => `${x.code} ${x.url}`);
  show("REDIRECTED (consider updating to the final URL)", "redirected", (x) => `${x.url}\n     -> ${x.final}`);
  if (by("dead").length) anyDead = true;
}

const jsonOut = opt("json", null);
if (jsonOut) { fs.writeFileSync(path.resolve(jsonOut), JSON.stringify(report, null, 2)); console.log(`\nFull report: ${jsonOut}`); }
process.exit(anyDead ? 1 : 0);
