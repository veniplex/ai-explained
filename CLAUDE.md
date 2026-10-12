# Agentic AI, Explained

A static, hand-drawn interactive map of agentic AI, published with GitHub Pages. There is no build step and no package manager.

## Layout

- `v1-alpha/`, … — one self-contained site per version. Old versions stay online unchanged. The root `index.html` forwards to the newest version and keeps the `#hash`.
- `v3-alpha/` — a guided path instead of one map. Its content lives in `assets/js/data/` (`core.js`, `entries.js`, `sources.js`, `guides.js`; no `data.js`), and `node scripts/check-v3.js` checks it. `scripts/validate-data.js` covers the versions that have a `data.js`.
- `<version>/assets/js/data.js` — **all content**: zones, connectors, blocks, walkthrough steps, story, guides, `SOURCES` (links per block) and `FACTS` (dated status notes per block).
- `<version>/assets/js/app.js` — rendering and interaction (plain ES5-style JS in an IIFE, no frameworks). `style.css` holds the layout and themes.
- `<version>/DESIGN.md` — the design system: tokens, shared classes (`.btn`, `.eyebrow`, `.badge`, `.card`, `.zdot`…) and naming rules. Use tokens, not raw values, in `style.css`.
- `assets/vendor/` (rough.js) and `assets/fonts/` are third-party files with their licences. Never edit them.
- `.github/workflows/pages.yml` deploys the whole repository root on every push to `main`.

## Content rules (data.js)

- A block needs `name`, `label`, `short`, `eli5` (the restaurant-kitchen picture), `what`, `when`, `avoid`, `sota`, `examples` and `related`. A new block must also go into a zone's `blocks` (or `groups`) list.
- Inline markup in strings: `` `code` ``, `**bold**`, `[[block-id]]` or `[[block-id|label]]`, and `[text](https://…)`. Nothing else is parsed.
- Write dated facts with a month and year ("(October 2026)"). The site is a snapshot: `meta.updated` / `meta.snapshot`.
- Sources: primary sources first (vendor docs, specs, standards bodies, regulators), then seminal papers (arXiv or publisher page), then videos from large, reputable channels only. HTTPS only.
- Voice: plain and short. British spelling where the site already uses it ("licence", "organised").

## Hard constraints

- **No external requests.** No CDNs, web fonts, analytics or embeds. Self-host everything under `assets/`; videos are plain links. A PreToolUse hook blocks edits that load remote resources.
- Accessibility promises: works with the keyboard alone (`/` focuses search, arrow keys step through the walkthrough and story, `Esc` closes), respects reduced motion, light and dark themes.
- Deep links (`#block-<id>`, `#zone-<id>`, `#link-<id>`, `#step-<n>`, `#<guide>`) are public URLs. Don't rename ids without a reason.

## Commands

- Validate content: `node scripts/validate-data.js [version]`. A PostToolUse hook runs it after every edit to `data.js`, and `node --check` after any JS edit.
- Validate v3 content: `node scripts/check-v3.js` (tests: `node --test scripts/check-v3.test.js`).
- Preview: the `site` entry in `.claude/launch.json` (`python -m http.server 8000`), then open `/v1-alpha/`.
- `/check-links` checks the links (and `/check-links stale` lists aging facts). `/new-version <name>` cuts a release.
- Agents: `content-fact-checker` (per block or zone), `a11y-reviewer` (browser audit).
