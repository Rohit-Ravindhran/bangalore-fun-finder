
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

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Card 
          key={activity.id}
          className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-0 shadow-sm rounded-lg transform hover:-translate-y-1"
          onClick={() => handleCardClick(activity.id)}
        >
          <div className="flex">
            <div className="w-1/3 relative">
              <img 
                src={activity.image || '/placeholder.svg'} 
                alt={activity.title} 
                className="w-full h-full object-cover min-h-[100px]"
                loading="lazy"
              />
              {activity.tags.includes('trending') && (
                <Badge variant="secondary" className="absolute top-1 left-1 bg-red-500 text-white text-[10px] py-0">🔥</Badge>
              )}
            </div>
            
            <CardContent className="p-2.5 w-2/3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm mb-0.5 line-clamp-1 pr-5">{activity.title}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full w-6 h-6 p-0",
                      likedActivities.has(activity.id) 
                        ? "text-red-500" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                    onClick={(e) => handleLike(e, activity.id)}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedActivities.has(activity.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 my-1">
                {activity.tags.slice(0, 1).map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block text-[10px] bg-w2d-blue bg-opacity-20 rounded-full px-1.5 py-0"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0.5 text-[10px] text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5 text-w2d-teal" />
                  <span className="truncate">{activity.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{activity.priceRange}</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityGrid;
