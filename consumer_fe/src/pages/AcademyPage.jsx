import { useState } from 'react';
import SiteFooter from '../components/layout/SiteFooter';
import {
  AcademyCtaSection,
  AcademyCoursesSection,
  AcademyHero,
  AcademyHowItWorks,
  AcademyPathsSection,
} from '../components/academy';

export default function AcademyPage() {
  const [activePath, setActivePath] = useState('all');

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <AcademyHero />

      <main className="mx-auto w-full max-w-8xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-14 sm:space-y-16 lg:space-y-20">
          <AcademyPathsSection
            activePath={activePath === 'all' ? null : activePath}
            onSelectPath={(pathId) =>
              setActivePath((current) => (current === pathId ? 'all' : pathId))
            }
          />

          <AcademyCoursesSection activePath={activePath} />

          <AcademyHowItWorks />

          <AcademyCtaSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
