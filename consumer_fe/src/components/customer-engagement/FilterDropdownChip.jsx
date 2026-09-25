import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const MENU_WIDTH = 192;

export default function FilterDropdownChip({ label, options, icon: Icon, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const left =
      align === 'left'
        ? rect.left
        : Math.max(8, rect.right - MENU_WIDTH);

    setMenuStyle({
      top: rect.bottom + 8,
      left,
    });
  }, [align]);

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
      if (
        buttonRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const isActive = selected !== options[0];

  const menu = (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          style={{
            position: 'fixed',
            top: menuStyle.top,
            left: menuStyle.left,
            width: MENU_WIDTH,
            zIndex: 9999,
          }}
          className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_12px_32px_rgba(11,19,84,0.14)]"
          role="menu"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={clsx(
                'flex w-full cursor-pointer items-center px-3.5 py-2.5 text-left text-sm transition-colors',
                selected === option
                  ? 'bg-[#F7F8FF] font-semibold text-primary'
                  : 'text-[#0B1354] hover:bg-[#F8F9FC]',
              )}
            >
              {option}
            </button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          'inline-flex cursor-pointer items-center gap-2 rounded-sm border bg-white px-3 py-2 text-sm transition-all duration-200',
          isActive || open
            ? 'border-primary/40 text-primary shadow-[0_4px_14px_rgba(58,16,205,0.08)]'
            : 'border-[#E4E4E7] text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF]',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={2} />
        <span className="max-w-[7.5rem] truncate font-medium">{isActive ? selected : label}</span>
        <ChevronDown
          className={clsx(
            'h-3.5 w-3.5 shrink-0 text-[#717171] transition-transform duration-200',
            open && 'rotate-180',
          )}
          strokeWidth={2}
        />
      </button>

      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </>
  );
}
