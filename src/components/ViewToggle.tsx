
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
        className="glass-effect rounded-full px-1.5 py-1.5 shadow-md"
        disabled={disabled}
      >
        <ToggleGroupItem 
          value="card" 
          aria-label="Card view" 
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-full text-xs transition-all",
            "data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:shadow-inner",
            "data-[state=off]:bg-transparent data-[state=off]:text-white/80",
            "data-[state=off]:hover:bg-red-600/30"
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Swipe</span>
        </ToggleGroupItem>

        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view" 
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-full text-xs transition-all",
            "data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:shadow-inner",
            "data-[state=off]:bg-transparent data-[state=off]:text-white/80",
            "data-[state=off]:hover:bg-red-600/30"
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
