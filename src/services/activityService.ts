
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
};

// Helper function to convert database row to our Activity type
const mapRowToActivity = (row: ActivityRow): Activity => ({
  id: row.id.toString(),
  title: row.title || 'Untitled Activity',
  image: row.image || '/placeholder.svg',
  tags: row.tags || [],
  priceRange: row.price_range || 'Free',
  location: row.location || 'Bangalore',
  lastUpdated: new Date(row.updated_at || row.created_at).toLocaleDateString(),
  categoryIds: row.category_ids || [],
  description: row.description || '',
  date: row.date || undefined,
  time: row.time || undefined,
  mapLink: row.map_link || undefined,
  contactInfo: row.contact_info || undefined
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
    .eq('id', parseInt(id))
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
    .eq('id', parseInt(id));
  
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
    .eq('id', parseInt(id))
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching activity by id:', error);
    throw error;
  }
  
  if (!data) return null;
  
  return mapRowToActivity(data as ActivityRow);
};


export async function getFilteredActivitiesBySection(sectionType: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("section_type", sectionType)
    .order("date", { ascending: true });

    console.log('data',data);
  if (error) throw error;
  return (data || []).map(mapRowToActivity);
}