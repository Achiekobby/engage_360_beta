import { useEffect, useMemo, useRef, useState } from 'react';
import BusinessesPagination from './BusinessesPagination';
import AnimatedModal from '../motion/AnimatedModal';
import { PageBackLink } from '../layout/PageBackLink';
import {
  ArrowUpDown,
  Calendar,
  Check,
  Database,
  Download,
  Eye,
  Folder,
  Home,
  ListFilter,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Receipt,
  Search,
  StickyNote,
  Tag,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';

export const BUSINESS_SECTIONS = [
  { id: 'profile', label: 'Business Profile', icon: Home },
  { id: 'credit', label: 'Credit History', icon: Receipt },
  { id: 'customers', label: 'Customer Base', icon: Users },
];

const DATE_RANGES = [
  { id: 'all', label: 'All dates', days: null },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: '90', label: 'Last 90 days', days: 90 },
];

const CREDIT_CHANNELS = {
  sms: {
    stats: [
      { label: 'Lifetime Summary (Sent)', value: '526k', badge: '10.5% Last 30 days' },
      { label: 'Total Allocation (Credits)', value: '52k', badge: '10k SMS expires 3-06-26' },
      { label: 'Active Consumption (Used)', value: '52k', badge: '10.5% High consumption rate' },
    ],
    groups: [
      {
        date: '2026-01-12',
        label: '12th January 2026',
        items: [
          { id: 'sms-1', amountPaid: 200, creditReceived: 200, time: '7:00AM' },
          { id: 'sms-2', amountPaid: 200, creditReceived: 200, time: '7:00AM' },
          { id: 'sms-3', amountPaid: 200, creditReceived: 200, time: '7:00AM' },
          { id: 'sms-4', amountPaid: 200, creditReceived: 200, time: '8:15AM' },
          { id: 'sms-5', amountPaid: 200, creditReceived: 200, time: '9:40AM' },
          { id: 'sms-6', amountPaid: 200, creditReceived: 200, time: '11:05AM' },
        ],
      },
    ],
  },
  email: {
    stats: [
      { label: 'Lifetime Summary (Sent)', value: '184k', badge: '6.2% Last 30 days' },
      { label: 'Total Allocation (Credits)', value: '18k', badge: '4k Email expires 3-06-26' },
      { label: 'Active Consumption (Used)', value: '17k', badge: '8.1% High consumption rate' },
    ],
    groups: [
      {
        date: '2026-02-04',
        label: '4th February 2026',
        items: [
          { id: 'email-1', amountPaid: 150, creditReceived: 500, time: '9:30AM' },
          { id: 'email-2', amountPaid: 150, creditReceived: 500, time: '2:15PM' },
          { id: 'email-3', amountPaid: 150, creditReceived: 500, time: '3:00PM' },
          { id: 'email-4', amountPaid: 150, creditReceived: 500, time: '4:20PM' },
          { id: 'email-5', amountPaid: 150, creditReceived: 500, time: '5:10PM' },
          { id: 'email-6', amountPaid: 150, creditReceived: 500, time: '6:45PM' },
        ],
      },
    ],
  },
};

const CUSTOMER_COLLECTIONS = [
  {
    id: 'col-1',
    name: 'DealBoxx Promotion',
    category: 'Promotion',
    files: 12,
    customers: '12k',
    created: '2026-06-12',
    createdLabel: '12-06-26',
  },
  {
    id: 'col-2',
    name: 'DealBoxx Promotion',
    category: 'Promotion',
    files: 12,
    customers: '12k',
    created: '2026-06-12',
    createdLabel: '12-06-26',
  },
  {
    id: 'col-3',
    name: 'DealBoxx Promotion',
    category: 'Promotion',
    files: 12,
    customers: '12k',
    created: '2026-06-12',
    createdLabel: '12-06-26',
  },
  {
    id: 'col-4',
    name: 'Welcome Series',
    category: 'Onboarding',
    files: 4,
    customers: '3.2k',
    created: '2026-03-02',
    createdLabel: '02-03-26',
  },
  {
    id: 'col-5',
    name: 'DealBoxx Promotion',
    category: 'Promotion',
    files: 12,
    customers: '12k',
    created: '2026-06-12',
    createdLabel: '12-06-26',
  },
  {
    id: 'col-6',
    name: 'Welcome Series',
    category: 'Onboarding',
    files: 4,
    customers: '3.2k',
    created: '2026-03-02',
    createdLabel: '02-03-26',
  },
];

