import { Pressable, StyleSheet, View } from 'react-native';
import { Bookmark, House, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';

/** Feed and Saved, each in its own floating box, with the add action between them. */
function NavButton({ Icon, label, active, onPress }) {
  // No accent color in this palette — active state is contrast, stroke weight
  // and fill, never hue. See docs/palette.md.
  const color = active ? theme.text.primary : theme.text.muted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      // react-native-web doesn't map accessibilityState.selected to the DOM.
      aria-selected={active}
      accessibilityLabel={label}
      style={[styles.box, active && styles.boxActive]}
    >
      <Icon
        size={22}
        color={color}
        strokeWidth={active ? 2.25 : 1.75}
        fill={active ? color : 'transparent'}
        fillOpacity={active ? 0.14 : 0}
      />
    </Pressable>
  );
}

export default function FloatingNav({ active, onChange, onAdd }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.cluster, { bottom: Math.max(insets.bottom, theme.space[3]) + theme.space[3] }]}
      pointerEvents="box-none"
    >
      <NavButton
        Icon={House}
        label="Feed"
        active={active === 'feed'}
        onPress={() => onChange('feed')}
      />

      {/* Primary action. With no accent color, emphasis is a solid ink fill. */}
      <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel="Add a link" style={styles.add}>
        <Plus size={24} color={theme.text.onAccent} strokeWidth={2.25} />
      </Pressable>

      <NavButton
        Icon={Bookmark}
        label="Saved"
        active={active === 'saved'}
        onPress={() => onChange('saved')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space[3],
  },
  // No shadows anywhere — separation comes from the hairline border and the
  // ink fill. See CLAUDE.md.
  box: {
    width: theme.hitSlop + 8,
    height: theme.hitSlop + 8,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface.raised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
  },
  boxActive: {
    borderColor: theme.border.strong,
  },
  add: {
    width: theme.hitSlop + 8,
    height: theme.hitSlop + 8,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accent.default,
  },
});
