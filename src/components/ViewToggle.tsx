
import React from 'react';
import { LayoutGrid, Layers, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'card' | 'grid' | 'map';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  disabled?: boolean;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange, disabled = false }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => !disabled && onViewChange('grid')}
        disabled={disabled}
        className={cn(
          "p-2 rounded-md transition-all",
          currentView === 'grid'
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => !disabled && onViewChange('card')}
        disabled={disabled}
        className={cn(
          "p-2 rounded-md transition-all",
          currentView === 'card'
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Card view"
      >
        <Layers className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={cn(
          "p-2 rounded-md transition-all",
          currentView === 'map'
            ? "bg-white shadow-sm text-orange-500"
            : "text-gray-500 hover:text-gray-700"
        )}
        aria-label="Map view"
      >
        <Map className="h-4 w-4" />
      </button>
    </div>
  );
};

// Backward-compatible wrapper (extends to include 'map')
export const ViewToggleWithLegacyProps: React.FC<{
  selectedMode: ViewMode;
  onSelect: (mode: ViewMode) => void;
  disabled?: boolean;
}> = ({ selectedMode, onSelect, disabled }) => {
  return <ViewToggle currentView={selectedMode} onViewChange={onSelect} disabled={disabled} />;
};

export default ViewToggle;
