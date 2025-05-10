import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/components/ActivityCard';

// Type that represents what our database actually has
type ActivityRow = {
  id: number;
  title: string | null;
  image: string | null;
  tags: string[] | null;
  price_range: string | null;
  location: string | null;
  description: string | null;
  category_ids: string[] | null;
  date: string | null;
  time: string | null;
  map_link: string | null;
  contact_info: string | null;
  created_at: string;
  updated_at: string | null;
  section_type: string | null;
};

// Helper function to convert database row to our Activity type
const mapRowToActivity = (row: ActivityRow): Activity => ({
  id: row.id.toString(),
  title: row.title || 'Untitled Activity',
  image: row.image || '/placeholder.svg',
  tags: row.tags || [],
  priceRange: row.price_range || 'Free',
  location: row.location || 'Bangalore',
  lastUpdated: row.updated_at ? new Date(row.updated_at).toLocaleDateString() : new Date(row.created_at).toLocaleDateString(),
  categoryIds: row.category_ids || [],
  description: row.description || '',
  date: row.date || undefined,
  time: row.time || undefined,
  mapLink: row.map_link || undefined,
  contactInfo: row.contact_info || undefined
});

export const fetchActivities = async (sortOption = 'popular'): Promise<Activity[]> => {
  let query = supabase.from('activities').select('*');

  // Apply sorting
  switch (sortOption) {
    case 'price_low_high':
      query = query.order('price_range', { ascending: true });
      break;
    case 'price_high_low':
      query = query.order('price_range', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
    default:
      // For popular, we first get featured items then the rest
      break;
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  
  // Transform the data to match our Activity type
  let activities = (data as ActivityRow[] || []).map(mapRowToActivity);
  
  // If sorting by popular, manually sort to put featured items first
  if (sortOption === 'popular') {
    activities.sort((a, b) => {
      const aIsFeatured = a.tags.includes('featured') ? 1 : 0;
      const bIsFeatured = b.tags.includes('featured') ? 1 : 0;
      return bIsFeatured - aIsFeatured;
    });
  }
  
  return activities;
};

export const createActivity = async (activity: Omit<Activity, 'id' | 'lastUpdated'>): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      title: activity.title,
      image: activity.image,
      tags: activity.tags,
      price_range: activity.priceRange,
      location: activity.location,
      category_ids: activity.categoryIds,
      description: activity.description,
      date: activity.date,
      time: activity.time,
      map_link: activity.mapLink,
      contact_info: activity.contactInfo
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
  
  return mapRowToActivity(data as ActivityRow);
};

export const updateActivity = async (id: string, activity: Partial<Omit<Activity, 'id' | 'lastUpdated'>>): Promise<Activity> => {
  const updateData: any = {};
  
  if (activity.title) updateData.title = activity.title;
  if (activity.image) updateData.image = activity.image;
  if (activity.tags) updateData.tags = activity.tags;
  if (activity.priceRange) updateData.price_range = activity.priceRange;
  if (activity.location) updateData.location = activity.location;
  if (activity.categoryIds) updateData.category_ids = activity.categoryIds;
  if (activity.description) updateData.description = activity.description;
  if (activity.date) updateData.date = activity.date;
  if (activity.time) updateData.time = activity.time;
  if (activity.mapLink) updateData.map_link = activity.mapLink;
  if (activity.contactInfo) updateData.contact_info = activity.contactInfo;
  
  const { data, error } = await supabase
    .from('activities')
    .update(updateData)
    .eq('id', parseInt(id, 10))
    .select()
    .single();
  
  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
  
  return mapRowToActivity(data as ActivityRow);
};

export const deleteActivity = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', parseInt(id, 10));
  
  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

export const getFilteredActivities = async (
  categoryIds: string[] | null,
  quickFilterIds: string[] | null,
  searchQuery: string = '',
  sortOption: string = 'popular'
): Promise<Activity[]> => {
  // First get all activities with the specified sort option
  const activities = await fetchActivities(sortOption);
  
  let filtered = [...activities];
  
  if (categoryIds && categoryIds.length > 0) {
    filtered = filtered.filter(activity => 
      categoryIds.some(categoryId => activity.categoryIds.includes(categoryId))
    );
  }
  
  if (quickFilterIds && quickFilterIds.length > 0) {
    const today = new Date().toLocaleDateString();
    
    if (quickFilterIds.includes('free')) {
      filtered = filtered.filter(activity => activity.priceRange.toLowerCase().includes('free'));
    }
    
    if (quickFilterIds.includes('today')) {
      filtered = filtered.filter(activity => 
        activity.date === today || (activity.date && activity.date.toLowerCase().includes('today'))
      );
    }

    if (quickFilterIds.includes('creative')) {
      // Filter activities that have tag ID 3
      filtered = filtered.filter(activity => 
        activity.tags.includes('3')
      );
    }

    if (quickFilterIds.includes('solo')) {
      // Filter activities that have tag ID 4
      filtered = filtered.filter(activity => 
        activity.tags.includes('4')
      );
    }

    if (quickFilterIds.includes('plans')) {
      // Filter activities that have tag ID 5
      filtered = filtered.filter(activity => 
        activity.tags.includes('5')
      );
    }

    if (quickFilterIds.includes('mindful')) {
      // Filter activities that have tag ID 6
      filtered = filtered.filter(activity => 
        activity.tags.includes('6')
      );
    }
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

export const getActivityById = async (id: string): Promise<Activity | null> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', parseInt(id, 10))
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching activity by id:', error);
    throw error;
  }
  
  if (!data) return null;
  
  return mapRowToActivity(data as ActivityRow);
};

export async function getFilteredActivitiesBySection(sectionType: string, sortOption: string = 'popular'): Promise<Activity[]> {
  console.log('Fetching activities for section:', sectionType);
  
  let query = supabase.from("activities").select("*").eq("enabled", TRUE);
  
  // For "all" section, don't filter by section type
  if (sectionType !== 'all') {
    query = query.eq("section_type", sectionType);
  }
  
  // Apply sorting
  switch (sortOption) {
    case 'price_low_high':
      query = query.order('price_range', { ascending: true });
      break;
    case 'price_high_low':
      query = query.order('price_range', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
    default:
      // For popular, keeping default order or we could add a specific sort here
      break;
  }

  const { data, error } = await query;

  console.log('Response data:', data);

  if (error) {
    console.error('Error fetching section activities:', error);
    throw error;
  }
  
  return (data as ActivityRow[] || []).map(mapRowToActivity);
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data.map(category => ({
    id: category.id.toString(),
    name: category.name,
    emoji: '🔍', // Default emoji since database might not have this
    color: undefined // Default color
  }));
}


export const subscribeUser = async (contact: string): Promise<void> => {
  let email: string | null = null;
  let phone: string | null = null;

  if (contact.includes('@')) {
    email = contact;
  } else {
    phone = contact;
  }

  const { error } = await supabase
    .from('users')
    .insert([{ email, phone }]);

  if (error) {
    console.error('Error subscribing user:', error);
    throw error;
  }
};
