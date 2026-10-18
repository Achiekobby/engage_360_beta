import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Building2, CircleHelp, Menu, Megaphone, Search, UserRound, X } from 'lucide-react';
import LogoMark from '../brand/LogoMark';
import { DEMO_USER } from '../../constants/demoAuth';
import { CAMPAIGN_CATEGORIES, getCampaigns, labelFor } from '../campaigns/campaignData';
import { useAppSelector } from '../../store/hooks';
import { ADMIN_NAV } from './adminNavData';

const ICON_BTN =
  'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#717171] transition-colors hover:bg-[#F6F7FB] hover:text-[#0B1354] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-10 sm:w-10';

function useDismissable(open, onClose) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return ref;
}

function sectionTitle(pathname) {
  if (pathname.startsWith('/campaigns')) return 'Campaign Management';
  if (pathname.startsWith('/businesses')) return 'Business Management';
  if (pathname.startsWith('/tickets')) return 'Tickets';
  const match = ADMIN_NAV.find((item) => item.to === pathname || (item.to !== '/' && pathname.startsWith(item.to)));
  return match?.label ?? 'Engage360';
}

function roleLabel(role) {
  if (!role || role === 'guest') return 'Administrator';
  return role.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function accraDate() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Accra',
  }).format(new Date());
}

const QUICK_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/businesses', label: 'Businesses' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/settings', label: 'Platform settings' },
];

