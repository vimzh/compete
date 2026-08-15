import { StyleSheet, Text } from 'react-native';

import theme from '../../theme';

/**
 * Wordmark. No icon by design — fashion houses brand with letterforms, not
 * symbols (COS, ARKET, Aesop). Jost is a Futura-lineage geometric; wide
 * tracking at a light weight is what separates an editorial masthead from
 * a startup logo.
 */
export default function Logo({ color = theme.text.primary }) {
  return (
    <Text style={[styles.wordmark, { color }]} accessibilityRole="header">
      COMPETE
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: theme.font.brand,
    fontSize: theme.fontSize.md,
    letterSpacing: 5,
  },
});
