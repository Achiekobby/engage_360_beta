import { motion } from 'framer-motion';
import { Calendar, FileStack, Folder, Tag, Users } from 'lucide-react';
import { CollectionActions } from './CollectionActions';

export default function CollectionCard({ collection, index, onDelete, onView }) {
  const { name, category, fileCount, customerCount, dateCreated, accent, iconBg } = collection;

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
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm transition-transform duration-300 group-hover:scale-105 ${iconBg}`}
          >
            <Folder className="h-6 w-6" strokeWidth={2} />
          </div>
          <span className="inline-flex items-center gap-1 rounded-sm bg-[#F7F8FF] px-2 py-1 text-xs font-semibold text-primary ring-1 ring-primary/10">
            <Tag className="h-3 w-3" strokeWidth={2.5} />
            {category}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold leading-snug text-[#0B1354]">{name}</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-sm bg-[#FAFBFC] px-3 py-3 ring-1 ring-[#F0F2F7]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#717171]">
              <FileStack className="h-3.5 w-3.5" strokeWidth={2} />
              Files
            </div>
            <p className="mt-1 text-xl font-bold text-[#0B1354]">{fileCount}</p>
          </div>
          <div className="rounded-sm bg-[#FAFBFC] px-3 py-3 ring-1 ring-[#F0F2F7]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#717171]">
              <Users className="h-3.5 w-3.5" strokeWidth={2} />
              Customers
            </div>
            <p className="mt-1 text-xl font-bold text-[#0B1354]">{customerCount}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-[#717171]">
          <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span>
            Created{' '}
            <span className="font-semibold text-[#0B1354]">{dateCreated}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F0F2F7] pt-4">
          <span className="text-xs font-medium text-[#717171]">Collection folder</span>
          <CollectionActions collection={collection} onDelete={onDelete} onView={onView} compact />
        </div>
      </div>
    </motion.article>
  );
}
