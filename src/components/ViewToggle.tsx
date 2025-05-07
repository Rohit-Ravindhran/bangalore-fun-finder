
import React from 'react';
import { LayoutGrid, Layers } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex justify-center my-8">
      <ToggleGroup 
        type="single" 
        value={currentView} 
        onValueChange={(value) => value && onViewChange(value as 'card' | 'grid')}
        className="bg-white shadow-sm rounded-full border p-1"
      >
        <ToggleGroupItem 
          value="card" 
          aria-label="Toggle card view" 
          className="data-[state=on]:bg-w2d-teal data-[state=on]:text-white rounded-full px-4 py-2"
        >
          <Layers className="h-4 w-4 mr-2" />
          <span>Swipe View</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="grid" 
          aria-label="Toggle grid view" 
          className="data-[state=on]:bg-w2d-teal data-[state=on]:text-white rounded-full px-4 py-2"
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          <span>Board View</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewToggle;
