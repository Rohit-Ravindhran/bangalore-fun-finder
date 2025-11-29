
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
      <ScrollArea className="w-full py-1 pb-2 overflow-x-auto">
        <div className="flex flex-wrap gap-1.5 px-2 min-w-full items-center">
          <button
            onClick={onSelectAll}
            className={cn(
              "glass-pill smooth-hover py-1.5 px-3 text-xs whitespace-nowrap flex items-center gap-1 font-medium transition-all duration-200 active:scale-95 hover:scale-105",
              allSelected
                ? "bg-gradient-to-r from-orange-500/70 to-pink-500/60 text-white border-orange-400/30 shadow-md"
                : "text-gray-700 hover:text-orange-600 shadow-sm"
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
                "glass-pill smooth-hover py-1.5 px-3 text-xs whitespace-nowrap font-medium transition-all duration-200 active:scale-95 hover:scale-105",
                selectedQuickFilters.has(filter.id)
                  ? "bg-gradient-to-r from-pink-500/70 to-violet-500/60 text-white border-pink-400/30 shadow-md"
                  : "text-gray-700 hover:text-pink-600 shadow-sm"
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
                "glass-pill smooth-hover py-1.5 px-3 text-xs whitespace-nowrap flex items-center gap-1 font-medium transition-all duration-200 active:scale-95 hover:scale-105",
                selectedCategories.has(category.id)
                  ? "bg-gradient-to-r from-violet-500/70 to-indigo-500/60 text-white border-violet-400/30 shadow-md"
                  : "text-gray-700 hover:text-violet-600 shadow-sm"
              )}
            >
              <span className="text-sm filter drop-shadow-sm">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
