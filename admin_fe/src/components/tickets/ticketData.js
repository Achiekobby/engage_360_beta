export const TICKET_CATEGORIES = [
  { id: 'billing', label: 'Billing' },
  { id: 'credits', label: 'Credits' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'access', label: 'Access' },
  { id: 'technical', label: 'Technical' },
];

export const TICKET_PRIORITIES = [
  { id: 'low', label: 'Low', tone: '#717171', badge: 'bg-[#F4F4F5] text-[#52525B]' },
  { id: 'medium', label: 'Medium', tone: '#D97706', badge: 'bg-[#FFF6E5] text-[#B45309]' },
  { id: 'high', label: 'High', tone: '#C0272C', badge: 'bg-[#FDECEC] text-[#C0272C]' },
];

export const TICKET_STATUSES = [
  { id: 'open', label: 'Open', tone: '#2563EB', badge: 'bg-[#EFF6FF] text-[#1D4ED8]' },
  { id: 'in-progress', label: 'In progress', tone: '#D97706', badge: 'bg-[#FFF6E5] text-[#B45309]' },
  { id: 'waiting', label: 'Waiting', tone: '#7C3AED', badge: 'bg-[#F5F3FF] text-[#6D28D9]' },
  { id: 'resolved', label: 'Resolved', tone: '#157A42', badge: 'bg-[#E8F8EF] text-[#157A42]' },
];

export const TICKET_AGENTS = [
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'ama', label: 'Ama Boateng' },
  { id: 'kojo', label: 'Kojo Asare' },
  { id: 'efua', label: 'Efua Mensah' },
];

