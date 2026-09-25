import { Film, Image, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel } from './WizardFormField';
import { PROMO_VISUAL_OPTIONS } from './campaignsData';

const PROMO_VISUAL_META = {
  image: {
    icon: Image,
    accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
    selectedAccent: 'bg-[#2E7DAD] text-white',
  },
  video: {
    icon: Film,
    accent: 'bg-[#EDE8F8] text-primary',
    selectedAccent: 'bg-primary text-white',
  },
  gif: {
    icon: Sparkles,
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    selectedAccent: 'bg-[#E67E22] text-white',
  },
};

export default function PromoVisualPicker({
  value,
  onChange,
  help,
  error,
  name,
  label = 'Promo Visual',
}) {
  return (
    <div>
      <FieldLabel help={help}>{label}</FieldLabel>

      <div
        className={clsx(
          'grid grid-cols-3 gap-2',
          error ? 'rounded-sm ring-1 ring-[#E5484D]/30' : '',
        )}
        role="radiogroup"
        aria-label={label}
      >
        {PROMO_VISUAL_OPTIONS.map((option) => {
          const meta = PROMO_VISUAL_META[option.id];
          const Icon = meta?.icon || Image;
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              name={name}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={clsx(
                'group flex cursor-pointer flex-col items-center justify-center rounded-sm border px-2 py-3 transition-all duration-200',
                selected
                  ? 'border-primary bg-[#F7F8FF] shadow-[0_4px_14px_rgba(58,16,205,0.1)] ring-2 ring-primary/10'
                  : 'border-[#EEF0F4] bg-white hover:border-primary/25 hover:bg-[#FAFBFC]',
              )}
            >
              <span
                className={clsx(
                  'mb-2 flex h-9 w-9 items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105',
                  selected ? meta.selectedAccent : meta.accent,
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span
                className={clsx(
                  'text-xs font-semibold',
                  selected ? 'text-primary' : 'text-[#0B1354]',
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <FieldError message={error} />
    </div>
  );
}
