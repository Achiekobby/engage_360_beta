import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

function buildPageList(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
    .reduce((list, page, index, source) => {
      if (index > 0 && page - source[index - 1] > 1) list.push('ellipsis');
      list.push(page);
      return list;
    }, []);
}

export default function BusinessesPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  label = 'Business pages',
}) {
  if (totalItems === 0) return null;

  const pages = buildPageList(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label={label}
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-[#717171]">
        Showing{' '}
        <span className="font-semibold text-[#0B1354]">
          {start}–{end}
        </span>{' '}
        of <span className="font-semibold text-[#0B1354]">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-sm text-[#717171]"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={clsx(
                'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors',
                currentPage === page
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                  : 'border border-[#E4E4E7] bg-white text-[#717171] hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary',
              )}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}
