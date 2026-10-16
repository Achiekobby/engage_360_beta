import { clsx } from 'clsx';
import { AUTOMATION_TYPES } from './automationsData';

export default function AutomationsTypeTabs({ activeType, onTypeChange }) {
  return (
    <div className="inline-flex rounded-full bg-[#EDE8F8] p-1">
      {AUTOMATION_TYPES.map((tab) => {
        const active = activeType === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTypeChange(tab.id)}
            className={clsx(
              'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
              active
                ? 'bg-white text-primary shadow-sm'
                : 'bg-transparent text-primary/80 hover:text-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
