import Images from '../../../utils/Images';

export const AUTOMATION_TYPES = [
  { id: 'customers', label: 'Customers Automation' },
  { id: 'calendar', label: 'Calendar Automation' },
];

export const AUTOMATION_KINDS = {
  customers: [
    {
      id: 'birthday',
      label: 'Birthday',
      title: 'Birthday',
      description: 'Manage all your customers birthday at one place',
      icon: 'gift',
    },
    {
      id: 'welcome',
      label: 'Welcome Message',
      title: 'Welcome Message',
      description: 'Greet new customers automatically when they join your list',
      icon: 'message',
    },
    {
      id: 'anniversary',
      label: 'Customer Anniversary',
      title: 'Customer Anniversary',
      description: 'Celebrate customer milestones and loyalty moments',
      icon: 'award',
    },
  ],
  calendar: [
    {
      id: 'events',
      label: 'Events',
      title: 'Events',
      description: 'Schedule calendar-based engagement around key dates',
      icon: 'calendar',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      title: 'Reminders',
      description: 'Send timely reminders before important customer moments',
      icon: 'bell',
    },
  ],
};

export const AUTOMATION_VIEW_TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'history', label: 'History' },
];

export const AUTOMATIONS_PAGE_SIZE = 10;

const THUMB = Images.growth.growth_section;

const BIRTHDAY_UPCOMING = Array.from({ length: 14 }, (_, index) => {
  const daysUntil = index + 1;
  const isReview = index % 3 === 1;

  return {
    id: `bday-${index + 1}`,
    daysUntil,
    timingLabel: `Upcoming in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
    approval: index % 2 === 0 ? 'Auto-approval' : 'Business-approval',
    status: isReview ? 'pending-review' : 'pending',
    statusLabel: isReview ? 'Pending Review' : 'Pending',
    type: 'customers',
    kind: 'birthday',
    view: 'upcoming',
    channel: 'SMS',
    image: THUMB,
  };
});

export const AUTOMATION_ITEMS = [
  ...BIRTHDAY_UPCOMING,
  {
    id: 'bday-h1',
    type: 'customers',
    kind: 'birthday',
    view: 'history',
    channel: 'SMS',
    daysUntil: null,
    timingLabel: 'Sent 5 days ago',
    approval: 'Auto-approval',
    status: 'sent',
    statusLabel: 'Sent',
    image: THUMB,
  },
  {
    id: 'bday-h2',
    type: 'customers',
    kind: 'birthday',
    view: 'history',
    channel: 'SMS',
    daysUntil: null,
    timingLabel: 'Sent 8 days ago',
    approval: 'Business-approval',
    status: 'sent',
    statusLabel: 'Sent',
    image: THUMB,
  },
  {
    id: 'bday-h3',
    type: 'customers',
    kind: 'birthday',
    view: 'history',
    channel: 'Email',
    daysUntil: null,
    timingLabel: 'Sent 12 days ago',
    approval: 'Auto-approval',
    status: 'sent',
    statusLabel: 'Sent',
    image: THUMB,
  },
  {
    id: 'bday-h4',
    type: 'customers',
    kind: 'birthday',
    view: 'history',
    channel: 'SMS',
    daysUntil: null,
    timingLabel: 'Sent 15 days ago',
    approval: 'Auto-approval',
    status: 'sent',
    statusLabel: 'Sent',
    image: THUMB,
  },
  {
    id: 'welcome-1',
    type: 'customers',
    kind: 'welcome',
    view: 'upcoming',
    channel: 'Email',
    daysUntil: 1,
    timingLabel: 'Upcoming in 1 day',
    approval: 'Auto-approval',
    status: 'pending',
    statusLabel: 'Pending',
    image: Images.about.about_section,
  },
  {
    id: 'welcome-2',
    type: 'customers',
    kind: 'welcome',
    view: 'upcoming',
    channel: 'SMS',
    daysUntil: 2,
    timingLabel: 'Upcoming in 2 days',
    approval: 'Business-approval',
    status: 'pending-review',
    statusLabel: 'Pending Review',
    image: Images.about.about_section,
  },
  {
    id: 'anniv-1',
    type: 'customers',
    kind: 'anniversary',
    view: 'upcoming',
    channel: 'WhatsApp',
    daysUntil: 6,
    timingLabel: 'Upcoming in 6 days',
    approval: 'Auto-approval',
    status: 'pending',
    statusLabel: 'Pending',
    image: Images.products.outcome,
  },
  {
    id: 'event-1',
    type: 'calendar',
    kind: 'events',
    view: 'upcoming',
    channel: 'SMS',
    daysUntil: 5,
    timingLabel: 'Upcoming in 5 days',
    approval: 'Business-approval',
    status: 'pending-review',
    statusLabel: 'Pending Review',
    image: THUMB,
  },
  {
    id: 'reminder-1',
    type: 'calendar',
    kind: 'reminders',
    view: 'upcoming',
    channel: 'Email',
    daysUntil: 1,
    timingLabel: 'Upcoming in 1 day',
    approval: 'Auto-approval',
    status: 'pending',
    statusLabel: 'Pending',
    image: Images.about.about_section,
  },
];

export const STATUS_STYLES = {
  pending: 'bg-[#FFF1E8] text-[#E67E22]',
  'pending-review': 'bg-[#FFF8E1] text-[#C9A227]',
  sent: 'bg-[#E8F8EF] text-[#1F9D55]',
};

export const AUTOMATION_FILTER_DEFAULTS = {
  channels: [],
  approvals: [],
  statuses: [],
  timingWindow: 'any',
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

export function getKindsForType(typeId) {
  return AUTOMATION_KINDS[typeId] ?? [];
}

export function getKindMeta(typeId, kindId) {
  return getKindsForType(typeId).find((kind) => kind.id === kindId) ?? getKindsForType(typeId)[0];
}

export function countActiveAutomationFilters(filters = AUTOMATION_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.channels?.length) count += 1;
  if (filters.approvals?.length) count += 1;
  if (filters.statuses?.length) count += 1;
  if (filters.timingWindow && filters.timingWindow !== 'any') count += 1;
  return count;
}

export function getAutomationItems({
  type,
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

  return AUTOMATION_ITEMS.filter((item) => {
    if (item.type !== type || item.kind !== kind || item.view !== view) return false;

    if (filters.channels?.length && !filters.channels.includes(item.channel)) return false;
    if (filters.approvals?.length && !filters.approvals.includes(item.approval)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(item.status)) return false;

    if (timingLimit != null) {
      if (item.daysUntil == null || item.daysUntil > timingLimit) return false;
    }

    if (!query) return true;

    return (
      item.channel.toLowerCase().includes(query) ||
      item.timingLabel.toLowerCase().includes(query) ||
      item.approval.toLowerCase().includes(query) ||
      item.statusLabel.toLowerCase().includes(query)
    );
  });
}
