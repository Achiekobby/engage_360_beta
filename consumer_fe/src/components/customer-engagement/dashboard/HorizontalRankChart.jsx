import { motion } from 'framer-motion';
import { MapPin, Trophy } from 'lucide-react';

function formatTotal(items) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return `${total}k`;
}

export default function HorizontalRankChart({ title, items }) {
  const maxValue = Math.max(...items.map((item) => item.value));
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const topLabel = sorted[0]?.label;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E4E7] hover:shadow-[0_10px_28px_rgba(11,19,84,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#F0F2F7] px-5 py-4 sm:px-6">
        <h3 className="text-lg font-bold text-[#0B1354]">{title}</h3>
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#F7F8FF] px-2.5 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
          {formatTotal(items)} total
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        {sorted.map(({ label, value, display }, index) => {
          const width = `${(value / maxValue) * 100}%`;
          const pct = Math.round((value / total) * 100);
          const isTop = label === topLabel;

          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={isTop ? 'rounded-sm bg-[#FAFBFF] p-3 ring-1 ring-primary/10' : ''}
            >
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-bold ${
                    isTop
                      ? 'bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.25)]'
                      : 'bg-[#F0F2F7] text-[#717171]'
                  }`}
                >
                  {isTop ? <Trophy className="h-4 w-4" strokeWidth={2.5} /> : index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`truncate text-base ${
                        isTop ? 'font-semibold text-[#0B1354]' : 'font-medium text-[#717171]'
                      }`}
                    >
                      {label}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-base font-bold text-[#0B1354]">{display}</span>
                      <span className="text-sm font-semibold text-[#717171]">{pct}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-11 h-3 overflow-hidden rounded-sm bg-[#EEF0F4]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width }}
                  transition={{ duration: 0.85, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-sm ${
                    isTop
                      ? 'bg-gradient-to-r from-primary to-[#6B4FE0]'
                      : 'bg-gradient-to-r from-[#2E7DAD] to-[#5B9FD4]'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </article>
  );
}
