import { categories } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/components/ActivityCard';
import { z } from 'zod';

// =============================================
// Input Validation Schemas
// =============================================
const urlSchema = z.string().url().optional().or(z.literal(''));

const activitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  image: z.string().optional(),
  priceRange: z.string().max(100).optional(),
  location: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  mapLink: urlSchema,
  contactInfo: z.string().max(500).optional(),
  url: urlSchema
});

// Returns true if the activity's date clearly indicates it has already passed
const isExpiredActivity = (dateStr: string | undefined | null): boolean => {
  if (!dateStr || dateStr.trim() === '') return false;

  const lower = dateStr.toLowerCase().trim();

  // Clearly ongoing / evergreen — never expired
  const ongoingTerms = ['ongoing', 'anytime', 'everyday', 'daily', 'weekly', 'monthly', 'always', 'open', 'permanent', 'year round', 'coming soon'];
  if (ongoingTerms.some((t) => lower.includes(t))) return false;

  // Future-pointing terms — not expired
  const futureTerms = ['today', 'tonight', 'tomorrow', 'this weekend', 'this week', 'upcoming', 'next'];
  if (futureTerms.some((t) => lower.includes(t))) return false;

  // Try native Date parse — only trust it when the year is explicit (avoids false positives)
  const hasYear = /\b(202\d|203\d)\b/.test(dateStr);
  if (hasYear) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsed < today;
    }
  }

  return false;
};

// Helper to log errors only in development
const logError = (message: string, error: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
};

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
    contactInfo: act.contact_info || '',
    url: act.url || '',
    latitude: act.latitude ?? undefined,
    longitude: act.longitude ?? undefined
  }));
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      logError('Error fetching categories:', error);
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
    logError('Error in fetchCategories:', error);
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
      logError('Error fetching activities by section:', error);
      // Return empty array as fallback
      return [];
    }
    
    // Transform activities to frontend format, filtering out expired events
    return transformActivities(data).filter((a) => !isExpiredActivity(a.date));
  } catch (error) {
    logError('Error in getFilteredActivitiesBySection:', error);
    return [];
  }
}

// Get filtered activities with more complex filtering
export async function getFilteredActivities(filter = {}, sortOption = 'newest') {
  try {
    let query = supabase.from('activities').select('*');
    
    // Apply category filter if it exists
    if (filter && typeof filter === 'object' && 'categoryId' in filter && filter.categoryId) {
      query = query.contains('category_ids', [filter.categoryId]);
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
      logError('Error fetching filtered activities:', error);
      return [];
    }
    
    // Transform activities to frontend format, filtering out expired events
    return transformActivities(data).filter((a) => !isExpiredActivity(a.date));
  } catch (error) {
    logError('Error in getFilteredActivities:', error);
    return [];
  }
}

// Fetch all activities
export async function fetchActivities() {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      logError('Error fetching activities:', error);
      return [];
    }
    
    return transformActivities(data);
  } catch (error) {
    logError('Error in fetchActivities:', error);
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
      logError('Error fetching activity by ID:', error);
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
      contactInfo: data.contact_info || '',
      url: data.url || ''
    };
  } catch (error) {
    logError('Error in getActivityById:', error);
    return null;
  }
}

