import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  X,
  Youtube,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import { springTransition } from '../motion/motionPresets';
import { campaignBrief, campaignInitials, formatCedi } from './campaignData';

const DEFAULT_SCREENS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=900&q=80',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=900&q=80',
  },
  {
    id: 'checkout',
    label: 'Checkout',
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=900&q=80',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=900&q=80',
  },
];

const SOCIAL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: TikTokIcon,
  'twitter / x': XLogo,
  twitter: XLogo,
  x: XLogo,
};

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.78 4.78 0 0 1 14.8 3h-2.9v12.4a2.5 2.5 0 1 1-1.78-2.4V10a5.4 5.4 0 1 0 4.68 5.35V9.4a7.6 7.6 0 0 0 4.4 1.4V7.9a4.78 4.78 0 0 1-2.6-2.08Z" />
    </svg>
  );
}

function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.78L23.2 22h-6.3l-4.93-6.45L6.3 22H3.2l7.27-8.31L1 2h6.45l4.45 5.9L18.9 2Zm-1.1 18h1.72L6.35 3.9H4.5L17.8 20Z" />
    </svg>
  );
}

function HighlightedText({ text, phrase }) {
  if (!phrase || !text) return text;

  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (index < 0) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + phrase.length);
  const after = text.slice(index + phrase.length);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-[#FFE566] px-1 font-medium text-[#0B1354]">{match}</mark>
      {after}
    </>
  );
}

function formatPhone(value) {
  if (!value) return '—';
  const digits = String(value).replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length >= 12) {
    return `+233 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
  }
  return value;
}

function socialKey(platform) {
  return String(platform || '')
    .trim()
    .toLowerCase();
}

function resolveScreens(campaign, brief) {
  if (Array.isArray(brief.screens) && brief.screens.length) return brief.screens;
  if (Array.isArray(campaign.screens) && campaign.screens.length) return campaign.screens;

  const hero = brief.bannerUrl || campaign.imageUrl;
  if (!hero) return DEFAULT_SCREENS;

  return [
    { id: 'hero', label: 'Offer', src: hero },
    ...DEFAULT_SCREENS.filter((screen) => screen.src !== hero).slice(0, 3),
  ];
}

export default function SalesCustomerView({
  open,
  onClose,
  campaign,
  business,
}) {
  const reduceMotion = useReducedMotion();
  const brief = useMemo(() => campaignBrief(campaign), [campaign]);
  const screens = useMemo(() => resolveScreens(campaign, brief), [campaign, brief]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setActive(0);
    return undefined;
  }, [open, campaign?.id]);

  useEffect(() => {
    if (!open || reduceMotion || screens.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % screens.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [open, reduceMotion, screens.length]);

  const companyName = business?.companyName || 'Business';
  const initials = campaignInitials(companyName);
  const title = brief.productName || brief.title || campaign.name;
  const description = brief.description || brief.message || '';
  const highlight = brief.highlightPhrase || '';
  const price = brief.discountedPrice ?? brief.price;
  const compareAt = brief.discountedPrice != null ? brief.price : null;
  const cta = brief.callToAction || 'Get It Now';
  const phone = business?.companyPhone || business?.contactPhone;
  const email = business?.companyEmail || business?.contactEmail || 'info@example.com';
  const socialLinks = business?.socialLinks?.filter((item) => item.platform && item.url) ?? [];
  const footerSocial =
    socialLinks.length > 0
      ? socialLinks
      : [
          { platform: 'Facebook', url: '#' },
          { platform: 'LinkedIn', url: '#' },
          { platform: 'Instagram', url: '#' },
          { platform: 'TikTok', url: '#' },
          { platform: 'YouTube', url: '#' },
        ];

  const current = screens[active] ?? screens[0];

  return (
    <AnimatedModal
      isOpen={open}
      onClose={onClose}
      labelledBy="sales-customer-view-title"
      panelClassName="relative z-10 flex max-h-[min(92vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(11,19,84,0.28)]"
    >
      <div className="flex items-center justify-between border-b border-[#EEF0F4] px-5 py-3.5 sm:px-7">
        <div className="flex min-w-0 items-center gap-2.5">
          {business?.logoDataUrl ? (
            <img
              src={business.logoDataUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover ring-1 ring-[#E4E4E7]"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] text-[11px] font-bold text-white">
              {initials.slice(0, 1)}
            </span>
          )}
          <p className="truncate text-sm font-semibold tracking-tight text-[#111827]">{companyName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close customer view"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#717171] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B1354]"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-10 lg:px-10 lg:py-10">
          <div className="min-w-0">
            <h2
              id="sales-customer-view-title"
              className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[#111827] sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
              <HighlightedText text={description} phrase={highlight} />
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-bold tracking-tight text-[#2563EB] sm:text-[2rem]">
                {formatCedi(price)}
              </p>
              {compareAt != null && compareAt !== price ? (
                <p className="text-sm font-medium text-[#9CA3AF] line-through">{formatCedi(compareAt)}</p>
              ) : (
                <p className="text-sm font-medium text-[#9CA3AF]">limited offer</p>
              )}
            </div>

            <button
              type="button"
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(58,16,205,0.28)] transition-transform hover:brightness-105 active:scale-[0.98]"
            >
              {cta}
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0F172A] shadow-[0_24px_48px_rgba(15,23,42,0.22)] ring-1 ring-black/5">
              <div className="relative aspect-[5/4] w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={current?.id || active}
                    src={current?.src}
                    alt={current?.label || 'Product preview'}
                    initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={reduceMotion ? { duration: 0 } : springTransition}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {current?.label}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Screen previews">
              {screens.map((screen, index) => {
                const selected = index === active;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show ${screen.label} preview`}
                    onClick={() => setActive(index)}
                    className={clsx(
                      'h-2.5 w-2.5 cursor-pointer rounded-full transition-all duration-200',
                      selected ? 'scale-110 bg-[#111827]' : 'bg-[#D1D5DB] hover:bg-[#9CA3AF]',
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <footer className="bg-[#0A0A0A] px-5 py-8 sm:px-8 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr] lg:items-start lg:gap-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
              {business?.logoDataUrl ? (
                <img src={business.logoDataUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] text-sm font-bold text-white">
                  {initials.slice(0, 1)}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Contact Number</p>
              <p className="mt-2 text-sm text-[#A1A1AA]">{formatPhone(phone)}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Email</p>
              <p className="mt-2 break-all text-sm text-[#A1A1AA]">{email}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Social</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {footerSocial.map((item) => {
                  const Icon = SOCIAL_ICONS[socialKey(item.platform)] || Linkedin;
                  return (
                    <a
                      key={`${item.platform}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.platform}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111827] transition-transform hover:scale-105"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedModal>
  );
}
