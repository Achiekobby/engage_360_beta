import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarRange, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import BirthdayInsightChartCard from './BirthdayInsightChartCard';
import {
  BIRTHDAY_DATE_FILTERS,
  BIRTHDAY_ENGAGEMENT_CHARTS,
  BIRTHDAY_INSIGHT_TABS,
  BIRTHDAY_MONTH_LABELS,
  BIRTHDAY_OVERVIEW_CHARTS,
  BIRTHDAY_SUMMARY_STATS,
} from './birthdayInsightsData';

export default function BirthdayInsightsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = searchParams.get('page');
  const [activeTab, setActiveTab] = useState(
    pageFromUrl === 'engagement' ? 'engagement' : 'overview',
  );
  const [dateFilter, setDateFilter] = useState('30d');

  useEffect(() => {
    if (pageFromUrl === 'engagement' || pageFromUrl === 'overview') {
      setActiveTab(pageFromUrl);
    }
  }, [pageFromUrl]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'automations');
    next.set('kind', 'birthday');
    if (tabId === 'overview') next.delete('page');
    else next.set('page', tabId);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative inline-flex">
          <CalendarRange
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            strokeWidth={2}
          />
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Date filter"
            className="cursor-pointer appearance-none rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-[#0B1354] outline-none transition-colors hover:border-primary/30"
          >
            {BIRTHDAY_DATE_FILTERS.map((option) => (
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

        <div className="inline-flex self-start gap-1 border-b border-[#EDE8F8] lg:self-auto">
          {BIRTHDAY_INSIGHT_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
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

      {activeTab === 'overview' ? (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {BIRTHDAY_SUMMARY_STATS.map((stat) => (
              <article
                key={stat.id}
                className="rounded-sm border border-[#EEF0F4] bg-white px-5 py-5 shadow-[0_4px_20px_rgba(11,19,84,0.04)]"
              >
                <p className="text-sm font-semibold text-[#0B1354]">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-[#0B1354] sm:text-4xl">
                  {stat.value}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-[#EDE8F8] px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {stat.change}
                </span>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            {BIRTHDAY_OVERVIEW_CHARTS.map((chart) =>
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
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {BIRTHDAY_ENGAGEMENT_CHARTS.map((chart) => (
            <BirthdayInsightChartCard
              key={chart.id}
              title={chart.title}
              subtitle={chart.subtitle}
              labels={BIRTHDAY_MONTH_LABELS}
              color={chart.color}
              data={chart.data}
            />
          ))}
        </div>
      )}
    </section>
  );
}
