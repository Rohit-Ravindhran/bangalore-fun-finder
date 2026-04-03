import { supabase } from '@/integrations/supabase/client';

export interface TrendingActivity {
  trending_id: number;
  display_order: number;
  added_at: string;
  activity_id: number;
  title: string;
  image: string;
  location: string;
  price_range: string;
  date: string;
  url: string;
}

export async function listTrending(): Promise<{ data: TrendingActivity[]; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('admin_list_trending');
    if (error) throw error;
    return { data: (data as TrendingActivity[]) || [], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to load trending' };
  }
}

export async function addTrending(
  activityId: number | string,
  adminId: string,
  order = 0
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc('admin_add_trending', {
      p_activity_id: Number(activityId),
      p_admin_id: adminId,
      p_order: order,
    });
    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add to trending' };
  }
}

export async function removeTrending(
  activityId: number | string,
  adminId: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc('admin_remove_trending', {
      p_activity_id: Number(activityId),
      p_admin_id: adminId,
    });
    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to remove from trending' };
  }
}
