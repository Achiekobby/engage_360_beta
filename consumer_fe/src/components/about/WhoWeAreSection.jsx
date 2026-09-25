import { Reveal } from '../motion';
import { WHO_WE_ARE } from './aboutData';

export default function WhoWeAreSection() {
  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className="text-center">
        <div className="inline-flex flex-col items-center">
          <h2 className="relative inline-block text-2xl font-bold text-black sm:text-3xl">
            <span
              className="absolute bottom-[0.12em] -left-1.5 -right-1.5 z-0 h-[0.42em] bg-[#B9A9E8] sm:-left-2 sm:-right-2"
              aria-hidden="true"
            />
            <span className="relative z-[1]">{WHO_WE_ARE.title}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm text-[#717171] sm:text-base">{WHO_WE_ARE.subtitle}</p>
        </div>
      </div>
    </Reveal>
  );
}
