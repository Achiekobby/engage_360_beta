import { Link, NavLink } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import NavbarAccountActions from '../layout/NavbarAccountActions';
import {
  CUSTOMER_ENGAGEMENT_BASE,
  CUSTOMER_ENGAGEMENT_NAV,
} from './customerEngagementNavData';

function NavItem({ label, path, end }) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        clsx(
          'text-sm transition-colors duration-200',
          isActive ? 'font-bold text-white' : 'font-normal text-white/75 hover:text-white',
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function CustomerEngagementNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-[0_4px_24px_rgba(58,16,205,0.2)]">
      <div className="mx-auto flex h-16 w-full max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to={`${CUSTOMER_ENGAGEMENT_BASE}/dashboard`}
            className="shrink-0"
            aria-label="Customer engagement home"
          >
            <LogoMark size={48} variant="on-primary" />
          </Link>

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
          className="flex flex-1 items-center justify-center gap-4 text-xs sm:gap-6 sm:text-sm md:gap-8 lg:gap-10"
          aria-label="Customer engagement navigation"
        >
          {CUSTOMER_ENGAGEMENT_NAV.map(({ label, path, end }) => (
            <NavItem key={path} label={label} path={path} end={end} />
          ))}
        </nav>

        <NavbarAccountActions />
      </div>
    </header>
  );
}
