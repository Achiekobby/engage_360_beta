import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BadgeCheck, ChevronDown, ChevronUp, ChevronsUpDown, LoaderCircle, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { formatActivityWhen, rewardLineLabel } from '../../constants/rewards';
import RewardStatusBadge from './RewardStatusBadge';

const COLUMNS = [
  { key: 'createdAt', label: 'Date & Time' },
  { key: 'phone', label: 'Phone number' },
  { key: 'email', label: 'Email' },
  { key: 'reward', label: 'Reward' },
  { key: 'points', label: 'Points', align: 'right' },
  { key: 'status', label: 'Status' },
];

function placeMenu(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = 196;
  const height = 112;
  const openUp = window.innerHeight - rect.bottom < height + 12 && rect.top > height;
  const top = openUp ? rect.top - height - 6 : rect.bottom + 6;
  const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
  return { top, left, width };
}

function RowActions({ row, onSetStatus }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onResize = () => setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const choose = (status) => {
    onSetStatus(row.id, status);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Update status for ${row.phone}`}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          setPosition(placeMenu(buttonRef.current));
          setOpen(true);
        }}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#717171] hover:bg-[#EFF6FF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && position
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{ top: position.top, left: position.left, width: position.width }}
              className="fixed z-[220] rounded-xl border border-[#E6E8F0] bg-white p-1.5 shadow-[0_16px_36px_rgba(11,19,84,0.16)]"
            >
              <button
                type="button"
                role="menuitem"
                disabled={row.status === 'processing'}
                onClick={() => choose('processing')}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-[#1D4ED8] hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LoaderCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Processing
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={row.status === 'fulfilled'}
                onClick={() => choose('fulfilled')}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-[#157A42] hover:bg-[#E7F8EE] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Fulfilled
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function SortMark({ active, direction }) {
  if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 text-[#C4C4CC]" aria-hidden="true" />;
  return direction === 'asc' ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
  );
}

export default function ActivityTable({
  rows,
  rewardsById,
  sort,
  onSort,
  selectedIds,
  onToggle,
  onTogglePage,
  onSetStatus,
}) {
  const pageIds = rows.map((row) => row.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
        <caption className="sr-only">Reward redemptions</caption>
        <thead>
          <tr className="text-xs font-medium text-[#717171]">
            <th className="w-12 border-b border-[#F0F2F7] px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onTogglePage(pageIds, !allSelected)}
                aria-label="Select rows on this page"
                className="h-4 w-4 cursor-pointer accent-primary"
              />
            </th>
            {COLUMNS.map((column) => {
              const active = sort.key === column.key;
              return (
                <th
                  key={column.key}
                  aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={clsx('border-b border-[#F0F2F7] px-3 py-3 font-medium', column.align === 'right' && 'text-right')}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={clsx(
                      'inline-flex cursor-pointer items-center gap-1 rounded-md hover:text-[#0B1354] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                      column.align === 'right' && 'ml-auto',
                    )}
                  >
                    {column.label}
                    <SortMark active={active} direction={sort.direction} />
                  </button>
                </th>
              );
            })}
            <th className="w-16 border-b border-[#F0F2F7] px-3 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const reward = rewardsById.get(row.rewardId);
            return (
              <tr key={row.id} className="text-[#3F3F46] hover:bg-[#F8FAFF]">
                <td className="border-b border-[#F4F5F8] px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => onToggle(row.id)}
                    aria-label={`Select ${row.phone}`}
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                </td>
                <td className="whitespace-nowrap border-b border-[#F4F5F8] px-3 py-3.5 tabular-nums text-[#0B1354]">
                  {formatActivityWhen(row.createdAt)}
                </td>
                <td className="whitespace-nowrap border-b border-[#F4F5F8] px-3 py-3.5 tabular-nums">{row.phone}</td>
                <td className="border-b border-[#F4F5F8] px-3 py-3.5">{row.email}</td>
                <td className="whitespace-nowrap border-b border-[#F4F5F8] px-3 py-3.5 font-medium text-[#0B1354]">{rewardLineLabel(reward)}</td>
                <td className="border-b border-[#F4F5F8] px-3 py-3.5 text-right tabular-nums font-semibold text-[#0B1354]">
                  {row.points.toLocaleString()}
                </td>
                <td className="border-b border-[#F4F5F8] px-3 py-3.5">
                  <RewardStatusBadge status={row.status} />
                </td>
                <td className="border-b border-[#F4F5F8] px-3 py-3.5 text-right">
                  <RowActions row={row} onSetStatus={onSetStatus} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
