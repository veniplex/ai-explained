# Agentic AI, Explained (v6-alpha)

> Work in progress. A new version of the site; [v1-alpha](../v1-alpha/), [v3-alpha](../v3-alpha/), [v4-alpha](../v4-alpha/) and [v5-alpha](../v5-alpha/) stay online as they were. v6-alpha is v5-alpha with the diagram moved to the middle: the kitchen on one side, the technical words on the other, and arrows from each side to the part of the map it is about.

A guided explanation of AI agents for people who are new to AI, as of **October 2026**: seven short chapters and an epilogue on the model, the context, tools, the agent loop, know-how and memory, guardrails, teams and autopilot, and running it well. A hand-drawn map grows beside the text, one piece per chapter, and ends as a map of the whole system.

## Two voices around one map

Every section is told twice at once, each time completely in its own voice, and there is no switch:

- **Kitchen** (left): everything is a restaurant kitchen, nothing else. The owner is the reader, the chef is the model, the counter is the context, and so on. The running example is a Saturday order of tomatoes. The real term appears only as a **bold bridge** so the reader learns the word.
- **Technical** (right): no picture at all. The mechanism, the details, dated facts and sources. The running example is the Lisbon flights.
- **The middle** belongs to both. In a chapter it is the map so far: the chapter being read is open, every other piece is folded to its heading, and the new piece draws itself in when the chapter first comes on screen. On the hero it is the four parts of an agent, on a term page the map with the term marked, in the recap the number and both names of an idea.

The passage in view in each outer column gets an arrow to the pieces of the map it is about, so both voices point at the same thing. Hover or focus a passage to make its arrow follow. `assets/js/arrows.js` draws them; what each passage is about is `AE3.points` in `assets/js/data/core.js`.

Where both voices say the same thing, it is told once, in the middle: the question a chapter answers (the technical `problem`; the kitchen voice has none of its own), the name of a chapter in both voices, the title of an idea. The explanations themselves stay in their own voice, because the kitchen picture and the technical mechanism are different texts.

### Screen sizes

| Screen | Layout |
| --- | --- |
| 1300px wide and 620px tall, or more | three columns, sticky map in the middle, arrows |
| 900px to that | the map so far as a compact card above two columns, no arrows |
| below 900px | one column: the map, then the kitchen, then the technical words; each carries its voice tag |

Nothing is hidden at any size; narrow pages are just longer. Term pages show the details, dated facts and sources (technical only) across the full width below the three columns. Guides use the same pairing wherever both voices have a text: the glossary, the "easily confused" cards, the complexity ladder. The rest of the build guide has no kitchen version and says so.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-7`, `#ch-e` | a chapter (`e` is the epilogue) |
| `#map` | the whole map |
| `terms/skills/` | one term, a page of its own (any id in `assets/js/data/entries.js`) |
| `guides/compare/`, `guides/build/`, `guides/glossary/`, `guides/learn/`, `guides/about/` | a guide, a page of its own |
| `guides/glossary/#term-<name>` | one glossary term |
| `#e-skills`, `#guide-compare` | old links from when terms and guides opened in a panel; they forward to the pages above |

## Edit the content

All text lives in `assets/js/data/`:

- `core.js`: the shape of the path: the eight chapters with their entries and zones, what each recap idea points to, what each passage of a chapter is about (`AE3.points`, which the arrows follow), the proportions of the figures and the guide titles. No prose.
- `entries.js`: the 21 entries in the technical voice (`short`, `how`, `example`, `forYou`, `deeper`). Levels 1 and 2 stay under 150 words.
- `sources.js`: per entry, the v1-alpha blocks it covers, search synonyms, dated facts and sources.
- `guides.js`: the content of the guides in the technical voice (the glossary, the comparison table, the build guide, the learn list).
- `voice-kitchen-a.js`, `voice-kitchen-b.js`: the kitchen voice of the chapters (`AE3.kitchen.chapters`) and entries (`AE3.kitchen.entries`).
- `voice-tech.js`: the technical voice of the chapters (`AE3.tech.chapters`), including the `problem` line both voices share.
- `voice-guides.js`: the kitchen glossary, comparison and build ladder, and the technical ledes of the guides.
- `voice-ui.js`: the smaller texts of both voices: the hero line, the five things to remember, the figure labels, the map labels and the headings of the page.

`AE3.points` has one list per paragraph of a chapter and one for its example, per voice. An item is a list of up to three entry ids (the entry must already be on the map in that chapter), `you` (the person at the top of the map) or `zone` (the chapter's own piece as a whole). On a term page every passage points at the term itself.

`assets/js/voice.js` hands the scripts the two voices as `voice.kitchen` and `voice.tech`, with the same methods, so every view builds both columns with the same code.

The kitchen voice uses one casting (owner = reader, chef = model, counter = context, order ticket = prompt, knives = tools, standard plug = MCP, tasting loop = agent loop, the kitchen around the chef = harness, and so on; see the tables in `voice-kitchen-*.js`). It may not use technical words outside a bold bridge, a link label or code, and the technical voice may not use the kitchen picture; `scripts/check-voice.js` lists every slip.

Inline markup: `` `code` ``, `**bold**`, `[[entry-id]]` or `[[entry-id|label]]`, `[text](https://…)`.

After every change, run `node scripts/check-v6.js` from the repository root. It checks the word budgets of both voices, that neither voice uses the other's words, that every chapter, entry and glossary term has a kitchen text, that every link resolves, that every v1-alpha block is covered by exactly one entry, that every glossary term appears on the page, that every passage says what it is about and only names pieces already on the map, and that the term and guide pages are up to date.

## The term and guide pages

`terms/<id>/index.html` and `guides/<id>/index.html` are generated: the same shell as `index.html`, with their own title, description and address. They hold no content; `assets/js/app.js` and `pages.js` fill them in from `assets/js/data/`. After adding, renaming or removing a term or a guide, or after changing the shell in `index.html`, run `node scripts/build-v6-pages.js` and commit the result (`check-v6.js` fails while they are stale).

## Accessibility and privacy

Same as v1-alpha: keyboard only works (`/` search, `Esc` closes the menu), reduced motion stops all drawing animations, light and dark themes, no cookies, no analytics, no external requests. Only the theme and the checklist are stored, in the visitor's own browser. The arrows only repeat what the text says; the map beside a chapter is hidden from screen readers, and the chips under each chapter are the keyboard route to the same terms. The voice choice of v4-alpha (`ae-mode`, `?view=`) is gone; old `?view=` links simply show both voices.

## Credits

Typefaces Source Serif 4, DM Sans and DM Mono (SIL Open Font License); hand-drawn shapes by rough.js (MIT). An independent project, not affiliated with any company or product mentioned on the page.
