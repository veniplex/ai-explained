# Design system

The deep dive lives in `assets/css/style.css`, the kitchen story in `assets/css/kitchen.css`, the top bar (the same on every page) with its search, the hover card and the lists in `assets/css/nav.css`, the glossary, notes and long guides in `assets/css/pages.css`, and what ties the story to the glossary in `assets/css/places.css`. The start page adds `assets/css/start.css`. They all use the same tokens. Every value below is a custom property on `:root`; dark mode redefines the colours only, under `:root[data-theme="dark"]`.

## Theme

`assets/js/theme.js`, loaded first in the `<head>` of every page, always sets `data-theme` (`light` or `dark`) before first paint and `data-theme-pref` (`system`, `light` or `dark`, for the icon of the button). There are three choices, stepped by the theme button: System (the default: the page follows the device, also while it is open), Light and Dark. Only Light and Dark are stored (`localStorage` key `ae17-theme`); System is no stored value. The stylesheet reads only `data-theme`, so each colour is written once per theme. The two `<meta name="theme-color">` tags repeat `--paper`; keep them in sync by hand.

## Colour

| Token | Use |
| --- | --- |
| `--paper`, `--paper-2`, `--paper-3` | page, hover and quiet fills, tracks |
| `--surface` | cards, menus, buttons |
| `--ink`, `--ink-2`, `--ink-3` | text: primary, body, meta. `--ink-3` passes 4.5:1 on `--paper`, `--paper-2` and `--surface` (not on `--paper-3`, which is for tracks only) |
| `--rule`, `--rule-strong` | borders and dividers |
| `--focus` | focus rings |
| `--clay` | accent **fills and graphics only** (dots, tokens, the current step) |
| `--clay-ink` | accent **text** and links. Passes 4.5:1 on paper and on `--clay-soft` |
| `--clay-soft`, `--clay-mid` | accent backgrounds; finished steps |
| `--ok`, `--bad`, `--part`, `--warn` and their `-soft` pairs | status. Own values, so recolouring a zone never changes a status |
| `--sk-ink`, `--sk-paper` | the rough.js sketch layer |
| `--shadow` | menus and hover labels |

**Zones.** Each zone has a label ink `--z-*`, a tint `--t-*` and a mid `--m-*`. Any element with `data-zone` gets them as `--zc`, `--zt` and `--zm`, plus `--zh`, the highlight behind text (the mid in light mode, three quarters mid and one quarter paper in dark mode, so light text stays above 4.5:1). Source-type badges borrow the zone hues as a categorical palette.

## Type

Three families: `--serif` (headings, reading text), `--sans` (UI), `--mono` (counters, badges, code).

| Token | Size | Use |
| --- | --- | --- |
| `--fs-2xs` | 11px | mono badges, `kbd` |
| `--fs-xs` | 12px | eyebrows, captions |
| `--fs-sm` | 13.5px | meta, chips, notes |
| `--fs-md` | 15px | UI text, lists, tables |
| `--fs-base` | 16px | body and reading text |
| `--fs-lg` | 17.5px | ledes, small headings |
| `--fs-xl` | 19.5px | zone and card titles |
| `--fs-2xl` | 22px | section headings |
| `--fs-3xl` | 26px | large headings, numerals |
| `--fs-4xl` | 30px | page titles |
| `--fs-5xl` | 38px | display numerals, the top of the title clamps |

Weights: 400, 500, 600, and 650 for bold. Tracking: `--track-caps` for uppercase sans labels, `--track-mono` for mono labels. Text inside SVG drawings (`.lp-*`, `.pd-*`, `.sk-label`) is sized in viewBox units and stays off this scale.

## Shape, space and motion

- **Radius:** `--r-xs` 4, `--r-sm` 6, `--r-md` 10, `--r-lg` 14, `--r-xl` 18, `--r-pill`. Circles use `50%`; the highlighter stroke keeps its uneven radius on purpose.
- **Spacing:** a 2px grid. 1–3px values are only for optical nudges.
- **Dots:** `--dot` (9px) and `--dot-ring` (1.6px).
- **Motion:** easing `--ease`; durations `--dur-fast` (hover), `--dur-base` (small moves, fades), `--dur-slow` (panels), `--dur-reveal` (first-paint fades), `--dur-draw` (sketch strokes, connector flow), `--dur-boil` (line boil). `prefers-reduced-motion` cuts all of them.
- **Layers:** `--z-bar` < `--z-rail` < `--z-menu` < `--z-search` < `--z-pop` < `--z-skip` (the last two are in nav.css). Small local values (-1, 0, 2) are only used inside an isolated stacking context.

