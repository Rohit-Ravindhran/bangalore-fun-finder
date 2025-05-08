
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
    if (onShare) onShare(activity.id);
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
        "activity-card w-full max-w-sm mx-auto bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300",
        isLeaving === 'left' ? 'swipe-left' : isLeaving === 'right' ? 'swipe-right' : ''
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="relative">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full backdrop-blur-sm w-7 h-7 transition-all",
              liked ? "bg-red-500/90 text-white" : "bg-white/80 text-gray-600 hover:bg-white/90"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-3.5 w-3.5", liked ? "fill-white" : "")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white/90 w-7 h-7 transition-all"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {activity.tags.includes('trending') && (
            <Badge variant="secondary" className="bg-red-500 text-white text-xs py-0 shadow-sm">🔥 Trending</Badge>
          )}
          
          {activity.lastUpdated.includes("today") && (
            <Badge variant="secondary" className="bg-green-500 text-white text-xs py-0 shadow-sm">🆕 New</Badge>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-base font-bold mb-1 line-clamp-1">{activity.title}</h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {activity.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-w2d-teal" />
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center font-medium">
            <span>{activity.priceRange}</span>
          </div>
          
          {activity.date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-w2d-teal" />
              <span>{activity.date}</span>
            </div>
          )}
          
          {activity.time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-w2d-teal" />
              <span>{activity.time}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full text-xs px-3 py-1 h-7 hover:bg-w2d-teal hover:text-white border-w2d-teal text-w2d-teal transition-all"
            onClick={handleViewDetails}
          >
            Details
          </Button>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-7 h-7 hover:bg-gray-200 transition-all" 
              onClick={handleSwipeLeft}
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 w-7 h-7 hover:bg-gray-200 transition-all" 
              onClick={handleSwipeRight}
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
