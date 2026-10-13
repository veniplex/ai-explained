#!/usr/bin/env node
/* Writes one small HTML page per term and per guide of v10-alpha, from v10-alpha/dive/index.html (see build-v4-pages.js):
     v10-alpha/terms/<id>/index.html   and   v10-alpha/guides/<id>/index.html
   The shell is the start page of the deep dive (v10-alpha/index.html is the kitchen story).
   Run from the repository root:   node scripts/build-v10-pages.js          (write the pages)
                                   node scripts/build-v10-pages.js --check  (fail when a page is stale; check-v10.js does this too) */
"use strict";
const v4 = require("./build-v4-pages.js");

const DIR = "versions/v10-alpha";
module.exports = {
  pages: (root) => v4.pages(root, DIR, "dive"),
  stale: (root) => v4.stale(root, DIR, "dive"),
  write: (root) => v4.write(root, DIR, "dive")
};

if (require.main === module) v4.cli(DIR, "build-v10-pages.js", "dive");
