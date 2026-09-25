import CampaignHeroContent from './CampaignHeroContent';
import CampaignHeroVisual from './CampaignHeroVisual';

export default function CampaignHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(30,79,217,0.08)_0%,rgba(30,79,217,0)_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(58,16,205,0.06)_0%,rgba(58,16,205,0)_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20 sm:pt-4 lg:px-8 lg:pb-24 lg:pt-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-14">
          <CampaignHeroContent />
          <CampaignHeroVisual />
        </div>
      </div>
    </section>
  );
}
