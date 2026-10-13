# AI explained (v0.14-alpha)

> Work in progress. A version is a folder of its own; this one stands by itself and refers to no other.

How AI agents work, as of **October 2026**, in three ways to read the same topic, plus guides and a glossary that belong to whichever way you are in.

- **The kitchen story** (`story/`) is one hand-drawn restaurant kitchen on one screen that builds itself piece by piece. A chef walks to where the next thing happens, and in the last chapter the real names are laid over the faded kitchen. Every real name opens a card, and every bold word in a caption is a link to its glossary page.
- **The kitchen deep dive** (`kitchen/`) goes through the same eight chapters in more detail, with a map that grows beside the chapters, and still tells everything with the kitchen and nothing else.
- **The technical deep dive** (`technical/`) tells the same topics in plain technical words with no analogy at all: the mechanisms, the details, dated facts and checked sources. Its pages load no kitchen picture, drawing, script or data file.
- **Guides** (`<way>/guides/`) are notes on a pinboard, each with a line on what to expect. Four are long articles (how an agent works, context engineering, securing agents, testing and running them) in both voices, with a table of contents, steps, tables, callouts and, in the technical way, code. The others are a table of what is easily confused, the build guide and a reading list. Every example in a guide links to the story chapter that explains it, and every term links to the glossary.
- **Glossary** (`<way>/glossary/`) lists every term, over 180 of them: the 21 main terms of the chapters and about 165 more that the story does not need, such as RAG, evals, prompt injection or vector databases. Each has an icon, a short definition, what it is related to and where it fits. A term page shows all terms in a sidebar with the current one marked; a term the story explains links to its chapter.

The start page (`index.html`) is the first screen: three cards for the three ways in, written from the visitor's side (I am new to this, I want the full picture, I work with AI), and links to the guides and the glossary.

## The top bar

The same on every page: the brand (it leads back to the start page), **the search in the middle**, the version dropdown, the **Menu** and the theme button. The Menu is a dropdown (a `<details>`; Esc, a click outside or leaving it with the keyboard closes it, the arrow keys move through it) with six items in three groups: Explained simply (Kitchen story, Kitchen deep dive), For people who build (Technical deep dive) and Look things up (Guides, Glossary, About). The item for the section you are in is an ink pill. Guides, Glossary and About belong to the way you are in (`kitchen/…` or `technical/…`); on the start page they follow the way you read last (the one thing stored, key `ae14-path`, in your own browser).

