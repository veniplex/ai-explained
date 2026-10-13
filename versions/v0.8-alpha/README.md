# Agentic AI, Explained (v0.8-alpha)

> Work in progress. [v0.1-alpha](../v0.1-alpha/), [v0.3-alpha](../v0.3-alpha/), [v0.4-alpha](../v0.4-alpha/), [v0.5-alpha](../v0.5-alpha/), [v0.6-alpha](../v0.6-alpha/) and [v0.7-alpha](../v0.7-alpha/) stay online as they were. v0.8-alpha tells the same hand-drawn comic as v0.7-alpha, but as one continuous strip that grows from left to right like a storyline.

How an AI agent works, as of **October 2026**, told as one Saturday in a restaurant kitchen. You own the kitchen, the chef is the language model, the counter is the context, and the order is three market stalls for 20 kilos of tomatoes. There are no pages: the story is one long strip. It starts as a cover card, and every step adds the next item at the right end while the camera slides along to it: a title card for each of the eight chapters of v6 (the chef, the counter, tools, the tasting loop, recipe cards and a notebook, locks, helpers and the night shift, running the kitchen), then the hand-drawn panels of the chapter, then a strip that names the real terms and links to their longer explanation in v6. A last chapter closes with the five ideas and an index of all 21 terms. A small hand-drawn arrow in each gap is the thread of the story.

## Reading it

- **Next** (or the right arrow, Space, Enter, Page Down, or a click on the dashed ghost of the next item) adds the next item at the right end and slides the camera to it. **Back** (left arrow, Page Up) takes the newest item away again.
- **Play** (or `P`) tells the story by itself, with a pause that grows with the text of the item. Any key press or button stops it; Esc stops it too. It stops at the end.
- You can also move the strip yourself: a trackpad swipe, the mouse wheel, grabbing it with the mouse, a touch drag or the scrollbar. Next then slides on from the newest item.
- The chips under the header name the chapters and follow where you are; a thin thread under them shows how much of the story is told. A chip jumps to that chapter's title card (and tells the story up to it if you had not got that far). Home slides back to the cover, End tells the whole story.
- The pictures of a chapter you jump past are drawn when they come near the screen, so a jump is fast.
- Reduced motion: nothing is drawn in turn, nothing loops, and the camera jumps instead of sliding. Play still works. Light and dark themes follow the system or the toggle.
- Screen readers: the pictures are hidden from them; each panel has a visually hidden description (`alt`) followed by its caption, speech bubbles are text, and a polite live region announces each new item.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-8` | the strip told up to the end of that chapter, sliding to its title card |
| `#ch-e`, `#map` | the whole strip, at the end chapter |
| `#e-<id>` (for example `#e-skills`) | the strip told up to the chapter that names that term, with the term marked |
| none | the cover, from the first step |

The chapters of v6 (`#ch-<n>`), v7 and v8 line up, so the version dropdown keeps your chapter. The address follows the chapter in view while you go along. Term and guide pages exist only in v6 to v4.

## How it is built

No build step, no frameworks, no requests to anywhere else; everything is in this folder. The drawings and the chapters are those of v0.7-alpha.

| File | What it does |
| --- | --- |
| `assets/js/draw.js` | The pen: shapes (`COMIC.s`) to SVG through rough.js. Fills and lines use the colour tokens of the style sheet, so both themes work. Draws a panel's backdrop, its items in order, and its frame. |
| `assets/js/props.js` | The drawings: people (chef, owner, person with moods and arm poses), furniture, things, marks. The header comment lists them and their options. `props-cover.js` and `props-extra-*.js` add more. |
| `assets/js/data/page-<n>.js` | One chapter (page 0 is the cover, page 9 the end): title, lead, panels and the strip of real names. A panel has a `scene` (the drawings and where they go), speech (`say`), a caption (`cap`) and a description for screen readers (`alt`). A panel is small (`s`, 4:3) or wide (`w`); in the strip both are as tall as each other. |
| `assets/js/comic.js` | The reader: builds the strip, shows the first k items, slides the camera, draws panels when needed, chips, Play, keys, wheel, drag, hash, theme. |
| `assets/css/style.css` | Tokens, the top bar (as in v6), the strip and its cards, panels, bubbles, and the motion. |

Motion: a new item slides in at the right and the camera follows. A panel draws its frame, then each item in the order of the scene (the lines are inked, the fill fades in, `fx` slides an item in), then the speech bubbles pop; the arrow before it inks in. A few drawings move by themselves (steam, the telephone, an alarm, the loop).

## Check it

`node scripts/check-v8.js` checks the chapters: format, that every drawing exists and draws, the kitchen voice (no technical word outside a bold bridge, no dashes, no exclamation marks outside shouts and sound effects), that every term is a v6 term and every v6 term is named, and that nothing is requested from outside the folder. `node --test scripts/*.test.js` runs its tests.
