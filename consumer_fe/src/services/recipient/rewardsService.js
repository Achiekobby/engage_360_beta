import { REWARDS_CONFIG } from '../../constants/rewardsConfig';
import { findReward, loadPublishedRewards } from '../publishedRewards';
import { delay } from './delay';
import { RecipientError } from './errors';
import { createId, createReference } from './ids';
import { getRewardAvailability } from './rewardRules';
import { mutateRecipient, requireSession } from './store';
import { allocatePoints, computeWallet } from './wallet';

/**
 * Redeems an airtime reward. Every rule is re-checked here (the UI is never trusted):
 *  - active, verified session for this number
 *  - reward exists and the price is read from the catalog, never from the client
 *  - airtime goes only to the verified number
 *  - the recipient confirms the network that number is on now (a prefix is not proof;
 *    ported lines keep their old prefix)
 *  - daily cap, spendable (non-expired, cleared) balance
 *  - idempotent on `requestId`, so retries and double-clicks never charge twice
 */
export async function redeemReward({ phone, rewardId, requestId, confirmedNetwork }) {
  await delay(900);
  requireSession(phone);
  await loadPublishedRewards();

  const reward = findReward(rewardId);
  if (!reward) {
    throw new RecipientError('REWARD_UNAVAILABLE', 'This reward is no longer available.');
  }
  if (!requestId) {
    throw new RecipientError('INVALID_REQUEST', 'Something went wrong. Please try again.');
  }
  if (confirmedNetwork !== reward.network) {
    throw new RecipientError(
      'NETWORK_UNCONFIRMED',
      `Confirm that this number is currently on ${reward.networkLabel}. A ported number keeps its old prefix, so the prefix alone is not enough.`,
    );
  }

  const now = Date.now();

  return mutateRecipient(phone, (recipient) => {
    const existing = recipient.redemptions.find((item) => item.requestId === requestId);
    if (existing) {
      return { redemption: existing, wallet: computeWallet(recipient, now), duplicate: true };
    }

    const wallet = computeWallet(recipient, now);
    const availability = getRewardAvailability(reward, { wallet });
    if (availability.state !== 'available') {
      const codes = {
        limit: 'DAILY_LIMIT',
        insufficient: 'INSUFFICIENT_POINTS',
      };
      throw new RecipientError(codes[availability.state], availability.message);
    }

    const consumed = allocatePoints(wallet.lots, reward.points, now);
    if (!consumed) {
      throw new RecipientError(
        'INSUFFICIENT_POINTS',
        'Your available points changed. Please refresh and try again.',
      );
    }

    const redemption = {
      id: createId('rdm'),
      kind: 'redeem',
      requestId,
      rewardId: reward.id,
      title: reward.title,
      network: reward.network,
      confirmedNetwork,
      amountGhs: reward.amountGhs,
      points: reward.points,
      phone,
      status: 'Processing',
      createdAt: now,
      completesAt: now + REWARDS_CONFIG.processingMs,
      reference: createReference(),
      consumed,
    };
    recipient.redemptions.push(redemption);

    return { redemption, wallet: computeWallet(recipient, now), duplicate: false };
  });
}
