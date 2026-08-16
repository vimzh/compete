import { Platform } from 'react-native';

/**
 * On a physical device localhost is the phone, not your Mac — set
 * EXPO_PUBLIC_API_URL to your machine's LAN address (e.g. http://192.168.0.100:8787)
 * in the project's .env before running on hardware.
 */
const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:8787', // Android emulator's alias for the host
  default: 'http://localhost:8787',
});

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

/**
 * One fetch wrapper for the whole API: JSON in, JSON out, server-authored
 * error messages surfaced as thrown Errors so screens can render them
 * verbatim instead of inventing their own copy.
 */
export async function request(path, { method = 'GET', body, token, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'content-type': 'application/json' } : null),
        ...(token ? { authorization: `Bearer ${token}` } : null),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new Error(`Can't reach the fitterest server at ${API_URL}.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong.');
    error.status = response.status;
    throw error;
  }
  return data;
}
