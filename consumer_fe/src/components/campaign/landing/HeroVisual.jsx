import Images from '../../../utils/Images';
import HeroChartCard from './HeroChartCard';
import HeroStatCard from './HeroStatCard';
import HeroNotificationCard from './HeroNotificationCard';
import { Reveal } from '../../motion';

export default function HeroVisual() {
  return (
    <div className="relative w-full min-w-0 lg:-mt-6 xl:-mt-8">
      <div className="relative mx-auto w-full max-w-[min(100%,620px)] lg:max-w-none">
        <div className="relative h-[min(72vh,620px)] w-full min-h-[400px] overflow-hidden sm:min-h-[460px] lg:h-[min(78vh,720px)] lg:overflow-visible">
          <div
            className="absolute bottom-0 left-1/2 z-0 h-[68%] w-[78%] -translate-x-1/2 rounded-[1.75rem] bg-[#E4E6EC] sm:rounded-[2rem] lg:rounded-[2.25rem]"
            aria-hidden="true"
          />

          <img
            src={Images.hero.hero_img}
            alt="Engage 360 customer success representative"
            className="absolute bottom-0 left-1/2 z-10 h-[108%] w-auto max-w-[115%] -translate-x-1/2 object-contain object-bottom sm:max-w-none"
          />

          <Reveal
            when="load"
            variant="floatUp"
            delay={0.35}
            className="absolute right-0 top-[10%] z-20 sm:right-0 lg:right-[2%]"
          >
            <HeroChartCard />
          </Reveal>

          <Reveal
            when="load"
            variant="floatUp"
            delay={0.5}
            className="absolute bottom-[12%] left-0 z-30 max-w-[calc(100%-0.25rem)] sm:left-[-14%] sm:max-w-none md:left-[-20%] lg:left-[-32%]"
          >
            <HeroNotificationCard />
          </Reveal>

          <Reveal
            when="load"
            variant="floatUp"
            delay={0.65}
            className="absolute bottom-[2%] right-[0%] z-20 sm:right-[2%]"
          >
            <HeroStatCard />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
