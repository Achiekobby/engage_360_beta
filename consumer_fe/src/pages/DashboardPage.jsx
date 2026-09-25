import AuthNavbar from '../components/layout/AuthNavbar';
import SiteFooter from '../components/layout/SiteFooter';
import {
  DashboardHeader,
  HelpFab,
  PLATFORM_SERVICES,
  ServiceCard,
} from '../components/dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <AuthNavbar />

      <main className="mx-auto w-full max-w-8xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <DashboardHeader />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {PLATFORM_SERVICES.map((service, index) => (
            <ServiceCard key={service.id} {...service} index={index} />
          ))}
        </div>
      </main>

      <SiteFooter homePath="/dashboard" />
      <HelpFab />
    </div>
  );
}
