import { useMemo } from 'react';
import { clsx } from 'clsx';
import AnalyticsMetricCard from './AnalyticsMetricCard';
import {
  ChannelDoughnutChart,
  DeliveryDoughnutChart,
  FunnelChart,
  GroupedBarChart,
  HorizontalRatesChart,
  TrendLineChart,
} from './AnalyticsCharts';
import { getAnalyticsBundle } from './analyticsData';

export default function AnalyticsMetricsView({ kindId = 'birthday' }) {
  const bundle = useMemo(() => getAnalyticsBundle(kindId), [kindId]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {bundle.metricSections.map((section) => {
        const singleRow = section.metrics.length === 5;

        return (
          <section key={section.id}>
            <div>
              <h2 className="text-lg font-bold text-[#0B1354] sm:text-xl">{section.title}</h2>
              <div className="mt-2 h-px w-full bg-[#0B1354]/20" aria-hidden="true" />
            </div>

            <div
              className={clsx(
                'mt-5 grid gap-3 sm:gap-4',
                singleRow
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2',
              )}
            >
              {section.metrics.map((metric) => (
                <AnalyticsMetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  tone={metric.tone}
                  compact={singleRow}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <div>
          <h2 className="text-lg font-bold text-[#0B1354] sm:text-xl">{bundle.chartsTitle}</h2>
          <div className="mt-2 h-px w-full bg-[#0B1354]/20" aria-hidden="true" />
          <p className="mt-2 text-sm text-[#717171]">{bundle.chartsSubtitle}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <DeliveryDoughnutChart chart={bundle.charts.deliveryStatus} />
          <ChannelDoughnutChart chart={bundle.charts.channelMix} />
          <GroupedBarChart chart={bundle.charts.dailyVolume} />
          <HorizontalRatesChart chart={bundle.charts.engagementRates} />
          <FunnelChart chart={bundle.charts.funnel} />
          <TrendLineChart chart={bundle.charts.monthlyTrend} />
        </div>
      </section>
    </div>
  );
}
