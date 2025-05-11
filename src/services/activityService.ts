
import { Activity } from '@/components/ActivityCard';
import { Category } from '@/components/CategoryFilter';
import { categories } from '@/data/mockData';

// Mock activities for the application
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Pottery Workshop',
    image: 'https://images.unsplash.com/photo-1565122644283-5758bd90c638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Learn the ancient art of pottery making in this hands-on workshop.',
    priceRange: '₹1200 per person',
    location: 'Indiranagar, Bangalore',
    categoryIds: ['arts'],
    tags: ['creative', 'unique'],
    date: 'Every Saturday',
    time: '10:00 AM - 12:00 PM',
    mapLink: 'https://maps.google.com/?q=Indiranagar,Bangalore',
    lastUpdated: '2024-05-09',
    categoryName: 'Arts'
  },
  {
    id: '2',
    title: 'Nandi Hills Trek',
    image: 'https://images.unsplash.com/photo-1537436875793-b1025ba4ff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    description: 'Experience the breathtaking sunrise at Nandi Hills with this guided trek.',
    priceRange: '₹800 per person',
    location: 'Nandi Hills, 60km from Bangalore',
    categoryIds: ['outdoor', 'trek'],
    tags: ['adventure', 'nature'],
    date: 'Saturday and Sunday',
    time: '4:30 AM - 11:00 AM',
    mapLink: 'https://maps.google.com/?q=Nandi+Hills',
    lastUpdated: '2024-05-08',
    categoryName: 'Trek'
  },
  {
    id: '3',
    title: 'Comedy Night',
    image: 'https://images.unsplash.com/photo-1610964199131-5e29387e6267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    description: 'Laugh your heart out at this comedy night featuring local stand-up comedians.',
    priceRange: '₹500 - ₹1000',
    location: 'Koramangala, Bangalore',
    categoryIds: ['events', 'theatre'],
    tags: ['entertainment', 'nightlife'],
    date: 'Friday',
    time: '8:00 PM - 10:00 PM',
    mapLink: 'https://maps.google.com/?q=Koramangala,Bangalore',
    lastUpdated: '2024-05-10',
    categoryName: 'Events'
  },
  {
    id: '4',
    title: 'Vineyard Tour & Wine Tasting',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    description: 'Visit a local vineyard and enjoy wine tasting with complementary cheese platter.',
    priceRange: '₹1500 per person',
    location: 'Off Kanakapura Road, 50km from Bangalore',
    categoryIds: ['unique', 'foodie'],
    tags: ['date', 'unique', 'gourmet'],
    date: 'Saturday & Sunday',
    time: '11:00 AM - 4:00 PM',
    mapLink: 'https://maps.google.com/?q=Kanakapura+Road',
    lastUpdated: '2024-05-07',
    contactInfo: '+91 9876543210',
    categoryName: 'Foodie'
  },
  {
    id: '5',
    title: 'Cycle Tour of Heritage Bangalore',
    image: 'https://images.unsplash.com/photo-1563801793838-2e6b06726c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Discover the old charm of Bangalore city on an eco-friendly cycle tour.',
    priceRange: '₹700 per person',
    location: 'Cubbon Park, Bangalore',
    categoryIds: ['outdoor', 'unique'],
    tags: ['history', 'fitness', 'morning'],
    date: 'Sunday',
    time: '7:00 AM - 10:00 AM',
    mapLink: 'https://maps.google.com/?q=Cubbon+Park,Bangalore',
    lastUpdated: '2024-05-06',
    categoryName: 'Outdoor'
  },
  {
    id: '6',
    title: 'Camping Under the Stars',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    description: 'Overnight camping experience with stargazing, bonfire and outdoor activities.',
    priceRange: '₹2000 per person',
    location: 'Skandagiri, Outskirts of Bangalore',
    categoryIds: ['outdoor', 'trek'],
    tags: ['adventure', 'overnight', 'nature'],
    date: 'Friday to Sunday',
    time: '4:00 PM - Next day 10:00 AM',
    mapLink: 'https://maps.google.com/?q=Skandagiri',
    lastUpdated: '2024-05-05',
    categoryName: 'Trek'
  },
];

// Function to fetch all activities
export const fetchActivities = async (): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities);
    }, 500);
  });
};

// Function to fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

// Function to filter activities based on category IDs
export const filterActivitiesByCategory = async (categoryIds: string[]): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredActivities = mockActivities.filter((activity) =>
        categoryIds.every((categoryId) => activity.categoryIds.includes(categoryId))
      );
      resolve(filteredActivities);
    }, 500);
  });
};

