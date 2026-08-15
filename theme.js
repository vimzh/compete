/**
 * Design tokens for Compete.
 *
 * Three layers: primitives (values) -> semantics (roles) -> component tokens.
 * Components should only ever read from `semantic` / the `useTheme`-style helpers.
 * See docs/palette.md for the reasoning.
 */

// ─────────────────────────────────────────────────────────────
// Layer 1 — Primitives. Named for values. Do not use directly.
// ─────────────────────────────────────────────────────────────

const sand = {
  50: '#FDFBF7',
  100: '#FAF6EF',
  200: '#F2ECE1',
  300: '#E7DFD1',
  400: '#D3C8B6',
  500: '#B0A492',
  600: '#8A8073',
  700: '#5C5348',
  800: '#403A31',
  900: '#1F1B15',
  950: '#14120E',
};

const clay = {
  50: '#FBF0EB',
  100: '#F5DDD2',
  300: '#E0A288',
  400: '#D98B6A',
  500: '#C4653F',
  600: '#A8512F',
  700: '#853E23',
};

const gold = {
  100: '#F7EAD1',
  400: '#D9AE62',
  500: '#C08F3C',
};

const status = {
  sage: '#5E7A52',
  amber: '#B8892F',
  rust: '#A93B32',
  slate: '#4A6C7A',
};

// Shadows are tinted with the ink, never pure black — on a cream ground a black
// shadow reads as grime rather than depth.
const SHADOW_TINT = '31, 27, 21';

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
    muted: sand[600], // ~3.6:1 — >=18px or non-essential metadata only
    onAccent: '#FFFFFF',
    accent: clay[700], // accent is a fill color; this is its text counterpart
  },
  border: {
    subtle: '#EDE6DA',
    default: '#E0D8C9',
    strong: '#C9BFAC',
  },
  accent: {
    default: clay[500],
    hover: clay[600],
    subtle: clay[50],
    border: clay[300],
  },
  ootd: {
    default: gold[500],
    subtle: gold[100],
    border: gold[400],
  },
  status,
};

const dark = {
  surface: {
    canvas: sand[950], // warm-tinted near-black, never #000
    raised: '#1D1A15',
    overlay: '#262219',
    sunken: '#0E0C09',
    inverse: sand[100],
    photo: '#FFFFFF',
  },
  text: {
    primary: sand[200],
    secondary: '#B5AC9C',
    muted: '#857C6D',
    onAccent: sand[950],
    accent: clay[300],
  },
  border: {
    subtle: '#2A251D',
    default: '#363028',
    strong: '#4A4237',
  },
  accent: {
    default: clay[400], // chroma reduced — full terracotta vibrates on near-black
    hover: clay[300],
    subtle: '#2E2019',
    border: '#5C3A29',
  },
  ootd: {
    default: gold[400],
    subtle: '#2E2415',
    border: '#5C4A28',
  },
  status,
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

export const primitives = { sand, clay, gold, status };
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
