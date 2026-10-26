import { DAY_MS, REWARDS_CONFIG } from '../../constants/rewardsConfig';
import { RecipientError } from './errors';

/**
 * Stand-in persistence for the recipient API.
 *
 *  - Recipients (profile, OTP state, ledger, redemptions): localStorage, shared across tabs.
 *  - Session (who is verified in THIS tab): sessionStorage with a sliding idle timeout.
 *
 * Replace the read/write helpers with HTTP calls when the backend is ready.
 * UI code subscribes through `subscribeRecipientStore` / `getRecipientSnapshot`
 * (see hooks/useRecipient) and never touches storage directly.
 */
const DB_KEY = 'engage-recipients-db';
const SESSION_KEY = 'engage-recipient-session';
const MAX_TIMER_MS = 60 * 60 * 1000;

const listeners = new Set();
let wakeTimer = null;

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function readAllRecipients() {
  return safeParse(localStorage.getItem(DB_KEY), {});
}

function writeAllRecipients(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    throw new RecipientError(
      'STORAGE',
      'We could not save your changes. Check your browser storage settings and try again.',
    );
  }
}

export function readRecipient(phone) {
  return readAllRecipients()[phone] || null;
}

function createRecipient(phone) {
  return {
    phone,
    verified: false,
    createdAt: Date.now(),
    region: '',
    city: '',
    interests: '',
    email: '',
    otp: null,
    seeded: false,
    ledger: [],
    redemptions: [],
  };
}

/**
 * Atomic read-modify-write. The mutator receives a private copy and may throw to
 * abort (nothing is written). Whatever it returns is passed back to the caller.
 */
export function mutateRecipient(phone, mutator) {
  const db = readAllRecipients();
  const draft = db[phone] || createRecipient(phone);
  const result = mutator(draft);
  db[phone] = draft;
  writeAllRecipients(db);
  refresh();
  return result;
}

/* ------------------------------ session ------------------------------ */

export function getSession() {
  const session = safeParse(sessionStorage.getItem(SESSION_KEY), null);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
}

export function startSession(phone) {
  const now = Date.now();
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ phone, startedAt: now, expiresAt: now + REWARDS_CONFIG.sessionTtlMs }),
  );
  refresh();
}

/** Slides the idle timeout. Returns the session, or null if it has already expired. */
export function touchSession() {
  const session = getSession();
  if (!session) {
    refresh(); // an expired session must be pushed to subscribers so guards react
    return null;
  }
  const next = { ...session, expiresAt: Date.now() + REWARDS_CONFIG.sessionTtlMs };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  refresh();
  return next;
}

export function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
  refresh();
}

/** Throws SESSION_EXPIRED unless `phone` is the verified number of an active session. */
export function requireSession(phone) {
  const session = touchSession();
  const recipient = session ? readRecipient(session.phone) : null;
  if (!session || session.phone !== phone || !recipient?.verified) {
    throw new RecipientError(
      'SESSION_EXPIRED',
      'Your session expired. Please verify your number again to continue.',
    );
  }
  return session;
}

/* ------------------------- external-store plumbing ------------------------- */

function buildSnapshot(now = Date.now()) {
  const session = getSession();
  const recipient = session ? readRecipient(session.phone) : null;
  return { session, recipient, now };
}

const signatureOf = ({ session, recipient }) => JSON.stringify([session, recipient]);

let snapshot = buildSnapshot();
let signature = signatureOf(snapshot);

/** The earliest future moment at which something derived from `now` changes. */
function nextWakeAt({ session, recipient, now }) {
  const moments = [];
  if (session) moments.push(session.expiresAt);
  (recipient?.ledger || []).forEach((entry) => {
    if (entry.clearsAt) moments.push(entry.clearsAt);
    moments.push(entry.expiresAt);
  });
  (recipient?.redemptions || []).forEach((redemption) => {
    moments.push(redemption.completesAt, redemption.createdAt + DAY_MS);
  });
  const future = moments.filter((moment) => moment > now);
  return future.length ? Math.min(...future) : null;
}

function scheduleWake() {
  window.clearTimeout(wakeTimer);
  const wakeAt = nextWakeAt(snapshot);
  if (!wakeAt) return;
  const delay = Math.min(Math.max(wakeAt - Date.now(), 0) + 50, MAX_TIMER_MS);
  wakeTimer = window.setTimeout(() => refresh(true), delay);
}

function refresh(force = false) {
  const next = buildSnapshot();
  const nextSignature = signatureOf(next);
  if (!force && nextSignature === signature) return;

  signature = nextSignature;
  snapshot = next;
  scheduleWake();
  listeners.forEach((listener) => listener());
}

scheduleWake();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === DB_KEY || event.key === null) refresh();
  });
}

export const subscribeRecipientStore = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getRecipientSnapshot = () => snapshot;
