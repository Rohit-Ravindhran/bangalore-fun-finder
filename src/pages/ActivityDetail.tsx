import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Share2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActivityById } from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { Loader2 } from 'lucide-react';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedActivity = await getActivityById(id);
        setActivity(fetchedActivity);
      } catch (error) {
        console.error("Error fetching activity:", error);
        toast({
          title: "Error loading activity",
          description: "Could not load the activity details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivity();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-w2d-cream">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-w2d-teal" />
          <h2 className="text-xl font-medium">Loading activity details...</h2>
        </div>
      </div>
    );
  }
  
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-w2d-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: `Check out this activity: ${activity.title}`,
        url: window.location.href,
      })
        .catch(() => {
          toast({
            title: "Sharing failed",
            description: "Please try again",
            variant: "destructive",
          });
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with friends",
      });
    }
  };
  
  const goToMap = () => {
    if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    }
  };
  
  return (
    <div className="min-h-screen bg-w2d-cream">
      <div className="relative">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-56 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="container px-4 -mt-6 relative">
        <div className="bg-white rounded-t-3xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-3">{activity.title}</h1>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {activity.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block text-xs bg-w2d-blue bg-opacity-20 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 mb-6">{activity.description}</p>
          
          <div className="space-y-4 mb-6">
            {activity.date && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>{activity.date}</span>
              </div>
            )}
            
            {activity.time && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span>{activity.time}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="h-4 w-4" />
              <span>{activity.location}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium">Price:</span>
              <span>{activity.priceRange}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              className="w-full bg-w2d-teal hover:bg-opacity-90"
              onClick={goToMap}
            >
              View on Map
            </Button>
            
            {activity.contactInfo && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(`tel:${activity.contactInfo}`, '_self')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-6 pb-6">
        <p>Last updated: {activity.lastUpdated} 🕗</p>
      </div>
    </div>
  );
};

export default ActivityDetail;
