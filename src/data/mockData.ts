
import { Category } from '@/components/CategoryFilter';
import { Activity } from '@/components/ActivityCard';
import { getActivityById as fetchActivityById, fetchActivities } from '@/services/activityService';

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

// Sample activities for initial rendering and fallback
export let activities: Activity[] = [];

// Get activities from the service
export const getActivities = async (): Promise<Activity[]> => {
  try {
    activities = await fetchActivities();
    return activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

// Get a single activity by ID
export const getActivityById = async (id: string): Promise<Activity | null> => {
  try {
    return await fetchActivityById(id);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return null;
  }
};

// Initialize activities
getActivities().catch(console.error);
