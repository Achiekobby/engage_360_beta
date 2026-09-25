import { useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Check,
  CheckCheck,
  CircleX,
  Clock,
  Eye,
  Link2,
  MailOpen,
  MousePointerClick,
  Send,
  ShoppingBag,
  UserCheck,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import { ChartTooltip, useChartFocus } from '../../components/charts/chartInteraction';
import { PageHeading } from '../../components/layout/PageBackLink';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_CHANNELS,
  campaignAnalytics,
  campaignBrief,
  formatCedi,
  formatCreatedDate,
  formatNumber,
  getCampaign,
  labelFor,
  statusMeta,
} from '../../components/campaigns/campaignData';
import PurchaseLogsTab from '../../components/campaigns/PurchaseLogsTab';
import { BannerButton } from '../../components/media/ImageLightbox';

const TABS = [
  { id: 'overview', label: 'Campaign Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'purchases', label: 'Purchase Logs' },
];

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#717171]">{label}</dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-[#0B1354]">{children || <span className="text-[#A1A1AA]">—</span>}</dd>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-[#EEF0F4] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(11,19,84,0.04)] sm:px-5">
      <h2 className="text-sm font-semibold tracking-tight text-[#0B1354]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const METRIC_ICONS = {
  launch: Send,
  reached: UserCheck,
  pending: Clock,
  delivered: CheckCheck,
  failed: CircleX,
  clicks: MousePointerClick,
  ctr: Activity,
  engagement: Activity,
  open: MailOpen,
  conversions: ShoppingBag,
};

const METRIC_TONE = {
  good: 'bg-[#E8F8EF] text-[#157A42]',
  alert: 'bg-[#FDECEC] text-[#C0272C]',
  warn: 'bg-[#FFF6E5] text-[#B45309]',
  bad: 'bg-[#FDECEC] text-[#C0272C]',
};

