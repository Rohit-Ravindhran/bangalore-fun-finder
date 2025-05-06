
import React from 'react';
import { cn } from '@/lib/utils';

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
    <div className="w-full overflow-x-auto py-2 no-scrollbar">
      <div className="flex space-x-2 px-2 min-w-max">
        <button
          onClick={onSelectAll}
          className={cn(
            "rounded-full py-2 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1",
            allSelected
              ? "bg-w2d-teal text-white font-medium"
              : "bg-white text-primary font-normal"
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
              "rounded-full py-2 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1",
              selectedCategories.has(category.id) 
                ? "bg-w2d-teal text-white font-medium"
                : "bg-white text-primary font-normal"
            )}
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
