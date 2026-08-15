import { StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';

/** Initial-based avatar. Placeholder until there are real accounts. */
export default function Avatar({ name = 'Mohit', size = 32 }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
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
    fontFamily: theme.font.brand,
    color: theme.text.primary,
    letterSpacing: 0.5,
  },
});
