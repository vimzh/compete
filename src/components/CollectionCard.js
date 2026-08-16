import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';
import LOOKS, { imageUrl } from '../data/mockLooks';

const TILES = 4;

/**
 * Collection tile: a 2x2 cover collage, name, and count.
 *
 * A collection holds two kinds of thing — pieces ingested from a link
 * (`itemIds`, resolved against the closet) and looks from the feed
 * (`lookIds`). Ingested pieces lead, since they are the ones the user just
 * added and expects to see.
 */
export default function CollectionCard({ collection, items = [], onPress }) {
  const pieces = (collection.itemIds ?? [])
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({ key: item.id, uri: item.image }));

  const looks = (collection.lookIds ?? [])
    .map((id) => LOOKS.find((look) => look.id === id))
    .filter(Boolean)
    .map((look) => ({ key: look.id, uri: imageUrl(look, 200) }));

  const covers = [...pieces, ...looks].slice(0, TILES);

  // Pad with nulls so a half-full collection still reads as a 2x2 grid
  // rather than a lopsided one.
  const tiles = [...covers, ...Array(Math.max(0, TILES - covers.length)).fill(null)];
  const count = (collection.itemIds?.length ?? 0) + (collection.lookIds?.length ?? 0);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${collection.name}, ${count} ${count === 1 ? 'piece' : 'pieces'}`}
      style={styles.card}
    >
      <View style={styles.collage}>
        {tiles.map((cover, index) => (
          <View key={cover ? cover.key : `empty-${index}`} style={styles.tile}>
            {cover && (
              <Image source={{ uri: cover.uri }} style={styles.image} resizeMode="cover" />
            )}
          </View>
        ))}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {collection.name}
      </Text>
      <Text style={styles.count}>
        {count} {count === 1 ? 'piece' : 'pieces'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: theme.space.px,
  },
  collage: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    // Photo wells stay white in both themes so garment colours read true.
    backgroundColor: theme.surface.photo,
    marginBottom: theme.space[2],
  },
  tile: {
    width: '50%',
    height: '50%',
    backgroundColor: theme.surface.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.surface.photo,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  count: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
});
