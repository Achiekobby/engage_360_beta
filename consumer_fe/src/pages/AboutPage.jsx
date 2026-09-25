import SiteFooter from '../components/layout/SiteFooter';
import {
  AboutHero,
  AboutQuestionsSection,
  MissionVisionCards,
  WhoWeAreSection,
} from '../components/about';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <AboutHero />

      <main className="mx-auto w-full max-w-8xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-14 sm:space-y-16 lg:space-y-20">
          <div>
            <WhoWeAreSection />
            <MissionVisionCards />
          </div>
          <AboutQuestionsSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
