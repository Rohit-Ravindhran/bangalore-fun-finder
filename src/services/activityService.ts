
import { categories } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/components/ActivityCard';

// Function to get category names from category IDs
export const getCategoryNames = (categoryIds: string[]) => {
  if (!categoryIds || !Array.isArray(categoryIds)) return [];
  
  return categoryIds.map(id => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : '';
  }).filter(Boolean);
};

// Helper to transform database activities to frontend format
const transformActivities = (activities: any[]): Activity[] => {
  return activities.map(act => ({
    id: String(act.id),
    title: act.title || '',
    image: act.image || '/placeholder.svg',
    tags: act.tags || [],
    priceRange: act.price_range || 'Free',
    location: act.location || 'Bangalore',
    lastUpdated: act.updated_at ? new Date(act.updated_at).toLocaleDateString() : 'today',
    categoryIds: act.category_ids || [],
    categoryNames: getCategoryNames(act.category_ids || []),
    description: act.description || '',
    date: act.date || '',
    time: act.time || '',
    mapLink: act.map_link || '',
    contactInfo: act.contact_info || ''
  }));
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching categories:', error);
      // Fallback to local data
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji || '✨' // Add a default emoji if not present
      }));
    }
    
    // Transform database categories to match frontend format
    return data.map(cat => ({
      id: String(cat.id),
      name: cat.name,
      emoji: '✨' // Add a default emoji since it might not be in the database
    }));
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return categories;
  }
};

// Get filtered activities by section
export async function getFilteredActivitiesBySection(sectionType: string, sortOption: string = 'newest') {
  try {
    let query = supabase.from('activities').select('*');
    
    if (sectionType !== 'all') {
      query = query.eq('section_type', sectionType);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'popular':
        // Assuming we have a popularity field or using tags to determine popularity
        query = query.contains('tags', ['trending']);
        break;
      case 'price_low_high':
        // This is simplistic - in reality you'd need a more sophisticated approach
        query = query.order('price_range', { ascending: true });
        break;
      case 'price_high_low':
        query = query.order('price_range', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching activities by section:', error);
      // Return mock data as fallback
      return [];
    }
    
    // Transform activities to frontend format
    return transformActivities(data);
  } catch (error) {
    console.error('Error in getFilteredActivitiesBySection:', error);
    return [];
  }
}

// Get filtered activities with more complex filtering
export async function getFilteredActivities(filter = {}, sortOption = 'newest') {
  try {
    let query = supabase.from('activities').select('*');
    
    // Apply category filter
    if (filter.category) {
      query = query.contains('category_ids', [filter.category]);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'popular':
        query = query.contains('tags', ['trending']);
        break;
      case 'price_low_high':
        query = query.order('price_range', { ascending: true });
        break;
      case 'price_high_low':
        query = query.order('price_range', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered activities:', error);
      return [];
    }
    
    // Transform activities to frontend format
    return transformActivities(data);
  } catch (error) {
    console.error('Error in getFilteredActivities:', error);
    return [];
  }
}

// Get a single activity by ID
export async function getActivityById(id: string) {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();
    
    if (error) {
      console.error('Error fetching activity by ID:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform to frontend format
    return {
      id: String(data.id),
      title: data.title,
      image: data.image,
      tags: data.tags || [],
      priceRange: data.price_range,
      location: data.location,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'today',
      categoryIds: data.category_ids || [],
      categoryNames: getCategoryNames(data.category_ids || []),
      description: data.description || '',
      date: data.date || '',
      time: data.time || '',
      mapLink: data.map_link || '',
      contactInfo: data.contact_info || ''
    };
  } catch (error) {
    console.error('Error in getActivityById:', error);
    return null;
  }
}

// Create an activity
export const createActivity = async (activity: Partial<Activity>) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          title: activity.title,
          description: activity.description,
          image: activity.image,
          price_range: activity.priceRange,
          location: activity.location,
          tags: activity.tags,
          category_ids: activity.categoryIds,
          date: activity.date,
          time: activity.time,
          map_link: activity.mapLink,
          contact_info: activity.contactInfo
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }
    
    return data ? transformActivities(data)[0] : null;
  } catch (error) {
    console.error('Error in createActivity:', error);
    return null;
  }
};

// Update an activity
export const updateActivity = async (id: string, activity: Partial<Activity>) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .update({
        title: activity.title,
        description: activity.description,
        image: activity.image,
        price_range: activity.priceRange,
        location: activity.location,
        tags: activity.tags,
        category_ids: activity.categoryIds,
        date: activity.date,
        time: activity.time,
        map_link: activity.mapLink,
        contact_info: activity.contactInfo
      })
      .eq('id', parseInt(id, 10))
      .select();
      
    if (error) {
      console.error('Error updating activity:', error);
      return null;
    }
    
    return data ? transformActivities(data)[0] : null;
  } catch (error) {
    console.error('Error in updateActivity:', error);
    return null;
  }
};

// Delete an activity
export const deleteActivity = async (id: string) => {
  try {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', parseInt(id, 10));
      
    if (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteActivity:', error);
    return false;
  }
};

// Subscribe user to newsletter
export const subscribeUser = async (email: string) => {
  try {
    // First check if email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
      
    if (checkError) {
      console.error('Error checking for existing user:', checkError);
      return { success: false, message: 'Error checking database' };
    }
    
    if (existingUsers && existingUsers.length > 0) {
      return { success: false, message: 'This email is already subscribed' };
    }
    
    // Insert new user
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email }]);
      
    if (insertError) {
      console.error('Error subscribing user:', insertError);
      return { success: false, message: 'Could not subscribe at this time' };
    }
    
    return { success: true, message: 'Subscribed successfully!' };
  } catch (error) {
    console.error('Error in subscribeUser:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Fetch categories from the database table
export const fetchCategoriesFromTable = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCategoriesFromTable:', error);
    return [];
  }
};

// Fetch tags from the database table
export const fetchTagsFromTable = async () => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');
    
    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTagsFromTable:', error);
    return [];
  }
};
