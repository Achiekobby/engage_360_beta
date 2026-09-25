import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import { useAppSelector } from '../../store/hooks';
import {
  TICKET_AGENTS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  formatTicketWhen,
  getTicket,
  labelFor,
  replyToTicket,
  ticketMeta,
  updateTicket,
} from '../../components/tickets/ticketData';

const selectClass =
  'rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const businesses = useAppSelector((state) => state.businesses.items);
  const [, setTick] = useState(0);
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const ticket = getTicket(ticketId);

  const business = useMemo(
    () => businesses.find((item) => item.id === ticket?.businessId),
    [businesses, ticket?.businessId],
  );

  if (!ticket) return <Navigate to="/tickets" replace />;

  const status = ticketMeta(TICKET_STATUSES, ticket.status);
  const priority = ticketMeta(TICKET_PRIORITIES, ticket.priority);

  const refresh = () => setTick((value) => value + 1);

  const send = (event) => {
    event.preventDefault();
    if (!reply.trim()) {
      setError('Write a reply before sending.');
      return;
    }
    replyToTicket(ticket.id, { body: reply });
    setReply('');
    setError('');
    refresh();
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={ticket.subject}
        description={`${ticket.id.toUpperCase()} · ${business?.companyName ?? 'Business'} · ${labelFor(TICKET_CATEGORIES, ticket.category)}`}
        backTo="/tickets"
        backLabel="Inbox"
        actions={
          <span className={clsx('inline-flex rounded-full px-3 py-1 text-xs font-semibold', status.badge)}>{status.label}</span>
        }
      />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-xl border border-[#EEF0F4] bg-white px-4 py-5 sm:px-5">
          <h2 className="text-sm font-semibold text-[#0B1354]">Conversation</h2>
          <ol className="mt-4 space-y-3">
            {ticket.messages.map((message) => {
              const fromAdmin = message.from === 'admin';
              return (
                <li
                  key={message.id}
                  className={clsx('max-w-[40rem] rounded-xl border px-4 py-3', fromAdmin ? 'ml-auto border-primary/20 bg-[#F8FAFF]' : 'border-[#EEF0F4] bg-[#FAFBFC]')}
                >
                  <p className="text-xs font-medium text-[#717171]">
                    {message.author}
                    <span className="ml-2 font-normal text-[#A1A1AA]">{formatTicketWhen(message.at)}</span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#0B1354]">{message.body}</p>
                </li>
              );
            })}
          </ol>

          <form onSubmit={send} className="mt-6 border-t border-[#F0F2F7] pt-4">
            <label htmlFor="ticket-reply" className="text-sm font-medium text-[#0B1354]">
              Reply
            </label>
            <textarea
              id="ticket-reply"
              value={reply}
              onChange={(event) => {
                setReply(event.target.value);
                setError('');
              }}
              rows={4}
              placeholder="Write a clear next step for the business."
              className="mt-1.5 w-full resize-y rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {error ? <p className="mt-1 text-xs text-[#DC2626]">{error}</p> : null}
            <div className="mt-3 flex justify-end">
              <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
                Send reply
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#EEF0F4] bg-white px-4 py-4">
            <h2 className="text-sm font-semibold text-[#0B1354]">Ticket</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-[#717171]">Business</dt>
                <dd className="mt-1">
                  {business ? (
                    <Link to={`/businesses/${business.id}`} className="font-medium text-primary hover:underline">
                      {business.companyName}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#717171]">Opened</dt>
                <dd className="mt-1 text-[#3F3F46]">{formatTicketWhen(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#717171]">Priority</dt>
                <dd className="mt-1">
                  <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', priority.badge)}>
                    {priority.label}
                  </span>
                </dd>
              </div>
            </dl>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-[#717171]">
                Status
                <select
                  value={ticket.status}
                  onChange={(event) => {
                    updateTicket(ticket.id, { status: event.target.value });
                    refresh();
                  }}
                  className={`mt-1.5 w-full ${selectClass}`}
                >
                  {TICKET_STATUSES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-[#717171]">
                Assignee
                <select
                  value={ticket.assignee}
                  onChange={(event) => {
                    updateTicket(ticket.id, { assignee: event.target.value });
                    refresh();
                  }}
                  className={`mt-1.5 w-full ${selectClass}`}
                >
                  {TICKET_AGENTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
