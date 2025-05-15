
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, Share2, MapPin, Calendar, Clock } from 'lucide-react';
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

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
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

  return (
    <div 
      className={cn(
        "activity-card w-full max-w-sm mx-auto glass-card rounded-xl overflow-hidden transition-all duration-300",
        isLeaving === 'left' ? 'swipe-left' : isLeaving === 'right' ? 'swipe-right' : ''
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="relative">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-52 object-cover"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full backdrop-blur-sm w-9 h-9 transition-all physical-button",
              liked ? "bg-red-500/90 text-white" : "bg-white/80 text-gray-600 hover:bg-white/90"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", liked ? "fill-white" : "")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white/90 w-9 h-9 transition-all physical-button"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {activity.tags && activity.tags.includes('trending') && (
            <Badge variant="secondary" className="bg-red-500 text-white text-xs py-0 shadow-md">🔥 Trending</Badge>
          )}
          
          {activity.lastUpdated && activity.lastUpdated.includes("today") && (
            <Badge variant="secondary" className="bg-green-500 text-white text-xs py-0 shadow-md">🆕 New</Badge>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
        
        {activity.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {activity.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {activity.categoryNames && activity.categoryNames.slice(0, 3).map((category, index) => (
            <span 
              key={index} 
              className="inline-block text-xs bg-amber-100 text-amber-800 rounded-full px-3 py-1"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center font-medium">
            <span>{activity.priceRange}</span>
          </div>
          
          {activity.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-red-500" />
              <span>{activity.date}</span>
            </div>
          )}
          
          {activity.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-red-500" />
              <span>{activity.time}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full text-xs px-4 py-2 h-9 hover:bg-red-600 hover:text-white border-red-600 text-red-600 transition-all physical-button"
            onClick={handleViewDetails}
          >
            Show me more
          </Button>
          
          <div className="flex gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-9 h-9 hover:bg-gray-200 transition-all physical-button" 
              onClick={handleSwipeLeft}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-9 h-9 hover:bg-gray-200 transition-all physical-button" 
              onClick={handleSwipeRight}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
