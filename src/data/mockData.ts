
import { Activity } from '@/components/ActivityCard';
import { Category } from '@/components/CategoryFilter';

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

export const activities: Activity[] = [
  {
    id: '1',
    title: 'Pottery Workshop',
    image: '/lovable-uploads/41c75125-35bf-443d-bee9-e9b59958a166.png',
    tags: ['🎨 Creative', '🧠 Mindful'],
    priceRange: '₹1200 - ₹1800',
    location: 'Indiranagar',
    lastUpdated: 'yesterday at 3:30 PM',
    categoryIds: ['arts', 'creative', 'unique'],
    description: 'Try your hand at pottery making in this beginner-friendly workshop. All materials provided. Take home your creations after they are fired in the kiln!',
    date: 'Every Saturday',
    time: '10:00 AM - 12:30 PM',
    mapLink: 'https://goo.gl/maps/examplelink1',
    contactInfo: '+91 98765 43210'
  },
  {
    id: '2',
    title: 'Cubbon Park Morning Run',
    image: 'https://images.unsplash.com/photo-1501290741922-b56c0d0884af?ixlib=rb-4.0.3',
    tags: ['🏃‍♂️ Active', '🌳 Nature'],
    priceRange: 'Free',
    location: 'Central Bangalore',
    lastUpdated: 'today at 7:00 AM',
    categoryIds: ['outdoor', 'sports', 'wellness'],
    description: 'Join the community of morning runners at Cubbon Park. Routes range from 3km to 10km. All levels welcome!',
    date: 'Mon, Wed, Fri',
    time: '6:00 AM - 7:30 AM',
    mapLink: 'https://goo.gl/maps/examplelink2'
  },
  {
    id: '3',
    title: 'Comedy Open Mic Night',
    image: 'https://images.unsplash.com/photo-1485282451181-c5e5b1eb9644?ixlib=rb-4.0.3',
    tags: ['🎭 Live', '😂 Funny', '🍺 Drinks'],
    priceRange: '₹300 entry',
    location: 'Koramangala',
    lastUpdated: '2 days ago',
    categoryIds: ['events', 'theatre', 'unique'],
    description: 'Laugh out loud at this weekly comedy open mic featuring upcoming talent from across the city. Food and drinks available.',
    date: 'Every Thursday',
    time: '8:00 PM onwards',
    mapLink: 'https://goo.gl/maps/examplelink3',
    contactInfo: '+91 98765 12345'
  },
  {
    id: '4',
    title: 'Saree Draping Workshop',
    image: 'https://images.unsplash.com/photo-1610030181087-540017dc7b5e?ixlib=rb-4.0.3',
    tags: ['👗 Fashion', '🧵 Traditional'],
    priceRange: '₹800',
    location: 'Jayanagar',
    lastUpdated: 'yesterday at 6:15 PM',
    categoryIds: ['arts', 'events', 'unique'],
    description: 'Learn different styles of saree draping from an expert. Bring your own saree or use one provided at the venue.',
    date: 'This Sunday',
    time: '11:00 AM - 1:00 PM',
    mapLink: 'https://goo.gl/maps/examplelink4'
  },
  {
    id: '5',
    title: 'Nandi Hills Sunrise Trek',
    image: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?ixlib=rb-4.0.3',
    tags: ['🌄 Sunrise', '🥾 Trekking'],
    priceRange: '₹950 (including transport)',
    location: 'Nandi Hills',
    lastUpdated: 'today at 9:30 AM',
    categoryIds: ['outdoor', 'trek', 'wellness'],
    description: 'Early morning trek to witness the spectacular sunrise from Nandi Hills. Transportation from Bangalore included.',
    date: 'This Weekend',
    time: '4:00 AM pickup',
    mapLink: 'https://goo.gl/maps/examplelink5',
    contactInfo: '+91 87654 32109'
  },
  {
    id: '6',
    title: 'Craft Beer Tasting Tour',
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?ixlib=rb-4.0.3',
    tags: ['🍺 Beer', '🍽️ Food', '👥 Social'],
    priceRange: '₹2500 per person',
    location: 'Various locations',
    lastUpdated: '3 days ago',
    categoryIds: ['foodie', 'events', 'parties'],
    description: 'Sample Bangalore\'s finest craft beers with this guided tour across 3 microbreweries. Includes food pairings and a beer making demonstration.',
    date: 'Saturdays',
    time: '3:00 PM - 8:00 PM',
    mapLink: 'https://goo.gl/maps/examplelink6'
  },
];

export const getFilteredActivities = (
  categoryIds: string[] | null,
  quickFilterIds: string[] | null,
  searchQuery: string = ''
) => {
  let filtered = [...activities];
  
  if (categoryIds && categoryIds.length > 0) {
    filtered = filtered.filter(activity => 
      categoryIds.some(categoryId => activity.categoryIds.includes(categoryId))
    );
  }
  
  if (quickFilterIds && quickFilterIds.length > 0) {
    if (quickFilterIds.includes('free')) {
      filtered = filtered.filter(activity => activity.priceRange.toLowerCase().includes('free'));
    }
    
    if (quickFilterIds.includes('today')) {
      filtered = filtered.filter(activity => 
        activity.lastUpdated.toLowerCase().includes('today') || 
        (activity.date && activity.date.toLowerCase().includes('today'))
      );
    }
    
    // Add more quick filter handlers as needed for other filters
  }
  
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(activity => 
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query) ||
      activity.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  return filtered;
};

export const getActivityById = (id: string): Activity | undefined => {
  return activities.find(activity => activity.id === id);
};
