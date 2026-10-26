import { useState } from 'react';
import { ChevronDown, Inbox } from 'lucide-react';

const PREVIEW_ROWS = 5;

const STATUS_STYLES = {
  Earned: 'bg-[#EFFBF4] text-[#17734A]',
  Completed: 'bg-[#EFFBF4] text-[#17734A]',
  Pending: 'bg-[#FFF7E6] text-[#A15C07]',
  Processing: 'bg-[#FFF7E6] text-[#A15C07]',
  Failed: 'bg-[#FFF3F3] text-[#B42328]',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Activity list with a status filter and "View all". `statuses` are the filter options,
 * `pointsPrefix` is "+" for earnings and "−" for redemptions.
 */
export default function ActivityTable({
  id,
  title,
  dateLabel,
  rows,
  statuses,
  pointsPrefix = '',
  emptyMessage,
}) {
  const [status, setStatus] = useState('All');
  const [expanded, setExpanded] = useState(false);

  const filtered = status === 'All' ? rows : rows.filter((row) => row.status === status);
  const shown = expanded ? filtered : filtered.slice(0, PREVIEW_ROWS);
  const canExpand = filtered.length > PREVIEW_ROWS;

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#E6E8F0] bg-white shadow-[0_6px_20px_rgba(11,19,84,0.05)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0F4] px-5 py-4">
        <h2 id={`${id}-title`} className="text-lg font-bold text-[#0B1354]">
          {title}
        </h2>
        <div className="relative">
          <label htmlFor={`${id}-filter`} className="sr-only">
            Filter by status
          </label>
          <select
            id={`${id}-filter`}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setExpanded(false);
            }}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#DDE0EA] bg-white pl-3 pr-9 text-sm font-semibold text-[#3A3F66] outline-none transition-colors hover:border-[#0B1354]/40 focus:border-primary focus:shadow-[0_0_0_3px_rgba(58,16,205,0.12)]"
          >
            <option value="All">All</option>
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7191]"
            strokeWidth={2.25}
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <Inbox className="h-8 w-8 text-[#9AA0B4]" strokeWidth={1.75} />
          <p className="mt-3 text-sm text-[#6B7191]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="bg-[#F8F9FC] text-xs font-bold uppercase tracking-wide text-[#6B7191]">
                <th scope="col" className="px-5 py-3 font-bold">Title</th>
                <th scope="col" className="px-3 py-3 font-bold">{dateLabel}</th>
                <th scope="col" className="px-3 py-3 text-right font-bold">Points</th>
                <th scope="col" className="px-5 py-3 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F7]">
              {shown.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-[#FAFAFD]">
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#0B1354]">{row.title}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#5B6180]">
                    {dateFormat.format(row.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-bold tabular-nums text-[#0B1354]">
                    {pointsPrefix}
                    {row.points.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        STATUS_STYLES[row.status] || 'bg-[#F0F2F7] text-[#5B6180]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canExpand ? (
        <div className="border-t border-[#EEF0F4] px-5 py-3 text-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="cursor-pointer text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {expanded ? 'Show less' : `View all (${filtered.length})`}
          </button>
        </div>
      ) : null}
    </section>
  );
}