function SearchResults({ needle, hasHits, businessHits, campaignHits, onGo }) {
  return (
    <div
      className="admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white text-[#0B1354] shadow-[0_16px_40px_rgba(11,19,84,0.16)]"
      role="listbox"
      aria-label="Search results"
    >
      {!needle ? (
        <div className="p-2">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">Jump to</p>
          {QUICK_LINKS.map((item) => (
            <button
              key={item.to}
              type="button"
              onClick={() => onGo(item.to)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm text-[#0B1354] hover:bg-[#F6F7FB]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : hasHits ? (
        <div className="max-h-[min(24rem,70vh)] overflow-y-auto py-2">
          {businessHits.length ? (
            <div className="px-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">Businesses</p>
              {businessHits.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onGo(`/businesses/${item.id}`)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-[#F6F7FB]"
                >
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#717171]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#0B1354]">{item.companyName}</span>
                    <span className="block truncate text-xs text-[#717171]">{item.companyEmail || item.status}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          {campaignHits.length ? (
            <div className="px-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">Campaigns</p>
              {campaignHits.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onGo(`/campaigns/${item.id}`)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-[#F6F7FB]"
                >
                  <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-[#717171]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#0B1354]">{item.name}</span>
                    <span className="block truncate text-xs text-[#717171]">{labelFor(CAMPAIGN_CATEGORIES, item.category)}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="px-4 py-6">
          <p className="text-sm font-medium text-[#0B1354]">No matches for “{needle}”</p>
          <p className="mt-1 text-xs text-[#717171]">Try a business name or campaign title.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminNavbar({ menuOpen, onToggleMenu }) {
  const businesses = useAppSelector((state) => state.businesses.items);
  const authUser = useAppSelector((state) => state.auth.user);
  const user = authUser ?? DEMO_USER;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [noticesRead, setNoticesRead] = useState(false);
  const noticesId = useId();
  const accountId = useId();
  const searchId = useId();
  const searchOverlayId = useId();
  const searchInputRef = useRef(null);
  const noticesRef = useDismissable(noticesOpen, () => setNoticesOpen(false));
  const accountRef = useDismissable(accountOpen, () => setAccountOpen(false));
  const searchRef = useDismissable(searchOpen || searchExpanded, () => {
    setSearchOpen(false);
    setSearchExpanded(false);
  });

  const campaigns = useMemo(() => getCampaigns(), []);
  const needle = query.trim().toLowerCase();
  const businessHits = needle
    ? businesses
        .filter((item) =>
          [item.companyName, item.contactPersonName, item.companyEmail].join(' ').toLowerCase().includes(needle),
        )
        .slice(0, 5)
    : [];
  const campaignHits = needle
    ? campaigns
        .filter((item) => [item.name, labelFor(CAMPAIGN_CATEGORIES, item.category)].join(' ').toLowerCase().includes(needle))
        .slice(0, 5)
    : [];
  const hasHits = businessHits.length + campaignHits.length > 0;

  const scheduled = campaigns.filter((item) => item.status === 'scheduled').length;
  const expired = campaigns.filter((item) => item.status === 'expired').length;
  const notices = [
    {
      id: 'businesses-active',
      title: `${businesses.length} ${businesses.length === 1 ? 'business is' : 'businesses are'} active`,
      detail: 'Onboarded accounts can sign in. No verification code is sent.',
      to: '/businesses',
    },
    {
      id: 'campaigns-scheduled',
      title: scheduled ? `${scheduled} campaigns are scheduled` : 'No campaigns are waiting to send',
      detail: scheduled ? 'Review send times before they go out.' : 'Nothing is queued for a future send.',
      to: '/campaigns',
    },
    {
      id: 'campaigns-expired',
      title: expired ? `${expired} campaigns have expired` : 'No expired campaigns need review',
      detail: expired ? 'Check whether a follow-up should replace them.' : 'All listed campaigns are still current.',
      to: '/campaigns',
    },
  ];
  const unread = noticesRead ? 0 : notices.length;

  const closePanels = () => {
    setNoticesOpen(false);
    setAccountOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchExpanded(false);
    setQuery('');
  };

  useEffect(() => {
    closeSearch();
    closePanels();
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const collapseOverlay = () => {
      if (media.matches) setSearchExpanded(false);
    };
    media.addEventListener('change', collapseOverlay);
    return () => media.removeEventListener('change', collapseOverlay);
  }, []);

  useEffect(() => {
    const compact = () => window.matchMedia('(max-width: 1023px)').matches;
    const onKey = (event) => {
      const typing = event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        closePanels();
        if (compact()) setSearchExpanded(true);
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        closePanels();
        if (compact()) setSearchExpanded(true);
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openSearch = () => {
    closePanels();
    setSearchExpanded(true);
    setSearchOpen(true);
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const openNotices = () => {
    setAccountOpen(false);
    closeSearch();
    setNoticesOpen((open) => !open);
    setNoticesRead(true);
  };

  const openAccount = () => {
    setNoticesOpen(false);
    closeSearch();
    setAccountOpen((open) => !open);
  };

  const go = (to) => {
    closeSearch();
    closePanels();
    navigate(to);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (businessHits[0]) return go(`/businesses/${businessHits[0].id}`);
    if (campaignHits[0]) return go(`/campaigns/${campaignHits[0].id}`);
    if (needle) go(`/businesses`);
  };

  const searchField = (id, attachRef = false) => (
    <form onSubmit={submitSearch} className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        Search businesses and campaigns
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
      <input
        id={id}
        ref={attachRef ? searchInputRef : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => {
          closePanels();
          setSearchOpen(true);
        }}
        placeholder="Search businesses or campaigns"
        className="w-full rounded-lg border border-[#E4E4E7] bg-[#F8F9FB] py-2 pl-10 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 lg:pr-12"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[#E4E4E7] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#A1A1AA] lg:inline">
        /
      </kbd>
    </form>
  );

  const results = (
    <SearchResults
      needle={query.trim()}
      hasHits={hasHits}
      businessHits={businessHits}
      campaignHits={campaignHits}
      onGo={go}
    />
  );

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center gap-1 border-b border-[#EEF0F4] bg-white px-2 shadow-sm sm:gap-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onToggleMenu}
          className={`${ICON_BTN} lg:hidden`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link
          to="/businesses"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Engage360 admin, businesses"
        >
          <LogoMark size={32} variant="on-white" className="max-w-[5.75rem] min-[380px]:max-w-[8.5rem] lg:hidden" />
          <LogoMark size={48} variant="on-white" className="hidden lg:block" />
        </Link>
        <span className="hidden h-6 w-px bg-[#E4E4E7] lg:block" aria-hidden="true" />
        <div className="hidden min-w-0 xl:block">
          <p className="truncate text-sm font-semibold text-[#0B1354]">{sectionTitle(pathname)}</p>
          <p className="truncate text-[11px] text-[#A1A1AA]">{accraDate()} · Accra</p>
        </div>
      </div>

      <div className="relative mx-auto hidden min-w-0 max-w-xl flex-1 lg:block" ref={searchExpanded ? undefined : searchRef}>
        {searchField(searchId, !searchExpanded)}
        {searchOpen && !searchExpanded ? (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)]">{results}</div>
        ) : null}
      </div>

      <div className={`ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 ${searchExpanded ? 'max-lg:hidden' : ''}`}>
        <button type="button" onClick={openSearch} className={`${ICON_BTN} lg:hidden`} aria-label="Search">
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <Link to="/tickets" onClick={closePanels} className={ICON_BTN} aria-label="Help, open tickets">
          <CircleHelp className="h-5 w-5" strokeWidth={1.75} />
        </Link>

        <div className="relative" ref={noticesRef}>
          <button
            type="button"
            onClick={openNotices}
            className={`relative ${ICON_BTN}`}
            aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
            aria-expanded={noticesOpen}
            aria-controls={noticesId}
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unread > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold leading-none text-white">
                {unread}
              </span>
            ) : null}
          </button>

          {noticesOpen ? (
            <div
              id={noticesId}
              role="region"
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+8px)] w-[min(calc(100vw-1rem),20rem)] admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white text-[#0B1354] shadow-[0_16px_40px_rgba(11,19,84,0.16)]"
            >
              <div className="border-b border-[#F0F2F7] px-4 py-3">
                <p className="text-sm font-semibold text-[#0B1354]">Notifications</p>
              </div>
              <ul>
                {notices.map((notice) => (
                  <li key={notice.id} className="border-b border-[#F8F8F8] last:border-0">
                    <Link
                      to={notice.to}
                      onClick={() => setNoticesOpen(false)}
                      className="block px-4 py-3.5 hover:bg-[#F8FAFF]"
                    >
                      <p className="text-sm font-medium text-[#0B1354]">{notice.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#717171]">{notice.detail}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mx-0.5 hidden h-5 w-px bg-[#E4E4E7] sm:block" aria-hidden="true" />

        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={openAccount}
            className="flex max-w-[14rem] cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-[#F6F7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:pr-2.5"
            aria-label="Account menu"
            aria-expanded={accountOpen}
            aria-controls={accountId}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-[16px] w-[16px]" strokeWidth={1.75} />
            </span>
            <span className="hidden min-w-0 text-left lg:block">
              <span className="block truncate text-sm font-semibold leading-tight text-[#0B1354]">{user.name}</span>
              <span className="block truncate text-[11px] leading-tight text-[#717171]">{roleLabel(user.role)}</span>
            </span>
          </button>

          {accountOpen ? (
            <div
              id={accountId}
              role="menu"
              aria-label="Account"
              className="absolute right-0 top-[calc(100%+8px)] w-[min(calc(100vw-1rem),16rem)] admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white text-[#0B1354] shadow-[0_16px_40px_rgba(11,19,84,0.16)]"
            >
              <div className="border-b border-[#F0F2F7] px-4 py-3">
                <p className="text-sm font-semibold text-[#0B1354]">{user.name}</p>
                <p className="mt-0.5 text-xs text-[#717171]">{user.email}</p>
                <p className="mt-1 text-[11px] text-[#A1A1AA]">{roleLabel(user.role)}</p>
              </div>
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#F6F7FB]"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#F6F7FB]"
              >
                Platform settings
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {searchExpanded ? (
        <div
          ref={searchRef}
          className="absolute inset-0 z-[60] flex items-center gap-2 bg-white px-2 sm:px-3 lg:hidden"
        >
          <button type="button" onClick={closeSearch} className={ICON_BTN} aria-label="Close search">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
          {searchField(searchOverlayId, true)}
          {searchOpen ? <div className="absolute inset-x-2 top-[calc(100%+4px)] sm:inset-x-3">{results}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
