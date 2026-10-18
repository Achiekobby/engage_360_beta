import {
  ImageIcon,
  Link2,
  Mail,
  MessageCircle,
  MessageSquareText,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  CTA_OPTIONS,
  getChannelLabel,
  getOptionLabel,
} from './overviewSettingsData';

const CHANNEL_THEME = {
  sms: {
    icon: MessageSquareText,
    label: 'Messages',
    shell: 'from-[#E8EEFF] via-[#F4F6FB] to-[#EEF2FF]',
    badge: 'bg-[#EEF2FF] text-[#3A10CD]',
    bubble: 'bg-[#EEF2FF] text-[#0B1354]',
    cta: 'bg-primary text-white',
    appBar: 'bg-white text-[#0B1354]',
  },
  email: {
    icon: Mail,
    label: 'Mail',
    shell: 'from-[#FFF6EE] via-[#FFFBF7] to-[#FFF1E6]',
    badge: 'bg-[#FFF4E8] text-[#C2410C]',
    bubble: 'bg-white text-[#0B1354]',
    cta: 'bg-[#C2410C] text-white',
    appBar: 'bg-[#FFF8F1] text-[#0B1354]',
  },
  whatsapp: {
    icon: MessageCircle,
    label: 'WhatsApp',
    shell: 'from-[#DCF8C6] via-[#ECE5DD] to-[#E8F8EF]',
    badge: 'bg-[#E8F8EF] text-[#128C7E]',
    bubble: 'bg-white text-[#0B1354]',
    cta: 'bg-[#25D366] text-white',
    appBar: 'bg-[#075E54] text-white',
  },
};

function ctaLabel(values) {
  if (values.callToAction === 'other') {
    return values.customCtaLabel?.trim() || 'Custom action';
  }
  return getOptionLabel(CTA_OPTIONS, values.callToAction, '');
}

function MediaBlock({ src, label, tall = false }) {
  if (src) {
    return (
      <div
        className={clsx(
          'overflow-hidden rounded-md border border-black/5 bg-[#F0F2F7]',
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
        'flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-[#D4D7E0] bg-[#F0F2F7] text-[#9AA0B5]',
        tall ? 'h-28' : 'h-20',
      )}
    >
      <ImageIcon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[9px] font-semibold uppercase tracking-wide">{label}</span>
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

  return (
    <div className="space-y-2.5 p-3">
      {showOffer && values.bannerPreviewUrl ? (
        <MediaBlock src={values.bannerPreviewUrl} label="Banner" tall />
      ) : null}

      <div className={clsx('rounded-2xl px-3 py-2.5 text-[11px] leading-relaxed shadow-sm', theme.bubble)}>
        {showOffer ? (
          <p className="mb-1 text-[12px] font-bold text-[#0B1354]">{title}</p>
        ) : null}
        <p>{message}</p>
        {values.ctaLink ? (
          <div className="mt-2 flex items-start gap-1 text-[10px] text-[#3A10CD]">
            <Link2 className="mt-0.5 h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
            <span className="break-all underline decoration-[#3A10CD]/35">{values.ctaLink}</span>
          </div>
        ) : null}
      </div>

      {showOffer ? (
        <div className="space-y-2 rounded-xl border border-black/5 bg-white/80 p-2.5">
          {values.attachmentPreviewUrl ? (
            <MediaBlock src={values.attachmentPreviewUrl} label="Offer" />
          ) : null}
          {values.voucherCode ? (
            <p className="text-[10px] font-semibold text-[#0B1354]">
              Code: <span className="text-primary">{values.voucherCode}</span>
            </p>
          ) : null}
          {values.price || values.discountedPrice ? (
            <p className="text-[10px] text-[#717171]">
              {values.discountedPrice ? (
                <>
                  <span className="font-bold text-[#0B1354]">{values.discountedPrice}</span>
                  {values.price ? (
                    <span className="ml-1.5 line-through opacity-60">{values.price}</span>
                  ) : null}
                </>
              ) : (
                <span className="font-bold text-[#0B1354]">{values.price}</span>
              )}
            </p>
          ) : null}
        </div>
      ) : null}

      {action ? (
        <button
          type="button"
          className={clsx(
            'w-full rounded-full px-3 py-2 text-[11px] font-semibold shadow-sm',
            theme.cta,
          )}
        >
          {action}
        </button>
      ) : null}

      <p className="text-center text-[9px] uppercase tracking-wide text-[#9AA0B5]">
        {getChannelLabel(channel)} preview
      </p>
    </div>
  );
}

export default function AutomationCustomerPreview({
  values,
  variant = 'panel',
  emptyMessage = 'Message content will appear here.',
}) {
  const channel = values?.channel || 'sms';
  const theme = CHANNEL_THEME[channel] || CHANNEL_THEME.sms;
  const ChannelIcon = theme.icon;

  return (
    <div
      className={clsx(
        variant === 'panel' ? 'sticky top-6' : '',
        'flex flex-col items-center',
      )}
    >
      <div
        className={clsx(
          'w-full max-w-[280px] overflow-hidden rounded-[2rem] border-[10px] border-[#1a1a1a] bg-white shadow-[0_20px_50px_rgba(11,19,84,0.18)]',
        )}
      >
        <div className={clsx('px-4 pb-2 pt-3', theme.appBar)}>
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-black/15" />
          <div className="flex items-center gap-2">
            <ChannelIcon className="h-4 w-4" strokeWidth={2.25} />
            <div>
              <p className="text-xs font-bold">{theme.label}</p>
              <p className="text-[10px] opacity-70">{values?.businessName || 'Business'}</p>
            </div>
            <span className={clsx('ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold', theme.badge)}>
              {getChannelLabel(channel)}
            </span>
          </div>
        </div>
        <div className={clsx('min-h-[420px] bg-gradient-to-b', theme.shell)}>
          <PreviewBody values={values || {}} theme={theme} emptyMessage={emptyMessage} />
        </div>
      </div>
      {variant === 'panel' ? (
        <p className="mt-3 text-center text-xs text-[#717171]">Live customer view</p>
      ) : null}
    </div>
  );
}
