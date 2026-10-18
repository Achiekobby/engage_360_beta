import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  Link2,
  Mail,
  MessageCircle,
  MessageSquareText,
} from 'lucide-react';
import { clsx } from 'clsx';
import SlideDrawer from '../customers/SlideDrawer';
import {
  CTA_OPTIONS,
  TEMPLATE_SETUP_FILTERS,
  getChannelLabel,
  getMessageTemplatesForChannel,
  getOfferSetupLabel,
} from './settingsData';

const TEMPLATES_PAGE_SIZE = 4;

function ctaLabel(value) {
  return CTA_OPTIONS.find((option) => option.value === value)?.label || value;
}

const CHANNEL_META = {
  sms: {
    icon: MessageSquareText,
    accent: 'bg-[#EEF2FF] text-[#3A10CD]',
    previewLabel: 'SMS preview',
  },
  email: {
    icon: Mail,
    accent: 'bg-[#FFF4E8] text-[#C2410C]',
    previewLabel: 'Email preview',
  },
  whatsapp: {
    icon: MessageCircle,
    accent: 'bg-[#E8F8EF] text-[#128C7E]',
    previewLabel: 'WhatsApp preview',
  },
};

function MediaPlaceholder({ label = 'Image', tall = false }) {
  return (
    <div
      className={clsx(
        'flex w-full flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-[#D4D7E0] bg-[#F0F2F7] text-[#9AA0B5]',
        tall ? 'h-28' : 'h-20',
      )}
    >
      <ImageIcon className="h-6 w-6" strokeWidth={1.75} />
      <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function SmsLinkRow({ label, href }) {
  if (!href) return null;
  return (
    <div className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#3A10CD]">
      <Link2 className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2.25} />
      <span>
        <span className="font-semibold text-[#0B1354]">{label}: </span>
        <span className="break-all underline decoration-[#3A10CD]/40">{href}</span>
      </span>
    </div>
  );
}

function OfferMetaChips({ template }) {
  if (template.offerSetup !== 'offer-setup') return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {template.voucherCode ? (
        <span className="rounded-sm bg-[#F0F2F7] px-2 py-1 text-[10px] font-semibold text-[#0B1354]">
          Code: {template.voucherCode}
        </span>
      ) : null}
      {template.discountedPrice != null && template.price != null ? (
        <span className="rounded-sm bg-[#F0F2F7] px-2 py-1 text-[10px] font-semibold text-[#0B1354]">
          {template.discountedPrice === '0' || template.discountedPrice === 0
            ? 'Free'
            : `₵${template.discountedPrice}`}
          {template.price && Number(template.discountedPrice) < Number(template.price) ? (
            <span className="ml-1 text-[#717171] line-through">₵{template.price}</span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

function TemplateChannelPreview({ channel, template }) {
  if (!template) {
    return (
      <div className="flex h-full min-h-[20rem] items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-[#FAFBFC] px-6 text-center">
        <p className="text-sm text-[#717171]">Select a template to preview how it will look.</p>
      </div>
    );
  }

  const setup = template.offerSetup || 'message-only';
  const showOfferMedia = setup === 'offer-setup';
  const showAttachmentMedia = setup === 'attachment-only' || (setup === 'offer-setup' && template.hasAttachment);
  const attachmentLabel =
    template.attachmentType === 'video' ? 'Video' : template.attachmentType === 'gif' ? 'GIF' : 'Image';

  if (channel === 'email') {
    return (
      <div className="overflow-hidden rounded-sm border border-[#E4E4E7] bg-white shadow-[0_8px_24px_rgba(11,19,84,0.06)]">
        <div className="border-b border-[#F0F2F7] bg-[#FAFBFC] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#717171]">Subject</p>
          <p className="mt-1 text-sm font-bold text-[#0B1354]">{template.title}</p>
        </div>
        <div className="space-y-3 px-4 py-5">
          {showOfferMedia && template.hasBanner !== false ? (
            <MediaPlaceholder label="Banner" tall />
          ) : null}
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#3F4466]">
            {template.message}
          </p>
          {showOfferMedia ? (
            <div className="rounded-sm border border-[#EDE8F8] bg-[#F7F8FF] px-3 py-2.5">
              <p className="text-xs font-bold text-[#0B1354]">Offer details</p>
              {template.description ? (
                <p className="mt-1 text-[11px] leading-relaxed text-[#5B5F7B]">
                  {template.description}
                </p>
              ) : null}
              <div className="mt-2">
                <OfferMetaChips template={template} />
              </div>
            </div>
          ) : null}
          {showAttachmentMedia ? <MediaPlaceholder label={attachmentLabel} /> : null}
          {template.callToAction ? (
            <span className="inline-flex rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-white">
              {ctaLabel(template.callToAction)}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (channel === 'whatsapp') {
    return (
      <div className="rounded-sm border border-[#E4E4E7] bg-[#ECE5DD] p-4">
        <div className="ml-auto max-w-[94%] overflow-hidden rounded-2xl rounded-tr-md bg-white shadow-sm">
          {showOfferMedia && template.hasBanner !== false ? (
            <MediaPlaceholder label="Banner" tall />
          ) : null}
          {showAttachmentMedia && setup === 'attachment-only' ? (
            <MediaPlaceholder label={attachmentLabel} tall />
          ) : null}
          <div className="border-b border-[#F0F2F7] px-3.5 py-2.5">
            <p className="text-sm font-bold text-[#0B1354]">{template.title}</p>
          </div>
          <div className="space-y-3 px-3.5 py-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#3F4466]">
              {template.message}
            </p>
            {showOfferMedia ? <OfferMetaChips template={template} /> : null}
            {showAttachmentMedia && setup === 'offer-setup' ? (
              <MediaPlaceholder label={attachmentLabel} />
            ) : null}
            {template.callToAction ? (
              <div className="rounded-sm border border-[#25D366]/35 bg-[#E8F8EF] px-3 py-2 text-center text-xs font-semibold text-[#128C7E]">
                {ctaLabel(template.callToAction)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-[#E4E4E7] bg-[#F4F5F7] p-4">
      <div className="mx-auto max-w-[20rem] overflow-hidden rounded-[1.75rem] border-[6px] border-[#0B1354] bg-white shadow-[0_12px_28px_rgba(11,19,84,0.12)]">
        <div className="flex items-center justify-center border-b border-[#F0F2F7] bg-[#FAFBFC] py-2">
          <span className="h-1.5 w-16 rounded-full bg-[#E4E4E7]" />
        </div>
        <div className="space-y-2.5 px-3.5 py-4">
          <div className="rounded-2xl rounded-tl-md bg-[#EEF2FF] px-3.5 py-3">
            <p className="text-xs font-bold text-[#0B1354]">{template.title}</p>
            <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-[#3F4466]">
              {template.message}
            </p>
            <div className="mt-2.5 space-y-1.5 border-t border-[#D9DFF8] pt-2.5">
              {setup === 'offer-setup' ? (
                <>
                  <SmsLinkRow label="Offer" href={template.offerLink || template.ctaLink} />
                  <SmsLinkRow label="Image" href={template.attachmentLink} />
                </>
              ) : null}
              {setup === 'attachment-only' ? (
                <SmsLinkRow label="Attachment" href={template.attachmentLink || template.ctaLink} />
              ) : null}
              {setup === 'message-only' && template.ctaLink ? (
                <SmsLinkRow label="Link" href={template.ctaLink} />
              ) : null}
            </div>
          </div>
          {template.callToAction ? (
            <div className="rounded-full bg-primary px-3 py-2 text-center text-[11px] font-semibold text-white">
              {ctaLabel(template.callToAction)}
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-[#717171]">
        SMS cannot render images — offer and attachment are delivered as links.
      </p>
    </div>
  );
}

export default function MessageTemplateDrawer({
  isOpen,
  onClose,
  onUse,
  channel = 'sms',
  kindId = 'birthday',
  activeTemplateId = '',
}) {
  const [setupFilter, setSetupFilter] = useState('all');
  const [previewId, setPreviewId] = useState('');
  const [page, setPage] = useState(1);

  const templates = useMemo(
    () => getMessageTemplatesForChannel(channel, setupFilter, kindId),
    [channel, setupFilter, kindId],
  );

  const totalPages = Math.max(1, Math.ceil(templates.length / TEMPLATES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * TEMPLATES_PAGE_SIZE;
  const pageTemplates = useMemo(
    () => templates.slice(pageStart, pageStart + TEMPLATES_PAGE_SIZE),
    [templates, pageStart],
  );
  const rangeStart = templates.length ? pageStart + 1 : 0;
  const rangeEnd = Math.min(pageStart + TEMPLATES_PAGE_SIZE, templates.length);

  useEffect(() => {
    if (!isOpen) return;
    setSetupFilter('all');
  }, [isOpen, channel, kindId]);

  useEffect(() => {
    if (!isOpen) return;

    const activeIndex = templates.findIndex((item) => item.id === activeTemplateId);
    if (activeIndex >= 0) {
      setPreviewId(activeTemplateId);
      setPage(Math.floor(activeIndex / TEMPLATES_PAGE_SIZE) + 1);
      return;
    }

    setPage(1);
    setPreviewId(templates[0]?.id || '');
  }, [isOpen, channel, kindId, setupFilter, activeTemplateId, templates]);

  useEffect(() => {
    if (!isOpen || !pageTemplates.length) return;
    if (!pageTemplates.some((item) => item.id === previewId)) {
      setPreviewId(pageTemplates[0].id);
    }
  }, [isOpen, currentPage, pageTemplates, previewId]);

  const previewTemplate = templates.find((item) => item.id === previewId) || null;
  const channelLabel = getChannelLabel(channel);
  const meta = CHANNEL_META[channel] || CHANNEL_META.sms;
  const ChannelIcon = meta.icon;

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${channelLabel} templates`}
      subtitle={
        kindId === 'welcome'
          ? 'Welcome Message templates by Offer Setup, Attachment Only, or Message only. Preview, then use to fill the form.'
          : kindId === 'anniversary'
            ? 'Customer Anniversary templates by Offer Setup, Attachment Only, or Message only. Preview, then use to fill the form.'
            : kindId === 'holidays'
              ? 'Holiday & Festive Seasons templates by Offer Setup, Attachment Only, or Message only. Preview, then use to fill the form.'
              : 'Filter by Offer Setup, Attachment Only, or Message only. Preview, then use to fill the form.'
      }
      maxWidth="max-w-7xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-xs text-[#717171]">
            Using a template loads channel message fields and the matching additional set-up type. Uploads stay
            empty so you can add your own media.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!previewTemplate}
              onClick={() => {
                if (!previewTemplate) return;
                onUse?.(previewTemplate);
              }}
              className="cursor-pointer rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Use template
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                meta.accent,
              )}
            >
              <ChannelIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              {channelLabel}
            </span>
            <p className="text-xs text-[#717171]">{templates.length} templates</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {TEMPLATE_SETUP_FILTERS.map((filter) => {
              const active = setupFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSetupFilter(filter.value)}
                  className={clsx(
                    'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-[#E4E4E7] bg-white text-[#717171] hover:border-primary/30 hover:text-[#0B1354]',
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {pageTemplates.map((template) => {
              const selected = previewId === template.id;
              const inUse = activeTemplateId === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setPreviewId(template.id)}
                  className={clsx(
                    'w-full cursor-pointer rounded-sm border px-4 py-3.5 text-left transition-all',
                    selected
                      ? 'border-primary bg-[#F7F8FF] shadow-[0_4px_16px_rgba(58,16,205,0.08)]'
                      : 'border-[#E4E4E7] bg-white hover:border-primary/30 hover:bg-[#FAFBFC]',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                        <p className="text-sm font-bold text-[#0B1354]">{template.name}</p>
                        {inUse ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            In use
                          </span>
                        ) : null}
                      </div>
                      <span className="mt-2 inline-flex rounded-sm bg-[#F0F2F7] px-2 py-0.5 text-[10px] font-semibold text-[#5B5F7B]">
                        {getOfferSetupLabel(template.offerSetup)}
                      </span>
                      <p className="mt-1.5 text-sm font-semibold text-[#0B1354]">{template.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#717171]">
                        {template.message}
                      </p>
                      <p className="mt-2 text-[11px] font-medium text-primary">
                        CTA: {ctaLabel(template.callToAction)}
                      </p>
                    </div>

                    {selected ? (
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {!templates.length ? (
            <div className="rounded-sm border border-dashed border-[#E4E4E7] bg-[#FAFBFC] px-4 py-8 text-center text-sm text-[#717171]">
              No templates for this filter.
            </div>
          ) : (
            <div className="flex flex-col gap-3 border-t border-[#EEF0F4] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#717171]">
                Showing{' '}
                <span className="font-semibold text-[#0B1354]">
                  {rangeStart}–{rangeEnd}
                </span>{' '}
                of <span className="font-semibold text-[#0B1354]">{templates.length}</span> templates
              </p>

              {totalPages > 1 ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous templates page"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={clsx(
                        'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors',
                        currentPage === pageNumber
                          ? 'bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.25)]'
                          : 'border border-[#E4E4E7] bg-white text-[#717171] hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary',
                      )}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next templates page"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="xl:sticky xl:top-0 xl:self-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-[#0B1354]">{meta.previewLabel}</p>
            {previewTemplate ? (
              <p className="truncate text-xs text-[#717171]">
                {getOfferSetupLabel(previewTemplate.offerSetup)} · {previewTemplate.name}
              </p>
            ) : null}
          </div>
          <TemplateChannelPreview channel={channel} template={previewTemplate} />

          {previewTemplate ? (
            <div className="mt-4 rounded-sm border border-[#EDE8F8] bg-[#F7F8FF] px-3.5 py-3">
              <p className="text-xs font-semibold text-[#0B1354]">Will load into the form</p>
              <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-[#5B5F7B]">
                <li>
                  <span className="font-medium text-[#0B1354]">Set-up:</span>{' '}
                  {getOfferSetupLabel(previewTemplate.offerSetup)}
                </li>
                <li>
                  <span className="font-medium text-[#0B1354]">Title:</span> {previewTemplate.title}
                </li>
                <li>
                  <span className="font-medium text-[#0B1354]">CTA:</span>{' '}
                  {ctaLabel(previewTemplate.callToAction)}
                </li>
                {previewTemplate.offerSetup === 'offer-setup' ? (
                  <li>
                    <span className="font-medium text-[#0B1354]">Offer:</span>{' '}
                    {previewTemplate.description || 'Offer details included'}
                  </li>
                ) : null}
                {previewTemplate.offerSetup === 'attachment-only' ? (
                  <li>
                    <span className="font-medium text-[#0B1354]">Attachment:</span>{' '}
                    {previewTemplate.attachmentType || 'image'}
                    {channel === 'sms' && previewTemplate.attachmentLink
                      ? ` · ${previewTemplate.attachmentLink}`
                      : ''}
                  </li>
                ) : null}
                <li className="line-clamp-2">
                  <span className="font-medium text-[#0B1354]">Message:</span> {previewTemplate.message}
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </SlideDrawer>
  );
}