// Create an activity (admin only - uses secure RPC)
export const createActivity = async (activity: Partial<Activity>, adminId?: string) => {
  try {
    // Validate input
    const parseResult = activitySchema.safeParse(activity);
    if (!parseResult.success) {
      logError('Validation error:', parseResult.error);
      return { data: null, error: parseResult.error.errors[0]?.message || 'Invalid input' };
    }

    // If adminId provided, use secure RPC function
    if (adminId) {
      const { data, error } = await supabase.rpc('admin_create_activity', {
        p_admin_id: adminId,
        p_title: activity.title || '',
        p_description: activity.description || null,
        p_image: activity.image || null,
        p_price_range: activity.priceRange || null,
        p_location: activity.location || null,
        p_date: activity.date || null,
        p_time: activity.time || null,
        p_map_link: activity.mapLink || null,
        p_contact_info: activity.contactInfo || null,
        p_url: activity.url || null,
        p_category_ids: activity.categoryIds || [],
        p_tags: activity.tags || [],
        p_section_type: 'all',
        p_enabled: true,
        p_latitude: activity.latitude ?? null,
        p_longitude: activity.longitude ?? null
      });

      if (error) {
        logError('Error creating activity:', error);
        return { data: null, error: 'Failed to create activity' };
      }

      const result = data as unknown as { success: boolean; message: string; activity_id?: number };
      if (!result.success) {
        return { data: null, error: result.message };
      }

      // Fetch the created activity
      if (result.activity_id) {
        const created = await getActivityById(String(result.activity_id));
        return { data: created, error: null };
      }

      return { data: null, error: null };
    }

    // Fallback: direct insert (will fail with new RLS policies)
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
          contact_info: activity.contactInfo,
          url: activity.url
        }
      ])
      .select();
      
    if (error) {
      logError('Error creating activity:', error);
      return { data: null, error: 'Unauthorized or failed to create activity' };
    }
    
    return { data: data ? transformActivities(data)[0] : null, error: null };
  } catch (error) {
    logError('Error in createActivity:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

// Update an activity (admin only - uses secure RPC)
export const updateActivity = async (id: string, activity: Partial<Activity>, adminId?: string) => {
  try {
    // Validate input (partial validation for updates)
    const partialSchema = activitySchema.partial();
    const parseResult = partialSchema.safeParse(activity);
    if (!parseResult.success) {
      logError('Validation error:', parseResult.error);
      return { data: null, error: parseResult.error.errors[0]?.message || 'Invalid input' };
    }

    // If adminId provided, use secure RPC function
    if (adminId) {
      const { data, error } = await supabase.rpc('admin_update_activity', {
        p_admin_id: adminId,
        p_activity_id: parseInt(id, 10),
        p_title: activity.title || null,
        p_description: activity.description !== undefined ? activity.description : null,
        p_image: activity.image !== undefined ? activity.image : null,
        p_price_range: activity.priceRange !== undefined ? activity.priceRange : null,
        p_location: activity.location !== undefined ? activity.location : null,
        p_date: activity.date !== undefined ? activity.date : null,
        p_time: activity.time !== undefined ? activity.time : null,
        p_map_link: activity.mapLink !== undefined ? activity.mapLink : null,
        p_contact_info: activity.contactInfo !== undefined ? activity.contactInfo : null,
        p_url: activity.url !== undefined ? activity.url : null,
        p_category_ids: activity.categoryIds !== undefined ? activity.categoryIds : null,
        p_tags: activity.tags !== undefined ? activity.tags : null,
        p_section_type: null,
        p_enabled: null,
        p_latitude: activity.latitude !== undefined ? activity.latitude : null,
        p_longitude: activity.longitude !== undefined ? activity.longitude : null
      });

      if (error) {
        logError('Error updating activity:', error);
        return { data: null, error: 'Failed to update activity' };
      }

      const result = data as unknown as { success: boolean; message: string };
      if (!result.success) {
        return { data: null, error: result.message };
      }

      // Fetch the updated activity
      const updated = await getActivityById(id);
      return { data: updated, error: null };
    }

    // Fallback: direct update (will fail with new RLS policies)
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
        contact_info: activity.contactInfo,
        url: activity.url
      })
      .eq('id', parseInt(id, 10))
      .select();
      
    if (error) {
      logError('Error updating activity:', error);
      return { data: null, error: 'Unauthorized or failed to update activity' };
    }
    
    return { data: data ? transformActivities(data)[0] : null, error: null };
  } catch (error) {
    logError('Error in updateActivity:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

// Delete an activity (admin only - uses secure RPC)
export const deleteActivity = async (id: string, adminId?: string) => {
  try {
    // If adminId provided, use secure RPC function
    if (adminId) {
      const { data, error } = await supabase.rpc('admin_delete_activity', {
        p_admin_id: adminId,
        p_activity_id: parseInt(id, 10)
      });

      if (error) {
        logError('Error deleting activity:', error);
        return { success: false, error: 'Failed to delete activity' };
      }

      const result = data as unknown as { success: boolean; message: string };
      return { success: result.success, error: result.success ? null : result.message };
    }

    // Fallback: direct delete (will fail with new RLS policies)
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', parseInt(id, 10));
      
    if (error) {
      logError('Error deleting activity:', error);
      return { success: false, error: 'Unauthorized or failed to delete activity' };
    }
    
    return { success: true, error: null };
  } catch (error) {
    logError('Error in deleteActivity:', error);
    return { success: false, error: 'An unexpected error occurred' };
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
      logError('Error checking for existing user:', checkError);
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
      logError('Error subscribing user:', insertError);
      return { success: false, message: 'Could not subscribe at this time' };
    }
    
    return { success: true, message: 'Subscribed successfully!' };
  } catch (error) {
    logError('Error in subscribeUser:', error);
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
      logError('Error fetching categories:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    logError('Error in fetchCategoriesFromTable:', error);
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
      logError('Error fetching tags:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    logError('Error in fetchTagsFromTable:', error);
    return [];
  }
};
