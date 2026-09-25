import { Check, ShoppingBag } from 'lucide-react';

const DEFAULT_TILES = [
  { label: 'Sale', price: '30% Off' },
  { label: 'Deal', price: 'Buy 1 Get 1' },
  { label: 'New', price: 'Just In' },
  { label: 'Hot', price: 'Limited' },
];

/** Renders a template as a realistic email reading-pane, not a phone mockup. */
export default function EmailPreviewCanvas({ headline, body, cta, accent, products }) {
  const tiles = products?.length ? products : DEFAULT_TILES;

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border border-[#E4E6EC] bg-white shadow-[0_20px_48px_rgba(11,19,84,0.1)]">
      <div className="flex items-center gap-3 border-b border-[#EEF0F4] px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          E
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0B1354]">Engage 360</p>
          <p className="truncate text-xs text-[#9AA0B0]">hello@engage360.com</p>
        </div>
        <span className="shrink-0 text-xs text-[#9AA0B0]">Just now</span>
      </div>

      <div className="border-b border-[#EEF0F4] px-5 py-3">
        <p className="truncate text-sm font-semibold text-[#0B1354]">
          {headline || 'Email subject line'}
        </p>
      </div>

      <div
        className={`bg-gradient-to-br ${accent || 'from-primary to-[#6B4FE0]'} px-6 py-10 text-center text-white`}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
          Exclusive Offer
        </p>
        <h3 className="mt-3 text-2xl font-bold leading-snug">{headline || 'Your Headline'}</h3>
      </div>

      <div className="space-y-4 px-6 py-6">
        <p className="text-center text-sm leading-relaxed text-[#545454]">
          {body || 'Your email body will appear here as you type.'}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {tiles.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] px-3 py-3.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1354] text-white">
                <ShoppingBag className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="mt-2 text-xs font-bold text-[#0B1354]">{item.label}</span>
              <span className="text-[11px] text-[#717171]">{item.price}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full rounded-sm bg-primary py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.25)]"
        >
          {cta || 'Shop Now'}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#9AA0B0]">
          <Check className="h-3.5 w-3.5 text-[#1F9D55]" strokeWidth={2.5} />
          Live customer preview
        </div>
      </div>

      <div className="border-t border-[#EEF0F4] px-6 py-4 text-center text-[11px] leading-relaxed text-[#9AA0B0]">
        You&apos;re receiving this email because you subscribed to Engage 360 updates.{' '}
        <span className="font-medium text-primary">Unsubscribe</span>
      </div>
    </div>
  );
}
