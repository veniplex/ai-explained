# Agentic AI, Explained (v4-alpha)

> Work in progress. A new version of the site; [v1-alpha](../v1-alpha/) and [v3-alpha](../v3-alpha/) stay online as they were.

A guided explanation of AI agents for people who are new to AI, as of **October 2026**: seven short chapters and an epilogue on the model, the context, tools, the agent loop, know-how and memory, guardrails, teams and autopilot, and running it well. A hand-drawn map grows beside the text, one piece per chapter, and ends as a map of the whole system.

## Two ways of telling it

A switch in the top bar (and in the hero) chooses how everything is explained, and each way is told completely in its own voice:

- **Kitchen** (the default): everything is a restaurant kitchen, nothing else. The owner is the reader, the chef is the model, the counter is the context, and so on. The running example is a Saturday order of tomatoes. The real term appears only as a **bold bridge** so the reader learns the word.
- **Technical**: no picture at all. The mechanism, the details, dated facts and sources. The running example is the Lisbon flights.

The choice is kept in the browser (`localStorage` key `ae-mode`) and in the address (`?view=kitchen` or `?view=technical`), so a link shows what the sender saw. The `<head>` script sets `<html data-mode>` before first paint; `sketch.js` (`sk.mode`) changes it, and `app.js` draws the page again in the other voice at the same place.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-7`, `#ch-e` | a chapter (`e` is the epilogue) |
| `#map` | the whole map |
| `terms/skills/` | one term, a page of its own (any id in `assets/js/data/entries.js`) |
| `guides/compare/`, `guides/build/`, `guides/glossary/`, `guides/learn/`, `guides/about/` | a guide, a page of its own |
| `guides/glossary/#term-<name>` | one glossary term |
| `#e-skills`, `#guide-compare` | old links from when terms and guides opened in a panel; they forward to the pages above |
| `?view=technical` | any page, in the technical voice (`?view=kitchen` for the kitchen voice) |

## Edit the content

All text lives in `assets/js/data/`:

- `core.js`: the shape of the path: the eight chapters with their entries and zones, what each recap idea points to, the proportions of the figures and the guide titles. No prose.
- `entries.js`: the 21 entries in the technical voice (`short`, `how`, `example`, `forYou`, `deeper`). Levels 1 and 2 stay under 150 words.
- `sources.js`: per entry, the v1-alpha blocks it covers, search synonyms, dated facts and sources.
- `guides.js`: the content of the guides in the technical voice (the glossary, the comparison table, the build guide, the learn list).
- `voice-kitchen-a.js`, `voice-kitchen-b.js`: the kitchen voice of the chapters (`AE3.kitchen.chapters`) and entries (`AE3.kitchen.entries`).
- `voice-tech.js`: the technical voice of the chapters (`AE3.tech.chapters`).
- `voice-guides.js`: the kitchen glossary, comparison and build ladder, and the technical ledes of the guides.
- `voice-ui.js`: the smaller texts of both voices: the hero line, the five things to remember, the figure labels, the map labels and the headings of the page.

The kitchen voice uses one casting (owner = reader, chef = model, counter = context, order ticket = prompt, knives = tools, standard plug = MCP, tasting loop = agent loop, the kitchen around the chef = harness, and so on; see the tables in `voice-kitchen-*.js`). It may not use technical words outside a bold bridge, a link label or code, and the technical voice may not use the kitchen picture; `scripts/check-voice.js` lists every slip.

Inline markup: `` `code` ``, `**bold**`, `[[entry-id]]` or `[[entry-id|label]]`, `[text](https://…)`.

After every change, run `node scripts/check-v4.js` from the repository root. It checks the word budgets of both voices, that neither voice uses the other's words, that every chapter, entry and glossary term has a kitchen text, that every link resolves, that every v1-alpha block is covered by exactly one entry, that every glossary term appears on the page, and that the term and guide pages are up to date.

## The term and guide pages

`terms/<id>/index.html` and `guides/<id>/index.html` are generated: the same shell as `index.html`, with their own title, description and address. They hold no content; `assets/js/app.js` and `pages.js` fill them in from `assets/js/data/`. After adding, renaming or removing a term or a guide, or after changing the shell in `index.html`, run `node scripts/build-v4-pages.js` and commit the result (`check-v4.js` fails while they are stale).

## Accessibility and privacy

Same as v1-alpha: keyboard only works (`/` search, `Esc` closes the menu), reduced motion stops all drawing animations, light and dark themes, no cookies, no analytics, no external requests. Only the theme and the checklist are stored, in the visitor's own browser.

## Credits

Typefaces Source Serif 4, DM Sans and DM Mono (SIL Open Font License); hand-drawn shapes by rough.js (MIT). An independent project, not affiliated with any company or product mentioned on the page.
