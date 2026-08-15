@AGENTS.md

## Design rules

**No shadows.** Separation comes from hairline borders and surface-level changes, never
elevation shadows — they muddy against an off-white ground. This applies to floating
elements too.

**No gradients.** Anywhere — backgrounds, buttons, cards, overlays, badges, icons.
Flat fills only. If something needs separation, use a surface-level change or a hairline
border from `theme.js`, not a gradient. This includes subtle ones (a two-stop
"almost-flat" gradient is still a gradient).

The palette is near-monochrome warm cream and ink with **no brand accent color** — state is
carried by fill and weight, never hue. Read `docs/palette.md` before touching color, and
consume tokens from `theme.js` rather than writing raw hex values.
