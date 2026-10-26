import { useState } from 'react';
import { ArrowLeft, Eye, ListChecks, Pencil, Rocket, Ticket, X } from 'lucide-react';
import { clsx } from 'clsx';
import CampaignMobilePreview from './CampaignMobilePreview';
import TestBlastModal from './TestBlastModal';
import CampaignSuccessModal from './CampaignSuccessModal';
import PromoVisualPreview from './PromoVisualPreview';
import { FormPreview, LEAD_QUESTION_TYPE_META } from './LeadGenerationFormStep';
import { EventGuestPreview, ticketIncludedItems } from './EventActivationAttachmentStep';
import { EventQuestionReviewList } from './EventRegistrationFormStep';
import {
  CAMPAIGN_CHANNELS,
  CUSTOMER_CATEGORIES,
  CUSTOMER_COLLECTIONS,
  formatEventTime,
  formatReachCount,
  getCtaDestinationType,
  LEAD_QUESTION_TYPES,
  PROMO_VISUAL_OPTIONS,
  resolvePreferredReach,
  SEGMENTATION_FILTER_TYPES,
  TEST_BLAST_SUCCESS,
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

function ReviewBanner({ attachment, label = 'Banner (Optional)', emptyLabel = 'No banner uploaded' }) {
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
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

function CustomerViewModal({
  isOpen,
  onClose,
  form,
  template,
  templateMode,
  isLeadGeneration,
  isEventActivation,
}) {
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
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-[#717171] hover:bg-[#F7F8FF] hover:text-primary"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="bg-[#FAFBFC] p-5">
          {isLeadGeneration ? (
            <FormPreview title={form.headline} intro={form.body} questions={form.leadQuestions} />
          ) : isEventActivation ? (
            <EventGuestPreview form={form} />
          ) : (
            <CampaignMobilePreview
              channel={form.channel}
              headline={form.headline}
              body={form.body}
              cta={form.cta}
              templateMode={templateMode}
              accent={template?.accent}
              products={template?.products}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LeadQuestionReviewCard({ item, index }) {
  const meta = LEAD_QUESTION_TYPES[item.type];
  const style = LEAD_QUESTION_TYPE_META[item.type];
  const Icon = style.icon;

  return (
    <div className="flex items-start gap-3 rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-3">
      <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-sm', style.accent)}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0B0]">
          Q{index + 1} · {meta.shortLabel}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-[#0B1354]">
          {item.type === 'terms' ? item.checkboxLabel : item.question}
        </p>
        {item.type === 'multipleChoice' || item.type === 'singleChoice' ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.options.map((option) => (
              <span
                key={option}
                className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#545454] ring-1 ring-[#EEF0F4]"
              >
                {option}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CampaignReviewStage({
  form,
  scanStats,
  template,
  templateMode,
  isLeadGeneration = false,
  isEventActivation = false,
  isSalesConversion = false,
  isServiceAlerts = false,
  usesCtaDestination = false,
  onBack,
  onEdit,
  onProceed,
  onTestBlast,
}) {
  const [customerViewOpen, setCustomerViewOpen] = useState(false);
  const [showTestBlast, setShowTestBlast] = useState(false);
  const [testBlastSuccessOpen, setTestBlastSuccessOpen] = useState(false);

  const channelLabel =
    CAMPAIGN_CHANNELS.find((item) => item.id === form.channel)?.label || form.channel;
  const messageLabel =
    form.channel === 'email'
      ? 'Email Message'
      : form.channel === 'whatsapp'
        ? 'WhatsApp Message'
        : form.channel === 'push'
          ? 'Push Notification'
          : 'SMS Message';
  const preferredReach = resolvePreferredReach(form, scanStats);
  const primaryAttachment = form.attachments[0];
  const bannerAsset = isSalesConversion ? form.banner : primaryAttachment;
  const promoVisualLabel =
    PROMO_VISUAL_OPTIONS.find((item) => item.id === primaryAttachment?.promoVisual)?.label || '—';
  const categoryLabel =
    CUSTOMER_CATEGORIES.find((item) => item.id === form.customerCategory)?.label || '—';
  const collectionLabel =
    CUSTOMER_COLLECTIONS.find((item) => item.id === form.collection)?.label || '—';
  const customerSourceLabel =
    form.customerSource === 'internal'
      ? 'Customer Management (Internal)'
      : 'External';

  const handleTestBlastProceed = (contacts) => {
    onTestBlast?.(contacts);
    setShowTestBlast(false);
    setTestBlastSuccessOpen(true);
  };

  const closeTestBlastSuccess = () => {
    setTestBlastSuccessOpen(false);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#717171] transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </button>

        <h1 className="text-center text-xl font-bold text-[#0B1354] sm:text-2xl">Preview & Review</h1>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
        >
          <Pencil className="h-4 w-4" strokeWidth={2} />
          Edit
        </button>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)]">
        <div className="space-y-8 p-5 sm:p-8">
          <section>
            <SectionTitle>{isLeadGeneration ? 'Lead Capture Form' : 'Message & Primary Asset'}</SectionTitle>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#0B1354]">Promotion Channel</p>
                <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0B1354]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  {channelLabel}
                </label>
              </div>

              {isLeadGeneration ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewField label="Form Title" value={form.headline} />
                    <ReviewField label="Invitation Message" value={form.body} />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0B1354]">Form Questions</p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <ListChecks className="h-3 w-3" strokeWidth={2.5} />
                        {form.leadQuestions.length}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {form.leadQuestions.map((item, index) => (
                        <LeadQuestionReviewCard key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ReviewField label={messageLabel} value={form.body} multiline />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewField
                      label={isEventActivation ? 'Event Title' : 'Title'}
                      value={form.headline}
                    />
                    <ReviewField label="Call to Action" value={form.cta} />
                    {usesCtaDestination ? (
                      <>
                        <ReviewField
                          label="CTA Destination"
                          value={getCtaDestinationType(form.ctaType).label}
                        />
                        <ReviewField
                          label={getCtaDestinationType(form.ctaType).label}
                          value={form.ctaValue}
                        />
                      </>
                    ) : null}
                    <ReviewField
                      label={isEventActivation ? 'Event Description' : 'Description'}
                      value={form.description || form.body}
                      multiline
                      className={
                        isEventActivation || isServiceAlerts || usesCtaDestination
                          ? 'sm:col-span-2'
                          : undefined
                      }
                    />
                    {isEventActivation || isServiceAlerts ? null : (
                      <ReviewBanner
                        attachment={bannerAsset}
                        label="Banner (Optional)"
                        emptyLabel="No banner uploaded"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {isEventActivation ? (
            <>
              <section>
                <SectionTitle>Event Details</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField
                    label="Event Visual Creative"
                    value={
                      PROMO_VISUAL_OPTIONS.find((item) => item.id === primaryAttachment?.promoVisual)
                        ?.label || '—'
                    }
                  />
                  <ReviewField label="Event Venue" value={form.event?.venue} />
                  <ReviewField
                    label="Event Start"
                    value={
                      form.event?.startDate
                        ? `${formatDisplayDate(form.event.startDate)} · ${formatEventTime(form.event.startTime)}`
                        : '—'
                    }
                  />
                  <ReviewField
                    label="Event End"
                    value={
                      form.event?.endDate
                        ? `${formatDisplayDate(form.event.endDate)} · ${formatEventTime(form.event.endTime)}`
                        : '—'
                    }
                  />
                  <ReviewField
                    label="RSVP website"
                    value={
                      form.event?.hasRsvpWebsite === 'yes'
                        ? form.event.rsvpUrl || 'Yes'
                        : 'No'
                    }
                  />
                  <ReviewField
                    label="Entry fee"
                    value={form.event?.hasEntryFee === 'yes' ? 'Yes' : 'No'}
                  />
                  <div className="sm:col-span-2">
                    <p className="mb-1.5 text-sm font-semibold text-[#0B1354]">Creative preview</p>
                    <PromoVisualPreview
                      promoVisual={primaryAttachment?.promoVisual || 'image'}
                      previewUrl={primaryAttachment?.previewUrl}
                      fileName={primaryAttachment?.fileName}
                      fileMimeType={primaryAttachment?.fileMimeType}
                      emptyLabel="No event visual uploaded"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-[#0B1354]">Tickets</p>
                  {form.event?.tickets?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {form.event.tickets.map((ticket) => (
                        <div key={ticket.id} className="rounded-lg border border-[#EEF0F4] bg-[#FAFBFC] px-4 py-3">
                          <p className="text-sm font-semibold text-[#0B1354]">{ticket.title}</p>
                          <p className="mt-1 text-xs text-[#717171]">
                            {ticket.price ? `${ticket.currency} ${ticket.price}` : 'Free'}
                            {ticket.slots ? ` · ${ticket.slots} slots` : ''}
                          </p>
                          {ticketIncludedItems(ticket.included).length ? (
                            <ul className="mt-1.5 space-y-0.5 text-xs text-[#545454]">
                              {ticketIncludedItems(ticket.included).map((item, index) => (
                                <li key={`${item}-${index}`}>{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-[#E4E8EF] px-4 py-5 text-center text-sm text-[#717171]">
                      No tickets added
                    </p>
                  )}
                </div>
              </section>

              <section>
                <SectionTitle>Registration Form</SectionTitle>
                <EventQuestionReviewList questions={form.registrationQuestions} />
              </section>
            </>
          ) : (
          <section>
            <SectionTitle>Attachment</SectionTitle>

            {form.attachments.map((attachment, index) => (
              <div key={attachment.id} className={index > 0 ? 'mt-6 border-t border-[#EEF0F4] pt-6' : ''}>
                {form.attachments.length > 1 ? (
                  <p className="mb-4 text-sm font-semibold text-[#0B1354]">
                    Attachment {index + 1}
                  </p>
                ) : null}

                {isServiceAlerts ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewField label="Ads Visuals" value={promoVisualLabel} />
                    <ReviewBanner
                      attachment={attachment}
                      label="Attachment"
                      emptyLabel="No attachment uploaded"
                    />
                    <ReviewField label="Support Contact" value={form.supportContact} />
                  </div>
                ) : isSalesConversion ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewField
                      label="Product Visuals"
                      value={
                        PROMO_VISUAL_OPTIONS.find((item) => item.id === attachment.promoVisual)
                          ?.label || promoVisualLabel
                      }
                    />
                    <ReviewBanner
                      attachment={attachment}
                      label="Attachment"
                      emptyLabel="No attachment uploaded"
                    />
                    <ReviewField label="Price" value={attachment.price} />
                    <ReviewField
                      label="Discounted Price (Optional)"
                      value={attachment.discountedPrice}
                    />
                    <ReviewField
                      label="End Date"
                      value={formatDisplayDate(attachment.promoExpiryDate)}
                    />
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewField
                      label="Promo Visuals"
                      value={
                        PROMO_VISUAL_OPTIONS.find((item) => item.id === attachment.promoVisual)
                          ?.label || promoVisualLabel
                      }
                    />
                    <ReviewField
                      label="Voucher / Promo Code (Optional)"
                      value={attachment.voucherCode}
                    />
                    <ReviewBanner attachment={attachment} />
                    <ReviewField
                      label="Promo Expiry Date"
                      value={formatDisplayDate(attachment.promoExpiryDate)}
                    />
                    <ReviewField label="Price" value={attachment.price} />
                    <ReviewField label="Discounted Price" value={attachment.discountedPrice} />
                  </div>
                )}
              </div>
            ))}
          </section>
          )}

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

              {form.customerSource === 'internal' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField label="Customer Category" value={categoryLabel} />
                  <ReviewField label="Collection" value={collectionLabel} />
                </div>
              ) : (
                <ReviewField label="Uploaded List" value={form.externalListFileName} />
              )}

              <div>
                <p className="mb-3 text-sm font-semibold text-[#0B1354]">Customer Segmentation</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {form.segmentFilters.map((filter) => (
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
                  value={formatReachCount(scanStats.estimatedReach)}
                  icon={Ticket}
                  tone="peach"
                />
                <ReachStatCard
                  label="Preferred Reach"
                  value={formatReachCount(preferredReach)}
                  icon={Rocket}
                  tone="blue"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-[#F0F2F7] px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowTestBlast(true)}
              className="cursor-pointer rounded-sm border border-primary px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
            >
              Test Blast
            </button>

            <button
              type="button"
              onClick={onProceed}
              className="cursor-pointer rounded-sm bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] sm:ml-auto"
            >
              Proceed to Launch
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCustomerViewOpen(true)}
            className="mx-auto mt-5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
            Customer View
          </button>
        </div>
      </div>

      <CustomerViewModal
        isOpen={customerViewOpen}
        onClose={() => setCustomerViewOpen(false)}
        form={form}
        template={template}
        templateMode={templateMode}
        isLeadGeneration={isLeadGeneration}
        isEventActivation={isEventActivation}
      />

      <TestBlastModal
        isOpen={showTestBlast}
        onClose={() => setShowTestBlast(false)}
        channel={form.channel}
        onProceed={handleTestBlastProceed}
      />

      <CampaignSuccessModal
        isOpen={testBlastSuccessOpen}
        onClose={closeTestBlastSuccess}
        onAction={closeTestBlastSuccess}
        variant="test-blast"
        {...TEST_BLAST_SUCCESS}
      />
    </div>
  );
}
