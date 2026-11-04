import { motion } from 'framer-motion';
import { Calendar, FileStack, Folder, Hash, Tag, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { CollectionActions } from './CollectionActions';
import { formatCollectionDisplayId } from './customersData';

const COLUMNS = [
  {
    key: 'collection',
    label: 'Collection',
    hint: 'Name & ID',
    align: 'left',
    className: 'min-w-[18rem] w-[32%]',
  },
  {
    key: 'category',
    label: 'Category',
    hint: 'Parent group',
    align: 'left',
    className: 'min-w-[9.5rem] w-[16%]',
  },
  {
    key: 'files',
    label: 'Files',
    hint: 'Uploads',
    align: 'right',
    className: 'min-w-[6.5rem] w-[10%]',
  },
  {
    key: 'customers',
    label: 'Customers',
    hint: 'Contacts',
    align: 'right',
    className: 'min-w-[7.5rem] w-[12%]',
  },
  {
    key: 'date',
    label: 'Created',
    hint: 'Date added',
    align: 'left',
    className: 'min-w-[9rem] w-[14%]',
  },
  {
    key: 'actions',
    label: 'Actions',
    hint: 'Manage',
    align: 'right',
    className: 'min-w-[9.5rem] w-[16%]',
  },
];

function alignClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

function MetricCell({ icon: Icon, value, unit }) {
  return (
    <div className="inline-flex flex-col items-end gap-0.5">
      <span className="inline-flex items-center gap-1.5 tabular-nums text-[15px] font-bold leading-none tracking-tight text-[#0B1354]">
        <Icon className="h-3.5 w-3.5 text-[#9AA0B0]" strokeWidth={2} aria-hidden="true" />
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA0B0]">
        {unit}
      </span>
    </div>
  );
}

export default function CollectionTable({ collections, onDelete, onEdit, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse table-fixed">
        <caption className="sr-only">
          Collections in this category with file counts, customers, and created dates
        </caption>
        <thead>
          <tr className="border-b border-[#E8EBF2] bg-gradient-to-b from-[#F8F9FC] to-[#F3F5FA]">
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx(
                  'px-4 py-3.5 first:pl-6 last:pr-6 sm:px-5',
                  alignClass(column.align),
                  column.className,
                )}
              >
                <div
                  className={clsx(
                    'flex flex-col gap-0.5',
                    column.align === 'right' && 'items-end',
                    column.align === 'center' && 'items-center',
                    column.align === 'left' && 'items-start',
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5C647A]">
                    {column.label}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide text-[#9AA0B0]">
                    {column.hint}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collections.map((collection, index) => {
            const fileCount = Number(collection.fileCount || 0);
            const customerLabel = collection.customerCount ?? '0';

            return (
              <motion.tr
                key={collection.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="group border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#F7F8FF]/70 even:bg-[#FAFBFC]/55"
              >
                <td className="relative px-4 py-4 first:pl-6 sm:px-5">
                  <span
                    className="absolute inset-y-2 left-0 w-[3px] scale-y-0 rounded-r-full bg-primary transition-transform duration-200 group-hover:scale-y-100"
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className={clsx(
                        'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ring-1 ring-black/[0.04]',
                        collection.iconBg,
                      )}
                    >
                      <Folder className="h-5 w-5" strokeWidth={2} />
                      <span
                        className={clsx(
                          'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-gradient-to-r shadow-sm',
                          collection.accent,
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onView?.(collection)}
                        className="block max-w-full cursor-pointer truncate text-left text-[15px] font-bold leading-snug text-[#0B1354] transition-colors hover:text-primary"
                      >
                        {collection.name}
                      </button>
                      <p
                        className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-[#8B92A5]"
                        title={`ENG-CLC-${collection.id}`}
                      >
                        <Hash className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        <span className="truncate font-medium tabular-nums">
                          {formatCollectionDisplayId(collection.id)}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 sm:px-5">
                  <span
                    className={clsx(
                      'inline-flex max-w-full items-center gap-1.5 truncate rounded-sm px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ring-black/[0.05]',
                      collection.iconBg,
                    )}
                  >
                    <Tag className="h-3 w-3 shrink-0 opacity-70" strokeWidth={2.5} aria-hidden="true" />
                    <span className="truncate">{collection.category || '—'}</span>
                  </span>
                </td>

                <td className="px-4 py-4 text-right sm:px-5">
                  <MetricCell
                    icon={FileStack}
                    value={fileCount}
                    unit={fileCount === 1 ? 'file' : 'files'}
                  />
                </td>

                <td className="px-4 py-4 text-right sm:px-5">
                  <MetricCell icon={Users} value={customerLabel} unit="customers" />
                </td>

                <td className="px-4 py-4 sm:px-5">
                  <div className="inline-flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#F0F2F7] text-[#717171]">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-[#0B1354]">
                        {collection.dateCreated || '—'}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-[#9AA0B0]">Added to category</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                  <div className="flex justify-end opacity-90 transition-opacity group-hover:opacity-100">
                    <CollectionActions
                      collection={collection}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onView={onView}
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