function AnalyticsTab({ campaign }) {
  const focus = useChartFocus();
  const stats = campaignAnalytics(campaign);

  const renderGrid = (rows) => (
    <div className="grid grid-cols-2 gap-3 overflow-visible lg:grid-cols-3">
      {rows.map((item) => {
        const Icon = METRIC_ICONS[item.id] ?? Send;
        const selected = focus.active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => focus.enter(item.id)}
            onMouseLeave={focus.leave}
            onFocus={() => focus.enter(item.id)}
            onBlur={focus.leave}
            onClick={() => focus.toggle(item.id)}
            className={clsx(
              'relative rounded-xl border bg-white px-4 py-4 text-left transition-colors',
              selected ? 'border-primary/30 bg-[#F8FAFF]' : 'border-[#EEF0F4] hover:border-[#D9DEE8]',
              focus.dim(item.id) && 'opacity-55',
            )}
          >
            <span className="flex items-center gap-2">
              <span className={clsx('inline-flex h-7 w-7 items-center justify-center rounded-lg', METRIC_TONE[item.tone])}>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <span className="text-xs font-medium text-[#717171]">{item.label}</span>
            </span>
            <span className="mt-3 block text-2xl font-semibold tabular-nums leading-none text-[#0B1354]">{item.display}</span>
            {selected ? (
              <span className="pointer-events-none absolute left-3 top-full z-20 mt-2">
                <ChartTooltip
                  title={item.label}
                  items={[
                    { label: 'Count', value: item.count },
                    { label: 'Note', value: item.detail },
                  ]}
                />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mt-5 space-y-4">
      <Section title="Delivery & Message">{renderGrid(stats.delivery)}</Section>
      <Section title="Engagement & Conversion">{renderGrid(stats.engagement)}</Section>
    </div>
  );
}

function OverviewTab({ campaign, brief }) {
  const messageLabel = `${labelFor(CAMPAIGN_CHANNELS, brief.channel)} message`;

  return (
    <div className="mt-5 space-y-4">
      <Section title="Message and primary asset">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <dl className="space-y-5">
            <Field label="Promotion channel">
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_CHANNELS.map((item) => {
                  const selected = item.id === brief.channel;
                  return (
                    <span
                      key={item.id}
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                        selected ? 'bg-[#EFF6FF] text-primary' : 'bg-[#F4F4F5] text-[#A1A1AA]',
                      )}
                    >
                      <span className={clsx('h-1.5 w-1.5 rounded-full', selected ? 'bg-primary' : 'bg-[#D4D4D8]')} />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </Field>
            <Field label={messageLabel}>
              <p className="max-w-2xl text-[#3F3F46]">{brief.message}</p>
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Title">{brief.title}</Field>
              <Field label="Call to action">{brief.callToAction}</Field>
              <Field label="Clear offer">{brief.offer}</Field>
              <Field label="Banner">
                <BannerButton src={brief.bannerUrl} alt={`${campaign.name} banner`} />
              </Field>
            </div>
            <Field label="Description">
              <p className="max-w-2xl text-[#3F3F46]">{brief.description}</p>
            </Field>
            <Field label="Attachment">{brief.attachment}</Field>
          </dl>
          <aside className="rounded-lg border border-[#EEF0F4] bg-white p-4">
            <p className="text-xs font-medium text-[#717171]">How it reads</p>
            <p className="mt-3 text-sm leading-relaxed text-[#0B1354]">{brief.message}</p>
            {brief.callToAction ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">{brief.callToAction}</p>
            ) : null}
          </aside>
        </div>
      </Section>

      <Section title="Promo visuals">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Voucher / promo code">{brief.voucher}</Field>
          <Field label="Image reference">{brief.promoImageRef}</Field>
          <Field label="Promo date">{formatCreatedDate(brief.promoDate)}</Field>
          <Field label="Expiry date">{formatCreatedDate(brief.expiryDate)}</Field>
          <Field label="Price">{formatCedi(brief.price)}</Field>
          <Field label="Discounted price">{formatCedi(brief.discountedPrice)}</Field>
        </dl>
      </Section>

      <Section title="Customer targeting">
        <dl>
          <Field label="Customer source">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {brief.source}
            </span>
          </Field>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Collection">{brief.collection}</Field>
            <Field label="Customer category">{brief.customerCategory}</Field>
            <Field label="New customers">{brief.newCustomers ? 'Yes' : 'No'}</Field>
            <Field label="Gender">{brief.gender}</Field>
            <Field label="Region">{brief.region}</Field>
            <Field label="Location">{brief.location}</Field>
            <Field label="Age">{brief.age}</Field>
          </div>
        </dl>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-lg border border-[#EEF0F4] bg-white px-3 py-3">
            <p className="text-xs text-[#717171]">Estimated reach</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[#0B1354]">{formatNumber(brief.estimatedReach)}</p>
          </div>
          <div className="rounded-lg border border-[#EEF0F4] bg-white px-3 py-3">
            <p className="text-xs text-[#717171]">Preferred reach</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[#0B1354]">{formatNumber(brief.preferredReach)}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const businesses = useAppSelector((state) => state.businesses.items);
  const campaign = getCampaign(campaignId);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!campaign) return <Navigate to="/campaigns" replace />;

  const requested = searchParams.get('tab');
  const tab = TABS.some((item) => item.id === requested) ? requested : 'overview';
  const business = businesses.find((item) => item.id === campaign.businessId);
  const meta = statusMeta(campaign.status);
  const brief = campaignBrief(campaign);
  const backTo = `/campaigns?category=${campaign.category}`;

  const setTab = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'overview') next.delete('tab');
    else next.set('tab', id);
    setSearchParams(next, { replace: true });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={campaign.name}
        description={`${business?.companyName ?? 'Business'} · ${labelFor(CAMPAIGN_CHANNELS, campaign.channel)} · ${labelFor(CAMPAIGN_CATEGORIES, campaign.category)}`}
        backTo={backTo}
        backLabel={labelFor(CAMPAIGN_CATEGORIES, campaign.category)}
        actions={
          <>
            <button
              type="button"
              onClick={() => setPreviewOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#3F3F46] hover:border-[#D4D4D8]"
            >
              <Eye className="h-3.5 w-3.5" />
              Customer view
            </button>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#3F3F46] hover:border-[#D4D4D8]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Share link'}
            </button>
            <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', meta.badge)}>
              {meta.label}
            </span>
          </>
        }
      />

      {previewOpen ? (
        <div className="mt-4 max-w-sm rounded-xl border border-[#EEF0F4] bg-white p-4">
          <p className="text-xs font-medium text-[#717171]">Customer view</p>
          {brief.bannerUrl ? (
            <div className="mt-3">
              <BannerButton src={brief.bannerUrl} alt={`${campaign.name} banner`} />
            </div>
          ) : null}
          <p className="mt-3 text-sm font-semibold text-[#0B1354]">{brief.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">{brief.message}</p>
          {brief.offer ? <p className="mt-3 text-sm font-medium text-primary">{brief.offer}</p> : null}
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto rounded-xl border border-[#EEF0F4] bg-white p-1.5 shadow-[0_1px_2px_rgba(11,19,84,0.04)]">
        <div role="tablist" className="flex min-w-max gap-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={clsx(
                'rounded-xl px-3.5 py-2 text-sm',
                tab === item.id ? 'bg-primary font-semibold text-white' : 'font-medium text-[#52525B] hover:bg-[#F4F7FB]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' ? <OverviewTab campaign={campaign} brief={brief} /> : null}

      {tab === 'analytics' ? <AnalyticsTab campaign={campaign} /> : null}

      {tab === 'purchases' ? <PurchaseLogsTab campaign={campaign} /> : null}
    </div>
  );
}
