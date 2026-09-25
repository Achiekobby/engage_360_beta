import { MotionButton, Reveal } from '../../motion';

export default function CtaSection({ onGetStarted, onTalkToSales }) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="scaleIn" amount={0.25}>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-primary px-6 py-12 text-center shadow-[0_24px_60px_rgba(58,16,205,0.28)] sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/[0.06] blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/[0.05] blur-2xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
                Start Managing and Engaging Smarter Today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:mt-5 sm:text-base">
                Join hundreds of resilient organizations across Africa driving growth through
                intelligent operations.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
                <MotionButton
                  onClick={onGetStarted}
                  className="rounded-none bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-white/95 cursor-pointer sm:px-9 sm:text-base"
                >
                  Get Started
                </MotionButton>
                <MotionButton
                  onClick={onTalkToSales}
                  className="rounded-none border border-white/70 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer sm:px-9 sm:text-base"
                >
                  Talk to Sales
                </MotionButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
