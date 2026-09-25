import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { PageHeading } from '../../components/layout/PageBackLink';
import TableStatStrip, { statShare } from '../../components/layout/TableStatStrip';
import BusinessesPagination from '../../components/businesses/BusinessesPagination';
import {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_PAGE_SIZE,
  SENDER_IDS,
  labelFor,
  paginate,
} from '../../components/campaigns/campaignData';

export default function CampaignSenderIdsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const [page, setPage] = useState(1);
  const paged = paginate(SENDER_IDS, page);
  const approved = SENDER_IDS.filter((item) => item.status === 'approved').length;
  const pending = SENDER_IDS.filter((item) => item.status === 'pending').length;
  const channels = new Set(SENDER_IDS.map((item) => item.channel)).size;
  const stats = [
    {
      id: 'total',
      label: 'Sender IDs',
      value: String(SENDER_IDS.length),
      accent: '#0B1354',
      share: 100,
      detail: 'Registered names',
    },
    {
      id: 'approved',
      label: 'Approved',
      value: String(approved),
      accent: '#157A42',
      share: statShare(approved, SENDER_IDS.length),
      detail: `${statShare(approved, SENDER_IDS.length)}% ready to send`,
    },
    {
      id: 'pending',
      label: 'Pending',
      value: String(pending),
      accent: '#D97706',
      share: statShare(pending, SENDER_IDS.length),
      detail: `${statShare(pending, SENDER_IDS.length)}% awaiting review`,
    },
    {
      id: 'channels',
      label: 'Channels',
      value: String(channels),
      accent: '#2563EB',
      share: statShare(channels, CAMPAIGN_CHANNELS.length),
      detail: `Of ${CAMPAIGN_CHANNELS.length} available channels`,
    },
  ];

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Sender IDs"
        description="Names businesses can send from on SMS, email, and WhatsApp."
        backTo="/campaigns"
        backLabel="Campaign management"
      />

      <div className="mt-5">
        <TableStatStrip items={stats} />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-xs font-medium uppercase tracking-wide text-[#717171]">
            <tr>
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((item) => (
              <tr key={item.id} className="border-b border-[#F4F4F5] last:border-0">
                <td className="px-4 py-3 font-semibold text-[#0B1354]">{item.name}</td>
                <td className="px-4 py-3 text-[#3F3F46]">{labelFor(CAMPAIGN_CHANNELS, item.channel)}</td>
                <td className="px-4 py-3 text-[#3F3F46]">
                  {businesses.find((business) => business.id === item.businessId)?.companyName ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={item.status === 'approved' ? 'text-emerald-700' : 'text-amber-700'}>
                    {item.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={SENDER_IDS.length}
        pageSize={CAMPAIGN_PAGE_SIZE}
        onPageChange={setPage}
        label="Sender ID pages"
      />
    </div>
  );
}
