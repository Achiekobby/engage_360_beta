import { useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setScrolled,
  closeMobileMenu,
  toggleMobileMenu,
} from '../../store/slices/navSlice';
import { NAV_LINK_ITEMS, REWARDS_NAV } from './navData';
import useRecipient from '../../hooks/useRecipient';
import {
  ProductNavDropdownDesktop,
  ProductNavDropdownMobile,
} from './ProductNavDropdown';
import {
  ResourcesNavDropdownDesktop,
  ResourcesNavDropdownMobile,
} from './ResourcesNavDropdown';

export default function GuestNavbar() {
  const dispatch = useAppDispatch();
  const { isScrolled, mobileMenuOpen } = useAppSelector((state) => state.nav);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { isVerified } = useRecipient();
  const rewardsPath = isVerified ? REWARDS_NAV.shopPath : REWARDS_NAV.path;

  const handleScroll = useCallback(() => {
    dispatch(setScrolled(window.scrollY > 12));
  }, [dispatch]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleGetStarted = () => {
    dispatch(closeMobileMenu());
    navigate('/signup');
  };

  const handleLogin = () => {
    dispatch(closeMobileMenu());
    navigate('/signin');
  };

  const closeMobile = () => dispatch(closeMobileMenu());

  const navLinkClass = (isActive) =>
    clsx(
      'text-sm transition-colors duration-300',
      isScrolled
        ? clsx(
            'text-foreground/80 hover:text-primary',
            isActive && 'font-bold text-primary',
          )
        : clsx(
            'text-white/90 hover:text-white',
            isActive && 'font-bold text-white',
          ),
    );

  const mobileNavLinkClass = (isActive) =>
    clsx(
      'border-b py-4 text-base transition-colors',
      isScrolled
        ? clsx(
            'border-border text-foreground/80 hover:text-primary',
            isActive && 'font-bold text-primary',
          )
        : clsx(
            'border-white/10 text-white/90 hover:text-white',
            isActive && 'font-bold text-white',
          ),
    );

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-300 ease-out',
          isScrolled
            ? 'border-b border-border bg-white shadow-[0_4px_20px_rgba(11,19,84,0.08)]'
            : 'bg-primary',
        )}
      >
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="group relative z-10 flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
          >
            <LogoMark
              size={48}
              variant={isScrolled ? 'on-white' : 'on-primary'}
              className="shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {NAV_LINK_ITEMS.slice(0, 1).map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {label}
              </NavLink>
            ))}

            <ProductNavDropdownDesktop isScrolled={isScrolled} />

            <ResourcesNavDropdownDesktop isScrolled={isScrolled} />

            <NavLink to={rewardsPath} className={({ isActive }) => navLinkClass(isActive)}>
              {REWARDS_NAV.label}
            </NavLink>

            {NAV_LINK_ITEMS.slice(1).map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={handleGetStarted}
              className={clsx(
                'rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer',
                isScrolled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-white text-primary hover:bg-white/90',
              )}
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className={clsx(
                'rounded-lg border px-5 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer',
                isScrolled
                  ? 'border-primary text-primary hover:bg-primary/5'
                  : 'border-white text-white hover:bg-white/10',
              )}
            >
              Login
            </button>
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden cursor-pointer',
              isScrolled
                ? 'text-primary hover:bg-primary/5'
                : 'text-white hover:bg-white/10',
            )}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      <div className="h-16" aria-hidden="true" />

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMobile}
              aria-label="Close menu overlay"
            />
            <motion.nav
              initial={reduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={clsx(
                'absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col px-6 pt-20 shadow-2xl',
                isScrolled ? 'bg-white' : 'bg-primary',
              )}
            >
              {NAV_LINK_ITEMS.slice(0, 1).map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) => mobileNavLinkClass(isActive)}
                >
                  {label}
                </NavLink>
              ))}

              <ProductNavDropdownMobile isScrolled={isScrolled} onNavigate={closeMobile} />

              <ResourcesNavDropdownMobile isScrolled={isScrolled} onNavigate={closeMobile} />

              <NavLink
                to={rewardsPath}
                onClick={closeMobile}
                className={({ isActive }) => mobileNavLinkClass(isActive)}
              >
                {REWARDS_NAV.label}
              </NavLink>

              {NAV_LINK_ITEMS.slice(1).map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) => mobileNavLinkClass(isActive)}
                >
                  {label}
                </NavLink>
              ))}

              <div className="mt-auto flex flex-col gap-3 pb-10 pt-6">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className={clsx(
                    'w-full rounded-lg py-3 text-sm font-semibold cursor-pointer transition-colors',
                    isScrolled
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-primary',
                  )}
                >
                  Get Started
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  className={clsx(
                    'w-full rounded-lg border py-3 text-sm font-semibold cursor-pointer transition-colors',
                    isScrolled
                      ? 'border-primary text-primary'
                      : 'border-white text-white',
                  )}
                >
                  Login
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
