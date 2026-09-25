import { useMemo, useState } from 'react';
import SiteFooter from '../components/layout/SiteFooter';
import { Reveal } from '../components/motion';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  FaqAccordion,
  FaqCategoryTabs,
  GetHelpSection,
  HelpCenterSearch,
} from '../components/help-center';

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      if (!query) return matchesCategory;

      return (
        matchesCategory &&
        (item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Reveal variant="fadeUp" amount={0.2}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-4xl">
              Welcome to Engage 360 Help Center
            </h1>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mx-auto mt-8 max-w-2xl">
          <HelpCenterSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={() => undefined}
          />
          <p className="mt-4 text-center text-sm text-[#717171] sm:text-base">
            or choose a category to quickly find the help you need
          </p>
        </Reveal>

        <Reveal variant="fadeUp" amount={0.15} delay={0.1} className="mt-10">
          <FaqCategoryTabs
            categories={FAQ_CATEGORIES}
            activeCategory={activeCategory}
            onChange={(category) => {
              setActiveCategory(category);
              setSearchQuery('');
            }}
          />
        </Reveal>

        <Reveal variant="fadeUp" amount={0.15} delay={0.14} className="mt-6">
          <FaqAccordion items={filteredFaqs} key={`${activeCategory}-${searchQuery}`} />
        </Reveal>

        <div className="mt-14 sm:mt-16">
          <Reveal variant="fadeUp" amount={0.15} delay={0.18}>
            <GetHelpSection />
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
