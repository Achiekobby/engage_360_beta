import { REWARDS_CONFIG } from '../../constants/rewardsConfig';

/**
 * Single rule set for "can this recipient redeem this reward right now?".
 * Used by the UI to disable cards and by the redemption service to enforce it.
 */
export function getRewardAvailability(reward, { wallet }) {
  if (wallet.redemptionsLeftToday <= 0) {
    return {
      state: 'limit',
      label: 'Daily limit reached',
      message: `You can redeem up to ${REWARDS_CONFIG.maxRedemptionsPerDay} rewards every 24 hours. Try again later.`,
    };
  }

  if (wallet.balance < reward.points) {
    const shortBy = reward.points - wallet.balance;
    return {
      state: 'insufficient',
      shortBy,
      label: `${shortBy.toLocaleString()} pts to go`,
      message: `You need ${shortBy.toLocaleString()} more points for this reward.`,
    };
  }

  return { state: 'available', label: 'Redeem Reward', message: '' };
}
