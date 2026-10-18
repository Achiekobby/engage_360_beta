import { useFormikContext } from 'formik';
import { IPhoneMockup } from 'react-device-mockup';
import {
  ImageIcon,
  Link2,
  Mail,
  MessageCircle,
  MessageSquareText,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CTA_OPTIONS, getChannelLabel } from './settingsData';
import { useSettingsKindCopy } from './settingsKindContext';

const CHANNEL_THEME = {
  sms: {
    icon: MessageSquareText,
    label: 'Messages',
    shell: 'from-[#E8EEFF] via-[#F4F6FB] to-[#EEF2FF]',
    accent: 'text-[#3A10CD]',
    badge: 'bg-[#EEF2FF] text-[#3A10CD]',
    bubble: 'bg-[#EEF2FF] text-[#0B1354]',
    cta: 'bg-primary text-white',
    appBar: 'bg-white',
  },
  email: {
    icon: Mail,
    label: 'Mail',
    shell: 'from-[#FFF6EE] via-[#FFFBF7] to-[#FFF1E6]',
    accent: 'text-[#C2410C]',
    badge: 'bg-[#FFF4E8] text-[#C2410C]',
    bubble: 'bg-white text-[#0B1354]',
    cta: 'bg-[#C2410C] text-white',
    appBar: 'bg-[#FFF8F1]',
  },
  whatsapp: {
    icon: MessageCircle,
    label: 'WhatsApp',
    shell: 'from-[#DCF8C6] via-[#ECE5DD] to-[#E8F8EF]',
    accent: 'text-[#128C7E]',
    badge: 'bg-[#E8F8EF] text-[#128C7E]',
    bubble: 'bg-white text-[#0B1354]',
    cta: 'bg-[#25D366] text-white',
    appBar: 'bg-[#075E54]',
  },
};

function ctaLabel(values) {
  if (values.callToAction === 'other') {
    return values.customCtaLabel?.trim() || 'Custom action';
  }
  return CTA_OPTIONS.find((option) => option.value === values.callToAction)?.label || '';
}

