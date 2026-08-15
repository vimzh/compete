# Palette & Token Spine

**Surface:** Compete — Pinterest for outfits
**Mood:** light cream, editorial, premium, quiet
**Status:** proposed — nothing consumed by the app yet beyond `theme.js`

---

## The thesis

This is a photo app. Every screen is dominated by try-on renders, garment cards, and
outfit grids — user-generated imagery in every color there is. The interface's job is to
disappear behind that.

So the palette is built on one rule: **the chrome is near-achromatic, the photos carry all
the color.** One accent, used sparingly, at a handful of intentional placements.

Cream specifically — rather than a cool gray — for two reasons:

1. **Skin tones.** A cool gray-blue canvas casts every try-on render slightly sallow.
   A warm cream sits behind skin without fighting it. In an app whose whole payoff is
   *you* wearing something, that matters more than it would elsewhere.
2. **Premium reads warm.** Pure `#FFFFFF` reads as "unstyled default." Cream reads as a
   deliberate choice — gallery wall, not blank canvas.

**The one exception:** photo wells stay pure white in *both* light and dark themes. A
garment shot on a cream ground picks up a warm cast and the color is a lie. Since users
may buy based on what they see, the try-on surface is a lightbox — white, always.

---

## Layer 1 — Primitives

Named for **values**, never roles. Nothing in the app should reference these directly.

### Sand (warm neutral ramp)

| Token | Hex | |
|---|---|---|
| `sand.50`  | `#FDFBF7` | |
| `sand.100` | `#FAF6EF` | canvas |
| `sand.200` | `#F2ECE1` | |
| `sand.300` | `#E7DFD1` | |
| `sand.400` | `#D3C8B6` | |
| `sand.500` | `#B0A492` | |
| `sand.600` | `#8A8073` | |
| `sand.700` | `#5C5348` | |
| `sand.800` | `#403A31` | |
| `sand.900` | `#1F1B15` | ink |
| `sand.950` | `#14120E` | dark canvas |

### Clay (accent ramp)

Terracotta. Warm enough to belong to the cream, saturated enough to be the only thing
on screen competing with a photograph.

| Token | Hex | |
|---|---|---|
| `clay.50`  | `#FBF0EB` | |
| `clay.100` | `#F5DDD2` | |
| `clay.300` | `#E0A288` | |
| `clay.400` | `#D98B6A` | dark-mode accent |
| `clay.500` | `#C4653F` | **primary accent** |
| `clay.600` | `#A8512F` | |
| `clay.700` | `#853E23` | accent text |

### Gold (Outfit of the Day only)

| Token | Hex | |
|---|---|---|
| `gold.100` | `#F7EAD1` | |
| `gold.400` | `#D9AE62` | |
| `gold.500` | `#C08F3C` | |

Reserved. Gold appears **only** on the OOTD badge and winner treatment — if it shows up
anywhere else it stops meaning "won."

### Status

| Token | Hex |
|---|---|
| `sage.500` (success) | `#5E7A52` |
| `amber.500` (warning) | `#B8892F` |
| `rust.500` (error) | `#A93B32` |
| `slate.500` (info) | `#4A6C7A` |

All desaturated to sit inside the warm world rather than puncture it.

---

## Layer 2 — Semantics

Named for **roles**. This is what components consume.

### Surface stack

| Role | Light | Dark |
|---|---|---|
| `surface.canvas` | `#FAF6EF` | `#14120E` |
| `surface.raised` | `#FFFFFF` | `#1D1A15` |
| `surface.overlay` | `#FFFFFF` | `#262219` |
| `surface.sunken` | `#F2ECE1` | `#0E0C09` |
| `surface.inverse` | `#1F1B15` | `#FAF6EF` |
| `surface.photo` | `#FFFFFF` | `#FFFFFF` |

`surface.photo` not switching is deliberate — see the thesis above.

### Text

