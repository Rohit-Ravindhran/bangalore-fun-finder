/**
 * googleCrawler.js
 * Queries Google via ScrapingBee and returns event-rich text per query.
 * Extracts AI overview when available, falls back to top organic snippets.
 *
 * Supports adding extra sources later (Eventbrite, Meetup, etc.) by
 * exporting additional crawl functions from this file.
 */

const SCRAPINGBEE_GOOGLE_URL = 'https://app.scrapingbee.com/api/v1/store/google';

/** Queries sent to Google. Add/remove freely. */
export const QUERIES = [
  'bangalore events this weekend',
  'bangalore comedy shows',
  'bangalore live music this week',
  'bangalore art exhibition',
  'bangalore tech meetup',
  'bangalore food festival',
  'bangalore outdoor activities',
  'bangalore open mic night',
];

/**
 * Fetch one Google query via ScrapingBee.
 * Returns { query, text, results[] } where `text` is the best extractable
 * free-text for OpenAI to parse.
 */
export async function crawlQuery(query, apiKey) {
  const url = new URL(SCRAPINGBEE_GOOGLE_URL);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('search_query', query);
  url.searchParams.set('nb_results', '10');
  // ai_overview: ScrapingBee will return Google's AI overview text when present
  url.searchParams.set('ai_overview', 'true');

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(30_000) });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ScrapingBee ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();

  // Prefer Google's AI overview — richest, most concise source
  const aiOverview = data?.ai_overview?.trim();

  // Combine organic result snippets as fallback
  const organicText = (data?.organic_results ?? [])
    .slice(0, 8)
    .map((r) => [r.title, r.snippet].filter(Boolean).join(' — '))
    .join('\n');

  const text = aiOverview || organicText;

  return {
    query,
    text,
    source: 'google-crawler',
    rawResultCount: (data?.organic_results ?? []).length,
  };
}

/**
 * Crawl all configured queries sequentially.
 * Sequential (not parallel) to respect ScrapingBee rate limits on free tier.
 * Returns array of { query, text, source }.
 */
export async function crawlAllQueries(apiKey, queries = QUERIES) {
  const results = [];

  for (const query of queries) {
    try {
      console.log(`  🔍 Searching: "${query}"`);
      const result = await crawlQuery(query, apiKey);
      console.log(`     ↳ Got ${result.rawResultCount} results, AI overview: ${!!result.text}`);
      results.push(result);
    } catch (err) {
      console.warn(`  ⚠️  Query failed ("${query}"): ${err.message}`);
    }
    // Small delay between requests
    await sleep(1500);
  }

  return results;
}

// ─── Future source stubs ─────────────────────────────────────────────────────
// Uncomment + implement when ready:
//
// export async function crawlEventbrite(apiKey) { ... }
// export async function crawlMeetup(apiKey) { ... }
// export async function crawlInstagram(sessionCookie) { ... }

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
