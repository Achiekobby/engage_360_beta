/**
 * Business rules for the recipient rewards programme.
 * In production these are enforced by the API; the front end only mirrors them for UX.
 */
export const DAY_MS = 24 * 60 * 60 * 1000;
export const HOUR_MS = 60 * 60 * 1000;

export const REWARDS_CONFIG = Object.freeze({
  /** Points granted for each completed profile section (location, details). One-time each. */
  profilePoints: 50,
  /** Conversion rate used to price airtime rewards. */
  pointsPerCedi: 50,
  /** Points expire this many days after they are earned. */
  pointsValidityDays: 365,
  /** Campaign points stay Pending until the brand confirms the action. */
  clearingHours: 48,

  otpLength: 6,
  otpTtlMs: 5 * 60 * 1000,
  otpResendCooldownSec: 30,
  otpMaxSendsPerHour: 5,
  otpMaxAttempts: 5,
  otpLockMs: 5 * 60 * 1000,

  /** Idle timeout for a verified recipient session (sliding). */
  sessionTtlMs: 30 * 60 * 1000,

  maxRedemptionsPerDay: 3,
  /** Simulated airtime delivery time before a redemption shows as Completed. */
  processingMs: 6000,

  /** Stand-in for the SMS provider. Remove once the real API is connected. */
  demoOtp: '123456',
  /** Seed a sample points history on first verification so the wallet is not empty in demos. */
  seedDemoLedger: true,
});
