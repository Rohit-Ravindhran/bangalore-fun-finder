
import React, { useState } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import QuickFilter from '@/components/QuickFilter';
import ActivityCard from '@/components/ActivityCard';
import ShuffleButton from '@/components/ShuffleButton';
import SmileyRow from '@/components/SmileyRow';
import InstallPrompt from '@/components/InstallPrompt';
import { categories, quickFilters, getFilteredActivities } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const { toast } = useToast();

  const filteredActivities = getFilteredActivities(selectedCategory, selectedQuickFilter);
  
  const currentActivity = filteredActivities[currentActivityIndex];

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentActivityIndex(0);
  };

  const handleQuickFilterSelect = (filterId: string | null) => {
    setSelectedQuickFilter(filterId);
    setCurrentActivityIndex(0);
  };

  const handleSwipeLeft = () => {
    if (currentActivityIndex < filteredActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      setCurrentActivityIndex(0);
      toast({
        title: "You've seen all activities",
        description: "Circling back to the beginning",
        duration: 2000,
      });
    }
  };

  const handleSwipeRight = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    } else {
      setCurrentActivityIndex(filteredActivities.length - 1);
    }
  };

  const handleLike = (id: string) => {
    setLikedActivities(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(id)) {
        newLiked.delete(id);
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
      return newLiked;
    });
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    setCurrentActivityIndex(randomIndex);
    toast({
      title: "Shuffled activities",
      description: "Finding something random for you",
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-w2d-cream overflow-x-hidden pb-6">
      <Header />
      
      <main className="container px-4 pt-2 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Find Something to do<br />Today or This Weekend
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Handpicked events from 10++ groups, just for you.
          </p>
        </div>

        <SmileyRow />
        
        <div className="bg-white rounded-xl p-2 mb-6 shadow-sm">
          <QuickFilter 
            filters={quickFilters}
            selectedFilter={selectedQuickFilter}
            onSelectFilter={handleQuickFilterSelect}
          />
        </div>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        <div className="mt-6">
          {filteredActivities.length > 0 ? (
            <ActivityCard 
              activity={currentActivity}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onLike={handleLike}
              liked={likedActivities.has(currentActivity.id)}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold mb-2">No activities found</h3>
              <p className="text-gray-600">Try a different filter</p>
            </div>
          )}
        </div>
      </main>
      
      <ShuffleButton onShuffle={handleShuffle} />
      <InstallPrompt />
      
      <footer className="text-center text-sm text-gray-500 pb-4 pt-2">
        <p>Bangalore Daily / Get on WhatsApp</p>
      </footer>
    </div>
  );
};

export default Index;
