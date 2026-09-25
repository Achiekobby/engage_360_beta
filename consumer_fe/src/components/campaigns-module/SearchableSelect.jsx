import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { inputClassName } from './WizardFormField';

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Search…',
  disabled = false,
  error,
  emptyMessage = 'No matches found.',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuStyle, setMenuStyle] = useState(null);
  const containerRef = useRef(null);

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const updateMenuPosition = () => {
    const anchor = containerRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return undefined;

    updateMenuPosition();

    function handleClickOutside(event) {
      const inContainer = containerRef.current?.contains(event.target);
      const inMenu = event.target.closest('[data-searchable-select-menu]');
      if (!inContainer && !inMenu) {
        setOpen(false);
        setQuery('');
      }
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  const handleSelect = (option) => {
    onChange(option);
    setQuery('');
    setOpen(false);
  };

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    requestAnimationFrame(updateMenuPosition);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA0B0]"
          strokeWidth={2}
        />
        <input
          id={id}
          type="text"
          value={open ? query : value || ''}
          disabled={disabled}
          placeholder={value && !open ? value : placeholder}
          onFocus={openMenu}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            requestAnimationFrame(updateMenuPosition);
          }}
          className={clsx(
            inputClassName(error),
            'cursor-text pl-8 pr-8 disabled:cursor-not-allowed disabled:bg-[#F5F6F8] disabled:text-[#9AA0B0]',
          )}
          aria-invalid={Boolean(error)}
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
        />
        <ChevronDown
          className={clsx(
            'pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA0B0] transition-transform',
            open && 'rotate-180',
          )}
          strokeWidth={2}
        />
      </div>

      {open && !disabled && menuStyle
        ? createPortal(
            <div
              data-searchable-select-menu
              role="listbox"
              className="fixed z-[200] max-h-56 overflow-y-auto rounded-sm border border-[#C8CDD8] bg-white py-1 shadow-[0_16px_40px_rgba(11,19,84,0.18)]"
              style={menuStyle}
            >
              {filtered.length > 0 ? (
                filtered.map((option) => {
                  const selected = option === value;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelect(option)}
                      className={clsx(
                        'flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors',
                        selected
                          ? 'bg-[#F7F8FF] font-semibold text-primary'
                          : 'text-[#0B1354] hover:bg-[#FAFBFC]',
                      )}
                    >
                      {option}
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                    </button>
                  );
                })
              ) : (
                <p className="px-3.5 py-2 text-xs text-[#9AA0B0]">{emptyMessage}</p>
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
