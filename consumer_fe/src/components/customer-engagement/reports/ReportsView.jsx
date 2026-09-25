import { AnimatePresence, motion } from 'framer-motion';
import { AlignJustify, LayoutGrid, Table2 } from 'lucide-react';
import { clsx } from 'clsx';
import ReportListRow, { ReportCard } from './ReportListRow';
import ReportTable from './ReportTable';
import ReportsEmptyState from './ReportsEmptyState';

const VIEW_OPTIONS = [
  { id: 'list', label: 'List', icon: AlignJustify },
  { id: 'cards', label: 'Cards', icon: LayoutGrid },
  { id: 'table', label: 'Table', icon: Table2 },
];

export default function ReportsView({
  reports,
  viewMode,
  onViewModeChange,
  onDelete,
  onView,
}) {
  if (reports.length === 0) {
    return <ReportsEmptyState />;
  }

  return (
    <section className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="flex flex-col gap-4 border-b border-[#F0F2F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-[#0B1354] sm:text-lg">Report Library</h2>
          <p className="mt-0.5 text-sm text-[#717171]">
            Review saved audience reports or open them to explore customer details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/10">
            {reports.length} {reports.length === 1 ? 'report' : 'reports'}
          </span>

          <div
            className="inline-flex rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] p-1"
            role="tablist"
            aria-label="Report view mode"
          >
            {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
              const active = viewMode === id;

              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onViewModeChange(id)}
                  className={clsx(
                    'relative inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-semibold transition-colors duration-200',
                    active ? 'text-primary' : 'text-[#717171] hover:text-[#0B1354]',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="reports-view-pill"
                      className="absolute inset-0 rounded-sm bg-white shadow-[0_2px_8px_rgba(11,19,84,0.08)] ring-1 ring-[#EEF0F4]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <Icon className="relative h-4 w-4" strokeWidth={2} />
                  <span className="relative hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-3 bg-[#FAFBFC] p-4 sm:p-6"
          >
            {reports.map((report, index) => (
              <ReportListRow
                key={report.id}
                report={report}
                index={index}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </motion.div>
        ) : null}

        {viewMode === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3"
          >
            {reports.map((report, index) => (
              <ReportCard
                key={report.id}
                report={report}
                index={index}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </motion.div>
        ) : null}

        {viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="pb-2 pt-1"
          >
            <ReportTable reports={reports} onDelete={onDelete} onView={onView} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
