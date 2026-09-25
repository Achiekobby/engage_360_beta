import { motion } from 'framer-motion';
import { Calendar, FileStack, Folder, Users } from 'lucide-react';
import { CollectionActions } from './CollectionActions';

const COLUMNS = [
  { key: 'name', label: 'Collection', className: 'min-w-[14rem]' },
  { key: 'category', label: 'Category', className: 'min-w-[7rem]' },
  { key: 'files', label: 'Files', className: 'min-w-[5rem]' },
  { key: 'customers', label: 'Customers', className: 'min-w-[6rem]' },
  { key: 'date', label: 'Date Created', className: 'min-w-[7rem]' },
  { key: 'actions', label: 'Actions', className: 'min-w-[6.5rem] text-right' },
];

export default function CollectionTable({ collections, onDelete, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
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
          {collections.map((collection, index) => (
            <motion.tr
              key={collection.id}
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
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${collection.iconBg}`}
                  >
                    <Folder className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-[#0B1354]">{collection.name}</p>
                    <p className="text-xs text-[#717171]">ID · {collection.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-medium text-primary ring-1 ring-primary/10">
                  {collection.category}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1354]">
                  <FileStack className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  {collection.fileCount}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1354]">
                  <Users className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                  {collection.customerCount}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#717171]">
                  <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="font-semibold text-[#0B1354]">{collection.dateCreated}</span>
                </span>
              </td>
              <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                <div className="flex justify-end">
                  <CollectionActions
                    collection={collection}
                    onDelete={onDelete}
                    onView={onView}
                    compact
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
