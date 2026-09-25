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
    .reduce((acc, page, index, list) => {
      if (index > 0 && page - list[index - 1] > 1) acc.push('ellipsis');
      acc.push(page);
      return acc;
    }, []);
}

export default function CampaignsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-[#F0F2F7] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#717171]">
        Showing{' '}
        <span className="font-semibold text-[#0B1354]">
          {start}–{end}
        </span>{' '}
        of <span className="font-semibold text-[#0B1354]">{totalItems}</span> templates
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-sm text-[#717171]"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={clsx(
                'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-sm px-2 text-sm font-semibold transition-colors',
                currentPage === page
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.25)]'
                  : 'border border-[#E4E4E7] text-[#717171] hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary',
              )}
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
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
