import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import NavbarAccountActions from '../layout/NavbarAccountActions';
import {
  CUSTOMER_ENGAGEMENT_BASE,
  CUSTOMER_ENGAGEMENT_NAV,
} from './customerEngagementNavData';

function NavItem({ label, path, end, mobile = false, onNavigate }) {
  return (
    <NavLink
      to={path}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'transition-colors duration-200',
          mobile
            ? 'block rounded-sm px-3 py-3 text-base'
            : 'whitespace-nowrap text-sm',
          isActive ? 'font-bold text-white' : 'font-normal text-white/75 hover:text-white',
          mobile && isActive && 'bg-white/10',
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function CustomerEngagementNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-[0_4px_24px_rgba(58,16,205,0.2)]">
      <div className="mx-auto flex h-16 w-full max-w-8xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <LogoMark size={48} variant="on-primary" to={`${CUSTOMER_ENGAGEMENT_BASE}/dashboard`} />

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2 py-1.5 text-xs font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white sm:px-2.5"
            title="Back to platform home"
          >
            <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Platform Home</span>
          </Link>
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex xl:gap-10"
          aria-label="Customer engagement navigation"
        >
          {CUSTOMER_ENGAGEMENT_NAV.map(({ label, path, end }) => (
            <NavItem key={path} label={label} path={path} end={end} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
          </button>
          <NavbarAccountActions />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            key="customer-engagement-mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
            aria-label="Customer engagement navigation"
          >
            <div className="mx-auto flex w-full max-w-8xl flex-col px-3 py-2 sm:px-5">
              {CUSTOMER_ENGAGEMENT_NAV.map(({ label, path, end }) => (
                <NavItem
                  key={path}
                  label={label}
                  path={path}
                  end={end}
                  mobile
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
