/**
 * extractEvents.js
 * Uses OpenAI to convert raw search text into structured event objects.
 *
 * Input:  { query, text, source }
 * Output: array of { name, venue, date, time, price, category, description, source }
 */

import OpenAI from 'openai';

// Category mapping — kept in sync with the app's category IDs
const CATEGORIES = {
  comedy:     '5',
  music:      '3',
  art:        '2',
  tech:       '3',
  meetup:     '3',
  food:       '9',
  outdoor:    '1',
  sports:     '4',
  wellness:   '7',
  party:      '8',
  kids:       '11',
  theatre:    '5',
  default:    '6',
};

const SYSTEM_PROMPT = `You are an event data extractor for Bangalore, India.
Extract events from the text provided and return ONLY a JSON array.
Each event object must have these fields:
- name: string (event title, concise)
- venue: string (venue name + neighborhood if known, e.g. "Humming Tree, Indiranagar")
- date: string (human readable, e.g. "Saturday, 22 March 2026" or "Every Saturday")
- time: string (e.g. "7:00 PM" or "7:00 PM - 10:00 PM", empty string if unknown)
- price: string (e.g. "₹500" or "Free" or empty string if unknown)
- category: string (one of: comedy, music, art, tech, meetup, food, outdoor, sports, wellness, party, kids, theatre)
- description: string (1-2 sentence summary, empty string if nothing useful)
- source: string (pass through from input, do not change)

Rules:
- Only include events in Bangalore / Bengaluru.
- Skip events with no name or no venue.
- If date is vague (e.g. "this weekend") keep as-is; do NOT make up specific dates.
- Return [] if no valid events are found.
- Return ONLY the JSON array, no markdown, no explanation.`;

/**
 * Extract events from a single crawl result.
 * Returns an array of structured event objects (may be empty).
 */
export async function extractEventsFromText({ query, text, source }, openaiClient) {
  if (!text?.trim()) return [];

  const userPrompt = `Query: "${query}"\nSource: ${source}\n\nText:\n${text.slice(0, 4000)}`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    max_tokens: 2000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '[]';

  let events;
  try {
    // Strip possible markdown code fences
    const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    events = JSON.parse(json);
    if (!Array.isArray(events)) events = [];
  } catch {
    console.warn(`  ⚠️  OpenAI returned non-JSON for query "${query}":`, raw.slice(0, 100));
    return [];
  }

  // Attach category ID and enforce required fields
  return events
    .filter((e) => e.name && e.venue)
    .map((e) => ({
      name:        String(e.name ?? '').trim(),
      venue:       String(e.venue ?? '').trim(),
      date:        String(e.date ?? '').trim(),
      time:        String(e.time ?? '').trim(),
      price:       String(e.price ?? '').trim(),
      category:    String(e.category ?? 'default').toLowerCase(),
      categoryId:  CATEGORIES[e.category?.toLowerCase()] ?? CATEGORIES.default,
      description: String(e.description ?? '').trim(),
      source:      String(source ?? 'google-crawler'),
    }));
}

/**
 * Extract events from all crawl results.
 * Returns a flat, deduplicated-by-identity array of events.
 */
export async function extractAllEvents(crawlResults, apiKey) {
  const client = new OpenAI({ apiKey });
  const allEvents = [];

  for (const result of crawlResults) {
    try {
      console.log(`  🤖 Extracting from: "${result.query}"`);
      const events = await extractEventsFromText(result, client);
      console.log(`     ↳ Found ${events.length} events`);
      allEvents.push(...events);
    } catch (err) {
      console.warn(`  ⚠️  Extraction failed for "${result.query}": ${err.message}`);
    }
  }

  return allEvents;
}
