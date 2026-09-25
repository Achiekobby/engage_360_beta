import { Reveal } from '../motion';
import Images from '../../utils/Images';
import { ABOUT_QUESTIONS } from './aboutData';

const CHANNEL_ICONS = {
  gmail: Images.contact_us.gmail,
  phone_call: Images.contact_us.phone_call,
};

export default function AboutQuestionsSection() {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.08}>
      <div className="rounded-2xl border border-[#E4E4E7] bg-[#E8ECF8]/60 px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
            <img
              src={Images.contact_us.contact_me}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-black sm:text-3xl">
            {ABOUT_QUESTIONS.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
            {ABOUT_QUESTIONS.description}
          </p>

          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {ABOUT_QUESTIONS.channels.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                className="flex items-center gap-4 rounded-xl bg-primary px-5 py-4 text-left transition-colors hover:bg-primary/90 sm:px-6 sm:py-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white sm:h-14 sm:w-14">
                  <img
                    src={CHANNEL_ICONS[channel.icon]}
                    alt=""
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                  />
                </span>
                <span>
                  <span className="block text-sm font-bold text-white sm:text-base">
                    {channel.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/85 sm:text-sm">
                    {channel.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
