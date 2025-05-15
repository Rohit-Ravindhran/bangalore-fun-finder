
import React from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
  disabled?: boolean;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange, disabled = false }) => {
  return (
    <div className="flex justify-center my-4">
      <ToggleGroup 
        type="single" 
        value={currentView} 
        onValueChange={(value) => value && onViewChange(value as 'card' | 'grid')}
        className="bg-[#fff8ea] rounded-full px-1 py-1 shadow-md"
        disabled={disabled}
      >
        <ToggleGroupItem 
          value="card" 
          aria-label="Card view" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all",
            "data-[state=on]:bg-amber-400 data-[state=on]:text-white",
            "data-[state=off]:bg-transparent data-[state=off]:text-gray-500",
            "data-[state=off]:hover:bg-amber-100"
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Swipe</span>
        </ToggleGroupItem>

        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all",
            "data-[state=on]:bg-amber-400 data-[state=on]:text-white",
            "data-[state=off]:bg-transparent data-[state=off]:text-gray-500",
            "data-[state=off]:hover:bg-amber-100"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Browse</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

// Add these named exports for backward compatibility
export const ViewToggleWithLegacyProps: React.FC<{
  selectedMode: 'card' | 'grid';
  onSelect: (mode: 'card' | 'grid') => void;
  disabled?: boolean;
}> = ({ selectedMode, onSelect, disabled }) => {
  return <ViewToggle currentView={selectedMode} onViewChange={onSelect} disabled={disabled} />;
};

export default ViewToggle;
