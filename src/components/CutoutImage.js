import { Image, StyleSheet, View } from 'react-native';

import theme from '../../theme';

/**
 * A garment cutout with a grey outline hugging its silhouette.
 *
 * The outline is drawn here rather than asked for in the cutout prompt: the
 * model produced a different edge every time and burned it into the pixels.
 * This is one consistent colour and can be retuned without re-ingesting.
 *
 * Technique: the same transparent PNG is stamped eight times behind the real
 * one, offset in a ring and tinted flat grey. `tintColor` paints the alpha
 * shape a solid colour, so the copies read as a single outline rather than
 * eight ghosts. Flat fill, no blur — this is an edge, not a shadow (CLAUDE.md).
 */
const RING = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

export default function CutoutImage({
  source,
  style,
  width = 2,
  color = theme.border.strong,
  accessibilityLabel,
}) {
  return (
    <View style={[styles.frame, style]}>
      {RING.map(([dx, dy]) => (
        <Image
          key={`${dx},${dy}`}
          source={source}
          style={[
            StyleSheet.absoluteFill,
            styles.fill,
            { transform: [{ translateX: dx * width }, { translateY: dy * width }] },
          ]}
          tintColor={color}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      ))}

      <Image
        source={source}
        style={[StyleSheet.absoluteFill, styles.fill]}
        resizeMode="contain"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    overflow: 'hidden',
  },
  // Bundled assets carry their intrinsic size, which overrides absoluteFill's
  // insets and blows the image out to full resolution. Data URLs have no
  // intrinsic size, so this only bites on seeded pieces.
  fill: {
    width: '100%',
    height: '100%',
  },
});
