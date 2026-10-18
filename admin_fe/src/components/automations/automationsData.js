export const AUTOMATION_KINDS = {
  birthday: {
    id: 'birthday',
    label: 'Birthday',
    title: 'Birthday Message',
    description:
      'Review and manage birthday automations across every onboarded business in one place.',
  },
  welcome: {
    id: 'welcome',
    label: 'Welcome Message',
    title: 'Welcome Message',
    description:
      'Review and manage welcome message automations across every onboarded business in one place.',
  },
  anniversary: {
    id: 'anniversary',
    label: 'Customer Anniversary',
    title: 'Customer Anniversary',
    description:
      'Review and manage customer anniversary automations across every onboarded business in one place.',
  },
  holidays: {
    id: 'holidays',
    label: 'Holiday & Festive Season',
    title: 'Holiday & Festive Season',
    description:
      'Review and manage holiday & festive season automations across every onboarded business in one place.',
  },
};

export const AUTOMATIONS_PAGE_SIZE = 10;

export const AUTOMATION_VIEW_TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'history', label: 'History' },
];

export const AUTOMATION_FILTER_DEFAULTS = {
  channels: [],
  approvals: [],
  statuses: [],
  timingWindow: 'any',
  businesses: [],
};

export const AUTOMATION_CHANNEL_OPTIONS = [
  { id: 'SMS', label: 'SMS' },
  { id: 'Email', label: 'Email' },
  { id: 'WhatsApp', label: 'WhatsApp' },
];

export const AUTOMATION_APPROVAL_OPTIONS = [
  { id: 'Auto-approval', label: 'Auto-approval' },
  { id: 'Business-approval', label: 'Business-approval' },
];

export const AUTOMATION_STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'pending-review', label: 'Pending Review' },
  { id: 'sent', label: 'Sent' },
];

export const AUTOMATION_TIMING_OPTIONS = [
  { id: 'any', label: 'Any time' },
  { id: '7', label: 'Next 7 days' },
  { id: '14', label: 'Next 14 days' },
  { id: '30', label: 'Next 30 days' },
];

export const AUTOMATION_BUSINESS_OPTIONS = [
  { id: 'dealboxx', label: 'DealBoxx' },
  { id: 'txtconnect', label: 'TxtConnect' },
  { id: 'venus-retail', label: 'Venus Retail' },
  { id: 'northstar', label: 'Northstar Foods' },
];

/** Neutral placeholder thumbnail for automation rows */
export const AUTOMATION_THUMB =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="12" fill="#EEF2FF"/>
      <rect x="14" y="42" width="18" height="18" rx="3" fill="#C7D2FE"/>
      <rect x="31" y="30" width="18" height="30" rx="3" fill="#A5B4FC"/>
      <rect x="48" y="36" width="18" height="24" rx="3" fill="#818CF8"/>
      <circle cx="40" cy="22" r="8" fill="#6366F1"/>
    </svg>`,
  );

const BUSINESSES = ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar Foods'];

function buildKindItems(kind, count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const daysUntil = index + 1;
    const isReview = index % 3 === 1;
    const channels = ['SMS', 'Email', 'WhatsApp'];
    const timingLabel =
      kind === 'welcome'
        ? `Queued for ${daysUntil} day${daysUntil === 1 ? '' : 's'}`
        : `Upcoming in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;

    return {
      id: `${kind}-${index + 1}`,
      kind,
      view: 'upcoming',
      channel: channels[index % channels.length],
      daysUntil,
      timingLabel,
      approval: index % 2 === 0 ? 'Auto-approval' : 'Business-approval',
      status: isReview ? 'pending-review' : 'pending',
      statusLabel: isReview ? 'Pending Review' : 'Pending',
      business: BUSINESSES[index % BUSINESSES.length],
      businessId: AUTOMATION_BUSINESS_OPTIONS[index % AUTOMATION_BUSINESS_OPTIONS.length].id,
      image: AUTOMATION_THUMB,
    };
  });
}

function buildHistoryItems(kind) {
  return [
    {
      id: `${kind}-h1`,
      kind,
      view: 'history',
      channel: 'SMS',
      daysUntil: null,
      timingLabel: 'Sent 5 days ago',
      approval: 'Auto-approval',
      status: 'sent',
      statusLabel: 'Sent',
      business: 'DealBoxx',
      businessId: 'dealboxx',
      image: AUTOMATION_THUMB,
    },
    {
      id: `${kind}-h2`,
      kind,
      view: 'history',
      channel: 'Email',
      daysUntil: null,
      timingLabel: 'Sent 9 days ago',
      approval: 'Business-approval',
      status: 'sent',
      statusLabel: 'Sent',
      business: 'TxtConnect',
      businessId: 'txtconnect',
      image: AUTOMATION_THUMB,
    },
    {
      id: `${kind}-h3`,
      kind,
      view: 'history',
      channel: 'WhatsApp',
      daysUntil: null,
      timingLabel: 'Sent 14 days ago',
      approval: 'Auto-approval',
      status: 'sent',
      statusLabel: 'Sent',
      business: 'Venus Retail',
      businessId: 'venus-retail',
      image: AUTOMATION_THUMB,
    },
  ];
}

export const AUTOMATION_ITEMS = [
  ...buildKindItems('birthday'),
  ...buildHistoryItems('birthday'),
  ...buildKindItems('welcome', 8),
  ...buildHistoryItems('welcome'),
  ...buildKindItems('anniversary', 8),
  ...buildHistoryItems('anniversary'),
  ...buildKindItems('holidays', 8),
  ...buildHistoryItems('holidays'),
];

export function getAutomationKindMeta(kindId) {
  return AUTOMATION_KINDS[kindId] ?? AUTOMATION_KINDS.birthday;
}

export function countActiveAutomationFilters(filters = AUTOMATION_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.channels?.length) count += 1;
  if (filters.approvals?.length) count += 1;
  if (filters.statuses?.length) count += 1;
  if (filters.businesses?.length) count += 1;
  if (filters.timingWindow && filters.timingWindow !== 'any') count += 1;
  return count;
}

export function filterAutomationItems({
  items,
  kind,
  view,
  searchQuery = '',
  filters = AUTOMATION_FILTER_DEFAULTS,
}) {
  const query = searchQuery.trim().toLowerCase();
  const timingLimit =
    filters.timingWindow && filters.timingWindow !== 'any'
      ? Number(filters.timingWindow)
      : null;

  return items.filter((item) => {
    if (item.kind !== kind || item.view !== view) return false;
    if (filters.channels?.length && !filters.channels.includes(item.channel)) return false;
    if (filters.approvals?.length && !filters.approvals.includes(item.approval)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(item.status)) return false;
    if (filters.businesses?.length && !filters.businesses.includes(item.businessId)) return false;
    if (timingLimit != null) {
      if (item.daysUntil == null || item.daysUntil > timingLimit) return false;
    }
    if (!query) return true;

    return (
      item.channel.toLowerCase().includes(query) ||
      item.timingLabel.toLowerCase().includes(query) ||
      item.approval.toLowerCase().includes(query) ||
      item.statusLabel.toLowerCase().includes(query) ||
      item.business.toLowerCase().includes(query)
    );
  });
}
