
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface QuickFilterItem {
  id: string;
  label: string;
}

interface QuickFilterProps {
  filters: QuickFilterItem[];
  selectedFilters: Set<string>;
  onSelectFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

const QuickFilter: React.FC<QuickFilterProps> = ({
  filters,
  selectedFilters,
  onSelectFilter,
  onClearFilters,
}) => {
  return (
    <div className="w-full overflow-x-auto py-1 no-scrollbar">
      <div className="flex space-x-2 px-4 min-w-max items-center">
        {selectedFilters.size > 0 && (
          <button
            onClick={onClearFilters}
            className="rounded-lg px-4 py-2 text-sm transition-colors font-medium flex items-center gap-1 bg-gray-100 text-gray-600"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
        
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm transition-colors uppercase tracking-wide font-medium",
              selectedFilters.has(filter.id) 
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