## Shared pieces

| Class | What it is |
| --- | --- |
| `.btn` | pill button. Variants: `-ink` (primary), `-ghost` (no border until hover), `-sm` |
| `.icon-btn` | 40px round icon button. Variants: `-outline`, `-ink` |
| `.link-btn` | a button that looks like a link |
| `.eyebrow` | small uppercase label (also applied to `thead th`) |
| `.badge` | small mono label. Variant: `-clay` |
| `.tag` | status label that may wrap. Variants: `-yes`, `-no`, `-part` |
| `.chip` | zone-coloured block button; needs `data-zone` |
| `.card` | bordered panel on `--surface`; each use sets its own padding |
| `.zdot` | zone dot; needs a `data-zone` ancestor |

Every button has hover, active (1px press), focus-visible (the global ring) and disabled (35% opacity, no pointer events) states. A control that looks smaller than 24px still gets a hit area at least 24px tall.

## Naming

- State: `is-*` (`is-open`, `is-on`, `is-selected`), or an ARIA attribute where one exists (`aria-current`, `aria-expanded`).
- Variant: the base class plus a suffix (`btn-ink`, `tag-yes`, `ctx-seg-strong`, `bd-list-warn`, `link-type-video`).
- Short prefixes in use: `blk` block on the map, `bd` the body of a term page, `lp` agent-loop drawing, `pd` pattern diagram, `sk` sketch layer, `ctx` context-window bars, `conn` connector.

## The deep dives

- Prefixes: `kmap` the kitchen map (`kmap-tall`, `kmap-hub`, `kmap-mini`), `ch` a chapter (`ch-title`, `ch-problem`, `ch-section`), `hub` the whole kitchen, `fig` a figure inside a chapter, `pic` a kitchen picture, `deeper` the details of a term page (technical way), `formula` the four parts shown instead of the picture in the technical way, `real-thing` the way from a kitchen page to its technical twin, `page` a term or guide page (`page-head`, `page-title`, `page-lede`, `page-body`), `crumb` the link back to all guides, `pager` the previous and next links, `rail` the dots at the left edge that show where you are, `progress` the thin line that does the same on narrow screens.
- States: `is-framed` (the kitchen frame has appeared), `is-current` / `is-past` (reading progress on the map), `is-drawing` (a piece drawing itself in).
- The way: `<html data-mode="kitchen|technical">` and `<body data-path="kitchen|technical">`, both fixed by the page (`kitchen/…` or `technical/…`); nothing is switched or stored. Pictures (`.pic`, `.zone-doodle`, `.eli5-doodle`) exist only in the kitchen way, and the technical pages do not even load the drawing scripts.
- Map pieces carry `data-from="n"` (shown from chapter n on) and `data-ch="n"` (belongs to chapter n).

## The top bar (nav.css)

One row, the same on every page and the same width on every page: the brand on the left; the six places (`.bar-links`: Start, ELI5: AI as Kitchen Chef, AI Agents: Technical Deep Dive, Guides, Glossary, About; each is a pill (`--paper-2`, a thin rule); the current one is an ink pill and keeps its weight, so its word does not change width; 36px high like the GitHub pill) exactly in the middle of the window from 1340px up; the search (next to the buttons from 1340px up, in the middle below that); and on the right the GitHub pill with the star count, the theme button and, below 1340px, the menu. `--bar-h` is the row (`--bar-main-h`), so everything that sticks below the bar keeps its offset. `--actions-w` is the width of the column of buttons below 1340px (above it the two outer columns are equal), and the GitHub pill has a minimum width, so a late star count moves nothing; `html { scrollbar-gutter: stable }` keeps the scrollbar's room on every page. The version dropdown is a small tab (`.version-tab`, `[data-version-slot]`) that hangs from the right edge of the bar; on a phone it sits in the foot of the menu (`.menu-foot`, `nav.js` moves it). The bar has some life: each place has a small hand-drawn icon (`.pico`, from the sprite in the shell, drawn by `docs/logo/nav-icons.js`) in the colours of one zone (`--pz`, `--pz-tint`, `--pz-mid`), shown in the bar from 1440px and always in the menu; the current place is marked only by a hand-drawn squiggle under it (`.pico-squig`, clay) that is drawn in once, with no dark pill; on hover a place lifts and tilts a little with a springy ease and its icon wiggles, the brand mark wobbles, the star spins and the magnifier jiggles. All motion is in `prefers-reduced-motion: no-preference`; colours and the pill never move the layout.

