import { Link } from 'react-router-dom';
import { ArrowRight, LifeBuoy } from 'lucide-react';
import FaqAccordion from '../../components/help-center/FaqAccordion';
import { FAQ_ITEMS } from '../../components/rewards/rewardsContent';

export default function RewardsFaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">FAQ</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0B1354] sm:text-[40px]">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5B6180]">
          Quick answers about earning, expiring and redeeming your points.
        </p>
      </header>

      <FaqAccordion items={FAQ_ITEMS} />

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E4DEFB] bg-[#F7F5FF] p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <LifeBuoy className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-[#0B1354]">Still need help?</p>
            <p className="text-sm text-[#5B6180]">Our team usually replies within one business day.</p>
          </div>
        </div>
        <Link
          to="/rewards/contact"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Contact us
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
