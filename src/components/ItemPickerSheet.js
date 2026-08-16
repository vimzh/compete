import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import itemImage from '../data/itemImage';
import CutoutImage from './CutoutImage';
import { useCloset } from '../state/ClosetContext';

/**
 * Picks a piece for one canvas slot. Pieces whose category matches the slot
 * float to the top, but nothing is hidden — category comes from the ingestion
 * step and is often null, so filtering outright would strand real items.
 */
export default function ItemPickerSheet({ slot, visible, onClose, onPick, onAddLink }) {
  const insets = useSafeAreaInsets();
  const { items } = useCloset();

  const sorted = slot
    ? [...items].sort((a, b) => {
        const matches = (item) => (item.category === slot.category ? 0 : 1);
        return matches(a) - matches(b);
      })
    : items;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Dismiss" />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, theme.space[4]) }]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Choose a {slot?.label.toLowerCase() ?? 'piece'}</Text>

          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyHeadline}>Your closet is empty</Text>
              <Text style={styles.emptyCopy}>
                Paste a product link and we cut the garment out for you.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
            >
              {sorted.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => onPick(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  style={styles.option}
                >
                  <View style={styles.well}>
                    <CutoutImage source={itemImage(item)} style={styles.image} width={1.5} />
                  </View>
                  <Text style={styles.optionLabel} numberOfLines={1}>
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Pressable onPress={onAddLink} accessibilityRole="button" style={styles.addLink}>
            <Plus size={16} color={theme.text.primary} strokeWidth={2} />
            <Text style={styles.addLinkLabel}>Add from a link</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 29, 27, 0.35)',
  },
  sheet: {
    backgroundColor: theme.surface.overlay,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.space[5],
    paddingTop: theme.space[3],
    gap: theme.space[3],
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.border.strong,
    marginBottom: theme.space[2],
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  strip: {
    gap: theme.space[3],
    paddingVertical: theme.space[1],
  },
  option: {
    width: 104,
    gap: theme.space[1],
  },
  // Cutouts are transparent PNGs, so they need a white well to read against.
  well: {
    width: 104,
    height: 104,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.photo,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
    padding: theme.space[2],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionLabel: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.font.regular,
    color: theme.text.secondary,
  },
  empty: {
    alignItems: 'center',
    gap: theme.space[1],
    paddingVertical: theme.space[6],
  },
  emptyHeadline: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  emptyCopy: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space[2],
    height: theme.hitSlop,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.strong,
  },
  addLinkLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
});
