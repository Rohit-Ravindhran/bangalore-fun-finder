
import { mockActivities, categories as mockCategories } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

// Function to get category names from category IDs
const getCategoryNames = (categoryIds: string[]) => {
  if (!categoryIds) return [];
  return categoryIds.map(id => {
    const category = mockCategories.find(cat => cat.id === id);
    return category ? category.name : '';
  }).filter(Boolean);
};

// Helper function to add category names to activities
const addCategoryNamesToActivities = (activities: any[]) => {
  return activities.map(activity => ({
    ...activity,
    categoryNames: getCategoryNames(activity.categoryIds)
  }));
};

// Fetch all activities
export const fetchActivities = async () => {
  let { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    return addCategoryNamesToActivities(mockActivities);
  }

  return addCategoryNamesToActivities(activities || mockActivities);
};

// Get activity by ID
export const getActivityById = async (id: string) => {
  let { data: activity, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching activity by id:', error);
    const mockActivity = mockActivities.find(a => a.id === id);
    return mockActivity ? { 
      ...mockActivity,
      categoryNames: getCategoryNames(mockActivity.categoryIds)
    } : null;
  }

  return activity ? {
    ...activity,
    categoryNames: getCategoryNames(activity.categoryIds)
  } : null;
};

// Fetch categories
export const fetchCategories = async () => {
  let { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }

  return categories || mockCategories;
};

// Function to get filtered activities based on filters
export const getFilteredActivities = async (filter = {}, sortOption = 'newest') => {
  let filteredActivities = [...mockActivities];
  
  if (filter.category) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.categoryIds.includes(filter.category)
    );
  }
  
  // Apply sorting
  if (sortOption === 'popular') {
    filteredActivities.sort((a, b) => (b.tags.includes('trending') ? 1 : 0) - (a.tags.includes('trending') ? 1 : 0));
  } else if (sortOption === 'price_low_high') {
    filteredActivities.sort((a, b) => {
      const priceA = a.priceRange.includes('Free') ? 0 : parseInt(a.priceRange.replace(/[^\d]/g, '')) || 0;
      const priceB = b.priceRange.includes('Free') ? 0 : parseInt(b.priceRange.replace(/[^\d]/g, '')) || 0;
      return priceA - priceB;
    });
  } else if (sortOption === 'price_high_low') {
    filteredActivities.sort((a, b) => {
      const priceA = a.priceRange.includes('Free') ? 0 : parseInt(a.priceRange.replace(/[^\d]/g, '')) || 0;
      const priceB = b.priceRange.includes('Free') ? 0 : parseInt(b.priceRange.replace(/[^\d]/g, '')) || 0;
      return priceB - priceA;
    });
  } else {
    // Default sort by newest
    filteredActivities.sort((a, b) => 
      (b.lastUpdated.includes('today') ? 1 : 0) - (a.lastUpdated.includes('today') ? 1 : 0)
    );
  }
  
  return addCategoryNamesToActivities(filteredActivities);
};

// Function to get filtered activities by section type
export const getFilteredActivitiesBySection = async (sectionType: string, sortOption = 'newest') => {
  // After fetching activities, add category names
  const activities = mockActivities.filter(activity => {
    if (sectionType === 'all') {
      return true;
    } else if (sectionType === 'unique') {
      return activity.tags.includes('unique');
    } else if (sectionType === 'date') {
      return activity.tags.includes('date');
    }
    return true;
  });
  
  // Apply sorting
  if (sortOption === 'popular') {
    activities.sort((a, b) => (b.tags.includes('trending') ? 1 : 0) - (a.tags.includes('trending') ? 1 : 0));
  } else if (sortOption === 'price_low_high') {
    activities.sort((a, b) => {
      const priceA = a.priceRange.includes('Free') ? 0 : parseInt(a.priceRange.replace(/[^\d]/g, '')) || 0;
      const priceB = b.priceRange.includes('Free') ? 0 : parseInt(b.priceRange.replace(/[^\d]/g, '')) || 0;
      return priceA - priceB;
    });
  } else if (sortOption === 'price_high_low') {
    activities.sort((a, b) => {
      const priceA = a.priceRange.includes('Free') ? 0 : parseInt(a.priceRange.replace(/[^\d]/g, '')) || 0;
      const priceB = b.priceRange.includes('Free') ? 0 : parseInt(b.priceRange.replace(/[^\d]/g, '')) || 0;
      return priceB - priceA;
    });
  } else {
    // Default sort by newest
    activities.sort((a, b) => 
      (b.lastUpdated.includes('today') ? 1 : 0) - (a.lastUpdated.includes('today') ? 1 : 0)
    );
  }
  
  return addCategoryNamesToActivities(activities);
};

// Create new activity
export const createActivity = async (activityData: any) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .select();
  
  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
  
  return data ? data[0] : null;
};

// Update activity
export const updateActivity = async (id: string, activityData: any) => {
  const { data, error } = await supabase
    .from('activities')
    .update(activityData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
  
  return data ? data[0] : null;
};

// Delete activity
export const deleteActivity = async (id: string) => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
  
  return true;
};

// Subscribe user
export const subscribeUser = async (contact: string) => {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ contact }])
    .select();
  
  if (error) {
    console.error('Error subscribing user:', error);
    throw error;
  }
  
  return data ? data[0] : null;
};

// Fetch categories from table
export const fetchCategoriesFromTable = async () => {
  let { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
};

// Fetch tags from table
export const fetchTagsFromTable = async () => {
  let { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return tags || [];
};
