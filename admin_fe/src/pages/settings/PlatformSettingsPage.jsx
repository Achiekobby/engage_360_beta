import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import { CategoryEngagement, HealthStatGrid, SettingsBarChart } from '../../components/settings/SettingsCharts';
import CreditCadenceTables from '../../components/settings/CreditCadenceTables';
import CreditHistoryModal from '../../components/settings/CreditHistoryModal';
import {
  SETTINGS_RANGES,
  SETTINGS_TABS,
  buildCreditGroups,
  buildSettingsAnalytics,
} from '../../components/settings/settingsData';
import { getCampaigns } from '../../components/campaigns/campaignData';
import { useAppSelector } from '../../store/hooks';

export default function PlatformSettingsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const campaigns = useMemo(() => getCampaigns(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [creditFor, setCreditFor] = useState(null);

  const tab = SETTINGS_TABS.some((item) => item.id === searchParams.get('tab')) ? searchParams.get('tab') : 'overview';
  const rangeId = SETTINGS_RANGES.some((item) => item.id === searchParams.get('range')) ? searchParams.get('range') : '30d';
  const data = useMemo(() => buildSettingsAnalytics({ businesses, campaigns, rangeId }), [businesses, campaigns, rangeId]);

  const setTab = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'overview') next.delete('tab');
    else next.set('tab', id);
    setSearchParams(next, { replace: true });
    setQuery('');
  };

  const setRange = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === '30d') next.delete('range');
    else next.set('range', id);
    setSearchParams(next, { replace: true });
  };

  const needle = query.trim().toLowerCase();
  const creditRows = businesses.filter((item) => {
    if (!needle) return true;
    return [item.companyName, item.companyEmail, item.companyPhone].join(' ').toLowerCase().includes(needle);
  });
  const creditGroups = buildCreditGroups(creditRows);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={
          tab === 'overview'
            ? 'Platform Health Overview'
            : tab === 'engagement'
              ? 'Engagement Analytics'
              : tab === 'revenue'
                ? 'Revenue Analytics'
                : tab === 'credits'
                  ? 'Credit Top-up Analytics'
                  : 'Platform Settings'
        }
        description={
          tab === 'overview'
            ? 'Monitor platform health and performance.'
            : tab === 'engagement'
              ? 'Deep dive into user engagement patterns.'
              : tab === 'revenue'
                ? 'Deep dive into revenue patterns.'
                : tab === 'credits'
                  ? 'Deep dive into credit top-up patterns.'
                  : 'Health, engagement, revenue, and credit controls for the Engage360 platform.'
        }
      >
        <div role="tablist" aria-label="Settings sections" className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
          {SETTINGS_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={clsx(
                'border-b-2 pb-1 text-sm',
                tab === item.id
                  ? 'border-primary font-semibold text-[#0B1354]'
                  : 'border-transparent font-medium text-[#717171] hover:text-[#0B1354]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {tab === 'credits' ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search businesses"
              className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2 pl-9 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        ) : (
          <select
            value={rangeId}
            onChange={(event) => setRange(event.target.value)}
            className="rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0B1354]"
            aria-label="Date range"
          >
            {SETTINGS_RANGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </PageHeading>

      {tab === 'overview' ? (
        <>
          <div className="mt-5">
            <HealthStatGrid items={data.health.cards} />
          </div>
          <div className="mt-5 space-y-4">
            <SettingsBarChart chart={data.health.charts[0]} />
            <SettingsBarChart chart={data.health.charts[1]} />
            <CategoryEngagement rows={data.health.categories} />
            <SettingsBarChart chart={data.health.charts[2]} />
          </div>
        </>
      ) : null}

      {tab === 'engagement' ? (
        <>
          <div className="mt-5">
            <HealthStatGrid items={data.engagement.cards} />
          </div>
          <div className="mt-5 space-y-4">
            {data.engagement.charts.map((chart) => (
              <SettingsBarChart key={chart.id} chart={chart} />
            ))}
          </div>
        </>
      ) : null}

      {tab === 'revenue' ? (
        <>
          <div className="mt-5">
            <HealthStatGrid items={data.revenue.cards} />
          </div>
          <div className="mt-5 space-y-4">
            {data.revenue.charts.map((chart) => (
              <SettingsBarChart key={chart.id} chart={chart} />
            ))}
          </div>
        </>
      ) : null}

      {tab === 'credits' ? (
        <>
          <CreditCadenceTables groups={creditGroups} onView={setCreditFor} />
          <CreditHistoryModal business={creditFor} onClose={() => setCreditFor(null)} />
        </>
      ) : null}
    </div>
  );
}
