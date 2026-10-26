/** Pill filters. `tabs` is [{ id, label, count }]; the active one is solid navy. */
export default function RewardFilterTabs({ tabs, active, onChange, label = 'Filter rewards' }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? 'border-[#0B1354] bg-[#0B1354] text-white shadow-[0_8px_18px_rgba(11,19,84,0.22)]'
                : 'border-[#DDE0EA] bg-white text-[#3A3F66] hover:border-[#0B1354]/40 hover:text-[#0B1354]'
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 text-xs font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#F0F2F7] text-[#6B7191]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
