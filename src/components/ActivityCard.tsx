
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  liked?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onSwipeLeft, 
  onSwipeRight,
  onLike,
  liked = false,
}) => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = React.useState<string | null>(null);
  
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

  return (
    <div 
      className={cn(
        "activity-card w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden card-shadow transition-all duration-300",
        isLeaving === 'left' ? 'swipe-left' : isLeaving === 'right' ? 'swipe-right' : ''
      )}
    >
      <div className="relative">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-52 object-cover"
        />
        <div className="absolute top-3 right-3">
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
        </div>
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
          Last updated: {activity.lastUpdated} 🕗
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