const COLLECTION_GROUPS = CUSTOMER_COLLECTIONS.flatMap((collection) =>
  [1, 2, 3, 4, 5, 6].map((index) => ({
    id: `${collection.id}-group-${index}`,
    collectionId: collection.id,
    name: 'New Customers',
    customers: '15k',
    created: '2026-06-12',
    createdLabel: '12-06-26, 7:00am',
  })),
);

const CUSTOMER_TYPES = [
  'Corporate',
  'Individual',
  'Retailer',
  'Wholesaler',
  'Individual',
  'Individual',
  'Corporate',
  'Corporate',
  'Retailer',
  'Wholesaler',
  'Individual',
  'Corporate',
];

const TABLE_PAGE_SIZE = 5;

const CUSTOMER_ROWS = CUSTOMER_TYPES.map((customerType, index) => ({
  id: `customer-${index + 1}`,
  fullName: 'George Arthur',
  productNumber: '233546477448',
  email: 'info@dealboxx.com',
  region: 'Greater Accra',
  city: 'Abelemkpe',
  whatsapp: '233546477448',
  phone: '233545165001',
  customerType,
  interest: 'Electronic & Gadgets',
  subcategory: 'Computing',
  registered: '12/01/26, 7:00AM',
  gender: index % 2 === 0 ? 'Male' : 'Female',
  loyalty: 'Loyal Customer',
  profileComplete: 80,
  customerSince: 'Oct 2024',
  notes: [
    {
      id: `note-${index + 1}-1`,
      title: 'Note 1',
      date: '12-06-2026',
      body: 'Five years of passion for graphic design. I am a graphic designer who can take care of your website from scratch to the advanced stage, from theme customizations with unique features.',
    },
  ],
}));

const CUSTOMER_COLUMNS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'productNumber', label: 'Product Number' },
  { key: 'email', label: 'Email address' },
  { key: 'region', label: 'Region' },
  { key: 'city', label: 'City/Town' },
  { key: 'whatsapp', label: "What'sApp" },
  { key: 'customerType', label: 'Customer Type' },
  { key: 'interest', label: 'Interest Category' },
  { key: 'subcategory', label: 'Sub-category' },
  { key: 'registered', label: 'Registration Date' },
];

function pageOf(items, page) {
  const totalPages = Math.max(1, Math.ceil(items.length / TABLE_PAGE_SIZE));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * TABLE_PAGE_SIZE;
  return { current, totalPages, rows: items.slice(start, start + TABLE_PAGE_SIZE) };
}

function withinRange(isoDate, rangeId) {
  const range = DATE_RANGES.find((item) => item.id === rangeId);
  if (!range?.days) return true;
  const then = new Date(isoDate).getTime();
  const cutoff = Date.now() - range.days * 86_400_000;
  return then >= cutoff;
}

function downloadReceipt(businessName, item, channel) {
  const lines = [
    `Receipt ${item.id}`,
    `Business: ${businessName}`,
    `Channel: ${channel.toUpperCase()}`,
    `Amount paid: ${item.amountPaid}`,
    `Credit received: ${item.creditReceived}`,
    `Purchase time: ${item.time}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${item.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function MetricCard({ label, value, badge, tone = 'info' }) {
  return (
    <article className="rounded-2xl border border-[#E6EEF8] bg-white px-4 py-4">
      <p className="text-sm text-[#717171]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1354]">{value}</p>
      <span
        className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          tone === 'warning' ? 'bg-[#FDE8F0] text-[#BE185D]' : 'bg-[#EFF6FF] text-primary'
        }`}
      >
        <TrendingUp className="h-3 w-3" aria-hidden="true" />
        {badge}
      </span>
    </article>
  );
}

