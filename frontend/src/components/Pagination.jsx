import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleChange = (p) => {
    onPageChange(p);
    scrollToTop();
  };

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-16 pt-10 border-t border-gray-100 flex-wrap">
      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
        className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs hover:border-theme-black hover:text-theme-black disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 font-bold text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-black text-sm border-2 transition-all ${
              page === p
                ? 'border-theme-black bg-theme-black text-theme-yellow shadow-[3px_3px_0px_#f0d500]'
                : 'border-transparent text-gray-500 hover:border-theme-black hover:text-theme-black'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => handleChange(page + 1)}
        className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs hover:border-theme-black hover:text-theme-black disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
      </button>

      {/* Page status */}
      <span className="w-full text-center mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">
        Page {page} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
