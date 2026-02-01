
import React from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Activity } from '@/components/ActivityCard';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  const navigate = useNavigate();

  const handleCardClick = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };

  // Function to handle image loading error - use title-based placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, title: string) => {
    if (title) {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const backgroundColor = Math.abs(hash).toString(16).substring(0, 6);
      e.currentTarget.src = `https://via.placeholder.com/400x300/${backgroundColor}/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
    } else {
      e.currentTarget.src = '/placeholder.svg';
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activities.map((activity) => {
        const formattedTime = formatTimeTo12Hour(activity.time);
        
        return (
          <div 
            key={activity.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => handleCardClick(activity.id)}
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={activity.image || '/placeholder.svg'} 
                alt={activity.title} 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e, activity.title)}
              />
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {activity.title}
              </h3>
              
              {/* Description */}
              {activity.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {truncateText(activity.description, 120)}
                </p>
              )}
              
              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{activity.location}</span>
              </div>
              
              {/* Date & Time */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                {activity.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{activity.date}</span>
                  </div>
                )}
                {formattedTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{formattedTime}</span>
                  </div>
                )}
              </div>
              
              {/* Price and Show More */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900">
                  {activity.priceRange || 'Check website for pricing'}
                </span>
                <button 
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(activity.id);
                  }}
                >
                  Show me more
                  <ArrowRight className="h-4 w-4" />
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
