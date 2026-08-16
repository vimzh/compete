import { useCallback, useRef, useState } from 'react';
import { Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';

// Ignore the small jitters a finger makes while holding still — the header
// should only move when the scroll reads as intent.
const THRESHOLD = 6;

/**
 * Hides a top bar while scrolling down and brings it back on the first scroll
 * up, the way Instagram and Pinterest behave.
 *
 * Returns the animated style for the bar, an `onScroll` handler for the list,
 * the measured bar height (use it as the list's top padding), and the
 * `onLayout` that measures it.
 */
export default function useHideOnScroll() {
  const insets = useSafeAreaInsets();
  // Seeded with the bar's known composition — inset, a 44pt control row, and
  // its padding — so the list starts at the right offset on the first frame
  // instead of reflowing once onLayout reports. Measurement then takes over.
  const [height, setHeight] = useState(insets.top + theme.hitSlop + theme.space[3] * 2);

  const progress = useRef(new Animated.Value(0)).current; // 0 shown, 1 hidden
  const hidden = useRef(false);
  const lastY = useRef(0);

  const onLayout = useCallback((event) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);

  const toggle = useCallback(
    (next) => {
      if (hidden.current === next) return;
      hidden.current = next;
      Animated.timing(progress, {
        toValue: next ? 1 : 0,
        duration: theme.duration.fast,
        // The web build has no native animated module; asking for one there
        // only produces a warning.
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    },
    [progress],
  );

  const onScroll = useCallback(
    (event) => {
      const y = event.nativeEvent.contentOffset.y;
      const delta = y - lastY.current;
      lastY.current = y;

      // Never leave the bar hidden at the top of the list, and don't hide it
      // over the first screenful — there is nothing gained yet.
      if (y <= height) {
        toggle(false);
        return;
      }

      if (Math.abs(delta) < THRESHOLD) return;
      toggle(delta > 0);
    },
    [height, toggle],
  );

  const style = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          // Measured height, so it clears the notch as well as the bar itself.
          outputRange: [0, -height],
        }),
      },
    ],
    // Fades out over the first half of the travel so it doesn't read as the
    // bar sliding *behind* the status bar.
    opacity: progress.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' }),
  };

  return { onScroll, onLayout, style, height };
}
