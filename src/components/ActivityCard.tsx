
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, Share2, MapPin, Calendar, Clock, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [rotationAngle] = React.useState(Math.floor(Math.random() * 2) === 0 ? 2 : -2); 
  
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) onLike(activity.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: activity.title,
          text: `Check out this activity in Bangalore: ${activity.title}`,
          url: window.location.origin + `/activity/${activity.id}`,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.origin + `/activity/${activity.id}`;
        navigator.clipboard.writeText(url);
        
        // If onShare callback exists, call it
        if (onShare) onShare(activity.id);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (onShare) onShare(activity.id);
    }
  };

  // Improved format time to 12-hour format with better validation
  const formatTimeTo12Hour = (timeString: string | undefined): string => {
    if (!timeString) return '';
    
    // If it's already in 12-hour format with AM/PM, check for invalid hours first
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      // For times with AM/PM, check for invalid hours (50:00 PM - 59:00 PM)
      const hourMatch = timeString.match(/^(\d{1,2}):/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        if (hour >= 50 && hour <= 59) return '';
      }
      return timeString;
    }
    
    try {
      // Try to parse the time string assuming 24-hour format
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString; // Can't parse, return original
      
      let hours = parseInt(timeParts[0], 10);
      let minutes = parseInt(timeParts[1], 10);
      
      // Check for invalid time ranges (50:00 to 59:00)
      if (hours >= 50 && hours <= 59) return '';
      
      // Validate hours and minutes
      if (isNaN(hours) || hours < 0 || hours > 23) return '';
      if (isNaN(minutes) || minutes < 0 || minutes > 59) return '';
      
      // AM/PM determination
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      // Return formatted time with padding for minutes
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return empty string on error
    }
  };

  // Helper function to check if time is valid
  const isValidTime = (timeString: string | undefined): boolean => {
    if (!timeString) return false;
    return formatTimeTo12Hour(timeString) !== '';
  };

  // Handle image loading errors - generate title-based placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (activity.title) {
      // Generate a hash from the title to get a consistent color
      let hash = 0;
      for (let i = 0; i < activity.title.length; i++) {
        hash = activity.title.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Generate a color based on the hash
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
    
    // Swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        handleSwipeLeft();
      } else {
        // Swipe right
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

  const isEven = activity.id.charCodeAt(0) % 2 === 0;
  const formattedTime = formatTimeTo12Hour(activity.time);

  return (
    <div 
      className={cn(
        "activity-card w-full max-w-sm mx-auto glass-floating overflow-hidden elegant-transition hover:scale-[1.01] relative",
        isLeaving === 'left' ? 'swipe-left' : isLeaving === 'right' ? 'swipe-right' : ''
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Soft glass accent decorations */}
      <div className="absolute top-4 left-4 w-1.5 h-12 bg-gradient-to-b from-white/25 via-white/15 to-transparent rounded-full z-10"></div>
      <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full z-10"></div>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-[1] rounded-t-3xl"></div>
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-52 object-cover rounded-t-3xl"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3 flex gap-2 z-[2]">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "glass-pill w-10 h-10 smooth-hover",
              liked ? "bg-gradient-to-r from-red-500/80 to-pink-500/70 text-white premium-shadow" : "text-gray-700 hover:text-red-500"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", liked ? "fill-white" : "")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="glass-pill text-gray-700 hover:text-blue-600 w-10 h-10 smooth-hover"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-[2]">
          {activity.tags && activity.tags.includes('trending') && (
            <Badge variant="secondary" className="glass-strong bg-red-500/80 text-white text-xs py-1 px-3 font-semibold border-0">🔥 Pinned</Badge>
          )}
          
          {activity.lastUpdated && activity.lastUpdated.includes("today") && (
            <Badge variant="secondary" className="glass-strong bg-green-500/80 text-white text-xs py-1 px-3 font-semibold border-0">🆕 New</Badge>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-nunito font-bold mb-3 text-gray-800 leading-tight">{activity.title}</h3>
        
        {activity.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {truncateText(activity.description, 120)}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.categoryNames && activity.categoryNames.slice(0, 3).map((category, index) => (
            <span 
              key={index} 
              className="glass-pill text-xs text-gray-700 px-3 py-1.5 font-medium smooth-hover"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="glass-subtle rounded-3xl p-4 mb-4 border border-white/15 relative overflow-hidden">
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                  <MapPin className="h-3 w-3 text-orange-600" />
                </div>
                <span className="font-medium">{activity.location}</span>
              </div>
              <div className="flex items-center font-semibold text-orange-600">
                <span>{activity.priceRange}</span>
              </div>
              
              {activity.date && (
                <div className="flex items-center gap-2">
                  <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                    <Calendar className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="font-medium">{activity.date}</span>
                </div>
              )}
              
              {formattedTime && (
                <div className="flex items-center gap-2">
                  <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                    <Clock className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="font-medium">{formattedTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            size="sm" 
            className="glass-pill text-sm px-5 py-2 h-auto font-medium bg-gradient-to-r from-orange-500 to-pink-500 text-black hover:from-orange-600 hover:to-pink-600 smooth-hover shadow-md hover:shadow-lg border-0"
            onClick={handleViewDetails}
          >
            Show me more
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="glass-pill w-9 h-9 smooth-hover" 
              onClick={handleSwipeLeft}
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="glass-pill w-9 h-9 smooth-hover" 
              onClick={handleSwipeRight}
            >
              <ArrowRight className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