// Function to sort activities based on the selected option
const sortActivities = (activities: Activity[], sortOption: string): Activity[] => {
  switch (sortOption) {
    case 'popular':
      // Sort by number of likes or views (not available in mock data)
      return [...activities].sort(() => Math.random() - 0.5); // Placeholder
    case 'price_low_high':
      return [...activities].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.priceRange.replace(/[^0-9.]/g, '')) || 0;
        return priceA - priceB;
      });
    case 'price_high_low':
      return [...activities].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.priceRange.replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      });
    case 'newest':
      return [...activities].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    default:
      return activities;
  }
};

// Function to filter activities based on a single filter
export async function getFilteredActivities(filter: { category?: string } = {}, sortOption = 'newest'): Promise<Activity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = [...mockActivities];

      if (filter.category) {
        filteredActivities = filteredActivities.filter((activity) =>
          activity.categoryIds.includes(filter.category)
        );
      }

      const sortedActivities = sortActivities(filteredActivities, sortOption);
      
      // Add category names to activities
      const activitiesWithCategoryNames = sortedActivities.map(activity => {
        // For each activity, find its primary category
        let categoryName = '';
        if (activity.categoryIds && activity.categoryIds.length > 0) {
          // Get the first category ID and find its name
          const primaryCategoryId = activity.categoryIds[0];
          const category = categories.find(cat => cat.id === primaryCategoryId);
          if (category) {
            categoryName = category.name;
          }
        }
        
        return {
          ...activity,
          categoryName
        };
      });
      
      resolve(activitiesWithCategoryNames);
    }, 500);
  });
}

// Function to get activities filtered by section type
export async function getFilteredActivitiesBySection(sectionType: string, sortOption: string): Promise<Activity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = mockActivities.filter(activity => {
        if (sectionType === 'all') {
          return true;
        } else if (sectionType === 'unique' && activity.tags.includes('unique')) {
          return true;
        } else if (sectionType === 'date' && activity.tags.includes('date')) {
          return true;
        }
        return false;
      });
  
      const sortedActivities = sortActivities(filteredActivities, sortOption);
      
      // Add category names to activities
      const activitiesWithCategoryNames = sortedActivities.map(activity => {
        // For each activity, find its primary category
        let categoryName = '';
        if (activity.categoryIds && activity.categoryIds.length > 0) {
          // Get the first category ID and find its name
          const primaryCategoryId = activity.categoryIds[0];
          const category = categories.find(cat => cat.id === primaryCategoryId);
          if (category) {
            categoryName = category.name;
          }
        }
        
        return {
          ...activity,
          categoryName
        };
      });
      
      resolve(activitiesWithCategoryNames);
    }, 500);
  });
}

// Function to get an activity by ID
export const getActivityById = async (id: string): Promise<Activity | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activity = mockActivities.find(a => a.id === id);
      if (!activity) {
        resolve(null);
        return;
      }
      
      // Add category name
      let categoryName = '';
      if (activity.categoryIds && activity.categoryIds.length > 0) {
        const primaryCategoryId = activity.categoryIds[0];
        const category = categories.find(cat => cat.id === primaryCategoryId);
        if (category) {
          categoryName = category.name;
        }
      }
      
      resolve({
        ...activity,
        categoryName
      });
    }, 500);
  });
};

// Admin functions
export const createActivity = async (activityData: Omit<Activity, 'id' | 'lastUpdated'>): Promise<Activity> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = String(Date.now());
      const newActivity = {
        ...activityData,
        id: newId,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      // In a real app, this would add to a database
      mockActivities.unshift(newActivity);
      resolve(newActivity);
    }, 500);
  });
};

export const updateActivity = async (id: string, activityData: Partial<Activity>): Promise<Activity> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockActivities.findIndex(a => a.id === id);
      if (index === -1) {
        reject(new Error("Activity not found"));
        return;
      }
      
      const updatedActivity = {
        ...mockActivities[index],
        ...activityData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      mockActivities[index] = updatedActivity;
      resolve(updatedActivity);
    }, 500);
  });
};

export const deleteActivity = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockActivities.findIndex(a => a.id === id);
      if (index === -1) {
        reject(new Error("Activity not found"));
        return;
      }
      
      mockActivities.splice(index, 1);
      resolve();
    }, 500);
  });
};

// Mock tables for admin
export const fetchCategoriesFromTable = async (): Promise<{ id: number; name: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories.map((cat, index) => ({ 
        id: index + 1, 
        name: cat.name 
      })));
    }, 500);
  });
};

export const fetchTagsFromTable = async (): Promise<{ id: number; name: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uniqueTags = Array.from(
        new Set(mockActivities.flatMap(activity => activity.tags))
      );
      resolve(uniqueTags.map((tag, index) => ({ 
        id: index + 1, 
        name: tag 
      })));
    }, 500);
  });
};

// Subscribe user functionality
export const subscribeUser = async (contact: string): Promise<void> => {
  return new Promise((resolve) => {
    // In a real app, this would add the user to a database or mailing list
    console.log(`User subscribed with contact: ${contact}`);
    setTimeout(resolve, 500);
  });
};
