/**
 * Design tokens for Compete.
 *
 * Three layers: primitives (values) -> semantics (roles) -> component tokens.
 * Components should only ever read from the semantic layer.
 *
 * The palette is near-monochrome by design: warm cream and ink, no brand accent
 * color. State is carried by fill and weight, never hue. See docs/palette.md.
 */

// ─────────────────────────────────────────────────────────────
// Layer 1 — Primitives. Named for values. Do not use directly.
// ─────────────────────────────────────────────────────────────

const sand = {
  50: '#FDFCF9',
  100: '#FAF7F1',
  200: '#F3EFE7',
  300: '#E8E3D9',
  400: '#D6CFC2',
  500: '#B5AD9F',
  600: '#8C8477',
  700: '#5E574C',
  800: '#423C33',
  900: '#211E18',
  950: '#15130F',
};

// Reserved for Outfit of the Day. The only decorative chroma in the app —
// if it appears anywhere else it stops meaning "won".
const bronze = {
  100: '#EFE7D6',
  400: '#B99F6E',
  500: '#967C4E',
};

// Desaturated to sit inside the neutral world. In a palette this quiet, a
// status color carries real weight because it's the only thing with hue.
const status = {
  olive: '#5F6E56', // success
  ochre: '#9A7B3F', // warning
  brick: '#8F4A42', // error
  slate: '#55656B', // info
};

const statusDark = {
  olive: '#7E8F73',
  ochre: '#BE9C57',
  brick: '#B0655C',
  slate: '#72858C',
};

// Shadows are tinted with the ink, never pure black — on a cream ground a
// black shadow reads as grime rather than depth.
const SHADOW_TINT = '33, 30, 24';

// ─────────────────────────────────────────────────────────────
// Layer 2 — Semantics. Named for roles. This is the public API.
// ─────────────────────────────────────────────────────────────

const light = {
  surface: {
    canvas: sand[100],
    raised: '#FFFFFF',
    overlay: '#FFFFFF',
    sunken: sand[200],
    inverse: sand[900],
    // Garment and try-on imagery always sits on white so colors read true,
    // in both themes. Do not theme this.
    photo: '#FFFFFF',
  },
  text: {
    primary: sand[900],
    secondary: sand[700],
    muted: sand[600], // ~3.5:1 — >=18px or non-essential metadata only
    onAccent: sand[50],
  },
  border: {
    subtle: '#EFEAE0',
    default: '#E4DED2',
    strong: '#CFC7B8',
  },
  // The accent is ink, not a color. Primary action = ink button on cream.
  accent: {
    default: sand[900],
    hover: sand[800],
    subtle: sand[200],
    border: sand[400],
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
    canvas: sand[950], // warm-tinted near-black, never #000
    raised: '#1E1B16',
    overlay: '#27231C',
    sunken: '#0E0C09',
    inverse: sand[100],
    photo: '#FFFFFF',
  },
  text: {
    primary: sand[200],
    secondary: '#B7AF9F',
    muted: '#877F70',
    onAccent: sand[950],
  },
  border: {
    subtle: '#2B261E',
    default: '#373127',
    strong: '#4B4438',
  },
  // Inverts: cream button on ink.
  accent: {
    default: sand[200],
    hover: '#FFFFFF',
    subtle: '#27231C',
    border: '#4B4438',
  },
  ootd: {
    default: bronze[400],
    subtle: '#2C2517',
    border: '#5A4C2C',
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

// With no accent color, type weight carries more hierarchy than usual.
const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
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

export const primitives = { sand, bronze, status };
export const themes = { light, dark };

export const theme = {
  ...light,
  space,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  duration,
  zIndex,
  elevation,
};

export default theme;
