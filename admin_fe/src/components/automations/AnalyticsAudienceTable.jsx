import { ChevronDown, FolderKanban, Tags } from 'lucide-react';
import { ANALYTICS_AUDIENCE_COLUMNS, ANALYTICS_AUDIENCE_ROWS } from './analyticsData';
import AutomationMetaBadge from './AutomationMetaBadge';

const CATEGORY_BADGE = {
  Dealboxx: 'bg-[#EDE8F8] text-primary',
  txtconnect: 'bg-[#EEF2FF] text-[#3A10CD]',
};

const COLLECTION_BADGE = {
  'Active Campaign': 'bg-[#E8F8EF] text-[#1F9D55]',
  'Repeated Base': 'bg-[#FFF1E8] text-[#E67E22]',
  'Birthday Club': 'bg-[#FFF8E1] text-[#C9A227]',
  'VIP Segment': 'bg-[#EDE8F8] text-primary',
  'Anniversary Club': 'bg-[#EDE8F8] text-primary',
};

function AudienceBadge({ label, type }) {
  const className =
    type === 'category'
      ? CATEGORY_BADGE[label] || 'bg-[#F0F2F7] text-[#0B1354]'
      : COLLECTION_BADGE[label] || 'bg-[#F0F2F7] text-[#0B1354]';
  const Icon = type === 'category' ? Tags : FolderKanban;

  return (
    <AutomationMetaBadge
      icon={Icon}
      label={label}
      className={className}
      align="start"
    />
  );
}

export default function AnalyticsAudienceTable({ rows = ANALYTICS_AUDIENCE_ROWS }) {
  return (
    <div className="admin-card overflow-hidden admin-card rounded-xl border border-[#EEF0F4] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2F7] bg-white">
              {ANALYTICS_AUDIENCE_COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-[#717171] first:pl-5 last:pr-5 sm:px-5"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {column}
                    <ChevronDown className="h-3 w-3 opacity-45" strokeWidth={2.25} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
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
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm tabular-nums text-[#0B1354] sm:px-5">
                    {row.productNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#0B1354] sm:px-5">
                    {row.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                    <AudienceBadge label={row.category} type="category" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 last:pr-5 sm:px-5">
                    <AudienceBadge label={row.collection} type="collection" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={ANALYTICS_AUDIENCE_COLUMNS.length}
                  className="px-5 py-14 text-center text-sm text-[#717171]"
                >
                  No audience contacts match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
