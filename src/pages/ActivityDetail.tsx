
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Share2, Phone, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActivityById } from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { useQuery } from '@tanstack/react-query';

const funLoadingTexts = [
  "🎨 Painting your adventure...",
  "🎭 Setting up the stage...",
  "🎪 Rolling out the red carpet...",
  "✨ Sprinkling some magic...",
  "🎉 Getting the party ready...",
  "🎸 Tuning the experience...",
  "🎬 Action! Loading scene...",
  "🎯 Aiming for perfection...",
  "🎨 Crafting your moment...",
  "🌟 Making it special...",
];

const CoolLoadingAnimation = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % funLoadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <div className="glass-floating p-12 rounded-3xl">
            <div className="relative">
              {/* Animated circles */}
              <div className="flex justify-center items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              
              {/* Sparkle animation */}
              <div className="absolute -top-6 -right-6 animate-spin" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-8 h-8 text-orange-400" />
              </div>
              <div className="absolute -bottom-6 -left-6 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in duration-500">
            {funLoadingTexts[textIndex]}
          </h2>
          <p className="text-gray-600 text-sm md:text-base animate-pulse">
            Hold tight, something awesome is coming up!
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  
  // Use React Query for data fetching with caching
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };
  
  useEffect(() => {
    // Check if this activity is in liked items
    if (id) {
      const savedLiked = localStorage.getItem('likedActivities');
      if (savedLiked) {
        try {
          const likedActivities = JSON.parse(savedLiked);
          setLiked(likedActivities.includes(id));
        } catch (error) {
          console.error('Error parsing liked activities:', error);
        }
      }
    }
  }, [id]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading activity",
        description: "Could not load the activity details",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  if (isLoading) {
    return <CoolLoadingAnimation />;
  }
  
  const toggleLike = () => {
    if (!id) return;
    
    setLiked(prev => {
      const newLiked = !prev;
      
      // Update localStorage
      const savedLiked = localStorage.getItem('likedActivities');
      let likedActivities: string[] = [];
      
      if (savedLiked) {
        try {
          likedActivities = JSON.parse(savedLiked);
        } catch (error) {
          console.error('Error parsing liked activities:', error);
        }
      }
      
      if (newLiked) {
        if (!likedActivities.includes(id)) {
          likedActivities.push(id);
        }
        toast({ title: 'Added to favorites', duration: 1500 });
      } else {
        likedActivities = likedActivities.filter(item => item !== id);
        toast({ title: 'Removed from favorites', duration: 1500 });
      }
      
      localStorage.setItem('likedActivities', JSON.stringify(likedActivities));
      return newLiked;
    });
  };
  
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
    if (!activity) return;
    
    if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    } else if (activity.url) {
      window.open(activity.url, '_blank');
    }
  };

  const goToKnowMore = () => {
    if (!activity) return;
    
    if (activity.url) {
      window.open(activity.url, '_blank');
    } else if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    } else {
      // If no map link or url, search for the activity on Google
      const searchQuery = encodeURIComponent(`${activity.title} ${activity.location}`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };

  const hasExternalLink = activity && Boolean(activity.mapLink || activity.url);
  
  return (
    <div className="min-h-screen bg-w2d-cream">
      <div className="relative">
        <img 
          src={activity?.image} 
          alt={activity?.title} 
          className="w-full h-56 object-cover"
          onError={handleImageError}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={toggleLike}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
      </div>
      
      {activity && (
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
                disabled={!hasExternalLink}
              >
                {activity.mapLink ? "View on Map" : "Visit Website"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={goToKnowMore}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Know More
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
      )}
      
      <div className="text-center text-xs text-gray-500 mt-6 pb-6">
        <p>Last updated: {activity?.lastUpdated} 🕗</p>
      </div>
    </div>
  );
};

export default ActivityDetail;
