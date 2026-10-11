# Agentic AI, Explained

An interactive, single-page map of every building block of agent-based AI work, as of **October 2026**: models, providers, harnesses, the agent loop, context engineering, instruction files, skills, playbooks, slash commands, plugins, RAG, embeddings, MCP, tools, sandboxes, computer use, sub-agents, multi-agent systems, A2A, hooks, permissions, guardrails, security, evals, observability, cost and governance.

For each block the page explains what it is, when to use it, what to watch out for, current practice, and the exact moment it enters an agent run. Every block links to vetted sources: official documentation, specifications, peer-reviewed or widely cited papers, and talks from established channels (Andrej Karpathy, 3Blue1Brown, IBM Technology, Stanford, DeepLearning.AI, Anthropic, OpenAI, Google and others).

**Live site:** https://veniplex.github.io/ai-explained/ (after GitHub Pages is enabled, see below)

## What's on the page

- **The map:** all 42 building blocks in seven zones around the harness, with labelled connections. Click any block for details.
- **One run, step by step:** a 16-step walkthrough that highlights which blocks are active at each moment of a run.
- **Inside the context window:** what fills the model's working memory during a long task, with and without context engineering.
- **Easily confused:** skill vs. tool vs. MCP server vs. plugin vs. hook vs. sub-agent, compared side by side.
- **Which block when?:** start from a goal and find the block to use.
- **Patterns:** from prompt chaining to multi-agent teams, each with a small diagram.
- **Build your own flow:** the complexity ladder, a 12-step recipe, four example flows, common mistakes and a pre-launch checklist.
- **Protocols & standards:** MCP, A2A, AGENTS.md, Agent Skills, MCP Apps, AG-UI, Agent Client Protocol and more, with their current status.
- **Reference, glossary and learning resources.**

## Publish it with GitHub Pages (free)

The site is plain HTML, CSS and JavaScript. There is no build step and nothing to install.

1. Merge this branch into `main`.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
5. After a minute or two the site is live at `https://<your-user>.github.io/ai-explained/`.

The `.nojekyll` file tells GitHub Pages to serve the files as they are.

To preview locally, open `index.html` in a browser, or run any static server in this folder, for example `python3 -m http.server`.

## Edit the content

All text, building blocks, walkthrough steps, tables and links live in one file: [`assets/js/data.js`](assets/js/data.js). Edit it and reload the page; no build is needed.

- Each building block has a `name`, a one-sentence `short` definition, `what`, `when`, `avoid`, `sota` (current practice), `examples` and `related` blocks.
- Sources per block are in the `SOURCES` object, and dated status notes in `FACTS`.
- Inline markup in strings: `` `code` ``, `**bold**`, and `[[block-id]]` or `[[block-id|label]]` to link to another block.

Layout and styling are in `assets/css/style.css`; rendering and interaction are in `assets/js/app.js`.

## How sources were chosen

- Primary sources first: vendor documentation and engineering blogs, specifications, standards bodies and regulators.
- Seminal or widely cited papers, linked to their arXiv (or publisher) pages.
- Videos only from large, reputable channels known for careful explanations.
- Every link was checked when the snapshot was made (HTTP status for pages, YouTube's oEmbed endpoint for videos). Product names and versions change quickly, so dated facts say when they were true.

Found an error or a broken link? Please open an issue or a pull request.

## Privacy

No cookies, no analytics and no external requests. Fonts are self-hosted and videos are plain links, not embeds. The theme choice and the checklist are stored only in the visitor's own browser (`localStorage`).

## Credits

Typefaces: [Barlow Condensed](https://github.com/jpt/barlow) and [Atkinson Hyperlegible Next & Mono](https://github.com/googlefonts/atkinson-hyperlegible-next), licensed under the SIL Open Font License 1.1 (license files in `assets/fonts/`).
