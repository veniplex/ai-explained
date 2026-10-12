# Agentic AI, Explained

> **Work in progress.** Expect changes, rough edges and missing pieces.

A guided, hand-drawn explanation of AI agents for beginners (snapshot: October 2026).

| Version | Folder | Live |
| --- | --- | --- |
| v3-alpha | [`v3-alpha/`](v3-alpha/) | https://veniplex.github.io/ai-explained/v3-alpha/ |
| v1-alpha | [`v1-alpha/`](v1-alpha/) | https://veniplex.github.io/ai-explained/v1-alpha/ |

Run `node scripts/check-v3.js` before committing content changes to v3-alpha; `node --test scripts/check-v3.test.js` tests the checker itself.

The site root (https://veniplex.github.io/ai-explained/) forwards to the newest version. Each version is a self-contained static site in its own folder; see its README for details.

GitHub Pages: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes the site on every push to `main`.
