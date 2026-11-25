import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const delta = 1;
  const range: number[] = [1];
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  if (rangeStart > 2) range.push(-1);
  for (let page = rangeStart; page <= rangeEnd; page += 1) range.push(page);
  if (rangeEnd < totalPages - 1) range.push(-2);
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function TablePagination({ currentPage, pageSize, totalItems, totalPages, onPageChange }: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between border-t border-neutral-100 bg-neutral-50 px-4 py-3">
      <div className="flex-1 text-sm text-neutral-500">
        Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="mt-2 flex items-center sm:mt-0">
        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            className={cn("relative inline-flex items-center rounded-l-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium", currentPage === 1 ? "cursor-not-allowed text-neutral-300" : "text-neutral-500 hover:bg-neutral-50")}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {visiblePages.map((pageNumber) => pageNumber < 0 ? (
            <span key={`ellipsis-${pageNumber}`} className="relative inline-flex items-center border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700">...</span>
          ) : (
            <button
              key={pageNumber}
              className={cn("relative inline-flex items-center border px-4 py-2 text-sm font-medium", pageNumber === currentPage ? "z-10 border-secondary-500 text-secondary-500" : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50")}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className={cn("relative inline-flex items-center rounded-r-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium", currentPage === totalPages ? "cursor-not-allowed text-neutral-300" : "text-neutral-500 hover:bg-neutral-50")}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
