import { useMemo, useRef, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { BarChart3, Check, Eye, FileText, Link2, Receipt } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import {
  DeliveryDoughnutChart,
  FunnelChart,
  HorizontalRatesChart,
  TrendLineChart,
  VerticalBarChart,
} from '../../components/automations/AnalyticsCharts';
import AnalyticsMetricCard from '../../components/automations/AnalyticsMetricCard';
import { PageHeading } from '../../components/layout/PageBackLink';
import { springTransition, stepTransition } from '../../components/motion/motionPresets';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_CHANNELS,
  campaignAnalytics,
  campaignBrief,
  getCampaign,
  labelFor,
  statusMeta,
} from '../../components/campaigns/campaignData';
import CampaignOverviewTab from '../../components/campaigns/CampaignOverviewTab';
import PurchaseLogsTab from '../../components/campaigns/PurchaseLogsTab';
import SalesCustomerView from '../../components/campaigns/SalesCustomerView';
import { BannerButton } from '../../components/media/ImageLightbox';

const TABS = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'overview', label: 'Campaign Overview', icon: FileText },
  { id: 'purchases', label: 'Purchase Logs', icon: Receipt },
];

function Section({ title, children, flush = false }) {
  return (
    <section
      className={clsx(
        flush
          ? 'space-y-3'
          : 'admin-card rounded-xl border border-[#EEF0F4] bg-white px-4 py-5 sm:px-5',
      )}
    >
      <div>
        <h2 className="text-base font-bold tracking-tight text-primary sm:text-lg">{title}</h2>
        <div className="mt-2 h-px w-full bg-[#9CA36C]/70" aria-hidden="true" />
      </div>
      <div className={flush ? undefined : 'mt-4'}>{children}</div>
    </section>
  );
}

function MetricRow({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <AnalyticsMetricCard
          key={item.id}
          label={item.label}
          value={item.display}
          tone={item.cardTone}
          compact
        />
      ))}
    </div>
  );
}

function AnalyticsTab({ campaign }) {
  const stats = useMemo(() => campaignAnalytics(campaign), [campaign]);

  return (
    <div className="mt-5 space-y-8">
      <Section title="Delivery & Message" flush>
        <MetricRow items={stats.delivery} />
      </Section>

      <Section title="Engagement & Conversion" flush>
        <MetricRow items={stats.engagement} />
      </Section>

      <section>
        <div>
          <h2 className="text-base font-bold tracking-tight text-primary sm:text-lg">
            Sales performance charts
          </h2>
          <div className="mt-2 h-px w-full bg-[#9CA36C]/70" aria-hidden="true" />
          <p className="mt-2 text-sm text-[#717171]">
            Delivery health, checkout outcomes, and conversion paths for this sales campaign.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <DeliveryDoughnutChart chart={stats.charts.deliveryMix} />
          <DeliveryDoughnutChart chart={stats.charts.paymentMix} />
          <FunnelChart chart={stats.charts.funnel} />
          <HorizontalRatesChart chart={stats.charts.rates} />
          <TrendLineChart chart={stats.charts.trend} />
          <VerticalBarChart chart={stats.charts.revenue} />
        </div>
      </section>
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
  const reduceMotion = useReducedMotion();
  const directionRef = useRef(1);

  if (!campaign) return <Navigate to="/campaigns" replace />;

  const requested = searchParams.get('tab');
  const tab = TABS.some((item) => item.id === requested) ? requested : 'overview';
  const business = businesses.find((item) => item.id === campaign.businessId);
  const meta = statusMeta(campaign.status);
  const brief = campaignBrief(campaign);
  const isSales = campaign.category === 'sales';
  const backTo = `/campaigns?category=${campaign.category}`;

  const setTab = (id) => {
    if (id !== tab) {
      const from = TABS.findIndex((item) => item.id === tab);
      const to = TABS.findIndex((item) => item.id === id);
      directionRef.current = to >= from ? 1 : -1;
    }
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

  const panel = {
    analytics: <AnalyticsTab campaign={campaign} />,
    overview: (
      <CampaignOverviewTab
        campaign={campaign}
        brief={brief}
        onCustomerView={() => setPreviewOpen(true)}
        onShare={share}
        copied={copied}
      />
    ),
    purchases: <PurchaseLogsTab campaign={campaign} />,
  }[tab];

  const offset = directionRef.current >= 0 ? 18 : -18;

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
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#3F3F46] hover:border-[#D4D4D8]"
            >
              <Eye className="h-3.5 w-3.5" />
              Customer view
            </button>
            <button
              type="button"
              onClick={share}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-sm font-medium text-[#3F3F46] hover:border-[#D4D4D8]"
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

      {previewOpen && !isSales ? (
        <div className="mt-4 max-w-sm admin-card rounded-xl border border-[#EEF0F4] bg-white p-4">
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

      {isSales ? (
        <SalesCustomerView
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          campaign={campaign}
          business={business}
        />
      ) : null}

      <div className="mt-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="Campaign detail sections"
          className="inline-flex min-w-max items-center gap-0.5 rounded-full border border-[#EEF0F4] bg-[#F4F5F7] p-1 shadow-[inset_0_1px_2px_rgba(11,19,84,0.04)]"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={clsx(
                  'relative shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200',
                  active ? 'text-white' : 'text-[#717171] hover:text-[#0B1354]',
                )}
              >
                {active && !reduceMotion ? (
                  <motion.span
                    layoutId="campaign-detail-tab-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_rgba(58,16,205,0.28)]"
                    transition={springTransition}
                  />
                ) : null}
                {active && reduceMotion ? (
                  <span className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_rgba(58,16,205,0.28)]" />
                ) : null}
                <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden">
        {reduceMotion ? (
          <div className="mt-1">{panel}</div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: offset, y: 6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -offset * 0.6, y: -4 }}
              transition={stepTransition}
            >
              {panel}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
