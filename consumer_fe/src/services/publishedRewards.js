import { REWARDS } from '../constants/rewardsCatalog';

let extras = [];

function normalize(reward) {
  return {
    id: reward.id,
    category: reward.category || 'airtime',
    network: reward.network,
    networkLabel: reward.networkLabel,
    image: reward.image,
    amountGhs: Number(reward.amountGhs),
    title: reward.title,
    headline: reward.headline,
    description: reward.description,
    points: Number(reward.points),
  };
}

/** Seed catalog plus rewards published from the admin portal. Inactive ones stay hidden. */
export function catalogWithPublished() {
  const hidden = new Set();
  const overrides = new Map();

  extras.forEach((reward) => {
    if (!reward?.id) return;
    if (reward.status === 'inactive') {
      hidden.add(reward.id);
      return;
    }
    overrides.set(reward.id, normalize(reward));
  });

  const seedIds = new Set(REWARDS.map((reward) => reward.id));
  const added = [...overrides.values()].filter((reward) => !seedIds.has(reward.id));
  const seed = REWARDS.filter((reward) => !hidden.has(reward.id)).map((reward) => overrides.get(reward.id) || reward);
  return [...added, ...seed];
}

export function findReward(id) {
  return catalogWithPublished().find((reward) => reward.id === id) || null;
}

export function loadPublishedRewards() {
  return fetch('/api/published-rewards')
    .then((response) => (response.ok ? response.json() : []))
    .then((list) => {
      extras = Array.isArray(list) ? list : [];
      return catalogWithPublished();
    })
    .catch(() => catalogWithPublished());
}
