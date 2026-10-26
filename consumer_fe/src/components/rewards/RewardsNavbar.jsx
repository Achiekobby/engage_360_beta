import { Link, NavLink, useLocation } from 'react-router-dom';
import Images from '../../utils/Images';
import AccountMenu from './AccountMenu';

const LINKS = [
  { to: '/rewards', label: 'Rewards Shop', end: true },
  { to: '/rewards/how-it-works', label: 'How to earn point' },
  { to: '/rewards/faq', label: 'FAQ' },
  { to: '/rewards/contact', label: 'Contact us' },
];

export default function RewardsNavbar() {
  const { pathname } = useLocation();

  const linkClass = (active) =>
    `relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
      active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-[0_6px_24px_rgba(58,16,205,0.25)]">
      <div className="mx-auto flex h-[68px] w-full max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/offer" className="shrink-0" aria-label="Engage360, back to offers">
          <img src={Images.logoWhite} alt="Engage360" className="h-8 w-auto object-contain sm:h-9" />
        </Link>

        <nav aria-label="Rewards" className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                linkClass(isActive || (to === '/rewards' && pathname === '/rewards/activity'))
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <AccountMenu />
      </div>

      <nav
        aria-label="Rewards"
        className="no-scrollbar flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 md:hidden"
      >
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              linkClass(isActive || (to === '/rewards' && pathname === '/rewards/activity'))
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
