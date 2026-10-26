import { DAY_MS, REWARDS_CONFIG } from '../../constants/rewardsConfig';
import { INTEREST_OPTIONS } from '../../constants/recipientProfileOptions';
import { delay } from './delay';
import { RecipientError } from './errors';
import { createId } from './ids';
import { getProfileGaps } from './profileGaps';
import { mutateRecipient, readAllRecipients, readRecipient, requireSession } from './store';
import { computeWallet } from './wallet';

const NAME_PATTERN = /^[\p{L}\p{N}\s.,'’&()/-]{2,60}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const cleanName = (value) => String(value || '').replace(/\s+/g, ' ').trim();

/**
 * Idempotent: a given `key` is only ever rewarded once, no matter how many
 * times (or from how many tabs) the action is submitted.
 */
function awardPoints(recipient, { key, title, points }, now) {
  if (recipient.ledger.some((entry) => entry.key === key)) return 0;

  recipient.ledger.push({
    id: createId('lot'),
    kind: 'earn',
    key,
    title,
    points,
    status: 'Earned',
    earnedAt: now,
    expiresAt: now + REWARDS_CONFIG.pointsValidityDays * DAY_MS,
    source: 'profile',
  });
  return points;
}

export async function fetchRecipientGaps(phone) {
  await delay(400);
  requireSession(phone);
  return getProfileGaps(readRecipient(phone));
}

export async function saveLocation(phone, { region, city }) {
  await delay(500);
  requireSession(phone);

  const cleanRegion = cleanName(region);
  const cleanCity = cleanName(city);
  if (!NAME_PATTERN.test(cleanRegion)) {
    throw new RecipientError('INVALID_REGION', 'Enter a valid region.');
  }
  if (!NAME_PATTERN.test(cleanCity)) {
    throw new RecipientError('INVALID_CITY', 'Enter a valid city or town.');
  }

  const now = Date.now();
  return mutateRecipient(phone, (recipient) => {
    recipient.region = cleanRegion;
    recipient.city = cleanCity;

    const pointsAwarded = awardPoints(
      recipient,
      { key: 'profile:location', title: 'Added your location', points: REWARDS_CONFIG.profilePoints },
      now,
    );

    return {
      pointsAwarded,
      wallet: computeWallet(recipient, now),
      gaps: getProfileGaps(recipient),
    };
  });
}

export async function saveDetails(phone, { interests, email }) {
  await delay(500);
  requireSession(phone);

  if (!INTEREST_OPTIONS.includes(interests)) {
    throw new RecipientError('INVALID_INTEREST', 'Choose an interest from the list.');
  }

  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(cleanEmail) || cleanEmail.length > 120) {
    throw new RecipientError('INVALID_EMAIL', 'Enter a valid email address.');
  }

  const emailTaken = Object.values(readAllRecipients()).some(
    (other) => other.phone !== phone && other.email?.toLowerCase() === cleanEmail,
  );
  if (emailTaken) {
    throw new RecipientError(
      'EMAIL_TAKEN',
      'That email is already linked to another number. Use a different email.',
    );
  }

  const now = Date.now();
  return mutateRecipient(phone, (recipient) => {
    recipient.interests = interests;
    recipient.email = cleanEmail;

    const pointsAwarded = awardPoints(
      recipient,
      {
        key: 'profile:details',
        title: 'Added interests and email',
        points: REWARDS_CONFIG.profilePoints,
      },
      now,
    );

    return {
      pointsAwarded,
      wallet: computeWallet(recipient, now),
      gaps: getProfileGaps(recipient),
    };
  });
}
