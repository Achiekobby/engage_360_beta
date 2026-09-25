import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { ReportActions } from './ReportActions';
import { ReportDatabaseIcon } from './ReportsEmptyState';

const COLUMNS = [
  { label: 'Report', className: 'min-w-[14rem]' },
  { label: 'Customers', className: 'min-w-[6rem]' },
  { label: 'Created', className: 'min-w-[8rem]' },
  { label: 'Time', className: 'min-w-[5rem]' },
  { label: 'Status', className: 'min-w-[5.5rem]' },
  { label: 'Actions', className: 'min-w-[8rem] text-right' },
];

export default function ReportTable({ reports, onDelete, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <thead>
          <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
            {COLUMNS.map(({ label, className }) => (
              <th
                key={label}
                scope="col"
                className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#717171] first:pl-6 last:pr-6 sm:px-5 ${className}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <motion.tr
              key={report.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF]"
            >
              <td className="relative px-4 py-4 first:pl-6 sm:px-5">
                <span
                  className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3">
                  <ReportDatabaseIcon iconBg={report.iconBg} status={report.status} />
                  <div>
                    <p className="text-base font-semibold text-[#0B1354]">{report.type}</p>
                    <p className="text-xs text-[#717171]">{report.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B1354]">
                  <Users className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  {report.overallCustomers}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#0B1354]">
                  <Calendar className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  {report.dateCreated}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#717171]">
                  <Clock className="h-4 w-4" strokeWidth={2} />
                  {report.timeCreated}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span
                  className={`inline-flex rounded-sm px-2 py-1 text-xs font-semibold ring-1 ${
                    report.status === 'ready'
                      ? 'bg-[#E8F8EF] text-[#1F9D55] ring-[#1F9D55]/20'
                      : 'bg-[#FFF4E8] text-[#E67E22] ring-[#E67E22]/20'
                  }`}
                >
                  {report.status === 'ready' ? 'Ready' : 'Processing'}
                </span>
              </td>
              <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                <div className="flex justify-end">
                  <ReportActions report={report} onDelete={onDelete} onView={onView} compact />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
