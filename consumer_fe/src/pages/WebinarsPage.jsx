import { useMemo, useState } from 'react';
import SiteFooter from '../components/layout/SiteFooter';
import { Reveal } from '../components/motion';
import { BlogCategoryFilters } from '../components/blogs';
import {
  WEBINAR_CATEGORIES,
  WebinarGrid,
  WebinarVideoCard,
  getWebinarsByCategory,
} from '../components/webinars';

export default function WebinarsPage() {
  const [activeCategory, setActiveCategory] = useState('customer-management');

  const filteredWebinars = useMemo(
    () => getWebinarsByCategory(activeCategory),
    [activeCategory],
  );

  const featuredWebinar = filteredWebinars[0] ?? null;
  const gridWebinars = filteredWebinars;

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {featuredWebinar ? (
          <Reveal variant="fadeUp" amount={0.2}>
            <WebinarVideoCard webinar={featuredWebinar} featured />
          </Reveal>
        ) : null}

        <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-8">
          <BlogCategoryFilters
            categories={WEBINAR_CATEGORIES}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </Reveal>

        <div className="mt-8 sm:mt-10">
          <WebinarGrid webinars={gridWebinars} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
