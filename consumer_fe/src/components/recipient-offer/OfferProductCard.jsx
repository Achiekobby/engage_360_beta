import { useState } from 'react';
import { ArrowRight, Check, Clock } from 'lucide-react';

function pad(value) {
  return String(value).padStart(2, '0');
}

export default function OfferProductCard({ product, countdown, onViewDetails }) {
  const [copied, setCopied] = useState(false);
  const units = [
    { label: 'days', value: countdown.days },
    { label: 'hrs', value: countdown.hours },
    { label: 'min', value: countdown.minutes },
    { label: 'sec', value: countdown.seconds },
  ];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(product.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_8px_24px_rgba(11,19,84,0.06)] transition-shadow hover:shadow-[0_14px_32px_rgba(11,19,84,0.1)]">
      <div className="overflow-hidden rounded-lg bg-[#F7F7F8]">
        <img
          src={product.image}
          alt="Best prices Boxing Day sale bag"
          className="aspect-[4/3] w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h2 className="text-[15px] font-medium text-[#1A1A1A]">{product.title}</h2>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white">
            {product.redeemLabel}
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </span>
          <p className="text-lg font-bold tracking-tight text-[#111]">{product.price}</p>
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#8A8A93]">
            <Clock className="h-3 w-3 text-primary" strokeWidth={2.5} />
            {countdown.ended ? 'Promo ended' : 'Promo ends in'}
          </p>
          <div
            className={`mt-2 grid grid-cols-4 gap-1.5 ${countdown.ended ? 'opacity-40' : ''}`}
            aria-label={`Promo ends in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
          >
            {units.map((unit) => (
              <div
                key={unit.label}
                className="rounded-md border border-[#E6E6EA] bg-[#FAFAFB] px-1 py-1.5 text-center"
              >
                <p className="text-sm font-bold tabular-nums text-[#111]">{pad(unit.value)}</p>
                <p className="text-[10px] uppercase text-[#8A8A93]">{unit.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="cursor-pointer rounded-md border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-[#3A3A3A] transition-colors hover:border-[#3A10CD]/30 hover:text-primary"
          >
            {copied ? (
              <span className="inline-flex items-center gap-1">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Copied
              </span>
            ) : (
              product.code
            )}
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="cursor-pointer text-xs font-medium text-[#6B6B73] underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            View full description
          </button>
        </div>
      </div>
    </article>
  );
}
