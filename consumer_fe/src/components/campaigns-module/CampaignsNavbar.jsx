import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import NavbarAccountActions from '../layout/NavbarAccountActions';
import { CAMPAIGNS_BASE, CAMPAIGNS_NAV } from './campaignsNavData';

function NavItem({ label, path, end }) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        clsx(
          'whitespace-nowrap text-sm transition-colors duration-200',
          isActive ? 'font-bold text-white' : 'font-normal text-white/80 hover:text-white',
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function CampaignsNavbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-[0_4px_24px_rgba(58,16,205,0.2)]">
      <div className="mx-auto flex h-16 w-full max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link to={CAMPAIGNS_BASE} className="shrink-0" aria-label="Campaigns home">
            <LogoMark size={48} variant="on-primary" />
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2 py-1.5 text-xs font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white sm:px-2.5"
            title="Back to platform home"
          >
            <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Platform</span>
          </Link>
        </div>

        <nav
          className="hidden flex-1 items-center justify-center gap-5 text-sm md:flex lg:gap-8"
          aria-label="Campaigns navigation"
        >
          {CAMPAIGNS_NAV.map(({ label, path, end }) => (
            <NavItem key={path} label={label} path={path} end={end} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate(`${CAMPAIGNS_BASE}/create`)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/80 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">Create</span>
          </button>

          <NavbarAccountActions />
        </div>
      </div>

      <nav
        className="flex gap-4 overflow-x-auto border-t border-white/10 px-4 py-2.5 text-xs md:hidden"
        aria-label="Campaigns mobile navigation"
      >
        {CAMPAIGNS_NAV.map(({ label, path, end }) => (
          <NavItem key={path} label={label} path={path} end={end} />
        ))}
      </nav>
    </header>
  );
}
