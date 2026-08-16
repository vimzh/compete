import { randomUUID, randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * User + session storage, backed by a single JSON file.
 *
 * Deliberately not a database: the whole set fits in memory, reads are
 * synchronous against that copy, and writes are mirrored to disk so a server
 * restart doesn't sign everyone out mid-demo. The exported surface is the
 * shape a real repository would have, so swapping in Postgres later means
 * rewriting this file and nothing else.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.DATA_FILE || join(HERE, '..', 'data', 'users.json');

const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

// Sessions renew on use once half their life has gone, so someone who opens
// the app regularly is never signed out on a fixed clock — only 30 days of
// actual silence ends a session. Renewing on every request instead would mean
// a disk write per call for no extra benefit.
const SESSION_RENEW_AFTER_MS = SESSION_TTL_MS / 2;

/** @type {{ users: Map<string, object>, sessions: Map<string, object> }} */
const db = { users: new Map(), sessions: new Map() };

let writing = null;
let writeAgain = false;

async function flush() {
  // Coalesce concurrent mutations into one pending write, then one follow-up
  // if anything changed while that write was in flight.
  if (writing) {
    writeAgain = true;
    return writing;
  }

  writing = (async () => {
    const payload = JSON.stringify(
      {
        users: [...db.users.values()],
        sessions: [...db.sessions.values()],
      },
      null,
      2,
    );

    await mkdir(dirname(DATA_FILE), { recursive: true });
    // Write-then-rename so a crash mid-write can't leave a truncated file.
    const temp = `${DATA_FILE}.${process.pid}.tmp`;
    await writeFile(temp, payload, 'utf8');
    await rename(temp, DATA_FILE);
  })();

  try {
    await writing;
  } finally {
    writing = null;
  }

  if (writeAgain) {
    writeAgain = false;
    await flush();
  }
}

export async function loadStore() {
  let raw;
  try {
    raw = await readFile(DATA_FILE, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return; // first run
    throw error;
  }

  const parsed = JSON.parse(raw);
  for (const user of parsed.users || []) db.users.set(user.id, user);

  const now = Date.now();
  for (const session of parsed.sessions || []) {
    if (Date.parse(session.expiresAt) > now) db.sessions.set(session.token, session);
  }
}

// ─────────────────────────────────────────────────────────────
// Handles
// ─────────────────────────────────────────────────────────────

export const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;

/** Normalises user input so `@Mohit ` and `mohit` are the same handle. */
export function normaliseHandle(value) {
  return String(value || '')
    .trim()
    .replace(/^@/, '')
    .toLowerCase();
}

function handleTaken(handle, exceptUserId) {
  for (const user of db.users.values()) {
    if (user.handle === handle && user.id !== exceptUserId) return true;
  }
  return false;
}

/** Derives a free handle from a Google display name or email local part. */
function suggestHandle(seed) {
  const base = String(seed || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 16) || 'friend';

  const padded = base.length >= 3 ? base : `${base}fit`;
  if (!handleTaken(padded)) return padded;

  // Suffix rather than reject: sign-in must never fail on a name collision.
  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${padded.slice(0, 20 - String(i).length)}${i}`;
    if (!handleTaken(candidate)) return candidate;
  }
  return `${padded.slice(0, 12)}${randomBytes(3).toString('hex')}`;
}

// ─────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────

export function findUserById(id) {
  return db.users.get(id) || null;
}

export function findUserByHandle(handle) {
  const wanted = normaliseHandle(handle);
  for (const user of db.users.values()) {
    if (user.handle === wanted) return user;
  }
  return null;
}

export function findUserByGoogleId(googleId) {
  for (const user of db.users.values()) {
    if (user.googleId === googleId) return user;
  }
  return null;
}

function findUserByEmail(email) {
  const wanted = String(email || '').toLowerCase();
  if (!wanted) return null;
  for (const user of db.users.values()) {
    if (user.email === wanted) return user;
  }
  return null;
}

/**
 * Finds the account behind a verified Google identity, creating it on first
 * sign-in. Matching on `googleId` first and email second means a user who
 * somehow arrives with a new Google subject keeps their existing closet.
 */
export async function upsertGoogleUser({ googleId, email, name, picture }) {
  const existing = findUserByGoogleId(googleId) || findUserByEmail(email);

  if (existing) {
    existing.googleId = googleId;
    if (email) existing.email = email.toLowerCase();
    // Google's picture URL rotates; the profile fields the user edited are
    // never overwritten from the provider.
    if (picture) existing.googleAvatarUrl = picture;
    existing.lastSignInAt = new Date().toISOString();
    existing.updatedAt = existing.lastSignInAt;
    await flush();
    return existing;
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    googleId,
    email: email ? email.toLowerCase() : null,
    name: name || 'New member',
    handle: suggestHandle(name || (email || '').split('@')[0]),
    bio: '',
    // Set by the user; falls back to the Google picture when empty.
    avatarUrl: null,
    googleAvatarUrl: picture || null,
    // The full-body shot every try-on renders onto. Null until they upload one.
    modelPhotoUrl: null,
    createdAt: now,
    updatedAt: now,
    lastSignInAt: now,
  };

  db.users.set(user.id, user);
  await flush();
  return user;
}

export class ProfileError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const FIELD_LIMITS = { name: 40, bio: 160 };

/** Applies a partial profile edit. Unknown keys are ignored, not rejected. */
export async function updateUser(userId, patch) {
  const user = db.users.get(userId);
  if (!user) throw new ProfileError('No such account.', 404);

  if ('handle' in patch) {
    const handle = normaliseHandle(patch.handle);
    if (!HANDLE_PATTERN.test(handle)) {
      throw new ProfileError('Handles are 3–20 characters: letters, numbers, underscores.');
    }
    if (handleTaken(handle, userId)) {
      throw new ProfileError('That handle is taken.', 409);
    }
    user.handle = handle;
  }

  for (const field of ['name', 'bio']) {
    if (!(field in patch)) continue;
    const value = String(patch[field] ?? '').trim();
    if (value.length > FIELD_LIMITS[field]) {
      throw new ProfileError(`${field === 'name' ? 'Name' : 'Bio'} is too long.`);
    }
    if (field === 'name' && !value) throw new ProfileError('Name cannot be empty.');
    user[field] = value;
  }

  for (const field of ['avatarUrl', 'modelPhotoUrl']) {
    if (!(field in patch)) continue;
    user[field] = patch[field] ? String(patch[field]) : null;
  }

  user.updatedAt = new Date().toISOString();
  await flush();
  return user;
}

// ─────────────────────────────────────────────────────────────
// Sessions
// ─────────────────────────────────────────────────────────────

export async function createSession(userId) {
  const session = {
    token: randomBytes(32).toString('base64url'),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  db.sessions.set(session.token, session);
  await flush();
  return session;
}

/** Returns the user behind a bearer token, or null if it is unknown/expired. */
export function userForToken(token) {
  const session = token ? db.sessions.get(token) : null;
  if (!session) return null;

  const now = Date.now();
  if (Date.parse(session.expiresAt) <= now) {
    db.sessions.delete(token);
    void flush();
    return null;
  }

  const user = db.users.get(session.userId) || null;
  // Only slide the window for a session that still resolves to a real user;
  // extending one whose account is gone would keep a dead token alive.
  if (user && Date.parse(session.expiresAt) - now < SESSION_TTL_MS - SESSION_RENEW_AFTER_MS) {
    session.expiresAt = new Date(now + SESSION_TTL_MS).toISOString();
    void flush();
  }

  return user;
}

export async function deleteSession(token) {
  if (db.sessions.delete(token)) await flush();
}

// ─────────────────────────────────────────────────────────────
// Projections — never hand the raw record to a client.
// ─────────────────────────────────────────────────────────────

/** What a user may see about themselves. */
export function privateProfile(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    avatarUrl: user.avatarUrl || user.googleAvatarUrl || null,
    modelPhotoUrl: user.modelPhotoUrl,
    createdAt: user.createdAt,
  };
}

/** What anyone may see about a user. Email and model photo stay private. */
export function publicProfile(user) {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    avatarUrl: user.avatarUrl || user.googleAvatarUrl || null,
    createdAt: user.createdAt,
  };
}
