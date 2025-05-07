
import React from 'react';
import { Heart, Share2, Clock, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/components/ActivityCard';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {activities.map((activity) => (
        <Card 
          key={activity.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick(activity.id)}
        >
          <div className="relative">
            <img 
              src={activity.image || '/placeholder.svg'} 
              alt={activity.title} 
              className="w-full h-40 object-cover"
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
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {activity.tags.includes('trending') && (
                <Badge variant="secondary" className="bg-red-500 text-white text-xs">🔥 Trending</Badge>
              )}
              
              {activity.lastUpdated.includes("today") && (
                <Badge variant="secondary" className="bg-green-500 text-white text-xs">🆕 New</Badge>
              )}
              
              {sectionType === 'Great Picks' && activity.tags.includes('ourpick') && (
                <Badge variant="secondary" className="bg-w2d-yellow text-primary text-xs">✨ Our Pick</Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-bold text-base mb-2 line-clamp-2">{activity.title}</h3>
            
            {activity.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {truncateText(activity.description, 80)}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              {activity.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{activity.priceRange}</span>
              </div>
              
              {activity.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{activity.date}</span>
                </div>
              )}
              
              {activity.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityGrid;
