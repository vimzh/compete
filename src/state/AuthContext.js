import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { fetchMe, signInWithGoogleToken, signOut as signOutRequest, updateMe } from '../api/auth';
import { GoogleSignInCancelled, requestGoogleIdToken } from '../api/google';
import { clearSession, readSession, writeSession } from './sessionStore';

const AuthContext = createContext(null);

/**
 * ── Google OAuth is switched off ────────────────────────────────────────────
 * Set this back to `true` to restore the real sign-in gate. Nothing else needs
 * changing: the Google code, the sign-in screen and the server's token
 * verification are all still here and still wired up.
 *
 * While it is false the app boots straight into the feed as a local stand-in
 * user. Nothing is written to the server, so no account is created.
 */
const AUTH_ENABLED = false;

/** Stand-in identity used only while AUTH_ENABLED is false. */
const LOCAL_USER = {
  id: 'local',
  name: 'You',
  handle: 'you',
  email: null,
  bio: '',
  avatarUrl: null,
};

/**
 * Who is signed in, and the calls that change that.
 *
 * The session token is the only durable state; the profile is a cache of what
 * the server last said. On launch we trust the cached profile enough to render
 * immediately, then reconcile with `/api/me` in the background.
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState(AUTH_ENABLED ? 'loading' : 'signedIn');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(AUTH_ENABLED ? null : LOCAL_USER);
  const [signingIn, setSigningIn] = useState(false);

  // Guards against a restore that resolves after the user already signed in
  // or out — the later intent must win.
  const generation = useRef(0);

  const forget = useCallback(async () => {
    generation.current += 1;
    setToken(null);
    setUser(null);
    setStatus('signedOut');
    await clearSession();
  }, []);

  useEffect(() => {
    if (!AUTH_ENABLED) return undefined;

    let cancelled = false;
    const mine = generation.current;

    (async () => {
      const session = await readSession();
      if (cancelled || generation.current !== mine) return;

      if (!session?.token) {
        setStatus('signedOut');
        return;
      }

      setToken(session.token);
      setUser(session.user || null);
      setStatus('signedIn');

      try {
        const { user: fresh } = await fetchMe(session.token);
        if (cancelled || generation.current !== mine) return;
        setUser(fresh);
        await writeSession({ token: session.token, user: fresh });
      } catch (error) {
        if (cancelled || generation.current !== mine) return;
        // Only a rejected token means signed out. A server that's down or a
        // phone on the wrong Wi-Fi should not wipe the session.
        if (error.status === 401) await forget();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [forget]);

  /** Exchanges a Google ID token for a session. */
  const signInWithIdToken = useCallback(async (idToken) => {
    setSigningIn(true);
    try {
      const session = await signInWithGoogleToken(idToken);

      generation.current += 1;
      setToken(session.token);
      setUser(session.user);
      setStatus('signedIn');
      await writeSession({ token: session.token, user: session.user });
      return session.user;
    } catch (error) {
      if (error instanceof GoogleSignInCancelled || error.cancelled) return null;
      throw error;
    } finally {
      setSigningIn(false);
    }
  }, []);

  /**
   * Native path: this drives the whole flow itself. On web the GIS button owns
   * the click and calls signInWithIdToken directly — see components/GoogleButton.
   */
  const signIn = useCallback(async () => {
    setSigningIn(true);
    try {
      const idToken = await requestGoogleIdToken();
      return await signInWithIdToken(idToken);
    } catch (error) {
      if (error instanceof GoogleSignInCancelled || error.cancelled) return null;
      throw error;
    } finally {
      setSigningIn(false);
    }
  }, [signInWithIdToken]);

  const signOut = useCallback(async () => {
    // With the gate off there is nowhere to sign out to — the sign-in screen
    // is unreachable, so this would strand the app on a blank state.
    if (!AUTH_ENABLED) return;

    const current = token;
    // Local state clears first: signing out must feel instant and must succeed
    // even if the server never hears about it.
    await forget();
    if (current) {
      try {
        await signOutRequest(current);
      } catch {
        // The session expires on its own; nothing to recover here.
      }
    }
  }, [forget, token]);

  /** Saves a profile edit and adopts the server's canonical version. */
  const updateProfile = useCallback(
    async (patch) => {
      // No account to save against while the gate is off; keep the edit local
      // so the profile screen still works.
      if (!AUTH_ENABLED) {
        const next = { ...LOCAL_USER, ...user, ...patch };
        setUser(next);
        return next;
      }
      if (!token) throw new Error('Sign in to edit your profile.');
      const { user: fresh } = await updateMe(token, patch);
      setUser(fresh);
      await writeSession({ token, user: fresh });
      return fresh;
    },
    [token, user],
  );

  const value = useMemo(
    () => ({ status, user, token, signingIn, signIn, signInWithIdToken, signOut, updateProfile }),
    [status, user, token, signingIn, signIn, signInWithIdToken, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.');
  return context;
}
