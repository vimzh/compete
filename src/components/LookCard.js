import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Bookmark, Heart } from 'lucide-react-native';

import theme from '../../theme';
import { imageUrl } from '../data/mockLooks';

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

/** Feed card: the fit, with like and save actions overlaying the top right. */
export default function LookCard({ look }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <View style={[styles.card, { aspectRatio: look.ratio }]}>
      {/*
        Pieces ingested from a link carry their own cutout in `image`; feed
        looks only have the mock generator's fields. Cutouts are transparent
        PNGs of a single garment, so they need containing rather than cropping.
      */}
      <Image
        source={{ uri: look.image || imageUrl(look) }}
        style={styles.image}
        resizeMode={look.image ? 'contain' : 'cover'}
        accessibilityLabel={look.title}
      />

      <View style={styles.actions}>
        <Action
          Icon={Heart}
          active={liked}
          label={liked ? `Unlike ${look.title}` : `Like ${look.title}`}
          onPress={() => setLiked((v) => !v)}
        />
        <Action
          Icon={Bookmark}
          active={saved}
          label={saved ? `Remove ${look.title} from saved` : `Save ${look.title}`}
          onPress={() => setSaved((v) => !v)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Hairline-free, no shadow — see CLAUDE.md.
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    // Photo wells stay white in both themes so garment colours read true.
    backgroundColor: theme.surface.photo,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Flat scrim chip, not a gradient — keeps the icons legible on any photo.
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
