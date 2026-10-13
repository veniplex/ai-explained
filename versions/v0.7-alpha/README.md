# Agentic AI, Explained (v0.7-alpha)

> Work in progress. A new kind of version: [v0.1-alpha](../v0.1-alpha/), [v0.3-alpha](../v0.3-alpha/), [v0.4-alpha](../v0.4-alpha/), [v0.5-alpha](../v0.5-alpha/) and [v0.6-alpha](../v0.6-alpha/) stay online as they were. v0.7-alpha tells the kitchen story as a hand-drawn, animated comic.

How an AI agent works, as of **October 2026**, told as one Saturday in a restaurant kitchen. You own the kitchen, the chef is the language model, the counter is the context, and the order is three market stalls for 20 kilos of tomatoes. Ten pages: a cover, one page for each of the eight chapters of v6 (the chef, the counter, tools, the tasting loop, recipe cards and a notebook, locks, helpers and the night shift, running the kitchen) and an end page. Each page is a grid of hand-drawn panels. At the bottom of each chapter page a strip names the real terms and links to their longer explanation in v6.

## Reading it

- **Next** (or the right arrow, Space, Enter, Page Down, a swipe left, or a click on the dashed ghost of the next panel) draws the next panel. **Back** (left arrow, Page Up, a swipe right) takes the last one away. When a page is complete, Next turns to the next page.
- **Play** (or `P`) turns the panels and pages by itself, with a pause that grows with the text of the panel. Any key press or button stops it; Esc stops it too. It stops at the end.
- Home and End jump to the first and last page. The chips under the header jump to a page.
- Every panel has its room from the start (a dashed ghost with its number), so the page never jumps. The newest panel scrolls into view.
- Reduced motion: nothing is drawn in turn and nothing loops; panels simply appear, and scrolling is instant. Play still works. Light and dark themes follow the system or the toggle.
- Screen readers: the pictures are hidden from them; each panel has a visually hidden description (`alt`) followed by its caption, speech bubbles are text, and a polite live region announces each new panel.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-8` | the page of that chapter, every panel shown |
| `#ch-e`, `#map` | the end page |
| `#e-<id>` (for example `#e-skills`) | the page that names that term, with the term marked |
| none | the cover, from the first panel |

The pages of v6 (`#ch-<n>`) and v7 line up, so the version dropdown keeps your chapter. Term and guide pages exist only in v6 to v4.

## How it is built

No build step, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `assets/js/draw.js` | The pen: shapes (`COMIC.s`) to SVG through rough.js. Fills and lines use the colour tokens of the style sheet, so both themes work. Draws a panel's backdrop, its items in order, and its frame. |
| `assets/js/props.js` | The drawings: people (chef, owner, person with moods and arm poses), furniture, things, marks. The header comment lists them and their options. `props-cover.js` and `props-extra-*.js` add more. |
| `assets/js/data/page-<n>.js` | One page: title, lead, panels and the strip of real names. A panel has a `scene` (the drawings and where they go), speech (`say`), a caption (`cap`) and a description for screen readers (`alt`). |
| `assets/js/comic.js` | The reader: pages, steps, keys, swipe, Play, hash, theme. |
| `assets/css/style.css` | Tokens, the top bar (as in v6), the grid of panels, bubbles, and the motion. |

Motion: each panel draws its frame, then each item in the order of the scene (the lines are inked, the fill fades in, `fx` slides an item in), then the speech bubbles pop. A few drawings move by themselves (steam, the telephone, an alarm, the loop).

## Check it

`node scripts/check-v7.js` checks the pages: format, that every drawing exists and draws, that wide panels leave no gap in the grid, the kitchen voice (no technical word outside a bold bridge, no dashes, no exclamation marks outside shouts and sound effects), that every term is a v6 term and every v6 term is named, and that nothing is requested from outside the folder. `node --test scripts/*.test.js` runs its tests.
