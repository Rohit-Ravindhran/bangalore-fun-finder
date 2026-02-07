
import React from 'react';
import { Activity } from '@/components/ActivityCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Clock, ExternalLink, Pin } from 'lucide-react';

interface ActivityDetailContentProps {
  activity: Activity;
}

const ActivityDetailContent: React.FC<ActivityDetailContentProps> = ({ activity }) => {
  const handleShowOnMap = () => {
    if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${activity.title} ${activity.location}`);
      window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
    console.log('Image failed to load, using placeholder instead');
  };

  // Function to validate and format time
  const isValidTime = (timeString: string | undefined): boolean => {
    if (!timeString) return false;
    
    // Check if it's already in 12-hour format with AM/PM
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      // For times with AM/PM, check for invalid hours (50:00 PM - 59:00 PM)
      const hourMatch = timeString.match(/^(\d{1,2}):/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        if (hour >= 50 && hour <= 59) return false;
      }
      return true;
    }
    
    // Parse the time string assuming 24-hour format
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return true; // Can't parse, return as is
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    // Check for invalid time ranges (50:00 to 59:00)
    if (hours >= 50 && hours <= 59) return false;
    if (isNaN(hours) || isNaN(minutes)) return false;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return false;
    
    return true;
  };

  const rotationDeg = activity.id.charCodeAt(0) % 2 === 0 ? 1 : -1;

  return (
    <Card className="overflow-hidden sticky-note bg-w2d-sticky shadow-xl md:max-w-2xl md:mx-auto" style={{ transform: `rotate(${rotationDeg}deg)` }}>
      {/* Thumbtack/pin */}
      <div className="thumbtack" aria-hidden="true">
        <Pin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="relative">
        <img
          src={activity.image || '/placeholder.svg'}
          alt={activity.title}
          className="w-full h-64 md:h-80 object-cover border-b-2 border-amber-200"
          onError={handleImageError}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {activity.tags.includes('trending') && (
            <Badge variant="secondary" className="bg-red-500 text-white">🔥 Pinned</Badge>
          )}
          {activity.lastUpdated.includes("today") && (
            <Badge variant="secondary" className="bg-green-500 text-white">🆕 New</Badge>
          )}
          {activity.tags.includes('ourpick') && (
            <Badge variant="secondary" className="bg-w2d-yellow text-primary">✨ Our Pick</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-caveat font-bold mb-4 sticky-title">{activity.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {activity.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block text-sm bg-amber-100 text-amber-800 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm md:text-base text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-700" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{activity.priceRange}</span>
          </div>

          {activity.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-700" />
              <span>{activity.date}</span>
            </div>
          )}

          {activity.time && isValidTime(activity.time) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-700" />
              <span>{activity.time}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">About this activity</h2>
          <p className="text-gray-700 whitespace-pre-line md:text-base">
            {activity.description}
          </p>
        </div>

        {activity.contactInfo && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">Contact Information</h2>
            <p className="text-gray-700 md:text-base">{activity.contactInfo}</p>
          </div>
        )}

        {activity.url && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => window.open(activity.url, '_blank')}
              className="sticky-tab bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 rounded-lg md:text-base md:py-3 md:px-6"
            >
              View More Details <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDetailContent;
