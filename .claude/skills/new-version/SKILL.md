---
name: new-version
description: Cut a new release of the site. The current root site moves into versions/<id>/ unchanged, the root becomes the new release, and versions/versions.js (dropdown, root routing) is updated.
disable-model-invocation: true
argument-hint: "<new-release-id> e.g. v1.1 or v2.0"
---

# New release

The site root is the **main release** (`veniplex.github.io/ai-explained/`): the first entry of `versions/versions.js`, the one with `main: true`. Every earlier version is a self-contained, frozen folder in `versions/<id>/` and stays online unchanged. Edits for the next release happen at the root; the release being replaced is archived first.

`$ARGUMENTS`: the id of the new release (required): `v<major>.<minor>`, for example `v1.1` or `v2.0`. Pre-releases are named `v0.<n>-alpha` (the alpha versions before 1.0 are v0.1-alpha, v0.3-alpha … v0.17-alpha) and sit in the dropdown's collapsed "Alpha versions" group; a release has no suffix.

## Steps

1. **Check.** Work on a branch, not `main`. Run `node scripts/check-site.js` and `node --test scripts/*.test.js`; both must pass before you archive. Note the id of the current main release (the first entry of `versions/versions.js`, say `v1.0`) and confirm `versions/<that id>/` does not exist yet.
2. **Archive the current release:** `node scripts/archive-release.js` (without an argument it uses the id of the main entry). It copies the root site into `versions/<id>/`, points the dropdown scripts, the icon, the canonical and `og:` addresses and the service worker at their new place, and writes a README for the folder. It refuses to overwrite a folder. Do this **before** changing anything at the root.
3. **Update `versions/versions.js`** (nothing else in `versions/` changes): take `main: true` off the entry of the release you just archived, and add the new release as the **first** entry (`id`, `codename`, `year`, `main: true`, and `guided`, `pages`, `sections` as for the other entries). The codename is the **first row of the queue in `docs/version-names.md`**: the last name of the next person in historical order whose work shaped AI (researchers and scientists only, no company founders, executives or political figures; read the rule there). Add it as `codename` with its `year`, and remove that row from the queue in the same change; if the queue is empty, add rows by the same rule first. `scripts/versions.test.js` fails when a codename repeats, the years go backwards or the queue is stale. That one edit moves the dropdown's "current" mark; the root `index.html` never names a release, so leave its routing alone.
4. **Change the root** to be the new release (content, pages, styles). Then:
   - `node scripts/build-pages.js` regenerates the glossary, guide and about pages, `glance.js`, `search-index.js` and `sw.js` (the cache prefix `ae-<id>-` comes from `versions.js`, so the new release never touches the cache of an archived one). Always run it after a change anywhere in the site, or `check-site.js` fails with "out of date".
   - `README.md`: bump the release number and date (`Release 1.0 · facts as of October 2026`), and the "Releases and older versions" section if the story it tells changed. Re-render the pictures with `node docs/readme/render.js` when the site's look changed.
   - Dated facts need a month and year; set `meta.updated` / `meta.snapshot` in `assets/js/data/core.js` to today.
5. **Verify.**
   - `node scripts/check-site.js` and `node --test scripts/*.test.js` (the tests also check the list against the folders, the old addresses and the archived copy).
   - Preview with the `site` entry of `.claude/launch.json`. `/` shows the new release; open the dropdown on it and on an archived one: the new one is marked "Current" and every release is listed, and choosing one lands on the same page of that release when it exists. `/#block-mcp` must land on `/versions/v0.1-alpha/#block-mcp`; `/#e-skills` on `/story/#e-skills`; an old address such as `/v0.12-alpha/` must forward to `/versions/v0.12-alpha/`.
   - Check the browser console for 404s.
6. **PR.** Summary and a "Details" list, nothing else (see CLAUDE.md for the privacy rules). Merging publishes the release: the Pages workflow deploys the whole repository root on every push to `main`.

## Why it is built like this

- Archived releases are copies, not moves: their URLs change once (to `/versions/<id>/`), `404.html` forwards the old `/<id>/…` addresses, and they never change again.
- The shared dropdown files (`versions.js`, `version-switcher.js`, `.css`, `favicon.svg`) live in `versions/`, so an archived page reaches them with a plain `../…versions.js` and needs no edit when a later release is added.
- The root service worker has the whole site as scope and ignores `versions/` apart from those shared files, so it never serves a stale archived page.
