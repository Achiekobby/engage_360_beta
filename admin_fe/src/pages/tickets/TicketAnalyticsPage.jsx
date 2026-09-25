import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import { SettingsBarChart } from '../../components/settings/SettingsCharts';
import { SETTINGS_RANGES } from '../../components/settings/settingsData';
import { TICKET_REPORTS, buildTicketReports } from '../../components/tickets/ticketData';

export default function TicketAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const report = TICKET_REPORTS.some((item) => item.id === searchParams.get('report')) ? searchParams.get('report') : 'sales';
  const rangeId = SETTINGS_RANGES.some((item) => item.id === searchParams.get('range')) ? searchParams.get('range') : '30d';
  const charts = buildTicketReports(rangeId)[report];

  const setReport = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'sales') next.delete('report');
    else next.set('report', id);
    setSearchParams(next, { replace: true });
  };

  const setRange = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === '30d') next.delete('range');
    else next.set('range', id);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={report === 'issues' ? 'Issues & Support' : 'Sales Request'}
        description={
          report === 'issues'
            ? 'Daily volume, growth, and close rate for issues and support tickets.'
            : 'Daily volume, growth, and close rate for sales requests.'
        }
      >
        <div role="tablist" aria-label="Ticket reports" className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
          {TICKET_REPORTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={report === item.id}
              onClick={() => setReport(item.id)}
              className={clsx(
                'border-b-2 pb-1 text-sm',
                report === item.id
                  ? 'border-primary font-semibold text-[#0B1354]'
                  : 'border-transparent font-medium text-[#717171] hover:text-[#0B1354]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
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
      </PageHeading>

      <div className="mt-5 space-y-4">
        {charts.map((chart) => (
          <SettingsBarChart key={chart.id} chart={chart} />
        ))}
      </div>
    </div>
  );
}
