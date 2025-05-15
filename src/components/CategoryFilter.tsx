
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: Set<string>;
  onSelectCategory: (categoryId: string) => void;
  onSelectAll: () => void;
  quickFilters?: { id: string; label: string }[];
  selectedQuickFilters?: Set<string>;
  onSelectQuickFilter?: (filterId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  quickFilters = [],
  selectedQuickFilters = new Set(),
  onSelectQuickFilter = () => {},
}) => {
  const allSelected = selectedCategories.size === 0;

  return (
    <div className="relative">
      <ScrollArea className="w-full py-2 pb-4 overflow-x-auto">
        <div className="flex flex-wrap gap-2 px-3 min-w-full items-center">
          <button
            onClick={onSelectAll}
            className={cn(
              "rounded-full py-1.5 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1.5",
              "transform hover:scale-105 active:scale-95 duration-150 shadow-sm",
              allSelected
                ? "bg-amber-600 text-white font-medium"
                : "bg-white text-primary font-normal hover:bg-amber-50 border border-amber-100"
            )}
          >
            <span>All</span>
          </button>

          {/* Quick filters */}
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onSelectQuickFilter(filter.id)}
              className={cn(
                "rounded-full py-1.5 px-4 text-sm transition-all whitespace-nowrap",
                "transform hover:scale-105 active:scale-95 duration-150 shadow-sm",
                selectedQuickFilters.has(filter.id)
                  ? "bg-amber-600 text-white font-medium"
                  : "bg-white text-primary font-normal hover:bg-amber-50 border border-amber-100"
              )}
            >
              <span>{filter.label}</span>
            </button>
          ))}

          {/* Category filters */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "rounded-full py-1.5 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1.5",
                "transform hover:scale-105 active:scale-95 duration-150 shadow-sm",
                selectedCategories.has(category.id)
                  ? "bg-amber-600 text-white font-medium"
                  : "bg-white text-primary font-normal hover:bg-amber-50 border border-amber-100"
              )}
            >
              <span className="text-lg">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
