
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface QuickFilterItem {
  id: string;
  label: string;
  tagId?: number; // Added tagId field for mapping to database tag IDs
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
    <ScrollArea className="w-full py-1 overflow-x-auto max-w-[90vw]">
      <div className="flex space-x-2.5 px-3 min-w-max items-center">
        {selectedFilters.size > 0 && (
          <button
            onClick={onClearFilters}
            className="rounded-full px-4 py-2 text-sm transition-all font-medium flex items-center gap-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              "rounded-full px-4 py-2 text-sm transition-all uppercase tracking-wide font-medium",
              selectedFilters.has(filter.id) 
                ? "bg-w2d-teal text-white shadow-sm"
                : "bg-white text-primary hover:bg-gray-50 border border-gray-100"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuickFilter;
