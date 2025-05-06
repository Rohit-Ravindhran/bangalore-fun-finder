
import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/components/ActivityCard';
import { useNavigate } from 'react-router-dom';

interface ActivityGridProps {
  activities: Activity[];
  onLike: (id: string) => void;
  likedActivities: Set<string>;
  onShare?: (id: string) => void;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ activities, onLike, likedActivities, onShare }) => {
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

  return (
    <div className="grid grid-cols-2 gap-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick(activity.id)}
        >
          <div className="relative">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 rounded-full backdrop-blur-sm w-8 h-8"
                onClick={(e) => handleLike(e, activity.id)}
              >
                <Heart className={`h-4 w-4 ${likedActivities.has(activity.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 rounded-full backdrop-blur-sm w-8 h-8"
                  onClick={(e) => handleShare(e, activity.id)}
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
              )}
            </div>
            
            {activity.tags.includes('trending') && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-red-500 text-white text-xs">🔥 Trending</Badge>
              </div>
            )}
            
            {activity.lastUpdated.includes("today") && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-green-500 text-white text-xs">🆕 New</Badge>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="font-bold text-sm mb-1 line-clamp-2">{activity.title}</h3>
            <div className="flex flex-wrap gap-1 mb-1">
              {activity.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>{activity.priceRange}</span>
              <span>{activity.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityGrid;
