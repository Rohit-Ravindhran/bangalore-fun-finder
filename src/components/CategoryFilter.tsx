
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
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
}) => {
  const allSelected = selectedCategories.size === 0;
  
  return (
    <div className="relative">
      <ScrollArea className="w-full py-2 pb-4 no-scrollbar">
        <div className="flex space-x-2.5 px-3 min-w-max">
          <button
            onClick={onSelectAll}
            className={cn(
              "rounded-full py-2 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1.5",
              "transform hover:scale-105 active:scale-95 duration-150",
              allSelected
                ? "bg-w2d-teal text-white font-medium shadow-sm"
                : "bg-white text-primary font-normal hover:bg-gray-50 border border-gray-100"
            )}
          >
            <span>🔍</span>
            <span>All</span>
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "rounded-full py-2 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1.5",
                "transform hover:scale-105 active:scale-95 duration-150",
                selectedCategories.has(category.id) 
                  ? "bg-w2d-teal text-white font-medium shadow-sm"
                  : "bg-white text-primary font-normal hover:bg-gray-50 border border-gray-100"
              )}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-w2d-cream to-transparent pointer-events-none"></div>
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-w2d-cream to-transparent pointer-events-none"></div>
    </div>
  );
};

export default CategoryFilter;
