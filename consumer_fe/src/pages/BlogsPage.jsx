import { useMemo, useState } from 'react';
import SiteFooter from '../components/layout/SiteFooter';
import { Reveal } from '../components/motion';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  BlogCategoryFilters,
  BlogGrid,
  BlogSearch,
} from '../components/blogs';

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('customer-management');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return BLOG_POSTS.filter((post) => {
      const matchesCategory = post.category === activeCategory;
      if (!query) return matchesCategory;

      return (
        matchesCategory &&
        (post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Reveal variant="fadeUp" amount={0.2}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-[#0B1354] sm:text-3xl">Engage 360 Blogs</h1>
            <BlogSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </Reveal>

        <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-8">
          <BlogCategoryFilters
            categories={BLOG_CATEGORIES}
            activeCategory={activeCategory}
            onChange={(category) => {
              setActiveCategory(category);
              setSearchQuery('');
            }}
          />
        </Reveal>

        <div className="mt-8 sm:mt-10">
          <BlogGrid posts={filteredPosts} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
