import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ActivityCard from '@/components/ActivityCard';
import ActivityGrid from '@/components/ActivityGrid';
import ShuffleButton from '@/components/ShuffleButton';
import { ViewToggleWithLegacyProps as ViewToggle } from '@/components/ViewToggle';
import { SortSelectorWithLegacyProps as SortSelector } from '@/components/SortSelector';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import SubscribePopup from '@/components/SubscribePopup';
import SubscribeSection from '@/components/SubscribeSection';
import TabView from '@/components/TabView';
import { 
  getFilteredActivitiesBySection, 
  getFilteredActivities, 
  fetchCategories 
} from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Dice6, Share2, Search, Loader2, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity } from '@/components/ActivityCard';
import { Category } from '@/components/CategoryFilter';
import { Separator } from '@/components/ui/separator';

const ITEMS_PER_PAGE = 6;

// Helper function to check if a date is today
const isToday = (dateString: string) => {
  const today = new Date().toLocaleDateString();
  return dateString === today || 
         (dateString && dateString.toLowerCase().includes('today'));
};

// Helper function to check if a date is this weekend
const isThisWeekend = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  const nextSaturday = new Date(now);
  const nextSunday = new Date(now);
  
  // If today is already Saturday or Sunday, use today's date
  if (currentDay === 6) { // Saturday
    nextSaturday.setDate(now.getDate());
    nextSunday.setDate(now.getDate() + 1);
  } else if (currentDay === 0) { // Sunday
    nextSaturday.setDate(now.getDate() - 1);
    nextSunday.setDate(now.getDate());
  } else {
    // Calculate days until next Saturday
    const daysUntilSaturday = 6 - currentDay;
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSunday.setDate(now.getDate() + daysUntilSaturday + 1);
  }
  
  // Format dates for comparison
  return {
    saturdayString: nextSaturday.toLocaleDateString(),
    sundayString: nextSunday.toLocaleDateString()
  };
};