const SEED_TICKETS = [
  {
    id: 'tkt-2140',
    subject: 'Credits did not apply after top-up',
    businessId: 'biz-oneflow',
    category: 'credits',
    priority: 'high',
    status: 'open',
    assignee: 'unassigned',
    createdAt: '2026-09-24T09:10:00.000Z',
    updatedAt: '2026-09-24T09:10:00.000Z',
    messages: [
      {
        id: 'msg-2140-1',
        from: 'business',
        author: 'Ama Mensah',
        body: 'We topped up 500 credits this morning but the workspace still shows 0. Campaigns are blocked until this clears.',
        at: '2026-09-24T09:10:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2134',
    subject: 'Weekend SMS did not send to Greater Accra',
    businessId: 'biz-accra-fresh',
    category: 'campaigns',
    priority: 'high',
    status: 'in-progress',
    assignee: 'ama',
    createdAt: '2026-09-23T14:22:00.000Z',
    updatedAt: '2026-09-24T08:05:00.000Z',
    messages: [
      {
        id: 'msg-2134-1',
        from: 'business',
        author: 'Yaw Owusu',
        body: 'The weekend produce drop shows sent, but stall customers in Madina say they never received the SMS.',
        at: '2026-09-23T14:22:00.000Z',
      },
      {
        id: 'msg-2134-2',
        from: 'admin',
        author: 'Ama Boateng',
        body: 'I can see a carrier delay on that cluster. Checking the failed batch and will resend the remainder today.',
        at: '2026-09-24T08:05:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2128',
    subject: 'Sign-in email bounce for new staff',
    businessId: 'biz-harbor',
    category: 'access',
    priority: 'medium',
    status: 'waiting',
    assignee: 'kojo',
    createdAt: '2026-09-22T11:40:00.000Z',
    updatedAt: '2026-09-23T16:18:00.000Z',
    messages: [
      {
        id: 'msg-2128-1',
        from: 'business',
        author: 'Efua Darko',
        body: 'Our new producer cannot get past sign-in. The invite keeps bouncing from studio+new@harborandco.com.',
        at: '2026-09-22T11:40:00.000Z',
      },
      {
        id: 'msg-2128-2',
        from: 'admin',
        author: 'Kojo Asare',
        body: 'Please confirm a mailbox that can receive mail. Plus-addressing is being rejected by their host.',
        at: '2026-09-23T16:18:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2121',
    subject: 'Invoice does not match August usage',
    businessId: 'biz-kente',
    category: 'billing',
    priority: 'medium',
    status: 'open',
    assignee: 'efua',
    createdAt: '2026-09-21T10:05:00.000Z',
    updatedAt: '2026-09-21T10:05:00.000Z',
    messages: [
      {
        id: 'msg-2121-1',
        from: 'business',
        author: 'Akosua Frimpong',
        body: 'August invoice is GH₵420 higher than the campaign log in our workspace. Can you send the line items?',
        at: '2026-09-21T10:05:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2116',
    subject: 'WhatsApp template rejected',
    businessId: 'biz-petcom',
    category: 'campaigns',
    priority: 'low',
    status: 'resolved',
    assignee: 'ama',
    createdAt: '2026-09-18T08:30:00.000Z',
    updatedAt: '2026-09-19T12:12:00.000Z',
    messages: [
      {
        id: 'msg-2116-1',
        from: 'business',
        author: 'Kwame Boateng',
        body: 'The restock alert template was rejected. We only changed the price line.',
        at: '2026-09-18T08:30:00.000Z',
      },
      {
        id: 'msg-2116-2',
        from: 'admin',
        author: 'Ama Boateng',
        body: 'Meta flagged the price as a promotional claim. I resubmitted a compliant version and it is approved.',
        at: '2026-09-19T12:12:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2109',
    subject: 'Customer export times out',
    businessId: 'biz-palm',
    category: 'technical',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'kojo',
    createdAt: '2026-09-17T15:48:00.000Z',
    updatedAt: '2026-09-20T09:33:00.000Z',
    messages: [
      {
        id: 'msg-2109-1',
        from: 'business',
        author: 'Adwoa Serwaa',
        body: 'Exporting the full guest list stops at 40%. We need it for the Friday activation.',
        at: '2026-09-17T15:48:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2102',
    subject: 'Need a second sender ID for SMS',
    businessId: 'biz-ridge',
    category: 'access',
    priority: 'low',
    status: 'waiting',
    assignee: 'unassigned',
    createdAt: '2026-09-15T13:20:00.000Z',
    updatedAt: '2026-09-16T10:00:00.000Z',
    messages: [
      {
        id: 'msg-2102-1',
        from: 'business',
        author: 'Kofi Mensah',
        body: 'Can we add RIDGELEGAL as a second SMS name? The current one is used for reminders only.',
        at: '2026-09-15T13:20:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2094',
    subject: 'Low credit warning came too late',
    businessId: 'biz-volta',
    category: 'credits',
    priority: 'low',
    status: 'resolved',
    assignee: 'efua',
    createdAt: '2026-09-12T09:00:00.000Z',
    updatedAt: '2026-09-13T11:26:00.000Z',
    messages: [
      {
        id: 'msg-2094-1',
        from: 'business',
        author: 'Selorm Agbeko',
        body: 'The low-credit mail arrived after a campaign had already failed. Can warnings go out at 200 credits?',
        at: '2026-09-12T09:00:00.000Z',
      },
      {
        id: 'msg-2094-2',
        from: 'admin',
        author: 'Efua Mensah',
        body: 'Agreed. I set the alert at 200 for Volta Studio and noted this for the platform default.',
        at: '2026-09-13T11:26:00.000Z',
      },
    ],
  },
];

let tickets = SEED_TICKETS.map((item) => ({
  ...item,
  messages: item.messages.map((message) => ({ ...message })),
}));

export function getTickets() {
  return tickets;
}

export function getTicket(id) {
  return tickets.find((item) => item.id === id) ?? null;
}

export function labelFor(list, id) {
  return list.find((item) => item.id === id)?.label ?? id;
}

export function ticketMeta(list, id) {
  return list.find((item) => item.id === id) ?? list[0];
}

export function addTicket({ businessId, category, priority, subject, body, author = 'Admin' }) {
  const now = new Date().toISOString();
  const ticket = {
    id: `tkt-${2141 + tickets.length}`,
    subject: subject.trim(),
    businessId,
    category,
    priority,
    status: 'open',
    assignee: 'unassigned',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg-${Date.now()}`,
        from: 'admin',
        author,
        body: body.trim(),
        at: now,
      },
    ],
  };
  tickets = [ticket, ...tickets];
  return ticket;
}

export function replyToTicket(id, { body, author = 'Admin' }) {
  const ticket = getTicket(id);
  if (!ticket) return null;
  const now = new Date().toISOString();
  ticket.messages.push({
    id: `msg-${Date.now()}`,
    from: 'admin',
    author,
    body: body.trim(),
    at: now,
  });
  ticket.updatedAt = now;
  if (ticket.status === 'open') ticket.status = 'in-progress';
  return ticket;
}

export function updateTicket(id, changes) {
  const ticket = getTicket(id);
  if (!ticket) return null;
  Object.assign(ticket, changes, { updatedAt: new Date().toISOString() });
  return ticket;
}

export function formatTicketWhen(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export const TICKET_REPORTS = [
  { id: 'sales', label: 'Sales Request' },
  { id: 'issues', label: 'Issues & Support' },
];

const REPORT_FACTOR = { '7d': 0.28, '30d': 1, '90d': 2.4 };
const REPORT_DAYS = ['16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'];

function scaleReport(values, factor) {
  return values.map((value) => Math.max(1, Math.round(value * factor)));
}

export function buildTicketReports(rangeId = '30d') {
  const factor = REPORT_FACTOR[rangeId] ?? 1;
  return {
    sales: [
      {
        id: 'sales-daily',
        title: 'Daily sales request',
        subtitle: 'Track daily sales request volume',
        unit: 'requests',
        color: '#2563EB',
        labels: REPORT_DAYS,
        values: scaleReport([210, 140, 80, 220, 215, 218, 212, 208, 205, 220], factor),
      },
      {
        id: 'sales-mom',
        title: 'Month-over-month comparison',
        subtitle: 'Month-over-month sales request growth',
        unit: 'requests',
        labels: REPORT_DAYS,
        series: [
          { id: 'current', label: 'Current', color: '#EAB308', values: scaleReport([210, 155, 90, 80, 215, 150, 155, 150, 148, 155], factor) },
          { id: 'past', label: 'Past', color: '#F97316', values: scaleReport([150, 155, 148, 95, 88, 155, 150, 148, 145, 155], factor) },
        ],
      },
      {
        id: 'sales-close',
        title: 'Sales request to close rate',
        subtitle: 'Monitor sales request to close rate over time',
        unit: 'closed',
        labels: REPORT_DAYS,
        series: [
          { id: 'current', label: 'Current', color: '#1D4ED8', values: scaleReport([220, 110, 85, 218, 210, 215, 218, 212, 210, 212], factor) },
          { id: 'past', label: 'Past', color: '#93C5FD', values: scaleReport([155, 150, 148, 95, 155, 152, 155, 150, 152, 150], factor) },
        ],
      },
    ],
    issues: [
      {
        id: 'issues-daily',
        title: 'Daily issues & support',
        subtitle: 'Track daily issues and support volume',
        unit: 'tickets',
        color: '#EF4444',
        labels: REPORT_DAYS,
        values: scaleReport([230, 140, 90, 228, 230, 225, 228, 222, 218, 230], factor),
      },
      {
        id: 'issues-mom',
        title: 'Month-over-month comparison',
        subtitle: 'Month-over-month issues and support growth',
        unit: 'tickets',
        labels: REPORT_DAYS,
        series: [
          { id: 'current', label: 'Current', color: '#1D4ED8', values: scaleReport([230, 140, 90, 80, 228, 155, 228, 150, 148, 228], factor) },
          { id: 'past', label: 'Past', color: '#93C5FD', values: scaleReport([155, 150, 148, 95, 88, 155, 150, 148, 145, 155], factor) },
        ],
      },
      {
        id: 'issues-close',
        title: 'Issues & support to close rate',
        subtitle: 'Monitor issues and support ticket to close rate over time',
        unit: 'closed',
        labels: REPORT_DAYS,
        series: [
          { id: 'current', label: 'Current', color: '#9F1239', values: scaleReport([230, 135, 88, 228, 225, 150, 228, 148, 225, 228], factor) },
          { id: 'past', label: 'Past', color: '#1E3A8A', values: scaleReport([160, 155, 148, 95, 155, 152, 155, 150, 152, 155], factor) },
        ],
      },
    ],
  };
}

export function buildTicketAnalytics(rows) {
  const open = rows.filter((item) => item.status === 'open').length;
  const progress = rows.filter((item) => item.status === 'in-progress').length;
  const waiting = rows.filter((item) => item.status === 'waiting').length;
  const resolved = rows.filter((item) => item.status === 'resolved').length;
  return {
    cards: [
      { id: 'open', label: 'Open', value: String(open), accent: '#2563EB', share: rows.length ? Math.round((open / rows.length) * 100) : 0, detail: 'Needs a first reply' },
      { id: 'in-progress', label: 'In progress', value: String(progress), accent: '#D97706', share: rows.length ? Math.round((progress / rows.length) * 100) : 0, detail: 'Being worked' },
      { id: 'waiting', label: 'Waiting', value: String(waiting), accent: '#7C3AED', share: rows.length ? Math.round((waiting / rows.length) * 100) : 0, detail: 'Awaiting the business' },
      { id: 'resolved', label: 'Resolved', value: String(resolved), accent: '#157A42', share: rows.length ? Math.round((resolved / rows.length) * 100) : 0, detail: 'Closed this period' },
    ],
    charts: [
      {
        id: 'opened',
        title: 'Tickets opened',
        subtitle: 'New business requests by week',
        unit: 'tickets',
        color: '#2563EB',
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        values: [6, 9, 7, 11, 8, 12],
      },
      {
        id: 'resolved',
        title: 'Tickets resolved',
        subtitle: 'Closed after an admin reply',
        unit: 'tickets',
        color: '#16A34A',
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        values: [4, 6, 5, 8, 7, 9],
      },
      {
        id: 'category',
        title: 'Volume by category',
        subtitle: 'Where businesses need help',
        unit: 'tickets',
        labels: TICKET_CATEGORIES.map((item) => item.label),
        series: [
          {
            id: 'openish',
            label: 'Open or waiting',
            color: '#2563EB',
            values: TICKET_CATEGORIES.map((item) => rows.filter((row) => row.category === item.id && row.status !== 'resolved').length || 1),
          },
          {
            id: 'done',
            label: 'Resolved',
            color: '#93C5FD',
            values: TICKET_CATEGORIES.map((item) => rows.filter((row) => row.category === item.id && row.status === 'resolved').length),
          },
        ],
      },
      {
        id: 'resolution',
        title: 'Average resolution',
        subtitle: 'Hours from first message to resolved',
        unit: 'hours',
        color: '#0B1354',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [18, 14, 16, 12, 15, 22, 20],
      },
    ],
  };
}
