/**
 * Design tokens for fitterest.
 *
 * Three layers: primitives (values) -> semantics (roles) -> component tokens.
 * Components should only ever read from the semantic layer.
 *
 * The palette is near-monochrome by design: a neutral off-white ramp and ink,
 * no brand accent color. State is carried by fill and weight, never hue.
 * See docs/palette.md.
 */

// ─────────────────────────────────────────────────────────────
// Layer 1 — Primitives. Named for values. Do not use directly.
// ─────────────────────────────────────────────────────────────

// Near-neutral. Carries only a trace of warmth — enough that it doesn't read
// cold or clinical against skin tones, not enough to read as beige.
const stone = {
  50: '#FCFCFB',
  100: '#F7F6F4',
  200: '#F0EFEC',
  300: '#E4E2DE',
  400: '#CFCCC7',
  500: '#ADA9A3',
  600: '#837F79',
  700: '#565350',
  800: '#3B3936',
  900: '#1E1D1B',
  950: '#131211',
};

// Reserved for Outfit of the Day. The only decorative chroma in the app —
// if it appears anywhere else it stops meaning "won".
const bronze = {
  100: '#EAE6DC',
  400: '#ADA189',
  500: '#8A7F68',
};

// Desaturated to sit inside the neutral world. In a palette this quiet, a
// status color carries real weight because it's the only thing with hue.
const status = {
  olive: '#616B5A', // success
  ochre: '#93804F', // warning
  brick: '#8B5751', // error
  slate: '#5B686D', // info
};

const statusDark = {
  olive: '#828C79',
  ochre: '#B39D66',
  brick: '#AC7269',
  slate: '#78868C',
};

// Shadows are tinted with the ink, never pure black — a black shadow on an
// off-white ground reads as grime rather than depth.
const SHADOW_TINT = '30, 29, 27';

// ─────────────────────────────────────────────────────────────
// Layer 2 — Semantics. Named for roles. This is the public API.
// ─────────────────────────────────────────────────────────────

const light = {
  surface: {
    canvas: stone[100],
    raised: '#FFFFFF',
    overlay: '#FFFFFF',
    sunken: stone[200],
    inverse: stone[900],
    // Garment and try-on imagery always sits on white so colors read true,
    // in both themes. Do not theme this.
    photo: '#FFFFFF',
  },
  text: {
    primary: stone[900],
    secondary: stone[700],
    muted: stone[600], // ~4.2:1 — >=18px or non-essential metadata only
    onAccent: stone[50],
  },
  border: {
    subtle: '#EDECE9',
    default: '#E1DFDB',
    strong: '#C8C5C0',
  },
  // The accent is ink, not a color. Primary action = ink button on off-white.
  accent: {
    default: stone[900],
    hover: stone[800],
    subtle: stone[200],
    border: stone[400],
  },
  ootd: {
    default: bronze[500],
    subtle: bronze[100],
    border: bronze[400],
  },
  status,
};

const dark = {
  surface: {
    canvas: stone[950], // faintly warm near-black, never #000
    raised: '#1C1B19',
    overlay: '#24231F',
    sunken: '#0D0C0B',
    inverse: stone[100],
    photo: '#FFFFFF',
  },
  text: {
    primary: stone[200],
    secondary: '#B0ACA6',
    muted: '#7E7A74',
    onAccent: stone[950],
  },
  border: {
    subtle: '#282621',
    default: '#34322D',
    strong: '#474540',
  },
  // Inverts: off-white button on ink.
  accent: {
    default: stone[200],
    hover: '#FFFFFF',
    subtle: '#24231F',
    border: '#474540',
  },
  ootd: {
    default: bronze[400],
    subtle: '#282419',
    border: '#544E3E',
  },
  status: statusDark,
};

// ─────────────────────────────────────────────────────────────
// Scales
// ─────────────────────────────────────────────────────────────

const space = {
  0: 0,
  px: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

const fontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  display: 30,
  hero: 36,
};

/** Custom faces. */
const font = {
  // Display face, wordmark only. NOTE: Transcity is a DEMO release licensed for
  // personal use — commercial use needs a licence from dharmasstudio.com.
  wordmark: 'Transcity',
  // UI face. React Native resolves weights by family name, not fontWeight, so
  // each weight is its own entry — setting fontWeight on these does nothing.
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
};

const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.65,
};

const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12, // buttons, garment thumbnails
  lg: 16, // cards
  xl: 24, // sheets
  full: 999,
};

const duration = {
  instant: 120,
  fast: 180,
  base: 240,
  slow: 320,
};

const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 100,
  modal: 1000,
  toast: 10000,
};

/** Minimum touch target. Icon-only controls must not go below this. */
const hitSlop = 44;

/**
 * Elevation. iOS reads shadow*, Android reads elevation — both are required.
 * In dark mode shadows don't read; use a `border.default` hairline instead.
 */
const elevation = {
  none: {},
  sm: {
    shadowColor: `rgba(${SHADOW_TINT}, 1)`,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: `rgba(${SHADOW_TINT}, 1)`,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: `rgba(${SHADOW_TINT}, 1)`,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    elevation: 8,
  },
};

export const primitives = { stone, bronze, status };
export const themes = { light, dark };

export const theme = {
  ...light,
  space,
  font,
  fontSize,
  lineHeight,
  radius,
  duration,
  zIndex,
  hitSlop,
  elevation,
};

export default theme;
