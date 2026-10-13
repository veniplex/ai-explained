# Agentic AI, Explained (v0.10-alpha)

> Work in progress. [v0.1-alpha](../v0.1-alpha/) to [v0.9-alpha](../v0.9-alpha/) stay online as they were. v0.10-alpha puts two of them together: the one-screen kitchen of v0.9-alpha and the term pages, guides and look of v0.4-alpha, so the site is a reference for beginners and for people who build agents.

How an AI agent works, as of **October 2026**, in two halves that lead into each other.

- **The story** (`index.html`) is v9's kitchen: one hand-drawn restaurant kitchen on one screen that builds itself piece by piece, a chef who walks to where the next thing happens, and in the last chapter the real names laid over the faded kitchen. It is the way in for a beginner. Nothing in it is a dead end: every real name opens a card with a button to its page in the deep dive, and every bold word in a caption (for example **sandbox**) is a link to that page too.
- **The deep dive** (`dive/`, `terms/<id>/`, `guides/<id>/`) is v4's reference: eight chapters with a map that grows beside them, 21 term pages, five guides (easily confused, build your own, glossary, learn more, about), search, and the mechanisms, dated facts and checked sources an engineer wants. Every page can be read in technical words (the default here) or with the kitchen picture, with a switch in the top bar (on a phone at the top of the page).

The two halves are tied together in four places:

1. **Top bar:** two tabs, *Story* and *Deep dive*, on every page. In the story the *Deep dive* tab follows the chapter you are in (`dive/#ch-3` while you watch chapter 3).
2. **Story to deep dive:** the card of a real name has "Open the deep dive" and "Chapter N in the deep dive"; bold words in captions are links to their term; the names chapter ends each caption with a link into the deep dive.
3. **Deep dive to story:** every term page opens with "Where in the kitchen": the whole kitchen, small, with the part this term stands for outlined, and two buttons, "See it in the kitchen" (`#e-<id>`, the labelled kitchen with that card open) and "Watch chapter N build up" (`#ch-N`). Every chapter on the start page of the deep dive has "Watch this chapter in the kitchen story", and the hero has "Watch the kitchen story".
4. **One list of terms:** the 21 names laid over the kitchen are the 21 terms of the deep dive, in the same chapters (`scripts/check-v10.js` fails when they drift apart).

## Deep links

| Link | Opens |
| --- | --- |
| none | the empty kitchen, step one |
| `#ch-1` … `#ch-8`, `#ch-e` | the first step of that chapter of the story (`e` is the whole kitchen) |
| `#map` | the real names laid over the faded kitchen |
| `#e-<id>` (for example `#e-skills`) | the real names, with that term's card open |
| `dive/` | the start page of the deep dive |
| `dive/#ch-1` … `dive/#ch-7`, `dive/#ch-e` | a chapter of the deep dive (`ch-8` works as well; `e` is the last chapter) |
| `dive/#map` | the whole map and the five things to remember |
| `terms/skills/` | one term, a page of its own (any id in `assets/js/data/entries.js`) |
| `guides/compare/`, `guides/build/`, `guides/glossary/`, `guides/learn/`, `guides/about/` | a guide |
| `?view=kitchen`, `?view=technical` | any page of the deep dive, in that voice |

The chapters of v6 to v10 line up, so the version dropdown keeps your chapter, and a term or guide page opens the same page in another version that has them.

## How it is built

No build step apart from the generated pages, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `index.html`, `assets/css/kitchen.css`, `assets/js/kitchen.js` | The story: the reader of v0.9-alpha (see its README for the controls: Next, Back, Play, speed, scrubber, chapter chips, swipe). `kitchen.js` also makes the caption bridges and keeps the *Deep dive* tab in step. |
| `assets/js/draw.js`, `props.js`, `data/props-*.js`, `data/kitchen.js`, `data/story.js`, `data/names.js` | The pen, the drawings, the kitchen as a list of things, the 62 steps, and the 21 real names. |
| `assets/js/data/bridges.js` | Which bold word of a caption leads to which term page. |
| `dive/index.html` | The shell of the deep dive: the start page, and the template of every generated page. |
| `terms/<id>/index.html`, `guides/<id>/index.html` | Generated from the shell by `node scripts/build-v10-pages.js`; they hold no content. Run it after changing the term or guide list or the shell. |
| `assets/css/style.css`, `assets/js/app.js`, `story.js`, `pages.js`, `guide-views.js`, `map.js`, `sketch.js`, `voice.js` | The deep dive: v0.4-alpha's look and scripts (see v0.4-alpha's README and DESIGN.md). |
| `assets/js/data/core.js`, `entries.js`, `sources.js`, `guides.js`, `voice-*.js` | The deep dive's content, in both voices (the same as v0.4-alpha). |
| `assets/js/locator.js` | "Where in the kitchen" on a term page: draws the kitchen as it stands at the last step of the story from the same lists, with the term's outline on it. |
| `assets/css/places.css` | What both halves share: the two tabs, the caption bridges, the card buttons, the locator. |

## Check it

`node scripts/check-v10.js` runs the checks of both halves (v9's story and names, v4's content and pages, check-voice's two voices), then the bridge: every name is a term with a page and sits in the chapter the deep dive puts it in, every term is named over the kitchen, every bold word in a caption has a bridge, and nothing is requested from outside the folder. `node --test scripts/*.test.js` runs its tests.

## Accessibility and privacy

Keyboard only works in both halves (story: arrow keys, Space, `P`, `S`, `Esc`; deep dive: `/` for search, `Esc` closes the menu); reduced motion stops the walking and the drawing; light and dark themes follow the system or the toggle. No cookies, no analytics, no external requests. Stored in the visitor's own browser: the theme (`ae-theme`), the story's speed (`ae-speed`), the voice of the deep dive (`ae10-mode`) and the build checklist.

## Credits

Typefaces Source Serif 4, DM Sans and DM Mono (SIL Open Font License); hand-drawn shapes by rough.js (MIT). An independent project, not affiliated with any company or product mentioned on the page.
