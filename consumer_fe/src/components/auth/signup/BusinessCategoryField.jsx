import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ErrorMessage, useField } from 'formik';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import AuthFieldLabel from '../AuthFieldLabel';
import { authErrorClass } from '../authStyles';
import { useBusinessCategories } from '../../../hooks/useBusinessCategories';

const controlClass =
  'w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 text-sm text-[#0B1354] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-[#FAFAFA] disabled:text-[#A1A1AA]';

function Highlight({ text, query }) {
  const term = query.trim();
  if (!term) return text;

  const needle = term.toLowerCase();
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escaped})`, 'ig'));

  return parts.map((part, index) =>
    part.toLowerCase() === needle ? (
      <span key={`${part}-${index}`} className="rounded-sm bg-[#EDE9FE] font-semibold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function rankCategory(category, term) {
  if (!term) return 0;
  const name = category.name.toLowerCase();
  if (name.startsWith(term)) return 0;
  if (name.includes(term)) return 1;
  return 2;
}

export default function BusinessCategoryField() {
  const inputId = 'businessCategoryId';
  const listId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [field, meta, helpers] = useField('businessCategoryId');
  const { data, isPending, isError, isFetching, error, refetch } = useBusinessCategories();
  const categories = data ?? [];
  const showLoading = isPending && categories.length === 0;
  const unavailable = isError && categories.length === 0;
  const showError = Boolean(meta.touched && meta.error);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState(null);

  const selected = categories.find((category) => category.id === field.value) || null;

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categories
      .map((category, index) => ({ category, index }))
      .filter(({ category }) => {
        if (!term) return true;
        return (
          category.name.toLowerCase().includes(term) ||
          category.description.toLowerCase().includes(term)
        );
      })
      .sort(
        (a, b) => rankCategory(a.category, term) - rankCategory(b.category, term) || a.index - b.index,
      )
      .map(({ category }) => category);
  }, [categories, query]);

  const clampedIndex = visible.length === 0 ? -1 : Math.min(activeIndex, visible.length - 1);

  const updatePlacement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const openUp = below < 168 && above > below;
    const room = openUp ? above : below;

    setPlacement({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(340, Math.max(180, room)),
      ...(openUp ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    });
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const openMenu = useCallback(() => {
    if (showLoading || unavailable) return;
    updatePlacement();
    const index = categories.findIndex((category) => category.id === field.value);
    setActiveIndex(index >= 0 ? index : 0);
    setQuery('');
    setOpen(true);
  }, [showLoading, unavailable, updatePlacement, categories, field.value]);

  const commit = (category) => {
    helpers.setValue(category.id);
    helpers.setTouched(true, false);
    helpers.setError(undefined);
    closeMenu();
  };

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
    if (!open || clampedIndex < 0) return;
    const list = menuRef.current?.querySelector('[data-category-list]');
    const option = list?.querySelector(`[data-index="${clampedIndex}"]`);
    if (!list || !option) return;

    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optionRect.top;
    } else if (optionRect.bottom > listRect.bottom) {
      list.scrollTop += optionRect.bottom - listRect.bottom;
    }
  }, [open, clampedIndex, visible.length]);

  const onKeyDown = (event) => {
    if (event.key === 'Tab') return;

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Backspace') {
        event.preventDefault();
        openMenu();
        return;
      }
      if (event.key === 'Enter' && !field.value) {
        event.preventDefault();
        openMenu();
        return;
      }
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        updatePlacement();
        setQuery(event.key);
        setActiveIndex(0);
        setOpen(true);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!visible.length) return;
      setActiveIndex((index) => Math.min(Math.min(index, visible.length - 1) + 1, visible.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(Math.min(index, visible.length - 1) - 1, 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(visible.length - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (visible[clampedIndex]) commit(visible[clampedIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    }
  };

  const describedBy =
    [
      selected && !open && selected.description ? hintId : null,
      showError ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const countLabel = query.trim()
    ? `${visible.length} ${visible.length === 1 ? 'match' : 'matches'}`
    : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`;

  return (
    <div>
      <AuthFieldLabel htmlFor={inputId} required>
        Business Category
      </AuthFieldLabel>

      {unavailable ? (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-3 text-sm text-[#B91C1C]">
          <p>{error?.message || 'Business categories could not be loaded.'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-60"
          >
            {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Try again
          </button>
        </div>
      ) : (
        <div ref={containerRef} className="relative">
          {open ? (
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : null}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && clampedIndex >= 0 ? `${listId}-option-${clampedIndex}` : undefined}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            aria-required="true"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={showLoading}
            value={open ? query : selected?.name || ''}
            placeholder={
              showLoading
                ? 'Loading categories…'
                : open
                  ? selected?.name || 'Search by name or description'
                  : 'Select a business category'
            }
            onChange={(event) => {
              let next = event.target.value;
              if (!open && selected?.name) {
                if (next.startsWith(selected.name)) next = next.slice(selected.name.length);
                else if (next.endsWith(selected.name)) next = next.slice(0, -selected.name.length);
              }
              setQuery(next);
              setActiveIndex(0);
              if (!open) {
                updatePlacement();
                setOpen(true);
              }
            }}
            onFocus={() => {
              if (!open) openMenu();
            }}
            onBlur={(event) => {
              if (menuRef.current?.contains(event.relatedTarget)) return;
              closeMenu();
            }}
            onKeyDown={onKeyDown}
            className={clsx(controlClass, open ? 'pl-9' : 'pl-3.5', selected && !open ? 'pr-[4.25rem]' : 'pr-10')}
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {selected && !open ? (
              <button
                type="button"
                aria-label="Clear business category"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  helpers.setValue('');
                  helpers.setError(undefined);
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            ) : null}
            <span className="flex h-7 w-7 items-center justify-center text-[#A1A1AA]" aria-hidden="true">
              {showLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronDown
                  className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')}
                  strokeWidth={2.25}
                />
              )}
            </span>
          </div>
        </div>
      )}

      {selected && !open && selected.description ? (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-[#717171]">
          {selected.description}
        </p>
      ) : null}

      <ErrorMessage name="businessCategoryId">
        {(message) => (
          <p id={errorId} role="alert" className={authErrorClass}>
            {message}
          </p>
        )}
      </ErrorMessage>

      {open && placement
        ? createPortal(
            <div
              ref={menuRef}
              onMouseDown={(event) => event.preventDefault()}
              style={placement}
              className="fixed z-[200] flex flex-col overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_18px_44px_rgba(11,19,84,0.16)]"
            >
              <p className="shrink-0 border-b border-[#F4F4F5] px-3 py-2 text-xs text-[#717171]">{countLabel}</p>
              <ul
                id={listId}
                role="listbox"
                aria-label="Business categories"
                data-category-list
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5"
              >
                {visible.length === 0 ? (
                  <li className="px-3 py-6 text-center">
                    <p className="text-sm font-medium text-[#0B1354]">No matching categories</p>
                    <p className="mt-1 text-xs text-[#717171]">Try a different name or description.</p>
                  </li>
                ) : (
                  visible.map((category, index) => {
                    const isSelected = category.id === field.value;
                    const isActive = index === clampedIndex;
                    return (
                      <li
                        key={category.id}
                        id={`${listId}-option-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => commit(category)}
                        className={clsx(
                          'flex cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2',
                          isActive ? 'bg-[#F4F1FF]' : 'hover:bg-[#FAFAFA]',
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-[#0B1354]">
                            <Highlight text={category.name} query={query} />
                          </span>
                          {category.description ? (
                            <span className="mt-0.5 block text-xs leading-snug text-[#717171]">
                              <Highlight text={category.description} query={query} />
                            </span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                        ) : (
                          <span className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
