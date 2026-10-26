import { Gift } from 'lucide-react';
import Images from '../../utils/Images';

/** `points` is the verified recipient's balance, or null when nobody is verified. */
export default function RecipientOfferNavbar({ onRewards, points = null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EEF0F4] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#offer-top" className="inline-flex items-center" aria-label="Engage360, back to top">
          <img src={Images.logo} alt="Engage360" className="h-9 w-auto object-contain sm:h-10" />
        </a>

        <button
          type="button"
          onClick={onRewards}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-4 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Gift className="h-4 w-4" strokeWidth={2.25} />
          Rewards
          {points !== null ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
              {points.toLocaleString()} pts
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
