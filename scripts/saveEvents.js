/**
 * saveEvents.js
 * Saves extracted events to Supabase scraped_activities (staging table).
 * Uses service role key — bypasses RLS for server-side writes.
 *
 * Deduplication: skips insert if name + venue + date already exists
 * in scraped_activities (any status) or in activities (already published).
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Build a Supabase client with the service role key.
 * Service role bypasses all RLS — only use server-side.
 */
export function buildSupabaseClient(url, serviceRoleKey) {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Check if an event already exists (dedup guard).
 * Matches on normalised name + venue + date in both tables.
 */
async function isDuplicate(supabase, name, venue, date) {
  const normName  = name.toLowerCase().trim();
  const normVenue = venue.toLowerCase().trim();

  // Check published activities
  const { data: existing } = await supabase
    .from('activities')
    .select('id')
    .ilike('title', normName)
    .ilike('location', `%${normVenue}%`)
    .eq('date', date)
    .limit(1);

  if (existing?.length) return true;

  // Check staging queue
  const { data: staged } = await supabase
    .from('scraped_activities')
    .select('id')
    .ilike('title', normName)
    .ilike('location', `%${normVenue}%`)
    .eq('date', date)
    .in('status', ['pending', 'approved'])
    .limit(1);

  return !!staged?.length;
}

/**
 * Save a single event to scraped_activities.
 * Returns { saved: boolean, reason?: string }
 */
export async function saveEvent(supabase, event) {
  const { name, venue, date, time, price, categoryId, description, source } = event;

  // Skip if no date (too vague for dedup / usefulness)
  if (!date) return { saved: false, reason: 'no date' };

  const dup = await isDuplicate(supabase, name, venue, date);
  if (dup) return { saved: false, reason: 'duplicate' };

  const qualityScore = computeQuality({ name, venue, date, description, price });

  const { error } = await supabase.from('scraped_activities').insert({
    title:        name,
    description:  description || '',
    location:     venue,
    date:         date,
    time:         time || null,
    price_range:  price || null,
    category_ids: [categoryId],
    tags:         [],
    section_type: 'all',
    source:       source,
    status:       'pending',
    quality_score: qualityScore,
    scraped_at:   new Date().toISOString(),
    created_at:   new Date().toISOString(),
    updated_at:   new Date().toISOString(),
  });

  if (error) throw new Error(`DB insert failed: ${error.message}`);
  return { saved: true };
}

/**
 * Save all events, collecting per-event results.
 * Returns { saved, skipped, errors }
 */
export async function saveAllEvents(events, supabaseUrl, serviceRoleKey) {
  const supabase = buildSupabaseClient(supabaseUrl, serviceRoleKey);
  let saved = 0, skipped = 0, errors = 0;

  for (const event of events) {
    try {
      const result = await saveEvent(supabase, event);
      if (result.saved) {
        saved++;
        console.log(`  ✅ Saved: "${event.name}" @ ${event.venue}`);
      } else {
        skipped++;
        console.log(`  ⏭️  Skipped: "${event.name}" (${result.reason})`);
      }
    } catch (err) {
      errors++;
      console.warn(`  ❌ Error saving "${event.name}": ${err.message}`);
    }
  }

  return { saved, skipped, errors };
}

// ─── Quality score (mirrors DB function logic) ───────────────────────────────
function computeQuality({ name, venue, date, description, price }) {
  let score = 0;
  if (venue && venue !== 'Bangalore' && venue !== 'Bengaluru') score += 20;
  if (date)                                                     score += 20;
  if (description && description.length > 50)                   score += 20;
  if (price)                                                     score += 20;
  // name always present (required), give partial credit for detail
  if (name && name.length > 15)                                  score += 20;
  return Math.min(score, 100);
}
