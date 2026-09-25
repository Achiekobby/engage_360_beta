import { clsx } from 'clsx';

const VARIANTS = {
  blue: 'bg-gradient-to-br from-[#E4F1FA] to-[#CFE6F5] text-[#2E7DAD] shadow-[0_4px_10px_rgba(46,125,173,0.18)]',
  lavender: 'bg-gradient-to-br from-[#E6E9F6] to-[#D4D9EE] text-[#5B6FA8] shadow-[0_4px_10px_rgba(91,111,168,0.18)]',
  orange: 'bg-gradient-to-br from-[#FFEFDF] to-[#FDDFC4] text-[#E8874A] shadow-[0_4px_10px_rgba(232,135,74,0.18)]',
  purple: 'bg-gradient-to-br from-white/20 to-white/10 text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] ring-1 ring-white/10',
};

export default function ServiceIconBadge({ icon: Icon, variant = 'blue' }) {
  return (
    <div
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11',
        VARIANTS[variant],
      )}
    >
      <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
    </div>
  );
}
