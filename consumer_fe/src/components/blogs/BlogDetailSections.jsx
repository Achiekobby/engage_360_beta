import { Link } from 'react-router-dom';
import { Reveal } from '../motion';
import PageBackLink from '../layout/PageBackLink';
import { formatReadTimeUppercase, getCategoryLabel } from './blogData';

export function BlogDetailHeader({ post, backTo = '/blogs', backLabel = 'Back to Blogs' }) {
  const categoryLabel = getCategoryLabel(post.category).toUpperCase();

  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1AA]">{categoryLabel}</p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-[#0B1354] sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-[#717171]">
            <span className="text-[#E4E4E7]">|</span> Published on {post.publishedOn}{' '}
            <span className="text-[#E4E4E7]">|</span> {post.readTime}
          </p>
        </div>
        <PageBackLink to={backTo} label={backLabel} />
      </div>
    </Reveal>
  );
}

export function BlogDetailHeroImage({ post }) {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-8">
      <div className="overflow-hidden rounded-xl">
        <img src={post.image} alt="" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
      </div>
    </Reveal>
  );
}

export function BlogDetailContent({ post }) {
  const [intro, second, subheading, ...rest] = post.body;

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.1}>
      <article className="space-y-5 text-sm leading-relaxed text-[#0B1354] sm:text-base sm:leading-7">
        <p>{intro}</p>
        <p>{second}</p>
        <h2 className="text-lg font-bold text-[#0B1354] sm:text-xl">{subheading}</h2>
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
        <p className="pt-2 text-sm text-[#717171] sm:text-base">
          Good or bad, we&apos;d love to hear your thoughts. Find us on Twitter{' '}
          <Link to="/contact" className="font-medium text-primary hover:text-primary/80">
            @engage360
          </Link>
          .
        </p>
      </article>
    </Reveal>
  );
}

export function BlogPopularPosts({ posts }) {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.12}>
      <aside>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
          Popular Posts
        </h2>
        <ul className="mt-5 divide-y divide-[#E4E4E7]">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/blogs/${post.id}`}
                className="flex gap-3 py-4 transition-opacity hover:opacity-80"
              >
                <img
                  src={post.image}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-[72px] sm:w-[72px]"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
                    {getCategoryLabel(post.category)}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm font-medium leading-snug text-[#0B1354]">
                    {post.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </Reveal>
  );
}

export function BlogRelatedArticles({ posts }) {
  if (!posts.length) return null;

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.14}>
      <section className="mt-14 border-t border-[#E4E4E7] pt-10 sm:mt-16 sm:pt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
          Here are some related articles you may find interesting
        </h2>
        <div className="mt-6 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blogs/${post.id}`}
              className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[#E4E4E7] bg-white transition-shadow hover:shadow-[0_8px_32px_rgba(11,19,84,0.08)] sm:flex-row"
            >
              <img
                src={post.image}
                alt=""
                className="aspect-[16/10] w-full object-cover sm:aspect-auto sm:h-40 sm:w-56 sm:shrink-0"
              />
              <div className="flex flex-col justify-center px-5 pb-5 sm:px-0 sm:py-4 sm:pr-6">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
                  {getCategoryLabel(post.category)} | {formatReadTimeUppercase(post.readTime)}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#717171]">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
