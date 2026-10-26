import { delay } from './delay';
import { RecipientError } from './errors';
import { createReference } from './ids';
import { requireSession } from './store';

export const SUPPORT_TOPICS = [
  'Points not credited',
  'Redemption issue',
  'Airtime not received',
  'Update my details',
  'Something else',
];

const LAST_SENT_KEY = 'engage-support-last-sent';
const MIN_GAP_MS = 20 * 1000;

/** Stand-in for POST /support/tickets. Throttled so the form cannot be spammed. */
export async function submitSupportRequest(phone, { topic, message }) {
  await delay(700);
  requireSession(phone);

  if (!SUPPORT_TOPICS.includes(topic)) {
    throw new RecipientError('INVALID_TOPIC', 'Choose what you need help with.');
  }
  const cleanMessage = String(message || '').trim();
  if (cleanMessage.length < 10 || cleanMessage.length > 800) {
    throw new RecipientError('INVALID_MESSAGE', 'Tell us a little more (10–800 characters).');
  }

  const last = Number(sessionStorage.getItem(LAST_SENT_KEY) || 0);
  if (Date.now() - last < MIN_GAP_MS) {
    throw new RecipientError('THROTTLED', 'Please wait a moment before sending another message.');
  }
  sessionStorage.setItem(LAST_SENT_KEY, String(Date.now()));

  return { reference: createReference('TKT') };
}
