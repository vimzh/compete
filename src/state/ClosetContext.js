import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Storage from '@react-native-async-storage/async-storage';

import SEED_ITEMS from '../data/seedCloset';

const ClosetContext = createContext(null);

const STORAGE_KEY = 'fitterest.closet.v1';

/**
 * Everything the user owns: pieces ingested from links, outfits built from them
 * on the canvas, and the collections those get grouped into.
 *
 * Persisted to AsyncStorage so a piece added from a share sheet is still there
 * after a restart — the whole point of saving one. Moves onto the account
 * record once the server stores closets rather than just sessions.
 *
 * AsyncStorage rather than `expo-sqlite/kv-store`: the SQLite build pulls a
 * `.wasm` asset Metro will not resolve for web without extra config, and this
 * project still builds for web.
 */
export function ClosetProvider({ children }) {
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [collections, setCollections] = useState([]);

  // Gates the save effect: without it the empty initial state overwrites the
  // stored closet on the first render, before the read has come back.
  const [hydrated, setHydrated] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const raw = await Storage.getItem(STORAGE_KEY);
        if (!mounted.current) return;

        if (raw) {
          const saved = JSON.parse(raw);
          setItems(saved.items ?? []);
          setOutfits(saved.outfits ?? []);
          setCollections(saved.collections ?? []);
        } else {
          // First launch: hand over a starter closet so the canvas is usable
          // before anyone has pasted a link. Only ever on a genuinely empty
          // store, so deleting a seeded piece keeps it deleted.
          setItems(SEED_ITEMS);
        }
      } catch {
        // A corrupt or unreadable blob should cost the user their history, not
        // the app — start empty and let the next write replace it.
      } finally {
        if (mounted.current) setHydrated(true);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    Storage.setItem(STORAGE_KEY, JSON.stringify({ items, outfits, collections })).catch(() => {
      // Losing one write is recoverable; the next change rewrites the lot.
    });
  }, [hydrated, items, outfits, collections]);

  const addItem = useCallback((item) => {
    setItems((current) => [item, ...current]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    // Otherwise the collection keeps counting a piece that no longer exists.
    setCollections((current) =>
      current.map((collection) => ({
        ...collection,
        itemIds: (collection.itemIds ?? []).filter((itemId) => itemId !== id),
      })),
    );
  }, []);

  /** `slots` is [{ key, label, item }] — only filled slots are kept. */
  const addOutfit = useCallback(({ name, slots }) => {
    const filled = slots.filter((slot) => slot.item);
    const outfit = {
      id: `outfit-${Date.now()}`,
      type: 'outfit',
      title: name,
      slots: filled,
      likes: 0,
      ratio: 0.8,
    };
    setOutfits((current) => [outfit, ...current]);
    return outfit;
  }, []);

  const createCollection = useCallback((name, { itemIds = [] } = {}) => {
    const collection = { id: `c${Date.now()}`, name, lookIds: [], itemIds };
    setCollections((current) => [collection, ...current]);
    return collection;
  }, []);

  /** Adding a piece twice is a no-op rather than a duplicate tile. */
  const addItemToCollection = useCallback((collectionId, itemId) => {
    setCollections((current) =>
      current.map((collection) => {
        if (collection.id !== collectionId) return collection;
        const itemIds = collection.itemIds ?? [];
        return itemIds.includes(itemId)
          ? collection
          : { ...collection, itemIds: [itemId, ...itemIds] };
      }),
    );
  }, []);

  const removeItemFromCollection = useCallback((collectionId, itemId) => {
    setCollections((current) =>
      current.map((collection) =>
        collection.id === collectionId
          ? { ...collection, itemIds: (collection.itemIds ?? []).filter((id) => id !== itemId) }
          : collection,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      outfits,
      collections,
      hydrated,
      addItem,
      removeItem,
      addOutfit,
      createCollection,
      addItemToCollection,
      removeItemFromCollection,
    }),
    [
      items,
      outfits,
      collections,
      hydrated,
      addItem,
      removeItem,
      addOutfit,
      createCollection,
      addItemToCollection,
      removeItemFromCollection,
    ],
  );

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const context = useContext(ClosetContext);
  if (!context) throw new Error('useCloset must be used inside a ClosetProvider.');
  return context;
}
