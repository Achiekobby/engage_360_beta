import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { OTHER_VALUE, fieldClass } from './formControls';

const normalise = (option) =>
  typeof option === 'string' ? { value: option, label: option } : option;

/**
 * Searchable single-select combobox.
 *  - `options`: strings or `{ value, label }`
 *  - `allowOther`: appends an always-visible "Other" entry whose value is OTHER_VALUE;
 *    the parent reveals a custom input when it is selected.
 * The menu renders in a portal so it is never clipped by a modal's overflow, and
 * flips upward when there is no room below.
 */
export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No matches found',
  disabled = false,
  error = false,
  searchable = true,
  allowOther = false,
  otherLabel = 'Other',
  describedBy,
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const listId = `${inputId}-list`;

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState(null);

  const items = useMemo(() => options.map(normalise), [options]);
  const otherItem = useMemo(
    () => ({ value: OTHER_VALUE, label: otherLabel, isOther: true }),
    [otherLabel],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = term ? items.filter((item) => item.label.toLowerCase().includes(term)) : items;
    return allowOther ? [...filtered, otherItem] : filtered;
  }, [items, query, allowOther, otherItem]);

  const selected =
    value === OTHER_VALUE ? otherItem : items.find((item) => item.value === value) || null;

  const updatePlacement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const openUp = below < 220 && above > below;
    const room = openUp ? above : below;

    setPlacement({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(280, Math.max(140, room)),
      ...(openUp ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    });
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    updatePlacement();
    setActiveIndex(0);
    setOpen(true);
  }, [disabled, updatePlacement]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [open, updatePlacement]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (containerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      closeMenu();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const commit = (item) => {
    onChange(item.value);
    closeMenu();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Tab') return;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && (searchable ? event.key !== ' ' : true)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (visible[activeIndex]) commit(visible[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    }
  };

  const displayValue = open && searchable ? query : selected?.label || '';
  const activeId = open && visible[activeIndex] ? `${listId}-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete={searchable ? 'list' : 'none'}
        aria-activedescendant={activeId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        readOnly={!searchable}
        disabled={disabled}
        value={displayValue}
        placeholder={open && searchable ? searchPlaceholder : placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          if (!open) openMenu();
        }}
        onFocus={openMenu}
        onClick={() => (open ? undefined : openMenu())}
        onKeyDown={onKeyDown}
        className={fieldClass(error, `h-12 truncate pr-11 ${searchable ? '' : 'cursor-pointer'}`)}
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#8A90A6]">
        {open && searchable ? (
          <Search className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            strokeWidth={2.25}
          />
        )}
      </span>

      {open && placement
        ? createPortal(
            <ul
              ref={menuRef}
              id={listId}
              role="listbox"
              onMouseDown={(event) => event.preventDefault()}
              style={placement}
              className="fixed z-[300] overflow-y-auto overscroll-contain rounded-xl border border-[#E4E6EF] bg-white p-1.5 shadow-[0_18px_44px_rgba(11,19,84,0.18)]"
            >
              {visible.length === 0 || (visible.length === 1 && visible[0].isOther && query.trim()) ? (
                <li className="px-3 py-2.5 text-sm text-[#8A90A6]">{emptyMessage}</li>
              ) : null}
              {visible.map((item, index) => {
                const isSelected = item.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={item.value}
                    id={`${listId}-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(item)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      item.isOther ? 'mt-1 border-t border-[#EEF0F4] font-semibold text-primary' : 'text-[#0B1354]'
                    } ${isActive ? 'bg-[#F1EEFF]' : ''} ${isSelected ? 'font-semibold' : ''}`}
                  >
                    <span className="truncate">
                      {item.isOther ? `${item.label} (type your own)` : item.label}
                    </span>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} /> : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
