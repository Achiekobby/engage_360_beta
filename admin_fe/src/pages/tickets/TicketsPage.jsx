import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import TableStatStrip from '../../components/layout/TableStatStrip';
import BusinessesPagination from '../../components/businesses/BusinessesPagination';
import { useAppSelector } from '../../store/hooks';
import { CAMPAIGN_PAGE_SIZE, paginate } from '../../components/campaigns/campaignData';
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_AGENTS,
  buildTicketAnalytics,
  formatTicketWhen,
  getTickets,
  labelFor,
  ticketMeta,
} from '../../components/tickets/ticketData';

export default function TicketsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const tickets = getTickets();
  const stats = buildTicketAnalytics(tickets).cards;

  const businessName = (id) => businesses.find((item) => item.id === id)?.companyName ?? 'Unknown business';

  const rows = tickets.filter((item) => {
    if (status !== 'all' && item.status !== status) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.id, item.subject, businessName(item.businessId), labelFor(TICKET_CATEGORIES, item.category)]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
  const paged = paginate(rows, page);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Tickets"
        description="Requests raised by businesses. Reply, assign, or update status."
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search subject, business, or ticket ID"
            className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </PageHeading>

      <div className="mt-5">
        <TableStatStrip
          selectedId={status === 'all' ? null : status}
          items={stats.map((stat) => ({
            ...stat,
            onSelect: () => {
              setStatus((current) => (current === stat.id ? 'all' : stat.id));
              setPage(1);
            },
          }))}
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        {paged.rows.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-xs font-medium uppercase tracking-wide text-[#717171]">
              <tr>
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {paged.rows.map((item) => {
                const priority = ticketMeta(TICKET_PRIORITIES, item.priority);
                const meta = ticketMeta(TICKET_STATUSES, item.status);
                return (
                  <tr key={item.id} className="border-b border-[#F4F4F5] last:border-0 hover:bg-[#F8FAFF]">
                    <td className="px-4 py-3">
                      <Link to={`/tickets/${item.id}`} className="font-semibold text-[#0B1354] hover:text-primary">
                        {item.subject}
                      </Link>
                      <p className="text-xs text-[#A1A1AA]">{item.id.toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3 text-[#3F3F46]">{businessName(item.businessId)}</td>
                    <td className="px-4 py-3 text-[#3F3F46]">{labelFor(TICKET_CATEGORIES, item.category)}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', priority.badge)}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', meta.badge)}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3F3F46]">{labelFor(TICKET_AGENTS, item.assignee)}</td>
                    <td className="px-4 py-3 text-[#717171]">{formatTicketWhen(item.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-16 text-center text-sm text-[#717171]">No tickets match this search or status.</p>
        )}
      </div>

      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={rows.length}
        pageSize={CAMPAIGN_PAGE_SIZE}
        onPageChange={setPage}
        label="Ticket pages"
      />
    </div>
  );
}
