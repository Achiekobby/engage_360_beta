import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function FaqCategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-6 border-b border-[#E4E4E7] sm:gap-8">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={clsx(
                'relative shrink-0 pb-3 text-sm font-medium transition-colors cursor-pointer sm:text-base',
                isActive ? 'text-[#0B1354]' : 'text-[#717171] hover:text-[#0B1354]',
              )}
            >
              {category.label}
              {isActive ? (
                <motion.span
                  layoutId="faq-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#B8A918]"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