| Role | Light | Dark | Contrast on canvas |
|---|---|---|---|
| `text.primary` | `#1F1B15` | `#F2ECE1` | ~15:1 ✅ |
| `text.secondary` | `#5C5348` | `#B5AC9C` | ~7:1 ✅ AA all sizes |
| `text.muted` | `#8A8073` | `#857C6D` | ~3.6:1 ⚠️ |
| `text.onAccent` | `#FFFFFF` | `#14120E` | |
| `text.accent` | `#853E23` | `#E0A288` | ~7:1 ✅ |

⚠️ **`text.muted` fails AA for body copy.** It's for ≥18px text or genuinely non-essential
metadata (timestamps, counts). Anything a user needs to read is `text.secondary` or darker.

⚠️ **Never set text in `clay.500`.** The accent at `#C4653F` on cream is ~3.4:1 — it fails.
That's what `text.accent` (`clay.700`) exists for. The accent is a *fill* color, not a
text color.

### Border

| Role | Light | Dark |
|---|---|---|
| `border.subtle` | `#EDE6DA` | `#2A251D` |
| `border.default` | `#E0D8C9` | `#363028` |
| `border.strong` | `#C9BFAC` | `#4A4237` |

On cream, prefer hairline borders over shadows for separation. Shadows on a warm ground
muddy fast.

### Accent

| Role | Light | Dark |
|---|---|---|
| `accent.default` | `#C4653F` | `#D98B6A` |
| `accent.hover` | `#A8512F` | `#E0A288` |
| `accent.subtle` | `#FBF0EB` | `#2E2019` |
| `accent.border` | `#E0A288` | `#5C3A29` |

**The accent budget: 3–5 placements per screen, maximum.** Primary CTA, the like state
when active, and the selected-variant indicator. That's the list. Everything else is
neutral.

---

## Intentional dark mode

Dark is not an inversion. Specifically:

- `surface.canvas` is `#14120E`, a **warm-tinted near-black** — never `#000000`. Pure black
  against warm photography looks like a rendering bug.
- Accent chroma drops: `clay.500` → `clay.400`. Full-saturation terracotta on near-black
  vibrates.
- **Shadows are replaced by border rings.** Elevation via shadow doesn't read on dark
  ground; `border.default` at 1px does the same job.
- Photo wells stay white — the lightbox rule holds in both themes.

---

## Layer 3 — the other four categories

### Spacing — 4px base
`0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

### Type scale — ~1.2 ratio
`12, 13, 15, 17, 20, 24, 30, 36`

Body 15/17. System font (SF Pro / Roboto) for UI — it's the right call for a mobile app
and costs nothing. If we want editorial weight later, a serif at `display` sizes only
(30/36) on the OOTD winner card and nowhere else.

### Radii
`0, 4, 8, 12, 16, 24, 999`

Cards at 16, buttons at 12, avatars/pills at 999. Garment thumbnails at 12 — soft, but not
so round the clothes get cropped oddly.

### Shadows — warm-tinted, two-layer

Shadow color is `rgba(31, 27, 21, α)` — **never** `rgba(0,0,0,α)`. A black shadow on cream
reads as grime; a warm one reads as depth. Two layers (tight key + soft ambient).

React Native needs both `shadow*` (iOS) and `elevation` (Android) — see `theme.js`.

### Motion
`instant 120ms · fast 180ms · base 240ms · slow 320ms`, ease-out for enters.

### Z-index
`base 0 · dropdown 10 · sticky 100 · modal 1000 · toast 10000`

---

## Notes & gaps

- **OKLCH isn't available.** React Native's color parser accepts hex/rgb/hsl only, so these
  are sRGB hex. The ramps were still spaced perceptually rather than by even hex steps.
- **Component tokens (layer 3) are deliberately not defined yet** — no components exist to
  derive them from. They should be added when the outfit card and vote button are built,
  not speculatively.
- Contrast figures above are computed against `surface.canvas`. Re-check anything that
  lands on `surface.sunken`.
