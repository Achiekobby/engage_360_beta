import { clsx } from 'clsx';
import {
  Bell,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { CHANNEL_CARD_STYLES, STATUS_STYLES } from './campaignsData';

const CHANNEL_ICONS = {
  SMS: MessageSquare,
  Email: Mail,
  WhatsApp: Smartphone,
  Push: Bell,
  'Push Notification': Bell,
};

export default function CampaignCard({ campaign, index = 0, onView }) {
  const Icon = CHANNEL_ICONS[campaign.channel] || MessageSquare;
  const channelTint = CHANNEL_CARD_STYLES[campaign.channel] || CHANNEL_CARD_STYLES.SMS;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_40px_rgba(58,16,205,0.12)]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#6B4FE0] to-[#5B9FD4] opacity-80"
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-transform duration-300 group-hover:scale-105',
              channelTint,
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <span
            className={clsx(
              'inline-flex rounded-sm px-2.5 py-1 text-[11px] font-semibold ring-1',
              STATUS_STYLES[campaign.status],
            )}
          >
            {campaign.status}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold leading-snug text-[#0B1354]">{campaign.name}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm bg-[#F7F8FF] px-2 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/10">
            {campaign.channel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm bg-[#FAFBFC] px-2 py-1 text-[11px] font-medium capitalize text-[#717171] ring-1 ring-[#EEF0F4]">
            {campaign.route === 'template' ? (
              <>
                <Sparkles className="h-3 w-3 text-[#E67E22]" strokeWidth={2} />
                Template
              </>
            ) : (
              'Direct'
            )}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#F0F2F7] pt-4">
          {[
            { label: 'Audience', value: campaign.audienceReach },
            { label: 'Open', value: campaign.openRate },
            { label: 'Click', value: campaign.clickRate },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-sm font-bold text-[#0B1354]">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#717171]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xs text-[#717171]">Created {campaign.dateCreated}</p>
          <button
            type="button"
            onClick={() => onView(campaign)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(58,16,205,0.22)] transition-all hover:bg-[#320EB8]"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            View
          </button>
        </div>
      </div>
    </article>
  );
}
