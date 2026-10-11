---
name: new-version
description: Cut a new version of the site (e.g. v1-alpha -> v1-beta or v2) as its own folder, and point the root redirect, README and metadata at it.
disable-model-invocation: true
argument-hint: "<new-folder-name> [from-folder]"
---

# New version

Each version is a self-contained static site in its own folder (`v1-alpha/`, …). Old versions stay online unchanged, so their links keep working. The root `index.html` forwards to the newest version.

`$ARGUMENTS`: the new folder name (required, must start with `v`), and optionally the folder to copy from (default: the newest existing version).

## Steps

1. **Check.** Work on a branch, not `main`. Confirm the new folder doesn't exist yet. Run `node scripts/validate-data.js`; it must pass before you copy.
2. **Copy** the source folder to the new one with everything in it, including `assets/fonts/` and `assets/vendor/` (`cp -r`; the guard hook only blocks *edits* to vendored files, not copies).
3. **In the new folder:**
   - `assets/js/data.js`: set `meta.updated` to today (YYYY-MM-DD) and `meta.snapshot` to "<Month> <Year>".
   - `index.html`: update `canonical`, `og:url`, `og:image` and any other absolute URL that names the old folder.
   - `README.md`: title and the version line at the top, the live-site URL and the path in the GitHub Pages steps.
   - `grep -rn "<old-folder>" <new-folder>/` must come back empty, except where the text means the old version on purpose.
4. **Repository root:**
   - `index.html`: the `meta refresh` URL, the `location.replace("<new>/" + location.hash)` target, `canonical`, `og:image`, the favicon path and the fallback link text. Keep the hash forwarding, so deep links like `#block-mcp` survive.
   - `README.md`: add a row to the version table (newest first) and update the sentence about which version the root forwards to.
5. **Verify.**
   - `node scripts/validate-data.js` (now checks both folders).
   - Start the `site` preview (`.claude/launch.json`). Open `/`: it must land on `/<new>/`. Open `/#block-mcp`: it must land on `/<new>/#block-mcp` with that block open. Open `/<old>/` to confirm it still works.
   - Check the browser console for 404s (a missed relative path shows up there).
6. **Report** the diff summary. Don't commit or push unless asked. The GitHub Pages workflow deploys the whole repository root on every push to `main`, so merging publishes the new version.
