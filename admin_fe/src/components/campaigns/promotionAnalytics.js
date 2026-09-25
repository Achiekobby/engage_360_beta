import { CAMPAIGN_CATEGORIES, getPurchaseLogs } from './campaignData';

export const PROMO_RANGES = [
  { id: '30d', label: 'Last 30 days' },
  { id: '7d', label: 'Last 7 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'This year' },
  { id: 'lifetime', label: 'Lifetime' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct'];

const RANGE_FACTOR = { '7d': 0.42, '30d': 1, '90d': 1.65, ytd: 2.2, lifetime: 2.6 };

const SHAPES = {
  overall: [230, 130, 95, 75, 100, 155, 82, 185, 155, 235],
  active: [210, 130, 95, 80, 100, 150, 85, 180, 145, 225],
  expired: [215, 135, 100, 80, 115, 150, 85, 195, 150, 220],
  clicks: [70, 55, 40, 38, 52, 48, 42, 85, 70, 88],
  engagement: [80, 60, 48, 42, 70, 55, 50, 95, 72, 100],
  conversions: [55, 32, 22, 18, 28, 48, 22, 58, 42, 62],
  ctr: [88, 42, 38, 32, 48, 42, 38, 78, 62, 92],
  open: [42, 62, 38, 32, 48, 42, 38, 78, 62, 92],
};

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function series(shape, factor, cap) {
  return shape.map((value) => {
    const next = Math.round(value * factor);
    return cap != null ? Math.min(cap, next) : Math.max(0, next);
  });
}

function chart(id, title, subtitle, color, values, unit) {
  return { id, title, subtitle, color, values, labels: MONTHS, unit };
}

export function buildPromotionAnalytics(options) {
  return buildCategoryAnalytics({ ...options, categoryId: 'promotions' });
}

export function buildCategoryAnalytics({ campaigns, categoryId = 'promotions', businessId = 'all', rangeId = '30d' }) {
  const noun = CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId)?.label ?? 'Campaign';
  const rows = campaigns
    .filter((item) => item.category === categoryId)
    .filter((item) => businessId === 'all' || item.businessId === businessId);

  const active = rows.filter((item) => item.status === 'active' || item.status === 'scheduled');
  const expired = rows.filter((item) => item.status === 'expired' || item.status === 'completed');
  const sent = sum(rows, 'sent');
  const delivered = sum(rows, 'delivered');
  const clicked = sum(rows, 'clicked');
  const opened = sum(rows, 'opened');
  const conversions = rows
    .flatMap((item) => getPurchaseLogs(item))
    .filter((item) => item.status === 'Paid').length;

  const volume = (RANGE_FACTOR[rangeId] ?? 1) * (Math.max(rows.length, 1) / 8);
  const rate = RANGE_FACTOR[rangeId] ?? 1;
  const rangeLabel = PROMO_RANGES.find((item) => item.id === rangeId)?.label ?? 'Last 30 days';
  const unit = noun.toLowerCase();

  return {
    noun,
    rangeLabel,
    cards: [
      {
        id: 'overall',
        label: `Overall ${noun} Summary (Lifetime)`,
        value: rows.length,
        accent: '#8B5CF6',
      },
      {
        id: 'active',
        label: `Active ${noun}`,
        value: active.length,
        accent: '#F59E0B',
      },
      {
        id: 'expired',
        label: `Expired ${noun}`,
        value: expired.length,
        accent: '#FB7185',
      },
    ],
    overview: [
      chart(
        'overall',
        `Overall ${noun} Growth Trends`,
        `Changes in overall ${unit} distribution over time`,
        '#2563EB',
        series(SHAPES.overall, volume),
        unit,
      ),
      chart(
        'active',
        `Active ${noun} Growth Trends`,
        `Changes in active ${unit} distribution over time`,
        '#F59E0B',
        series(SHAPES.active, volume),
        unit,
      ),
      chart(
        'expired',
        `Expired ${noun} Growth Trends`,
        `Trends in expired ${unit} distribution over time`,
        '#FB7185',
        series(SHAPES.expired, volume),
        unit,
      ),
    ],
    engagement: [
      chart('clicks', 'Clicks Growth Trends', 'Changes in clicks over time', '#2563EB', series(SHAPES.clicks, volume * (clicked / 4000 || 1)), 'clicks'),
      chart('engagement', 'Engagement Growth Trends', 'Changes in engagement distribution over time', '#FBBF24', series(SHAPES.engagement, volume), 'engagement'),
      chart('conversions', 'Conversions Growth Trends', 'Expansion trends on conversions', '#22C55E', series(SHAPES.conversions, volume * (conversions / 20 || 1)), 'conversions'),
      chart('ctr', 'Click-through-rate Growth Trends', 'Changes in click-through-rate over time', '#60A5FA', series(SHAPES.ctr, rate, 100), '%'),
      chart('open', 'Open Rate Growth Trends', 'Open rate in respective metrics over time', '#1E3A8A', series(SHAPES.open, opened ? rate : rate * 0.35, 100), '%'),
    ],
    totals: { sent, delivered, clicked, opened, conversions },
  };
}
