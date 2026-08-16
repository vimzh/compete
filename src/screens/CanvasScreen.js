import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import itemImage from '../data/itemImage';
import CutoutImage from '../components/CutoutImage';
import GarmentSilhouette from '../components/GarmentSilhouette';
import ItemPickerSheet from '../components/ItemPickerSheet';
import { regionFor } from '../data/slots';
import { useCloset } from '../state/ClosetContext';

/**
 * One piece on the board.
 *
 * Empty slots show a grey garment outline rather than a generic box, so the
 * board reads as an outfit before anything is in it. There is no card, border
 * or fill behind a filled slot — the cutouts sit directly on the canvas, which
 * is what makes it look like a flat-lay instead of a grid of tiles.
 */
function Slot({ slot, onPress, onClear }) {
  const region = regionFor(slot.key);
  const filled = Boolean(slot.item);

  return (
    <View
      style={[
        styles.slot,
        {
          left: `${region.left}%`,
          top: `${region.top}%`,
          width: `${region.width}%`,
          height: `${region.height}%`,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={filled ? `Replace ${slot.label}` : `Add ${slot.label}`}
        style={styles.target}
      >
        {filled ? (
          <CutoutImage
            source={itemImage(slot.item)}
            style={styles.image}
            width={1.5}
            accessibilityLabel={slot.item.title}
          />
        ) : (
          <View style={styles.empty}>
            <GarmentSilhouette slot={slot.key} size={72} />
            <View style={styles.plus}>
              <Plus size={14} color={theme.text.muted} strokeWidth={2} />
              <Text style={styles.emptyLabel}>{slot.label}</Text>
            </View>
          </View>
        )}
      </Pressable>

      {filled && (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${slot.label}`}
          hitSlop={theme.space[2]}
          style={styles.clear}
        >
          <X size={12} color={theme.text.primary} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

export default function CanvasScreen({ board, onClose, onPosted, onAddLink }) {
  const insets = useSafeAreaInsets();
  const { addOutfit } = useCloset();

  const [slots, setSlots] = useState(board.slots.map((slot) => ({ ...slot, item: null })));
  const [picking, setPicking] = useState(null);

  const filledCount = slots.filter((slot) => slot.item).length;

  const setItem = (key, item) =>
    setSlots((current) => current.map((s) => (s.key === key ? { ...s, item } : s)));

  const post = () => {
    if (filledCount === 0) return;
    onPosted(addOutfit({ name: board.name, slots }));
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + theme.space[3] }]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close canvas"
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>

        <Text style={styles.boardName} numberOfLines={1}>
          {board.name}
        </Text>

        <Pressable
          onPress={post}
          accessibilityRole="button"
          accessibilityLabel="Post this fit"
          accessibilityState={{ disabled: filledCount === 0 }}
          style={[styles.post, filledCount === 0 && styles.postDisabled]}
        >
          <Text style={[styles.postLabel, filledCount === 0 && styles.postLabelDisabled]}>
            Post
          </Text>
        </Pressable>
      </View>

      {/* The board fills the screen — this is the artefact being made, not a
          form that happens to contain images. */}
      <View style={[styles.board, { marginBottom: Math.max(insets.bottom, theme.space[4]) }]}>
        {slots.map((slot) => (
          <Slot
            key={slot.key}
            slot={slot}
            onPress={() => setPicking(slot)}
            onClear={() => setItem(slot.key, null)}
          />
        ))}
      </View>

      <ItemPickerSheet
        slot={picking}
        visible={Boolean(picking)}
        onClose={() => setPicking(null)}
        onPick={(item) => {
          setItem(picking.key, item);
          setPicking(null);
        }}
        onAddLink={() => {
          setPicking(null);
          onAddLink();
        }}
      />
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
    paddingHorizontal: theme.space[3],
    paddingBottom: theme.space[2],
  },
  iconButton: {
    width: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardName: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  post: {
    height: 36,
    paddingHorizontal: theme.space[4],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.accent.default,
  },
  postDisabled: {
    backgroundColor: theme.surface.sunken,
  },
  postLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.onAccent,
  },
  postLabelDisabled: {
    color: theme.text.muted,
  },
  board: {
    flex: 1,
    marginHorizontal: theme.space[3],
    position: 'relative',
  },
  slot: {
    position: 'absolute',
  },
  target: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space[1],
  },
  plus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[1],
  },
  emptyLabel: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.font.regular,
    color: theme.text.muted,
  },
  clear: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});