- **Search** looks through everything: the glossary, the chapters of both deep dives, the guides, the about page and the chapters of the story. It only offers pages of the way you are in: in the technical deep dive only technical words and pages, in the kitchen story and the kitchen deep dive kitchen pages. On the start page it offers whichever fits. `/` opens it, Enter opens the first hit, the arrow keys choose, Esc closes. The index (`assets/js/data/search-index-<way>.js`, one for each way, holding only that way's voice) is loaded the first time the field is used.
- **Hover cards.** A term anywhere (a chip, a block of the map, a word in the text, a bold word of the story) shows a short explanation and a link to its full page when the mouse rests on it or the keyboard focuses it. Touch screens get no card; a tap opens the page. Esc closes it.

## Deep links

| Link | Opens |
| --- | --- |
| none | the start page with the three ways in |
| `#ch-1` … `#ch-8`, `#ch-e`, `#map`, `#e-<id>` on the start page | forwarded to the same address in `story/` |
| `#guide-<id>` on the start page | forwarded to `kitchen/guides/<id>/`; `#guide-glossary` goes to `kitchen/glossary/`, `#guide-about` to `kitchen/about/` |
| `story/` | the empty kitchen, step one |
| `story/#ch-1` … `story/#ch-8`, `story/#ch-e` | the first step of that chapter (`e` is the whole kitchen) |
| `story/#map` | the real names laid over the faded kitchen |
| `story/#e-<id>` (for example `story/#e-skills`) | the real names, with that term's card open |
| `kitchen/`, `technical/` | the chapters and map of that deep dive |
| `kitchen/#ch-1` … `#ch-7`, `#ch-e`, `#map` (the same in `technical/`) | a chapter or the whole map (`ch-8` works as well) |
| `kitchen/glossary/`, `technical/glossary/` | the glossary |
| `kitchen/glossary/skills/`, `technical/glossary/prompt-injection/` | one term (any id in `assets/js/data/entries.js` or `glossary.js`) |
| `kitchen/guides/`, `technical/guides/` | the list of guides |
| `kitchen/guides/secure/`, `technical/guides/compare/` … | one guide: `how-it-works`, `context`, `build`, `secure`, `evaluate`, `compare`, `learn` |
| `kitchen/about/`, `technical/about/` | what the site is, its sources and privacy |

## How it is built

No build step apart from the generated files, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `index.html`, `assets/css/start.css`, `assets/js/start.js` | The start page: three cards (plain links), their pictures drawn with the pen of `sketch.js`, and the forwarding of older `#ch-…` links. |
| `story/index.html`, `assets/css/kitchen.css`, `assets/js/kitchen.js` | The kitchen story: one room, one screen. Controls: Next, Back, Play, speed, scrubber, chapter chips, swipe, the arrow keys, Space. `kitchen.js` also makes the caption bridges. |
| `assets/js/draw.js`, `props.js`, `data/props-*.js`, `data/kitchen.js`, `data/story.js`, `data/names.js`, `data/bridges.js` | The pen, the drawings, the kitchen as a list of things, the 62 steps, the 21 real names, and which bold word leads to which term. |
| `kitchen/index.html`, `technical/index.html` | The shells of the two deep dives (chapters, map, recap) and the templates of every generated page. `<html data-mode>` and `<body data-path>` fix the voice. |
| `<way>/glossary/…`, `<way>/guides/…`, `<way>/about/` | Generated from the shells by `node scripts/build-v14-pages.js`. They hold a title, a description and a `<noscript>` text; app.js draws the page. Run it after changing the term or guide list or a shell. |
| `assets/js/data/glance-<way>.js`, `data/search-index-<way>.js` | Generated by the same script from the content, one of each for every way: the sentence of each term for the hover card, and what the search looks through. The technical files hold no kitchen sentence. |
| `assets/css/style.css`, `assets/js/app.js`, `story.js`, `pages.js`, `guide-views.js`, `map.js`, `sketch.js`, `voice.js` | The deep dives: look and scripts. `pages.js` draws a term page with its sidebar, the glossary, a guide, the pinboard of guides and the about page; `guide-views.js` draws the guides; `terms.js` puts the main terms and the glossary terms into one list; `icons.js` draws the glossary icons. |
| `assets/js/data/core.js`, `entries.js`, `sources.js`, `guides.js`, `voice-*.js` | The content, in both voices. |
| `assets/js/data/glossary.js`, `voice-glossary-kitchen.js` | The glossary: its groups, one icon for each main term, and every other term with its definition (technical) and its kitchen sentence. |
| `assets/js/data/voice-guides-long-{tech,kitchen}-{a,b}.js` | The four long guides, in both voices. |
| `assets/css/nav.css`, `assets/css/pages.css`, `assets/js/nav.js`, `search.js`, `popover.js` | The top bar and its menu, the search, the hover card, and the memory of the way read last; `pages.css` is the glossary, the term sidebar, the notes and the long guides. |
| `assets/css/places.css`, `assets/js/locator.js` | What ties the story to the kitchen deep dive: the caption bridges, the card buttons, and "Where in the kitchen" on a kitchen term page. |

## Check it

`node scripts/check-v14.js` runs the checks: the content in both voices (word budgets, links, sources, no kitchen word in the technical voice and no technical word outside a bold bridge in the kitchen voice), the story (steps, things, captions, names), the bridge (every name is a term with a glossary page in both deep dives, every term is named over the kitchen, every bold word has a bridge), the three ways kept apart (the technical pages load no kitchen script or data and name no kitchen), the glossary (every term has an icon, a kitchen sentence and links that resolve) and the long guides (sections, word budgets, a story chapter for every example), the top bar (the same menu on every page), the generated files up to date, nothing requested from outside the folder and nothing that refers to another version. `node --test scripts/*.test.js` runs its tests.

## Accessibility and privacy

Keyboard only works everywhere (`/` for the search, `Esc` closes the search, the hover card and the story's card; story: arrow keys, Space, `P`, `S`); reduced motion stops the walking, the drawing and the card's fade; light and dark themes follow the system or the toggle. No cookies, no analytics, no external requests. Stored in the visitor's own browser: the theme (`ae-theme`), the story's speed (`ae-speed`), the way last read (`ae14-path`) and the build checklist.
