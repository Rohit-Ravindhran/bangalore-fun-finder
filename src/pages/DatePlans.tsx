import React, { useState, useMemo } from 'react';
import { Search, Heart, SlidersHorizontal, X } from 'lucide-react';
import { SEO } from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import DatePlanCard from '@/components/DatePlanCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockDatePlans, getAllAreas } from '@/data/datePlanData';
import { DatePlan, DatePlanVibe, DatePlanTimeOfDay, getVibeInfo } from '@/types/datePlan';

const vibeOptions: { value: DatePlanVibe; label: string; emoji: string }[] = [
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'chill', label: 'Chill', emoji: '😌' },
  { value: 'foodie', label: 'Foodie', emoji: '🍴' },
  { value: 'adventurous', label: 'Adventurous', emoji: '🏃' },
  { value: 'cultural', label: 'Cultural', emoji: '🎭' },
  { value: 'budget', label: 'Budget', emoji: '💰' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
];

const timeOptions: { value: DatePlanTimeOfDay | 'all'; label: string }[] = [
  { value: 'all', label: 'Any Time' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Late Night' },
];

const DatePlans: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedVibe, setSelectedVibe] = useState<DatePlanVibe | 'all'>('all');
  const [selectedTime, setSelectedTime] = useState<DatePlanTimeOfDay | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [likedPlans, setLikedPlans] = useState<Set<string>>(new Set());
  
  const areas = getAllAreas();
  
  // Filter date plans
  const filteredPlans = useMemo(() => {
    return mockDatePlans.filter(plan => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        plan.title.toLowerCase().includes(searchLower) ||
        plan.subtitle.toLowerCase().includes(searchLower) ||
        plan.area.toLowerCase().includes(searchLower) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      // Area filter
      const matchesArea = selectedArea === 'all' || plan.area === selectedArea;
      
      // Vibe filter
      const matchesVibe = selectedVibe === 'all' || plan.vibe === selectedVibe;
      
      // Time filter
      const matchesTime = selectedTime === 'all' || 
        plan.timeOfDay === selectedTime || 
        plan.timeOfDay === 'all-day';
      
      return matchesSearch && matchesArea && matchesVibe && matchesTime;
    });
  }, [searchQuery, selectedArea, selectedVibe, selectedTime]);
  
  // Get featured plans
  const featuredPlans = mockDatePlans.filter(plan => plan.isFeatured);
  
  const handleLike = (id: string) => {
    setLikedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const clearFilters = () => {
    setSelectedArea('all');
    setSelectedVibe('all');
    setSelectedTime('all');
    setSearchQuery('');
  };
  
  const hasActiveFilters = selectedArea !== 'all' || selectedVibe !== 'all' || selectedTime !== 'all' || searchQuery;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white">
      <SEO 
        title="Date Planner - Curated Date Ideas in Bangalore"
        description="Discover curated date plans for every vibe - romantic evenings, foodie adventures, budget-friendly outings and more. Plan the perfect date in Bangalore."
        url="https://happeningsbangalore.com/date-plans"
      />
      
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Date Planner 💕
          </h1>
          <p className="text-rose-100 text-lg mb-6">
            Curated date plans for every vibe. Just pick one and go!
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by area, vibe, or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 h-12 rounded-full bg-white text-gray-900 border-0 shadow-lg"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="sticky top-0 z-30 bg-white border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Area filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedArea('all')}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                selectedArea === 'all'
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-rose-100"
              )}
            >
              All Areas
            </button>
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  selectedArea === area
                    ? "bg-rose-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-rose-100"
                )}
              >
                {area}
              </button>
            ))}
            
            {/* More filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ml-auto",
                showFilters || hasActiveFilters
                  ? "bg-rose-100 text-rose-600"
                  : "bg-gray-100 text-gray-600 hover:bg-rose-100"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <div className="pt-3 pb-2 border-t border-gray-100 mt-2 space-y-3">
              {/* Vibe filters */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">VIBE</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedVibe('all')}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all",
                      selectedVibe === 'all'
                        ? "bg-rose-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-rose-100"
                    )}
                  >
                    All Vibes
                  </button>
                  {vibeOptions.map(vibe => (
                    <button
                      key={vibe.value}
                      onClick={() => setSelectedVibe(vibe.value)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        selectedVibe === vibe.value
                          ? "bg-rose-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-rose-100"
                      )}
                    >
                      {vibe.emoji} {vibe.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Time filters */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">TIME OF DAY</p>
                <div className="flex flex-wrap gap-2">
                  {timeOptions.map(time => (
                    <button
                      key={time.value}
                      onClick={() => setSelectedTime(time.value)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        selectedTime === time.value
                          ? "bg-rose-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-rose-100"
                      )}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-12">
        {/* Featured Section (only show when no filters) */}
        {!hasActiveFilters && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>✨</span> Featured Date Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPlans.map(plan => (
                <DatePlanCard 
                  key={plan.id} 
                  datePlan={plan}
                  onLike={handleLike}
                  liked={likedPlans.has(plan.id)}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* All Plans / Filtered Results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {hasActiveFilters ? `${filteredPlans.length} Date Plans Found` : 'All Date Plans'}
            </h2>
          </div>
          
          {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlans.map(plan => (
                <DatePlanCard 
                  key={plan.id} 
                  datePlan={plan}
                  onLike={handleLike}
                  liked={likedPlans.has(plan.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No date plans found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search query
              </p>
              <Button 
                onClick={clearFilters}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>
        
        {/* Create Your Own CTA */}
        <section className="mt-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Want a custom date plan? 💌
          </h3>
          <p className="text-gray-600 mb-4">
            Tell us your preferences and we'll create a personalized date plan just for you!
          </p>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">
            Coming Soon
          </Button>
        </section>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default DatePlans;
