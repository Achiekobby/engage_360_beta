import SiteFooter from '../components/layout/SiteFooter';
import { ContactHeader, ContactInfoCards, ContactForm, ContactMap } from '../components/contact';

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-6 sm:space-y-8">
          <ContactHeader />
          <ContactInfoCards />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
            <ContactForm />
            <ContactMap />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
