import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Avatar from '../components/Avatar';
import ClosetGrid from '../components/ClosetGrid';
import EditProfileScreen from './EditProfileScreen';
import { useAuth } from '../state/AuthContext';
import { useCloset } from '../state/ClosetContext';

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** Confirms an action. RN's Alert is native-only, so web gets the DOM prompt. */
function confirmSignOut(onConfirm) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.('Sign out of fitterest?')) onConfirm();
    return;
  }

  Alert.alert('Sign out?', 'Your closet stays on your account.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function ProfileScreen({ onClose }) {
  const insets = useSafeAreaInsets();
  const { items, removeItem, outfits } = useCloset();
  const { user, signOut } = useAuth();
  const [editing, setEditing] = useState(false);

  // Looks is real once a fit is posted. Likes and OOTD stay at zero until
  // there is a backend counting votes — honest placeholders rather than
  // invented numbers that would need unwinding later.
  const stats = [
    { key: 'looks', label: 'Looks', value: outfits.length },
    { key: 'likes', label: 'Likes', value: 0 },
    { key: 'ootd', label: 'OOTD', value: 0 },
  ];

  if (editing) return <EditProfileScreen onClose={() => setEditing(false)} />;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + theme.space[3] }]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>

        <Pressable
          onPress={() => confirmSignOut(signOut)}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={styles.iconButton}
        >
          <LogOut size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.identity}>
          <Avatar name={user?.name} uri={user?.avatarUrl} size={76} />
          <View style={styles.names}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.handle}>@{user?.handle}</Text>
          </View>
          {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
        </View>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <Stat key={stat.key} label={stat.label} value={stat.value} />
          ))}
        </View>

        <Pressable
          onPress={() => setEditing(true)}
          accessibilityRole="button"
          style={styles.editButton}
        >
          <Text style={styles.editLabel}>Edit profile</Text>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>My collection</Text>
            {items.length > 0 && (
              <Text style={styles.sectionCount}>
                {items.length} {items.length === 1 ? 'piece' : 'pieces'}
              </Text>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyHeadline}>No pieces yet</Text>
              <Text style={styles.emptyCopy}>
                Share a product link into fitterest, or tap the plus button, and the garment
                lands here with its background cut away.
              </Text>
            </View>
          ) : (
            <ClosetGrid items={items} onRemove={removeItem} />
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[3],
    paddingBottom: theme.space[2],
  },
  iconButton: {
    width: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: theme.space[4],
    paddingBottom: theme.space[16],
  },
  identity: {
    alignItems: 'center',
    gap: theme.space[3],
    paddingTop: theme.space[2],
  },
  names: {
    alignItems: 'center',
    gap: theme.space.px,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  handle: {
    fontSize: theme.fontSize.base,
    color: theme.text.muted,
  },
  bio: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginTop: theme.space[6],
    paddingVertical: theme.space[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: theme.space.px,
  },
  statValue: {
    fontFamily: theme.font.semibold,
    fontSize: theme.fontSize.lg,
    color: theme.text.primary,
    // Keeps columns from jittering once these are real, changing numbers.
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.text.muted,
  },
  // Secondary action: hairline border, no fill. The ink fill is reserved for
  // the primary add action. See docs/palette.md.
  editButton: {
    marginTop: theme.space[4],
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  editLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  section: {
    marginTop: theme.space[8],
    gap: theme.space[3],
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionCount: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  empty: {
    alignItems: 'center',
    gap: theme.space[2],
    paddingVertical: theme.space[12],
    paddingHorizontal: theme.space[4],
  },
  emptyHeadline: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  emptyCopy: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