function MediaBlock({ src, label, tall = false }) {
  if (src) {
    return (
      <div
        className={clsx(
          'overflow-hidden rounded-sm border border-black/5 bg-[#F0F2F7]',
          tall ? 'h-28' : 'h-20',
        )}
      >
        <img src={src} alt={label} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-[#D4D7E0] bg-[#F0F2F7] text-[#9AA0B5]',
        tall ? 'h-28' : 'h-20',
      )}
    >
      <ImageIcon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[9px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function SmsLink({ label, href }) {
  if (!href) return null;
  return (
    <div className="flex items-start gap-1 text-[10px] leading-relaxed text-[#3A10CD]">
      <Link2 className="mt-0.5 h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
      <span>
        <span className="font-semibold text-[#0B1354]">{label}: </span>
        <span className="break-all underline decoration-[#3A10CD]/35">{href}</span>
      </span>
    </div>
  );
}

function PreviewBody({ values, theme, emptyMessage }) {
  const channel = values.channel || 'sms';
  const setup = values.offerSetup || 'offer-setup';
  const title = values.title?.trim() || 'Offer title';
  const message = values.message?.trim() || emptyMessage;
  const action = ctaLabel(values);
  const showOffer = setup === 'offer-setup';
  const showAttachment = setup === 'attachment-only' || (showOffer && values.attachmentPreviewUrl);
  const bannerSrc = values.bannerPreviewUrl;
  const attachmentSrc = values.attachmentPreviewUrl;

  if (channel === 'email') {
    return (
      <div className="space-y-3 p-3">
        <div className="rounded-sm border border-[#E8EAF0] bg-white p-3 shadow-sm">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[#717171]">Subject</p>
          <p className="mt-1 text-xs font-bold text-[#0B1354]">{title}</p>
          <div className="mt-3 space-y-2.5">
            {showOffer ? <MediaBlock src={bannerSrc} label="Banner" tall /> : null}
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-[#3F4466]">
              {message}
            </p>
            {showOffer && values.description ? (
              <div className="rounded-sm bg-[#FFF8F1] px-2.5 py-2">
                <p className="text-[10px] font-semibold text-[#0B1354]">Offer</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[#5B5F7B]">
                  {values.description}
                </p>
                {values.voucherCode ? (
                  <p className="mt-1 text-[10px] font-semibold text-[#C2410C]">
                    Code: {values.voucherCode}
                  </p>
                ) : null}
                {values.price || values.discountedPrice ? (
                  <p className="mt-1 text-[10px] font-semibold text-[#0B1354]">
                    {values.discountedPrice ? `₵${values.discountedPrice}` : null}
                    {values.price &&
                    values.discountedPrice &&
                    Number(values.discountedPrice) < Number(values.price) ? (
                      <span className="ml-1 text-[#717171] line-through">₵{values.price}</span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            ) : null}
            {showAttachment || setup === 'attachment-only' ? (
              <MediaBlock
                src={attachmentSrc}
                label={values.attachmentType === 'video' ? 'Video' : 'Attachment'}
              />
            ) : null}
            {action ? (
              <span
                className={clsx(
                  'inline-flex rounded-sm px-3 py-1.5 text-[10px] font-semibold',
                  theme.cta,
                )}
              >
                {action}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (channel === 'whatsapp') {
    return (
      <div className="space-y-2 p-3">
        <div className="ml-auto max-w-[94%] overflow-hidden rounded-2xl rounded-tr-md bg-white shadow-sm">
          {showOffer ? <MediaBlock src={bannerSrc} label="Banner" tall /> : null}
          {setup === 'attachment-only' ? (
            <MediaBlock
              src={attachmentSrc}
              label={values.attachmentType === 'video' ? 'Video' : 'Attachment'}
              tall
            />
          ) : null}
          <div className="space-y-2 px-3 py-2.5">
            <p className="text-xs font-bold text-[#0B1354]">{title}</p>
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-[#3F4466]">
              {message}
            </p>
            {showOffer && (values.voucherCode || values.discountedPrice) ? (
              <div className="flex flex-wrap gap-1">
                {values.voucherCode ? (
                  <span className="rounded-sm bg-[#E8F8EF] px-1.5 py-0.5 text-[9px] font-semibold text-[#128C7E]">
                    {values.voucherCode}
                  </span>
                ) : null}
                {values.discountedPrice ? (
                  <span className="rounded-sm bg-[#F0F2F7] px-1.5 py-0.5 text-[9px] font-semibold text-[#0B1354]">
                    ₵{values.discountedPrice}
                  </span>
                ) : null}
              </div>
            ) : null}
            {showOffer && attachmentSrc ? (
              <MediaBlock src={attachmentSrc} label="Attachment" />
            ) : null}
            {action ? (
              <div
                className={clsx(
                  'rounded-sm px-2.5 py-1.5 text-center text-[10px] font-semibold',
                  theme.cta,
                )}
              >
                {action}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      <div className={clsx('rounded-2xl rounded-tl-md px-3 py-2.5', theme.bubble)}>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-[#3F4466]">
          {message}
        </p>
        <div className="mt-2 space-y-1 border-t border-[#D9DFF8] pt-2">
          {showOffer ? (
            <>
              <SmsLink label="Offer" href={values.ctaLink || 'https://example.com/offer'} />
              {(values.offerVisual && values.offerVisual !== 'none') || attachmentSrc ? (
                <SmsLink
                  label="Image"
                  href={values.ctaLink || 'https://example.com/media/offer.jpg'}
                />
              ) : null}
            </>
          ) : null}
          {setup === 'attachment-only' ? (
            <SmsLink
              label="Attachment"
              href={values.ctaLink || 'https://example.com/media/attachment'}
            />
          ) : null}
          {setup === 'message-only' && values.ctaLink ? (
            <SmsLink label="Link" href={values.ctaLink} />
          ) : null}
        </div>
      </div>
      {action ? (
        <div
          className={clsx(
            'rounded-full px-3 py-1.5 text-center text-[10px] font-semibold',
            theme.cta,
          )}
        >
          {action}
        </div>
      ) : null}
      <p className="px-1 text-center text-[9px] leading-relaxed text-[#717171]">
        SMS delivers media as links.
      </p>
    </div>
  );
}

export default function AutomationCustomerPreview({
  variant = 'panel',
  screenWidth = 250,
  showHeader = true,
}) {
  const { values } = useFormikContext();
  const { previewEmptyMessage } = useSettingsKindCopy();
  const channel = values.channel || 'sms';
  const theme = CHANNEL_THEME[channel] || CHANNEL_THEME.sms;
  const ChannelIcon = theme.icon;
  const channelLabel = getChannelLabel(channel);
  const isDrawer = variant === 'drawer';

  const phone = (
    <div
      className={clsx(
        'flex justify-center rounded-sm bg-gradient-to-b px-2 py-5',
        theme.shell,
      )}
    >
      <IPhoneMockup
        screenWidth={screenWidth}
        screenType="island"
        frameColor="#1C1C1E"
        statusbarColor="#FFFFFF"
        hideStatusBar
        hideNavBar
      >
        <div className="flex h-full min-h-0 flex-col bg-white">
          <div
            className={clsx(
              'flex items-center gap-2 border-b border-black/5 px-3 pb-2.5 pt-11',
              theme.appBar,
              channel === 'whatsapp' && 'text-white',
            )}
          >
            <ChannelIcon
              className={clsx('h-4 w-4', channel === 'whatsapp' ? 'text-white' : theme.accent)}
              strokeWidth={2.25}
            />
            <div className="min-w-0">
              <p
                className={clsx(
                  'truncate text-xs font-bold',
                  channel === 'whatsapp' ? 'text-white' : 'text-[#0B1354]',
                )}
              >
                {theme.label}
              </p>
              <p
                className={clsx(
                  'truncate text-[10px]',
                  channel === 'whatsapp' ? 'text-white/75' : 'text-[#717171]',
                )}
              >
                Your business
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <PreviewBody
              values={values}
              theme={theme}
              emptyMessage={previewEmptyMessage}
            />
          </div>
        </div>
      </IPhoneMockup>
    </div>
  );

  if (isDrawer) {
    return (
      <div className="space-y-4">
        {showHeader ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[#717171]">Live view as you edit</p>
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                theme.badge,
              )}
            >
              <ChannelIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              {channelLabel}
            </span>
          </div>
        ) : null}
        {phone}
      </div>
    );
  }

  return (
    <aside
      className={clsx(
        'rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-[0_8px_28px_rgba(11,19,84,0.06)]',
        'lg:sticky lg:top-20',
      )}
    >
      {showHeader ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#0B1354]">Customer preview</p>
            <p className="mt-0.5 text-xs text-[#717171]">Live view as you edit</p>
          </div>
          <span
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
              theme.badge,
            )}
          >
            <ChannelIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
            {channelLabel}
          </span>
        </div>
      ) : null}
      {phone}
    </aside>
  );
}
