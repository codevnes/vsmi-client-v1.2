'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Category } from '@/types/wordpress';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
}

export function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  const pathname = usePathname();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-3">Danh mục</h3>
      
      <ul className="space-y-1">
        <li>
          <Link 
            href={pathname}
            className={cn(
              'block px-3 py-2 rounded-md text-sm transition-colors',
              !selectedCategoryId
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            Tất cả
          </Link>
        </li>
        
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`${pathname}?category=${category.id}`}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                selectedCategoryId === category.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 