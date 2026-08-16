import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Bookmark, Heart } from 'lucide-react-native';

import theme from '../../theme';
import itemImage from '../data/itemImage';
import CutoutImage from './CutoutImage';

const MAX_TILES = 4;

function Action({ Icon, active, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={theme.space[2]}
      style={styles.action}
    >
      {/* No accent colour — the active state is a fill, not a hue. */}
      <Icon
        size={15}
        color={theme.text.primary}
        fill={active ? theme.text.primary : 'transparent'}
        strokeWidth={active ? 2 : 1.75}
      />
    </Pressable>
  );
}

/**
 * A fit built on the canvas. Renders the cutouts as a flat-lay rather than a
 * photo, so posted outfits read differently from ingested inspiration.
 */
export default function OutfitCard({ outfit }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const tiles = outfit.slots.slice(0, MAX_TILES);
  const single = tiles.length === 1;

  return (
    <View style={[styles.card, { aspectRatio: outfit.ratio }]}>
      <View style={styles.layout}>
        {tiles.map((slot) => (
          <View key={slot.key} style={[styles.tile, single && styles.tileSingle]}>
            <CutoutImage
              source={itemImage(slot.item)}
              style={styles.image}
              width={1.5}
              accessibilityLabel={slot.item.title}
            />
          </View>
        ))}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {outfit.title}
      </Text>

      <View style={styles.actions}>
        <Action
          Icon={Heart}
          active={liked}
          label={liked ? `Unlike ${outfit.title}` : `Like ${outfit.title}`}
          onPress={() => setLiked((v) => !v)}
        />
        <Action
          Icon={Bookmark}
          active={saved}
          label={saved ? `Remove ${outfit.title} from saved` : `Save ${outfit.title}`}
          onPress={() => setSaved((v) => !v)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    // Cutouts are transparent, so the flat-lay sits on the white photo well.
    backgroundColor: theme.surface.photo,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.default,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.space[2],
  },
  tile: {
    width: '50%',
    height: '50%',
    padding: theme.space[1],
  },
  tileSingle: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    position: 'absolute',
    left: theme.space[3],
    bottom: theme.space[3],
    right: theme.space[3],
    fontSize: theme.fontSize.sm,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  // Flat scrim chip, not a gradient — see CLAUDE.md.
  actions: {
    position: 'absolute',
    top: theme.space[2],
    right: theme.space[2],
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  action: {
    width: 30,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
