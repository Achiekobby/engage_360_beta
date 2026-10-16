import { ArrowUpRight, BarChart3, Megaphone, MessageSquare, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { StaggerItem, StaggerReveal } from '../motion';
import AcademySectionHeader from './AcademySectionHeader';
import { ACADEMY_PATHS, ACADEMY_PATHS_HEADER } from './academyData';

const PATH_ICONS = {
  megaphone: Megaphone,
  message: MessageSquare,
  users: Users,
  chart: BarChart3,
};

export default function AcademyPathsSection({ activePath, onSelectPath }) {
  return (
    <section>
      <AcademySectionHeader
        title={ACADEMY_PATHS_HEADER.title}
        subtitle={ACADEMY_PATHS_HEADER.subtitle}
      />

      <StaggerReveal
        className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        stagger={0.08}
      >
        {ACADEMY_PATHS.map((path, index) => {
          const isActive = activePath === path.id;
          const Icon = PATH_ICONS[path.icon];

          return (
            <StaggerItem key={path.id}>
              <button
                type="button"
                onClick={() => onSelectPath(path.id)}
                aria-pressed={isActive}
                className={clsx(
                  'group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white px-5 py-6 text-left transition-all duration-200 sm:px-6 sm:py-7',
                  isActive
                    ? 'border-[#0B1354] shadow-[0_12px_32px_rgba(11,19,84,0.12)]'
                    : 'border-[#E4E4E7] shadow-[0_2px_12px_rgba(11,19,84,0.04)] hover:-translate-y-0.5 hover:border-[#0B1354]/25 hover:shadow-[0_10px_28px_rgba(11,19,84,0.08)]',
                )}
              >
                <span
                  className={clsx(
                    'absolute inset-x-0 top-0 h-1 transition-opacity duration-200',
                    path.accent,
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
                  )}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={clsx(
                      'inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                      path.iconBg,
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>

                  <span className="text-xs font-semibold tabular-nums tracking-[0.14em] text-[#A1A1AA]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <span className="mt-5 text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">
                  {path.title}
                </span>

                <span className="mt-2.5 flex-1 text-sm leading-relaxed text-[#717171]">
                  {path.description}
                </span>

                <span
                  className={clsx(
                    'mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-[#0B1354] group-hover:text-primary',
                  )}
                >
                  {path.courseCount} courses
                  <ArrowUpRight
                    className={clsx(
                      'h-4 w-4 transition-transform duration-200',
                      isActive ? 'translate-x-0.5 -translate-y-0.5' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                    )}
                    strokeWidth={2.25}
                  />
                </span>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerReveal>
    </section>
  );
}
