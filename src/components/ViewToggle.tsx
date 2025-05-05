
import React from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex justify-center my-4">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as 'card' | 'grid')}>
        <ToggleGroupItem value="card" aria-label="Toggle card view" className="px-3">
          <Layers className="h-4 w-4 mr-2" />
          <span className="text-xs">Swipe View</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Toggle grid view" className="px-3">
          <LayoutGrid className="h-4 w-4 mr-2" />
          <span className="text-xs">Board View</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewToggle;
