
import React from 'react';
import { Heart, Share2, Clock, MapPin, Calendar, Pin } from 'lucide-react';
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

  // Function to handle image loading error - use title-based placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, title: string) => {
    if (title) {
      // Generate a hash from the title to get a consistent color
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Generate a color based on the hash
      const backgroundColor = Math.abs(hash).toString(16).substring(0, 6);
      e.currentTarget.src = `https://via.placeholder.com/400x300/${backgroundColor}/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
    } else {
      e.currentTarget.src = '/placeholder.svg';
    }
  };

  // Improved format time to 12-hour format with better validation
  const formatTimeTo12Hour = (timeString: string | undefined): string => {
    if (!timeString) return '';
    
    // If it's already in 12-hour format with AM/PM, check for invalid hours first
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      // For times with AM/PM, check for invalid hours (50:00 PM - 59:00 PM)
      const hourMatch = timeString.match(/^(\d{1,2}):/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        if (hour >= 50 && hour <= 59) return '';
      }
      return timeString;
    }
    
    try {
      // Try to parse the time string assuming 24-hour format
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString; // Can't parse, return original
      
      let hours = parseInt(timeParts[0], 10);
      let minutes = parseInt(timeParts[1], 10);
      
      // Check for invalid time ranges (50:00 to 59:00)
      if (hours >= 50 && hours <= 59) return '';
      
      // Validate hours and minutes
      if (isNaN(hours) || hours < 0 || hours > 23) return '';
      if (isNaN(minutes) || minutes < 0 || minutes > 59) return '';
      
      // AM/PM determination
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      // Return formatted time with padding for minutes
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return empty string on error
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
      {activities.map((activity) => {
        // Random rotation between -2 and 2 degrees, but consistent for each activity
        const rotationDeg = activity.id.charCodeAt(0) % 2 === 0 ? 1 : -1;
        const isEven = activity.id.charCodeAt(0) % 2 === 0;
        const formattedTime = formatTimeTo12Hour(activity.time);
        
        return (
          <Card 
            key={activity.id}
            className={cn(
              "overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-0 shadow-lg rounded-xl bg-w2d-sticky relative",
              "sticky-note transform hover:-translate-y-1",
              isEven ? "sticky-note-even" : "sticky-note-odd"
            )}
            onClick={() => handleCardClick(activity.id)}
            style={{ transform: `rotate(${rotationDeg}deg)` }}
          >
            {/* Thumbtack/pin */}
            <div className="thumbtack" aria-hidden="true">
              <Pin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="relative">
              <img 
                src={activity.image || '/placeholder.svg'} 
                alt={activity.title} 
                className="w-full h-48 object-cover border-b-2 border-amber-200"
                loading="lazy"
                onError={(e) => handleImageError(e, activity.title)}
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
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs py-0 shadow-md">🔥 Pinned</Badge>
                )}
                
                {activity.lastUpdated && activity.lastUpdated.includes("today") && (
                  <Badge variant="secondary" className="bg-green-500 text-white text-xs py-0 shadow-md">🆕 New</Badge>
                )}
                
                {sectionType === 'All' && activity.tags && activity.tags.includes('ourpick') && (
                  <Badge variant="secondary" className="bg-amber-500 text-white text-xs py-0 shadow-md">✨ Our Pick</Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-5">
              <h3 className="font-caveat text-xl mb-2 line-clamp-2 sticky-title">{activity.title}</h3>
              
              {activity.description && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {truncateText(activity.description, 100)}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {activity.categoryNames && activity.categoryNames.slice(0, 3).map((category, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block text-xs bg-amber-100 text-amber-800 rounded-full px-3 py-1 font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2.5 text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-amber-700" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{activity.priceRange}</span>
                </div>
                
                {activity.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-amber-700" />
                    <span>{activity.date}</span>
                  </div>
                )}
                
                {formattedTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-amber-700" />
                    <span>{formattedTime}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="rounded-b-lg text-xs px-3.5 py-1.5 h-auto sticky-tab bg-w2d-sticky-dark hover:bg-amber-200 border-t border-amber-200 text-amber-800 -mx-1"
                >
                  Show me more
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* End of list message */}
      {activities.length > 0 && (
        <div className="text-center py-8 px-4 end-of-list md:col-span-2">
          <p className="text-gray-600 font-medium">✨ That's all for now. More coming soon!</p>
        </div>
      )}
    </div>
  );
};

export default ActivityGrid;
