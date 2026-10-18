import { Rocket, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { DELIVERY_METRICS, ENGAGEMENT_METRICS } from './campaignDetailData';

function SectionTitle({ children }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-primary">{children}</h3>
      <div className="mt-2 h-px bg-gradient-to-r from-[#8B8B3D]/50 via-[#8B8B3D]/25 to-transparent" />
    </div>
  );
}

function MetricCard({ label, value, tone, index }) {
  const Icon = tone === 'green' ? Rocket : Ticket;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 rounded-sm bg-[#F3F4F7] px-4 py-4"
    >
      <span
        className={clsx(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white shadow-sm',
          tone === 'green' ? 'text-[#1F9D55]' : 'text-[#E5484D]',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0B1354]">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-[#717171]">{value}</p>
      </div>
    </motion.div>
  );
}

function MetricGrid({ metrics }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} {...metric} index={index} />
      ))}
    </div>
  );
}

export default function CampaignAnalyticsPanel({
  deliveryMetrics = DELIVERY_METRICS,
  engagementMetrics = ENGAGEMENT_METRICS,
}) {
  return (
    <div className="space-y-8 rounded-sm border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_24px_rgba(11,19,84,0.06)] sm:p-8">
      <section>
        <SectionTitle>Delivery & Message</SectionTitle>
        <MetricGrid metrics={deliveryMetrics} />
      </section>

      <section>
        <SectionTitle>Engagement & Conversion</SectionTitle>
        <MetricGrid metrics={engagementMetrics} />
      </section>
    </div>
  );
}
