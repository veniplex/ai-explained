<h1 align="center">AI explained</h1>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/banner-dark.png">
    <img src="docs/readme/banner.png" alt="A hand-drawn restaurant kitchen with a chef at the stove and the title card “AI explained”." width="100%">
  </picture>
</p>

An interactive explainer of how AI agents work, for readers who are new to the topic and for people who build with it. It is a static website with no account, cookies or tracking.

**Live site: <https://veniplex.github.io/ai-explained/>**

Release 1.0 · facts as of October 2026

## What is on the site

- **Kitchen story**: the agent loop told as a hand-drawn restaurant kitchen on a single screen.
- **Deep dive**: the same chapters in plain technical words, with dated facts and sources.
- **Guides**: long articles on how agents work, context, security, evaluation and more. Every claim points to a source.
- **Glossary**: short definitions with references, linked from everywhere on the site.

Search opens with `/` or Ctrl/Cmd+K. The site works with the keyboard alone, follows the device's light or dark theme and can be installed as an app that works offline.

## Run it locally

There is no build step and no package manager. Serve the repository root with any static server:

```sh
git clone https://github.com/veniplex/ai-explained.git
cd ai-explained
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Node 18 or newer is only needed for the scripts below.

## Checks and generated files

Some files are generated from the page shells and the content data: the glossary, guide and about pages, the search index, the hover-card data and the service worker. After changing content or a shell, regenerate and check:

```sh
node scripts/build-pages.js       # regenerate the pages, search index and service worker
node scripts/check-site.js        # content, sources, generated files, privacy rules
node --test scripts/*.test.js     # checkers, version list, old addresses
```

`check-site.js` fails while the generated files are stale. How the site is put together is described in [docs/how-it-is-built.md](docs/how-it-is-built.md).

## Versions

The repository root is the current release, 1.0. Earlier versions are kept unchanged in [`versions/`](versions/) and stay online at `/versions/<name>/`; old addresses are forwarded by `404.html`. The list of versions and their codenames is [`versions/versions.js`](versions/versions.js), and every page has a version dropdown built from it.

To cut a new release, see [CLAUDE.md](CLAUDE.md) and [`.claude/skills/new-version/SKILL.md`](.claude/skills/new-version/SKILL.md). Codenames follow [docs/version-names.md](docs/version-names.md).

## Built with

Plain HTML, CSS and JavaScript, with no framework, bundler, CDN or web fonts. Drawings are made in the browser with [rough.js](https://github.com/rough-stuff/rough). The only request the site makes to another host is the star count on the GitHub button. It is published with GitHub Pages by [`pages.yml`](.github/workflows/pages.yml) on every push to `main`.

## Contributing

Corrections are welcome, especially facts that have gone out of date. Open an issue or a pull request and run `node scripts/check-site.js` first. The repository is public, so keep personal information out of anything you submit. The conventions for content, sources and pull requests are in [CLAUDE.md](CLAUDE.md).

## Licence

[CC BY-NC 4.0](LICENSE): you may share and adapt this work with credit to "AI explained" and a link to this repository, but not for commercial purposes. The third-party files in `assets/vendor/` (rough.js, MIT) and `assets/fonts/` (DM Sans, DM Mono, Source Serif 4, SIL Open Font Licence) keep their own licences.
