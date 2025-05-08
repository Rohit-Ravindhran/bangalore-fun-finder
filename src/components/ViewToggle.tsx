
import React from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex justify-center my-3">
      <div className="bg-white shadow-sm rounded-full border border-gray-200 p-0.5 text-xs flex">
        <button
          onClick={() => onViewChange('card')}
          className={cn(
            "rounded-full px-3 py-1 transition-all flex items-center gap-1", 
            "hover:bg-gray-50",
            currentView === 'card' 
              ? "bg-w2d-teal text-white font-medium"
              : "bg-transparent text-gray-500"
          )}
        >
          <Layers className="h-3 w-3" />
          <span>Swipe Cards</span>
        </button>
        <button
          onClick={() => onViewChange('grid')}
          className={cn(
            "rounded-full px-3 py-1 transition-all flex items-center gap-1",
            "hover:bg-gray-50",
            currentView === 'grid' 
              ? "bg-w2d-teal text-white font-medium"
              : "bg-transparent text-gray-500"
          )}
        >
          <LayoutGrid className="h-3 w-3" />
          <span>Browse Board</span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
