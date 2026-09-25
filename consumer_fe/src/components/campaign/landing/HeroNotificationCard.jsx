import Images from '../../../utils/Images';

export default function HeroNotificationCard() {
  return (
    <div className="w-[min(100%,310px)] rounded-xl bg-white p-4 shadow-[0_12px_40px_rgba(11,19,84,0.12)] sm:w-[324px] sm:p-[1.125rem]">
      <div className="space-y-4">
        <div className="flex gap-3">
          <img
            src={Images.hero.icon_hero}
            alt="Dealsgh"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-[#0B1354]">Dealsgh</p>
              <span className="shrink-0 text-[10px] text-[#717171]">12:15pm</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-[#0B1354]">
              New product launch + Discount
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#717171] line-clamp-2">
              We are excited to announce our new product launch and exclusive discount for you.
              Stay tuned for more details.
            </p>
          </div>
        </div>

        <div className="border-t border-[#ECEEF3] pt-4">
          <div className="flex gap-3">
            <img
              src={Images.hero.fasion_hero}
              alt="Fix Fashion"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[#0B1354]">Fix Fashion</p>
                <span className="shrink-0 text-[10px] text-[#717171]">2:30pm</span>
              </div>
              <p className="mt-0.5 text-xs font-semibold text-[#0B1354]">
                FLASH SALE: 25% off Everything
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#717171] line-clamp-2">
                Get ready for our biggest sale of the season! Enjoy 25% off on all items for a
                limited time only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
