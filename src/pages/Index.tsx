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
import SubscribeSection from '@/components/SubscribeSection';
import { categories, quickFilters } from '@/data/mockData';
import { getFilteredActivitiesBySection, getFilteredActivities } from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Dice6, Share2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity } from '@/components/ActivityCard';

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<Set<string>>(new Set());
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState('latest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<Activity[]>([]);
  const [uniqueExperiences, setUniqueExperiences] = useState<Activity[]>([]);
  const { toast } = useToast();



  console.log('sthis')


  useEffect(() => {
 console.log('ss',featuredEvents)
  }, [featuredEvents]);

  useEffect(() => {
    const savedLiked = localStorage.getItem('likedActivities');
    if (savedLiked) {
      try {
        setLikedActivities(new Set(JSON.parse(savedLiked)));
      } catch (error) {
        console.error('Error parsing liked activities:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedActivities', JSON.stringify([...likedActivities]));
  }, [likedActivities]);

  useEffect(() => {
    const fetchSectionActivities = async () => {
      setIsLoading(true);
      try {
        const [featured, unique] = await Promise.all([
          getFilteredActivitiesBySection('featured'),
          getFilteredActivitiesBySection('unique')
        ]);
        setFeaturedEvents(featured);
        setUniqueExperiences(unique);
      } catch (error) {
        console.error('Error loading sections:', error);
        toast({
          title: 'Error loading sections',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSectionActivities();
  }, [toast]);

  const currentActivity = featuredEvents[currentActivityIndex];

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
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(new Set());
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
  };

  const handleClearFilters = () => {
    setSelectedQuickFilters(new Set());
  };

  const handleSwipeLeft = () => {
    if (currentActivityIndex < featuredEvents.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      setCurrentActivityIndex(0);
      toast({
        title: "You've seen all activities",
        description: 'Circling back to the beginning',
        duration: 2000,
      });
    }
  };

  const handleSwipeRight = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    } else {
      setCurrentActivityIndex(featuredEvents.length - 1);
    }
  };

  const handleLike = (id: string) => {
    setLikedActivities(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(id)) {
        newLiked.delete(id);
        toast({ title: 'Removed from favorites', duration: 1500 });
      } else {
        newLiked.add(id);
        toast({
          title: 'Added to favorites',
          description: 'You can find this in your saved collection',
          duration: 1500,
        });
      }
      return newLiked;
    });
  };

  const handleShare = async (id: string) => {
    try {
      const activityData = featuredEvents.find(activity => activity.id === id);
      if (!activityData) return;

      const shareData = {
        title: `Check out ${activityData.title || 'this activity'} on What2Do Bangalore`,
        text: activityData.description || 'Discover fun activities in Bangalore',
        url: window.location.origin + `/activity/${id}`,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({ title: 'Shared successfully!', duration: 1500 });
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast({ title: 'Link copied!', description: 'Share it with your friends', duration: 1500 });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({ title: 'Sharing failed', description: 'Please try again later', variant: 'destructive', duration: 1500 });
    }
  };

  const handleShuffle = () => {
    if (featuredEvents.length === 0) return;
    const randomIndex = Math.floor(Math.random() * featuredEvents.length);
    setCurrentActivityIndex(randomIndex);
    toast({ title: 'Shuffled activities', description: 'Finding something random for you', duration: 1500 });
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

  const renderActivitiesSection = (title: string, activities: Activity[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (activities.length > 0) {
      return viewMode === 'card' && title === '🎬 Featured Activities' ? (
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
          activities={activities}
          onLike={handleLike}
          likedActivities={likedActivities}
          onShare={handleShare}
        />
      );
    }

    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold mb-2">No activities found</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-w2d-cream overflow-x-hidden pb-6">
      <Header toggleSearch={toggleSearch} />

      <main className="container px-4 pt-2 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            🏙️ Your Weekend in Bangalore, Sorted. 🎉
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Curated from trusted local communities
          </p>
        </div>

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
          selectedCategories={selectedCategories}
          onSelectCategory={handleCategorySelect}
          onSelectAll={handleSelectAllCategories}
        />

        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />

        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎬 Featured Activities</h2>
          {renderActivitiesSection('🎬 Featured Activities', featuredEvents, 'Try a different filter')}
          <div className="text-center text-sm text-gray-600 italic mt-4">
            More dropping next week!... Stay tuned.
          </div>
        </div>

        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 Unique Experiences</h2>
          {renderActivitiesSection('🎨 Unique Experiences', uniqueExperiences, 'Try a different filter')}
          <div className="text-center text-sm text-gray-600 italic mt-4">
            More dropping next week!... Stay tuned.
          </div>
        </div>

        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">❤️ Date Ideas</h2>
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border-dashed border-2 border-gray-300">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-gray-600">Sign up to get updates!</p>
          </div>
        </div>

        <div className="mb-8 mt-10">
          <SubscribeSection />
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
