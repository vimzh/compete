import { Platform } from 'react-native';

/**
 * The Google sign-in seam.
 *
 * Everything above this file — AuthContext, the sign-in screen, the server —
 * only ever deals in "an ID token from Google". This is the one place that
 * knows how that token is obtained.
 *
 * On web we render Google's own button (see components/GoogleButton) and let
 * the user click it. A synthetic click cannot be used: loading the GIS script
 * is async, so by the time we could click, the user-activation window has
 * closed and Chrome blocks the popup with no callback — an infinite spinner.
 */

export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

/** True when no client id is configured, so the dev stand-in is still in play. */
export const usingDevSignIn = !WEB_CLIENT_ID;

/** Thrown when the user backs out of the Google sheet — not an error state. */
export class GoogleSignInCancelled extends Error {
  constructor() {
    super('Sign-in cancelled.');
    this.cancelled = true;
  }
}

/* -------------------------------------------------------------------------- */
/* Web — Google Identity Services                                              */
/* -------------------------------------------------------------------------- */

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise;

/** Loads GIS once. Safe to call on mount so the script is warm before a click. */
export function loadGis() {
  if (Platform.OS !== 'web') return Promise.reject(new Error('Web only.'));
  if (gisPromise) return gisPromise;

  gisPromise = new Promise((resolve, reject) => {
    if (globalThis.google?.accounts?.id) {
      resolve(globalThis.google.accounts.id);
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      globalThis.google?.accounts?.id
        ? resolve(globalThis.google.accounts.id)
        : reject(new Error('Google sign-in failed to initialise.'));
    script.onerror = () => reject(new Error('Could not reach Google sign-in.'));
    document.head.appendChild(script);
  });

  return gisPromise;
}

/* -------------------------------------------------------------------------- */
/* Native — not wired yet                                                      */
/* -------------------------------------------------------------------------- */

/**
 * NATIVE: needs a development build, since Expo Go cannot load the module.
 *
 *   npx expo install @react-native-google-signin/google-signin
 *
 * Add the config plugin to app.json, create iOS and Android OAuth clients in
 * the same Google Cloud project (they must match the bundle id / package name
 * and SHA-1), then:
 *
 *   await GoogleSignin.hasPlayServices();
 *   const { data } = await GoogleSignin.signIn();
 *   return data.idToken;
 *
 * `webClientId` stays WEB_CLIENT_ID — it decides the token's audience, which
 * is what the server verifies.
 */
export async function requestGoogleIdToken() {
  throw new Error(
    Platform.OS === 'web'
      ? 'Use the Google button on web.'
      : 'Google sign-in on device needs a development build. See src/api/google.js.',
  );
}
