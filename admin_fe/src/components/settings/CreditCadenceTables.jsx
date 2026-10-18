import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatNumber } from '../campaigns/campaignData';
import { creditActivityFor, creditBalanceFor, lastTopupLabel } from './settingsData';

export default function CreditCadenceTables({ groups, onView }) {
  return (
    <div className="mt-5 space-y-4">
      {groups.map((group) => (
        <section key={group.id} className="admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
          <header className="border-b border-[#EEF0F4] px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold tracking-tight text-[#0B1354]">{group.label}</h2>
            <p className="mt-0.5 text-xs text-[#717171]">
              {group.detail}
              <span className="text-[#A1A1AA]"> · {group.rows.length}</span>
            </p>
          </header>
          {group.rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-xs font-medium uppercase tracking-wide text-[#717171]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Business name</th>
                    <th className="px-4 py-3 font-medium">Phone number</th>
                    <th className="px-4 py-3 font-medium">Email address</th>
                    <th className="px-4 py-3 font-medium">Last top-up date</th>
                    <th className="px-4 py-3 font-medium text-right">Credit balance</th>
                    <th className="px-4 py-3 font-medium">Activity status</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((item) => (
                    <tr key={item.id} className="border-b border-[#F4F4F5] last:border-0">
                      <td className="px-4 py-3">
                        <Link to={`/businesses/${item.id}`} className="font-medium text-[#0B1354] hover:text-primary">
                          {item.companyName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[#3F3F46]">{item.companyPhone || '—'}</td>
                      <td className="px-4 py-3 text-[#3F3F46]">{item.companyEmail || '—'}</td>
                      <td className="px-4 py-3 text-[#717171]">{lastTopupLabel(item)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#0B1354]">{formatNumber(creditBalanceFor(item))}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[#3F3F46]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
                          {creditActivityFor(item)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          aria-label={`View top-ups for ${item.companyName}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#717171] hover:bg-[#F4F4F5] hover:text-primary"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-[#717171]">No businesses match this top-up pattern.</p>
          )}
        </section>
      ))}
    </div>
  );
}
