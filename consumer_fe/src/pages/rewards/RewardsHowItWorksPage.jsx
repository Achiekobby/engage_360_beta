import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EARN_STEPS, GOOD_TO_KNOW } from '../../components/rewards/rewardsContent';

export default function RewardsHowItWorksPage() {
  return (
    <div className="space-y-10 sm:space-y-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">How to earn points</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0B1354] sm:text-[40px]">
          Your Points, Your Perks
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5B6180]">
          Your everyday engagement can unlock something useful. Here’s how it works in three simple steps.
        </p>
      </header>

      <ol className="grid gap-5 md:grid-cols-3">
        {EARN_STEPS.map(({ id, icon: Icon, title, description }) => (
          <li
            key={id}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#4B1FE2] to-[#6B3DF0] p-6 text-white shadow-[0_20px_40px_rgba(58,16,205,0.22)] transition-transform duration-300 hover:-translate-y-1 sm:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-8 text-[120px] font-black leading-none text-white/10"
            >
              {String(id).padStart(2, '0')}
            </span>
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_10px_24px_rgba(11,19,84,0.25)]">
              <Icon className="h-7 w-7" strokeWidth={2} />
            </span>
            <p className="relative mt-6 text-sm font-bold text-white/70">Step {String(id).padStart(2, '0')}</p>
            <h2 className="relative mt-1 text-xl font-bold leading-snug">{title}</h2>
            <p className="relative mt-2.5 text-[15px] leading-relaxed text-white/85">{description}</p>
          </li>
        ))}
      </ol>

      <section aria-labelledby="good-to-know">
        <h2 id="good-to-know" className="mb-5 text-xl font-bold text-[#0B1354]">
          Good to know
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {GOOD_TO_KNOW.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-[#E6E8F0] bg-white p-5 shadow-[0_6px_20px_rgba(11,19,84,0.05)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE9FF] text-primary">
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-[#0B1354]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5B6180]">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-8 text-center shadow-[0_6px_20px_rgba(11,19,84,0.05)] ring-1 ring-[#E6E8F0]">
        <h2 className="text-xl font-bold text-[#0B1354]">Ready to put your points to work?</h2>
        <Link
          to="/rewards"
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Browse rewards
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
