import React from 'react';
import { Clock, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePlanStop, formatCost, getStopEmoji } from '@/types/datePlan';

interface StopsTimelineProps {
  stops: DatePlanStop[];
  activeStopId?: string;
  onStopClick?: (stop: DatePlanStop) => void;
}

const StopsTimeline: React.FC<StopsTimelineProps> = ({ 
  stops, 
  activeStopId,
  onStopClick 
}) => {
  const handleOpenMaps = (e: React.MouseEvent, stop: DatePlanStop) => {
    e.stopPropagation();
    const mapsUrl = stop.googleMapsUrl || 
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ' ' + stop.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleGetDirections = (e: React.MouseEvent, stop: DatePlanStop) => {
    e.stopPropagation();
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.coordinates.lat},${stop.coordinates.lng}&destination_place_id=${encodeURIComponent(stop.name)}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="relative">
      {stops.map((stop, index) => {
        const isActive = activeStopId === stop.id;
        const isLast = index === stops.length - 1;
        
        return (
          <div 
            key={stop.id}
            className={cn(
              "relative pl-10 pb-6 cursor-pointer transition-all duration-200",
              isLast && "pb-0",
              isActive && "bg-rose-50/50 -mx-4 px-4 pl-14 py-3 rounded-xl"
            )}
            onClick={() => onStopClick?.(stop)}
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[18px] top-8 w-0.5 h-[calc(100%-24px)] bg-rose-200" />
            )}
            
            {/* Timeline dot */}
            <div className={cn(
              "absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all",
              isActive 
                ? "bg-rose-500 shadow-lg scale-110" 
                : "bg-rose-100 border-2 border-rose-300"
            )}>
              <span>{getStopEmoji(stop)}</span>
            </div>
            
            {/* Stop number */}
            <div className="absolute left-0 -top-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
            
            {/* Content */}
            <div>
              {/* Stop name */}
              <h4 className={cn(
                "font-semibold text-lg transition-colors",
                isActive ? "text-rose-600" : "text-gray-900"
              )}>
                {stop.name}
              </h4>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mt-0.5 mb-2">
                {stop.description}
              </p>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={cn(
                  "font-semibold",
                  stop.estimatedCost === 0 ? "text-green-600" : "text-rose-600"
                )}>
                  {formatCost(stop.estimatedCost)}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {stop.duration} mins
                </span>
              </div>
              
              {/* Tips */}
              {stop.tips && (
                <div className="mt-2 flex items-start gap-2 text-sm bg-amber-50 text-amber-800 rounded-lg p-2">
                  <span className="text-amber-500">💡</span>
                  <span>{stop.tips}</span>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={(e) => handleOpenMaps(e, stop)}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View on Map
                </button>
                <button
                  onClick={(e) => handleGetDirections(e, stop)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StopsTimeline;
