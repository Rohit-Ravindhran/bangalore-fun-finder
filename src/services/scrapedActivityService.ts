import { supabase } from '@/integrations/supabase/client';

export interface ScrapedActivity {
  id: number;
  title: string;
  description: string;
  image: string | null;
  price_range: string | null;
  location: string;
  date: string | null;
  time: string | null;
  map_link: string | null;
  contact_info: string;
  url: string | null;
  category_ids: string[];
  tags: string[];
  section_type: string;
  latitude: number | null;
  longitude: number | null;
  source: string;
  status: 'pending' | 'approved' | 'rejected' | 'duplicate';
  quality_score: number;
  duplicate_of: number | null;
  scraped_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewed_by_name?: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaveScrapedActivityInput {
  title: string;
  description?: string;
  image?: string;
  priceRange?: string;
  location?: string;
  date?: string;
  time?: string;
  mapLink?: string;
  contactInfo?: string;
  url?: string;
  categoryIds?: string[];
  tags?: string[];
  sectionType?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
}

export async function saveScrapedActivity(
  data: SaveScrapedActivityInput,
  adminId?: string
): Promise<{ error?: string; scrapedActivityId?: number; status?: string; qualityScore?: number }> {
  if (!adminId) return { error: 'Admin session required' };

  const { data: result, error } = await (supabase as any).rpc('admin_save_scraped_activity', {
    p_admin_id:     adminId,
    p_title:        data.title,
    p_description:  data.description  ?? null,
    p_image:        data.image        ?? null,
    p_price_range:  data.priceRange   ?? null,
    p_location:     data.location     ?? null,
    p_date:         data.date         ?? null,
    p_time:         data.time         ?? null,
    p_map_link:     data.mapLink      ?? null,
    p_contact_info: data.contactInfo  ?? null,
    p_url:          data.url          ?? null,
    p_category_ids: data.categoryIds  ?? [],
    p_tags:         data.tags         ?? [],
    p_section_type: data.sectionType  ?? 'all',
    p_latitude:     data.latitude     ?? null,
    p_longitude:    data.longitude    ?? null,
    p_source:       data.source       ?? 'manual',
  });

  if (error) return { error: error.message };
  if (!result?.success) return { error: result?.message ?? 'Save failed' };

  return {
    scrapedActivityId: result.scraped_activity_id,
    status:            result.status,
    qualityScore:      result.quality_score,
  };
}

export async function listScrapedActivities(
  adminId: string,
  filters: { status?: string; source?: string; sort?: string; scrapedSince?: string } = {},
  pagination: { limit?: number; offset?: number } = {}
): Promise<{ data: ScrapedActivity[]; total: number; error?: string }> {
  const { data: result, error } = await (supabase as any).rpc('admin_list_scraped_activities', {
    p_admin_id:      adminId,
    p_status:        filters.status       ?? null,
    p_source:        filters.source       ?? null,
    p_sort:          filters.sort         ?? 'newest',
    p_scraped_since: filters.scrapedSince ?? null,
    p_limit:         pagination.limit     ?? 50,
    p_offset:        pagination.offset    ?? 0,
  });

  if (error) return { data: [], total: 0, error: error.message };
  if (!result?.success) return { data: [], total: 0, error: result?.message };

  return { data: result.data ?? [], total: result.total ?? 0 };
}

export async function approveScrapedActivity(
  adminId: string,
  scrapedId: number,
  overrides?: Partial<{
    title: string; description: string; image: string;
    priceRange: string; location: string; date: string; time: string;
    mapLink: string; contactInfo: string; url: string;
    categoryIds: string[]; tags: string[]; sectionType: string;
    latitude: number; longitude: number;
  }>
): Promise<{ error?: string; activityId?: number }> {
  const { data: result, error } = await (supabase as any).rpc('admin_approve_scraped_activity', {
    p_admin_id:     adminId,
    p_scraped_id:   scrapedId,
    p_title:        overrides?.title        ?? null,
    p_description:  overrides?.description  ?? null,
    p_image:        overrides?.image        ?? null,
    p_price_range:  overrides?.priceRange   ?? null,
    p_location:     overrides?.location     ?? null,
    p_date:         overrides?.date         ?? null,
    p_time:         overrides?.time         ?? null,
    p_map_link:     overrides?.mapLink      ?? null,
    p_contact_info: overrides?.contactInfo  ?? null,
    p_url:          overrides?.url          ?? null,
    p_category_ids: overrides?.categoryIds  ?? null,
    p_tags:         overrides?.tags         ?? null,
    p_section_type: overrides?.sectionType  ?? null,
    p_latitude:     overrides?.latitude     ?? null,
    p_longitude:    overrides?.longitude    ?? null,
  });

  if (error) return { error: error.message };
  if (!result?.success) return { error: result?.message };
  return { activityId: result.activity_id };
}

export async function rejectScrapedActivity(
  adminId: string,
  scrapedId: number,
  notes?: string
): Promise<{ error?: string }> {
  const { data: result, error } = await (supabase as any).rpc('admin_reject_scraped_activity', {
    p_admin_id:   adminId,
    p_scraped_id: scrapedId,
    p_notes:      notes ?? null,
  });

  if (error) return { error: error.message };
  if (!result?.success) return { error: result?.message };
  return {};
}

export async function updateScrapedActivity(
  adminId: string,
  scrapedId: number,
  data: Partial<SaveScrapedActivityInput>
): Promise<{ error?: string }> {
  const { data: result, error } = await (supabase as any).rpc('admin_update_scraped_activity', {
    p_admin_id:     adminId,
    p_scraped_id:   scrapedId,
    p_title:        data.title        ?? null,
    p_description:  data.description  ?? null,
    p_image:        data.image        ?? null,
    p_price_range:  data.priceRange   ?? null,
    p_location:     data.location     ?? null,
    p_date:         data.date         ?? null,
    p_time:         data.time         ?? null,
    p_map_link:     data.mapLink      ?? null,
    p_contact_info: data.contactInfo  ?? null,
    p_url:          data.url          ?? null,
    p_category_ids: data.categoryIds  ?? null,
    p_tags:         data.tags         ?? null,
    p_section_type: data.sectionType  ?? null,
    p_latitude:     data.latitude     ?? null,
    p_longitude:    data.longitude    ?? null,
  });

  if (error) return { error: error.message };
  if (!result?.success) return { error: result?.message };
  return {};
}
