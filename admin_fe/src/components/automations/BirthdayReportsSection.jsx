import { useMemo, useState } from 'react';
import { Building2, CalendarRange, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import BirthdayInsightChartCard from './BirthdayInsightChartCard';
import {
  ChannelDoughnutChart,
  DeliveryDoughnutChart,
  FunnelChart,
  HorizontalRatesChart,
  TrendLineChart,
  VerticalBarChart,
} from './AnalyticsCharts';
import {
  BIRTHDAY_BUSINESS_FILTERS,
  BIRTHDAY_DATE_FILTERS,
  BIRTHDAY_ENGAGEMENT_MODES,
  BIRTHDAY_REPORT_TABS,
  buildBirthdayReport,
} from './birthdayReportsData';

function FilterSelect({ icon: Icon, value, onChange, options, ariaLabel }) {
  return (
    <div className="relative inline-flex min-w-[10.5rem]">
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
        strokeWidth={2}
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="w-full cursor-pointer appearance-none rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-[#0B1354] outline-none transition-colors hover:border-primary/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
        strokeWidth={2.25}
      />
    </div>
  );
}

function SummaryStatCard({ stat }) {
  return (
    <article className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-5 py-5">
      <p className="text-sm font-semibold text-[#0B1354]">{stat.label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[#0B1354] sm:text-4xl">
        {stat.value}
      </p>
      <span
        className={clsx(
          'mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
          stat.tone === 'warn'
            ? 'bg-[#FFF1E8] text-[#C2410C]'
            : 'bg-[#EDE8F8] text-primary',
        )}
      >
        {stat.change}
      </span>
    </article>
  );
}

function RatePill({ label, value }) {
  return (
    <div className="admin-card-sm rounded-xl border border-[#EEF0F4] bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#0B1354]">{value}</p>
    </div>
  );
}

export default function BirthdayReportsSection() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('30d');
  const [businessId, setBusinessId] = useState('all');
  const [engagementMode, setEngagementMode] = useState('native');

  const report = useMemo(
    () => buildBirthdayReport({ businessId, dateFilter }),
    [businessId, dateFilter],
  );

  return (
    <section className="admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <FilterSelect
            icon={CalendarRange}
            value={dateFilter}
            onChange={setDateFilter}
            options={BIRTHDAY_DATE_FILTERS}
            ariaLabel="Date filter"
          />
          <FilterSelect
            icon={Building2}
            value={businessId}
            onChange={setBusinessId}
            options={BIRTHDAY_BUSINESS_FILTERS}
            ariaLabel="Select business"
          />
        </div>

        <div className="inline-flex self-start gap-1 border-b border-[#EDE8F8] xl:self-auto">
          {BIRTHDAY_REPORT_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'cursor-pointer px-4 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-b-2 border-primary text-primary'
                    : 'border-b-2 border-transparent text-[#717171] hover:text-[#0B1354]',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-[#717171]">
        Platform birthday automation reports for{' '}
        <span className="font-semibold text-[#0B1354]">{report.scope}</span>
        {' · '}
        {BIRTHDAY_DATE_FILTERS.find((option) => option.value === dateFilter)?.label}
      </p>

      {activeTab === 'overview' ? (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {report.summaryStats.map((stat) => (
              <SummaryStatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="space-y-4">
            {report.overviewCharts.map((chart) =>
              chart.type === 'grouped' ? (
                <BirthdayInsightChartCard
                  key={chart.id}
                  title={chart.title}
                  subtitle={chart.subtitle}
                  labels={chart.labels}
                  datasets={chart.datasets}
                  grouped
                />
              ) : (
                <BirthdayInsightChartCard
                  key={chart.id}
                  title={chart.title}
                  subtitle={chart.subtitle}
                  labels={chart.labels}
                  color={chart.color}
                  data={chart.data}
                />
              ),
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-[#0B1354] sm:text-lg">
              Admin platform insights
            </h3>
            <p className="mt-1 text-sm text-[#717171]">
              Cross-business delivery, channel, approval, and pipeline health.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <DeliveryDoughnutChart chart={report.adminOverviewExtras.deliveryMix} />
              <ChannelDoughnutChart chart={report.adminOverviewExtras.channelMix} />
              <VerticalBarChart chart={report.adminOverviewExtras.volumeByBusiness} />
              <DeliveryDoughnutChart chart={report.adminOverviewExtras.approvalMix} />
              <TrendLineChart chart={report.adminOverviewExtras.pipelineTrend} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="admin-card-sm flex flex-col gap-3 rounded-xl border border-[#EEF0F4] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm font-semibold text-[#0B1354]">Stats Report</p>

            <div className="inline-flex self-start rounded-full bg-[#F0F2F7] p-1 sm:self-auto">
              {BIRTHDAY_ENGAGEMENT_MODES.map((mode) => {
                const active = engagementMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setEngagementMode(mode.id)}
                    className={clsx(
                      'cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                      active
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-[#717171] hover:text-[#0B1354]',
                    )}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-[#717171]">
              Total Stats{' '}
              <span className="font-semibold text-[#0B1354]">
                {report.engagementSummary.label}: {report.engagementSummary.value}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {report.adminEngagementExtras.rateCards.map((card) => (
              <RatePill key={card.id} label={card.label} value={card.value} />
            ))}
          </div>

          {engagementMode === 'static' ? (
            <div className="space-y-4">
              {report.engagementCharts.map((chart) => (
                <BirthdayInsightChartCard
                  key={chart.id}
                  title={chart.title}
                  subtitle={chart.subtitle}
                  labels={report.monthLabels}
                  color={chart.color}
                  data={chart.data}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {report.nativeBreakdownCharts.map((chart) => (
                <BirthdayInsightChartCard
                  key={chart.id}
                  title={chart.title}
                  subtitle={chart.subtitle}
                  labels={chart.labels}
                  datasets={chart.datasets}
                  grouped
                />
              ))}
              {report.engagementCharts.slice(0, 3).map((chart) => (
                <BirthdayInsightChartCard
                  key={`native-${chart.id}`}
                  title={chart.title}
                  subtitle={chart.subtitle}
                  labels={report.monthLabels}
                  color={chart.color}
                  data={chart.data}
                />
              ))}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-[#0B1354] sm:text-lg">
              Conversion deep dive
            </h3>
            <p className="mt-1 text-sm text-[#717171]">
              Funnel, rate breakdown, and click-to-conversion trends for admins.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <HorizontalRatesChart chart={report.adminEngagementExtras.ratesChart} />
              <FunnelChart chart={report.adminEngagementExtras.funnel} />
              <TrendLineChart chart={report.adminEngagementExtras.conversionTrend} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
