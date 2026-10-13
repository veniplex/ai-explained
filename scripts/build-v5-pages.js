#!/usr/bin/env node
/* Writes one small HTML page per term and per guide of v5-alpha, from v5-alpha/index.html (see build-v4-pages.js).
   Run from the repository root:   node scripts/build-v5-pages.js          (write the pages)
                                   node scripts/build-v5-pages.js --check  (fail when a page is stale; check-v5.js does this too) */
"use strict";
const v4 = require("./build-v4-pages.js");

const DIR = "versions/v5-alpha";
module.exports = {
  pages: (root) => v4.pages(root, DIR),
  stale: (root) => v4.stale(root, DIR),
  write: (root) => v4.write(root, DIR)
};

if (require.main === module) v4.cli(DIR, "build-v5-pages.js");
