# v2-alpha: a guided path instead of a 42-block map

Date: 2026-10-11 · Status: approved for spec, awaiting spec review

## 1. Why

v1-alpha is accurate and well sourced, but too much for someone who knows nothing about AI:

- The entry page shows 42 blocks, 8 zones and 6 connectors at once. A newcomer meets RAG, A2A, Embeddings, Compaction and SDKs before understanding anything.
- Three parallel narratives tell the same story: the 9-picture story, the 16-step walkthrough (each step lights 4 to 8 blocks) and the five big ideas. On top come 13 guides and 110 glossary terms.
- Each block holds about 5 KB in 8 sections. Builder material (current practice, product names) sits next to the "like I'm 5" sentence, so the audience is unclear.
- Core ideas (the model) and edge topics (A2A, governance) carry the same visual weight.
- From a newcomer's view many blocks are near duplicates: skills / playbooks / commands / plugins, permissions / hooks / guardrails / security, workflows / sub-agents / multi-agent / A2A, RAG / embeddings / search.

## 2. Goal and decisions

**Goal:** a reader with no AI background builds a solid understanding of modern agentic AI work, enough to use it well, talk about it, decide about it and start building. Everything stays reachable, but not everything is visible at once.

| Decision | Choice |
| --- | --- |
| Audience | Complete newcomers; one core path for everyone, optional depth per idea |
| Language | English, like v1-alpha |
| Metaphor | The restaurant kitchen from v1-alpha, kept as the single picture |
| Depth content | 42 blocks merged into 21 entries; all sources kept |
| Form | Guided scroll story in 7 chapters plus an epilogue; the map grows chapter by chapter and ends as a small hub |
| Running example | One non-coding task followed through every chapter (section 4) |

## 3. Scope

In scope:

- New self-contained folder `v2-alpha/` next to `v1-alpha/`. Fonts, `rough.js`, favicon and the base CSS tokens are copied from v1-alpha.
- New content file, new rendering, new check script.
- After v2-alpha is complete: the root `index.html` forwards to `v2-alpha/`, and the root README lists both versions.

Out of scope:

