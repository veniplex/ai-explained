#!/usr/bin/env node
/* PreToolUse hook (Edit|Write|MultiEdit):
   1. Vendored files (rough.js, fonts, licence texts) are never edited by hand.
   2. The site promises "no external requests": new code must not load scripts, styles,
      fonts, frames or data from another origin. Plain links (<a href>, canonical, og:image
      and the URLs in data.js) are fine. */
"use strict";

var path = require("path");

// Git Bash on Windows may hand over /c/... paths; Node needs C:/...
function native(p) { return process.platform === "win32" ? p.replace(/^\/([a-zA-Z])\//, "$1:/") : p; }
var ROOT = path.resolve(native(process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "../..")));

var REMOTE = [
  [/<script\b[^>]*\bsrc\s*=\s*["']?(https?:)?\/\//i, "a <script src> from another origin"],
  [/<link\b(?=[^>]*\brel\s*=\s*["']?(stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch)\b)[^>]*\bhref\s*=\s*["']?(https?:)?\/\//i, "a <link> that loads from another origin"],
  [/<link\b[^>]*\bhref\s*=\s*["']?(https?:)?\/\/[^>]*\brel\s*=\s*["']?(stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch)\b/i, "a <link> that loads from another origin"],
  [/<(iframe|img|video|audio|source|embed|object)\b[^>]*\b(src|data|srcset)\s*=\s*["']?(https?:)?\/\//i, "an embedded resource from another origin"],
  [/@import\s+(url\()?\s*["']?(https?:)?\/\//i, "a CSS @import from another origin"],
  [/url\(\s*["']?(https?:)?\/\//i, "a CSS url() from another origin"],
  [/\b(fetch|import|importScripts)\s*\(\s*["'`](https?:)?\/\//, "a fetch()/import() from another origin"],
  [/new\s+(WebSocket|EventSource|Worker)\s*\(\s*["'`](wss?:|https?:)?\/\//, "a network connection to another origin"],
  [/\.src\s*=\s*["'`](https?:)?\/\//, "a script-set src from another origin"],
  [/navigator\.sendBeacon|XMLHttpRequest/, "a beacon or XHR (the site makes no requests)"]
];

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason }
  }));
  process.exit(0);
}

var raw = "";
process.stdin.on("data", function (c) { raw += c; });
process.stdin.on("end", function () {
  var input;
  try { input = JSON.parse(raw.replace(/^﻿/, "")); } catch (e) { process.exit(0); }
  var ti = input.tool_input || {};
  if (!ti.file_path) process.exit(0);

  var rel = path.relative(ROOT, path.resolve(native(ti.file_path))).replace(/\\/g, "/");
  if (rel.indexOf("..") === 0) process.exit(0);

  if (/(^|\/)assets\/(vendor|fonts)\//.test(rel)) {
    deny(rel + " is a vendored third-party file (with its licence). Do not edit it by hand; replace it with an upstream release instead, and only if the user asks.");
  }

  if (!/^v[^/]+\/.*\.(html|css|js|mjs)$|^index\.html$/.test(rel)) process.exit(0);
  // data.js holds the sources as plain URL strings; only check it for code that loads things.
  var text = [ti.content, ti.new_string].concat((ti.edits || []).map(function (e) { return e.new_string; }))
    .filter(Boolean).join("\n");
  for (var i = 0; i < REMOTE.length; i++) {
    if (REMOTE[i][0].test(text)) {
      deny("Blocked: this edit to " + rel + " adds " + REMOTE[i][1] + ". The site promises no external requests: self-host the file under assets/ instead, or link to it with a plain <a href>.");
    }
  }
  process.exit(0);
});
