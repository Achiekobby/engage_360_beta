import SiteFooter from '../components/layout/SiteFooter';
import { Reveal } from '../components/motion';
import {
  SUCCESS_STORIES,
  SUCCESS_STORIES_HEADER,
  SuccessStoriesGrid,
} from '../components/success-stories';

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <section className="bg-[#F8F9FB]">
        <div className="mx-auto w-full max-w-8xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Reveal variant="fadeUp" amount={0.2}>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-4xl">
                {SUCCESS_STORIES_HEADER.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#717171] sm:text-base">
                {SUCCESS_STORIES_HEADER.subtitle}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal variant="fadeUp" amount={0.15} delay={0.06}>
          <div className="rounded-xl border border-[#E4E4E7] bg-[#F8F9FB]/60 p-5 shadow-[0_4px_24px_rgba(11,19,84,0.04)] sm:p-6 lg:p-8">
            <SuccessStoriesGrid stories={SUCCESS_STORIES} />
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
