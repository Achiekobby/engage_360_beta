import { Reveal } from '../motion';

export default function AcademySectionHeader({ title, subtitle, align = 'center' }) {
  const isCenter = align === 'center';

  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className={isCenter ? 'text-center' : 'text-left'}>
        <div className={isCenter ? 'inline-flex flex-col items-center' : 'flex flex-col'}>
          <h2 className="relative inline-block text-2xl font-bold text-[#0B1354] sm:text-3xl">
            <span
              className="absolute bottom-[0.12em] -left-1.5 -right-1.5 z-0 h-[0.42em] bg-[#B9A9E8] sm:-left-2 sm:-right-2"
              aria-hidden="true"
            />
            <span className="relative z-[1]">{title}</span>
          </h2>
          {subtitle ? (
            <p
              className={`mt-4 max-w-2xl text-sm text-[#717171] sm:text-base ${
                isCenter ? '' : 'max-w-xl'
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