function SearchField({ value, onChange, label }) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search"
        className="w-full rounded-full border border-[#E4E4E7] bg-white py-2 pl-9 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function DateFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = DATE_RANGES.find((item) => item.id === value) ?? DATE_RANGES[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center rounded-xl border border-primary/40 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {selected.id === 'all' ? 'Date Filter' : selected.label}
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Date range"
          className="absolute right-0 z-20 mt-2 w-44 admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white py-1 shadow-[0_12px_32px_rgba(11,19,84,0.12)]"
        >
          {DATE_RANGES.map((range) => (
            <li key={range.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === range.id}
                onClick={() => {
                  onChange(range.id);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer px-3 py-2 text-left text-sm ${
                  value === range.id ? 'bg-[#EFF6FF] font-semibold text-primary' : 'text-[#0B1354] hover:bg-[#F8FAFC]'
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function BusinessSectionNav({ section, onChange }) {
  return (
    <div role="tablist" aria-label="Business sections" className="flex gap-6 overflow-x-auto border-t border-[#F0F2F7] px-4 sm:px-5">
      {BUSINESS_SECTIONS.map((tab) => {
        const Icon = tab.icon;
        const selected = section === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`business-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`business-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2 py-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              selected ? 'font-semibold text-primary' : 'font-medium text-[#717171] hover:text-[#0B1354]'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {tab.label}
            {selected ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function PageHeader({ title, description, actions, children }) {
  return (
    <header className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight text-[#0B1354]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#717171]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div> : null}
      </div>
      {children ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-[#F0F2F7] pt-4 sm:flex-row sm:items-center">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function CreditHistoryPanel({ business }) {
  const [channel, setChannel] = useState('sms');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('all');
  const [page, setPage] = useState(1);
  const channelData = CREDIT_CHANNELS[channel];
  const balance = (business.creditBalance ?? 0).toLocaleString('en-GB');
  const needle = query.trim().toLowerCase();

  const purchases = useMemo(
    () =>
      channelData.groups
        .filter((group) => withinRange(group.date, range))
        .flatMap((group) =>
          group.items
            .filter((item) => {
              if (!needle) return true;
              return [group.label, item.amountPaid, item.creditReceived, item.time, channel, 'credit']
                .join(' ')
                .toLowerCase()
                .includes(needle);
            })
            .map((item) => ({ ...item, dateLabel: group.label })),
        ),
    [channel, channelData.groups, needle, range],
  );
  const filterKey = `${channel}|${needle}|${range}`;
  const [trackedFilter, setTrackedFilter] = useState(filterKey);
  if (trackedFilter !== filterKey) {
    setTrackedFilter(filterKey);
    setPage(1);
  }
  const paged = pageOf(purchases, page);

  return (
    <div
      role="tabpanel"
      id="business-panel-credit"
      aria-labelledby="business-tab-credit"
      className="min-w-0 space-y-5"
    >
      <PageHeader
        title="Credit History"
        description={`Purchases and remaining balance for ${business.companyName}`}
        actions={
          <div className="inline-flex rounded-full bg-[#EFF6FF] p-1" role="group" aria-label="Credit channel">
            {[
              ['sms', 'SMS'],
              ['email', 'Email'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={channel === id}
                onClick={() => setChannel(id)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  channel === id ? 'bg-white text-primary shadow-sm' : 'text-primary/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      >
        <div className="min-w-0 sm:max-w-sm sm:flex-1">
          <SearchField value={query} onChange={setQuery} label="Search credit history" />
        </div>
        <DateFilter value={range} onChange={setRange} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {channelData.stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
        <MetricCard
          label="Available Balance (Remaining)"
          value={balance}
          badge="10.5% Low balance"
          tone="warning"
        />
      </div>

      <div className="admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
                {['Date', 'Channel', 'Amount paid', 'Credit received', 'Purchase time', 'Action'].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#717171]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#717171]">
                    No credit purchases match this view.
                  </td>
                </tr>
              ) : (
                paged.rows.map((item) => (
                  <tr key={item.id} className="border-b border-[#F4F5F8] text-[#3F3F46] last:border-b-0">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#0B1354]">{item.dateLabel}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold uppercase text-primary">
                        <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                        {channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0B1354]">{item.amountPaid}</td>
                    <td className="px-4 py-3 font-semibold text-[#0B1354]">{item.creditReceived}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.time}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => downloadReceipt(business.companyName, item, channel)}
                        className="inline-flex cursor-pointer items-center gap-1.5 admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={purchases.length}
        pageSize={TABLE_PAGE_SIZE}
        onPageChange={setPage}
        label="Credit history pages"
      />
    </div>
  );
}

function BackButton({ onClick }) {
  return <PageBackLink onClick={onClick} />;
}

function CollectionGroups({ collection, groups, onBack, onDelete, onViewCustomers }) {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('all');
  const [page, setPage] = useState(1);
  const needle = query.trim().toLowerCase();
  const visible = groups.filter((item) => {
    if (item.collectionId !== collection.id) return false;
    if (!withinRange(item.created, range)) return false;
    if (!needle) return true;
    return [item.name, item.customers, item.createdLabel].join(' ').toLowerCase().includes(needle);
  });
  const paged = pageOf(visible, page);

  useEffect(() => {
    setPage(1);
  }, [needle, range]);

  return (
    <div className="space-y-5">
      <PageHeader
        title={collection.name}
        description="Customer groups in this collection"
        actions={
          <>
            <DateFilter value={range} onChange={setRange} />
            <BackButton onClick={onBack} />
          </>
        }
      >
        <SearchField value={query} onChange={setQuery} label={`Search groups in ${collection.name}`} />
      </PageHeader>

      <div className="admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
                {['Group', 'Overall customers', 'Date created', 'Action'].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#717171]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[#717171]">
                    No customer groups match this view.
                  </td>
                </tr>
              ) : (
                paged.rows.map((item) => (
                  <tr key={item.id} className="border-b border-[#F4F5F8] text-[#3F3F46] last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-3 font-semibold text-[#0B1354]">
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
                          <Database className="h-4 w-4" aria-hidden="true" />
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white ring-2 ring-white">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                          </span>
                        </span>
                        {item.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0B1354]">{item.customers}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.createdLabel}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#717171] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewCustomers(item)}
                          className="inline-flex cursor-pointer items-center gap-1.5 admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          View Customers
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={visible.length}
        pageSize={TABLE_PAGE_SIZE}
        onPageChange={setPage}
        label="Customer group pages"
      />
    </div>
  );
}

function ProfileRing({ value }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`${value}% profile complete`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E0E7FF" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-[18%] flex flex-col items-center justify-center text-center">
        <span className="text-xl font-extrabold leading-none text-primary">{value}%</span>
  
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#717171]">{label}</p>
        <div className="mt-0.5 text-sm font-bold text-[#0B1354]">{children}</div>
      </div>
    </div>
  );
}

function CustomerProfileDialog({ customer, onClose, onSave }) {
  const [editing, setEditing] = useState(false);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState({
    phone: customer.phone,
    email: customer.email,
    whatsapp: customer.whatsapp,
  });
  const [memo, setMemo] = useState('');
  const titleId = 'customer-profile-title';

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setDraft({ phone: customer.phone, email: customer.email, whatsapp: customer.whatsapp });
    setEditing(false);
    setWriting(false);
    setMemo('');
  }, [customer]);

  const saveDetails = () => {
    onSave({ ...customer, ...draft });
    setEditing(false);
  };

  const addNote = () => {
    const body = memo.trim();
    if (!body) return;
    const nextIndex = customer.notes.length + 1;
    onSave({
      ...customer,
      notes: [
        {
          id: `${customer.id}-note-${Date.now()}`,
          title: `Note ${nextIndex}`,
          date: '23-09-2026',
          body,
        },
        ...customer.notes,
      ],
    });
    setMemo('');
    setWriting(false);
  };

  return (
    <AnimatedModal
      isOpen
      onClose={onClose}
      labelledBy={titleId}
      panelClassName="relative z-10 flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(11,19,84,0.18)]"
    >
      <header className="shrink-0 border-b border-[#F0F2F7] px-6 py-4 sm:px-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#0B1354] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Close profile"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center justify-between gap-4 pr-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-[#0B1354]">
                {customer.fullName}
              </h2>
              <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#92400E]">
                {customer.loyalty}
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#52525B]">
              <MapPin className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
              {customer.region} | {customer.city}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#52525B]">
              <User className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
              {customer.gender}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setWriting((current) => !current);
              setEditing(false);
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Write Notes
          </button>
          {editing ? (
            <button
              type="button"
              onClick={saveDetails}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Save Details
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setWriting(false);
              }}
              className="inline-flex cursor-pointer items-center gap-2 admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              Edit Details
            </button>
          )}
            </div>
          </div>
          <ProfileRing value={customer.profileComplete} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#EEF0F4] sm:grid-cols-2">
          <ProfileField icon={Phone} label="Phone number">
            {editing ? (
              <input
                value={draft.phone}
                onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-lg border border-[#E4E4E7] px-2 py-1 text-sm font-semibold text-[#0B1354] outline-none focus:border-primary"
                aria-label="Phone number"
              />
            ) : (
              customer.phone
            )}
          </ProfileField>
          <ProfileField icon={Calendar} label="Customer since">
            {customer.customerSince}
          </ProfileField>
          <ProfileField icon={Mail} label="Email Address">
            {editing ? (
              <input
                value={draft.email}
                onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-lg border border-[#E4E4E7] px-2 py-1 text-sm font-semibold text-[#0B1354] outline-none focus:border-primary"
                aria-label="Email address"
              />
            ) : (
              customer.email
            )}
          </ProfileField>
          <ProfileField icon={MessageCircle} label="WhatsApp Number">
            {editing ? (
              <input
                value={draft.whatsapp}
                onChange={(event) => setDraft((current) => ({ ...current, whatsapp: event.target.value }))}
                className="w-full rounded-lg border border-[#E4E4E7] px-2 py-1 text-sm font-semibold text-[#0B1354] outline-none focus:border-primary"
                aria-label="WhatsApp number"
              />
            ) : (
              customer.whatsapp
            )}
          </ProfileField>
          <ProfileField icon={Tag} label="Category">
            {customer.interest}
          </ProfileField>
          <ProfileField icon={Tag} label="Sub-Category">
            {customer.subcategory}
          </ProfileField>
        </div>

        {writing ? (
          <form
            className="mt-4 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              addNote();
            }}
          >
            <label className="block text-xs font-semibold text-[#717171]" htmlFor="customer-memo">
              New memo
            </label>
            <textarea
              id="customer-memo"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#E4E4E7] px-3 py-2 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Write a note about this customer"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Save Note
            </button>
          </form>
        ) : null}

        <div className="mt-4 space-y-3">
          {customer.notes.map((note) => (
            <article key={note.id} className="rounded-2xl border border-[#EEF0F4] bg-[#F8F9FC] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1354]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary">
                    <StickyNote className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {note.title}
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-[#717171]">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {note.date}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#717171]">{note.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E4E4E7] px-8 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Close
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}

function CustomerTable({ group, onBack }) {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(CUSTOMER_ROWS);
  const [selected, setSelected] = useState(() => new Set());
  const [sort, setSort] = useState({ key: 'fullName', dir: 'asc' });
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);
  const needle = query.trim().toLowerCase();
  const types = [...new Set(CUSTOMER_ROWS.map((row) => row.customerType))];
  const regions = [...new Set(CUSTOMER_ROWS.map((row) => row.region))];

  useEffect(() => {
    if (!filtersOpen && !menuId) return undefined;
    const onPointer = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setFiltersOpen(false);
      if (!event.target.closest?.('[data-row-menu]')) setMenuId(null);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [filtersOpen, menuId]);

  const visible = useMemo(() => {
    const filtered = rows.filter((row) => {
      if (typeFilter !== 'all' && row.customerType !== typeFilter) return false;
      if (regionFilter !== 'all' && row.region !== regionFilter) return false;
      if (!needle) return true;
      return CUSTOMER_COLUMNS.some((column) => String(row[column.key]).toLowerCase().includes(needle));
    });
    const sorted = [...filtered].sort((left, right) => {
      const result = String(left[sort.key]).localeCompare(String(right[sort.key]), undefined, { numeric: true });
      return sort.dir === 'asc' ? result : -result;
    });
    return sorted;
  }, [needle, regionFilter, rows, sort.dir, sort.key, typeFilter]);
  const paged = pageOf(visible, page);
  const profile = rows.find((row) => row.id === profileId) ?? null;

  useEffect(() => {
    setPage(1);
  }, [needle, regionFilter, typeFilter]);

  const toggleSort = (key) => {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    );
  };

  const toggleSelected = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exportRows = () => {
    const header = CUSTOMER_COLUMNS.map((column) => column.label).join(',');
    const body = visible
      .map((row) => CUSTOMER_COLUMNS.map((column) => `"${String(row[column.key]).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${group.name.replaceAll(' ', '-').toLowerCase()}-customers.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={group.name}
        description="Customers in this group"
        actions={<BackButton onClick={onBack} />}
      >
        <div className="min-w-0 sm:max-w-sm sm:flex-1">
          <SearchField value={query} onChange={setQuery} label={`Search customers in ${group.name}`} />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => {
              setRows((current) => current.filter((row) => !selected.has(row.id)));
              setSelected(new Set());
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-[#717171] transition-colors hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <ListFilter className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            {filtersOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-56 space-y-3 admin-card rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_12px_32px_rgba(11,19,84,0.12)]">
                <label className="block text-xs font-semibold text-[#717171]">
                  Customer type
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-2 py-1.5 text-sm font-medium text-[#0B1354]"
                  >
                    <option value="all">All types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-[#717171]">
                  Region
                  <select
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-2 py-1.5 text-sm font-medium text-[#0B1354]"
                  >
                    <option value="all">All regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={exportRows}
            className="inline-flex cursor-pointer items-center gap-1.5 admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </button>
        </div>
      </PageHeader>

      <div className="overflow-x-auto admin-card rounded-2xl border border-[#EEF0F4] bg-white">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC] text-xs font-semibold uppercase tracking-wider text-[#717171]">
              <th className="w-10 px-3 py-3">
                <span className="sr-only">Select</span>
              </th>
              {CUSTOMER_COLUMNS.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-3 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap hover:text-[#0B1354]"
                  >
                    {column.label}
                    <ArrowUpDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </button>
                </th>
              ))}
              <th className="whitespace-nowrap px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.length === 0 ? (
              <tr>
                <td colSpan={CUSTOMER_COLUMNS.length + 2} className="px-3 py-10 text-center text-[#717171]">
                  No customers match this view.
                </td>
              </tr>
            ) : (
              paged.rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F4F5F8] text-[#3F3F46] last:border-b-0">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelected(row.id)}
                      aria-label={`Select ${row.fullName}`}
                      className="h-4 w-4 rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
                    />
                  </td>
                  {CUSTOMER_COLUMNS.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-3 py-3">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="relative px-3 py-3" data-row-menu>
                    <button
                      type="button"
                      aria-label={`Actions for ${row.fullName}`}
                      aria-expanded={menuId === row.id}
                      onClick={() => setMenuId((current) => (current === row.id ? null : row.id))}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#717171] hover:bg-[#F4F4F5] hover:text-[#0B1354]"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {menuId === row.id ? (
                      <div className="absolute right-3 top-10 z-10 w-36 admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileId(row.id);
                            setMenuId(null);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-medium text-[#0B1354] hover:bg-[#EFF6FF] hover:text-primary"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRows((current) => current.filter((item) => item.id !== row.id));
                            setMenuId(null);
                            setProfileId((current) => (current === row.id ? null : current));
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={visible.length}
        pageSize={TABLE_PAGE_SIZE}
        onPageChange={setPage}
        label="Customer pages"
      />
      {profile ? (
        <CustomerProfileDialog
          customer={profile}
          onClose={() => setProfileId(null)}
          onSave={(next) => {
            setRows((current) => current.map((item) => (item.id === next.id ? next : item)));
          }}
        />
      ) : null}
    </div>
  );
}

export function CustomerBasePanel() {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('all');
  const [category, setCategory] = useState('all');
  const [collections, setCollections] = useState(CUSTOMER_COLLECTIONS);
  const [groups, setGroups] = useState(COLLECTION_GROUPS);
  const [screen, setScreen] = useState('list');
  const [collection, setCollection] = useState(null);
  const [group, setGroup] = useState(null);
  const [page, setPage] = useState(1);
  const categories = [...new Set(CUSTOMER_COLLECTIONS.map((item) => item.category))];
  const needle = query.trim().toLowerCase();

  const visible = collections.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!withinRange(item.created, range)) return false;
    if (!needle) return true;
    return [item.name, item.category, item.customers, item.createdLabel].join(' ').toLowerCase().includes(needle);
  });
  const paged = pageOf(visible, page);

  useEffect(() => {
    setPage(1);
  }, [needle, range, category]);

  if (screen === 'customers' && group) {
    return (
      <div
        role="tabpanel"
        id="business-panel-customers"
        aria-labelledby="business-tab-customers"
        className="min-w-0"
      >
        <CustomerTable
          key={group.id}
          group={group}
          onBack={() => {
            setScreen('groups');
            setGroup(null);
          }}
        />
      </div>
    );
  }

  if (screen === 'groups' && collection) {
    return (
      <div
        role="tabpanel"
        id="business-panel-customers"
        aria-labelledby="business-tab-customers"
        className="min-w-0"
      >
        <CollectionGroups
          collection={collection}
          groups={groups}
          onBack={() => {
            setScreen('list');
            setCollection(null);
          }}
          onDelete={(id) => setGroups((current) => current.filter((item) => item.id !== id))}
          onViewCustomers={(item) => {
            setGroup(item);
            setScreen('customers');
          }}
        />
      </div>
    );
  }

  return (
    <div
      role="tabpanel"
      id="business-panel-customers"
      aria-labelledby="business-tab-customers"
      className="min-w-0 space-y-5"
    >
      <PageHeader
        title="Customer Base"
        description="Collections for this business"
        actions={
          <>
            <label className="sr-only" htmlFor="customer-category">
              Category
            </label>
            <select
              id="customer-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="cursor-pointer admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-semibold text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="all">Category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </>
        }
      >
        <div className="min-w-0 sm:max-w-sm sm:flex-1">
          <SearchField value={query} onChange={setQuery} label="Search customer collections" />
        </div>
        <DateFilter value={range} onChange={setRange} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Customer Category" value="12" badge="10.5% Last 30 days" />
        <MetricCard label="Total Collection Files" value="20" badge="10.5% Last 30 days" />
        <MetricCard label="Customer Growth Rate" value="12%" badge="10.5% Last 30 days" />
        <MetricCard label="Total Customers" value="52k" badge="10.5% Last 30 days" />
      </div>

      <div className="admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
                {['Collection', 'Category', 'Files', 'Customers', 'Date created', 'Action'].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#717171]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#717171]">
                    No customer collections match this view.
                  </td>
                </tr>
              ) : (
                paged.rows.map((item) => (
                  <tr key={item.id} className="border-b border-[#F4F5F8] text-[#3F3F46] last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-3 font-semibold text-[#0B1354]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
                          <Folder className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {item.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.files}</td>
                    <td className="px-4 py-3 font-semibold text-[#0B1354]">{item.customers}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.createdLabel}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCollections((current) => current.filter((row) => row.id !== item.id))}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#717171] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCollection(item);
                            setScreen('groups');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={visible.length}
        pageSize={TABLE_PAGE_SIZE}
        onPageChange={setPage}
        label="Customer collection pages"
      />
    </div>
  );
}
