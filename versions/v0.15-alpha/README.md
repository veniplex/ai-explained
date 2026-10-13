# AI explained (v0.15-alpha)

> Work in progress. A version is a folder of its own; this one stands by itself and refers to no other.

How AI agents work, as of **October 2026**, in two ways to read the same topic, plus guides, a glossary and an about page that belong to both. The kitchen appears in two places only: the kitchen story, and the glossary, where every term shows where it sits in the kitchen.

- **The kitchen story** (`story/`) is one hand-drawn restaurant kitchen on one screen that builds itself piece by piece. A chef walks to where the next thing happens, and in the last chapter the real names are laid over the faded kitchen. Every real name opens a card, and every bold word in a caption is a link to its glossary page.
- **The technical deep dive** (`technical/`) tells the eight chapters in plain technical words with no analogy: the mechanisms, the details, dated facts and checked sources, with a map that grows beside the chapters.
- **Glossary** (`glossary/`) lists every term, 187 of them: the 21 main terms of the chapters and 166 more. The list is sorted A to Z; "By topic" is a switch in the page and in the sidebar, and the topic chips show only in that order. Every term has the same page: *Where it sits in the kitchen* (the kitchen drawing with the spot marked, a sentence on what that part is, one button "See it in the kitchen"), *Definition*, *Related terms*, *Detailed technical description* and *References*. A sidebar at the left edge lists all terms with the current one marked. Wherever a text names a glossary term, it links to it.
- **Guides** (`guides/`) are notes on a pinboard, each with a line on what to expect. Four are long articles (how an agent works, context engineering, securing agents, testing and running them); the others are a table of what is easily confused, the build guide and a reading list. A guide is centred on the page and has a list of its sections at the left edge (it follows the section you are reading); there is no table of contents at the top. Guides are technical and name no kitchen.
- **About** (`about/`) says what the site is, where the facts come from and what is stored.

The start page (`index.html`) is the first screen: two cards for the two ways in, written from the visitor's side (I am new to this, I want the full picture), and links to the guides and the glossary.

## The top bar

The same on every page: the brand (it leads back to the start page), **the search in the middle**, the version dropdown, the **Menu** and the theme button. The Menu is a dropdown (a `<details>`; Esc, a click outside or leaving it with the keyboard closes it, the arrow keys move through it) with five items in two groups: Ways in (Kitchen story, Technical deep dive) and Look things up (Guides, Glossary, About). The item for the section you are in is an ink pill.

- **Search** looks through everything: the glossary, the chapters of the deep dive, the guides, the about page and the chapters of the story. `/` opens it, Enter opens the first hit, the arrow keys choose, Esc closes. The index (`assets/js/data/search-index.js`) is loaded the first time the field is used.
- **Hover cards.** A term anywhere (a chip, a block of the map, a word in the text, a bold word of the story) shows a short technical explanation and a link to its glossary page when the mouse rests on it or the keyboard focuses it. Touch screens get no card; a tap opens the page. Esc closes it.

## Deep links

| Link | Opens |
| --- | --- |
| none | the start page with the two ways in |
| `#ch-1` … `#ch-8`, `#ch-e`, `#map`, `#e-<id>` on the start page | forwarded to the same address in `story/` |
| `#guide-<id>` on the start page | forwarded to `guides/<id>/`; `#guide-glossary` goes to `glossary/`, `#guide-about` to `about/` |
| `story/` | the empty kitchen, step one |
| `story/#ch-1` … `story/#ch-8`, `story/#ch-e` | the first step of that chapter (`e` is the whole kitchen) |
| `story/#map` | the real names laid over the faded kitchen |
| `story/#e-<id>` (for example `story/#e-skills`) | the real names, with that term's card open |
| `technical/`, `technical/#ch-1` … `#ch-8`, `#ch-e`, `#map` | the chapters and map of the deep dive, a chapter, or the whole map |
| `glossary/` | the glossary |
| `glossary/skills/`, `glossary/prompt-injection/` | one term (any id in `assets/js/data/entries.js` or `glossary.js`) |
| `guides/` | the list of guides |
| `guides/secure/`, `guides/compare/` … | one guide: `how-it-works`, `context`, `build`, `secure`, `evaluate`, `compare`, `learn` |
| `about/` | what the site is, its sources and privacy |

