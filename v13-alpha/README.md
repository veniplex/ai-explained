# Agentic AI, explained as a kitchen story (v13-alpha)

> Work in progress. A version is a folder of its own; this one stands by itself and refers to no other.

How an AI agent works, as of **October 2026**, in three ways to read the same topic, plus guides and references that belong to whichever way you are in.

- **The kitchen story** (`story/`) is one hand-drawn restaurant kitchen on one screen that builds itself piece by piece. A chef walks to where the next thing happens, and in the last chapter the real names are laid over the faded kitchen. Every real name opens a card, and every bold word in a caption is a link to its reference page.
- **The kitchen deep dive** (`kitchen/`) goes through the same eight chapters and 21 terms in more detail, with a map that grows beside the chapters, and still tells everything with the kitchen and nothing else.
- **The technical deep dive** (`technical/`) tells the same topics in plain technical words with no analogy at all: the mechanisms, the details, dated facts and checked sources. Its pages load no kitchen picture, drawing, script or data file.
- **Guides** (`<way>/guides/`) answer one question each: what is easily confused, how to build your own, what a word means, where to learn more, and what this site is.
- **References** (`<way>/references/`) are one page for each of the 21 terms. A kitchen reference shows where its term sits in the kitchen and leads to its technical twin; a technical reference holds the definition, how it works, details, dated facts and sources.

The start page (`index.html`) is the first screen: three cards, one for each way in, and two links to the guides and the references.

## The top bar

The same on every page. Row one: the brand (it leads back to the start page), **the search in the middle**, and the version dropdown and the theme button. Row two: the sections, **ELI5** (Kitchen story, Kitchen deep dive), **Technical deep dive**, **Guides**, **References**. The section you are in is an ink pill. Guides and References belong to the way you are in (`kitchen/…` or `technical/…`); on the start page they follow the way you read last (the one thing stored, key `ae13-path`, in your own browser).

- **Search** looks through everything: the references, the chapters of both deep dives, the guides, the glossary and the chapters of the story. It only offers pages of the way you are in: in the technical deep dive only technical words and pages, in the kitchen story and the kitchen deep dive kitchen pages. On the start page it offers whichever fits. `/` opens it, Enter opens the first hit, the arrow keys choose, Esc closes. The index (`assets/js/data/search-index-<way>.js`, one for each way, holding only that way's voice) is loaded the first time the field is used.
- **Hover cards.** A term anywhere (a chip, a block of the map, a word in the text, a bold word of the story) shows a short explanation and a link to its full page when the mouse rests on it or the keyboard focuses it. The link of the card is the link you are on, so a click or Enter on the term goes to the same page. Touch screens get no card; a tap opens the page. Esc closes it.

## Deep links

| Link | Opens |
| --- | --- |
| none | the start page with the three ways in |
| `#ch-1` … `#ch-8`, `#ch-e`, `#map`, `#e-<id>` on the start page | forwarded to the same address in `story/` |
| `#guide-<id>` on the start page | forwarded to `kitchen/guides/<id>/` |
| `story/` | the empty kitchen, step one |
| `story/#ch-1` … `story/#ch-8`, `story/#ch-e` | the first step of that chapter (`e` is the whole kitchen) |
| `story/#map` | the real names laid over the faded kitchen |
| `story/#e-<id>` (for example `story/#e-skills`) | the real names, with that term's card open |
| `kitchen/`, `technical/` | the chapters and map of that deep dive |
| `kitchen/#ch-1` … `#ch-7`, `#ch-e`, `#map` (the same in `technical/`) | a chapter or the whole map (`ch-8` works as well) |
| `kitchen/references/`, `technical/references/` | the list of references |
| `kitchen/references/skills/`, `technical/references/skills/` | one reference (any id in `assets/js/data/entries.js`) |
| `kitchen/guides/`, `technical/guides/` | the list of guides |
| `kitchen/guides/build/`, `technical/guides/compare/` … | one guide: `compare`, `build`, `glossary`, `learn`, `about` |

## How it is built

No build step apart from the generated files, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `index.html`, `assets/css/start.css`, `assets/js/start.js` | The start page: three cards (plain links), their pictures drawn with the pen of `sketch.js`, and the forwarding of older `#ch-…` links. |
| `story/index.html`, `assets/css/kitchen.css`, `assets/js/kitchen.js` | The kitchen story: one room, one screen. Controls: Next, Back, Play, speed, scrubber, chapter chips, swipe, the arrow keys, Space. `kitchen.js` also makes the caption bridges. |
| `assets/js/draw.js`, `props.js`, `data/props-*.js`, `data/kitchen.js`, `data/story.js`, `data/names.js`, `data/bridges.js` | The pen, the drawings, the kitchen as a list of things, the 62 steps, the 21 real names, and which bold word leads to which reference. |
| `kitchen/index.html`, `technical/index.html` | The shells of the two deep dives (chapters, map, recap) and the templates of every generated page. `<html data-mode>` and `<body data-path>` fix the voice. |
| `<way>/references/…`, `<way>/guides/…` | Generated from the shells by `node scripts/build-v13-pages.js`. They hold a title, a description and a `<noscript>` text; app.js draws the page. Run it after changing the term or guide list or a shell. |
| `assets/js/data/glance-<way>.js`, `data/search-index-<way>.js` | Generated by the same script from the content, one of each for every way: the sentence of each term for the hover card, and what the search looks through. The technical files hold no kitchen sentence. |
| `assets/css/style.css`, `assets/js/app.js`, `story.js`, `pages.js`, `guide-views.js`, `map.js`, `sketch.js`, `voice.js` | The deep dives: look and scripts. `pages.js` draws a reference, a guide and the two lists. |
| `assets/js/data/core.js`, `entries.js`, `sources.js`, `guides.js`, `voice-*.js` | The content, in both voices. |
| `assets/css/nav.css`, `assets/js/nav.js`, `search.js`, `popover.js` | The top bar (two rows), the search, the hover card, and the memory of the way read last. |
| `assets/css/places.css`, `assets/js/locator.js` | What ties the story to the kitchen deep dive: the caption bridges, the card buttons, and "Where in the kitchen" on a kitchen reference. |

## Check it

`node scripts/check-v13.js` runs the checks: the content in both voices (word budgets, links, sources, no kitchen word in the technical voice and no technical word outside a bold bridge in the kitchen voice), the story (steps, things, captions, names), the bridge (every name is a term with a reference page in both deep dives, every term is named over the kitchen, every bold word has a bridge), the three ways kept apart (the technical pages load no kitchen script or data and name no kitchen), the top bar (the same five sections on every page), the generated files up to date, nothing requested from outside the folder and nothing that refers to another version. `node --test scripts/*.test.js` runs its tests.

## Accessibility and privacy

Keyboard only works everywhere (`/` for the search, `Esc` closes the search, the hover card and the story's card; story: arrow keys, Space, `P`, `S`); reduced motion stops the walking, the drawing and the card's fade; light and dark themes follow the system or the toggle. No cookies, no analytics, no external requests. Stored in the visitor's own browser: the theme (`ae-theme`), the story's speed (`ae-speed`), the way last read (`ae13-path`) and the build checklist.
