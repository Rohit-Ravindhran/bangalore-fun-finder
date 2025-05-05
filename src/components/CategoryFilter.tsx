
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
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto py-2 no-scrollbar">
      <div className="flex space-x-2 px-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "rounded-full py-2 px-4 text-sm transition-all whitespace-nowrap flex items-center gap-1",
              selectedCategory === category.id 
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
