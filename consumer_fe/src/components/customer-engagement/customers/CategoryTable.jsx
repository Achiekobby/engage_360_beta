import { motion } from 'framer-motion';
import { Calendar, FolderOpen, Layers } from 'lucide-react';
import CategoryActions from './CategoryActions';

const COLUMNS = [
  { key: 'name', label: 'Category', className: 'min-w-[14rem]' },
  { key: 'collections', label: 'Collections', className: 'min-w-[8rem]' },
  { key: 'date', label: 'Date Created', className: 'min-w-[7rem]' },
  { key: 'actions', label: 'Actions', className: 'min-w-[10rem] text-right' },
];

export default function CategoryTable({
  categories,
  collectionCountById,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
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
          {categories.map((category, index) => {
            const collectionCount = collectionCountById[category.id] || 0;

            return (
              <motion.tr
                key={category.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="group border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF]"
              >
                <td className="relative px-4 py-4 first:pl-6 sm:px-5">
                  <span
                    className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${category.iconBg}`}
                    >
                      <Layers className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[#0B1354]">
                        {category.name}
                      </p>
                      <p className="truncate text-xs text-[#717171]">
                        {category.description || 'Contacts live in its collections'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 sm:px-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1354]">
                    <FolderOpen className="h-4 w-4 text-[#717171]" strokeWidth={2} />
                    {collectionCount}
                  </span>
                </td>
                <td className="px-4 py-4 sm:px-5">
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#717171]">
                    <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="font-semibold text-[#0B1354]">{category.dateCreated}</span>
                  </span>
                </td>
                <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                  <div className="flex justify-end">
                    <CategoryActions
                      category={category}
                      onOpen={onOpen}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      compact
                    />
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
