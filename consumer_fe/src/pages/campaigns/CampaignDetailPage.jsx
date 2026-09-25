import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import MetricCard from '../../components/customer-engagement/dashboard/MetricCard';
import { ReportBarChart } from '../../components/customer-engagement/reports/ReportCharts';
import {
  MONTH_LABELS,
  scaleTrendData,
} from '../../components/customer-engagement/reports/reportsAnalyticsData';
import CampaignMobilePreview from '../../components/campaigns-module/CampaignMobilePreview';
import {
  CAMPAIGNS_BASE,
  CHANNEL_CARD_STYLES,
  getTemplateById,
  MOCK_CAMPAIGNS,
  STATUS_STYLES,
} from '../../components/campaigns-module/campaignsData';

const CHANNEL_TO_ID = {
  SMS: 'sms',
  Email: 'email',
  WhatsApp: 'whatsapp',
  Push: 'push',
  'Push Notification': 'push',
};

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const found =
    MOCK_CAMPAIGNS.find((item) => item.id === campaignId) ||
    (location.state?.newCampaign?.id === campaignId ? location.state.newCampaign : null);

  if (!found) {
    return (
      <main className="mx-auto max-w-8xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1354]">Campaign not found</h1>
        <button
          type="button"
          onClick={() => navigate(CAMPAIGNS_BASE)}
          className="mt-4 cursor-pointer text-sm font-semibold text-primary"
        >
          Back to campaigns
        </button>
      </main>
    );
  }

  const template = getTemplateById(found.templateId);
  const channelId = CHANNEL_TO_ID[found.channel] || 'sms';
  const isTemplate = found.route === 'template';

  const metrics = [
    {
      id: 'sent',
      label: 'Total Sent',
      value: found.audienceReach,
      change: 0.5,
      icon: 'users',
      accent: 'bg-[#EDE8F8] text-primary',
      bar: 'from-primary to-[#6B4FE0]',
    },
    {
      id: 'open',
      label: 'Open Rate',
      value: found.openRate,
      change: 0.5,
      icon: 'trending',
      accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
      bar: 'from-[#2E7DAD] to-[#5B9FD4]',
    },
    {
      id: 'click',
      label: 'Click Rate',
      value: found.clickRate,
      change: 0.5,
      icon: 'files',
      accent: 'bg-[#E8F8EF] text-[#1F9D55]',
      bar: 'from-[#1F9D55] to-[#34D399]',
    },
    {
      id: 'channel',
      label: 'Channel',
      value: found.channel,
      change: 0,
      icon: 'folderTree',
      accent: CHANNEL_CARD_STYLES[found.channel] || 'bg-[#FFF4E8] text-[#E67E22]',
      bar: 'from-[#E67E22] to-[#F5A623]',
    },
  ];

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <div className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_20px_rgba(11,19,84,0.05)] sm:p-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#6B4FE0] to-[#5B9FD4]"
            aria-hidden="true"
          />

          <Link
            to={CAMPAIGNS_BASE}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to campaigns
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" strokeWidth={2} />
                <h1 className="text-2xl font-bold text-[#0B1354]">{found.name}</h1>
              </div>
              <p className="mt-2 text-sm text-[#717171]">
                {found.channel} · {found.route} route · Created {found.dateCreated}
              </p>
            </div>

            <span
              className={clsx(
                'inline-flex w-fit rounded-sm px-3 py-1.5 text-sm font-semibold ring-1',
                STATUS_STYLES[found.status],
              )}
            >
              {found.status}
            </span>
          </div>
        </div>
      </Reveal>

      <StaggerReveal
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        stagger={0.06}
      >
        {metrics.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard {...metric} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Reveal variant="fadeUp" amount={0.15} delay={0.08}>
          <ReportBarChart
            title="Engagement Over Time"
            labels={MONTH_LABELS}
            data={scaleTrendData(0.8)}
            description="Track opens and clicks for this campaign over the selected period."
          />
        </Reveal>

        <Reveal variant="fadeUp" amount={0.15} delay={0.12}>
          <div className="rounded-sm border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
            <h3 className="mb-4 text-center text-sm font-bold text-[#0B1354]">Campaign Preview</h3>
            <CampaignMobilePreview
              channel={channelId}
              headline={found.headline || template?.headline || found.name}
              body={
                found.body ||
                template?.body ||
                `Engage your audience with ${found.name} across ${found.channel}.`
              }
              cta={found.cta || template?.cta || 'Learn More'}
              templateMode={isTemplate}
              accent={template?.accent}
              products={template?.products}
            />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
