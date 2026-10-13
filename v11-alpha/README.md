# Agentic AI, Explained (v11-alpha)

> Work in progress. [v1-alpha](../v1-alpha/) to [v10-alpha](../v10-alpha/) stay online as they were. v11-alpha is v10-alpha after a round of testing from six sides (a complete beginner, an engineer using it as a reference, phones and tablets, keyboard and screen reader, visual polish, and technical quality). It keeps the shape of v10-alpha and fixes what the tests found; see "What changed since v10-alpha" below.

How an AI agent works, as of **October 2026**, in two halves that lead into each other.

- **The story** (`index.html`) is v9's kitchen: one hand-drawn restaurant kitchen on one screen that builds itself piece by piece, a chef who walks to where the next thing happens, and in the last chapter the real names laid over the faded kitchen. It is the way in for a beginner. Nothing in it is a dead end: every real name opens a card with a button to its page in the deep dive, and every bold word in a caption (for example **sandbox**) is a link to that page too.
- **The deep dive** (`dive/`, `terms/<id>/`, `guides/<id>/`) is v4's reference: eight chapters with a map that grows beside them, 21 term pages, five guides (easily confused, build your own, glossary, learn more, about), search, and the mechanisms, dated facts and checked sources an engineer wants. Every page can be read in technical words (the default here) or with the kitchen picture, with a switch in the top bar (on a phone at the top of the page).

The two halves are tied together in four places:

1. **Top bar:** two tabs, *Story* and *Deep dive*, on every page. In the story the *Deep dive* tab follows the chapter you are in (`dive/#ch-3` while you watch chapter 3).
2. **Story to deep dive:** the card of a real name has "Open the deep dive" and "Chapter N in the deep dive"; bold words in captions are links to their term; the names chapter ends each caption with a link into the deep dive.
3. **Deep dive to story:** every term page opens with "Where in the kitchen": the whole kitchen, small, with the part this term stands for outlined, and two buttons, "See it in the kitchen" (`#e-<id>`, the labelled kitchen with that card open) and "Watch chapter N build up" (`#ch-N`). Every chapter on the start page of the deep dive has "Watch this chapter in the kitchen story", and the hero has "Watch the kitchen story".
4. **One list of terms:** the 21 names laid over the kitchen are the 21 terms of the deep dive, in the same chapters (`scripts/check-v11.js` fails when they drift apart).

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

The chapters of v6 to v11 line up, so the version dropdown keeps your chapter, and a term or guide page opens the same page in another version that has them.

## How it is built

No build step apart from the generated pages, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `index.html`, `assets/css/kitchen.css`, `assets/js/kitchen.js` | The story: the reader of v9-alpha (see its README for the controls: Next, Back, Play, speed, scrubber, chapter chips, swipe). `kitchen.js` also makes the caption bridges and keeps the *Deep dive* tab in step. |
| `assets/js/draw.js`, `props.js`, `data/props-*.js`, `data/kitchen.js`, `data/story.js`, `data/names.js` | The pen, the drawings, the kitchen as a list of things, the 62 steps, and the 21 real names. |
| `assets/js/data/bridges.js` | Which bold word of a caption leads to which term page. |
| `dive/index.html` | The shell of the deep dive: the start page, and the template of every generated page. |
| `terms/<id>/index.html`, `guides/<id>/index.html` | Generated from the shell by `node scripts/build-v11-pages.js`; they hold no content. Run it after changing the term or guide list or the shell. |
| `assets/css/style.css`, `assets/js/app.js`, `story.js`, `pages.js`, `guide-views.js`, `map.js`, `sketch.js`, `voice.js` | The deep dive: v4-alpha's look and scripts (see v4-alpha's README and DESIGN.md). |
| `assets/js/data/core.js`, `entries.js`, `sources.js`, `guides.js`, `voice-*.js` | The deep dive's content, in both voices (the same as v4-alpha). |
| `assets/js/locator.js` | "Where in the kitchen" on a term page: draws the kitchen as it stands at the last step of the story from the same lists, with the term's outline on it. |
| `assets/css/places.css` | What both halves share: the two tabs, the caption bridges, the card buttons, the locator. |

