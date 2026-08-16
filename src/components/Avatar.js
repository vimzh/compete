import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';

/**
 * Profile picture. Falls back to the initial when there is no `uri` — and also
 * when the image fails, since Google's picture URLs expire and a broken image
 * well looks like a bug.
 */
export default function Avatar({ name = 'Mohit', uri = null, size = 32 }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, shape]}
        onError={() => setFailed(true)}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    );
  }

  return (
    <View
      style={[styles.avatar, shape]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Text style={[styles.initial, { fontSize: size * 0.44 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Hairline border, no shadow — see CLAUDE.md.
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  initial: {
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
    letterSpacing: 0.5,
  },
});
