import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { openLoginModal } from '../store/slices/uiSlice';
import {
  HeroSection,
  FeaturedBusinessesSection,
  PlatformControlSection,
  EcosystemGrowthSection,
  GettingStartedSection,
  WhyChooseUsSection,
  CtaSection,
} from '../components/campaign/landing';
import SiteFooter from '../components/layout/SiteFooter';

export default function CampaignLandingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleContact = () => navigate('/contact');
  const handleBookDemo = () => dispatch(openLoginModal());
  const handleGetStarted = () => navigate('/signup');
  const handleTalkToSales = () => navigate('/contact');

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-foreground">
      <main>
        <HeroSection onContact={handleContact} onBookDemo={handleBookDemo} />
        <FeaturedBusinessesSection />
        <PlatformControlSection />
        <EcosystemGrowthSection />
        <GettingStartedSection />
        <WhyChooseUsSection />
        <CtaSection onGetStarted={handleGetStarted} onTalkToSales={handleTalkToSales} />
      </main>
      <SiteFooter />
    </div>
  );
}
