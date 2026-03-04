// Date Plan Types for the Date Planner Feature

export interface DatePlanStop {
  id: string;
  name: string;
  type: 'cafe' | 'restaurant' | 'park' | 'dessert' | 'bar' | 'activity' | 'attraction' | 'shopping';
  emoji?: string; // Optional - will be derived from type if not provided
  description: string;
  estimatedCost: number; // in INR
  duration: number; // in minutes
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tips?: string;
  image?: string;
  googleMapsUrl?: string;
}

export interface DatePlan {
  id: string;
  title: string;
  subtitle: string; // The story/tagline
  heroImage: string;
  totalCost: number; // in INR, for two people
  duration: number; // in minutes
  area: string; // e.g., "MG Road", "Indiranagar", "Koramangala"
  vibe: 'romantic' | 'adventurous' | 'chill' | 'foodie' | 'cultural' | 'budget' | 'luxury';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'all-day';
  stops: DatePlanStop[];
  tags: string[];
  isFeatured?: boolean;
  likes?: number;
  views?: number; // Track how many people visited the plan
  createdAt?: string;
  updatedAt?: string;
}

export type DatePlanVibe = DatePlan['vibe'];
export type DatePlanTimeOfDay = DatePlan['timeOfDay'];
export type StopType = DatePlanStop['type'];

// Helper function to get emoji for stop type
export const getStopTypeEmoji = (type: StopType): string => {
  const emojiMap: Record<StopType, string> = {
    cafe: '☕',
    restaurant: '🍽️',
    park: '🌳',
    dessert: '🍨',
    bar: '🍸',
    activity: '🎯',
    attraction: '📸',
    shopping: '🛍️',
  };
  return emojiMap[type] || '📍';
};

// Helper function to get emoji for a stop (from stop or derived from type)
export const getStopEmoji = (stop: DatePlanStop): string => {
  return stop.emoji || getStopTypeEmoji(stop.type);
};

// Helper function to get vibe display info
export const getVibeInfo = (vibe: DatePlanVibe): { emoji: string; label: string; color: string } => {
  const vibeMap: Record<DatePlanVibe, { emoji: string; label: string; color: string }> = {
    romantic: { emoji: '💕', label: 'Romantic', color: 'bg-pink-100 text-pink-700' },
    adventurous: { emoji: '🏃', label: 'Adventurous', color: 'bg-orange-100 text-orange-700' },
    chill: { emoji: '😌', label: 'Chill', color: 'bg-blue-100 text-blue-700' },
    foodie: { emoji: '🍴', label: 'Foodie', color: 'bg-amber-100 text-amber-700' },
    cultural: { emoji: '🎭', label: 'Cultural', color: 'bg-purple-100 text-purple-700' },
    budget: { emoji: '💰', label: 'Budget-Friendly', color: 'bg-green-100 text-green-700' },
    luxury: { emoji: '✨', label: 'Luxury', color: 'bg-yellow-100 text-yellow-700' },
  };
  return vibeMap[vibe];
};

// Helper function to format duration
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours}–${hours + 1} hrs`;
};

// Helper function to format cost
export const formatCost = (cost: number): string => {
  if (cost === 0) return 'Free';
  return `₹${cost.toLocaleString('en-IN')}`;
};
