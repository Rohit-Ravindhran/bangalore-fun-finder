
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActivityGrid from '@/components/ActivityGrid';
import { getActivities } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const Favorites: React.FC = () => {
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [favoriteActivities, setFavoriteActivities] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Load liked activities from localStorage
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedActivities');
    if (savedLiked) {
      const likedIds = new Set(JSON.parse(savedLiked));
      setLikedActivities(likedIds);
      
      // Filter activities to only show liked ones
      const allActivities = getActivities();
      const favorites = allActivities.filter(activity => likedIds.has(activity.id));
      setFavoriteActivities(favorites);
    }
  }, []);
  
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

  return (
    <div className="min-h-screen bg-w2d-cream overflow-x-hidden pb-6">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold text-primary mb-6">Your Favorites</h1>
        
        {favoriteActivities.length > 0 ? (
          <ActivityGrid 
            activities={favoriteActivities}
            onLike={handleLike}
            likedActivities={likedActivities}
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
