export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#0B1354] sm:text-2xl">{title}</h2>
        <p className="mt-1 text-base text-[#717171]">{subtitle}</p>
      </div>
    </div>
  );
}
