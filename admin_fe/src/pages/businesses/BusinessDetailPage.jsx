import { useCallback, useId, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AtSign,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { businessInitials, formatOnboardedDate } from '../../constants/businesses';
import StatusBadge from '../../components/businesses/StatusBadge';
import { PageBackLink } from '../../components/layout/PageBackLink';
import BusinessActionsMenu, { BusinessActionsButton } from '../../components/businesses/BusinessActionsMenu';
import BusinessEditDrawer from '../../components/businesses/BusinessEditDrawer';
import BusinessCreditModal from '../../components/businesses/BusinessCreditModal';
import {
  BusinessSectionNav,
  CreditHistoryPanel,
  CustomerBasePanel,
} from '../../components/businesses/BusinessDetailSections';
import Reveal from '../../components/motion/Reveal';
import { StaggerReveal, StaggerItem } from '../../components/motion/StaggerReveal';

/* ─── Brand marks (Simple Icons paths, shown in official colors) ────────── */
const SOCIAL_PLATFORMS = {
  LinkedIn: {
    color: '#0A66C2',
    tile: 'bg-[#E8F4FC]',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z',
  },
  Instagram: {
    color: '#E1306C',
    tile: 'bg-[#FDE8F3]',
    gradient: true,
    d: 'M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008',
  },
  'Twitter / X': {
    color: '#0F1419',
    tile: 'bg-[#F4F4F5]',
    d: 'M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z',
  },
  Facebook: {
    color: '#1877F2',
    tile: 'bg-[#E7F0FD]',
    d: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978c.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036a27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103l-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647',
  },
  TikTok: {
    color: '#111111',
    tile: 'bg-[#F4F4F5]',
    d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07',
  },
  YouTube: {
    color: '#FF0000',
    tile: 'bg-[#FEEDED]',
    d: 'M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z',
  },
};

function SocialGlyph({ platform }) {
  const gradientId = useId();
  const spec = SOCIAL_PLATFORMS[platform];
  if (!spec) {
    return <Globe className="h-4 w-4" aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      {spec.gradient ? (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9CE34" />
            <stop offset="40%" stopColor="#EE2A7B" />
            <stop offset="100%" stopColor="#6228D7" />
          </linearGradient>
        </defs>
      ) : null}
      <path fill={spec.gradient ? `url(#${gradientId})` : 'currentColor'} fillRule="evenodd" d={spec.d} />
    </svg>
  );
}

function SocialPresenceList({ links }) {
  if (links.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-7 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-primary">
          <Globe className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-medium text-[#0B1354]">No links yet</p>
        <p className="mt-1 text-xs text-[#A1A1AA]">Social links can be added via Edit.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 py-4">
      {links.map((link) => {
        const spec = SOCIAL_PLATFORMS[link.platform];
        const display = link.url.replace(/^https?:\/\//, '');
        return (
          <li key={`${link.platform}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              title={link.url}
              className="group flex items-center gap-3 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-3 py-2.5 transition-colors hover:border-[#D9DEE8] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${spec?.tile ?? 'bg-[#EFF6FF] text-primary'}`}
                style={spec ? { color: spec.color } : undefined}
              >
                <SocialGlyph platform={link.platform} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#0B1354]">{link.platform}</span>
                <span className="mt-0.5 block truncate text-xs text-[#717171]">{display}</span>
              </span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 text-[#C4C4CF] transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function daysSince(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86_400_000);
  if (d === 0) return 'Today';
  if (d === 1) return '1 day ago';
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m === 1) return '1 month ago';
  if (m < 12) return `${m} months ago`;
  const y = Math.floor(m / 12);
  return y === 1 ? '1 year ago' : `${y} years ago`;
}

/* ─── Micro-components ───────────────────────────────────────────────────── */
function CopyButton({ text, className = '', label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied' : label}
      className={`shrink-0 rounded-lg p-1.5 text-[#A1A1AA] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${className}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#1F9D55]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value, copyable = false, href, className = '' }) {
  if (!value) return null;
  return (
    <div className={`flex flex-1 items-center gap-3 border-b border-[#F4F5F8] py-4 last:border-b-0 ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 block break-all text-sm font-semibold text-primary transition-colors hover:text-primary/70"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 break-all text-sm font-semibold text-[#0B1354]">{value}</p>
        )}
      </div>
      {copyable && <CopyButton text={value} />}
    </div>
  );
}

function AccountAccessCard({ business }) {
  const ready = Boolean(business.credentialsSet);
  const StatusIcon = ready ? ShieldCheck : ShieldAlert;

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#F0F2F7] px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-bold tracking-tight text-[#0B1354]">Account access</h2>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            ready ? 'bg-[#E8F8EF] text-[#157A42]' : 'bg-[#FFF6E5] text-[#B45309]'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${ready ? 'bg-[#1F9D55]' : 'bg-[#F59E0B]'}`}
            aria-hidden="true"
          />
          {ready ? 'Ready' : 'Pending'}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-5 py-5">
        <div
          className={`relative overflow-hidden rounded-xl px-4 py-4 text-white ${
            ready
              ? 'bg-gradient-to-br from-[#0B1354] via-[#1E3A8A] to-[#2563EB]'
              : 'bg-gradient-to-br from-[#78350F] via-[#B45309] to-[#D97706]'
          }`}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 right-8 h-24 w-24 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <StatusIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Sign-in status</p>
              <p className="mt-0.5 text-[15px] font-extrabold leading-snug">
                {ready ? 'Password configured' : 'Password not set'}
              </p>
              
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-3.5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]">Sign-in email</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-[0_1px_2px_rgba(11,19,84,0.06)] ring-1 ring-[#EEF0F4]">
              <AtSign className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <a
              href={`mailto:${business.companyEmail}`}
              className="min-w-0 flex-1 break-all text-sm font-semibold text-[#0B1354] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {business.companyEmail}
            </a>
            <CopyButton
              text={business.companyEmail}
              label="Copy sign-in email"
              className="bg-white ring-1 ring-[#EEF0F4] hover:ring-primary/20"
            />
          </div>
        </div>

       
      </div>
    </section>
  );
}

function DetailTile({ icon: Icon, label, children, action }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-3.5 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-[0_1px_2px_rgba(11,19,84,0.06)] ring-1 ring-[#EEF0F4]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
      {action}
    </div>
  );
}

function CompanyDetailsCard({ business }) {
  const onboarded = formatOnboardedDate(business.onboardedAt);
  const relative = daysSince(business.onboardedAt);
  const credits = (business.creditBalance ?? 0).toLocaleString('en-GB');

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.04)]">
      <div className="flex items-center gap-2.5 border-b border-[#F0F2F7] px-5 py-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-bold tracking-tight text-[#0B1354]">Company details</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2">
        <DetailTile
          icon={Mail}
          label="Email"
          action={
            <CopyButton
              text={business.companyEmail}
              label="Copy company email"
              className="bg-white ring-1 ring-[#EEF0F4] hover:ring-primary/20"
            />
          }
        >
          <a
            href={`mailto:${business.companyEmail}`}
            className="block break-all text-sm font-semibold text-[#0B1354] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {business.companyEmail}
          </a>
        </DetailTile>

        <DetailTile
          icon={Phone}
          label="Phone"
          action={
            business.companyPhone ? (
              <CopyButton
                text={business.companyPhone}
                label="Copy company phone"
                className="bg-white ring-1 ring-[#EEF0F4] hover:ring-primary/20"
              />
            ) : null
          }
        >
          {business.companyPhone ? (
            <a
              href={`tel:${business.companyPhone}`}
              className="block break-all text-sm font-semibold text-[#0B1354] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {business.companyPhone}
            </a>
          ) : (
            <p className="text-sm font-semibold text-[#A1A1AA]">No phone on file</p>
          )}
        </DetailTile>

        <DetailTile icon={Calendar} label="Onboarded">
          <p className="text-sm font-semibold text-[#0B1354]">{onboarded}</p>
          <p className="mt-0.5 text-xs text-[#717171]">{relative}</p>
        </DetailTile>

        <DetailTile icon={Wallet} label="Credit balance">
          <p className="text-lg font-extrabold leading-none tracking-tight text-[#0B1354]">{credits}</p>
          <p className="mt-1 text-xs text-[#717171]">{credits === '1' ? 'credit available' : 'credits available'}</p>
        </DetailTile>
      </div>
    </section>
  );
}

function SectionCard({ title, icon: Icon, children, footer, fill = false, className = '' }) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.04)] ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-[#F0F2F7] px-5 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-sm font-bold tracking-tight text-[#0B1354]">{title}</h2>
      </div>
      <div className={`px-5 ${fill ? 'flex min-h-0 flex-1 flex-col' : ''}`}>{children}</div>
      {footer ? <div className="border-t border-[#F0F2F7] px-5 py-3">{footer}</div> : null}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function BusinessDetailPage() {
  const { businessId } = useParams();
  const business = useAppSelector((state) =>
    state.businesses.items.find((item) => item.id === businessId),
  );
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [section, setSection] = useState('profile');
  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  /* ── Not found ── */
  if (!business) {
    return (
      <div className="w-full px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-primary shadow-[0_4px_16px_rgba(37,99,235,0.12)]">
          <Building2 className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-[#0B1354]">Business not found</h1>
        <p className="mt-2 text-sm text-[#717171]">This record is not in the onboarded list.</p>
        <PageBackLink to="/businesses" label="Businesses" className="mt-6" />
      </div>
    );
  }

  const initials = businessInitials(business.companyName);
  const days = daysSince(business.onboardedAt);
  const credits = (business.creditBalance ?? 0).toLocaleString('en-GB');

  const heroStats = [
    { icon: Calendar, label: 'Onboarded', value: formatOnboardedDate(business.onboardedAt), sub: days },
    { icon: Wallet, label: 'Credits', value: credits },
    { icon: Globe, label: 'Social links', value: business.socialLinks.length },
    { icon: KeyRound, label: 'Account', value: business.credentialsSet ? 'Password set' : 'Pending' },
  ];

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-sm">
        <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-5">
          <BusinessActionsButton
            business={business}
            pressed={Boolean(menuAnchor)}
            onOpen={(_, el) => setMenuAnchor(el)}
          />
        </div>
        <BusinessSectionNav section={section} onChange={setSection} />
      </div>

      <div>
        <div className="min-w-0">
          {section === 'profile' ? (
            <div role="tabpanel" id="business-panel-profile" aria-labelledby="business-tab-profile">
      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <Reveal variant="fadeUp" when="load">
        <div className="relative rounded-2xl border border-[#EEF0F4] bg-white shadow-sm">

          {/* ── Identity ───────────────────────────────────────────────────── */}
          <div className="flex items-start gap-5 px-6 pb-0 pt-6 sm:px-8">
            {/* Avatar */}
            {business.logoDataUrl ? (
              <img
                src={business.logoDataUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-[#E4E4E7] sm:h-20 sm:w-20"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-xl font-extrabold text-white shadow-sm sm:h-20 sm:w-20 sm:text-2xl">
                {initials}
              </span>
            )}

            {/* Name + badge + contact */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-[#0B1354] sm:text-2xl">
                    {business.companyName}
                  </h1>
                  <StatusBadge status={business.status} />
                </div>
                <PageBackLink to="/businesses" label="Businesses" />
              </div>
              <p className="mt-1 text-sm text-[#717171]">{business.companyEmail}</p>

              {/* Contact chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${business.companyEmail}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#52525B] transition-colors hover:border-primary/30 hover:bg-[#EFF6FF] hover:text-primary"
                >
                  <Mail className="h-3 w-3" />
                  {business.companyEmail}
                </a>
                {business.companyPhone ? (
                  <a
                    href={`tel:${business.companyPhone}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#52525B] transition-colors hover:border-primary/30 hover:bg-[#EFF6FF] hover:text-primary"
                  >
                    <Phone className="h-3 w-3" />
                    {business.companyPhone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Stats strip ────────────────────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-2 border-t border-[#F0F2F7] sm:grid-cols-4">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  'flex flex-col gap-0.5 px-6 py-5 sm:px-8',
                  i % 2 !== 0 ? 'border-l border-[#F0F2F7]' : '',
                  i >= 2 ? 'border-t border-[#F0F2F7] sm:border-t-0' : '',
                  i > 0 ? 'sm:border-l sm:border-[#F0F2F7]' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">
                  {stat.label}
                </p>
                <p className="mt-0.5 whitespace-nowrap text-lg font-extrabold text-[#0B1354]">{stat.value}</p>
                {stat.sub ? (
                  <p className="text-[11px] leading-none text-[#717171]">{stat.sub}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Body grid ─────────────────────────────────────────────────────── */}
      <StaggerReveal
        when="load"
        delayChildren={0.12}
        stagger={0.07}
        className="mt-5 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3"
      >
        <StaggerItem className="order-1 self-start lg:col-span-2">
          <CompanyDetailsCard business={business} />
        </StaggerItem>

        <StaggerItem className="order-3 flex lg:order-2">
          <AccountAccessCard business={business} />
        </StaggerItem>

        <StaggerItem className="order-2 flex lg:order-3 lg:col-span-2">
          <SectionCard title="Primary contact" icon={User} fill>
            <InfoRow icon={User} label="Name" value={business.contactPersonName} copyable />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={business.contactPhone}
              copyable
              href={`tel:${business.contactPhone}`}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={business.contactEmail}
              copyable
              href={`mailto:${business.contactEmail}`}
            />
          </SectionCard>
        </StaggerItem>

        <StaggerItem className="order-4 flex">
          <SectionCard title="Social presence" icon={Globe} fill>
            <SocialPresenceList links={business.socialLinks} />
          </SectionCard>
        </StaggerItem>
      </StaggerReveal>
            </div>
          ) : null}
          {section === 'credit' ? <CreditHistoryPanel business={business} /> : null}
          {section === 'customers' ? <CustomerBasePanel /> : null}
        </div>
      </div>

      {/* Portaled overlays */}
      <BusinessActionsMenu
        business={menuAnchor ? business : null}
        anchor={menuAnchor}
        includeView={false}
        onClose={closeMenu}
        onEdit={() => {
          setEditOpen(true);
        }}
        onCredit={() => {
          setCreditOpen(true);
        }}
      />
      <BusinessEditDrawer business={editOpen ? business : null} onClose={() => setEditOpen(false)} />
      <BusinessCreditModal
        business={creditOpen ? business : null}
        onClose={() => setCreditOpen(false)}
      />
    </div>
  );
}
