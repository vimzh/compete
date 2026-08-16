import { Pressable, StyleSheet, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Avatar from './Avatar';
import Logo from './Logo';
import { useAuth } from '../state/AuthContext';

export default function Header({ onSearch, onProfile }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <View style={[styles.header, { paddingTop: insets.top + theme.space[3] }]}>
      <Logo />
      <View style={styles.actions}>
        <Pressable
          onPress={onSearch}
          accessibilityRole="button"
          // Icon-only: this is the only name a screen reader gets.
          accessibilityLabel="Search"
          style={styles.iconButton}
        >
          <Search size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>

        <Pressable
          onPress={onProfile}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          style={styles.iconButton}
        >
          <Avatar name={user?.name} uri={user?.avatarUrl} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[4],
    paddingBottom: theme.space[3],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[1],
  },
  iconButton: {
    width: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
