import { ListFilter } from 'lucide-react';
import { ANALYTICS_AUDIENCE_COLUMNS, ANALYTICS_AUDIENCE_ROWS } from './analyticsData';

export default function AnalyticsAudienceTable({ rows = ANALYTICS_AUDIENCE_ROWS }) {
  return (
    <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
              {ANALYTICS_AUDIENCE_COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#717171] first:pl-5 last:pr-5 sm:px-5"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {column}
                    <ListFilter className="h-3 w-3 opacity-45" strokeWidth={2.25} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF]"
              >
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] first:pl-5 sm:px-5">
                  {row.fullName}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                  {row.gender}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                  {row.dateOfBirth}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                  {row.productNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                  {row.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                  {row.category}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] last:pr-5 sm:px-5">
                  {row.collection}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
