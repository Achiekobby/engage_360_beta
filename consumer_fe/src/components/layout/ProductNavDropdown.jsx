import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  PRODUCT_FEATURED,
  PRODUCT_MEGA_GROUPS,
  isProductPathActive,
} from './navData';

function MegaMenuLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200',
          isActive
            ? 'bg-[#F7F8FF] ring-1 ring-primary/15'
            : 'hover:bg-[#FAFBFC]',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
              item.iconBg,
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={clsx(
                'text-[13px] font-semibold leading-snug',
                isActive ? 'text-primary' : 'text-[#0B1354]',
              )}
            >
              {item.label}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#717171]">{item.description}</p>
          </div>
        </>
      )}
    </NavLink>
  );
}

function ProductMegaMenuColumn({ group, onClose }) {
  return (
    <div className="min-w-0">
      <div className="border-b border-[#EEF0F4] pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
          {group.label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#717171]">{group.tagline}</p>
      </div>
      <ul className="mt-3 space-y-0.5">
        {group.items.map((item) => (
          <li key={item.path}>
            <MegaMenuLink item={item} onNavigate={onClose} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductSpotlightCard({ featured, onExplore }) {
  const FeaturedIcon = featured?.icon;
  if (!featured) return null;

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#E4E8EF] bg-[#FAFBFC] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">Spotlight</p>
      <div className="mt-4 flex flex-1 flex-col">
        <span
          className={clsx(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg',
            featured.iconBg,
          )}
        >
          {FeaturedIcon ? <FeaturedIcon className="h-5 w-5" strokeWidth={2.25} /> : null}
        </span>
        <h3 className="mt-3 text-base font-bold text-[#0B1354]">{featured.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#717171]">{featured.description}</p>
        <button
          type="button"
          onClick={onExplore}
          className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#320EB8]"
        >
          Explore {featured.label}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function ProductMegaMenuPanel({ onClose }) {
  const navigate = useNavigate();
  const featured = PRODUCT_FEATURED;

  const handleViewAll = () => {
    onClose();
    navigate('/product');
  };

  const handleFeatured = () => {
    if (!featured) return;
    onClose();
    navigate(featured.path);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-[#EEF0F4] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Platform
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">
            Everything in Engage 360
          </h2>
        </div>
        <button
          type="button"
          onClick={handleViewAll}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-[#320EB8]"
        >
          View product overview
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_MEGA_GROUPS.map((group) => (
            <ProductMegaMenuColumn key={group.id} group={group} onClose={onClose} />
          ))}
        </div>

        {featured ? (
          <aside className="w-full shrink-0 xl:w-72">
            <ProductSpotlightCard featured={featured} onExplore={handleFeatured} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export function ProductNavDropdownDesktop({ isScrolled }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const location = useLocation();
  const isActive = isProductPathActive(location.pathname);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((value) => !value);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      const panel = document.getElementById('product-mega-menu-panel');
      if (panel?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <div ref={triggerRef} className="relative">
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls="product-mega-menu-panel"
          className={clsx(
            'inline-flex items-center gap-1 rounded-md px-0.5 py-1 text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            isScrolled
              ? clsx(
                  'text-foreground/80 hover:text-primary',
                  (isActive || open) && 'font-bold text-primary',
                )
              : clsx(
                  'text-white/90 hover:text-white',
                  (isActive || open) && 'font-bold text-white',
                ),
          )}
        >
          Product
          <ChevronDown
            className={clsx('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open ? (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-16 z-[105] cursor-default bg-[#0B1354]/25 backdrop-blur-[2px]"
                aria-label="Close product menu"
                onClick={closeMenu}
              />

              <motion.div
                id="product-mega-menu-panel"
                role="region"
                aria-label="Product menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-0 right-0 top-16 z-[110] max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[#EEF0F4] bg-white shadow-[0_20px_56px_rgba(11,19,84,0.14)]"
              >
                <ProductMegaMenuPanel onClose={closeMenu} />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function MobileProductLink({ item, onNavigate, isScrolled }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
          isScrolled
            ? isActive
              ? 'bg-primary/10 text-primary'
              : 'text-[#0B1354] hover:bg-[#F7F8FF]'
            : isActive
              ? 'bg-white/15 text-white'
              : 'text-white/90 hover:bg-white/10',
        )
      }
    >
      <span
        className={clsx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          isScrolled ? item.iconBg : 'bg-white/15 text-white',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{item.label}</p>
        <p
          className={clsx(
            'mt-0.5 text-xs leading-relaxed line-clamp-2',
            isScrolled ? 'text-[#717171]' : 'text-white/75',
          )}
        >
          {item.description}
        </p>
      </div>
    </NavLink>
  );
}

export function ProductNavDropdownMobile({ isScrolled, onNavigate }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = isProductPathActive(location.pathname);

  return (
    <div className={clsx('border-b', isScrolled ? 'border-border' : 'border-white/10')}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          'flex w-full items-center justify-between py-4 text-base transition-colors cursor-pointer',
          isScrolled
            ? clsx(
                'border-border text-foreground/80 hover:text-primary',
                isActive && 'font-bold text-primary',
              )
            : clsx('text-white/90 hover:text-white', isActive && 'font-bold text-white'),
        )}
      >
        Product
        <ChevronDown
          className={clsx('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className={clsx(
                'mb-4 max-h-[min(60vh,520px)] space-y-5 overflow-y-auto rounded-xl p-3',
                isScrolled ? 'bg-[#FAFBFC] ring-1 ring-[#EEF0F4]' : 'bg-white/10',
              )}
            >
              {PRODUCT_MEGA_GROUPS.map((group) => (
                <div key={group.id}>
                  <p
                    className={clsx(
                      'px-3 text-[11px] font-bold uppercase tracking-wide',
                      isScrolled ? 'text-[#9AA0B0]' : 'text-white/60',
                    )}
                  >
                    {group.label}
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <MobileProductLink
                          item={item}
                          isScrolled={isScrolled}
                          onNavigate={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
