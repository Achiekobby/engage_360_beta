export default function PlatformSectionBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F4F2F8] via-[#F7F5FB] to-[#EEEBF6]"
        aria-hidden="true"
      />
      <div
        className="platform-pattern-mesh pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="platform-pattern-dots pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="platform-pattern-grid pointer-events-none absolute inset-0 opacity-90"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-32 h-80 w-80 rounded-full bg-[#4F7FD4]/[0.08] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[min(100%,720px)] -translate-x-1/2 translate-y-1/3 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden="true"
      />

      <svg
        className="pointer-events-none absolute -left-12 top-24 h-[min(42vw,320px)] w-[min(42vw,320px)] text-primary/[0.06] lg:left-8 lg:top-20 lg:h-[380px] lg:w-[380px]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="142" stroke="currentColor" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="96" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
    </>
  );
}
