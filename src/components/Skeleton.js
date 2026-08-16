import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet } from 'react-native';

import theme from '../../theme';

// Web has no native animated module; asking for it only logs a warning and
// falls back to JS anyway.
const NATIVE_DRIVER = Platform.OS !== 'web';

/**
 * Placeholder block. Opacity pulse rather than a sweeping highlight — a
 * shimmer needs a gradient, and this project doesn't use them (CLAUDE.md).
 */
export default function Skeleton({ style, radius = theme.radius.sm }) {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    let loop;
    let cancelled = false;

    // Respect the OS reduce-motion setting: hold a flat tone instead.
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled || reduced) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: theme.duration.slow,
            useNativeDriver: NATIVE_DRIVER,
          }),
          Animated.timing(pulse, {
            toValue: 0.5,
            duration: theme.duration.slow,
            useNativeDriver: NATIVE_DRIVER,
          }),
        ]),
      );
      loop.start();
    });

    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [pulse]);

  return (
    <Animated.View
      style={[styles.block, { borderRadius: radius, opacity: pulse }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: theme.surface.sunken,
  },
});
