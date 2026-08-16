import { Animated, StyleSheet, View } from 'react-native';

import theme from '../../theme';
import Header from './Header';
import useHideOnScroll from '../hooks/useHideOnScroll';

/**
 * Shared screen chrome: the app header plus the screen body.
 *
 * The header floats over the content and retracts while you scroll down,
 * returning on the first upward scroll — so the feed gets the full screen
 * while browsing, and search and profile are one flick away.
 *
 * `children` is a function so the body can wire itself up:
 *   <Screen>{({ onScroll, paddingTop }) => <ScrollView ... />}</Screen>
 */
export default function Screen({ onSearch, onProfile, children }) {
  const { onScroll, onLayout, style, height } = useHideOnScroll();

  const body =
    typeof children === 'function'
      ? children({ onScroll, scrollEventThrottle: 16, paddingTop: height })
      : children;

  return (
    <View style={styles.screen}>
      {body}

      {/* Opaque canvas fill, no shadow — content passes underneath, and the
          separation comes from the surface itself. See CLAUDE.md. */}
      <Animated.View onLayout={onLayout} style={[styles.header, style]}>
        <Header onSearch={onSearch} onProfile={onProfile} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface.canvas,
    zIndex: theme.zIndex.sticky,
  },
});
