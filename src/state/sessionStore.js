import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Where the session token lives between launches.
 *
 * SecureStore is keychain/keystore-backed but native-only, so the web build
 * falls back to localStorage. That fallback is not equivalent security — it is
 * there so `expo start --web` keeps working, not because it is safe for a real
 * web deployment.
 */

const KEY = 'fitterest.session';

const web = Platform.OS === 'web';

export async function readSession() {
  try {
    const raw = web ? globalThis.localStorage?.getItem(KEY) : await SecureStore.getItemAsync(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // A corrupt or unreadable entry should look like "signed out", never crash
    // the launch path.
    return null;
  }
}

export async function writeSession(session) {
  const raw = JSON.stringify(session);
  if (web) globalThis.localStorage?.setItem(KEY, raw);
  else await SecureStore.setItemAsync(KEY, raw);
}

export async function clearSession() {
  if (web) globalThis.localStorage?.removeItem(KEY);
  else await SecureStore.deleteItemAsync(KEY);
}
