import { PLATFORM_SUBTITLE } from './platformServicesData';

export default function PlatformSectionHeader() {
  return (
    <header className="mx-auto max-w-[44rem] text-center lg:max-w-[48rem]">
      <h2 className="text-[1.875rem] font-bold leading-[1.14] tracking-[-0.02em] text-primary sm:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.65rem]">
        One Platform, Total Control
      </h2>
      <p className="mx-auto mt-5 max-w-[36rem] text-[15px] leading-[1.75] text-[#717171] sm:mt-6 sm:max-w-[38rem] sm:text-base lg:leading-[1.7]">
        {PLATFORM_SUBTITLE}
      </p>
    </header>
  );
}
