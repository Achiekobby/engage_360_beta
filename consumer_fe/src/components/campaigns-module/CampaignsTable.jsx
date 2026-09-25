import { clsx } from 'clsx';
import { Bell, Eye, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { CHANNEL_CARD_STYLES, STATUS_STYLES } from './campaignsData';

const CHANNEL_ICONS = {
  SMS: MessageSquare,
  Email: Mail,
  WhatsApp: Smartphone,
  Push: Bell,
  'Push Notification': Bell,
};

export default function CampaignsTable({ campaigns, onView, embedded = false }) {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
        <h3 className="text-lg font-bold text-[#0B1354]">No campaigns yet</h3>
        <p className="mt-2 max-w-sm text-sm text-[#717171]">
          Create your first campaign from scratch or pick a template to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? 'overflow-x-auto'
          : 'overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]'
      }
    >
      <div className={embedded ? '' : 'overflow-x-auto'}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#F0F2F7] bg-[#FAFBFC] text-xs font-semibold uppercase tracking-wide text-[#717171]">
            <tr>
              <th className="px-5 py-3.5 sm:px-6">Campaign Name</th>
              <th className="px-5 py-3.5 sm:px-6">Type</th>
              <th className="px-5 py-3.5 sm:px-6">Status</th>
              <th className="px-5 py-3.5 sm:px-6">Audience</th>
              <th className="px-5 py-3.5 sm:px-6">Open Rate</th>
              <th className="px-5 py-3.5 sm:px-6">Click Rate</th>
              <th className="px-5 py-3.5 sm:px-6">Date Created</th>
              <th className="px-5 py-3.5 sm:px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2F7]">
            {campaigns.map((campaign) => {
              const Icon = CHANNEL_ICONS[campaign.channel] || MessageSquare;
              const tint = CHANNEL_CARD_STYLES[campaign.channel] || CHANNEL_CARD_STYLES.SMS;

              return (
                <tr key={campaign.id} className="transition-colors hover:bg-[#FAFBFC]">
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
                          tint,
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1354]">{campaign.name}</p>
                        <p className="text-xs capitalize text-[#717171]">{campaign.route} route</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#717171] sm:px-6">{campaign.channel}</td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={clsx(
                        'inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold ring-1',
                        STATUS_STYLES[campaign.status],
                      )}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#0B1354] sm:px-6">
                    {campaign.audienceReach}
                  </td>
                  <td className="px-5 py-4 text-[#717171] sm:px-6">{campaign.openRate}</td>
                  <td className="px-5 py-4 text-[#717171] sm:px-6">{campaign.clickRate}</td>
                  <td className="px-5 py-4 text-[#717171] sm:px-6">{campaign.dateCreated}</td>
                  <td className="px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => onView(campaign)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
