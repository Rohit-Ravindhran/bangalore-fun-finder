
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import QuickFilter from '@/components/QuickFilter';
import ActivityCard from '@/components/ActivityCard';
import ActivityGrid from '@/components/ActivityGrid';
import ShuffleButton from '@/components/ShuffleButton';
import ViewToggle from '@/components/ViewToggle';
import SortSelector from '@/components/SortSelector';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import SubscribePopup from '@/components/SubscribePopup';
import { categories, quickFilters, getFilteredActivities } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Dice6, Share2, BellPlus, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState('latest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [contact, setContact] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Load user preferences from localStorage if available
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedActivities');
    if (savedLiked) {
      setLikedActivities(new Set(JSON.parse(savedLiked)));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedActivities', JSON.stringify([...likedActivities]));
  }, [likedActivities]);

  const filteredActivities = getFilteredActivities(
    selectedCategories.size > 0 ? Array.from(selectedCategories) : null,
    selectedQuickFilters.size > 0 ? Array.from(selectedQuickFilters) : null,
    searchQuery
  );
  
  // Split activities into sections
  const featuredEvents = filteredActivities.slice(0, 5);
  const uniqueExperiences = filteredActivities.slice(5, 7);
  
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
  
  const handleSelectAllCategories = () => {
    setSelectedCategories(new Set());
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

  const handleShare = async (id: string) => {
    try {
      const activityData = filteredActivities.find(activity => activity.id === id);
      const shareData = {
        title: `Check out ${activityData?.title || 'this activity'} on What2Do Bangalore`,
        text: activityData?.description || 'Discover fun activities in Bangalore',
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

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    setCurrentActivityIndex(randomIndex);
    toast({
      title: "Shuffled activities",
      description: "Finding something random for you",
      duration: 1500,
    });
  };

  const handleContactSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      toast({
        title: "Subscribed!",
        description: "You'll receive weekend plans every Friday",
        duration: 2000,
      });
      setContact('');
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-w2d-cream overflow-x-hidden pb-6">
      <Header toggleSearch={toggleSearch} />
      
      <main className="container px-4 pt-2 pb-20">
        {/* Subscription Banner */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-sm">
              <BellPlus className="h-4 w-4 text-w2d-teal" />
              <span>Enter your email or phone to get weekend plans every Friday 🔔</span>
            </div>
            
            <form className="flex gap-2" onSubmit={handleContactSubscribe}>
              <Input 
                type="text" 
                placeholder="Email or phone number" 
                className="h-8 text-sm"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                size="sm" 
                className="h-8 bg-w2d-teal"
              >
                Submit
              </Button>
            </form>
          </div>
          
          <div className="flex justify-end text-xs text-gray-600">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            🏙️ Your Weekend in Bangalore, Sorted. 🎉
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Curated from trusted local communities
          </p>
        </div>
        
        {/* Search Bar */}
        {searchVisible && (
          <div className="bg-white rounded-xl p-2 mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input 
                id="search-input"
                type="text" 
                placeholder="Search activities..." 
                className="border-0 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Quick Filters */}
        <div className="bg-white rounded-xl p-2 mb-4 shadow-sm">
          <QuickFilter 
            filters={quickFilters}
            selectedFilters={selectedQuickFilters}
            onSelectFilter={handleQuickFilterSelect}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        {/* Category Filters */}
        <CategoryFilter 
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={handleCategorySelect}
          onSelectAll={handleSelectAllCategories}
        />
        
        {/* View Toggle */}
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        
        {/* Featured Activities Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎬 Featured Activities</h2>
          
          {featuredEvents.length > 0 ? (
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
                activities={featuredEvents}
                onLike={handleLike}
                likedActivities={likedActivities}
                onShare={handleShare}
              />
            )
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold mb-2">No activities found</h3>
              <p className="text-gray-600">Try a different filter</p>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-600 italic mt-4">
            More dropping next week!... Stay tuned.
          </div>
        </div>
        
        {/* Unique Experiences Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 Unique Experiences</h2>
          
          {uniqueExperiences.length > 0 ? (
            <ActivityGrid 
              activities={uniqueExperiences}
              onLike={handleLike}
              likedActivities={likedActivities}
              onShare={handleShare}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold mb-2">No unique experiences found</h3>
              <p className="text-gray-600">Try a different filter</p>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-600 italic mt-4">
            More dropping next week!... Stay tuned.
          </div>
        </div>
        
        {/* Date Ideas Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">❤️ Date Ideas</h2>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border-dashed border-2 border-gray-300">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-gray-600">Sign up to get updates!</p>
          </div>
        </div>

        <div className="fixed bottom-24 right-6 z-20">
          <ShuffleButton onShuffle={handleShuffle} />
        </div>
      </main>
      
      <InstallPrompt />
      <Footer />
      <SubscribePopup isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  );
};

export default Index;
