import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '@/components/SEO';
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
import QuickExplore from '@/components/QuickExplore';
import TrendingSection from '@/components/TrendingSection';
import LocationFilter from '@/components/LocationFilter';
import BottomNav from '@/components/BottomNav';
import { 
  getFilteredActivitiesBySection, 
  fetchCategories 
} from '@/services/activityService';
import { useAllSections, useCategories, activityKeys } from '@/hooks/useActivities';
import { useToast } from '@/components/ui/use-toast';
import { Dice6, Share2, Search, Loader2, Clock, Heart, Users, Utensils, Car, Briefcase, Compass, MapPin as MapPinIcon, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity } from '@/components/ActivityCard';
import { Category } from '@/components/CategoryFilter';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 6;

// Helper function to check if a date is today
const isToday = (dateString: string) => {
  if (!dateString) return false;
  
  const today = new Date().toLocaleDateString();
  const lowerDateString = dateString.toLowerCase();
  
  return dateString === today || 
         lowerDateString.includes('today') || 
         lowerDateString.includes('now');
};

// Enhanced helper function to check if a date is this weekend
const isThisWeekend = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Calculate this weekend's dates
  const saturday = new Date(now);
  const sunday = new Date(now);
  
  if (currentDay === 0) { // If today is Sunday
    saturday.setDate(now.getDate() - 1); // Yesterday was Saturday
    // sunday is already today
  } else if (currentDay === 6) { // If today is Saturday
    // saturday is already today
    sunday.setDate(now.getDate() + 1); // Tomorrow is Sunday
  } else { 
    // Set to the upcoming weekend
    const daysUntilSaturday = 6 - currentDay; // Days until next Saturday
    saturday.setDate(now.getDate() + daysUntilSaturday);
    sunday.setDate(now.getDate() + daysUntilSaturday + 1);
  }
  
  // Format for output
  return {
    saturdayString: saturday.toLocaleDateString(),
    sundayString: sunday.toLocaleDateString(),
    saturdayDay: saturday.getDate(),
    sundayDay: sunday.getDate(),
    saturdayMonth: saturday.getMonth() + 1,
    sundayMonth: sunday.getMonth() + 1,
    weekendDates: [saturday, sunday]
  };
};

