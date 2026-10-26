import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { clsx } from 'clsx';

export default function RewardCard({ reward, redemptions, onToggleStatus }) {
  const inactive = reward.status === 'inactive';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E6E8F0] bg-white">
      <div className="relative aspect-[16/10] bg-[#F4F5F8]">
        <img
          src={reward.image}
          alt=""
          className={clsx('h-full w-full object-cover', inactive && 'opacity-50')}
        />
        <span className="absolute right-3 top-3 inline-flex min-w-6 items-center justify-center rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">
          {redemptions}
        </span>
      </div>

      <div className="flex flex-1 flex-col bg-[#F4F6FA] px-4 pb-4 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#0B1354]">{reward.title}</h2>
          {inactive ? (
            <span className="shrink-0 rounded-md bg-[#F4F4F5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
              Inactive
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm font-bold text-[#0B1354]">{reward.headline}</p>
        <p className="mt-0.5 text-sm text-[#717171]">{reward.description}</p>
        <p className="mt-3 text-base font-bold text-[#0B1354]">{reward.points.toLocaleString()} pts</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/rewards/activity?reward=${reward.id}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
            View Activity
          </Link>
          <button
            type="button"
            onClick={() => onToggleStatus(reward)}
            className="inline-flex cursor-pointer items-center rounded-full border border-primary bg-white px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {inactive ? 'Activate' : 'Deactivate'}
          </button>
        </div>
      </div>
    </article>
  );
}
