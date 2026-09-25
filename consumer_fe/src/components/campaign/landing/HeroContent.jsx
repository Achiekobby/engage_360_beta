import { MotionButton } from '../../motion';

export default function HeroContent({ onContact, onBookDemo }) {
  return (
    <div className="w-full max-w-[36rem] lg:max-w-[42rem] xl:max-w-[44rem]">
      <h1 className="text-[1.875rem] font-bold leading-[1.18] tracking-tight text-[#0B1354] sm:text-[2.125rem] lg:text-[2.6rem] xl:text-[2.75rem]">
        Run Your Customer Engagement and Business Operations from One Platform
      </h1>
      <p className="mt-5 max-w-[33rem] text-base leading-[1.65] text-[#717171] sm:text-[17px] lg:mt-6">
        Engage 360 brings together communication, customer management, campaigns, surveys,
        front desk operations, and business workflows into a single intelligent system.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-9">
        <MotionButton
          onClick={onContact}
          className="rounded-none bg-primary px-9 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 cursor-pointer"
        >
          Contact us
        </MotionButton>
        <MotionButton
          onClick={onBookDemo}
          className="rounded-none border border-primary bg-white px-9 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary/[0.04] cursor-pointer"
        >
          Book a Demo
        </MotionButton>
      </div>
    </div>
  );
}
