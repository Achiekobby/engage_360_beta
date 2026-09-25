import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blogs/${post.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(11,19,84,0.1)]"
    >
      <article className="flex h-full flex-col">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
          <time className="text-sm font-medium text-primary">{post.date}</time>
          <h2 className="mt-2 text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
            {post.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[#717171]">{post.excerpt}</p>

          <div className="mt-5 flex items-center gap-4 text-sm text-primary">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" strokeWidth={2} />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" strokeWidth={2} />
              {post.views}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
