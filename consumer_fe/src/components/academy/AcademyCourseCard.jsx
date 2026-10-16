import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

export default function AcademyCourseCard({ course }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(11,19,84,0.1)]">
      <div className="aspect-[16/10] overflow-hidden bg-[#F8F9FB]">
        <img
          src={course.image}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-medium text-primary">{course.level}</span>
          <span className="inline-flex items-center gap-1.5 text-[#717171]">
            <Clock className="h-4 w-4" strokeWidth={2} />
            {course.duration}
          </span>
        </div>

        <h3 className="mt-2 text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
          {course.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#717171]">{course.excerpt}</p>

        <Link
          to="/signup"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Start course
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </article>
  );
}
