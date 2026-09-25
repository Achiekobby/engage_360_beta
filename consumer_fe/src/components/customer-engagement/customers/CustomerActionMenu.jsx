import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Edit3,
  Eye,
  MoreHorizontal,
  StickyNote,
  Tag,
} from 'lucide-react';
import { clsx } from 'clsx';
import { SEGMENT_TAGS } from './collectionCustomersData';

export default function CustomerActionMenu({
  customer,
  onView,
  onEdit,
  onWriteNote,
  onSegmentChange,
}) {
  const [open, setOpen] = useState(false);
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 220;
    setMenuStyle({
      top: rect.bottom + 8,
      left: Math.max(8, rect.right - menuWidth),
    });
  }, []);

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
      setSegmentOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const close = () => {
    setOpen(false);
    setSegmentOpen(false);
  };

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
            width: 220,
            zIndex: 9999,
          }}
          className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_12px_32px_rgba(11,19,84,0.14)]"
          role="menu"
        >
          {!segmentOpen ? (
            <div className="py-1">
              {[
                { label: 'View', icon: Eye, action: () => { onView(customer); close(); } },
                { label: 'Edit', icon: Edit3, action: () => { onEdit(customer); close(); } },
                { label: 'Write Note', icon: StickyNote, action: () => { onWriteNote(customer); close(); } },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={action}
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
                >
                  <Icon className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  {label}
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => setSegmentOpen(true)}
                className="flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
              >
                <span className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  Segment Tag
                </span>
                <ChevronRight className="h-4 w-4 text-[#717171]" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                type="button"
                onClick={() => setSegmentOpen(false)}
                className="flex w-full cursor-pointer items-center gap-2 border-b border-[#F0F2F7] px-3.5 py-2 text-xs font-semibold text-primary"
              >
                <ChevronRight className="h-3.5 w-3.5 rotate-180" strokeWidth={2.5} />
                Segment Tag
              </button>
              <div className="max-h-56 overflow-y-auto py-1">
                {SEGMENT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSegmentChange(customer, tag);
                      close();
                    }}
                    className={clsx(
                      'flex w-full cursor-pointer px-3.5 py-2 text-left text-sm transition-colors hover:bg-[#F7F8FF]',
                      customer.segment === tag
                        ? 'font-semibold text-primary'
                        : 'text-[#0B1354]',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
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
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#F5A623] transition-colors hover:bg-[#FFF8E8]"
        aria-label={`Actions for ${customer.fullName}`}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
      </button>
      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </>
  );
}
