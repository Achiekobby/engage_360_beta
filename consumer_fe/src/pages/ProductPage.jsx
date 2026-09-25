import SiteFooter from '../components/layout/SiteFooter';
import {
  ProductBenefitsSection,
  ProductCtaSection,
  ProductDataManagementSection,
  ProductHeroSection,
  ProductOutcomesSection,
} from '../components/product';

export default function ProductPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main>
        <ProductHeroSection />
        <ProductDataManagementSection />
        <ProductOutcomesSection />
        <ProductBenefitsSection />
        <ProductCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