## Check it

`node scripts/check-v11.js` runs the checks of both halves (v9's story and names, v4's content and pages, check-voice's two voices), then the bridge: every name is a term with a page and sits in the chapter the deep dive puts it in, every term is named over the kitchen, every bold word in a caption has a bridge, and nothing is requested from outside the folder. `node --test scripts/*.test.js` runs its tests.

## Accessibility and privacy

Keyboard only works in both halves (story: arrow keys, Space, `P`, `S`, `Esc`; deep dive: `/` for search, `Esc` closes the menu); reduced motion stops the walking and the drawing; light and dark themes follow the system or the toggle. No cookies, no analytics, no external requests. Stored in the visitor's own browser: the theme (`ae-theme`), the story's speed (`ae-speed`), the voice of the deep dive (`ae10-mode`; a visitor who arrives from the story and has not chosen gets the kitchen words) and the build checklist.

## Credits

Typefaces Source Serif 4, DM Sans and DM Mono (SIL Open Font License); hand-drawn shapes by rough.js (MIT). An independent project, not affiliated with any company or product mentioned on the page.

## What changed since v10-alpha

Found by test agents that loaded every page in Chromium, then fixed here.

**The story**
- A swipe steps the story on a touch screen (`touch-action` let the browser cancel the gesture; it is `pan-y` now, and a cancelled gesture is forgotten).
- The 21 labels are out of the tab order and the accessibility tree until the names are shown, so Tab reaches Next after the chapter chips, not after 21 invisible stops. A label has the term as its name and says whether its card is open. The card takes focus when opened by keyboard and gives it back to its label on Esc, and the address and the page title follow it.
- The page has a heading (`h1`); Back stays focusable at the first step (`aria-disabled`); Play, Speed and the scrubber have names that match what is on screen; the live caption also announces the chapter and what the figures say.
- `#e-__proto__` and friends no longer throw (lookups use objects without a prototype); `#guide-<id>` links open the guide; arrow keys inside the version menu or the card do not step the story.
- The first screen says what to do (Next pulses, and the caption says it takes about five minutes). The last step's button leads to the deep dive, and Play becomes Replay.
- Chapter chips scroll to the current chapter and are reachable on a phone; the room has air at both sides; the caption block no longer jumps between one and two lines; the scrubber is easier to hit; a phone on its side keeps the picture large and fits the card; the highlights of the names fade at once instead of a second late.
- Captions explain "AI agent", "MCP" and "tokens" where they first appear; "Tap or click" for the labels.

**The deep dive**
- Search also looks into how a page works, its details and its dated facts (so "oauth" finds MCP), ignores word endings ("prompt cache" finds "prompt caching") and ranks name hits first. The glossary filter does the same.
- The Back button puts you back where you were on the start page and on long term pages.
- The map no longer blocks the page for most of a second on load.
- Term and guide pages carry their text in a `<noscript>` block, so a reader without JavaScript or a link preview finds the content.
- Arriving from the story with no choice made opens the kitchen words, and the voice stays for the visit. The example is labelled "Example: the Lisbon trip", so it is clear the deep dive follows another task than the story.
- "Where in the kitchen" is a short strip in the technical words (the definition comes first), its two buttons look alike, and the drawing cannot be selected or found with Ctrl+F. The Story tab on a term page leads to that term in the kitchen.
- Rail dots and the voice switch are visible in forced-colours mode and have a visible outline; search is 16px on a phone (no zoom on iOS); wide tables show that they scroll; tap targets are larger.

**Shared**
- The version dropdown stays inside the window (it was cut off at the right edge in the story), sat under the chapter bar in the story, and now carries the chapter or card you are on to the other versions.
- The site has a `404.html` with a way back; the root keeps `?view=` when it forwards.
