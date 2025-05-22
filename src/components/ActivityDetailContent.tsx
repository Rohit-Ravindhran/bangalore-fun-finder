
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
  const handleKnowMore = () => {
    if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    } else if (activity.url) {
      window.open(activity.url, '_blank');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
    console.log('Image failed to load, using placeholder instead');
  };

  const hasExternalLink = Boolean(activity.mapLink || activity.url);
  const rotationDeg = activity.id.charCodeAt(0) % 2 === 0 ? 1 : -1;

  return (
    <Card className="overflow-hidden sticky-note bg-w2d-sticky shadow-xl" style={{ transform: `rotate(${rotationDeg}deg)` }}>
      {/* Thumbtack/pin */}
      <div className="thumbtack" aria-hidden="true">
        <Pin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="relative">
        <img
          src={activity.image || '/placeholder.svg'}
          alt={activity.title}
          className="w-full h-64 object-cover border-b-2 border-amber-200"
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

      <CardContent className="p-6">
        <h1 className="text-2xl font-caveat font-bold mb-4 sticky-title">{activity.title}</h1>

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

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
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

          {activity.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-700" />
              <span>{activity.time}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">About this activity</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {activity.contactInfo && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Contact Information</h2>
            <p className="text-gray-700">{activity.contactInfo}</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleKnowMore} 
            className="sticky-tab bg-w2d-sticky-dark hover:bg-amber-200 border-t border-amber-200 text-amber-800 flex items-center gap-2 rounded-b-lg rounded-t-none"
            disabled={!hasExternalLink}
          >
            Know More <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityDetailContent;
