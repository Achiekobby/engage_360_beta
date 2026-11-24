import { motion } from 'framer-motion';
import { Calendar, FileStack, Folder, Hash, Tag, UserPlus, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { CollectionActions } from './CollectionActions';
import { formatCollectionDisplayId } from './customersData';

const COLUMNS = [
  {
    key: 'collection',
    label: 'Collection',
    hint: 'Name & ID',
    align: 'left',
    className: 'min-w-[12rem] w-[26%]',
  },
  {
    key: 'category',
    label: 'Category',
    hint: 'Parent group',
    align: 'left',
    className: 'min-w-[7.5rem] w-[14%]',
  },
  {
    key: 'files',
    label: 'Files',
    hint: 'Uploads',
    align: 'right',
    className: 'min-w-[5rem] w-[9%]',
  },
  {
    key: 'customers',
    label: 'Customers',
    hint: 'Contacts',
    align: 'right',
    className: 'min-w-[6rem] w-[11%]',
  },
  {
    key: 'individual',
    label: 'Individual',
    hint: 'Added by form',
    align: 'right',
    className: 'min-w-[6.5rem] w-[12%]',
  },
  {
    key: 'date',
    label: 'Created',
    hint: 'Date added',
    align: 'left',
    className: 'min-w-[8rem] w-[16%]',
  },
  {
    key: 'actions',
    label: 'Actions',
    hint: 'Manage',
    align: 'right',
    className: 'min-w-[5.5rem] w-[8%]',
  },
];

function alignClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

function MetricCell({ icon: Icon, value, unit, align = 'end' }) {
  return (
    <div className={clsx('inline-flex flex-col gap-0.5', align === 'end' ? 'items-end' : 'items-start')}>
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

function CollectionIdentity({ collection, onView }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
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
          className="mt-1 inline-flex max-w-full items-center gap-1 text-xs text-[#8B92A5]"
          title={`ENG-CLC-${collection.id}`}
        >
          <Hash className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span className="truncate font-medium tabular-nums">
            {formatCollectionDisplayId(collection.id)}
          </span>
        </p>
      </div>
    </div>
  );
}

function CollectionMenu({ collection, onDelete, onEdit, onView, onViewContacts, onAddCustomer }) {
  return (
    <CollectionActions
      collection={collection}
      onDelete={onDelete}
      onEdit={onEdit}
      onView={onView}
      onViewContacts={onViewContacts}
      onAddCustomer={onAddCustomer}
    />
  );
}

function CategoryChip({ collection }) {
  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ring-black/[0.05]',
        collection.iconBg,
      )}
    >
      <Tag className="h-3 w-3 shrink-0 opacity-70" strokeWidth={2.5} aria-hidden="true" />
      <span className="truncate">{collection.category || '—'}</span>
    </span>
  );
}

export default function CollectionTable({
  collections,
  onDelete,
  onEdit,
  onView,
  onViewContacts,
  onAddCustomer,
}) {
  const menuProps = { onDelete, onEdit, onView, onViewContacts, onAddCustomer };

  return (
    <>
      <ul className="divide-y divide-[#F0F2F7] lg:hidden" aria-label="Collections in this category">
        {collections.map((collection, index) => {
          const fileCount = Number(collection.fileCount || 0);
          const customerLabel = collection.customerCount ?? '0';
          const individualCount = collection.individualCount;
          const individualLabel =
            individualCount == null ? '—' : Number(individualCount).toLocaleString();

          return (
            <motion.li
              key={collection.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className="px-4 py-4 sm:px-6"
            >
              <div className="flex items-start justify-between gap-3">
                <CollectionIdentity collection={collection} onView={onView} />
                <div className="shrink-0">
                  <CollectionMenu collection={collection} {...menuProps} />
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
                    Category
                  </dt>
                  <dd className="mt-1.5">
                    <CategoryChip collection={collection} />
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
                    Files
                  </dt>
                  <dd className="mt-1.5">
                    <MetricCell
                      icon={FileStack}
                      value={fileCount}
                      unit={fileCount === 1 ? 'file' : 'files'}
                      align="start"
                    />
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
                    Customers
                  </dt>
                  <dd className="mt-1.5">
                    <MetricCell icon={Users} value={customerLabel} unit="customers" align="start" />
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
                    Individual
                  </dt>
                  <dd className="mt-1.5">
                    <MetricCell
                      icon={UserPlus}
                      value={individualLabel}
                      unit={individualCount == null ? '' : individualCount === 1 ? 'contact' : 'contacts'}
                      align="start"
                    />
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA0B0]">
                    Created
                  </dt>
                  <dd className="mt-1.5">
                    <div className="inline-flex min-w-0 items-start gap-2">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#F0F2F7] text-[#717171]">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-snug text-[#0B1354]">
                          {collection.dateCreated || '—'}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#9AA0B0]">Added to category</p>
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </motion.li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] border-collapse table-fixed">
          <caption className="sr-only">
            Collections in this category with file counts, customers, individual contacts, and created dates
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
              const individualCount = collection.individualCount;
              const individualLabel =
                individualCount == null ? '—' : Number(individualCount).toLocaleString();

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
                    <CollectionIdentity collection={collection} onView={onView} />
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <CategoryChip collection={collection} />
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

                  <td className="px-4 py-4 text-right sm:px-5">
                    <MetricCell
                      icon={UserPlus}
                      value={individualLabel}
                      unit={individualCount == null ? '' : individualCount === 1 ? 'contact' : 'contacts'}
                    />
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <div className="inline-flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#F0F2F7] text-[#717171]">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-snug text-[#0B1354]">
                          {collection.dateCreated || '—'}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#9AA0B0]">Added to category</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                    <div className="flex justify-end opacity-90 transition-opacity group-hover:opacity-100">
                      <CollectionMenu collection={collection} {...menuProps} />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
