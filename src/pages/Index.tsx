
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import QuickFilter from '@/components/QuickFilter';
import ActivityCard from '@/components/ActivityCard';
import ActivityGrid from '@/components/ActivityGrid';
import ShuffleButton from '@/components/ShuffleButton';
import ViewToggle from '@/components/ViewToggle';
import SortSelector from '@/components/SortSelector';
import SmileyRow from '@/components/SmileyRow';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import SubscribePopup from '@/components/SubscribePopup';
import { categories, quickFilters, getFilteredActivities } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Dice6, Share2, BellPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest' },
  { id: 'budget-low', label: 'Budget (Low to High)' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'editors-picks', label: 'Editor\'s Picks' },
];

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<Set<string>>(new Set());
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [sortOption, setSortOption] = useState('latest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const { toast } = useToast();

  // Load user preferences from localStorage if available
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedActivities');
    if (savedLiked) {
      setLikedActivities(new Set(JSON.parse(savedLiked)));
    }
    
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode as 'card' | 'grid');
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedActivities', JSON.stringify([...likedActivities]));
    localStorage.setItem('viewMode', viewMode);
  }, [likedActivities, viewMode]);

  const filteredActivities = getFilteredActivities(
    selectedCategories.size > 0 ? Array.from(selectedCategories) : null,
    selectedQuickFilters.size > 0 ? Array.from(selectedQuickFilters) : null
  );
  
  const currentActivity = filteredActivities[currentActivityIndex];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
    setCurrentActivityIndex(0);
  };

  const handleQuickFilterSelect = (filterId: string) => {
    setSelectedQuickFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterId)) {
        newSet.delete(filterId);
      } else {
        newSet.add(filterId);
      }
      return newSet;
    });
    setCurrentActivityIndex(0);
  };

  const handleClearFilters = () => {
    setSelectedQuickFilters(new Set());
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

  const handleShare = (id: string) => {
    // In a real app, we would implement sharing functionality
    toast({
      title: "Share feature",
      description: "Sharing functionality would open here",
      duration: 1500,
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
            Curated from trusted local communities
          </p>
        </div>

        <SmileyRow />
        
        <div className="flex items-center justify-between mb-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white rounded-full text-xs flex items-center gap-1 h-8"
            onClick={() => setShowSubscribe(true)}
          >
            <BellPlus className="h-3 w-3" />
            Subscribe for alerts
          </Button>
          <SortSelector 
            options={SORT_OPTIONS}
            selectedOption={sortOption}
            onSelectOption={setSortOption}
          />
        </div>
        
        <div className="bg-white rounded-xl p-2 mb-4 shadow-sm">
          <QuickFilter 
            filters={quickFilters}
            selectedFilters={selectedQuickFilters}
            onSelectFilter={handleQuickFilterSelect}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={null}
          onSelectCategory={(id) => id && handleCategorySelect(id)}
        />
        
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        
        <div className="mt-4">
          {filteredActivities.length > 0 ? (
            viewMode === 'card' ? (
              currentActivity && (
                <ActivityCard 
                  activity={currentActivity}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onLike={handleLike}
                  onShare={handleShare}
                  liked={likedActivities.has(currentActivity.id)}
                />
              )
            ) : (
              <ActivityGrid 
                activities={filteredActivities}
                onLike={handleLike}
                likedActivities={likedActivities}
              />
            )
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold mb-2">No activities found</h3>
              <p className="text-gray-600">Try a different filter</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-20">
          <Button 
            onClick={() => handleShuffle()}
            className="rounded-full h-12 w-12 bg-w2d-teal shadow-lg flex items-center justify-center"
          >
            <Dice6 className="h-5 w-5" />
          </Button>
        </div>
      </main>
      
      <ShuffleButton onShuffle={handleShuffle} />
      <InstallPrompt />
      <Footer />
      <SubscribePopup isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  );
};

export default Index;
