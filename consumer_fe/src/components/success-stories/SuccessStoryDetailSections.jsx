import { Link } from 'react-router-dom';
import { Reveal } from '../motion';
import PageBackLink from '../layout/PageBackLink';

export function SuccessStoryDetailHeader({
  story,
  backTo = '/success-stories',
  backLabel = 'Back to Success Stories',
}) {
  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight text-[#0B1354] sm:text-3xl lg:text-4xl">
            {story.title}
          </h1>
          <p className="mt-4 text-sm text-[#717171]">
            {story.author} <span className="text-[#E4E4E7]">|</span> {story.publishedOn}{' '}
            <span className="text-[#E4E4E7]">|</span> {story.readTime}
          </p>
        </div>
        <PageBackLink to={backTo} label={backLabel} />
      </div>
    </Reveal>
  );
}

export function SuccessStoryDetailBanner({ story }) {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-8">
      <div className="relative flex min-h-[220px] overflow-hidden rounded-xl sm:min-h-[280px] lg:min-h-[320px]">
        <div className="relative w-1/2 shrink-0">
          <img src={story.image} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="flex w-1/2 shrink-0 items-center bg-[#C8E650] px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-sm font-bold uppercase leading-tight text-[#0B1354] sm:text-base lg:text-lg">
            {story.overlayText}
          </p>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#E53935] bg-white/10 sm:h-28 sm:w-28 sm:border-[6px]"
          aria-hidden="true"
        />
      </div>
    </Reveal>
  );
}

export function SuccessStoryDetailContent({ story }) {
  const [intro, second, subheading, ...rest] = story.body;

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.1}>
      <article className="space-y-5 text-sm leading-relaxed text-[#0B1354] sm:text-base sm:leading-7">
        <p>{intro}</p>
        <p>{second}</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">{subheading}</h2>
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

export function SuccessStoryPopularPosts({ stories }) {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.12}>
      <aside>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
          Popular Posts
        </h2>
        <ul className="mt-5 divide-y divide-[#E4E4E7]">
          {stories.map((item) => (
            <li key={item.id}>
              <Link
                to={`/success-stories/${item.id}`}
                className="flex gap-3 py-4 transition-opacity hover:opacity-80"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-[72px] sm:w-[72px]"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
                    Success Story
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm font-medium leading-snug text-[#0B1354]">
                    {item.title}
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

export function SuccessStoryRelated({ stories, companyName }) {
  if (!stories.length) return null;

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.14}>
      <section className="mt-14 border-t border-[#E4E4E7] pt-10 sm:mt-16 sm:pt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
          More like this from {companyName}
        </h2>
        <div className="mt-6 space-y-6">
          {stories.map((item) => (
            <Link
              key={item.id}
              to={`/success-stories/${item.id}`}
              className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[#E4E4E7] bg-white transition-shadow hover:shadow-[0_8px_32px_rgba(11,19,84,0.08)] sm:flex-row"
            >
              <img
                src={item.image}
                alt=""
                className="aspect-[16/10] w-full object-cover sm:aspect-auto sm:h-40 sm:w-56 sm:shrink-0"
              />
              <div className="flex flex-col justify-center px-5 pb-5 sm:px-0 sm:py-4 sm:pr-6">
                <h3 className="text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#717171]">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
