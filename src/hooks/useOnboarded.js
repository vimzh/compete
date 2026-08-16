import { useCallback, useEffect, useState } from 'react';
// AsyncStorage rather than expo-sqlite/kv-store: the SQLite build imports a
// .wasm asset Metro will not resolve for web without extra config. Same API.
import Storage from '@react-native-async-storage/async-storage';

const KEY = 'fitterest.onboarded.v1';

/**
 * Whether the welcome pages have been seen.
 *
 * Persisted, because in-memory state meant every reload dropped a signed-in
 * user back into onboarding rather than the feed.
 *
 * `null` while reading — callers must wait rather than treating it as false,
 * or onboarding flashes on every launch before the stored value arrives.
 */
export default function useOnboarded() {
  const [onboarded, setOnboarded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Storage.getItem(KEY)
      .then((value) => {
        if (!cancelled) setOnboarded(value === '1');
      })
      .catch(() => {
        if (!cancelled) setOnboarded(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const complete = useCallback(() => {
    setOnboarded(true);
    Storage.setItem(KEY, '1').catch(() => {
      // Worst case they see the welcome pages once more.
    });
  }, []);

  return [onboarded, complete];
}
