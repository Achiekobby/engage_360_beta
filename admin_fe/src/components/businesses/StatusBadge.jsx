const STATUS_STYLES = {
  active: {
    badge: 'bg-[#E8F8EF] text-[#157A42]',
    dot: 'bg-[#1F9D55]',
    label: 'Active',
  },
  suspended: {
    badge: 'bg-[#FFF6E5] text-[#B45309]',
    dot: 'bg-[#F59E0B]',
    label: 'Suspended',
  },
  deactivated: {
    badge: 'bg-[#F4F4F5] text-[#52525B]',
    dot: 'bg-[#A1A1AA]',
    label: 'Deactivated',
  },
};

export function statusPresentation(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.active;
}

export default function StatusBadge({ status }) {
  const presentation = statusPresentation(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${presentation.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${presentation.dot}`} aria-hidden="true" />
      {presentation.label}
    </span>
  );
}
