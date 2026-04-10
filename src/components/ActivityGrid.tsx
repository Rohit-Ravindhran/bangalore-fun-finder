'use client'


import React from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Activity } from '@/components/ActivityCard';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ActivityImage from '@/components/ActivityImage';

interface ActivityGridProps {
  activities: Activity[];
  onLike: (id: string) => void;
  likedActivities: Set<string>;
  onShare?: (id: string) => void;
  columns?: number;
  sectionType?: string;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ 
  activities, 
  onLike, 
  likedActivities, 
  onShare, 
  columns = 2,
  sectionType 
}) => {
  const router = useRouter();

  const handleCardClick = (activitySlug: string) => {
    router.push(`/activity/${activitySlug}`);
  };

  // Improved format time to 12-hour format with better validation
  const formatTimeTo12Hour = (timeString: string | undefined): string => {
    if (!timeString) return '';
    
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      const hourMatch = timeString.match(/^(\d{1,2}):/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        if (hour >= 50 && hour <= 59) return '';
      }
      return timeString;
    }
    
    try {
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString;
      
      let hours = parseInt(timeParts[0], 10);
      let minutes = parseInt(timeParts[1], 10);
      
      if (hours >= 50 && hours <= 59) return '';
      if (isNaN(hours) || hours < 0 || hours > 23) return '';
      if (isNaN(minutes) || minutes < 0 || minutes > 59) return '';
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => {
        const formattedTime = formatTimeTo12Hour(activity.time);
        
        return (
          <div 
            key={activity.id}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
            onClick={() => handleCardClick(activity.slug)}
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <ActivityImage
                src={activity.image}
                title={activity.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Title - Bold and prominent */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                {activity.title}
              </h3>

              {/* Description - Lighter and smaller */}
              {activity.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">
                  {truncateText(activity.description, 100)}
                </p>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-medium">{activity.location}</span>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                {activity.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                    <span>{activity.date}</span>
                  </div>
                )}
                {formattedTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                    <span>{formattedTime}</span>
                  </div>
                )}
              </div>

              {/* Price and Show More */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {activity.priceRange || 'Free'}
                </span>
                <button 
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(activity.slug);
                  }}
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityGrid;
