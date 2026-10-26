import { useEffect, useId, useRef, useState } from 'react';
import { CalendarRange, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { fieldInputClass } from '../businesses/fields';
import {
  DATE_FILTER_DEFAULT,
  formatRangeLabel,
  resolveDateRange,
} from '../../constants/rewardActivity';

const PRESETS = [
  { id: 'all', label: 'All time' },
  { id: 'today', label: 'Today' },
  { id: '7', label: 'Last 7 days' },
  { id: '30', label: 'Last 30 days' },
  { id: 'month', label: 'This month' },
  { id: 'custom', label: 'Custom range' },
];

export default function ActivityDateFilter({ value, onChange, countFor }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const panelRef = useRef(null);
  const titleId = useId();
  const range = resolveDateRange(value);
  const active = value.preset !== 'all';
  const draftRange = resolveDateRange(draft);
  const draftError = draftRange?.invalid
    ? 'The start date has to be on or before the end date.'
    : draftRange?.incomplete
      ? 'Choose both a start and an end date.'
      : '';

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event) => {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const apply = () => {
    if (draftError) return;
    onChange(draft);
    setOpen(false);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          'inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          active
            ? 'border-primary bg-[#EFF6FF] text-primary'
            : 'border-[#BFDBFE] bg-white text-primary hover:bg-[#F8FBFF]',
        )}
      >
        <CalendarRange className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        {active && range?.start ? formatRangeLabel(range) : 'Date Filter'}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-labelledby={titleId}
          className="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-[#E6E8F0] bg-white p-4 shadow-[0_18px_40px_rgba(11,19,84,0.14)]"
        >
          <p id={titleId} className="text-sm font-semibold text-[#0B1354]">
            Filter by redemption date
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#717171]">
            The table and the Total, Pending, and Fulfilled cards follow this range.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => {
              const selected = draft.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDraft((current) => ({ ...current, preset: preset.id }))}
                  className={clsx(
                    'inline-flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    selected ? 'bg-primary text-white' : 'bg-[#F4F7FB] text-[#0B1354] hover:bg-[#E8F1FF]',
                  )}
                >
                  {preset.label}
                  {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          {draft.preset === 'custom' ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-[#717171]">
                From
                <input
                  type="date"
                  value={draft.from}
                  onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))}
                  className={`${fieldInputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-medium text-[#717171]">
                To
                <input
                  type="date"
                  value={draft.to}
                  onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))}
                  className={`${fieldInputClass} mt-1`}
                />
              </label>
            </div>
          ) : null}

          <p className={`mt-3 text-xs ${draftError ? 'text-[#DC2626]' : 'text-[#717171]'}`}>
            {draftError ||
              (draftRange?.start
                ? `${countFor(draftRange).toLocaleString()} redemptions in this range`
                : `${countFor(null).toLocaleString()} redemptions, all time`)}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDraft(DATE_FILTER_DEFAULT)}
              className="cursor-pointer text-sm font-semibold text-[#717171] hover:text-[#0B1354]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={Boolean(draftError)}
              className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
