#!/usr/bin/env node
/* Archives the release at the root of the site into versions/<id>/, so that the root can become the next release.
   Usage: node scripts/archive-release.js [id] [--out <folder>]
   id      the folder name for the release being archived (default: the id of the main entry in versions/versions.js, e.g. v1.0).
   --out   write the copy to this folder instead of versions/<id>/ (for trying it out; nothing else is touched).
   What it does: copies the site files of the root (the pages, assets/, the manifest, the service worker, DESIGN.md) and writes a README for the folder, then
   - points the dropdown scripts at the shared files of versions/ (one more ../ in front of versions.js and version-switcher.js); the icon stays the release's own favicon.svg, so an archived release keeps its mark,
   - points canonical and og: addresses at the new place (/versions/<id>/),
   - points the service worker at the shared files too.
   It does not edit versions/versions.js: after archiving, take main: true off the old entry and add the new release at the top (see .claude/skills/new-version/SKILL.md).
   The result is a frozen release: the archived folder has no checks of its own beyond scripts/versions.test.js. */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var SITE = "https://veniplex.github.io/ai-explained/";
var ITEMS = ["index.html", "story", "technical", "glossary", "guides", "about", "assets", "manifest.webmanifest", "sw.js", "DESIGN.md", "favicon.svg"];
var SHARED = "(versions\\.js|version-switcher\\.js|version-switcher\\.css)";

function mainId() {
  var sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "versions/versions.js"), "utf8"), sandbox);
  var main = sandbox.window.AE_VERSIONS.list.filter(function (v) { return v.main; })[0];
  if (!main) throw new Error("versions/versions.js has no entry with main: true");
  return main.id;
}

function walk(dir, out) {
  fs.readdirSync(dir).forEach(function (name) {
    var p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out); else out.push(p);
  });
  return out;
}

function fixHtml(t, id) {
  // the dropdown files and the icon move from the root to versions/: one more ../ in front of them
  t = t.replace(new RegExp('(src|href)="((?:\\.\\./)*)(?:versions/)?' + SHARED + '"', "g"), function (all, attr, up, file) {
    return attr + '="' + up + "../" + file + '"';
  });
  // absolute addresses (canonical, og:url, og:image) of the root site now live in versions/<id>/
  var re = new RegExp(SITE.replace(/[.\/]/g, "\\$&") + "(?!versions/)", "g");
  return t.replace(re, SITE + "versions/" + id + "/");
}

function fixSw(t, id) {
  t = t.replace(new RegExp('"versions/' + SHARED + '"', "g"), '"../$1"');
  t = t.replace(/"versions\/favicon\.svg"/g, '"favicon.svg"'); // the mark of the release itself, not the one of the alpha versions
  return "/* Archived release " + id + ": this copy sits in versions/" + id + "/, so its scope is this folder only. Where the comment below says the root of the site, it means that folder. */\n" + t;
}

function main() {
  var args = process.argv.slice(2);
  var outIdx = args.indexOf("--out");
  var out = outIdx !== -1 ? path.resolve(args[outIdx + 1] || "") : null;
  if (outIdx !== -1) args.splice(outIdx, 2);
  var id = args[0] || mainId();
  if (!/^v\d[\w.-]*$/.test(id)) throw new Error("the id must look like v1.0 or v0.18-alpha: " + id);
  var dest = out || path.join(ROOT, "versions", id);
  if (fs.existsSync(dest)) throw new Error(path.relative(ROOT, dest) + " exists already; an archived release is never overwritten");

  ITEMS.forEach(function (item) {
    var s = path.join(ROOT, item), d = path.join(dest, item);
    if (!fs.existsSync(s)) throw new Error("missing at the root: " + item);
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.cpSync(s, d, { recursive: true });
  });

  walk(dest, []).forEach(function (f) {
    var rel = path.relative(dest, f).replace(/\\/g, "/");
    if (/(^|\/)(vendor|fonts|icons)\//.test(rel)) return; // third-party files and pictures stay as they are
    if (/\.html$/.test(rel)) rewrite(f, function (t) { return fixHtml(t, id); });
    if (rel === "sw.js") rewrite(f, function (t) { return fixSw(t, id); });
  });

  var notes = fs.readFileSync(path.join(ROOT, "docs/how-it-is-built.md"), "utf8")
    .replace(/^# .*\n/, "# AI explained (" + id + ")\n")
    .replace(/\n\nThis is the technical README of the site[^\n]*\n/, "\n\nAn archived release: a folder of its own that stays online unchanged. It was the root of the site as " + id + "; the notes below are from that time.\n")
    .replace(/\]\(\.\.\/README\.md\)/g, "](../../README.md)");
  fs.writeFileSync(path.join(dest, "README.md"), notes);

  console.log("archived the root site as " + path.relative(ROOT, dest).replace(/\\/g, "/") + "/");
  console.log("next: in versions/versions.js take main: true off the " + id + " entry and add the new release as the first entry (main: true).");
}

function rewrite(file, fn) {
  var t = fs.readFileSync(file, "utf8"), n = fn(t);
  if (n !== t) fs.writeFileSync(file, n);
}

main();
