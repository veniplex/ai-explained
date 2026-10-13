# Agentic AI, Explained (v1-alpha)

> Work in progress. This is the first alpha version of the site; newer versions will live in their own folders next to this one.

A hand-drawn, interactive map of every building block of agent-based AI work, as of **October 2026**: models, providers, harnesses, the agent loop, context engineering, instruction files, skills, playbooks, slash commands, plugins, RAG, embeddings, MCP, tools, sandboxes, computer use, sub-agents, multi-agent systems, A2A, hooks, permissions, guardrails, security, evals, observability, cost and governance.

The entry page is only the map. Everything else opens when you interact with it:

- **Tap a block** for a simple picture first ("like I'm 5", told as a restaurant kitchen), then the precise definition, the moment it enters an agent run, when to use it, what to watch out for, current practice, dated status notes and vetted sources.
- **Tap a zone title** for what the zone does and how it connects to the harness; **tap an arrow** for what flows along it.
- **Watch one run** plays a 16-step walkthrough on the map: the active blocks light up, the arrows carry moving dots and the agent loop in the middle follows along.
- **Explain it like I'm 5** opens a nine-picture story of the whole system.
- **Guides** opens the deeper material: five big ideas, the steps as a list, what fills the context window, easily confused concepts (skill vs. tool vs. MCP vs. plugin vs. hook), patterns from prompt chaining to agent teams, protocols and standards, which block to use when, a build-your-own-flow guide with a checklist, all blocks, a glossary and curated learning resources.

Sources are official documentation, specifications, peer-reviewed or widely cited papers, and talks from established channels (Andrej Karpathy, 3Blue1Brown, IBM Technology, Stanford, DeepLearning.AI, Anthropic, OpenAI, Google and others).

**Live site:** https://veniplex.github.io/ai-explained/versions/v1-alpha/ (after GitHub Pages is enabled, see below)

## Deep links

Every view has its own address, so you can share exactly what you are looking at:

| Link | Opens |
| --- | --- |
| `#block-mcp` | the details of one block (any block id from `data.js`) |
| `#zone-know` | a zone: `start`, `model`, `harness`, `control`, `know`, `tools`, `orch`, `ops` |
| `#link-api` | a connection: `task`, `api`, `ctx`, `tool`, `dele`, `ops` |
| `#step-8` | the walkthrough at step 8 (1 to 16) |
| `#story`, `#ideas`, `#steps`, `#context`, `#compare`, `#patterns`, `#protocols`, `#decide`, `#build`, `#blocks`, `#glossary`, `#learn`, `#about` | a guide |

## Publish it with GitHub Pages (free)

The site is plain HTML, CSS and JavaScript. There is no build step and nothing to install.

1. Merge this branch into `main`.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
5. After a minute or two the site is live at `https://<your-user>.github.io/ai-explained/`. In this repository the site is published under `versions/`, so this version is at `…/ai-explained/versions/v1-alpha/`.

The `.nojekyll` file in the repository root tells GitHub Pages to serve the files as they are.

To preview locally, run any static server in this folder (or in the repository root and open `/v1-alpha/`), for example `python3 -m http.server`, and open the address it prints.

## Edit the content

All text, building blocks, walkthrough steps, story pictures' captions, tables and links live in one file: [`assets/js/data.js`](assets/js/data.js). Edit it and reload the page; no build is needed.

- Each building block has a `name`, a short `label` for the map, an `eli5` sentence (the kitchen picture shown first), a one-sentence `short` definition, `what`, `when`, `avoid`, `sota` (current practice), `examples` and `related` blocks.
- Zones have a `nick` (their kitchen nickname) and an `eli5` sentence; connectors have a `text` and an `eli5` sentence.
- Walkthrough steps list the `blocks` and connectors (`conn`) they light up, and the `station` where the loop diagram's token rests.
- `story`, `ideas` and `guides` hold the story slides, the five big ideas and the titles of every guide.
- Sources per block are in the `SOURCES` object, and dated status notes in `FACTS`.
- Inline markup in strings: `` `code` ``, `**bold**`, `[[block-id]]` or `[[block-id|label]]` to link to another block, and `[text](https://…)` for an external link.

Layout and styling are in `assets/css/style.css`; rendering, the hand-drawn sketches and all interaction are in `assets/js/app.js`.

## How sources were chosen

- Primary sources first: vendor documentation and engineering blogs, specifications, standards bodies and regulators.
- Seminal or widely cited papers, linked to their arXiv (or publisher) pages.
- Videos only from large, reputable channels known for careful explanations.
- Every link was checked when the snapshot was made (HTTP status for pages, YouTube's oEmbed endpoint for videos). Product names and versions change quickly, so dated facts say when they were true.

Found an error or a broken link? Please open an issue or a pull request.

## Accessibility and privacy

- Works with keyboard only: `/` focuses the search, arrow keys step through the walkthrough and the story, `Esc` closes whatever is open.
- Respects "reduce motion": the drawings appear without animation and the loop stands still.
- Light and dark themes follow your system setting, with a manual switch.
- No cookies, no analytics and no external requests. Fonts and scripts are self-hosted and videos are plain links, not embeds. The theme choice and the checklist are stored only in the visitor's own browser (`localStorage`).

## Credits

- Typefaces: [Source Serif 4](https://github.com/adobe-fonts/source-serif), [DM Sans](https://github.com/googlefonts/dm-fonts) and [DM Mono](https://github.com/googlefonts/dm-mono), licensed under the SIL Open Font License 1.1 (license files in `assets/fonts/`).
- Hand-drawn shapes: [rough.js](https://github.com/rough-stuff/rough) by Preet Shihn, MIT licence (`assets/vendor/`).
- An independent project, not affiliated with any company or product mentioned on the page.
