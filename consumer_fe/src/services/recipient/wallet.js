import { DAY_MS, REWARDS_CONFIG } from '../../constants/rewardsConfig';

/**
 * Pure wallet engine. The wallet is never stored: it is derived from the ledger
 * (earned lots) and the redemptions (which record exactly which lots they consumed).
 *
 *  - Pending points do not count until `clearsAt` has passed.
 *  - Points expire `pointsValidityDays` after being earned.
 *  - Redemptions consume the lots that expire first (FIFO), never expired lots.
 */

export const EMPTY_WALLET = Object.freeze({
  balance: 0,
  pendingPoints: 0,
  expiredPoints: 0,
  totalEarned: 0,
  totalRedeemed: 0,
  earnedThisMonth: 0,
  earnedLastMonth: 0,
  redeemedThisMonth: 0,
  redeemedLastMonth: 0,
  redemptionsToday: 0,
  redemptionsLeftToday: REWARDS_CONFIG.maxRedemptionsPerDay,
  nextExpiry: null,
  lots: [],
});

export function resolveEarnStatus(entry, now) {
  if (entry.status === 'Pending' && entry.clearsAt && now >= entry.clearsAt) return 'Earned';
  return entry.status;
}

export function resolveRedemptionStatus(redemption, now) {
  if (redemption.status === 'Failed') return 'Failed';
  return now >= redemption.completesAt ? 'Completed' : 'Processing';
}

const monthKey = (timestamp) => {
  const date = new Date(timestamp);
  return date.getFullYear() * 12 + date.getMonth();
};

const sum = (items, pick) => items.reduce((total, item) => total + pick(item), 0);

export function computeWallet(recipient, now = Date.now()) {
  if (!recipient) return EMPTY_WALLET;

  const earns = (recipient.ledger || []).map((entry) => ({
    ...entry,
    status: resolveEarnStatus(entry, now),
  }));
  const credited = earns.filter((entry) => entry.status === 'Earned');
  const pending = earns.filter((entry) => entry.status === 'Pending');
  const redemptions = (recipient.redemptions || []).filter((r) => r.status !== 'Failed');

  const consumedByLot = new Map();
  redemptions.forEach((redemption) => {
    (redemption.consumed || []).forEach(({ lotId, points }) => {
      consumedByLot.set(lotId, (consumedByLot.get(lotId) || 0) + points);
    });
  });

  let balance = 0;
  let expiredPoints = 0;
  const lots = credited.map((entry) => {
    const left = entry.points - (consumedByLot.get(entry.id) || 0);
    const expired = entry.expiresAt <= now;
    if (expired) expiredPoints += left;
    else balance += left;
    return { ...entry, left, expired };
  });

  const thisMonth = monthKey(now);
  const lastMonth = thisMonth - 1;
  const dayAgo = now - DAY_MS;
  const redemptionsToday = redemptions.filter((r) => r.createdAt > dayAgo).length;

  const nextLot = lots
    .filter((lot) => !lot.expired && lot.left > 0)
    .sort((a, b) => a.expiresAt - b.expiresAt)[0];

  return {
    balance,
    pendingPoints: sum(pending, (entry) => entry.points),
    expiredPoints,
    totalEarned: sum(credited, (entry) => entry.points),
    totalRedeemed: sum(redemptions, (r) => r.points),
    earnedThisMonth: sum(
      credited.filter((entry) => monthKey(entry.earnedAt) === thisMonth),
      (entry) => entry.points,
    ),
    earnedLastMonth: sum(
      credited.filter((entry) => monthKey(entry.earnedAt) === lastMonth),
      (entry) => entry.points,
    ),
    redeemedThisMonth: sum(
      redemptions.filter((r) => monthKey(r.createdAt) === thisMonth),
      (r) => r.points,
    ),
    redeemedLastMonth: sum(
      redemptions.filter((r) => monthKey(r.createdAt) === lastMonth),
      (r) => r.points,
    ),
    redemptionsToday,
    redemptionsLeftToday: Math.max(0, REWARDS_CONFIG.maxRedemptionsPerDay - redemptionsToday),
    nextExpiry: nextLot ? { points: nextLot.left, at: nextLot.expiresAt } : null,
    lots,
  };
}

/**
 * Picks which lots pay for `points`. Returns null if the spendable balance is too small.
 * Earliest-expiring lots go first; expired lots are never spent.
 */
export function allocatePoints(lots, points, at = Date.now()) {
  const spendable = lots
    .filter((lot) => lot.left > 0 && lot.expiresAt > at && lot.earnedAt <= at)
    .sort((a, b) => a.expiresAt - b.expiresAt);

  let remaining = points;
  const consumed = [];
  for (const lot of spendable) {
    if (remaining <= 0) break;
    const take = Math.min(lot.left, remaining);
    consumed.push({ lotId: lot.id, points: take });
    remaining -= take;
  }

  return remaining > 0 ? null : consumed;
}

/** Table rows, newest first, with statuses resolved for `now`. */
export function getEarningRows(recipient, now = Date.now()) {
  return (recipient?.ledger || [])
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      date: entry.earnedAt,
      points: entry.points,
      status: resolveEarnStatus(entry, now),
    }))
    .sort((a, b) => b.date - a.date);
}

export function getRedemptionRows(recipient, now = Date.now()) {
  return (recipient?.redemptions || [])
    .map((redemption) => ({
      id: redemption.id,
      title: `${redemption.title} · GHS ${redemption.amountGhs}`,
      date: redemption.createdAt,
      points: redemption.points,
      status: resolveRedemptionStatus(redemption, now),
      reference: redemption.reference,
    }))
    .sort((a, b) => b.date - a.date);
}

/** Month-by-month totals for a calendar year, used by the trend charts. */
export function getMonthlySeries(recipient, year, now = Date.now()) {
  const earned = Array(12).fill(0);
  const redeemed = Array(12).fill(0);

  (recipient?.ledger || []).forEach((entry) => {
    if (resolveEarnStatus(entry, now) !== 'Earned') return;
    const date = new Date(entry.earnedAt);
    if (date.getFullYear() === year) earned[date.getMonth()] += entry.points;
  });

  (recipient?.redemptions || []).forEach((redemption) => {
    if (redemption.status === 'Failed') return;
    const date = new Date(redemption.createdAt);
    if (date.getFullYear() === year) redeemed[date.getMonth()] += redemption.points;
  });

  return { earned, redeemed };
}
