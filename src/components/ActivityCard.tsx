
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Activity {
  id: string;
  title: string;
  image: string;
  tags: string[];
  priceRange: string;
  location: string;
  lastUpdated: string;
  categoryIds: string[];
  description: string;
  date?: string;
  time?: string;
  mapLink?: string;
  contactInfo?: string;
  categoryNames?: string[];
  url?: string;
}

interface ActivityCardProps {
  activity: Activity;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  liked?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onSwipeLeft, 
  onSwipeRight,
  onLike,
  onShare,
  liked = false,
}) => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = React.useState<string | null>(null);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  
  const handleViewDetails = () => {
    navigate(`/activity/${activity.id}`);
  };

  const handleSwipeLeft = () => {
    setIsLeaving('left');
    setTimeout(() => {
      if (onSwipeLeft) onSwipeLeft();
      setIsLeaving(null);
    }, 300);
  };

  const handleSwipeRight = () => {
    setIsLeaving('right');
    setTimeout(() => {
      if (onSwipeRight) onSwipeRight();
      setIsLeaving(null);
    }, 300);
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

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (activity.title) {
      let hash = 0;
      for (let i = 0; i < activity.title.length; i++) {
        hash = activity.title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const backgroundColor = Math.abs(hash).toString(16).substring(0, 6);
      e.currentTarget.src = `https://via.placeholder.com/400x300/${backgroundColor}/FFFFFF?text=${encodeURIComponent(activity.title.substring(0, 20))}`;
    } else {
      e.currentTarget.src = '/placeholder.svg';
    }
  };

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.targetTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSwipeLeft();
      } else {
        handleSwipeRight();
      }
      setTouchStart(null);
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const formattedTime = formatTimeTo12Hour(activity.time);

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300",
        isLeaving === 'left' ? 'translate-x-[-100%] opacity-0' : isLeaving === 'right' ? 'translate-x-[100%] opacity-0' : ''
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{activity.title}</h3>
        
        {/* Description */}
        {activity.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {truncateText(activity.description, 120)}
          </p>
        )}
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{activity.location}</span>
        </div>
        
        {/* Date & Time */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="font-semibold text-gray-900">
            {activity.priceRange || 'Check website for pricing'}
          </span>
          <button 
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm"
            onClick={handleViewDetails}
          >
            Show me more
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
