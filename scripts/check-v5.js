#!/usr/bin/env node
/* Content checks for v0.5-alpha: the same rules as v0.4-alpha (both voices, word budgets, links, term and guide pages).
   Run from the repository root: node scripts/check-v5.js */
"use strict";
const { main } = require("./check-v4.js");

main("versions/v0.5-alpha", "./build-v5-pages.js", "node scripts/build-v5-pages.js");
