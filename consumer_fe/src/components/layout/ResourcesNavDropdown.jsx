import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { RESOURCE_ITEMS, isResourcePathActive } from './navData';

function ResourceDropdownItem({ item, onNavigate, isFirst }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
          isFirst && 'rounded-t-xl',
          isActive
            ? 'bg-white font-semibold text-primary'
            : 'text-white hover:bg-white/10',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={clsx('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-white')}
            strokeWidth={2}
          />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function ResourcesNavDropdownDesktop({ isScrolled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();
  const isActive = isResourcePathActive(location.pathname);

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
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
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
        Resources
        <ChevronDown
          className={clsx('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-[120] mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-xl bg-primary shadow-[0_12px_40px_rgba(11,19,84,0.22)]"
          >
            <div className="divide-y divide-white/10">
              {RESOURCE_ITEMS.map((item, index) => (
                <ResourceDropdownItem
                  key={item.label}
                  item={item}
                  isFirst={index === 0}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ResourcesNavDropdownMobile({ isScrolled, onNavigate }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = isResourcePathActive(location.pathname);

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
        Resources
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
            <div className="mb-3 overflow-hidden rounded-xl bg-primary/90">
              <div className="divide-y divide-white/10">
                {RESOURCE_ITEMS.map((item, index) => (
                  <ResourceDropdownItem
                    key={item.label}
                    item={item}
                    isFirst={index === 0}
                    onNavigate={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
