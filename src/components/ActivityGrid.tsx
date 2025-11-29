
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
            className="glass-floating overflow-hidden elegant-transition hover:scale-[1.01] cursor-pointer border border-white/20 relative animate-in fade-in slide-in-from-bottom-4 duration-500"
            onClick={() => handleCardClick(activity.id)}
            style={{ animationDelay: `${(activities.indexOf(activity) % 6) * 50}ms` }}
          >
            {/* Soft glass accent decorations */}
            <div className="absolute top-4 left-4 w-1.5 h-12 bg-gradient-to-b from-white/25 via-white/15 to-transparent rounded-full z-10"></div>
            <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full z-10"></div>
            
            <div className="relative border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-[1] rounded-t-3xl"></div>
              <img 
                src={activity.image || '/placeholder.svg'} 
                alt={activity.title} 
                className="w-full h-48 object-cover rounded-t-3xl shadow-inner"
                loading="lazy"
                onError={(e) => handleImageError(e, activity.title)}
              />
              <div className="absolute top-3 right-3 flex gap-2 z-[2]">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "glass-pill w-10 h-10 smooth-hover",
                    likedActivities.has(activity.id) 
                      ? "bg-gradient-to-r from-red-500/80 to-pink-500/70 text-white premium-shadow" 
                      : "text-gray-700 hover:text-red-500"
                  )}
                  onClick={(e) => handleLike(e, activity.id)}
                >
                  <Heart className={`h-4 w-4 ${likedActivities.has(activity.id) ? 'fill-white' : ''}`} />
                </Button>
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-pill text-gray-700 hover:text-blue-600 w-10 h-10 smooth-hover"
                    onClick={(e) => handleShare(e, activity.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-[2]">
                {activity.tags && activity.tags.includes('trending') && (
                  <Badge variant="secondary" className="glass-strong bg-red-500/80 text-white text-xs py-1 px-3 font-semibold border-0">🔥 Pinned</Badge>
                )}
                
                {activity.lastUpdated && activity.lastUpdated.includes("today") && (
                  <Badge variant="secondary" className="glass-strong bg-green-500/80 text-white text-xs py-1 px-3 font-semibold border-0">🆕 New</Badge>
                )}
                
                {sectionType === 'All' && activity.tags && activity.tags.includes('ourpick') && (
                  <Badge variant="secondary" className="glass-strong bg-amber-500/80 text-white text-xs py-1 px-3 font-semibold border-0">✨ Our Pick</Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="font-nunito font-bold text-xl mb-3 line-clamp-2 text-gray-800 leading-tight">{activity.title}</h3>
              
              {activity.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {truncateText(activity.description, 100)}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {activity.categoryNames && activity.categoryNames.slice(0, 3).map((category, idx) => (
                  <span 
                    key={idx} 
                    className="glass-pill text-xs text-gray-700 px-3 py-1.5 font-medium smooth-hover"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="glass-subtle rounded-3xl p-4 mb-4 border border-white/15 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                        <MapPin className="h-3 w-3 text-orange-600" />
                      </div>
                      <span className="font-medium">{activity.location}</span>
                    </div>
                    <div className="flex items-center font-semibold text-orange-600">
                      <span>{activity.priceRange}</span>
                    </div>
                    
                    {activity.date && (
                      <div className="flex items-center gap-2">
                        <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                          <Calendar className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="font-medium">{activity.date}</span>
                      </div>
                    )}
                    
                    {formattedTime && (
                      <div className="flex items-center gap-2">
                        <div className="glass-pill w-6 h-6 flex items-center justify-center p-1">
                          <Clock className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="font-medium">{formattedTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(activity.id);
                  }}
                  className="text-sm px-5 py-2.5 h-auto font-semibold bg-gray-900 text-white hover:bg-gray-800 smooth-hover shadow-lg hover:shadow-xl border-0 w-full rounded-xl"
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
        <div className="glass-floating scale-in text-center py-8 px-6 end-of-list md:col-span-2 mx-4 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-700 font-semibold text-lg">✨ That's all for now. More coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityGrid;
