import { clsx } from 'clsx';

function cellBorders(count) {
  if (count === 3) {
    return 'max-sm:border-b max-sm:last:border-b-0 sm:border-r sm:last:border-r-0';
  }
  if (count === 5) {
    return 'max-lg:[&:nth-child(-n+4)]:border-b max-lg:odd:border-r lg:border-r lg:last:border-r-0';
  }
  return 'max-lg:[&:nth-child(-n+2)]:border-b max-lg:odd:border-r lg:border-r lg:last:border-r-0';
}

function gridCols(count) {
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3';
  if (count === 5) return 'grid-cols-2 lg:grid-cols-5';
  return 'grid-cols-2 lg:grid-cols-4';
}

export default function TableStatStrip({ items, selectedId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
      <div className={clsx('grid', gridCols(items.length))}>
        {items.map((stat) => {
          const selected = selectedId != null && selectedId === stat.id;
          const interactive = typeof stat.onSelect === 'function';
          const className = clsx(
            'relative border-[#EEF0F4] px-4 py-4 text-left',
            cellBorders(items.length),
            selected ? 'bg-[#F8FAFF]' : interactive ? 'hover:bg-[#FAFAFA]' : null,
          );
          const body = (
            <>
              <span
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ backgroundColor: selected ? stat.accent : 'transparent' }}
                aria-hidden="true"
              />
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stat.accent }} aria-hidden="true" />
                <span className="text-xs font-medium text-[#717171]">{stat.label}</span>
              </span>
              <span className="mt-2 block text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight text-[#0B1354]">
                {stat.value}
              </span>
              {stat.share != null ? (
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-[#F4F4F5]" aria-hidden="true">
                  <span className="block h-full rounded-full" style={{ width: `${stat.share}%`, backgroundColor: stat.accent }} />
                </span>
              ) : null}
              {stat.detail ? <span className="mt-1.5 block text-[11px] text-[#A1A1AA]">{stat.detail}</span> : null}
            </>
          );

          if (interactive) {
            return (
              <button
                key={stat.id}
                type="button"
                aria-pressed={selected}
                onClick={stat.onSelect}
                className={clsx(className, 'transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30')}
              >
                {body}
              </button>
            );
          }

          return (
            <div key={stat.id} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function statShare(part, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}
