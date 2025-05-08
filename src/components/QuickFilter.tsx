
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <ScrollArea className="w-full py-1 no-scrollbar">
      <div className="flex space-x-2 px-2 min-w-max items-center">
        {selectedFilters.size > 0 && (
          <button
            onClick={onClearFilters}
            className="rounded-full px-2.5 py-1 text-xs flex items-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
        
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs transition-all uppercase tracking-wide",
              "transform hover:scale-105 active:scale-95 duration-150",
              selectedFilters.has(filter.id) 
                ? "bg-w2d-teal text-white font-medium shadow-sm"
                : "bg-white text-primary hover:bg-gray-50 border border-gray-200"
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
