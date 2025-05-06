import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';
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
        "activity-card w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden card-shadow transition-all duration-300",
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
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full bg-white/80 backdrop-blur-sm", 
              liked ? "text-red-500" : "text-gray-600"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", liked ? "fill-current" : "")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm text-gray-600"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        {activity.tags.includes('trending') && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-red-500 text-white text-xs">🔥 Trending</Badge>
          </div>
        )}
        
        {activity.lastUpdated.includes("today") && (
          <div className="absolute top-3 left-3 ml-24">
            <Badge variant="secondary" className="bg-green-500 text-white text-xs">🆕 New</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {activity.tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{activity.priceRange}</span>
          <span>{activity.location}</span>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          Locally sourced gems 🌟 • Last updated: {activity.lastUpdated}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="rounded-full text-sm"
            onClick={handleViewDetails}
          >
            Show me more
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100" 
              onClick={handleSwipeLeft}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100" 
              onClick={handleSwipeRight}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
