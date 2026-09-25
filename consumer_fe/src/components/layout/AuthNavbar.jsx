import { Link, NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import NavbarAccountActions from './NavbarAccountActions';
import { AUTH_NAV_LINKS } from './authNavData';

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

export default function AuthNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-[0_4px_24px_rgba(58,16,205,0.2)]">
      <div className="mx-auto flex h-16 w-full max-w-8xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="shrink-0" aria-label="Engage360 home">
          <LogoMark size={48} variant="on-primary" />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-8 md:flex lg:gap-10"
          aria-label="Main navigation"
        >
          {AUTH_NAV_LINKS.map(({ label, path, end }) => (
            <NavItem key={path} label={label} path={path} end={end} />
          ))}
        </nav>

        <NavbarAccountActions />
      </div>
    </header>
  );
}
