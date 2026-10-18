import { Eye, Link2, Rocket, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import { BannerButton } from '../media/ImageLightbox';
import {
  CAMPAIGN_CHANNELS,
  formatCedi,
  formatCompact,
  labelFor,
} from './campaignData';

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-primary sm:text-base">{children}</h3>
      <div className="mt-2 h-px bg-gradient-to-r from-[#8B8B3D]/55 via-[#8B8B3D]/25 to-transparent" />
    </div>
  );
}

function ReviewField({ label, value, className, multiline = false }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">{label}</p>
      <div
        className={clsx(
          'rounded-lg border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm text-[#0B1354]',
          multiline && 'min-h-[5.5rem] whitespace-pre-wrap leading-relaxed',
        )}
      >
        {value || <span className="text-[#A1A1AA]">—</span>}
      </div>
    </div>
  );
}

function ChannelRadio({ channel }) {
  const label = labelFor(CAMPAIGN_CHANNELS, channel);
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#0B1354]">Promotion Channel</p>
      <div className="flex flex-wrap gap-4">
        {CAMPAIGN_CHANNELS.map((item) => {
          const selected = item.id === channel;
          return (
            <span
              key={item.id}
              className={clsx(
                'inline-flex items-center gap-2.5 text-sm font-medium',
                selected ? 'text-[#0B1354]' : 'text-[#A1A1AA]',
              )}
            >
              <span
                className={clsx(
                  'flex h-4 w-4 items-center justify-center rounded-full border-2',
                  selected ? 'border-primary' : 'border-[#D4D4D8]',
                )}
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
              </span>
              {item.label}
            </span>
          );
        })}
      </div>
      <p className="sr-only">Selected channel: {label}</p>
    </div>
  );
}

function SourceRadio({ source }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#0B1354]">Customer Source</p>
      <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0B1354]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
        </span>
        {source}
      </label>
    </div>
  );
}

function ReachStatCard({ label, value, icon: Icon, tone }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-xl px-4 py-4',
        tone === 'peach' ? 'bg-[#FFF0E8]' : 'bg-[#E8F4FC]',
      )}
    >
      <span
        className={clsx(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm',
          tone === 'peach' ? 'text-[#E5484D]' : 'text-[#1F9D55]',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#0B1354]">{label}</p>
        <p className="mt-0.5 text-xl font-bold tabular-nums text-[#0B1354]">{value}</p>
      </div>
    </div>
  );
}

function formatOverviewDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function CampaignOverviewTab({
  campaign,
  brief,
  onCustomerView,
  onShare,
  copied = false,
}) {
  const messageLabel = `${labelFor(CAMPAIGN_CHANNELS, brief.channel)} Message`;
  const promoVisual = brief.promoVisual || 'Image';
  const attachmentPreview = brief.bannerUrl || brief.attachmentUrl;

  return (
    <div className="mt-5 admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.05)]">
      <div className="space-y-8 p-5 sm:p-7 lg:p-8">
        <section>
          <SectionTitle>Message & Primary Asset</SectionTitle>
          <div className="space-y-5">
            <ChannelRadio channel={brief.channel} />
            <ReviewField label={messageLabel} value={brief.message} multiline />
            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewField label="Title" value={brief.title} />
              <ReviewField label="Call to Action" value={brief.callToAction} />
              <ReviewField
                label="Description"
                value={brief.description || brief.message}
                multiline
              />
              <div>
                <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">Banner (Optional)</p>
                <BannerButton
                  src={brief.bannerUrl}
                  alt={`${campaign.name} banner`}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>Attachment</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewField label="Promo Visuals" value={promoVisual} />
            <div>
              <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">Attachment</p>
              {attachmentPreview ? (
                <BannerButton
                  src={attachmentPreview}
                  alt={`${campaign.name} attachment`}
                  className="rounded-lg"
                />
              ) : (
                <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm text-[#A1A1AA]">
                  No attachment
                </div>
              )}
            </div>
            <ReviewField label="Price" value={formatCedi(brief.price)} />
            <ReviewField
              label="Discounted Price (Optional)"
              value={formatCedi(brief.discountedPrice)}
            />
            <ReviewField
              label="End Date"
              value={formatOverviewDate(brief.expiryDate)}
              className="sm:col-span-2 sm:max-w-md"
            />
            {brief.voucher ? (
              <ReviewField label="Voucher / Promo Code (Optional)" value={brief.voucher} />
            ) : null}
          </div>
        </section>

        <section>
          <SectionTitle>Customer Targeting</SectionTitle>
          <div className="space-y-5">
            <SourceRadio source={brief.source} />

            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewField label="Customer Category" value={brief.customerCategory} />
              <ReviewField
                label="Collection"
                value={
                  brief.collection ||
                  (brief.newCustomers ? 'New Customers' : 'All customers')
                }
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#0B1354]">Customer Segmentation</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewField label="Gender" value={brief.gender} />
                <ReviewField label="Region" value={brief.region} />
                <ReviewField label="Location" value={brief.location} />
                <ReviewField label="Age" value={brief.age} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ReachStatCard
                label="Estimated Reach"
                value={formatCompact(brief.estimatedReach)}
                icon={Ticket}
                tone="peach"
              />
              <ReachStatCard
                label="Preferred Reach"
                value={formatCompact(brief.preferredReach)}
                icon={Rocket}
                tone="blue"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#F0F2F7] px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={onCustomerView}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
          Customer View
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
        >
          <Link2 className="h-4 w-4" strokeWidth={2} />
          {copied ? 'Link copied' : 'Share link'}
        </button>
      </div>
    </div>
  );
}