- Any change to `v1-alpha/`. It stays online as the full reference.
- A German version or a language switch.
- New illustrations beyond rough.js shapes and small inline SVG icons in the existing style.
- A new Open Graph image (v2 copies v1's `og.png` for now).
- A build step, a framework, analytics, cookies or external requests.

## 4. The running example

> "Find the three cheapest flights to Lisbon in May, put them in my travel sheet, and book the best one once I say OK."

Chosen because it needs no coding knowledge and still touches every idea: missing knowledge, live search, a spreadsheet tool, many steps, preferences, a risky irreversible action, untrusted web pages, parallel helpers and a recurring schedule.

## 5. The core path

The page is one long scroll. Each chapter has the same shape:

1. **The problem**: one or two sentences on what the previous stage cannot do. Chapter 1 opens with the question itself.
2. **In the kitchen**: the picture.
3. **In real life**: what it means, in plain words.
4. **In our example**: the next step of the flight task.
5. **New words**: 2 to 4 term chips. Each opens its entry (section 6).

| # | Kitchen title | The problem before it | In real life | In our example | Entries introduced |
| --- | --- | --- | --- | --- | --- |
| 1 | The chef | What is this thing? | A language model has read a huge amount of text and predicts the next step. It forgets everything after each order. | Asked straight away, it answers from memory with plausible but invented or outdated prices. | `model`, `reasoning` |
| 2 | The counter | The chef knows nothing about you or about today. | The context is everything the model sees right now, and it is limited. | You add dates, budget and home airport; the answer gets more specific. | `context`, `prompt` |
| 3 | Knives, pots and one plug | The chef can only talk. | Tools let it search, read files and use apps; MCP is the standard plug for connecting them. | It searches live flights and opens your travel sheet. | `tools`, `mcp` |
| 4 | Taste, adjust, taste again | One step is never enough. | The loop of acting, looking at the result and deciding again turns a chatbot into an **agent**. The harness is the kitchen that runs it (ChatGPT, Claude, Claude Code, Codex, Copilot). | Search, compare, try other dates, fill in the sheet, check the result. | `agent-loop`, `harness` |
| 5 | Recipe cards and a notebook | It is generic, it forgets, and the counter fills up. | House rules, recipe cards that load on demand, a library to look things up, and notes that last. | House rule "aisle seat"; a recipe card "compare the total price including bags"; it remembers your home airport next time. | `instructions`, `skills`, `knowledge`, `memory` |
| 6 | Locks and the head chef's nod | It acts, so it can do damage. | Permissions, a person's approval, a sealed test kitchen, automatic checks, and the danger of hidden instructions. | It books only after your OK; a web page with hidden instructions does not get to steer it. | `permissions`, `sandbox`, `hooks`, `security` |
| 7 | Helpers and the night shift | The job is too big, or should run without you. | Sub-agents with their own counter, fixed workflows, agent teams, schedules and background agents. | Three helpers each check one airline; a morning schedule watches prices and tells you when one drops. | `team`, `background` |
| E | Running the kitchen | Is it good? What does it cost? Is it allowed? | Evals and tracing, cost and providers, rules and regulation. | How often did it really find the cheapest flight? What did the search cost? | `evals`, `cost`, `governance` |

Chapter 4 ends on the milestone line: **model + context + tools + loop = agent.**

After the epilogue comes **"The whole kitchen"**: the complete hub map (section 8), followed by **"5 things to remember"**, the five big ideas from v1-alpha rewritten to point at v2 entries.

### Figures inside the story

- Chapter 2: the context bars from v1's "Inside the context window" guide, simplified to two bars (cluttered vs. curated counter).
- Chapter 4: the animated loop ring from v1's harness zone (assemble context → model decides → check → run tool → add result).
- No other figures. The growing map is the main picture.

## 6. Entries (21)

### 6.1 Mapping from v1-alpha

Every one of the 42 v1 block ids maps to exactly one v2 entry. The `from` field of each entry records this, and the check script enforces it.

| v2 entry id | Name | Chapter | Merges v1 ids |
| --- | --- | --- | --- |
| `model` | Language model (LLM) | 1 | `model`, `fine-tuning` |
| `reasoning` | Reasoning (thinking models) | 1 | `reasoning` |
| `context` | Context window | 2 | `context-window`, `context-engineering` |
| `prompt` | Prompt & system prompt | 2 | `system-prompt` |
| `tools` | Tools | 3 | `tools`, `computer-use` |
| `mcp` | MCP (Model Context Protocol) | 3 | `mcp` |
| `agent-loop` | Agent loop | 4 | `agent-loop`, `planning`, `verification` |
| `harness` | Harness (the agent app) | 4 | `harness`, `surfaces`, `sdk` |
| `instructions` | Instruction files | 5 | `instructions` |
| `skills` | Skills & saved prompts | 5 | `skills`, `playbooks`, `commands`, `plugins` |
| `knowledge` | Looking things up (search & RAG) | 5 | `rag`, `embeddings`, `search` |
| `memory` | Memory & compaction | 5 | `memory`, `compaction` |
| `permissions` | Permissions & approval | 6 | `permissions`, `hitl` |
| `sandbox` | Sandbox | 6 | `sandbox` |
| `hooks` | Hooks & guardrails | 6 | `hooks`, `guardrails` |
| `security` | Prompt injection & security | 6 | `security` |
| `team` | Sub-agents, workflows & teams | 7 | `subagents`, `multi-agent`, `a2a`, `workflows` |
| `background` | Background agents & triggers | 7 | `long-running`, `triggers` |
| `evals` | Evals & observability | E | `evals`, `observability` |
| `cost` | Cost & providers | E | `cost`, `provider` |
| `governance` | Governance & regulation | E | `governance` |

### 6.2 Three levels per entry

Entries open in the side drawer (as in v1-alpha).

1. **Picture and sentence** (always visible): the kitchen picture (`kitchen`, one sentence) and a plain definition (`short`, one sentence).
2. **Understand** (always visible): `how` (one or two short paragraphs), `example` (what it means in the flight task), `forYou` (one to three practical bullets: what this means when you use or choose AI tools). Levels 1 and 2 together: **at most 150 words**.
3. **Go deeper** (collapsed `<details>`):
   - `details`: builder-level explanation condensed from v1's what / when / avoid / current practice, at most about 250 words.
   - `includes`: one line per merged concept, so every v1 term stays findable (for example "**Slash commands**: saved prompts you trigger by name, such as /review.").
   - `facts`: at most 4 dated facts with their source.
   - `sources`: all v1 sources of the merged blocks, de-duplicated by URL. The first three are shown; the rest sit behind "All sources (n)". Ordering: definitions and specifications, then official docs, then papers, then guides, blogs and videos.
   - A closing line "Full detail in v1-alpha:" with links to the merged blocks there (`../v1-alpha/#block-<v1 id>`), generated from `from`.

The metaphor appears only in level 1. Levels 2 and 3 speak plainly.

### 6.3 Writing rules

- Short sentences, everyday words, explained jargon. Every technical term is explained the first time it appears on the page.
- New text is written fresh for chapters and for levels 1 and 2. Level 3 is condensed from v1 content.
- Dated statements carry their month and year; the snapshot stays "October 2026".
- Inline markup as in v1: `` `code` ``, `**bold**`, `[[entry-id]]` or `[[entry-id|label]]`, `[text](https://…)`.

## 7. Guides: from 13 to 5

Opened from the header menu as full-height sheets, as in v1-alpha.

| Guide | Content | Built from v1 |
| --- | --- | --- |
| Easily confused | Skill vs. tool vs. MCP vs. plugin vs. hook vs. instructions vs. memory, as a table | `compare` (rows re-pointed to v2 entries) |
| Build your own | The ladder (single prompt → agent team), the recipe, patterns, protocols and the checklist, condensed | `ladder`, `recipe`, `patterns`, `protocols`, `checklist`, `flows` |
| Glossary | Only terms that occur on the page or in entries, about 50 | `glossary` (filtered, re-pointed) |
| Learn more | Curated talks, courses, papers; at most 5 items per group, beginners first | `learn` |
| About | Snapshot date, how sources were chosen, privacy, credits, link to v1-alpha as the full reference | `about` |

Removed: the guides Story (it is now the page), Five ideas (now the recap), Steps (replaced by chapters), Context (now a figure in chapter 2), Decide and All blocks (replaced by the hub map). Also removed: the 16-step walkthrough player and its controls.

## 8. Layout and interaction

### 8.1 First screen

- Header: brand, search, "Map" (jumps to the hub), "Guides", theme switch.
- Hero, no unexplained terms: H1 "How an AI agent works" and one sentence along the lines of "An AI agent is like a chef who has read every cookbook, remembers nothing, and cooks step by step with the tools you hand over." Below it two actions: **Start (about 12 minutes)** and **Skip to the map**.

### 8.2 Chapters

- **Wide screens (≥ 1024 px):** two columns. Text on the left; on the right a sticky map that grows. When a chapter enters the viewport (IntersectionObserver, no scroll hijacking), its zone draws in with the rough.js stroke animation; earlier zones stay, dimmed; later zones are not drawn yet. The current chapter's chips are highlighted.
- **Narrow screens (< 1024 px):** one column. Each chapter starts with a small inline "map so far" sketch rendered by the same map component with the current chapter as the limit. Sketches render lazily when they near the viewport.
- Chips in the text and on the map open the entry drawer.

### 8.3 Hub map ("The whole kitchen")

```
              ┌──────────── You: order in · dish out ────────────┐
┌─1 The chef──┐  ┌──────────── The kitchen (4: harness) ───────────┐  ┌─3 Tools──────┐
│ Model       │⇄ │   2 The counter: Context · Prompt                │⇄ │ Tools        │
│ Reasoning   │  │   4 loop ring around the counter: Agent loop     │  │ MCP          │
└─────────────┘  │   6 locks band: Permissions · Sandbox · Hooks ·  │  └──────────────┘
┌─5 Recipes───┐  │                 Security                         │  ┌─7 Helpers────┐
│ Instructions│→ └──────────────────────────────────────────────────┘⇄ │ Team         │
│ Skills …    │             ┌─E Running the kitchen──────┐             │ Background   │
└─────────────┘             │ Evals · Cost · Governance  │             └──────────────┘
                            └────────────────────────────┘
```

- Zone titles carry the chapter number; tapping a zone title scrolls to its chapter.
- Connectors are reduced to the four that carry meaning: chef ⇄ counter ("reads the counter, says the next step"), counter ⇄ tools ("tool call, result back"), recipes → counter ("loaded when needed"), kitchen ⇄ helpers ("task out, summary back").
- On narrow screens the zones stack vertically in chapter order.

### 8.4 Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-7`, `#ch-e` | a chapter |
| `#map` | the hub map |
| `#e-skills` | an entry's drawer (any v2 entry id) |
| `#guide-glossary` | a guide: `compare`, `build`, `glossary`, `learn`, `about` |

### 8.5 Kept from v1-alpha

Keyboard use (`/` focuses search, `Esc` closes drawer or sheet), "reduce motion" (zones appear without stroke animation, the loop stands still), light and dark themes with a manual switch stored in `localStorage`, self-hosted fonts and scripts, no cookies, no analytics, no external requests, `noscript` fallback.

## 9. Data model

`v2-alpha/assets/js/data.js` defines `window.AE2`:

```js
window.AE2 = {
  meta:     { updated, snapshot, repo, v1 },            // v1: "../v1-alpha/"
  hero:     { title, line },
  example:  { task, short },
  chapters: [ { id, n, title, problem, kitchen, real: [...], example, entries: [...], figure } ],
  entries:  { "<id>": { chapter, name, label, aka: [...], kitchen, short, how: [...], example,
                         forYou: [...], related: [...], from: [...v1 ids],
                         deeper: { details: [...], includes: [ { name, text } ],
                                   facts: [ { text, source } ], sources: [ { type, title, by, url, year, note } ] } } },
  recap:    [ { t, d, entries: [...] } ],
  guides:   { compare: {...}, build: {...}, glossary: [...], learn: [...], about: {...} }
};
```

- `chapters[].id` values: `chef`, `counter`, `tools`, `loop`, `recipes`, `locks`, `helpers`, `kitchen-ops`.
- `figure` is `"context-bars"`, `"loop"` or `null`.
- Sources and facts are generated once from v1's data by a throwaway script (merge by `from`, de-duplicate by URL, order as in 6.2, cap facts at 4), then edited by hand. The script is not kept in the repo.

## 10. Verification

### 10.1 Check script

`tools/check-v2.js`, run with `node tools/check-v2.js` from the repo root; exits non-zero on any failure. It checks:

1. Every v1 block id appears in exactly one v2 entry's `from`.
2. Every entry belongs to exactly one chapter, and every chapter's entries exist.
3. Every `[[id]]`, `related` id, recap id, glossary id and compare row resolves to a v2 entry.
4. Budgets: core path (hero, chapters, recap) at most 2,500 words; levels 1 and 2 of each entry at most 150 words; at most 4 entries introduced per chapter; at most 22 entries; at most 5 guides.
5. Each source has `title`, `by`, `url` and `year`, and no URL repeats within an entry.

### 10.2 Browser checks

Through the local preview (`python -m http.server`):

- 1440 × 1000 and 375 × 812, light and dark.
- Scroll through all chapters: the right zone draws at each chapter, nothing overlaps, no horizontal scroll on mobile.
- Deep links from 8.4 open the right view; `Esc` and keyboard navigation work; search finds entries, merged terms (for example "playbooks" finds `skills`) and glossary terms.
- With reduced motion emulated: no stroke animation, loop static.
- No console errors.

## 11. Success criteria

- The first screen shows one sentence, two actions and no unexplained jargon.
- The core path reads in about 12 minutes (at most 2,500 words).
- Each chapter introduces at most 4 new terms, each explained where it first appears.
- At most 22 entries and 5 guides; every v1 term remains findable through an entry's `includes` or search.
- `node tools/check-v2.js` passes; all browser checks in 10.2 pass.

## 12. Risks

- **Sticky map between 1024 and 1280 px** may squeeze the text column. Mitigation: the two-column layout uses a text column of at least 34 rem; below that it falls back to the narrow layout.
- **Metaphor stretch**: the kitchen fits 8 chapters but not every merged concept. Mitigation: the metaphor appears only in chapter headers and level 1; levels 2 and 3 speak plainly.
- **Losing nuance through merging**: mitigated by `includes` and by linking to v1-alpha as the full reference from About and from each entry's "Go deeper".
