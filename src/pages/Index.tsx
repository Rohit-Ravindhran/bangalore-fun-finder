import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Dice6, Share2, Search, Loader2, Clock } from 'lucide-react';
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
  
  // Main data fetching useEffect - modified for weekend filter
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
          
          // Enhanced weekend filter
          if (selectedQuickFilters.has('weekend')) {
            console.log('Weekend filter active, checking dates...');
            
            // Log all dates before filtering for debugging
            allActivitiesData.forEach(activity => {
              console.log(`Activity: ${activity.title}, Date: ${activity.date}`);
            });
            
            filteredAll = filteredAll.filter(activity => {
              const result = isWeekend(activity.date || '');
              console.log(`Activity: ${activity.title}, Date: ${activity.date}, Is Weekend: ${result}`);
              return result;
            });
            
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
      title: 'Unique Experiences',
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
      title: 'Date Ideas',
      content: dateIdeas.length > 0 
        ? renderTabContent(dateIdeas, 'Date Ideas')
        : (
          <div className="glass-floating scale-in p-8 text-center border-dashed border-2 border-white/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Coming Soon</h3>
              <p className="text-gray-600">Sign up to get updates!</p>
            </div>
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
    <div className="min-h-screen bg-white">
      <Header toggleSearch={toggleSearch} />

      <main className="container px-4 pt-6 pb-32 lg:max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Happ'nin Bangalore
          </h1>
          <p className="text-gray-600">
            A Bangalore outing guide — shaped by a growing community.
          </p>
        </div>

        <SubscribePopup isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />

        {searchVisible && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400" />
              <Input 
                id="search-input"
                type="text" 
                placeholder="Search activities..." 
                className="border-0 focus-visible:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {customQuickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleQuickFilterSelect(filter.id)}
                  className={cn(
                    "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all border",
                    selectedQuickFilters.has(filter.id)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="ml-4">
              <ViewToggle 
                selectedMode={viewMode} 
                onSelect={setViewMode} 
                disabled={currentTab !== 'all'} 
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all border",
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

        {/* All Events Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Events</h2>
          <span className="text-sm text-gray-500">{allActivitiesTotal} events</span>
        </div>
        
        {/* Activities listing */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          ) : allActivities.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No activities found</h3>
              <p className="text-gray-600">Try a different filter</p>
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
      
      <Footer />
    </div>
  );
};

export default Index;
