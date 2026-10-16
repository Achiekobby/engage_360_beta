import { clsx } from 'clsx';

export default function AutomationsKindChips({ kinds, activeKind, onKindChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2">
      {kinds.map((kind) => {
        const active = activeKind === kind.id;

        return (
          <button
            key={kind.id}
            type="button"
            onClick={() => onKindChange(kind.id)}
            className={clsx(
              'cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
              active
                ? 'bg-primary text-white shadow-[0_4px_14px_rgba(58,16,205,0.25)]'
                : 'border border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF]',
            )}
          >
            {kind.label}
          </button>
        );
      })}
    </div>
  );
}
