# Design system (v1-alpha)

All of it lives in `assets/css/style.css`. Every value below is a custom property on `:root`; dark mode redefines the colours only, under `:root[data-theme="dark"]`.

## Theme

The script in the `<head>` of `index.html` always sets `data-theme` before first paint: the saved choice (`localStorage` key `ae-theme`), otherwise the system setting. `app.js` follows system changes while nothing is saved. The stylesheet reads only `data-theme`, so each colour is written once per theme. The two `<meta name="theme-color">` tags repeat `--paper`; keep them in sync by hand.

## Colour

| Token | Use |
| --- | --- |
| `--paper`, `--paper-2`, `--paper-3` | page, hover and quiet fills, tracks |
| `--surface` | cards, menus, the player |
| `--ink`, `--ink-2`, `--ink-3` | text: primary, body, meta. `--ink-3` passes 4.5:1 on `--paper`, `--paper-2` and `--surface` (not on `--paper-3`, which is for tracks only) |
| `--rule`, `--rule-strong` | borders and dividers |
| `--focus` | focus rings |
| `--clay` | accent **fills and graphics only** (dots, tokens, the current step) |
| `--clay-ink` | accent **text** and links. Passes 4.5:1 on paper and on `--clay-soft` |
| `--clay-soft`, `--clay-mid` | accent backgrounds; finished steps |
| `--ok`, `--bad`, `--part`, `--warn` and their `-soft` pairs | status. Own values, so recolouring a zone never changes a status |
| `--sk-ink`, `--sk-paper` | the rough.js sketch layer |
| `--scrim`, `--shadow` | overlays |

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
| `--fs-4xl` | 30px | the drawer title |
| `--fs-5xl` | 38px | display numerals, the top of the title clamps |

Weights: 400, 500, 600, and 650 for bold. Tracking: `--track-caps` for uppercase sans labels, `--track-mono` for mono labels. Text inside SVG drawings (`.lp-*`, `.pd-*`, `.sk-label`) is sized in viewBox units and stays off this scale.

## Shape, space and motion

- **Radius:** `--r-xs` 4, `--r-sm` 6, `--r-md` 10, `--r-lg` 14, `--r-xl` 18, `--r-pill`. Circles use `50%`; the highlighter stroke keeps its uneven radius on purpose.
- **Spacing:** a 2px grid. 1–3px values are only for optical nudges.
- **Dots:** `--dot` (9px) and `--dot-ring` (1.6px).
- **Motion:** easing `--ease`; durations `--dur-fast` (hover), `--dur-base` (small moves, fades), `--dur-slow` (panels), `--dur-reveal` (first-paint fades), `--dur-draw` (sketch strokes, connector flow), `--dur-boil` (line boil). `prefers-reduced-motion` cuts all of them.
- **Layers:** `--z-player` < `--z-bar` < `--z-scrim` < `--z-menu` < `--z-sheet` < `--z-drawer` < `--z-skip`. Small local values (-1, 0, 2) are only used inside an isolated stacking context.

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

Every button has hover, active (1px press), focus-visible (the global ring) and disabled (35% opacity, no pointer events) states. Dot-sized controls (story dots, walkthrough steps) get a hit area at least 24px tall; on narrow screens the walkthrough steps rely on Previous and Next as the full-size equivalent.

## Naming

- State: `is-*` or `has-*` (`is-open`, `is-on`, `is-in-loop`, `has-player`), or an ARIA attribute where one exists (`aria-current`, `aria-expanded`).
- Variant: the base class plus a suffix (`btn-ink`, `tag-yes`, `ctx-seg-strong`, `bd-list-warn`, `link-type-video`).
- Short prefixes in use: `blk` block on the map, `bd` block details in the drawer, `lp` agent-loop drawing, `pd` pattern diagram, `sk` sketch layer, `ctx` context-window bars, `conn` connector.
