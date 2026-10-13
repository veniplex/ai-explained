---
name: check-links
description: Verify every external URL in data.js (HTTP status for pages, YouTube oEmbed for videos) and report dead, blocked and redirected links; with "stale", list dated facts that may be out of date.
disable-model-invocation: true
argument-hint: "[stale [months]] [version]"
---

# Check links

The README promises that every source link was checked when the snapshot was made. This skill repeats that check.

## Run

- Links (all versions, about 600 URLs, a few minutes):
  `node .claude/skills/check-links/check-links.mjs --json "$TMPDIR/links.json"`
  Add `--version v0.1-alpha` for one version, `--limit 20` for a quick smoke test.
- Stale facts (no network): `node .claude/skills/check-links/check-links.mjs --stale 6`
  (the number is months; default 6).

If `$ARGUMENTS` starts with `stale`, run the stale mode with the number that follows, otherwise run the link check. Pass a version folder through if one is named.

## Read the results

- **DEAD** (404, 410, 5xx) and **ERROR** (DNS, TLS): real problems. For each, find a replacement from the same publisher (the page often just moved; search the publisher's site). If there is none, use a stable archive (`https://web.archive.org/web/2026/<url>`) or drop the source. Never swap in a lower-quality source to fill the gap; the README's sourcing rules still apply.
- **BLOCKED** (401, 403, 429): usually bot protection. Open a few in the browser pane before calling them broken.
- **REDIRECTED**: update `data.js` to the final URL when the redirect is permanent and the target is the same document. Skip redirects to a login page, a locale variant, or a versioned docs path that will move again (for example `modelcontextprotocol.io` → `/docs/<date>/…`).
- **TIMEOUT**: rerun those alone with `--timeout 40` before acting.

For stale facts: list the ones that describe a *current* state ("is the default", "is in preview", "costs") and offer to run the `content-fact-checker` agent on their blocks. Don't edit facts on a hunch.

## Report

Summarise counts, then a table of what needs a decision: URL, where it is used (`SOURCES.<block>[i]` / `FACTS.<block>[i]`), status and your suggested fix. Ask before editing `data.js`. After edits, `node scripts/validate-data.js` must pass. The PostToolUse hook runs it too.
