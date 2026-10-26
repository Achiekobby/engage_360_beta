import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Sparkles } from 'lucide-react';

export default function ActivityHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFEBFF] via-[#F5F2FF] to-[#E4F2FF] px-6 py-8 sm:px-10 sm:py-10">
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-[#3A10CD]/10" />
      <Megaphone
        aria-hidden
        className="pointer-events-none absolute -bottom-4 right-8 hidden h-40 w-40 -rotate-12 text-[#3A10CD]/15 md:block"
        strokeWidth={1.25}
      />

      <div className="relative max-w-xl">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          A little something, just for you
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0B1354] sm:text-4xl">
          Good things happen when you engage
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4A5070]">
          Every action you complete earns points. See what you’ve earned, what’s on its way, and what you’ve
          already redeemed.
        </p>
        <Link
          to="/rewards"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Redeem points
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
