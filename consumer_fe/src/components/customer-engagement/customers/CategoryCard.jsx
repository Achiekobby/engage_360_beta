import { motion } from 'framer-motion';
import { Calendar, FolderOpen, Layers, Users } from 'lucide-react';
import CategoryActions from './CategoryActions';

export default function CategoryCard({
  category,
  collectionCount,
  index,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E4E4E7] hover:shadow-[0_14px_36px_rgba(11,19,84,0.1)]"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${category.accent}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm transition-transform duration-300 group-hover:scale-105 ${category.iconBg}`}
          >
            <Layers className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold ring-1 ${category.chip}`}
            >
              <FolderOpen className="h-3 w-3" strokeWidth={2.5} />
              {collectionCount} {collectionCount === 1 ? 'collection' : 'collections'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#F4F5F7] px-2 py-1 text-xs font-semibold text-[#0B1354] ring-1 ring-[#E4E4E7]">
              <Users className="h-3 w-3" strokeWidth={2.5} />
              {Number(category.contactsCount) || 0}{' '}
              {Number(category.contactsCount) === 1 ? 'contact' : 'contacts'}
            </span>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-bold leading-snug text-[#0B1354]">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#717171]">
          {category.description ||
            'Collections in this category are where contacts are stored.'}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-[#717171]">
          <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span>
            Created <span className="font-semibold text-[#0B1354]">{category.dateCreated}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F0F2F7] pt-4">
          <span className="text-xs font-medium text-[#717171]">Category</span>
          <CategoryActions
            category={category}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            compact
          />
        </div>
      </div>
    </motion.article>
  );
}
