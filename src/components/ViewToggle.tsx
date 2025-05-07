
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
      <ToggleGroup 
        type="single" 
        value={currentView} 
        onValueChange={(value) => value && onViewChange(value as 'card' | 'grid')}
        className="bg-white shadow-sm rounded-full border p-1 text-xs"
      >
        <ToggleGroupItem 
          value="card" 
          aria-label="Toggle card view" 
          className="data-[state=on]:bg-w2d-teal data-[state=on]:text-white rounded-full px-3 py-1"
        >
          <Layers className="h-3 w-3 mr-1" />
          <span>Swipe Cards</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="grid" 
          aria-label="Toggle grid view" 
          className="data-[state=on]:bg-w2d-teal data-[state=on]:text-white rounded-full px-3 py-1"
        >
          <LayoutGrid className="h-3 w-3 mr-1" />
          <span>Browse Board</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewToggle;