## How it is built

No build step apart from the generated files, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `index.html`, `assets/css/start.css`, `assets/js/start.js` | The start page: two cards (plain links), their pictures drawn with the pen of `sketch.js`, and the forwarding of older `#ch-…` links. |
| `story/index.html`, `assets/css/kitchen.css`, `assets/js/kitchen.js` | The kitchen story: one room, one screen. Controls: Next, Back, Play, speed, scrubber, chapter chips, swipe, the arrow keys, Space. `kitchen.js` also makes the caption bridges. |
| `assets/js/draw.js`, `props.js`, `data/props-*.js`, `data/kitchen.js`, `data/story.js`, `data/names.js`, `data/bridges.js` | The pen, the drawings, the kitchen as a list of things, the 62 steps, the 21 real names, and which bold word leads to which term. |
| `technical/index.html` | The shell of the deep dive (chapters, map, recap) and the template of every generated page. It loads no kitchen script, drawing or text. |
| `glossary/…`, `guides/…`, `about/` | Generated from the shell by `node scripts/build-v15-pages.js`. They hold a title, a description and a `<noscript>` text; `app.js` draws the page. Only the glossary pages also load the kitchen scripts (they draw "Where it sits in the kitchen"). Run the script after changing the term or guide list or the shell. |
| `assets/js/data/glance.js`, `data/search-index.js` | Generated by the same script: the sentence of each term for the hover card, and what the search looks through. |
| `assets/css/style.css`, `assets/js/app.js`, `story.js`, `pages.js`, `guide-views.js`, `map.js`, `sketch.js`, `voice.js` | The deep dive: look and scripts. `pages.js` draws a term page with its sidebar, the glossary, a guide with its section list, the pinboard of guides and the about page, and links every glossary term it finds in a text; `guide-views.js` draws the guides; `terms.js` puts the main terms and the glossary terms into one list; `icons.js` draws the glossary icons. |
| `assets/js/data/core.js`, `entries.js`, `sources.js`, `guides.js`, `voice-*-tech.js` | The content of the chapters and guides. |
| `assets/js/data/glossary.js`, `glossary-refs.js`, `voice-glossary-kitchen.js` | The glossary: its groups, every term with its definition, detailed description and the spot it sits at in the kitchen; the references of every term; and the kitchen sentence of every term. |
| `assets/js/data/voice-guides-long-tech-{a,b}.js` | The four long guides. |
| `assets/css/nav.css`, `assets/css/pages.css`, `assets/js/nav.js`, `search.js`, `popover.js` | The top bar and its menu, the search, the hover card; `pages.css` is the glossary, the sidebars, the notes and the long guides. |
| `assets/css/places.css`, `assets/js/locator.js` | What ties the story to the glossary: the caption bridges, the card buttons, and "Where it sits in the kitchen" on a term page. |

## Check it

`node scripts/check-v15.js` runs the checks: the content (word budgets, links, sources), the story (steps, things, captions, names), the bridge (every name is a term with a glossary page, every term is named over the kitchen, every bold word has a bridge), the kitchen kept where it belongs (only the story and the glossary pages load a kitchen script, and the deep dive, the guides and the hover texts name no kitchen), the glossary (every term has an icon, a kitchen sentence, a detailed description, 2 to 4 references and links that resolve), the long guides (sections, word budgets), the top bar (the same menu on every page), the generated files up to date, nothing requested from outside the folder and nothing that refers to another version. `node --test scripts/*.test.js` runs its tests.

## Accessibility and privacy

Keyboard only works everywhere (`/` for the search, `Esc` closes the search, the hover card and the story's card; story: arrow keys, Space, `P`, `S`); reduced motion stops the walking, the drawing and the card's fade; light and dark themes follow the system or the toggle. No cookies, no analytics, no external requests. Stored in the visitor's own browser: the theme (`ae-theme`), the story's speed (`ae-speed`), the glossary order (`ae15-order`, A to Z or by topic) and the build checklist.
