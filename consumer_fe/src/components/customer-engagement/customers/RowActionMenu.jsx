import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

const MENU_WIDTH = 220;

export default function RowActionMenu({ label = 'Actions', items = [] }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ top: 0, left: 0, openUp: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const actions = items.filter(Boolean);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const gap = 8;
    const estimatedHeight = actions.length * 42 + 8;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    const left = Math.min(
      Math.max(8, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - 8,
    );

    if (openUp) {
      setPlacement({
        openUp: true,
        bottom: window.innerHeight - rect.top + gap,
        left,
      });
      return;
    }

    setPlacement({
      openUp: false,
      top: rect.bottom + gap,
      left,
    });
  }, [actions.length]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (buttonRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const slideY = placement.openUp ? -6 : 6;
  const menu = (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: slideY, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: slideY, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          style={{
            position: 'fixed',
            top: placement.openUp ? undefined : placement.top,
            bottom: placement.openUp ? placement.bottom : undefined,
            left: placement.left,
            width: MENU_WIDTH,
            zIndex: 9999,
          }}
          className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white py-1 shadow-[0_12px_32px_rgba(11,19,84,0.14)]"
          role="menu"
        >
          {actions.map((item) => {
            const Icon = item.icon;
            const danger = item.tone === 'danger';
            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={clsx(
                  'flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors',
                  danger
                    ? 'text-[#E53935] hover:bg-[#FEECEC]'
                    : 'text-[#0B1354] hover:bg-[#F7F8FF]',
                )}
              >
                {Icon ? (
                  <Icon
                    className={clsx('h-4 w-4', danger ? 'text-[#E53935]' : 'text-[#717171]')}
                    strokeWidth={2}
                  />
                ) : null}
                {item.label}
              </button>
            );
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B1354]"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-5 w-5" strokeWidth={2.25} />
      </button>
      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </>
  );
}
