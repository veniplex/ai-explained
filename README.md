# Agentic AI, Explained

> **Work in progress.** Expect changes, rough edges and missing pieces.

A guided, hand-drawn explanation of AI agents for beginners (snapshot: October 2026).

| Version | Folder | Live |
| --- | --- | --- |
| v4-alpha | [`v4-alpha/`](v4-alpha/) | https://veniplex.github.io/ai-explained/v4-alpha/ |
| v3-alpha | [`v3-alpha/`](v3-alpha/) | https://veniplex.github.io/ai-explained/v3-alpha/ |
| v1-alpha | [`v1-alpha/`](v1-alpha/) | https://veniplex.github.io/ai-explained/v1-alpha/ |

Run `node scripts/check-v4.js` before committing content changes to v4-alpha (`node scripts/check-v3.js` for v3-alpha, which stays unchanged); `node --test scripts/check-v4.test.js scripts/build-v4-pages.test.js` tests the checker itself.

The site root (https://veniplex.github.io/ai-explained/) forwards to the newest version; links made for v1-alpha (such as `#block-mcp`) keep going to v1-alpha. Each version is a self-contained static site in its own folder; see its README for details.

GitHub Pages: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes the site on every push to `main`.
