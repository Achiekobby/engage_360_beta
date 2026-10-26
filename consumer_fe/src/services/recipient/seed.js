import { DAY_MS, REWARDS_CONFIG } from '../../constants/rewardsConfig';
import { getRewardById } from '../../constants/rewardsCatalog';
import { allocatePoints } from './wallet';
import { createId, createReference } from './ids';

/**
 * Demo-only points history, created once per recipient on first verification
 * (see REWARDS_CONFIG.seedDemoLedger). It spans two calendar years, includes
 * expired points, one pending award and two past redemptions, so every
 * screen has realistic data. Resulting balance: 2,400 pts.
 */
const EARN_SEEDS = [
  { daysAgo: 430, points: 150, title: 'Welcome bonus' },
  { daysAgo: 400, points: 250, title: 'Brand survey completed' },
  { daysAgo: 300, points: 350, title: 'Weekend Flash Deal purchase' },
  { daysAgo: 240, points: 250, title: 'Lead form submitted' },
  { daysAgo: 170, points: 400, title: 'Summer Brand Night registration' },
  { daysAgo: 120, points: 700, title: 'Summer Flash sale purchase' },
  { daysAgo: 75, points: 450, title: 'Boxing Day promotion' },
  { daysAgo: 45, points: 400, title: 'Cart recovery purchase' },
  { daysAgo: 20, points: 350, title: 'Product launch interaction' },
  { daysAgo: 6, points: 250, title: 'Personalised offer' },
];

const REDEEM_SEEDS = [
  { daysAgo: 28, rewardId: 'airtime-mtn-10' },
  { daysAgo: 9, rewardId: 'airtime-at-5' },
];

export function buildDemoLedger(phone, now = Date.now()) {
  const ledger = EARN_SEEDS.map((seed, index) => {
    const earnedAt = now - seed.daysAgo * DAY_MS;
    return {
      id: createId('lot'),
      kind: 'earn',
      key: `seed:${index}`,
      title: seed.title,
      points: seed.points,
      status: 'Earned',
      earnedAt,
      expiresAt: earnedAt + REWARDS_CONFIG.pointsValidityDays * DAY_MS,
      source: 'demo',
    };
  });

  ledger.push({
    id: createId('lot'),
    kind: 'earn',
    key: 'seed:pending',
    title: 'Sales campaign purchase',
    points: 200,
    status: 'Pending',
    earnedAt: now - DAY_MS,
    clearsAt: now + 2 * DAY_MS,
    expiresAt: now - DAY_MS + REWARDS_CONFIG.pointsValidityDays * DAY_MS,
    source: 'demo',
  });

  const lots = ledger
    .filter((entry) => entry.status === 'Earned')
    .map((entry) => ({ ...entry, left: entry.points }));

  const redemptions = REDEEM_SEEDS.map((seed, index) => {
    const reward = getRewardById(seed.rewardId);
    const createdAt = now - seed.daysAgo * DAY_MS;
    const consumed = allocatePoints(lots, reward.points, createdAt) || [];
    consumed.forEach(({ lotId, points }) => {
      const lot = lots.find((item) => item.id === lotId);
      lot.left -= points;
    });

    return {
      id: createId('rdm'),
      kind: 'redeem',
      requestId: `seed-${index}`,
      rewardId: reward.id,
      title: reward.title,
      network: reward.network,
      amountGhs: reward.amountGhs,
      points: reward.points,
      phone,
      status: 'Completed',
      createdAt,
      completesAt: createdAt + REWARDS_CONFIG.processingMs,
      reference: createReference(),
      consumed,
    };
  });

  return { ledger, redemptions };
}
