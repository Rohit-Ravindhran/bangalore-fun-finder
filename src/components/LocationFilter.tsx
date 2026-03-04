import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string | null) => void;
}

const locations = [
  { id: 'indiranagar', label: 'Indiranagar' },
  { id: 'koramangala', label: 'Koramangala' },
  { id: 'hsr', label: 'HSR Layout' },
  { id: 'whitefield', label: 'Whitefield' },
  { id: 'jayanagar', label: 'Jayanagar' },
  { id: 'malleshwaram', label: 'Malleshwaram' },
];

const LocationFilter: React.FC<LocationFilterProps> = ({ 
  selectedLocation, 
  onLocationSelect 
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Near You</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => onLocationSelect(null)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            selectedLocation === null
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
        >
          All Areas
        </button>
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location.id === selectedLocation ? null : location.id)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              selectedLocation === location.id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {location.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;
