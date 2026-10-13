#!/usr/bin/env node
/* PostToolUse hook (Edit|Write|MultiEdit): syntax-check edited site JavaScript and
   validate data.js. Exit code 2 sends the problem back to Claude so it fixes it right away. */
"use strict";

var path = require("path");
var execFileSync = require("child_process").execFileSync;

// Git Bash on Windows may hand over /c/... paths; Node needs C:/...
function native(p) { return process.platform === "win32" ? p.replace(/^\/([a-zA-Z])\//, "$1:/") : p; }
var ROOT = path.resolve(native(process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "../..")));

var raw = "";
process.stdin.on("data", function (c) { raw += c; });
process.stdin.on("end", function () {
  var input;
  try { input = JSON.parse(raw.replace(/^﻿/, "")); } catch (e) { process.exit(0); }
  var file = (input.tool_input && input.tool_input.file_path) || (input.tool_response && input.tool_response.filePath);
  if (!file || !/\.(js|mjs)$/.test(file)) process.exit(0);
  file = path.resolve(native(file));

  var rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (rel.indexOf("..") === 0 || /(^|\/)(node_modules|assets\/vendor)\//.test(rel)) process.exit(0);

  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (e) {
    process.stderr.write("Syntax error in " + rel + ":\n" + String(e.stderr || e.message) + "\n");
    process.exit(2);
  }

  var m = rel.match(/^versions\/(v[^/]+)\/assets\/js\/data\.js$/);
  if (!m) process.exit(0);
  try {
    execFileSync(process.execPath, [path.join(ROOT, "scripts/validate-data.js"), "--quiet", m[1]], { stdio: "pipe", cwd: ROOT });
  } catch (e) {
    process.stderr.write("data.js validation failed after editing " + rel + ":\n" + String(e.stdout || "") + String(e.stderr || "") + "\n");
    process.exit(2);
  }
  process.exit(0);
});
