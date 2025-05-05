
import React from 'react';
import { cn } from '@/lib/utils';

export interface QuickFilterItem {
  id: string;
  label: string;
}

interface QuickFilterProps {
  filters: QuickFilterItem[];
  selectedFilter: string | null;
  onSelectFilter: (filterId: string | null) => void;
}

const QuickFilter: React.FC<QuickFilterProps> = ({
  filters,
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <div className="w-full overflow-x-auto py-1 no-scrollbar">
      <div className="flex space-x-1 px-4 min-w-max">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id === selectedFilter ? null : filter.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm transition-colors uppercase tracking-wide font-medium",
              selectedFilter === filter.id 
                ? "bg-w2d-teal text-white"
                : "bg-white text-primary"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilter;
