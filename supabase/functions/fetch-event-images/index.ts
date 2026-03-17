// Supabase Edge Function: fetch-event-images
// Gets event-specific images using a 3-tier strategy:
//   1. ScrapingBee Google Image search for the event title (most specific)
//   2. OG image extracted from the event's own URL (if available)
//   3. Pexels category-based fallback
//
// Setup:
//   supabase secrets set SCRAPINGBEE_API_KEY=...  (already set)
//   supabase secrets set PEXELS_API_KEY=...       (optional fallback)
//   supabase functions deploy fetch-event-images

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SCRAPINGBEE_BASE   = 'https://app.scrapingbee.com/api/v1';
const SCRAPINGBEE_GOOGLE = 'https://app.scrapingbee.com/api/v1/store/google';
const PEXELS_API         = 'https://api.pexels.com/v1/search';

// ─── Category fallback images (Pexels tier) ───────────────────────────────────
const CATEGORY_QUERY: Record<string, string> = {
  comedy:   'stand-up comedy show stage spotlight',
  music:    'live music concert band stage',
  art:      'art exhibition gallery painting',
  tech:     'technology conference hackathon',
  meetup:   'people networking event gathering',
  food:     'food festival street food india',
  outdoor:  'outdoor adventure trekking bangalore',
  sports:   'sports event stadium crowd',
  wellness: 'yoga wellness meditation class',
  party:    'party celebration nightlife dance',
  kids:     'children festival activities fun',
  theatre:  'theatre stage performance drama',
};

// ─── Tier 1: ScrapingBee Google Image Search ─────────────────────────────────

async function fetchGoogleImage(title: string, apiKey: string): Promise<string | null> {
  try {
    const query = title
      .replace(/[|–—:]/g, ' ')
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .trim()
      .slice(0, 60);

    const url = new URL(SCRAPINGBEE_GOOGLE);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('search', `${query} bangalore event`);
    url.searchParams.set('search_type', 'images');
    url.searchParams.set('nb_results', '5');

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;

    const data = await res.json();
    const results: Array<{ original?: string; image?: string }> = data?.image_results ?? [];

    // Pick the first result with an https image URL (skip SVGs, tiny thumbs)
    for (const r of results) {
      const img = r.original ?? r.image ?? '';
      if (img.startsWith('https') && !img.endsWith('.svg')) return img;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Tier 2: OG image from event URL ─────────────────────────────────────────

async function fetchOgImage(eventUrl: string, apiKey: string): Promise<string | null> {
  if (!eventUrl) return null;
  // Skip known domains that block scraping anyway
  if (eventUrl.includes('instagram.com') || eventUrl.includes('facebook.com')) return null;

  try {
    const url = new URL(SCRAPINGBEE_BASE);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('url', eventUrl);
    url.searchParams.set('render_js', 'false');
    url.searchParams.set('extract_rules', JSON.stringify({
      og_image: "meta[property='og:image']@content",
      twitter_image: "meta[name='twitter:image']@content",
    }));

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.og_image || data?.twitter_image || null;
  } catch {
    return null;
  }
}

// ─── Tier 3: Pexels fallback ─────────────────────────────────────────────────

async function fetchPexelsImage(
  title: string,
  categoryIds: string[],
  apiKey: string
): Promise<string | null> {
  if (!apiKey) return null;
  try {
    const catMap: Record<string, string> = {
      '1': 'outdoor', '2': 'art', '3': 'music', '4': 'sports',
      '5': 'comedy', '6': 'tech', '7': 'wellness', '8': 'party',
      '9': 'food', '11': 'kids',
    };
    const catName = categoryIds?.[0] ? catMap[categoryIds[0]] : null;
    const fallbackQuery = catName ? CATEGORY_QUERY[catName] : `${title} event india`;

    const url = new URL(PEXELS_API);
    url.searchParams.set('query', fallbackQuery ?? `${title} event`);
    url.searchParams.set('per_page', '1');
    url.searchParams.set('orientation', 'landscape');

    const res = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.photos?.[0]?.src?.large2x
        || data?.photos?.[0]?.src?.large
        || null;
  } catch {
    return null;
  }
}

// ─── Main image resolver ──────────────────────────────────────────────────────

async function resolveImage(
  row: { id: number; title: string; url?: string; category_ids?: string[] },
  scrapingBeeKey: string,
  pexelsKey: string
): Promise<{ url: string | null; tier: string }> {
  // Tier 1: Google Image Search — event-specific
  const googleImg = await fetchGoogleImage(row.title, scrapingBeeKey);
  if (googleImg) return { url: googleImg, tier: 'google-images' };

  // Tier 2: OG image from event URL (if available and not empty)
  if (row.url) {
    const ogImg = await fetchOgImage(row.url, scrapingBeeKey);
    if (ogImg) return { url: ogImg, tier: 'og-image' };
  }

  // Tier 3: Pexels category fallback
  if (pexelsKey) {
    const pexelsImg = await fetchPexelsImage(row.title, row.category_ids ?? [], pexelsKey);
    if (pexelsImg) return { url: pexelsImg, tier: 'pexels' };
  }

  return { url: null, tier: 'none' };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const respond = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const SCRAPINGBEE_KEY = Deno.env.get('SCRAPINGBEE_API_KEY') ?? '';
    const PEXELS_KEY      = Deno.env.get('PEXELS_API_KEY')      ?? '';
    const SUPABASE_URL    = Deno.env.get('SUPABASE_URL')         ?? '';
    const ROLE_KEY        = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!SCRAPINGBEE_KEY) return respond({ error: 'SCRAPINGBEE_API_KEY not set' }, 500);

    const body = await req.json().catch(() => ({}));
    const { ids, fetch_all_missing, limit = 50 } =
      body as { ids?: number[]; fetch_all_missing?: boolean; limit?: number };

    const supabase = createClient(SUPABASE_URL, ROLE_KEY, { auth: { persistSession: false } });

    // Fetch rows
    let rows: Array<{ id: number; title: string; url: string | null; category_ids: string[] }> = [];

    if (ids?.length) {
      const { data } = await supabase
        .from('scraped_activities')
        .select('id, title, url, category_ids')
        .in('id', ids);
      rows = data ?? [];
    } else if (fetch_all_missing) {
      const { data } = await supabase
        .from('scraped_activities')
        .select('id, title, url, category_ids')
        .or('image.is.null,image.eq.')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(limit);
      rows = data ?? [];
    } else {
      return respond({ error: 'Provide ids[] or fetch_all_missing: true' }, 400);
    }

    if (!rows.length) return respond({ updated: 0, failed: 0, total: 0, message: 'Nothing to process' });

    let updated = 0, failed = 0;
    const results: Array<{ id: number; tier?: string; error?: string }> = [];

    for (const row of rows) {
      try {
        const { url: imageUrl, tier } = await resolveImage(row, SCRAPINGBEE_KEY, PEXELS_KEY);

        if (imageUrl) {
          const { error } = await supabase
            .from('scraped_activities')
            .update({ image: imageUrl, updated_at: new Date().toISOString() })
            .eq('id', row.id);

          if (error) throw new Error(error.message);
          updated++;
          results.push({ id: row.id, tier });
        } else {
          failed++;
          results.push({ id: row.id, error: 'No image found from any source' });
        }

        // Respect ScrapingBee rate limits (~1 Google search = 5 credits)
        await sleep(600);
      } catch (err: unknown) {
        failed++;
        results.push({ id: row.id, error: (err as Error).message });
      }
    }

    return respond({ success: true, updated, failed, total: rows.length, results });
  } catch (err: unknown) {
    return respond({ error: (err as Error).message }, 500);
  }
});
