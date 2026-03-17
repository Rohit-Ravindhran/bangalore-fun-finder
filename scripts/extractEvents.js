/**
 * extractEvents.js
 * Uses OpenAI to extract fully-populated event objects from search text.
 * Filters to events happening within the next 7 days.
 */

import OpenAI from 'openai';

const CATEGORY_IDS = {
  comedy:   '5',
  music:    '3',
  art:      '2',
  tech:     '6',
  meetup:   '6',
  food:     '9',
  outdoor:  '1',
  sports:   '4',
  wellness: '7',
  party:    '8',
  kids:     '11',
  theatre:  '5',
  default:  '6',
};

// Curated Unsplash photos per category (permanent, stable URLs)
const CATEGORY_IMAGES = {
  comedy:   'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
  music:    'https://images.unsplash.com/photo-1501386761578-eaa54b4b5c57?w=800&q=80',
  art:      'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80',
  tech:     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  meetup:   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  food:     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  outdoor:  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
  sports:   'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  party:    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
  kids:     'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80',
  theatre:  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
  default:  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
};

// ─── Date window ──────────────────────────────────────────────────────────────

export function getDateWindow() {
  const today = new Date();
  const end   = new Date(today);
  end.setDate(today.getDate() + 7);
  return {
    today,
    end,
    todayStr: today.toISOString().slice(0, 10),   // YYYY-MM-DD
    endStr:   end.toISOString().slice(0, 10),
    todayLabel: today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    endLabel:   end.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** Returns true if the ISO date falls within today → today+7 */
function isWithinWindow(isoDate, window) {
  if (!isoDate) return true; // recurring / unknown date → keep (admin decides)
  const d = new Date(isoDate);
  return d >= window.today && d <= window.end;
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildSystemPrompt(window) {
  return `You are an event data extractor for Bangalore, India.
Today is ${window.todayLabel}. Extract ONLY events happening between ${window.todayLabel} and ${window.endLabel} (inclusive).
Ignore past events and events more than 7 days away.
Return ONLY a valid JSON array — no markdown, no explanation.

Each event object must have ALL of these fields:
- name: string — full event title
- venue: string — venue name + neighbourhood, e.g. "Humming Tree, Indiranagar"
- date: string — human readable, e.g. "Saturday, 22 March 2026" or "22-23 March 2026"
- iso_date: string — "YYYY-MM-DD" of the first/only date, or null if recurring/unknown
- time: string — e.g. "7:00 PM" or "7:00 PM – 10:00 PM", empty string if unknown
- price: string — e.g. "₹500 onwards" or "₹200 – ₹500" or "Free", empty string if unknown
- description: string — 2–3 engaging sentences about what the event is, who it's for, what to expect
- url: string — direct booking/event URL if mentioned, otherwise empty string
- map_query: string — venue name + "Bangalore", e.g. "Humming Tree Indiranagar Bangalore"
- category: string — one of: comedy, music, art, tech, meetup, food, outdoor, sports, wellness, party, kids, theatre

Rules:
- Only include Bangalore / Bengaluru events.
- Skip events with no name or no venue.
- description must be non-empty — synthesise from available context.
- Return [] if no events fall in the date window.`;
}

// ─── Extraction ───────────────────────────────────────────────────────────────

export async function extractEventsFromText({ query, text, source }, openaiClient, window) {
  if (!text?.trim()) return [];

  const userPrompt = `Search query: "${query}"\n\nSearch results:\n${text.slice(0, 4000)}`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    max_tokens: 3000,
    messages: [
      { role: 'system', content: buildSystemPrompt(window) },
      { role: 'user',   content: userPrompt },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '[]';

  let events;
  try {
    const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    events = JSON.parse(json);
    if (!Array.isArray(events)) events = [];
  } catch {
    console.warn(`  ⚠️  OpenAI returned non-JSON for "${query}":`, raw.slice(0, 100));
    return [];
  }

  return events
    .filter((e) => e.name && e.venue)
    .filter((e) => isWithinWindow(e.iso_date, window))   // ← hard date filter
    .map((e) => {
      const cat = String(e.category ?? '').toLowerCase();
      const normCat = CATEGORY_IDS[cat] ? cat : 'default';
      return {
        name:        String(e.name ?? '').trim(),
        venue:       String(e.venue ?? '').trim(),
        date:        String(e.date ?? '').trim(),
        isoDate:     e.iso_date || null,
        time:        String(e.time ?? '').trim(),
        price:       String(e.price ?? '').trim(),
        description: String(e.description ?? '').trim(),
        image:       CATEGORY_IMAGES[normCat],            // ← always set
        url:         String(e.url ?? '').trim(),
        mapQuery:    String(e.map_query ?? `${e.venue} Bangalore`).trim(),
        category:    normCat,
        categoryId:  CATEGORY_IDS[normCat],
        source:      String(source ?? 'google-crawler'),
      };
    });
}

export async function extractAllEvents(crawlResults, apiKey) {
  const client = new OpenAI({ apiKey });
  const window = getDateWindow();
  const allEvents = [];

  console.log(`  📅 Date window: ${window.todayStr} → ${window.endStr}`);

  for (const result of crawlResults) {
    try {
      console.log(`  🤖 Extracting from: "${result.query}"`);
      const events = await extractEventsFromText(result, client, window);
      console.log(`     ↳ Found ${events.length} events in window`);
      allEvents.push(...events);
    } catch (err) {
      console.warn(`  ⚠️  Extraction failed for "${result.query}": ${err.message}`);
    }
  }

  return allEvents;
}
