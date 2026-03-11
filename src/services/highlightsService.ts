import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Highlight = Database['public']['Tables']['highlights']['Row'];
export type HighlightInsert = Database['public']['Tables']['highlights']['Insert'];
export type HighlightUpdate = Database['public']['Tables']['highlights']['Update'];

// Fetch all active highlights ordered by display_order
export const fetchActiveHighlights = async (): Promise<Highlight[]> => {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching highlights:', error);
    throw error;
  }

  return data || [];
};

// Fetch all highlights (for admin)
export const fetchAllHighlights = async (): Promise<Highlight[]> => {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all highlights:', error);
    throw error;
  }

  return data || [];
};

// Create a new highlight
export const createHighlight = async (
  highlight: HighlightInsert
): Promise<{ data: Highlight | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('highlights')
      .insert(highlight)
      .select()
      .single();

    if (error) {
      console.error('Error creating highlight:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error creating highlight:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Update a highlight
export const updateHighlight = async (
  id: number,
  updates: HighlightUpdate
): Promise<{ data: Highlight | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('highlights')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating highlight:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error updating highlight:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Delete a highlight
export const deleteHighlight = async (
  id: number
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting highlight:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting highlight:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Update display order for multiple highlights (reordering)
export const updateHighlightsOrder = async (
  updates: { id: number; display_order: number }[]
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Update each highlight's display_order
    for (const update of updates) {
      const { error } = await supabase
        .from('highlights')
        .update({ display_order: update.display_order })
        .eq('id', update.id);

      if (error) {
        console.error('Error updating highlight order:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error updating highlights order:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Toggle highlight active status
export const toggleHighlightActive = async (
  id: number,
  isActive: boolean
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('highlights')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling highlight status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error toggling highlight status:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
