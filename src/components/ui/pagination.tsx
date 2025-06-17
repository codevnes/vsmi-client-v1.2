'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  showFirstLast?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  showFirstLast = false,
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Show max 5 pages (including current)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Phân trang" className="flex justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous page */}
        <li>
          <Link
            href={currentPage === 1 ? '#' : `${baseUrl}page=${currentPage - 1}`}
            aria-disabled={currentPage === 1}
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-md border',
              currentPage === 1
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Link>
        </li>
        
        {/* First page */}
        {showFirstLast && currentPage > 3 && (
          <>
            <li>
              <Link
                href={`${baseUrl}page=1`}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                1
              </Link>
            </li>
            {currentPage > 4 && (
              <li className="px-2 text-gray-500">...</li>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {getPageNumbers().map((pageNumber) => (
          <li key={pageNumber}>
            <Link
              href={`${baseUrl}page=${pageNumber}`}
              className={cn(
                'flex items-center justify-center h-8 w-8 rounded-md border',
                pageNumber === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Link>
          </li>
        ))}
        
        {/* Last page */}
        {showFirstLast && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <li className="px-2 text-gray-500">...</li>
            )}
            <li>
              <Link
                href={`${baseUrl}page=${totalPages}`}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}
        
        {/* Next page */}
        <li>
          <Link
            href={currentPage === totalPages ? '#' : `${baseUrl}page=${currentPage + 1}`}
            aria-disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-md border',
              currentPage === totalPages
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
