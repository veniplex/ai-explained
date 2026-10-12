---
name: new-version
description: Cut a new version of the site (e.g. v1-alpha -> v1-beta or v2) as its own folder, and add it to versions.js (root redirect and dropdown), README and metadata.
disable-model-invocation: true
argument-hint: "<new-folder-name> [from-folder]"
---

# New version

Each version is a self-contained static site in its own folder (`v1-alpha/`, …). Old versions stay online unchanged, so their links keep working. The root `index.html` forwards to the first version in `versions.js` (the newest), except that deep links made for an older version (such as v1-alpha's `#block-mcp`) keep going to that version.

`$ARGUMENTS`: the new folder name (required, must start with `v`), and optionally the folder to copy from (default: the newest existing version).

## Steps

1. **Check.** Work on a branch, not `main`. Confirm the new folder doesn't exist yet. Run `node scripts/validate-data.js`, and for a source without `assets/js/data.js` (v3 style, content in `assets/js/data/`) also `node scripts/check-v3.js`; both must pass before you copy.
2. **Copy** the source folder to the new one with everything in it, including `assets/fonts/` and `assets/vendor/` (`cp -r`; the guard hook only blocks *edits* to vendored files, not copies).
3. **In the new folder:**
   - Set `meta.updated` to today (YYYY-MM-DD) and `meta.snapshot` to "<Month> <Year>": in `assets/js/data.js`, or in `assets/js/data/core.js` for a version without `data.js` (v3 style).
   - `index.html`: update `canonical`, `og:url`, `og:image` and any other absolute URL that names the old folder.
   - `README.md`: title and the version line at the top, the live-site URL and the path in the GitHub Pages steps.
   - `grep -rn "<old-folder>" <new-folder>/` must come back empty, except where the text means the old version on purpose.
4. **Repository root:**
   - `versions.js`: add the new version as the **first** entry of `list` (id, a one-line `note`, `guided` when it has `#ch-N` chapters, `pages` when it has `terms/<id>/` and `guides/<id>/` pages). That one edit moves the root redirect and puts the version at the top of the dropdown, marked as current. Nothing in the root `index.html` names the newest version, so leave that file alone, including v1-alpha's routing for its hashes (`#block-…`, `#zone-…`, `#link-…`, `#step-…` and the v1 guide names such as `#story` or `#glossary`). If the new version changes its deep links, extend that routing so the old version's links keep landing on the old version.
   - `README.md`: add a row to the version table (newest first) and update the sentence about which version the root forwards to (keep the note that v1-alpha deep links stay on v1-alpha).
   - The new folder's `index.html` (copied from the old one) already loads `../versions.js` and `../version-switcher.js` before `</body>`; keep both, and make sure the generated term and guide pages get them too (`node scripts/build-v<N>-pages.js`).
5. **Verify.**
   - `node scripts/validate-data.js` (now checks every folder with a `data.js`), and `node scripts/check-v3.js` for v3-style folders (it reads `v3-alpha/` only, so extend it to cover the new folder).
   - Start the `site` preview (`.claude/launch.json`). Open `/`: it must land on `/<new>/`. Open the dropdown in the header of the new and of an old version: the new one is marked "Current" and every version is listed. Open `/#block-mcp`: it must land on `/v1-alpha/#block-mcp` with that block open. Open `/#e-skills`: it must land on `/<new>/#e-skills` with that entry open. Open `/<old>/` to confirm it still works.
   - Check the browser console for 404s (a missed relative path shows up there).
6. **Report** the diff summary. Don't commit or push unless asked. The GitHub Pages workflow deploys the whole repository root on every push to `main`, so merging publishes the new version.
