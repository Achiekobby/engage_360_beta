import { HOUR_MS, REWARDS_CONFIG } from '../../constants/rewardsConfig';
import { delay, formatWait } from './delay';
import { RecipientError } from './errors';
import { getProfileGaps } from './profileGaps';
import { buildDemoLedger } from './seed';
import { mutateRecipient, readRecipient, startSession } from './store';

const lockedError = (until) =>
  new RecipientError(
    'OTP_LOCKED',
    `Too many incorrect attempts. Try again in ${formatWait(until - Date.now())}.`,
    { retryAt: until },
  );

/**
 * Sends a one-time code. Enforces a resend cooldown and an hourly send cap.
 * (Demo: the code is REWARDS_CONFIG.demoOtp instead of a real SMS.)
 */
export async function requestOtp(phone) {
  await delay(550);
  const now = Date.now();

  return mutateRecipient(phone, (recipient) => {
    const otp = recipient.otp || { sends: [], attempts: 0, lockedUntil: 0, sentAt: 0 };

    if (otp.lockedUntil > now) throw lockedError(otp.lockedUntil);

    const cooldownLeft = REWARDS_CONFIG.otpResendCooldownSec * 1000 - (now - otp.sentAt);
    if (cooldownLeft > 0) {
      const retryInSec = Math.ceil(cooldownLeft / 1000);
      throw new RecipientError(
        'OTP_COOLDOWN',
        `Please wait ${retryInSec}s before requesting another code.`,
        { retryInSec },
      );
    }

    const recentSends = (otp.sends || []).filter((time) => now - time < HOUR_MS);
    if (recentSends.length >= REWARDS_CONFIG.otpMaxSendsPerHour) {
      throw new RecipientError(
        'OTP_LIMIT',
        'You have reached the hourly limit for verification codes. Please try again later.',
      );
    }

    recipient.otp = {
      code: REWARDS_CONFIG.demoOtp,
      sentAt: now,
      expiresAt: now + REWARDS_CONFIG.otpTtlMs,
      attempts: 0,
      lockedUntil: 0,
      sends: [...recentSends, now],
    };

    return {
      cooldownSec: REWARDS_CONFIG.otpResendCooldownSec,
      expiresAt: recipient.otp.expiresAt,
    };
  });
}

/**
 * Verifies the code, opens a session and returns the profile gaps.
 * Wrong codes are counted; too many wrong codes lock the number for a while.
 */
export async function verifyOtp(phone, code) {
  await delay(650);
  const now = Date.now();

  if (!new RegExp(`^\\d{${REWARDS_CONFIG.otpLength}}$`).test(code)) {
    throw new RecipientError('OTP_FORMAT', `Enter the ${REWARDS_CONFIG.otpLength}-digit code.`);
  }

  const outcome = mutateRecipient(phone, (recipient) => {
    const otp = recipient.otp;
    if (!otp) return { error: new RecipientError('OTP_MISSING', 'Request a new code to continue.') };
    if (otp.lockedUntil > now) return { error: lockedError(otp.lockedUntil) };
    if (otp.expiresAt <= now) {
      return { error: new RecipientError('OTP_EXPIRED', 'That code has expired. Request a new one.') };
    }

    if (code !== otp.code) {
      otp.attempts += 1;
      const attemptsLeft = REWARDS_CONFIG.otpMaxAttempts - otp.attempts;

      if (attemptsLeft <= 0) {
        otp.lockedUntil = now + REWARDS_CONFIG.otpLockMs;
        return { error: lockedError(otp.lockedUntil) };
      }

      return {
        error: new RecipientError(
          'OTP_INVALID',
          `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`,
          { attemptsLeft },
        ),
      };
    }

    recipient.otp = null;
    recipient.verified = true;
    recipient.verifiedAt = now;

    if (!recipient.seeded && REWARDS_CONFIG.seedDemoLedger) {
      Object.assign(recipient, buildDemoLedger(phone, now), { seeded: true });
    }

    return { ok: true };
  });

  if (outcome.error) throw outcome.error;

  startSession(phone);
  return { gaps: getProfileGaps(readRecipient(phone)) };
}
