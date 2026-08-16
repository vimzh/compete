import { StyleSheet, Text } from 'react-native';

import theme from '../../theme';

/**
 * Wordmark. No icon by design — fashion houses brand with letterforms, not
 * symbols (COS, ARKET, Aesop).
 */
export default function Logo({ color = theme.text.primary, size = theme.fontSize.xl }) {
  return (
    <Text
      style={[styles.wordmark, { color, fontSize: size }]}
      accessibilityRole="header"
    >
      fitterest
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: theme.font.wordmark,
    letterSpacing: 0.5,
  },
});
