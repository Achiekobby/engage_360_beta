export const POINTS_PER_CEDI = 50;

export const TELCO_NETWORKS = [
  { id: 'mtn', label: 'MTN', image: '/images/telcos/mtn_logo.png' },
  { id: 'telecel', label: 'Telecel', image: '/images/telcos/telecel_logo.png' },
  { id: 'at', label: 'AT', image: '/images/telcos/at_logo.png' },
];

export const AIRTIME_AMOUNTS_GHS = [5, 10, 20, 50];

export const REWARD_STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

const REDEMPTION_COUNTS = {
  'airtime-mtn-5': 4,
  'airtime-mtn-10': 12,
  'airtime-mtn-20': 7,
  'airtime-mtn-50': 2,
  'airtime-telecel-5': 3,
  'airtime-telecel-10': 9,
  'airtime-telecel-20': 5,
  'airtime-telecel-50': 1,
  'airtime-at-5': 6,
  'airtime-at-10': 8,
  'airtime-at-20': 4,
  'airtime-at-50': 2,
};

const RECIPIENTS = [
  { phone: '0246657998', email: 'info@dealboxx.com' },
  { phone: '0201148832', email: 'ama.osei@gmail.com' },
  { phone: '0559023310', email: 'kwame@northstar.gh' },
  { phone: '0274419088', email: 'hello@kenteandco.com' },
  { phone: '0507781204', email: 'efua.mensah@yahoo.com' },
  { phone: '0243306711', email: 'orders@accrafresh.com' },
  { phone: '0562194403', email: 'yaw.boateng@outlook.com' },
  { phone: '0278801566', email: 'studio@harborandco.com' },
  { phone: '0205567812', email: 'akosua@brightpath.com' },
  { phone: '0541129034', email: 'care@petcom.com' },
];

function daysAgoFor(index) {
  if (index % 11 === 0) return 78 + (index % 36);
  if (index % 2 === 0) return 30 + (index % 28);
  return index % 28;
}

function redemptionStatusFor(index) {
  if (index % 9 === 0) return 'fulfilled';
  if (index % 4 === 0) return 'processing';
  return 'pending';
}

export function networkById(id) {
  return TELCO_NETWORKS.find((network) => network.id === id) || null;
}

export function networkFromTitle(title) {
  const value = String(title || '').toLowerCase();
  if (value.includes('telecel') || value.includes('vodafone')) return 'telecel';
  if (value.includes('airteltigo') || value.includes('airtel') || /\bat\b/.test(value)) return 'at';
  if (value.includes('mtn')) return 'mtn';
  return '';
}

export function amountFromHeadline(headline) {
  const match = String(headline || '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : NaN;
}

export function pointsFromInput(value) {
  const match = String(value || '').match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

export function buildReward({
  network,
  amountGhs,
  points,
  description,
  title,
  headline,
  image,
  category = 'airtime',
  status = 'active',
  published = false,
  createdAt = '2026-08-12T09:00:00.000Z',
}) {
  const telco = networkById(network);
  const amount = Number(amountGhs);
  return {
    id: `airtime-${network}-${amount}`,
    category,
    network,
    networkLabel: telco?.label || network,
    image: image || telco?.image || '',
    amountGhs: amount,
    title: (title || '').trim() || `${telco?.label || 'Airtime'} Airtime`,
    headline: (headline || '').trim() || `GHS ${amount} Airtime`,
    description: (description || '').trim() || 'Top up your mobile balance',
    points: Number(points),
    status,
    published,
    createdAt,
  };
}

export const SEED_REWARDS = TELCO_NETWORKS.flatMap((network) =>
  AIRTIME_AMOUNTS_GHS.map((amountGhs) =>
    buildReward({
      network: network.id,
      amountGhs,
      points: amountGhs * POINTS_PER_CEDI,
      description: 'Top up your mobile balance',
    }),
  ),
);

export const REDEMPTION_STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'fulfilled', label: 'Fulfilled' },
];

export function rewardLineLabel(reward) {
  if (!reward) return 'Removed reward';
  return `${reward.networkLabel} Airtime ${reward.amountGhs} cedis`;
}

export const SEED_REDEMPTIONS = (() => {
  const rows = [];
  let index = 0;
  SEED_REWARDS.forEach((reward) => {
    const count = REDEMPTION_COUNTS[reward.id] || 0;
    for (let offset = 0; offset < count; offset += 1) {
      const person = RECIPIENTS[index % RECIPIENTS.length];
      const created = new Date();
      created.setHours(7 + (index % 12), (index * 13) % 60, 0, 0);
      created.setDate(created.getDate() - daysAgoFor(index));
      rows.push({
        id: `rdm-${reward.id}-${offset}`,
        rewardId: reward.id,
        phone: person.phone,
        email: person.email,
        points: reward.points,
        status: redemptionStatusFor(index),
        createdAt: created.toISOString(),
      });
      index += 1;
    }
  });
  return rows.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
})();

export function formatActivityWhen(iso) {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const hours24 = date.getHours();
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours = hours24 % 12 || 12;
  return `${day}-${month}-${year}, ${hours}:${minutes}${suffix}`;
}
