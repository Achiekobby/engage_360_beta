import Images from '../../../utils/Images';
import { Reveal, StaggerReveal, StaggerItem } from '../../motion';

const PARTNER_LOGOS = Object.entries(Images.partners).map(([id, src]) => ({
  id,
  src,
  alt: id.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
}));

export default function FeaturedBusinessesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#F8F9FB] to-[#F2F4F7]">
      {/* Background patterns */}
      <div
        className="partners-pattern-dots pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />
      <div
        className="partners-pattern-grid pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      />
      <div
        className="partners-pattern-diagonal pointer-events-none absolute inset-y-0 right-0 w-[min(55%,520px)] opacity-70"
        aria-hidden="true"
      />

      {/* Orbit rings — echoes brand logo mark */}
      <svg
        className="pointer-events-none absolute -right-16 top-6 h-[280px] w-[280px] text-primary/[0.07] sm:-right-8 sm:top-10 sm:h-[340px] sm:w-[340px] lg:right-4 lg:h-[400px] lg:w-[400px]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="142" stroke="currentColor" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="96" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="52" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
      </svg>
      <svg
        className="pointer-events-none absolute -left-20 bottom-4 h-[220px] w-[220px] text-[#0B1354]/[0.05] sm:-left-12 sm:bottom-8 sm:h-[260px] sm:w-[260px]"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="130" cy="130" r="118" stroke="currentColor" strokeWidth="1" />
        <circle cx="130" cy="130" r="78" stroke="currentColor" strokeWidth="1" strokeDasharray="5 9" />
        <circle cx="130" cy="130" r="38" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div
        className="pointer-events-none absolute -left-32 top-8 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto w-full max-w-8xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Reveal className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 sm:text-[13px]">
            Our partners
          </p>
          <h2 className="mt-3 text-[1.35rem] font-bold leading-[1.35] tracking-tight sm:text-2xl lg:text-[1.75rem] lg:leading-[1.4]">
            <span className="text-[#0B1354]">Featured businesses</span>{' '}
            <span className="font-normal text-[#717171]">
              we have supported to help reach their goals and market targets
            </span>
          </h2>
        </Reveal>

        <div className="mt-8 sm:mt-10" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D8DCE6] to-transparent" />
        </div>

        <StaggerReveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-5 lg:mt-12 lg:gap-6" stagger={0.06}>
          {PARTNER_LOGOS.map(({ id, src, alt }) => (
            <StaggerItem
              key={id}
              className="group flex h-[5.5rem] items-center justify-center rounded-xl border border-[#ECEEF3] bg-white/90 p-4 shadow-[0_4px_18px_rgba(11,19,84,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/15 hover:bg-white hover:shadow-[0_14px_36px_rgba(11,19,84,0.1)] sm:h-24 sm:p-5 lg:h-[6.75rem]"
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[2.75rem] max-w-[85%] object-contain opacity-90 transition-all duration-300 group-hover:scale-[1.04] group-hover:opacity-100 sm:max-h-[3rem] lg:max-h-[3.25rem]"
                loading="lazy"
              />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
