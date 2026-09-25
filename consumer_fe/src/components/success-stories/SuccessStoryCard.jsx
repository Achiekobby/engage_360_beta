import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

export default function SuccessStoryCard({ story }) {
  return (
    <Link
      to={`/success-stories/${story.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(11,19,84,0.1)]"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={story.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-y-0 right-0 w-[52%] bg-[#C8E650]/95" aria-hidden="true" />

          <div className="absolute inset-y-0 right-0 flex w-[52%] items-center px-4 py-3 sm:px-5">
            <p className="text-[11px] font-bold uppercase leading-tight text-[#0B1354] sm:text-xs">
              {story.overlayText}
            </p>
          </div>

          <span className="absolute bottom-2 right-3 text-[10px] font-medium text-[#0B1354]/70 sm:text-xs">
            engage360.com
          </span>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
          <time className="text-sm font-medium text-primary">{story.date}</time>
          <h2 className="mt-2 text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
            {story.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[#717171]">{story.excerpt}</p>

          <div className="mt-5 flex items-center gap-4 text-sm text-primary">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" strokeWidth={2} />
              {story.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" strokeWidth={2} />
              {story.views}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
