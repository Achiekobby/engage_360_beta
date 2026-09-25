import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGNS_BASE,
} from '../../components/campaigns-module/campaignsNavData';
import { CATEGORY_ICONS } from '../../components/campaigns-module/campaignCategoryMeta';
import { getCategoryCounts } from '../../components/campaigns-module/smsTemplateLibraryData';

export default function CreateCampaignStartPage() {
  const navigate = useNavigate();
  const templateCounts = getCategoryCounts();

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <Link
          to={CAMPAIGNS_BASE}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          Back to campaigns
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                1
              </span>
              New Campaign
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-3xl">
              Choose a campaign category
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#717171] sm:text-base">
              Pick the goal for this campaign first. We&apos;ll use it to show the right templates
              and keep your setup organized.
            </p>
          </div>
        </div>
      </Reveal>

      <StaggerReveal
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        stagger={0.04}
      >
        {CAMPAIGN_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS.promotions;
          const count = templateCounts[category.id] || 0;

          return (
            <StaggerItem key={category.id}>
              <button
                type="button"
                onClick={() =>
                  navigate(`${CAMPAIGNS_BASE}/create/method?category=${category.id}`)
                }
                className="group flex h-full w-full cursor-pointer flex-col border-2 border-[#D4D8E4] bg-white p-4 text-left shadow-[0_1px_2px_rgba(11,19,84,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_14px_32px_rgba(58,16,205,0.1)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#F3F0FF] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="rounded-full bg-[#F7F8FF] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-primary ring-1 ring-primary/10">
                    {count} templates
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold text-[#0B1354]">{category.label}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#717171]">
                  Create {category.label.toLowerCase()} campaigns with templates or from scratch.
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Continue
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerReveal>
    </main>
  );
}
