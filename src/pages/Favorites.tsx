
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActivityGrid from '@/components/ActivityGrid';
import { fetchActivities } from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { Loader2 } from 'lucide-react';

const Favorites: React.FC = () => {
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [favoriteActivities, setFavoriteActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load liked activities from localStorage and fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedLiked = localStorage.getItem('likedActivities');
        let likedIds = new Set<string>();
        
        if (savedLiked) {
          try {
            const parsedData = JSON.parse(savedLiked);
            likedIds = new Set<string>(parsedData);
            setLikedActivities(likedIds);
          } catch (error) {
            console.error('Error parsing liked activities:', error);
          }
        }
        
        // Fetch all activities and filter to liked ones
        const allActivities = await fetchActivities();
        const favorites = allActivities.filter(activity => likedIds.has(activity.id));
        setFavoriteActivities(favorites);
      } catch (error) {
        console.error('Error fetching favorite activities:', error);
        toast({
          title: "Error loading favorites",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const handleLike = (id: string) => {
    setLikedActivities(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(id)) {
        newLiked.delete(id);
        // Remove from the displayed list as well
        setFavoriteActivities(prev => prev.filter(activity => activity.id !== id));
        toast({
          title: "Removed from favorites",
          duration: 1500,
        });
      } else {
        newLiked.add(id);
        toast({
          title: "Added to favorites",
          description: "You can find this in your saved collection",
          duration: 1500,
        });
      }
      // Save to localStorage
      localStorage.setItem('likedActivities', JSON.stringify([...newLiked]));
      return newLiked;
    });
  };

  const handleShare = async (id: string) => {
    try {
      const activityData = favoriteActivities.find(activity => activity.id === id);
      if (!activityData) return;
      
      const shareData = {
        title: `Check out ${activityData.title} on What2Do Bangalore`,
        text: activityData.description || 'Discover fun activities in Bangalore',
        url: window.location.origin + `/activity/${id}`
      };
      
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          duration: 1500,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "Share it with your friends",
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Please try again later",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen bg-w2d-cream overflow-x-hidden pb-6">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold text-primary mb-6">Your Favorites</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : favoriteActivities.length > 0 ? (
          <ActivityGrid 
            activities={favoriteActivities}
            onLike={handleLike}
            likedActivities={likedActivities}
            onShare={handleShare}
          />
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-gray-600">Like some activities to see them here!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
