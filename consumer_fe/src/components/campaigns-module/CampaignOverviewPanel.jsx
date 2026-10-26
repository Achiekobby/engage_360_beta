import { useState } from 'react';
import { Copy, Eye, Link2, Rocket, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import CampaignMobilePreview from './CampaignMobilePreview';
import PromoVisualPreview from './PromoVisualPreview';
import {
  categoryUsesCtaDestination,
  formatReachCount,
  getCtaDestinationType,
  PROMO_VISUAL_OPTIONS,
  SEGMENTATION_FILTER_TYPES,
} from './campaignsData';

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-primary">{children}</h3>
      <div className="mt-2 h-px bg-gradient-to-r from-[#8B8B3D]/50 via-[#8B8B3D]/25 to-transparent" />
    </div>
  );
}

function ReviewField({ label, value, className, multiline = false }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">{label}</p>
      <div
        className={clsx(
          'rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm text-[#0B1354]',
          multiline && 'min-h-[5.5rem] whitespace-pre-wrap',
        )}
      >
        {value || '—'}
      </div>
    </div>
  );
}

function MediaField({ label, attachment, emptyLabel }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">{label}</p>
      <PromoVisualPreview
        promoVisual={attachment?.promoVisual || 'image'}
        previewUrl={attachment?.previewUrl}
        fileName={attachment?.fileName}
        fileMimeType={attachment?.fileMimeType}
        compact
        emptyLabel={emptyLabel}
      />
    </div>
  );
}

function ReachStatCard({ label, value, icon: Icon, tone }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-sm px-4 py-4',
        tone === 'peach' ? 'bg-[#FFF0E8] text-[#E5484D]' : 'bg-[#E8F4FC] text-[#1F9D55]',
      )}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white shadow-sm">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#0B1354]">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-[#0B1354]">{value}</p>
      </div>
    </div>
  );
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return '—';
  if (isoDate.includes('/')) return isoDate;
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function CustomerViewModal({ isOpen, onClose, campaign }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0B1354]/45"
        onClick={onClose}
        aria-label="Close customer view"
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-sm bg-white shadow-[0_24px_64px_rgba(11,19,84,0.2)]">
        <div className="flex items-center justify-between border-b border-[#EEF0F4] px-5 py-4">
          <h3 className="text-base font-bold text-[#0B1354]">Customer View</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm font-semibold text-primary hover:text-[#320EB8]"
          >
            Close
          </button>
        </div>
        <div className="bg-[#FAFBFC] p-5">
          <CampaignMobilePreview
            channel={campaign.channelId}
            headline={campaign.headline}
            body={campaign.body}
            cta={campaign.cta}
          />
        </div>
      </div>
    </div>
  );
}

export default function CampaignOverviewPanel({ campaign, onLaunchAgain }) {
  const [customerViewOpen, setCustomerViewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const primaryAttachment = campaign.attachments?.[0];
  const messageLabel =
    campaign.channelId === 'email'
      ? 'Email Message'
      : campaign.channelId === 'whatsapp'
        ? 'WhatsApp Message'
        : campaign.channelId === 'push'
          ? 'Push Notification'
          : 'SMS Message';
  const showCtaDestination = categoryUsesCtaDestination(campaign.categoryId);
  const ctaDestination = getCtaDestinationType(campaign.ctaType);

  const customerSourceLabel =
    campaign.customerSource === 'external'
      ? 'External'
      : 'Customer Management (Internal)';

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/campaigns/${campaign.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)]">
      <div className="space-y-8 p-5 sm:p-8">
        <section>
          <SectionTitle>Message & Primary Asset</SectionTitle>
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#0B1354]">Promotion Channel</p>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0B1354]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                {campaign.channel}
              </label>
            </div>

            <ReviewField label={messageLabel} value={campaign.body} multiline />

            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewField label="Title" value={campaign.headline} />
              <ReviewField label="Call to Action" value={campaign.cta} />
              {showCtaDestination ? (
                <>
                  <ReviewField label="CTA Destination" value={ctaDestination.label} />
                  <ReviewField label={ctaDestination.label} value={campaign.ctaValue} />
                </>
              ) : null}
              <ReviewField
                label="Description"
                value={campaign.description}
                multiline
                className={
                  campaign.categoryId === 'service-alerts' || showCtaDestination
                    ? 'sm:col-span-2'
                    : undefined
                }
              />
              {campaign.categoryId === 'service-alerts' ? null : (
                <MediaField
                  label="Banner (Optional)"
                  attachment={campaign.banner || primaryAttachment}
                  emptyLabel="No banner uploaded"
                />
              )}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>Attachment</SectionTitle>
          {campaign.categoryId === 'service-alerts' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewField
                label="Ads Visuals"
                value={
                  PROMO_VISUAL_OPTIONS.find((item) => item.id === primaryAttachment?.promoVisual)
                    ?.label || 'Image'
                }
              />
              <MediaField
                label="Attachment"
                attachment={primaryAttachment}
                emptyLabel="No attachment uploaded"
              />
              <ReviewField label="Support Contact" value={campaign.supportContact} />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewField
                label="Product Visuals"
                value={
                  PROMO_VISUAL_OPTIONS.find((item) => item.id === primaryAttachment?.promoVisual)
                    ?.label || 'Image'
                }
              />
              <MediaField
                label="Attachment"
                attachment={primaryAttachment}
                emptyLabel="No attachment uploaded"
              />
              <ReviewField label="Price" value={primaryAttachment?.price} />
              <ReviewField
                label="Discounted Price (Optional)"
                value={primaryAttachment?.discountedPrice}
              />
              <ReviewField
                label="End Date"
                value={formatDisplayDate(primaryAttachment?.promoExpiryDate)}
              />
            </div>
          )}
        </section>

        <section>
          <SectionTitle>Customer Targeting</SectionTitle>
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#0B1354]">Customer Source</p>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0B1354]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                {customerSourceLabel}
              </label>
            </div>

            {campaign.customerSource !== 'external' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewField label="Customer Category" value={campaign.customerCategoryLabel} />
                <ReviewField label="Collection" value={campaign.collectionLabel} />
              </div>
            ) : null}

            <div>
              <p className="mb-3 text-sm font-semibold text-[#0B1354]">Customer Segmentation</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {(campaign.segmentFilters || []).map((filter) => (
                  <ReviewField
                    key={filter.id}
                    label={SEGMENTATION_FILTER_TYPES[filter.type]?.label || filter.type}
                    value={filter.value}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ReachStatCard
                label="Estimated Reach"
                value={formatReachCount(campaign.estimatedReach)}
                icon={Ticket}
                tone="peach"
              />
              <ReachStatCard
                label="Preferred Reach"
                value={formatReachCount(campaign.preferredReach)}
                icon={Rocket}
                tone="blue"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-[#F0F2F7] px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={onLaunchAgain}
          className="w-full cursor-pointer rounded-sm bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8]"
        >
          Launch Again
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => setCustomerViewOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
            Customer View
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
          >
            {copied ? <Copy className="h-4 w-4" strokeWidth={2} /> : <Link2 className="h-4 w-4" strokeWidth={2} />}
            {copied ? 'Link copied' : 'Share link'}
          </button>
        </div>
      </div>

      <CustomerViewModal
        isOpen={customerViewOpen}
        onClose={() => setCustomerViewOpen(false)}
        campaign={campaign}
      />
    </div>
  );
}
