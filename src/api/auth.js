import { request } from './config';

/** Trades a verified Google ID token for a fitterest session. */
export function signInWithGoogleToken(idToken) {
  return request('/api/auth/google', { method: 'POST', body: { idToken } });
}

export function fetchMe(token) {
  return request('/api/me', { token });
}

export function updateMe(token, patch) {
  return request('/api/me', { method: 'PATCH', body: patch, token });
}

export function signOut(token) {
  return request('/api/auth/signout', { method: 'POST', token });
}

/** Public profile behind a handle — for viewing someone else from the feed. */
export function fetchProfile(handle) {
  return request(`/api/users/${encodeURIComponent(handle)}`);
}
