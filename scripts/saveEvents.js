/**
 * saveEvents.js
 * Saves extracted events to Supabase scraped_activities (admin staging queue).
 * Populates ALL fields: description, image, price, url, map_link, lat/lng, etc.
 *
 * Flow:
 *   1. Dedup check (name + venue + date in activities + scraped_activities)
 *   2. Resolve coordinates via Nominatim (free, no API key)
 *   3. Build map_link from coordinates
 *   4. Insert into scraped_activities with status=pending
 */

import { createClient } from '@supabase/supabase-js';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_DELAY_MS = 1200; // Nominatim rate limit: 1 req/sec

export function buildSupabaseClient(url, serviceRoleKey) {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// ─── Coordinates ─────────────────────────────────────────────────────────────

/**
 * Resolve lat/lng for a venue using Nominatim (OpenStreetMap).
 * Returns { lat, lng, mapLink } or null if not found.
 */
async function resolveCoordinates(mapQuery) {
  if (!mapQuery) return null;
  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', mapQuery);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'in');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'hapnin-bangalore-crawler/1.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.[0]) return null;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return { lat, lng, mapLink };
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Deduplication ───────────────────────────────────────────────────────────

async function isDuplicate(supabase, name, venue, date) {
  const normName  = name.toLowerCase().trim();
  const normVenue = venue.toLowerCase().trim().split(',')[0]; // first part only

  const { data: existing } = await supabase
    .from('activities')
    .select('id')
    .ilike('title', normName)
    .ilike('location', `%${normVenue}%`)
    .eq('date', date)
    .limit(1);
  if (existing?.length) return true;

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

// ─── Quality score ────────────────────────────────────────────────────────────

function computeQuality({ venue, date, description, price, url, coords }) {
  let score = 0;
  const venueLower = (venue ?? '').toLowerCase();
  if (venue && venueLower !== 'bangalore' && venueLower !== 'bengaluru') score += 20;
  if (date)                                                               score += 20;
  if (description && description.length > 80)                            score += 20;
  if (price)                                                              score += 20;
  if (url || coords)                                                      score += 20;
  return Math.min(score, 100);
}

// ─── Save single event ────────────────────────────────────────────────────────

export async function saveEvent(supabase, event) {
  const { name, venue, date, time, price, description, image, url, mapQuery, categoryId, source } = event;

  if (!date) return { saved: false, reason: 'no date' };

  const dup = await isDuplicate(supabase, name, venue, date);
  if (dup) return { saved: false, reason: 'duplicate' };

  // Resolve coordinates from venue name
  const coords = await resolveCoordinates(mapQuery);
  await sleep(NOMINATIM_DELAY_MS); // respect Nominatim rate limit

  const qualityScore = computeQuality({ venue, date, description, price, url, coords });

  const { error } = await supabase.from('scraped_activities').insert({
    title:         name,
    description:   description || '',
    image:         image || '',
    price_range:   price || null,
    location:      venue,
    date:          date,
    time:          time || null,
    map_link:      coords?.mapLink || null,
    latitude:      coords?.lat    || null,
    longitude:     coords?.lng    || null,
    url:           url            || null,
    category_ids:  [categoryId],
    tags:          [],
    section_type:  'all',
    source:        source,
    status:        'pending',
    quality_score: qualityScore,
    scraped_at:    new Date().toISOString(),
    created_at:    new Date().toISOString(),
    updated_at:    new Date().toISOString(),
  });

  if (error) throw new Error(`DB insert failed: ${error.message}`);
  return { saved: true, coords: !!coords };
}

// ─── Save all events ──────────────────────────────────────────────────────────

export async function saveAllEvents(events, supabaseUrl, serviceRoleKey) {
  const supabase = buildSupabaseClient(supabaseUrl, serviceRoleKey);
  let saved = 0, skipped = 0, errors = 0;

  for (const event of events) {
    try {
      const result = await saveEvent(supabase, event);
      if (result.saved) {
        saved++;
        const coordLabel = result.coords ? '📍' : '  ';
        console.log(`  ✅ ${coordLabel} Saved: "${event.name}" @ ${event.venue}`);
      } else {
        skipped++;
        console.log(`  ⏭️   Skipped: "${event.name}" (${result.reason})`);
      }
    } catch (err) {
      errors++;
      console.warn(`  ❌  Error saving "${event.name}": ${err.message}`);
    }
  }

  return { saved, skipped, errors };
}
