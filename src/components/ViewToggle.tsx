
import React from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex justify-center my-3 mb-5">
      <ToggleGroup 
        type="single" 
        value={currentView} 
        onValueChange={(value) => value && onViewChange(value as 'card' | 'grid')}
        className=" shadow-sm rounded-full  p-1 text-xs"
      >
        <ToggleGroupItem 
          value="card" 
          aria-label="Toggle card view" 
          className={cn(
            "rounded-full px-3 py-1 transition-all", 
            "data-[state=on]:bg-w2d-teal data-[state=on]:text-white",
            "data-[state=off]:bg-transparent data-[state=off]:text-gray-500",
            "data-[state=off]:hover:bg-gray-50 text-xs h-8"
          )}
        >
          <Layers className="h-2 w-3 mr-1" />
          <span>Swipe Cards</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="grid" 
          aria-label="Toggle grid view" 
          className={cn(
            "rounded-full px-3 py-1 transition-all",
            "data-[state=on]:bg-w2d-teal data-[state=on]:text-white",
            "data-[state=off]:bg-transparent data-[state=off]:text-gray-500",
            "data-[state=off]:hover:bg-gray-50 text-xs h-8"
          )}
        >
          <LayoutGrid className="h-2 w-3 mr-1" />
          <span>Browse Board</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewToggle;
