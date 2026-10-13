# Agentic AI, Explained

> **Work in progress.** Expect changes, rough edges and missing pieces.

A hand-drawn explanation of AI agents, for beginners and for people who build with them (snapshot: October 2026).

| Version | Folder | Live |
| --- | --- | --- |
| v10-alpha | [`v10-alpha/`](v10-alpha/) | https://veniplex.github.io/ai-explained/v10-alpha/ |
| v9-alpha | [`v9-alpha/`](v9-alpha/) | https://veniplex.github.io/ai-explained/v9-alpha/ |
| v8-alpha | [`v8-alpha/`](v8-alpha/) | https://veniplex.github.io/ai-explained/v8-alpha/ |
| v7-alpha | [`v7-alpha/`](v7-alpha/) | https://veniplex.github.io/ai-explained/v7-alpha/ |
| v6-alpha | [`v6-alpha/`](v6-alpha/) | https://veniplex.github.io/ai-explained/v6-alpha/ |
| v5-alpha | [`v5-alpha/`](v5-alpha/) | https://veniplex.github.io/ai-explained/v5-alpha/ |
| v4-alpha | [`v4-alpha/`](v4-alpha/) | https://veniplex.github.io/ai-explained/v4-alpha/ |
| v3-alpha | [`v3-alpha/`](v3-alpha/) | https://veniplex.github.io/ai-explained/v3-alpha/ |
| v1-alpha | [`v1-alpha/`](v1-alpha/) | https://veniplex.github.io/ai-explained/v1-alpha/ |

Run `node scripts/check-v10.js` before committing content changes to v10-alpha, `node scripts/check-v9.js` for v9-alpha, `node scripts/check-v8.js` for v8-alpha, `node scripts/check-v7.js` for v7-alpha, `node scripts/check-v6.js` for v6-alpha (`node scripts/check-v5.js`, `check-v4.js` and `check-v3.js` for the older versions, which stay unchanged); `node --test scripts/*.test.js` tests the checkers and the root redirect.

The site root (https://veniplex.github.io/ai-explained/) forwards to the newest version (v10-alpha, the first entry of `versions.js`); every version has a dropdown in its header to switch between versions (the list also comes from `versions.js`); links made for v1-alpha (such as `#block-mcp`) keep going to v1-alpha. Each version is a self-contained static site in its own folder; see its README for details.

GitHub Pages: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes the site on every push to `main`.
