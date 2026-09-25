import { Reveal } from '../motion';
import Images from '../../utils/Images';
import { CONTACT_HEADER } from './contactData';

export default function ContactHeader() {
  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className="rounded-2xl bg-[#E8ECF8] px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
              <img
                src={Images.contact_us.help_desk}
                alt="Customer support"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-[#0B1354] sm:text-3xl">{CONTACT_HEADER.title}</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5B5F7B] sm:text-base">
              {CONTACT_HEADER.subtitle}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
