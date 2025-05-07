
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
    <div className="space-y-6">
      {activities.map((activity) => (
        <Card 
          key={activity.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm"
          onClick={() => handleCardClick(activity.id)}
        >
          <div className="relative">
            <img 
              src={activity.image || '/placeholder.svg'} 
              alt={activity.title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 rounded-full backdrop-blur-sm w-9 h-9"
                onClick={(e) => handleLike(e, activity.id)}
              >
                <Heart className={`h-5 w-5 ${likedActivities.has(activity.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 rounded-full backdrop-blur-sm w-9 h-9"
                  onClick={(e) => handleShare(e, activity.id)}
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
              )}
            </div>
            
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {activity.tags.includes('trending') && (
                <Badge variant="secondary" className="bg-red-500 text-white">🔥 Trending</Badge>
              )}
              
              {activity.lastUpdated.includes("today") && (
                <Badge variant="secondary" className="bg-green-500 text-white">🆕 New</Badge>
              )}
              
              {sectionType === 'Great Picks' && activity.tags.includes('ourpick') && (
                <Badge variant="secondary" className="bg-w2d-yellow text-primary">✨ Our Pick</Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{activity.title}</h3>
            
            {activity.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {truncateText(activity.description, 120)}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {activity.tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-w2d-teal" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{activity.priceRange}</span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityGrid;