// Helper function to check if an activity is this weekend
const isWeekend = (dateString: string) => {
  if (!dateString) return false;
  
  const { saturdayString, sundayString } = isThisWeekend();
  
  return dateString === saturdayString || 
         dateString === sundayString ||
         dateString.toLowerCase().includes('saturday') ||
         dateString.toLowerCase().includes('sunday') ||
         dateString.toLowerCase().includes('weekend');
};

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<Set<string>>(new Set());
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Tab-related states
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [uniqueExperiences, setUniqueExperiences] = useState<Activity[]>([]);
  const [dateIdeas, setDateIdeas] = useState<Activity[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Pagination states
  const [allActivitiesTotal, setAllActivitiesTotal] = useState(0);
  const [uniqueExperiencesTotal, setUniqueExperiencesTotal] = useState(0);
  const [dateIdeasTotal, setDateIdeasTotal] = useState(0);
  const [allActivitiesPage, setAllActivitiesPage] = useState(1);
  const [uniqueExperiencesPage, setUniqueExperiencesPage] = useState(1);
  const [dateIdeasPage, setDateIdeasPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  // Custom filters for the weekend
  const customQuickFilters = [
    { id: 'free', label: 'Free' },
    { id: 'today', label: 'Today' },
    { id: 'weekend', label: 'This Weekend' }
  ];

  useEffect(() => {
    const badge = document.getElementById('lovable-badge');
    if (badge) {
      badge.style.display = 'none';
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error loading categories',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    };
    
    loadCategories();
  }, [toast]);

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
        // Fetch all activities and filter by section type
        const allActivitiesData = await getFilteredActivitiesBySection('all', sortOption);
        const unique = await getFilteredActivitiesBySection('unique', sortOption);
        const dateIdeasData = await getFilteredActivitiesBySection('date', sortOption);
        
        // Filter by category if selected
        let filteredAll = [...allActivitiesData];
        let filteredUnique = [...unique];
        let filteredDateIdeas = [...dateIdeasData];
        
        if (selectedCategories.size > 0) {
          const categoryIds = Array.from(selectedCategories);
          filteredAll = filteredAll.filter(activity => 
            categoryIds.some(id => activity.categoryIds.includes(id))
          );
          filteredUnique = filteredUnique.filter(activity => 
            categoryIds.some(id => activity.categoryIds.includes(id))
          );
          filteredDateIdeas = filteredDateIdeas.filter(activity => 
            categoryIds.some(id => activity.categoryIds.includes(id))
          );
        }
        
        // Apply quick filters
        if (selectedQuickFilters.size > 0) {
          if (selectedQuickFilters.has('free')) {
            filteredAll = filteredAll.filter(activity => 
              activity.priceRange?.toLowerCase().includes('free')
            );
            filteredUnique = filteredUnique.filter(activity => 
              activity.priceRange?.toLowerCase().includes('free')
            );
            filteredDateIdeas = filteredDateIdeas.filter(activity => 
              activity.priceRange?.toLowerCase().includes('free')
            );
          }
          
          if (selectedQuickFilters.has('today')) {
            filteredAll = filteredAll.filter(activity => isToday(activity.date || ''));
            filteredUnique = filteredUnique.filter(activity => isToday(activity.date || ''));
            filteredDateIdeas = filteredDateIdeas.filter(activity => isToday(activity.date || ''));
          }
          
          // Add weekend filter
          if (selectedQuickFilters.has('weekend')) {
            filteredAll = filteredAll.filter(activity => isWeekend(activity.date || ''));
            filteredUnique = filteredUnique.filter(activity => isWeekend(activity.date || ''));
            filteredDateIdeas = filteredDateIdeas.filter(activity => isWeekend(activity.date || ''));
          }
        }
        
        // Apply search query
        if (searchQuery && searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          
          filteredAll = filteredAll.filter(activity => 
            activity.title.toLowerCase().includes(query) || 
            (activity.description && activity.description.toLowerCase().includes(query)) ||
            (activity.location && activity.location.toLowerCase().includes(query)) ||
            (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(query)))
          );
          
          filteredUnique = filteredUnique.filter(activity => 
            activity.title.toLowerCase().includes(query) || 
            (activity.description && activity.description.toLowerCase().includes(query)) ||
            (activity.location && activity.location.toLowerCase().includes(query)) ||
            (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(query)))
          );
          
          filteredDateIdeas = filteredDateIdeas.filter(activity => 
            activity.title.toLowerCase().includes(query) || 
            (activity.description && activity.description.toLowerCase().includes(query)) ||
            (activity.location && activity.location.toLowerCase().includes(query)) ||
            (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }
        
        setAllActivities(filteredAll);
        setUniqueExperiences(filteredUnique);
        setDateIdeas(filteredDateIdeas);
        
        setAllActivitiesTotal(filteredAll.length);
        setUniqueExperiencesTotal(filteredUnique.length);
        setDateIdeasTotal(filteredDateIdeas.length);
        
        // Reset current activity index when filters change
        setCurrentActivityIndex(0);
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
  }, [toast, sortOption, selectedCategories, selectedQuickFilters, searchQuery]);

  const currentActivity = allActivities[currentActivityIndex];

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
    if (currentActivityIndex < allActivities.length - 1) {
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
      setCurrentActivityIndex(allActivities.length - 1);
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
      let activityData;
      
      if (currentTab === 'all') {
        activityData = allActivities.find(activity => activity.id === id);
      } else if (currentTab === 'unique-experiences') {
        activityData = uniqueExperiences.find(activity => activity.id === id);
      } else {
        activityData = dateIdeas.find(activity => activity.id === id);
      }
      
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
    let activities: Activity[] = [];
    
    if (currentTab === 'all') {
      activities = allActivities;
    } else if (currentTab === 'unique-experiences') {
      activities = uniqueExperiences;
    } else {
      activities = dateIdeas;
    }
    
    if (activities.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * activities.length);
    
    if (currentTab === 'all') {
      setCurrentActivityIndex(randomIndex);
    }
    
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
  
  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Activities will be re-fetched with the new sort option via the useEffect
  };
  
  const loadMoreAll = async () => {
    setLoadingMore(true);
    try {
      const nextPage = allActivitiesPage + 1;
      const moreActivities = await getFilteredActivitiesBySection('all', sortOption);
      const startIndex = allActivitiesPage * ITEMS_PER_PAGE;
      const newItems = moreActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      if (newItems.length > 0) {
        setAllActivities(prev => [...prev, ...newItems]);
        setAllActivitiesPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more activities:', error);
      toast({
        title: 'Error loading more activities',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };
  
  const loadMoreUniqueExperiences = async () => {
    setLoadingMore(true);
    try {
      const nextPage = uniqueExperiencesPage + 1;
      const moreActivities = await getFilteredActivitiesBySection('unique', sortOption);
      const startIndex = uniqueExperiencesPage * ITEMS_PER_PAGE;
      const newItems = moreActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      if (newItems.length > 0) {
        setUniqueExperiences(prev => [...prev, ...newItems]);
        setUniqueExperiencesPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more activities:', error);
      toast({
        title: 'Error loading more activities',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };
  
  const loadMoreDateIdeas = async () => {
    setLoadingMore(true);
    try {
      const nextPage = dateIdeasPage + 1;
      const moreActivities = await getFilteredActivitiesBySection('date', sortOption);
      const startIndex = dateIdeasPage * ITEMS_PER_PAGE;
      const newItems = moreActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      if (newItems.length > 0) {
        setDateIdeas(prev => [...prev, ...newItems]);
        setDateIdeasPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more activities:', error);
      toast({
        title: 'Error loading more activities',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const renderTabContent = (activities: Activity[], sectionType: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="glass-card p-8 text-center my-8">
          <h3 className="text-xl font-bold mb-2">No activities found</h3>
          <p className="text-gray-600">Try a different filter</p>
        </div>
      );
    }

    return viewMode === 'card' && sectionType === 'All' ? (
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
        columns={1}
        sectionType={sectionType}
      />
    );
  };

  // Define sort options
  const sortOptions = [
    { id: 'popular', label: '🔥 Popular' },
    { id: 'price_low_high', label: '💸 Budget low to high' },
    { id: 'price_high_low', label: '💸 Budget high to low' },
    { id: 'newest', label: '🆕 New' }
  ];

  // Prepare tab configuration
  const tabs = [
    {
      id: 'all',
      title: '✨ All',
      content: renderTabContent(allActivities, 'All'),
      count: {
        loaded: allActivities.length,
        total: allActivitiesTotal
      },
      onLoadMore: loadMoreAll,
      isLoading: loadingMore && currentTab === 'all'
    },
    {
      id: 'unique-experiences',
      title: '🎨 Unique Experiences',
      content: renderTabContent(uniqueExperiences, 'Unique Experiences'),
      count: {
        loaded: uniqueExperiences.length,
        total: uniqueExperiencesTotal
      },
      onLoadMore: loadMoreUniqueExperiences,
      isLoading: loadingMore && currentTab === 'unique-experiences'
    },
    {
      id: 'date-ideas',
      title: '💑 Date Ideas',
      content: dateIdeas.length > 0 
        ? renderTabContent(dateIdeas, 'Date Ideas')
        : (
          <div className="glass-card p-8 text-center my-8 border-dashed border-2 border-white/30">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-gray-600">Sign up to get updates!</p>
          </div>
        ),
      count: dateIdeas.length > 0 ? {
        loaded: dateIdeas.length,
        total: dateIdeasTotal
      } : undefined,
      onLoadMore: loadMoreDateIdeas,
      isLoading: loadingMore && currentTab === 'date-ideas'
    }
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  // Get yesterday's date for the "last updated" timestamp
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const lastUpdatedTime = yesterday.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const lastUpdatedDate = yesterday.toLocaleDateString();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header toggleSearch={toggleSearch} />

      <main className="container px-4 pt-6 pb-32">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 retro-title uppercase tracking-tighter">
            SWIPE YOUR<br/>WEEKEND PLAN
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white retro-title">
            <span className="text-white">BANGALORE</span>
          </h2>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-4">
            <Target className="h-4 w-4 text-white mr-1" />
            <p className="text-sm text-white">
              Curated with love from local communities
            </p>
          </div>
        </div>

        <SubscribeSection className="z-10 mb-8 shadow-xl glass-effect" />

        <SubscribePopup isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />

        {searchVisible && (
          <div className="glass-card mb-6 relative overflow-hidden">
            <div className="flex items-center gap-2 p-3">
              <Search className="h-5 w-5 text-white" />
              <Input 
                id="search-input"
                type="text" 
                placeholder="Search activities..." 
                className="border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end text-xs text-white mb-3 items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Activities last updated: {lastUpdatedTime} - {lastUpdatedDate}</span>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Categories</h2>
          <CategoryFilter 
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectCategory={handleCategorySelect}
            onSelectAll={handleSelectAllCategories}
            quickFilters={customQuickFilters}
            selectedQuickFilters={selectedQuickFilters}
            onSelectQuickFilter={handleQuickFilterSelect}
          />
        </div>

        <Separator className="my-6 bg-white/30" />

        {/* Position sort and switch controls above tab content */}
        <div className="flex justify-between items-center mb-4">
          <SortSelector 
            options={sortOptions} 
            selectedOption={sortOption} 
            onSelect={handleSortChange} 
          />
          <ViewToggle 
            selectedMode={viewMode} 
            onSelect={setViewMode} 
            disabled={currentTab !== 'all'} 
          />
        </div>
        
        <div className="mb-10">
          <TabView 
            tabs={tabs} 
            defaultTabId="all" 
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOptions={sortOptions}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
            hideControls={true} // Hide controls since we moved them above
          />
        </div>

        <div className="fixed bottom-32 right-6 z-20">
          <ShuffleButton onShuffle={handleShuffle} />
        </div>
      </main>
      
      <InstallPrompt />
      <Footer />
    </div>
  );
};

export default Index;
