
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/components/ActivityCard';

// Type that represents what our database actually has
type ActivityRow = {
  id: string | number; // Could be UUID or number
  title: string;
  image: string;
  tags: string[];
  price_range: string;
  location: string;
  description: string;
  category_ids: string[];
  date?: string;
  time?: string;
  map_link?: string;
  contact_info?: string;
  created_at: string;
  updated_at?: string;
};

// Helper function to convert database row to our Activity type
const mapRowToActivity = (row: any): Activity => ({
  id: row.id.toString(),
  title: row.title,
  image: row.image,
  tags: row.tags || [],
  priceRange: row.price_range,
  location: row.location,
  lastUpdated: new Date(row.updated_at || row.created_at).toLocaleDateString(),
  categoryIds: row.category_ids || [],
  description: row.description,
  date: row.date,
  time: row.time,
  mapLink: row.map_link,
  contactInfo: row.contact_info
});

export const fetchActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*');
  
  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  
  // Transform the data to match our Activity type
  return (data || []).map(mapRowToActivity);
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
  
  return mapRowToActivity(data);
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
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
  
  return mapRowToActivity(data);
};

export const deleteActivity = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

export const getFilteredActivities = async (
  categoryIds: string[] | null,
  quickFilterIds: string[] | null,
  searchQuery: string = ''
): Promise<Activity[]> => {
  // First get all activities
  const activities = await fetchActivities();
  
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
    
    // Add more quick filter handlers as needed
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
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching activity by id:', error);
    throw error;
  }
  
  if (!data) return null;
  
  return mapRowToActivity(data);
};
