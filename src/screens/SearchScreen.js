import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';

export default function SearchScreen({ onClose }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + theme.space[3] }]}>
        <View style={styles.field}>
          <Search size={18} color={theme.text.muted} strokeWidth={1.75} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search looks, pieces, people"
            placeholderTextColor={theme.text.muted}
            style={styles.input}
            autoFocus
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search"
          />
          {trimmed.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={theme.space[2]}
            >
              <X size={18} color={theme.text.muted} strokeWidth={1.75} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close search"
          hitSlop={theme.space[2]}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {trimmed.length === 0 ? (
          <>
            <Text style={styles.headline}>Search fitterest</Text>
            <Text style={styles.copy}>
              Find looks by piece, brand, or the person who put them together.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.headline}>No results</Text>
            <Text style={styles.copy}>Nothing matches “{trimmed}” yet.</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[3],
    // Matches the main header's gutter so the field is evenly inset on both
    // sides — a leading back button pushed it visibly off-centre.
    paddingHorizontal: theme.space[4],
    paddingBottom: theme.space[3],
  },
  cancel: {
    fontSize: theme.fontSize.base,
    color: theme.text.secondary,
  },
  // Hairline border, no shadow — see CLAUDE.md.
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[2],
    height: theme.hitSlop,
    paddingHorizontal: theme.space[3],
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.raised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    color: theme.text.primary,
    // RNW draws a focus ring on the input itself; the field already shows focus.
    outlineStyle: 'none',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space[8],
    gap: theme.space[2],
  },
  headline: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  copy: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
