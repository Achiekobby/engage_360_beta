import Images from '../utils/Images';
import { REWARDS_CONFIG } from './rewardsConfig';

/** Reward categories. Only airtime is live; add new ones here and tag rewards with `category`. */
export const REWARD_CATEGORIES = [{ id: 'airtime', label: 'Airtime' }];

export const TELCO_NETWORKS = [
  { id: 'mtn', label: 'MTN', image: Images.platform_services.mtn },
  { id: 'telecel', label: 'Telecel', image: Images.platform_services.telecel },
  { id: 'at', label: 'AT', image: Images.platform_services.at },
];

export const AIRTIME_AMOUNTS_GHS = [5, 10, 20, 50];

export const REWARDS = TELCO_NETWORKS.flatMap((network) =>
  AIRTIME_AMOUNTS_GHS.map((amountGhs) => ({
    id: `airtime-${network.id}-${amountGhs}`,
    category: 'airtime',
    network: network.id,
    networkLabel: network.label,
    image: network.image,
    amountGhs,
    title: `${network.label} Airtime`,
    headline: `GHS ${amountGhs} Airtime`,
    description: 'Top up your mobile balance',
    points: amountGhs * REWARDS_CONFIG.pointsPerCedi,
  })),
);

export const getRewardById = (id) => REWARDS.find((reward) => reward.id === id) || null;

export const getNetworkLabel = (networkId) =>
  TELCO_NETWORKS.find((network) => network.id === networkId)?.label || 'your network';
