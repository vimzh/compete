import Svg, { Circle, Path, Rect } from 'react-native-svg';

import theme from '../../theme';

/**
 * Grey garment outlines for empty canvas slots.
 *
 * Line art rather than an icon: an empty board should already read as an
 * outfit, so the shape tells you what belongs in each slot before anything is
 * dropped in. Stroked only, never filled — the palette carries no accent, and
 * a filled shape would compete with the real cutouts beside it.
 */
const PATHS = {
  top: (
    <Path d="M22 16 L38 10 Q50 18 62 10 L78 16 L86 30 L72 38 L72 82 Q50 86 28 82 L28 38 L14 30 Z" />
  ),
  outerwear: (
    <>
      <Path d="M24 14 L40 8 L50 20 L60 8 L76 14 L86 32 L74 40 L74 86 Q50 90 26 86 L26 40 L14 32 Z" />
      <Path d="M50 20 L50 88" />
    </>
  ),
  dress: (
    <Path d="M26 14 L40 8 Q50 16 60 8 L74 14 L80 30 L68 34 L82 88 Q50 94 18 88 L32 34 L20 30 Z" />
  ),
  bottom: (
    <>
      <Path d="M28 10 L72 10 L76 34 L70 90 L54 90 L50 46 L46 90 L30 90 L24 34 Z" />
      <Path d="M26 22 L74 22" />
    </>
  ),
  shoes: (
    <>
      <Path d="M12 62 Q16 40 30 40 Q38 40 44 50 L62 62 Q78 66 84 74 L84 82 L14 82 Z" />
      <Path d="M14 74 L84 74" />
    </>
  ),
  cap: (
    <>
      <Path d="M20 58 Q20 22 50 22 Q80 22 80 58 Z" />
      <Path d="M80 58 Q94 58 94 68 L20 68" />
    </>
  ),
  bag: (
    <>
      <Path d="M22 34 L78 34 L84 88 L16 88 Z" />
      <Path d="M36 34 Q36 12 50 12 Q64 12 64 34" />
    </>
  ),
  headphones: (
    <>
      <Path d="M20 62 L20 50 Q20 18 50 18 Q80 18 80 50 L80 62" />
      <Rect x="10" y="58" width="18" height="30" rx="8" />
      <Rect x="72" y="58" width="18" height="30" rx="8" />
    </>
  ),
  watch: (
    <>
      <Circle cx="50" cy="50" r="22" />
      <Path d="M38 30 L36 8 L64 8 L62 30" />
      <Path d="M38 70 L36 92 L64 92 L62 70" />
    </>
  ),
};

export default function GarmentSilhouette({ slot, size = 96, color = theme.border.strong }) {
  const shape = PATHS[slot] || PATHS.top;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {shape}
    </Svg>
  );
}
