# Design system (v11-alpha)

The deep dive lives in `assets/css/style.css` (from v4-alpha), the kitchen story in `assets/css/kitchen.css` (from v9-alpha), and what both share in `assets/css/places.css`. The three use the same tokens. Every value below is a custom property on `:root`; dark mode redefines the colours only, under `:root[data-theme="dark"]`.

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
- **Layers:** `--z-bar` < `--z-rail` < `--z-menu` < `--z-skip`. Small local values (-1, 0, 2) are only used inside an isolated stacking context.

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

Every button has hover, active (1px press), focus-visible (the global ring) and disabled (35% opacity, no pointer events) states. A control that looks smaller than 24px still gets a hit area at least 24px tall. (v1's player, story dots and walkthrough steps are not part of v4.)

## Naming

- State: `is-*` (`is-open`, `is-on`, `is-selected`), or an ARIA attribute where one exists (`aria-current`, `aria-expanded`).
- Variant: the base class plus a suffix (`btn-ink`, `tag-yes`, `ctx-seg-strong`, `bd-list-warn`, `link-type-video`).
- Short prefixes in use: `blk` block on the map, `bd` the body of a term page, `lp` agent-loop drawing, `pd` pattern diagram, `sk` sketch layer, `ctx` context-window bars, `conn` connector.

## v4 additions

- Prefixes: `kmap` the kitchen map (`kmap-tall`, `kmap-hub`, `kmap-mini`), `ch` a chapter (`ch-title`, `ch-problem`, `ch-section`), `hub` the whole kitchen, `fig` a figure inside a chapter, `pic` a kitchen picture, `deeper` the details of a term page (technical voice), `mode` the switch between the two voices (`mode-btn`, `mode-lg`), `formula` the four parts shown instead of the picture in the technical voice, `real-thing` the way from a kitchen page to the technical one, `page` a term or guide page (`page-head`, `page-title`, `page-lede`, `page-body`), `crumb` the link back to the guided path, `pager` the previous and next links, `rail` the dots at the left edge that show where you are, `progress` the thin line that does the same on narrow screens.
- States: `is-framed` (the kitchen frame has appeared), `is-current` / `is-past` (reading progress on the map), `is-drawing` (a piece drawing itself in).
- The voice: `<html data-mode="kitchen|technical">`. Pictures (`.pic`, `.zone-doodle`, `.eli5-doodle`) are hidden in the technical voice; the texts are not hidden but drawn per voice by the scripts. The switch is two `aria-pressed` buttons; below 760px its labels are visually hidden, below 480px the brand text goes so it fits.
- Map pieces carry `data-from="n"` (shown from chapter n on) and `data-ch="n"` (belongs to chapter n).

## Joining the two halves (places.css)

| Class | What it is |
| --- | --- |
| `.places`, `.place` | the two tabs in the top bar (Story, Deep dive); `aria-current="page"` marks the half you are in. Below 960px the labels go, below 560px the voice switch and Map leave the bar |
| `.voice-inline` | the voice switch inside the page, shown only on a phone |
| `a.bridge` | a bold word of a story caption that links to its term page (dashed underline and a small arrow) |
| `.cap-more`, `.def-links`, `.def-chapter` | the links from the story into the deep dive: after a names caption, and on the card of a name |
| `.locator`, `.loc-pic`, `.loc-sk` | "Where in the kitchen" on a term page. The picture is drawn by `locator.js` from the story's own data; its lines get the class `kt-line` so that the deep dive's `.sk-line` rule (all ink) does not repaint them |
| `.ch-watch` | "Watch this chapter in the kitchen story" under a chapter heading |

The deep dive's technical voice is the default (`<html data-mode>`, key `ae10-mode`); the kitchen voice is one switch away.
