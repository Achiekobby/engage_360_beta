import { clsx } from 'clsx';
import { Ban, Clapperboard, FileImage, Image as ImageIcon } from 'lucide-react';
import { SettingsFieldError, SettingsHelp } from './AutomationSettingsFields';

const TYPE_ICONS = {
  image: ImageIcon,
  video: Clapperboard,
  gif: FileImage,
  none: Ban,
};

export default function MediaTypeCards({
  label,
  help,
  options,
  value,
  onChange,
  errorName,
  centered = true,
}) {
  return (
    <div>
      {label ? (
        <div
          className={clsx(
            'mb-3 flex items-center gap-1',
            centered ? 'justify-center' : 'justify-start',
          )}
        >
          <p className="text-sm font-semibold text-[#0B1354]">{label}</p>
          <SettingsHelp text={help} />
        </div>
      ) : null}

      <div className={clsx(centered && 'flex justify-center')}>
        <div
          className={clsx(
            'grid gap-3 sm:gap-6',
            options.length >= 3 ? 'grid-cols-3' : 'grid-cols-2',
            centered ? 'w-full max-w-md' : 'w-full max-w-sm',
          )}
        >
          {options.map((option) => {
            const Icon = TYPE_ICONS[option.value] || ImageIcon;
            const active = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className="group flex cursor-pointer flex-col items-center gap-2"
              >
                <span
                  className={clsx(
                    'flex h-16 w-16 items-center justify-center rounded-xl border transition-colors sm:h-[4.5rem] sm:w-[4.5rem]',
                    active
                      ? 'border-primary bg-[#F7F8FF] text-primary'
                      : 'border-[#E4E4E7] bg-white text-[#717171] group-hover:border-primary/40 group-hover:text-primary',
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
                <span
                  className={clsx(
                    'text-center text-sm font-semibold',
                    active ? 'text-[#0B1354]' : 'text-[#717171]',
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {errorName ? <SettingsFieldError name={errorName} /> : null}
    </div>
  );
}
