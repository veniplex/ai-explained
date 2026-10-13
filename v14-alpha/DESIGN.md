# Design system (v14-alpha)

The deep dives live in `assets/css/style.css`, the kitchen story in `assets/css/kitchen.css`, the top bar (the same on every page) with its search, the hover card and the lists in `assets/css/nav.css`, the glossary, notes and long guides in `assets/css/pages.css`, and what ties the story to the kitchen deep dive in `assets/css/places.css`. The start page adds `assets/css/start.css`. They all use the same tokens. Every value below is a custom property on `:root`; dark mode redefines the colours only, under `:root[data-theme="dark"]`.

## Theme

The script in the `<head>` of `index.html` always sets `data-theme` before first paint: the saved choice (`localStorage` key `ae-theme`), otherwise the system setting. `app.js` follows system changes while nothing is saved. The stylesheet reads only `data-theme`, so each colour is written once per theme. The two `<meta name="theme-color">` tags repeat `--paper`; keep them in sync by hand.

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

One row, the same on every page: the brand on the left, the search in the middle, and on the right the version dropdown, the menu and the theme button. `--bar-h` is the row (`--bar-main-h`; `--sec-h` is 0), so everything that sticks below the bar keeps its offset.

| Class | What it is |
| --- | --- |
| `.bar`, `.bar-main`, `.bar-actions` | the bar, its row, and the place where `version-switcher.js` puts the dropdown |
| `.site-menu`, `.site-menu-btn`, `.site-menu-panel`, `.menu-head` | the menu: a `<details>` with a button, a panel of links in three groups and a small heading for each. `aria-current="page"` marks the section you are in (an ink pill). The panel is right-aligned under the button; on a phone it is fixed and as wide as the screen, and the button shows only its icon. Guides, Glossary and About belong to the way you are in; on the start page `nav.js` points them at the way you read last |
| `.search`, `.search-field`, `.search-results`, `.sr-kind` | the search field, centred in the bar. Below 900px it is a button that opens the field under the bar. `/` opens it, Esc closes it |
| `.pop`, `.pop-eyebrow`, `.pop-title`, `.pop-text`, `.pop-link` | the hover card of a term: shows after 260ms on a mouse, at once on keyboard focus, never on touch; Esc closes it. It sits above the page (`--z-pop`) and takes the colour of the term's zone |

## Glossary, notes and long guides (pages.css)

| Class | What it is |
| --- | --- |
| `.gl-layout`, `.gl-side`, `.gl-side-box`, `.gl-side-list`, `.gl-side-head` | a term page: the sidebar with every term (a filter field and the terms in nine groups, the current one marked with `aria-current` in its zone colour; sticky on wide screens, a closed `<details>` below 960px) beside the article |
| `.gl-card`, `.gl-chip`, `.ref-group` | the glossary: a card for each term with its icon, definition and chapter, the group chips and the By topic / A to Z switch. Icons are drawn when a card scrolls into view |
| `.note-board`, `a.note-card`, `.note-tape` | the guides as notes on a pinboard: a card with a strip of tape, a drawn icon, a title, a line on what to expect and the reading time, its outline drawn with the pen |
| `.gd-expect`, `.gd-toc`, `.gd-section`, `.gd-steps`, `.gd-callout`, `.tbl`, `.code` | a long guide: the "what you will know afterwards" note, the table of contents, numbered sections with their steps, callout, table and code (technical way only) |
| `.story-link` | "See this told as a story: chapter N" (technical way) or "Watch chapter N in the story" (kitchen way), under every example |

## Joining the story to the kitchen deep dive (places.css)

| Class | What it is |
| --- | --- |
| `a.bridge` | a bold word of a story caption that links to its glossary page (dashed underline and a small arrow) and shows the hover card |
| `.cap-more`, `.def-links`, `.def-chapter` | the links from the story into the kitchen deep dive: after a names caption, and on the card of a name (the full page, the technical page, the chapter) |
| `.locator`, `.loc-pic`, `.loc-sk` | "Where in the kitchen" on a kitchen term page. The picture is drawn by `locator.js` from the story's own data; its lines get the class `kt-line` so that the deep dive's `.sk-line` rule (all ink) does not repaint them |
| `.ch-watch` | "Watch this chapter in the kitchen story" under a chapter heading of the kitchen deep dive |

## The start page (start.css)

`.start`, `.paths`, `.path` (a card: the whole card is the link of its title), `.pic-tech` (the four parts as icons on the technical card), `.start-more` (the two links to Guides and Glossary).