// Completely revamped weekend detection function
const isWeekend = (dateString: string) => {
  if (!dateString) return false;
  
  const lowerDateString = dateString.toLowerCase().trim();
  console.log('Checking if date is weekend:', dateString);
  
  // Weekend keywords - using a more comprehensive set
  const weekendKeywords = [
    'weekend', 'saturday', 'sunday', 'sat', 'sun',
    'this sat', 'this sun', 'this weekend',
    'sat-sun', 'sat & sun', 'sat and sun', 'sat/sun',
    'saturday and sunday', 'saturday & sunday', 'saturday-sunday',
    'sat - sun', 'saturday - sunday'
  ];
  
  // Direct keyword match - check first as it's most explicit
  for (const keyword of weekendKeywords) {
    if (lowerDateString.includes(keyword)) {
      console.log('Weekend keyword match found:', keyword);
      return true;
    }
  }
  
  // Get weekend dates for comparison
  const { 
    saturdayString, sundayString, 
    saturdayDay, sundayDay,
    saturdayMonth, sundayMonth,
    weekendDates
  } = isThisWeekend();
  
  console.log('This weekend dates:', saturdayString, sundayString);
  
  // Direct date match
  if (dateString === saturdayString || dateString === sundayString) {
    console.log('Direct date match found');
    return true;
  }
  
  // Try to parse the date string to see if it falls on this weekend
  try {
    const possibleDateParts = lowerDateString.match(/\d+/g);
    if (possibleDateParts && possibleDateParts.length) {
      // Check if any numbers in the string match weekend days
      if (possibleDateParts.some(part => {
        const num = parseInt(part, 10);
        return num === saturdayDay || num === sundayDay;
      })) {
        console.log('Weekend day number found in string');
        return true;
      }
      
      // Try to extract a date from the string and check if it falls on weekend
      // This is complex and would require natural language date parsing
      // For simplicity, we'll check month names instead
    }
  } catch (error) {
    console.error('Error parsing date string:', error);
  }
  
  // Month names (abbreviated and full)
  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  // Check if current month name is in the string along with the weekend date
  const currentMonthShort = monthNames[saturdayMonth - 1];
  const currentMonthFull = monthNames[saturdayMonth + 11]; // Full name index
  
  if ((lowerDateString.includes(currentMonthShort) || lowerDateString.includes(currentMonthFull)) &&
      (lowerDateString.includes(saturdayDay.toString()) || lowerDateString.includes(sundayDay.toString()))) {
    console.log('Weekend date with current month found');
    return true;
  }
  
  // Additional weekend checks (e.g. "this weekend", "upcoming weekend")
  if (lowerDateString.includes('upcoming weekend') || 
      lowerDateString.includes('this weekend') || 
      lowerDateString.includes('coming weekend')) {
    console.log('Weekend phrase match found');
    return true;
  }
  
  // Check common date formats (more reliable)
  // For example: "5/20" or "20/5" or "May 20-21" for a weekend
  const dateRegexPatterns = [
    // MM/DD or DD/MM format
    new RegExp(`${saturdayMonth}/${saturdayDay}|${saturdayDay}/${saturdayMonth}`),
    new RegExp(`${sundayMonth}/${sundayDay}|${sundayDay}/${sundayMonth}`),
    
    // Month name with date
    new RegExp(`${currentMonthShort}\\s*${saturdayDay}|${currentMonthShort}\\s*${sundayDay}`, 'i'),
    new RegExp(`${currentMonthFull}\\s*${saturdayDay}|${currentMonthFull}\\s*${sundayDay}`, 'i'),
    
    // Date range including weekend
    new RegExp(`${saturdayDay}\\s*-\\s*${sundayDay}\\s*${currentMonthShort}`, 'i'),
    new RegExp(`${saturdayDay}\\s*-\\s*${sundayDay}\\s*${currentMonthFull}`, 'i'),
    new RegExp(`${currentMonthShort}\\s*${saturdayDay}\\s*-\\s*${sundayDay}`, 'i'),
    new RegExp(`${currentMonthFull}\\s*${saturdayDay}\\s*-\\s*${sundayDay}`, 'i'),
  ];
  
  for (const pattern of dateRegexPatterns) {
    if (pattern.test(lowerDateString)) {
      console.log('Date regex match found:', pattern);
      return true;
    }
  }
  
  return false;
};

