# Agentic AI, Explained (v0.3-alpha)

> Work in progress. A new version of the site; [v0.1-alpha](../v0.1-alpha/) stays online as the full reference.

A guided explanation of AI agents for people who are new to AI, as of **October 2026**. One restaurant kitchen and one running example ("find the three cheapest flights to Lisbon in May…") carry the reader through seven short chapters and an epilogue: the model, the context, tools, the agent loop, know-how and memory, guardrails, teams and autopilot, and running it well. A hand-drawn map grows beside the text, one piece per chapter, and ends as a map of the whole kitchen.

Every term opens in three levels: a picture and one sentence; how it works, what it means in the example and for you; and "Go deeper" with details for builders, dated facts and checked sources.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-7`, `#ch-e` | a chapter (`e` is the epilogue) |
| `#map` | the whole kitchen |
| `#e-skills` | one entry (any id in `assets/js/data/entries.js`) |
| `#guide-compare`, `#guide-build`, `#guide-glossary`, `#guide-learn`, `#guide-about` | a guide |

## Edit the content

All text lives in `assets/js/data/`:

- `core.js`: the hero, the eight chapters, the recap, the figures and the guide titles.
- `entries.js`: the 21 entries. Levels 1 and 2 (`kitchen`, `short`, `how`, `example`, `forYou`) stay under 150 words.
- `sources.js`: per entry, the v0.1-alpha blocks it covers, search synonyms, dated facts and sources.
- `guides.js`: the content of the guides.

Inline markup: `` `code` ``, `**bold**`, `[[entry-id]]` or `[[entry-id|label]]`, `[text](https://…)`.

After every change, run `node scripts/check-v3.js` from the repository root. It checks the word budgets, that every link resolves, that every v0.1-alpha block is covered by exactly one entry, and that every glossary term appears on the page.

## Accessibility and privacy

Same as v0.1-alpha: keyboard only works (`/` search, `Esc` closes), reduced motion stops all drawing animations, light and dark themes, no cookies, no analytics, no external requests. Only the theme and the checklist are stored, in the visitor's own browser.

## Credits

Typefaces Source Serif 4, DM Sans and DM Mono (SIL Open Font License); hand-drawn shapes by rough.js (MIT). An independent project, not affiliated with any company or product mentioned on the page.
