# Agentic AI, Explained (v0.9-alpha)

> Work in progress. [v0.1-alpha](../v0.1-alpha/), [v0.3-alpha](../v0.3-alpha/), [v0.4-alpha](../v0.4-alpha/), [v0.5-alpha](../v0.5-alpha/), [v0.6-alpha](../v0.6-alpha/), [v0.7-alpha](../v0.7-alpha/) and [v0.8-alpha](../v0.8-alpha/) stay online as they were. v0.9-alpha tells the kitchen story on one single screen: the kitchen builds itself piece by piece, the chef walks around, and at the very end the real names are laid over the faded kitchen.

How an AI agent works, as of **October 2026**, told as one Saturday in a restaurant kitchen. You own the kitchen, the chef is the language model, the counter is the context, and the order is 20 kilos of firm tomatoes. There is no comic page and no scrolling in any direction: everything happens in one room that fits the screen. An empty kitchen comes first; every step adds a piece (a counter, a knife block, a lock on the till), the chef walks to where the next thing happens, and the kitchen voice names the real term in bold. In the last chapter the kitchen fades into the background and every real name appears over the part it belongs to, with a dashed outline and a label you can click.

## Reading it

- **Next** (or the right arrow, Space, Enter, Page Down, or a click on the room) goes one step on; at the very end it starts again. **Back** (left arrow, Page Up) goes one step back. Home and End jump to the start and to the last step.
- **Play** (or `P`) goes on by itself. The speed button next to it (or `S`) cycles the pause between steps: **1 s, 2 s (the default) or 3 s**. The choice is kept in this browser. Next, Back, a click, a chapter chip, the scrubber or Esc takes over from Play; it stops by itself at the end.
- The scrubber under the room shows how far you are and can be dragged to any step. The chips under the header name the chapters (Start, 1 to 8, End, Names) and jump to the first step of each.
- Every step can be opened directly: the room is always drawn from all steps up to it, so a jump shows the same kitchen as clicking through.
- In the last chapter (Names) click a label to read what the term means, with a link to its longer page in v0.6-alpha. The chapter steps through the real names group by group; the other groups stay dim.
- Small screens: the room follows the action (the camera zooms and slides to the part that matters) and on a phone the labels become numbered pins. Reduced motion: nothing loops, people do not walk but appear where they stand, and steps switch without movement; Play still works. Light and dark themes follow the system or the toggle.
- Screen readers: the room is hidden from them; the caption of each step is a polite live region.

## Deep links

| Link | Opens |
| --- | --- |
| `#ch-1` … `#ch-8` | the first step of that chapter, with the kitchen built up to it |
| `#ch-e` | the first step of the last chapter, "The whole kitchen" |
| `#map` | the real names laid over the faded kitchen |
| `#e-<id>` (for example `#e-skills`) | the real names, with that term's card open |
| none | the empty kitchen, step one |

The chapters of v6 (`#ch-<n>`), v7, v8 and v9 line up, so the version dropdown keeps your chapter. The address follows the step you are on. Term and guide pages exist only in v6 to v4.

## How it is built

No build step, no frameworks, no requests to anywhere else; everything is in this folder.

| File | What it does |
| --- | --- |
| `assets/js/draw.js` | The pen: shapes (`COMIC.s`) to SVG through rough.js, plus `COMIC.actor` (one movable thing of the kitchen), `COMIC.halo` (a dashed outline) and `COMIC.room` (wall and floor). |
| `assets/js/props.js`, `data/props-*.js` | The drawings: people (chef, owner, person with moods and arm poses), furniture, tools, marks. `props-v9.js` adds the socket board, the knife block and the pinned rules. |
| `assets/js/data/kitchen.js` | The room as a list of things, each placed once: id, layer, drawing, x, y, options. |
| `assets/js/data/story.js` | The chapters and the steps. A step shows or hides things, sends people somewhere (`go`), changes how they look (`pose`), says a caption and a few speech bubbles, and may turn night on or move the camera. The last steps carry `map`. |
| `assets/js/data/names.js` | The real names: term, short label, explanation, the outline round the part of the kitchen it belongs to, and where its label sits. |
| `assets/js/kitchen.js` | The reader: builds the room, works out the room at any step, animates the change, Play and speed, keys, swipe, scrubber, chips, labels and cards, hash, camera, theme. |
| `assets/css/style.css` | Tokens, the top bar, the room, the motion (walking, ink drawing, entrances, the map fade) and the console. |

Motion: a new thing draws itself (the lines are inked, the fill fades in) and drops into place; people walk to their next spot with a small waddle; the camera on a small screen slides along. The time of every animation scales with the pause between steps, so 1 s plays quick and 3 s plays calm. Night puts a dark wash over the room.

## Check it

`node scripts/check-v9.js` checks the story: every step names things, poses and spots that exist, the kitchen voice of every caption and speech bubble (no technical word outside a bold bridge, no dashes, no exclamation marks outside shouts), no kitchen word in the technical texts of the last chapter, that every name is a v6 term and every v6 term is named, that the outlines lie in the room, and that nothing is requested from outside the folder. `node --test scripts/*.test.js` runs its tests.
