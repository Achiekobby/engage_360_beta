import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { ReportActions } from './ReportActions';
import { ReportDatabaseIcon } from './ReportsEmptyState';

export default function ReportListRow({ report, index, onDelete, onView }) {
  const { type, overallCustomers, dateCreated, timeCreated, iconBg, status } = report;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-sm border border-[#EEF0F4] bg-[#F8F9FC] p-4 transition-all duration-300 hover:border-[#E4E4E7] hover:bg-white hover:shadow-[0_8px_24px_rgba(11,19,84,0.07)] sm:p-5"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <ReportDatabaseIcon iconBg={iconBg} status={status} />

          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/10">
              {type}
            </span>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-base text-[#717171]">
                Overall customers:{' '}
                <span className="font-bold text-[#0B1354]">{overallCustomers}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#717171]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" strokeWidth={2} />
                  Date Created:{' '}
                  <span className="font-semibold text-[#0B1354]">{dateCreated}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" strokeWidth={2} />
                  <span className="font-semibold text-[#0B1354]">{timeCreated}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:justify-end">
          <ReportActions report={report} onDelete={onDelete} onView={onView} />
        </div>
      </div>
    </motion.article>
  );
}

export function ReportCard({ report, index, onDelete, onView }) {
  const { type, overallCustomers, dateCreated, timeCreated, accent, iconBg, status } = report;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E4E4E7] hover:shadow-[0_14px_36px_rgba(11,19,84,0.1)]"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <ReportDatabaseIcon iconBg={iconBg} status={status} />
          <span className="rounded-sm bg-[#FAFBFC] px-2 py-1 text-xs font-medium text-[#717171] ring-1 ring-[#F0F2F7]">
            {status === 'ready' ? 'Ready' : 'Processing'}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-[#0B1354]">{type}</h3>

        <div className="mt-4 rounded-sm bg-[#FAFBFC] px-4 py-3 ring-1 ring-[#F0F2F7]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#717171]">
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            Overall customers
          </div>
          <p className="mt-1 text-2xl font-bold text-[#0B1354]">{overallCustomers}</p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-[#717171]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" strokeWidth={2} />
            <span>
              {dateCreated} · <span className="font-semibold text-[#0B1354]">{timeCreated}</span>
            </span>
          </div>
        </div>

        <div className="mt-auto border-t border-[#F0F2F7] pt-4">
          <ReportActions report={report} onDelete={onDelete} onView={onView} compact />
        </div>
      </div>
    </motion.article>
  );
}
