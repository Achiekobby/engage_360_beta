import SiteFooter from '../components/layout/SiteFooter';
import {
  CampaignHeroSection,
  CampaignMessageSection,
  CampaignScaleSection,
  CampaignGrowthSection,
  CampaignResultsSection,
  CampaignCtaSection,
} from '../components/campaigns';

export default function CampaignsPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main>
        <CampaignHeroSection />
        <CampaignMessageSection />
        <CampaignScaleSection />
        <CampaignGrowthSection />
        <CampaignResultsSection />
        <CampaignCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
