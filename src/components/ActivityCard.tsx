
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
  categoryNames?: string[]; // Added for displaying category names
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

  return (
    <div 
      className={cn(
        "activity-card w-full max-w-sm mx-auto bg-white/90 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg",
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
              "rounded-full backdrop-blur-sm w-8 h-8 transition-all",
              liked ? "bg-red-500/90 text-white" : "bg-white/80 text-gray-600 hover:bg-white/90"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", liked ? "fill-white" : "")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white/90 w-8 h-8 transition-all"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {activity.tags.includes('trending') && (
            <Badge variant="secondary" className="bg-red-500 text-white text-xs py-0 shadow-sm">🔥 Trending</Badge>
          )}
          
          {activity.lastUpdated.includes("today") && (
            <Badge variant="secondary" className="bg-green-500 text-white text-xs py-0 shadow-sm">🆕 New</Badge>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1.5">{activity.title}</h3>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activity.categoryNames ? (
            activity.categoryNames.slice(0, 3).map((category, index) => (
              <span 
                key={index} 
                className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2.5 py-0.5"
              >
                {category}
              </span>
            ))
          ) : (
            activity.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-w2d-teal" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center font-medium">
            <span>{activity.priceRange}</span>
          </div>
          
          {activity.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-w2d-teal" />
              <span>{activity.date}</span>
            </div>
          )}
          
          {activity.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-w2d-teal" />
              <span>{activity.time}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full text-xs px-3.5 py-1.5 h-8 hover:bg-w2d-teal hover:text-white border-w2d-teal text-w2d-teal transition-all"
            onClick={handleViewDetails}
          >
            Show me more
          </Button>
          
          <div className="flex gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-8 h-8 hover:bg-gray-200 transition-all" 
              onClick={handleSwipeLeft}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-8 h-8 hover:bg-gray-200 transition-all" 
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
