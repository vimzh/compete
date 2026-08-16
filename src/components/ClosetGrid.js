import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import theme from '../../theme';
import itemImage from '../data/itemImage';
import CutoutImage from './CutoutImage';

/** Ingested pieces. Cutouts are transparent PNGs, so each sits in a white well. */
export default function ClosetGrid({ items, onRemove }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={styles.cell}>
          <View style={styles.well}>
            <CutoutImage
              source={itemImage(item)}
              style={styles.image}
              accessibilityLabel={item.title}
            />
            {onRemove && (
              <Pressable
                onPress={() => onRemove(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.title}`}
                hitSlop={theme.space[2]}
                style={styles.remove}
              >
                <X size={13} color={theme.text.primary} strokeWidth={2} />
              </Pressable>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.brand || item.price ? (
            <Text style={styles.meta} numberOfLines={1}>
              {[item.brand, item.price].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
      ))}
      {/* Keeps a lone item at half width rather than stretching it. */}
      {items.length % 2 === 1 && <View style={styles.cell} />}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space[3],
  },
  cell: {
    // Two up, accounting for the row gap.
    width: '47%',
    flexGrow: 1,
    gap: theme.space.px,
  },
  well: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.surface.photo,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
    padding: theme.space[3],
    marginBottom: theme.space[2],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  remove: {
    position: 'absolute',
    top: theme.space[2],
    right: theme.space[2],
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  meta: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
});
