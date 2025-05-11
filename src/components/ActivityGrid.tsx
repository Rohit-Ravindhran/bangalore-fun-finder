
import React from 'react';
import { Heart, Share2, Clock, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/components/ActivityCard';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleLike = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    onLike(activityId);
  };

  const handleShare = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    if (onShare) {
      onShare(activityId);
    }
  };

  // Function to handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card 
          key={activity.id}
          className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-0 shadow-sm rounded-xl transform hover:-translate-y-1 bg-white"
          onClick={() => handleCardClick(activity.id)}
        >
          <div className="relative">
            <img 
              src={activity.image || '/placeholder.svg'} 
              alt={activity.title} 
              className="w-full h-40 object-cover rounded-t-xl"
              loading="lazy"
              onError={handleImageError}
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full backdrop-blur-sm w-8 h-8 transition-all",
                  likedActivities.has(activity.id) 
                    ? "bg-red-500/90 text-white" 
                    : "bg-white/80 text-gray-600 hover:bg-white/90"
                )}
                onClick={(e) => handleLike(e, activity.id)}
              >
                <Heart className={`h-4 w-4 ${likedActivities.has(activity.id) ? 'fill-white' : ''}`} />
              </Button>
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 rounded-full backdrop-blur-sm w-8 h-8 text-gray-600 hover:bg-white/90 transition-all"
                  onClick={(e) => handleShare(e, activity.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {activity.tags && activity.tags.includes('trending') && (
                <Badge variant="secondary" className="bg-red-500 text-white text-xs py-0 shadow-sm">🔥 Trending</Badge>
              )}
              
              {activity.lastUpdated && activity.lastUpdated.includes("today") && (
                <Badge variant="secondary" className="bg-green-500 text-white text-xs py-0 shadow-sm">🆕 New</Badge>
              )}
              
              {sectionType === 'All' && activity.tags && activity.tags.includes('ourpick') && (
                <Badge variant="secondary" className="bg-w2d-yellow text-primary text-xs py-0 shadow-sm">✨ Our Pick</Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-bold text-base mb-1.5 line-clamp-2">{activity.title}</h3>
            
            {activity.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {truncateText(activity.description, 100)}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activity.categoryNames && activity.categoryNames.slice(0, 3).map((category, idx) => (
                <span 
                  key={idx} 
                  className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2.5 py-0.5"
                >
                  {category}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-w2d-teal" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{activity.priceRange}</span>
              </div>
              
              {activity.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-w2d-teal" />
                  <span>{activity.date}</span>
                </div>
              )}
              
              {activity.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-w2d-teal" />
                  <span>{activity.time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* End of list message */}
      {activities.length > 0 && (
        <div className="text-center py-8 px-4 end-of-list">
          <p className="text-gray-600 font-medium">✨ That's all for now. More coming soon!</p>
        </div>
      )}
    </div>
  );
};

export default ActivityGrid;