// Function to format time to 12-hour format with AM/PM
const formatTimeTo12Hour = (timeString: string | undefined): string => {
  if (!timeString) return '';
  
  // If it's already in 12-hour format, just return it
  if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
    return timeString;
  }
  
  try {
    // Try to parse the time string assuming 24-hour format
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString; // Can't parse, return original
    
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original on error
  }
};

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab-related states
  const [currentTab, setCurrentTab] = useState('all');
  
  // Pagination states for display
  const [allActivitiesPage, setAllActivitiesPage] = useState(1);
  const [uniqueExperiencesPage, setUniqueExperiencesPage] = useState(1);
  const [dateIdeasPage, setDateIdeasPage] = useState(1);
  
  const { toast } = useToast();

  // Use React Query hooks for data fetching with caching
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  
  // Fetch all sections with React Query caching
  const { 
    allActivities: allActivitiesQuery, 
    uniqueExperiences: uniqueExperiencesQuery, 
    dateIdeas: dateIdeasQuery,
    isLoading: sectionsLoading 
  } = useAllSections(sortOption);

  const rawAllActivities = allActivitiesQuery.data || [];
  const rawUniqueExperiences = uniqueExperiencesQuery.data || [];
  const rawDateIdeas = dateIdeasQuery.data || [];

  // Time-based filters
  const timeFilters = [
    { id: 'today', label: 'Today', icon: '📅' },
    { id: 'weekend', label: 'This Weekend', icon: '🗓️' },
    { id: 'week', label: 'This Week', icon: '📆' },
    { id: 'anytime', label: 'Anytime', icon: '✨' },
  ];

  // Custom filters for the weekend
  const customQuickFilters = [
    { id: 'free', label: 'Free' },
    { id: 'today', label: 'Today' },
    { id: 'weekend', label: 'This Weekend' }
  ];

  // Helper function to apply all filters to an activity list
  const applyFilters = useCallback((activities: Activity[]): Activity[] => {
    let filtered = [...activities];

    // Filter by category if selected
    if (selectedCategories.size > 0) {
      const categoryIds = Array.from(selectedCategories);
      filtered = filtered.filter(activity =>
        categoryIds.some(id => activity.categoryIds.includes(id))
      );
    }

    // Apply quick filters
    if (selectedQuickFilters.size > 0) {
      if (selectedQuickFilters.has('free')) {
        filtered = filtered.filter(activity =>
          activity.priceRange?.toLowerCase().includes('free')
        );
      }

      if (selectedQuickFilters.has('today')) {
        filtered = filtered.filter(activity => isToday(activity.date || ''));
      }

      if (selectedQuickFilters.has('weekend')) {
        filtered = filtered.filter(activity => isWeekend(activity.date || ''));
      }
    }

    // Apply location filter
    if (selectedLocation) {
      const locationMap: Record<string, string[]> = {
        'indiranagar': ['indiranagar', 'indira nagar'],
        'koramangala': ['koramangala'],
        'hsr': ['hsr', 'hsr layout'],
        'whitefield': ['whitefield'],
        'jayanagar': ['jayanagar', 'jaya nagar'],
        'malleshwaram': ['malleshwaram'],
      };
      const locationTerms = locationMap[selectedLocation] || [selectedLocation];
      filtered = filtered.filter(activity =>
        locationTerms.some(term => 
          activity.location?.toLowerCase().includes(term)
        )
      );
    }

    // Apply search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(query) ||
        (activity.description && activity.description.toLowerCase().includes(query)) ||
        (activity.location && activity.location.toLowerCase().includes(query)) ||
        (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [selectedCategories, selectedQuickFilters, selectedLocation, searchQuery]);

  // Memoized filtered activities - only recalculate when filters or data change
  const allActivities = useMemo(() => 
    applyFilters(rawAllActivities), 
    [rawAllActivities, applyFilters]
  );

  const uniqueExperiences = useMemo(() => 
    applyFilters(rawUniqueExperiences), 
    [rawUniqueExperiences, applyFilters]
  );

  const dateIdeas = useMemo(() => 
    applyFilters(rawDateIdeas), 
    [rawDateIdeas, applyFilters]
  );

  // Derived totals from filtered data
  const allActivitiesTotal = allActivities.length;
  const uniqueExperiencesTotal = uniqueExperiences.length;
  const dateIdeasTotal = dateIdeas.length;

  // Combined loading state
  const isLoading = sectionsLoading;

  useEffect(() => {
    const badge = document.getElementById('lovable-badge');
    if (badge) {
      badge.style.display = 'none';
    }
  }, []);

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
  
  // Reset activity index when filters change
  useEffect(() => {
    setCurrentActivityIndex(0);
  }, [selectedCategories, selectedQuickFilters, searchQuery, sortOption]);

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

  // Properly update the handleSwipeLeft function to respect sort order
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

  // Properly update the handleSwipeRight function to respect sort order
  const handleSwipeRight = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    } else {
      // If at the beginning, go to the last item
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
  
  const handleSortChange = (option: string) => {
    setSortOption(option);
    // React Query will refetch with the new sort option automatically
  };
  
  // Simplified loadMore functions - data is already cached, just update display
  const loadMoreAll = useCallback(() => {
    setAllActivitiesPage(prev => prev + 1);
  }, []);
  
  const loadMoreUniqueExperiences = useCallback(() => {
    setUniqueExperiencesPage(prev => prev + 1);
  }, []);
  
  const loadMoreDateIdeas = useCallback(() => {
    setDateIdeasPage(prev => prev + 1);
  }, []);

  // Calculate displayed activities based on pagination
  const displayedAllActivities = useMemo(() => 
    allActivities.slice(0, allActivitiesPage * ITEMS_PER_PAGE),
    [allActivities, allActivitiesPage]
  );

  const displayedUniqueExperiences = useMemo(() => 
    uniqueExperiences.slice(0, uniqueExperiencesPage * ITEMS_PER_PAGE),
    [uniqueExperiences, uniqueExperiencesPage]
  );

  const displayedDateIdeas = useMemo(() => 
    dateIdeas.slice(0, dateIdeasPage * ITEMS_PER_PAGE),
    [dateIdeas, dateIdeasPage]
  );

  const renderTabContent = (activities: Activity[], sectionType: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-w2d-teal" />
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="glass-floating scale-in p-8 text-center mx-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">No activities found</h3>
            <p className="text-gray-600 font-medium">Try a different filter</p>
          </div>
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
        columns={2} // Explicitly set to 2 columns for desktop
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

  // Prepare tab configuration with removed emojis
  const tabs = [
    {
      id: 'all',
      title: 'All',
      content: renderTabContent(displayedAllActivities, 'All'),
      count: {
        loaded: displayedAllActivities.length,
        total: allActivitiesTotal
      },
      onLoadMore: displayedAllActivities.length < allActivitiesTotal ? loadMoreAll : undefined,
      isLoading: false
    },
    {
      id: 'unique-experiences',
      title: 'Unique Experiences',
      content: renderTabContent(displayedUniqueExperiences, 'Unique Experiences'),
      count: {
        loaded: displayedUniqueExperiences.length,
        total: uniqueExperiencesTotal
      },
      onLoadMore: displayedUniqueExperiences.length < uniqueExperiencesTotal ? loadMoreUniqueExperiences : undefined,
      isLoading: false
    },
    {
      id: 'date-ideas',
      title: 'Date Ideas',
      content: displayedDateIdeas.length > 0 
        ? renderTabContent(displayedDateIdeas, 'Date Ideas')
        : (
          <div className="glass-floating scale-in p-8 text-center border-dashed border-2 border-white/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Coming Soon</h3>
              <p className="text-gray-600">Sign up to get updates!</p>
            </div>
          </div>
        ),
      count: displayedDateIdeas.length > 0 ? {
        loaded: displayedDateIdeas.length,
        total: dateIdeasTotal
      } : undefined,
      onLoadMore: displayedDateIdeas.length < dateIdeasTotal ? loadMoreDateIdeas : undefined,
      isLoading: false
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO 
        url="https://happeningsbangalore.com"
        keywords="Things to do in Bangalore, Bangalore activities, Bangalore events, weekend plans Bangalore, date ideas Bangalore, couple activities Bangalore"
      />
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container px-4 pt-4 pb-8 lg:max-w-6xl mx-auto">
        <SubscribePopup isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />

        {/* Quick Explore Section */}
        <QuickExplore onItemClick={(id) => {
          toast({ title: `${id} coming soon!`, description: 'This feature is under development', duration: 2000 });
        }} />

        {/* Trending Section */}
        <TrendingSection activities={rawAllActivities} />

        {/* Sticky Filters Container */}
        <div className="sticky top-[52px] z-30 bg-gray-50 -mx-4 px-4 py-2">
          {/* Location Filter */}
          <LocationFilter 
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />

          {/* Combined Filters Row */}
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 flex-1" style={{ scrollbarWidth: 'none' }}>
                {/* Time/Quick Filters */}
                {customQuickFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleQuickFilterSelect(filter.id)}
                    className={cn(
                      "flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all border",
                      selectedQuickFilters.has(filter.id)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
                
                {/* Divider */}
                <div className="flex-shrink-0 w-px h-6 bg-gray-200 self-center mx-1" />
                
                {/* Category Filters */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-all border",
                      selectedCategories.has(category.id)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activities listing */}
        <div className="mb-8 mt-4 min-h-[60vh]">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900">Events & Activities</h2>
              <span className="text-xs text-gray-400 font-medium">({allActivities.length})</span>
            </div>
            <ViewToggle 
              selectedMode={viewMode} 
              onSelect={setViewMode} 
              disabled={currentTab !== 'all'} 
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          ) : allActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No activities found</h3>
              <p className="text-sm text-gray-500 mb-4">Try a different filter or location</p>
              <button 
                onClick={() => {
                  setSelectedQuickFilters(new Set());
                  setSelectedLocation(null);
                  setSelectedCategories(new Set());
                }}
                className="text-orange-500 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'card' ? (
            currentActivity && (
              <ActivityCard 
                activity={currentActivity}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onLike={handleLike}
                onShare={handleShare}
                liked={likedActivities.has(currentActivity.id)}
                showSwipeHint={true}
              />
            )
          ) : (
            <ActivityGrid 
              activities={allActivities}
              onLike={handleLike}
              likedActivities={likedActivities}
              onShare={handleShare}
              columns={2}
              sectionType="All"
            />
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
