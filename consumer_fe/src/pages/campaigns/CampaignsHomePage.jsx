import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Megaphone, Plus, ShoppingBag, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Reveal } from '../../components/motion';
import CampaignsSidebar from '../../components/campaigns-module/CampaignsSidebar';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGNS_BASE,
} from '../../components/campaigns-module/campaignsNavData';

function getCategoryLabel(categoryId) {
  return CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId)?.label || 'Campaigns';
}

const CATEGORY_COPY = {
  'sales-conversion': {
    eyebrow: 'Drive revenue',
    description:
      'Build offer-led campaigns with a compelling message, product visuals, pricing, and precise audience targeting.',
    emptyTitle: 'No sales conversion campaigns yet',
    emptyBody:
      'Turn browsers into buyers. Create a sales campaign with channel messaging, product attachments, discounts, and targeted reach.',
    emptyIcon: ShoppingBag,
  },
};

export default function CampaignsHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'promotions';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Campaigns will be loaded from the API later; empty for now per category.
  const campaignsByCategory = useMemo(() => ({}), []);
  const campaigns = campaignsByCategory[activeCategory] || [];

  const categoryCounts = useMemo(() => {
    return CAMPAIGN_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = (campaignsByCategory[category.id] || []).length;
      return acc;
    }, {});
  }, [campaignsByCategory]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'promotions';
    setActiveCategory(categoryFromUrl);
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchParams({ category: categoryId }, { replace: true });
  };

  const categoryLabel = getCategoryLabel(activeCategory);
  const createPath = `${CAMPAIGNS_BASE}/create/method?category=${activeCategory}&from=home`;
  const categoryCopy = CATEGORY_COPY[activeCategory];
  const EmptyIcon = categoryCopy?.emptyIcon || Megaphone;
  const isSalesConversion = activeCategory === 'sales-conversion';

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-8xl overflow-hidden">
        <CampaignsSidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={sidebarSearch}
          onSearchChange={setSidebarSearch}
          categoryCounts={categoryCounts}
        />

        <main
          data-campaigns-main-scroll
          className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        >
          <div className="mb-6 lg:hidden">
            <p className="mb-2 text-sm font-bold text-[#0B1354]">Select Category</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CAMPAIGN_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={clsx(
                    'shrink-0 cursor-pointer rounded-sm px-3 py-2 text-xs font-semibold transition-colors',
                    activeCategory === category.id
                      ? 'bg-[#EDE8F8] text-primary'
                      : 'bg-[#FAFBFC] text-[#717171] ring-1 ring-[#EEF0F4]',
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <Reveal variant="fadeUp" amount={0.12}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {categoryCopy?.eyebrow || 'Your workspace'}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-3xl">
                  {categoryLabel}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#717171] sm:text-base">
                  {categoryCopy?.description ||
                    'Campaigns in this category will appear here once you create them.'}
                </p>
              </div>

              <Link
                to={createPath}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                {isSalesConversion ? 'Create Sales Campaign' : 'Create Campaign'}
              </Link>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-8"
            >
              {campaigns.length === 0 ? (
                <div
                  className={clsx(
                    'relative overflow-hidden border border-dashed bg-white px-6 py-20 text-center sm:py-28',
                    isSalesConversion
                      ? 'border-primary/20 bg-gradient-to-b from-[#F7F8FF] via-white to-white'
                      : 'border-[#E4E4E7]',
                  )}
                >
                  {isSalesConversion ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
                    <EmptyIcon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-[#0B1354] sm:text-xl">
                    {categoryCopy?.emptyTitle || `No ${categoryLabel.toLowerCase()} campaigns yet`}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#717171]">
                    {categoryCopy?.emptyBody ||
                      "You haven't created any campaigns in this category. Start from a template or build one from scratch."}
                  </p>
                  {isSalesConversion ? (
                    <div className="mx-auto mt-5 flex max-w-lg flex-wrap items-center justify-center gap-2">
                      {['Message & offer', 'Product visuals', 'Targeted reach'].map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1 text-[11px] font-semibold text-[#545454] ring-1 ring-[#EEF0F4]"
                        >
                          <TrendingUp className="h-3 w-3 text-primary" strokeWidth={2.5} />
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    to={createPath}
                    className="mt-6 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#320EB8]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    {isSalesConversion ? 'Start sales campaign' : 'Create campaign'}
                  </Link>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
