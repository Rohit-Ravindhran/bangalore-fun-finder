import { mockActivities, mockCategories } from '@/data/mockData';
import { Activity } from '@/components/ActivityCard';
import { Category } from '@/components/CategoryFilter';

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
      resolve(mockCategories);
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
export async function getFilteredActivities(filter = {}, sortOption = 'newest'): Promise<Activity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = [...mockActivities];

      if (filter.category) {
        filteredActivities = filteredActivities.filter((activity) =>
          activity.categoryIds.includes(filter.category)
        );
      }

      const sortedActivities = sortActivities(filteredActivities, sortOption);
      resolve(sortedActivities);
    }, 500);
  });
}

// Modify the functions that fetch activities to include category names
export async function getFilteredActivitiesBySection(sectionType, sortOption) {
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
      resolve(sortedActivities);
    }, 500);
  });
}

// Modify the functions that fetch activities to include category names
// Modify the functions that fetch activities to include category names
export async function getFilteredActivitiesBySection(sectionType, sortOption) {
  // After fetching activities, add category names
  const activities = mockActivities.filter(activity => {
    if (sectionType === 'all') {
      return true;
    } else if (sectionType === 'unique' && activity.tags.includes('unique')) {
      return true;
    } else if (sectionType === 'date' && activity.tags.includes('date')) {
      return true;
    }
    return false;
  });
  
  // Add category names to activities
  return activities.map(activity => {
    // For each activity, find its primary category
    let categoryName = '';
    if (activity.categoryIds && activity.categoryIds.length > 0) {
      // Get the first category ID and find its name
      const primaryCategoryId = activity.categoryIds[0];
      const category = mockCategories.find(cat => cat.id === primaryCategoryId);
      if (category) {
        categoryName = category.name;
      }
    }
    
    return {
      ...activity,
      categoryName
    };
  });
}

export async function getFilteredActivities(filter = {}, sortOption = 'newest') {
  let filteredActivities = [...mockActivities];

      if (filter.category) {
        filteredActivities = filteredActivities.filter((activity) =>
          activity.categoryIds.includes(filter.category)
        );
      }

      const sortedActivities = sortActivities(filteredActivities, sortOption);
  
  // After fetching activities, add category names
  const activities = sortedActivities
  
  // Add category names to activities
  return activities.map(activity => {
    // For each activity, find its primary category
    let categoryName = '';
    if (activity.categoryIds && activity.categoryIds.length > 0) {
      // Get the first category ID and find its name
      const primaryCategoryId = activity.categoryIds[0];
      const category = mockCategories.find(cat => cat.id === primaryCategoryId);
      if (category) {
        categoryName = category.name;
      }
    }
    
    return {
      ...activity,
      categoryName
    };
  });
}
