import { Category } from '@/components/CategoryFilter';

// Re-export the categories for compatibility
export const categories: Category[] = [
  { id: 'outdoor', name: 'Outdoor', emoji: '🏞️' },
  { id: 'arts', name: 'Arts', emoji: '🎨' },
  { id: 'events', name: 'Events', emoji: '🎶' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'theatre', name: 'Theatre', emoji: '🎭' },
  { id: 'unique', name: 'Unique', emoji: '🎯' },
  { id: 'wellness', name: 'Wellness', emoji: '🧘' },
  { id: 'parties', name: 'Parties', emoji: '🎉' },
  { id: 'foodie', name: 'Foodie', emoji: '🍽️' },
  { id: 'trek', name: 'Trek', emoji: '🏕️' },
  { id: 'families', name: 'For Families', emoji: '👨‍👩‍👧' },
];

export const quickFilters = [
  { id: 'today', label: 'Today' },
  { id: 'free', label: 'Free' },
  { id: 'creative', label: 'Creative' },
  { id: 'solo', label: 'Solo' },
  { id: 'plans', label: 'Plans' },
  { id: 'mindful', label: 'Mindful' },
];

// No more activities array or getActivityById function here
// All data is now fetched from the database via activityService
