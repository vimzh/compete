import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../theme';
import Screen from '../components/Screen';
import MasonryGrid from '../components/MasonryGrid';
import CollectionCard from '../components/CollectionCard';
import NewCollectionSheet from '../components/NewCollectionSheet';
import Skeleton from '../components/Skeleton';
import useMockLoad from '../hooks/useMockLoad';
import LOOKS from '../data/mockLooks';
import { useCloset } from '../state/ClosetContext';

/** Pairs of collections, so the grid stays two-up without a FlatList. */
function inRows(items, perRow = 2) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) rows.push(items.slice(i, i + perRow));
  return rows;
}

function CollectionDetail({ collection, items, onBack }) {
  const insets = useSafeAreaInsets();

  // Ingested pieces first — they are what the user just saved into this
  // collection, and they carry a cutout rather than a feed photo.
  const pieces = (collection.itemIds ?? [])
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      ratio: 1,
    }));

  const looks = [
    ...pieces,
    ...(collection.lookIds ?? []).map((id) => LOOKS.find((look) => look.id === id)).filter(Boolean),
  ];

  return (
    <View style={styles.screen}>
      <View style={[styles.detailHeader, { paddingTop: insets.top + theme.space[3] }]}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to collections"
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color={theme.text.primary} strokeWidth={1.75} />
        </Pressable>
        <Text style={styles.detailTitle} numberOfLines={1}>
          {collection.name}
        </Text>
        {/* Balances the back button so the title stays optically centred. */}
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {looks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyHeadline}>Empty collection</Text>
            <Text style={styles.emptyCopy}>Save a look into it and it will show up here.</Text>
          </View>
        ) : (
          <MasonryGrid looks={looks} />
        )}
      </ScrollView>
    </View>
  );
}

export default function SavedScreen({ onSearch, onProfile }) {
  const mockLoading = useMockLoad();
  const { collections, items, hydrated, createCollection } = useCloset();
  const [open, setOpen] = useState(null);
  const [creating, setCreating] = useState(false);

  // Reading the stored closet is fast, but showing "No collections yet" before
  // it lands would tell the user their saves are gone.
  const loading = mockLoading || !hydrated;

  // Derived rather than stored, so a collection removed elsewhere falls back to
  // the list instead of rendering a detail view of nothing.
  const openCollection = open ? collections.find((c) => c.id === open) : null;
  if (openCollection) {
    return (
      <CollectionDetail collection={openCollection} items={items} onBack={() => setOpen(null)} />
    );
  }

  return (
    <Screen onSearch={onSearch} onProfile={onProfile}>
      {({ onScroll, scrollEventThrottle, paddingTop }) => (
        <>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingTop }]}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
          >
            <View style={styles.heading}>
              <Text style={styles.title}>Collections</Text>
              <Pressable
                onPress={() => setCreating(true)}
                accessibilityRole="button"
                accessibilityLabel="New collection"
                hitSlop={theme.space[2]}
                style={styles.new}
              >
                <Plus size={16} color={theme.text.primary} strokeWidth={2} />
                <Text style={styles.newLabel}>New</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.rows}>
                {[0, 1].map((row) => (
                  <View key={row} style={styles.row}>
                    {[0, 1].map((col) => (
                      <View key={col} style={styles.slot}>
                        <Skeleton radius={theme.radius.lg} style={styles.skeletonCollage} />
                        <Skeleton style={styles.skeletonName} />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : collections.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyHeadline}>No collections yet</Text>
                <Text style={styles.emptyCopy}>
                  Group saved looks by mood, season, or whatever else makes sense to you.
                </Text>
              </View>
            ) : (
              <View style={styles.rows}>
                {inRows(collections).map((row, index) => (
                  <View key={index} style={styles.row}>
                    {row.map((collection) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        items={items}
                        onPress={() => setOpen(collection.id)}
                      />
                    ))}
                    {/* Keeps a lone card at half width instead of stretching it. */}
                    {row.length === 1 && <View style={styles.slot} />}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <NewCollectionSheet
            visible={creating}
            onClose={() => setCreating(false)}
            onCreate={createCollection}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.surface.canvas,
  },
  content: {
    paddingHorizontal: theme.space[3],
    // Clears the floating nav cluster, which sits over the content.
    paddingBottom: theme.space[16] + theme.space[10],
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[1],
    paddingBottom: theme.space[4],
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  new: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[1],
  },
  newLabel: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  rows: {
    gap: theme.space[5],
  },
  row: {
    flexDirection: 'row',
    gap: theme.space[3],
  },
  slot: {
    flex: 1,
    gap: theme.space[2],
  },
  skeletonCollage: {
    width: '100%',
    aspectRatio: 1,
  },
  skeletonName: {
    width: '60%',
    height: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space[3],
    paddingBottom: theme.space[3],
  },
  iconButton: {
    width: theme.hitSlop,
    height: theme.hitSlop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    fontFamily: theme.font.semibold,
    color: theme.text.primary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.space[16],
    paddingHorizontal: theme.space[8],
    gap: theme.space[2],
  },
  emptyHeadline: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.font.medium,
    color: theme.text.primary,
  },
  emptyCopy: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.font.regular,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