| Class | What it is |
| --- | --- |
| `.bar`, `.bar-main`, `.bar-actions`, `.bar-links` | the bar, its row, the buttons on the right, and the six places |
| `.gh-pill`, `.gh-mark`, `.gh-name`, `.gh-stars` | the GitHub button: a pill with the mark, the word GitHub and, once `github.js` has the number, a star and the count after a thin rule. Below 1320px the word goes, below 400px the count goes. The count is the one request this site makes to anyone else (GitHub's public API, no cookies); if it fails, the count stays hidden |
| `#theme-toggle`, `.theme-icon-system`, `-light`, `-dark` | the theme button: one icon, the choice made (a screen for System, a sun, a moon); each click goes to the next of System, Light, Dark |
| `.site-menu`, `.site-menu-btn`, `.site-menu-panel`, `.menu-head`, `.menu-foot`, `.version-tab` | the menu: a `<details>` with a button, a panel of links with a line each. It exists below 1320px only, as the hamburger, and holds the five places. `.version-tab` is the small tab under the bar with the version dropdown. `aria-current="page"` marks the section you are in (an ink pill). The panel is right-aligned under the button; on a phone it is fixed and as wide as the screen, and the button shows only its icon. `.menu-foot` holds the version button on a phone, whose list opens in place inside the panel; `.to-top` is the round button at the bottom right (totop.js) |
| `.search`, `.search-field`, `.search-results`, `.sr-kind` | the search field, next to the buttons from 1340px up (a plain magnifier when the room is small) and centred below that. Below 900px it is a button that opens the field under the bar. `/` opens it, Esc closes it |
| `.pop`, `.pop-eyebrow`, `.pop-title`, `.pop-text`, `.pop-link` | the hover card of a term: shows after 260ms on a mouse, at once on keyboard focus, never on touch; Esc closes it. It sits above the page (`--z-pop`) and takes the colour of the term's zone |

## Glossary, notes and long guides (pages.css)

| Class | What it is |
| --- | --- |
| `.side-layout`, `.side`, `.gl-side-box`, `.gl-side-list`, `.gl-side-head` | a term page: the list of every term at the left edge of the window (a filter field, the A to Z / By topic switch and the terms, the current one marked with `aria-current` in its zone colour; sticky on wide screens, a closed `<details>` below 960px) with the article centred beside it; a guide uses the same layout for its sections (`.gd-side*`) |
| `.gl-card`, `.gl-chip`, `.ref-group` | the glossary: a card for each term with its icon and definition, the group chips (shown in the By topic order only) and the A to Z / By topic switch. Icons are drawn when a card scrolls into view |
| `.note-board`, `a.note-card`, `.note-tape` | the guides as notes on a pinboard: a card with a strip of tape, a drawn icon, a title, a line on what to expect and the reading time, its outline drawn with the pen |
| `.gd-audience`, `.gd-expect`, `.gd-section`, `.gd-short`, `.gd-steps`, `.gd-callout`, `.tbl`, `.code`, `.gd-src`, `.gd-sources`, `.gd-side*`, `.read-progress` | a guide, the same layout for all seven: who it is for, the "what you will know afterwards" note, numbered sections each with an "In short" line (`.gd-short`), steps, callout, table, code, optionally a view (the table of easily confused things, the ladder, the patterns, the reading lists), and the numbers of the sources it rests on (`.gd-src`); then the terms and the numbered list of sources (`.gd-sources`). At the left edge a box lists the parts and ends with the button "Explore all guides"; it stays where it is while the page scrolls. `.read-progress` is the line along the lower edge of the top bar that shows how far you have read. A part you jump to flashes once (`.is-hit`); the page scrolls smoothly unless the reader asked for less motion |

## Joining the story to the glossary (places.css)

| Class | What it is |
| --- | --- |
| `a.bridge` | a bold word of a story caption that links to its glossary page (dashed underline and a small arrow) and shows the hover card |
| `.cap-more`, `.def-links`, `.def-chapter` | the links from the story into the deep dive and the glossary: after a names caption, and on the card of a name (the glossary page, the chapter) |
| `.locator`, `.loc-pic`, `.loc-sk`, `.loc-part` | "Where it sits in the kitchen" on a term page: the picture is drawn by `locator.js` from the story's own data; its lines get the class `kt-line` so that the deep dive's `.sk-line` rule (all ink) does not repaint them |

## The start page (start.css)

`.start`, `.paths`, `.path` (a card: the whole card is the link of its title), `.pic-tech` (the four parts as icons on the technical card), `.start-more` (the two links to Guides and Glossary).
