import { useEffect, useRef, useState } from 'react';
import { IPhoneMockup } from 'react-device-mockup';
import {
  Bell,
  Check,
  CheckCheck,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  ShoppingBag,
  Video,
} from 'lucide-react';
import { clsx } from 'clsx';

const CHANNEL_META = {
  sms: { icon: MessageSquare, label: 'SMS', tint: 'bg-[#E8F4FC] text-[#2E7DAD]' },
  email: { icon: Mail, label: 'Email', tint: 'bg-[#EDE8F8] text-primary' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', tint: 'bg-[#E8F8EF] text-[#128C7E]' },
  push: { icon: Bell, label: 'Push', tint: 'bg-[#FFF4E8] text-[#E67E22]' },
};

function PhoneChrome({ children, tall = false, dense = false, fillHeight = false, expanded = false }) {
  const compactFrame = dense && !expanded;

  return (
    <div
      className={`mx-auto w-full ${
        fillHeight
          ? expanded
            ? 'flex h-full min-h-0 max-w-[21rem] flex-col sm:max-w-[22rem]'
            : 'flex h-full min-h-0 max-w-[17.5rem] flex-col'
          : compactFrame
            ? 'max-w-[13.5rem]'
            : 'max-w-[17.5rem]'
      }`}
    >
      <div className={`relative ${fillHeight ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
        <div
          className={`pointer-events-none absolute rounded-[2.25rem] bg-gradient-to-br from-primary/10 via-transparent to-[#5B9FD4]/15 blur-xl ${
            compactFrame ? '-inset-2' : '-inset-3'
          }`}
          aria-hidden="true"
        />
        <div
          className={`relative overflow-hidden border-[#0B1354] bg-[#0B1354] ${
            compactFrame
              ? 'rounded-[1.65rem] border-[5px] shadow-[0_24px_56px_rgba(11,19,84,0.22)]'
              : 'rounded-[2rem] border-[7px] shadow-[0_28px_64px_rgba(11,19,84,0.28)]'
          } ${fillHeight ? 'flex h-full min-h-0 flex-col' : ''}`}
        >
          <div
            className={`flex shrink-0 items-center justify-between bg-[#0B1354] ${
              compactFrame ? 'px-3.5 pb-1 pt-2' : 'px-5 pb-1.5 pt-2.5'
            }`}
          >
            <span className={`font-semibold text-white/90 ${compactFrame ? 'text-[9px]' : 'text-[10px]'}`}>
              9:41
            </span>
            <div
              className={`mx-auto rounded-full bg-white/25 ${compactFrame ? 'h-1 w-12' : 'h-1.5 w-16'}`}
              aria-hidden="true"
            />
            <div className="flex items-center gap-0.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="h-2 w-3 rounded-sm bg-white/70" />
            </div>
          </div>
          <div
            className={`bg-[#F4F5F8] ${
              fillHeight
                ? 'min-h-0 flex-1 overflow-hidden'
                : `overflow-hidden ${compactFrame ? 'min-h-[18rem] max-h-[18rem]' : tall ? 'min-h-[30rem] max-h-[30rem]' : 'min-h-[26rem] max-h-[26rem]'}`
            }`}
          >
            {children}
          </div>
          <div
            className={`flex shrink-0 justify-center bg-[#F4F5F8] ${compactFrame ? 'py-1.5' : 'py-2'}`}
            aria-hidden="true"
          >
            <span
              className={`rounded-full bg-[#0B1354]/20 ${compactFrame ? 'h-0.5 w-16' : 'h-1 w-24'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SmsPreview({ headline, body, cta, expanded = false, statusPad = false }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F4F5F8]">
      <div
        className={clsx(
          'shrink-0 border-b border-[#E4E6EC] bg-white/90 px-4 backdrop-blur',
          statusPad ? 'pb-3 pt-11' : 'py-3',
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center justify-center rounded-full bg-primary font-bold text-white ${
              expanded ? 'h-9 w-9 text-xs' : 'h-8 w-8 text-[10px]'
            }`}
          >
            E
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate font-semibold text-[#0B1354] ${expanded ? 'text-xs' : 'text-[11px]'}`}>
              Engage 360
            </p>
            <p className={`text-[#717171] ${expanded ? 'text-[10px]' : 'text-[9px]'}`}>SMS · Mobile</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4">
        <p className={`mb-3 text-center font-medium text-[#9AA0B0] ${expanded ? 'text-[10px]' : 'text-[9px]'}`}>
          Today · 9:41 AM
        </p>

        <div
          className={`mr-auto max-w-[85%] rounded-2xl rounded-tl-md border border-[#E8EAF0] bg-white shadow-[0_2px_8px_rgba(11,19,84,0.06)] ${
            expanded ? 'px-4 py-3' : 'px-3.5 py-2.5'
          }`}
        >
          <p
            className={`font-semibold leading-snug text-[#0B1354] ${
              expanded ? 'text-xs' : 'text-[11px]'
            }`}
          >
            {headline || 'Campaign title'}
          </p>
          <p
            className={`mt-1.5 leading-relaxed text-[#545454] ${
              expanded ? 'text-[11px] line-clamp-6' : 'text-[10px]'
            }`}
          >
            {body || 'Your SMS message preview will appear here as you type.'}
          </p>
          {cta ? (
            <p
              className={`mt-2.5 inline-flex rounded-full bg-[#F3F0FF] font-bold text-primary ${
                expanded ? 'px-3 py-1 text-[11px]' : 'px-2.5 py-1 text-[10px]'
              }`}
            >
              {cta}
            </p>
          ) : null}
        </div>

        <p className={`mt-2 text-[#9AA0B0] ${expanded ? 'text-[10px]' : 'text-[9px]'}`}>Delivered</p>
      </div>
    </div>
  );
}

function WhatsAppChatBody({
  headline,
  body,
  cta,
  image,
  expanded = false,
  footerNote,
  statusPad = false,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#E5DDD5]">
      <div
        className={clsx(
          'flex shrink-0 items-center gap-2.5 bg-[#075E54] px-4 pb-3 text-white',
          statusPad ? 'pt-11' : 'pt-2.5',
        )}
      >
        <div
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full bg-white/20',
            expanded ? 'h-9 w-9' : 'h-8 w-8',
          )}
        >
          <MessageCircle className={expanded ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={clsx('truncate font-semibold', expanded ? 'text-xs' : 'text-[11px]')}>
            Engage 360
          </p>
          <p className={clsx('truncate text-white/70', expanded ? 'text-[10px]' : 'text-[9px]')}>
            Business account · online
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-white/90">
          <Video className={expanded ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={2} />
          <Phone className={expanded ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={2} />
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3.5"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0,0,0,0.04) 0.6px, transparent 0.6px), radial-gradient(rgba(0,0,0,0.03) 0.6px, transparent 0.6px)',
          backgroundSize: '14px 14px, 14px 14px',
          backgroundPosition: '0 0, 7px 7px',
        }}
      >
        <p
          className={clsx(
            'mx-auto mb-3 w-fit rounded-full bg-white/80 px-2.5 py-1 font-medium text-[#667781] shadow-sm',
            expanded ? 'text-[10px]' : 'text-[9px]',
          )}
        >
          Today
        </p>

        <div
          className={clsx(
            'mr-auto max-w-[86%] overflow-hidden rounded-lg rounded-tl-sm bg-white shadow-[0_1px_1px_rgba(11,20,26,0.13)]',
            expanded ? 'text-[11px]' : 'text-[10px]',
          )}
        >
          {image ? (
            <div className={clsx('w-full overflow-hidden bg-[#D1D7DB]', expanded ? 'h-28' : 'h-20')}>
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className={clsx(expanded ? 'px-3.5 py-3' : 'px-3 py-2.5')}>
            <p className="font-semibold leading-snug text-[#111B21]">
              {headline || 'Campaign title'}
            </p>
            <p className="mt-1.5 whitespace-pre-line leading-relaxed text-[#3B4A54]">
              {body || 'Your WhatsApp message preview will appear here.'}
            </p>
            {footerNote ? (
              <p className="mt-2 text-[9px] leading-relaxed text-[#667781]">{footerNote}</p>
            ) : null}
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[9px] text-[#667781]">
              <span>9:41 AM</span>
              <CheckCheck className="h-3 w-3 text-[#53BDEB]" strokeWidth={2.5} />
            </div>
          </div>

          {cta ? (
            <div className="border-t border-[#E9EDEF]">
              <div className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-[#027EB5]">
                {cta}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 bg-[#F0F2F5] px-3.5 py-2.5">
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-full bg-white px-3.5 text-[10px] text-[#667781]">
          Type a message
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-white">
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}

function WhatsAppPreview({ headline, body, cta, image, expanded = false, footerNote }) {
  return (
    <WhatsAppChatBody
      headline={headline}
      body={body}
      cta={cta}
      image={image}
      expanded={expanded}
      footerNote={footerNote}
    />
  );
}

function FittedPhoneFrame({
  children,
  screenWidth = 248,
  statusbarColor = '#FFFFFF',
  measureKey = '',
}) {
  const viewportRef = useRef(null);
  const phoneRef = useRef(null);
  const [fit, setFit] = useState({ scale: 1, width: null, height: null });

  useEffect(() => {
    const viewport = viewportRef.current;
    const phone = phoneRef.current;
    if (!viewport || !phone) return undefined;

    const measure = () => {
      // Leave room so the bezel / rounded corners aren't clipped on either side
      const availableW = Math.max(viewport.clientWidth - 28, 0);
      const availableH = Math.max(viewport.clientHeight - 20, 0);
      const phoneW = phone.scrollWidth || phone.offsetWidth;
      const phoneH = phone.scrollHeight || phone.offsetHeight;
      if (!availableW || !availableH || !phoneW || !phoneH) return;

      const nextScale = Math.min(1, availableW / phoneW, availableH / phoneH);
      const safeScale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
      setFit({
        scale: safeScale,
        width: Math.ceil(phoneW * safeScale),
        height: Math.ceil(phoneH * safeScale),
      });
    };

    const raf = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(phone);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [screenWidth, measureKey]);

  return (
    <div
      ref={viewportRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-3 py-2"
    >
      <div
        className="relative shrink-0"
        style={
          fit.width && fit.height
            ? { width: fit.width, height: fit.height }
            : undefined
        }
      >
        <div
          ref={phoneRef}
          className={clsx(
            'will-change-transform',
            fit.width ? 'absolute left-0 top-0 origin-top-left' : 'origin-center',
          )}
          style={{ transform: `scale(${fit.scale})` }}
        >
          <IPhoneMockup
            screenWidth={screenWidth}
            screenType="island"
            frameColor="#1C1C1E"
            statusbarColor={statusbarColor}
            hideStatusBar
            hideNavBar
            frameOnly
          >
            {children}
          </IPhoneMockup>
        </div>
      </div>
    </div>
  );
}

export function SmsPhonePreview({ headline, body, cta, screenWidth = 248 }) {
  return (
    <FittedPhoneFrame
      screenWidth={screenWidth}
      statusbarColor="#FFFFFF"
      measureKey={`${headline}|${body}|${cta}`}
    >
      <SmsPreview headline={headline} body={body} cta={cta} expanded statusPad />
    </FittedPhoneFrame>
  );
}

export function WhatsAppPhonePreview({
  headline,
  body,
  cta,
  image,
  footerNote,
  screenWidth = 248,
}) {
  return (
    <FittedPhoneFrame
      screenWidth={screenWidth}
      statusbarColor="#075E54"
      measureKey={`${headline}|${body}|${cta}|${image}|${footerNote}`}
    >
      <WhatsAppChatBody
        headline={headline}
        body={body}
        cta={cta}
        image={image}
        expanded
        footerNote={footerNote}
        statusPad
      />
    </FittedPhoneFrame>
  );
}

function PushPreview({ headline, body }) {
  return (
    <div className="space-y-3 p-4">
      <div className="rounded-2xl border border-white/60 bg-white/90 p-3 shadow-[0_8px_24px_rgba(11,19,84,0.12)] backdrop-blur">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Bell className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold text-[#0B1354]">Engage 360</p>
              <p className="text-[8px] text-[#717171]">now</p>
            </div>
            <p className="mt-0.5 text-[11px] font-bold leading-snug text-[#0B1354]">
              {headline || 'Notification title'}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#717171]">
              {body || 'Push notification body preview.'}
            </p>
          </div>
        </div>
      </div>
      <p className="text-center text-[9px] text-[#717171]">Lock screen preview</p>
    </div>
  );
}

function EmailPreview({ headline, body, cta }) {
  return (
    <div className="bg-white">
      <div className="border-b border-[#EEF0F4] bg-[#FAFBFC] px-3 py-2">
        <p className="truncate text-[9px] text-[#717171]">From: hello@engage360.com</p>
        <p className="mt-0.5 truncate text-[10px] font-semibold text-[#0B1354]">
          {headline || 'Email subject line'}
        </p>
      </div>
      <div className="bg-gradient-to-br from-primary to-[#6B4FE0] px-4 py-6 text-center text-white">
        <p className="text-[9px] uppercase tracking-[0.14em] text-white/75">Promotion</p>
        <h4 className="mt-1.5 text-sm font-bold leading-snug">{headline || 'Your Headline'}</h4>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="text-center text-[10px] leading-relaxed text-[#717171]">
          {body || 'Your email body will appear here as you type.'}
        </p>
        <button
          type="button"
          className="w-full rounded-sm bg-primary py-2.5 text-[10px] font-semibold text-white"
        >
          {cta || 'Shop Now'}
        </button>
      </div>
    </div>
  );
}

function TemplatePromoPreview({ headline, body, cta, accent, products }) {
  const tiles = products?.length
    ? products
    : [
        { label: 'Sale', price: '30% Off' },
        { label: 'Deal', price: 'Buy 1 Get 1' },
        { label: 'New', price: 'Just In' },
        { label: 'Hot', price: 'Limited' },
      ];

  return (
    <div className="bg-white">
      <div className={`bg-gradient-to-br ${accent || 'from-primary to-[#6B4FE0]'} px-4 py-7 text-center text-white`}>
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/80">
          Exclusive Offer
        </p>
        <h4 className="mt-2 text-base font-bold leading-snug">{headline || 'Your Headline'}</h4>
      </div>
      <div className="space-y-3 px-3.5 py-4">
        <p className="text-center text-[10px] leading-relaxed text-[#717171]">
          {body || 'Your promotional message will appear here.'}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {tiles.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] px-2 py-3 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1354] text-white">
                <ShoppingBag className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="mt-1.5 text-[10px] font-bold text-[#0B1354]">{item.label}</span>
              <span className="text-[8px] text-[#717171]">{item.price}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full rounded-sm bg-primary py-2.5 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(58,16,205,0.25)]"
        >
          {cta || 'Shop Now'}
        </button>
        <div className="flex items-center justify-center gap-1 text-[8px] text-[#717171]">
          <Check className="h-3 w-3 text-[#1F9D55]" strokeWidth={2.5} />
          Live customer preview
        </div>
      </div>
    </div>
  );
}

export default function CampaignMobilePreview({
  channel = 'sms',
  headline,
  body,
  cta,
  image,
  footerNote,
  templateMode = false,
  accent,
  products,
  compact = false,
  dense = false,
  tall = false,
  fillHeight = false,
  expanded = false,
}) {
  const meta = CHANNEL_META[channel] || CHANNEL_META.sms;
  const useTall = tall || (!dense && !expanded && (templateMode || channel === 'email'));

  let content;
  if (templateMode) {
    content = (
      <TemplatePromoPreview
        headline={headline}
        body={body}
        cta={cta}
        accent={accent}
        products={products}
      />
    );
  } else if (channel === 'whatsapp') {
    content = (
      <WhatsAppPreview
        headline={headline}
        body={body}
        cta={cta}
        image={image}
        expanded={expanded}
        footerNote={footerNote}
      />
    );
  } else if (channel === 'push') {
    content = <PushPreview headline={headline} body={body} />;
  } else if (channel === 'email') {
    content = <EmailPreview headline={headline} body={body} cta={cta} />;
  } else {
    content = <SmsPreview headline={headline} body={body} cta={cta} expanded={expanded} />;
  }

  return (
    <div className={fillHeight ? 'flex h-full min-h-0 w-full flex-col' : compact ? '' : 'space-y-3'}>
      {!compact && !fillHeight ? (
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-semibold ${meta.tint}`}
          >
            <meta.icon className="h-3 w-3" strokeWidth={2} />
            {templateMode ? 'Template Preview' : `${meta.label} Preview`}
          </span>
        </div>
      ) : null}
      <PhoneChrome tall={useTall} dense={dense} fillHeight={fillHeight} expanded={expanded}>
        {content}
      </PhoneChrome>
    </div>
  );
}

export function SmsTemplateMiniPreview({ headline, body, cta }) {
  const message = body || 'Your SMS message preview will appear here.';
  const charCount = message.length;

  return (
    <div className="flex h-full min-h-full flex-col bg-gradient-to-b from-[#EEF2FA] to-[#F4F5F8] p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
          E
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-[#0B1354]">Engage 360</p>
          <p className="text-[9px] text-[#9AA0B0]">SMS</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-[#E8EAF0] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(11,19,84,0.06)]">
          {headline ? (
            <p className="text-[10px] font-semibold leading-snug text-[#0B1354] line-clamp-1">
              {headline}
            </p>
          ) : null}
          <p className="mt-1 text-[10px] leading-relaxed text-[#545454] line-clamp-3">{message}</p>
          {cta ? (
            <p className="mt-2 inline-flex rounded-full bg-[#F3F0FF] px-2 py-0.5 text-[9px] font-bold text-primary">
              {cta}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-2 text-right text-[9px] font-medium text-[#9AA0B0]">{charCount} chars</p>
    </div>
  );
}

export function WhatsAppTemplateMiniPreview({ headline, body, cta, image }) {
  const message = body || 'Your WhatsApp message preview will appear here.';

  return (
    <div className="flex h-full min-h-full flex-col overflow-hidden bg-[#E5DDD5]">
      <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <MessageCircle className="h-3 w-3" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold">Engage 360</p>
          <p className="text-[8px] text-white/70">WhatsApp Business</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-3 py-3">
        <div className="max-w-[94%] overflow-hidden rounded-lg rounded-tl-sm bg-white shadow-sm">
          {image ? (
            <div className="h-14 w-full overflow-hidden bg-[#D1D7DB]">
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="px-2.5 py-2">
            {headline ? (
              <p className="text-[10px] font-semibold leading-snug text-[#111B21] line-clamp-1">
                {headline}
              </p>
            ) : null}
            <p className="mt-1 text-[10px] leading-relaxed text-[#3B4A54] line-clamp-3">{message}</p>
            <div className="mt-1 flex items-center justify-end gap-0.5 text-[8px] text-[#667781]">
              <span>9:41</span>
              <CheckCheck className="h-2.5 w-2.5 text-[#53BDEB]" strokeWidth={2.5} />
            </div>
          </div>
          {cta ? (
            <div className="border-t border-[#E9EDEF] px-2.5 py-1.5 text-center text-[9px] font-semibold text-[#027EB5]">
              {cta}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TemplateMiniPreview({ template }) {
  return (
    <div
      className={`relative flex h-full min-h-full flex-col justify-between overflow-hidden bg-gradient-to-br ${template.accent} p-4 text-white`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
          {template.category}
        </p>
        <h4 className="mt-1.5 text-base font-bold leading-snug">{template.headline}</h4>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {(template.products || []).slice(0, 2).map((item) => (
          <div
            key={item.label}
            className="rounded-sm bg-white/15 px-2 py-1.5 text-center backdrop-blur-sm"
          >
            <p className="text-[9px] font-bold">{item.label}</p>
            <p className="text-[8px] text-white/80">{item.price}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-sm bg-white px-2.5 py-1.5 text-center text-[10px] font-bold text-[#0B1354]">
        {template.cta}
      </div>
    </div>
  );
}
