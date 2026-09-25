import { useState } from 'react';
import { clsx } from 'clsx';

export function ChartTooltip({ title, items }) {
  return (
    <div
      role="tooltip"
      className="min-w-[10.75rem] rounded-lg border border-[#E8EAEF] bg-white px-3 py-2 shadow-[0_10px_28px_rgba(11,19,84,0.16)]"
    >
      {title ? <p className="mb-1.5 text-[11px] font-semibold text-[#0B1354]">{title}</p> : null}
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.label}
            className={clsx('flex items-center justify-between gap-4 text-xs', item.muted && 'opacity-45')}
          >
            <span className="flex min-w-0 items-center gap-1.5 text-[#52525B]">
              {item.color ? (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              ) : null}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-[#0B1354]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function tooltipStyle(x, y, flip = false) {
  return {
    left: x,
    top: y,
    transform: flip ? 'translate(-50%, 10px)' : 'translate(-50%, calc(-100% - 10px))',
  };
}

export function useChartFocus() {
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = pinned ?? hovered;

  return {
    active,
    pinned,
    dim: (id) => active != null && active !== id,
    enter: (id) => setHovered(id),
    leave: () => setHovered(null),
    toggle: (id) => setPinned((prev) => (prev === id ? null : id)),
  };
}

export function useSeriesVisibility(ids) {
  const [hidden, setHidden] = useState(() => new Set());

  const toggle = (id) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < ids.length - 1) next.add(id);
      return next;
    });
  };

  return {
    isHidden: (id) => hidden.has(id),
    toggle,
  };
}
