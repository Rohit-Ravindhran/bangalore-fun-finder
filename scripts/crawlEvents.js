/**
 * crawlEvents.js  —  Main crawler entry point
 *
 * Usage:
 *   node scripts/crawlEvents.js
 *   node scripts/crawlEvents.js --dry-run      # extract only, don't save
 *   node scripts/crawlEvents.js --query "bangalore jazz"  # single query
 *
 * Requires .env.local (or environment variables):
 *   SCRAPINGBEE_API_KEY
 *   OPENAI_API_KEY
 *   SUPABASE_URL  (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { crawlAllQueries, QUERIES } from './googleCrawler.js';
import { extractAllEvents } from './extractEvents.js';
import { saveAllEvents } from './saveEvents.js';

// Load .env.local from project root
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') }); // fallback

// ─── Config ───────────────────────────────────────────────────────────────────

const SCRAPINGBEE_API_KEY    = process.env.SCRAPINGBEE_API_KEY;
const OPENAI_API_KEY         = process.env.OPENAI_API_KEY;
const SUPABASE_URL           = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function validateEnv() {
  const missing = [];
  if (!SCRAPINGBEE_API_KEY)       missing.push('SCRAPINGBEE_API_KEY');
  if (!OPENAI_API_KEY)            missing.push('OPENAI_API_KEY');
  if (!SUPABASE_URL)              missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (missing.length) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('   Add them to .env.local or set them in your environment.');
    process.exit(1);
  }
}

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun   = args.includes('--dry-run');
const queryArg   = args.find((a) => a.startsWith('--query='))?.split('=').slice(1).join('=')
                || (args.indexOf('--query') >= 0 ? args[args.indexOf('--query') + 1] : null);
const queries    = queryArg ? [queryArg] : QUERIES;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║    Happ\'nin Bangalore — Event Crawler        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  Started:  ${new Date().toISOString()}`);
  console.log(`  Queries:  ${queries.length}`);
  console.log(`  Dry run:  ${isDryRun}`);
  console.log('');

  validateEnv();

  // ── Step 1: Crawl ──────────────────────────────────────────────────────────
  console.log('── Step 1/3: Crawling Google via ScrapingBee ─────────────────');
  const crawlResults = await crawlAllQueries(SCRAPINGBEE_API_KEY, queries);
  const successfulCrawls = crawlResults.filter((r) => r.text);
  console.log(`  Done: ${successfulCrawls.length}/${queries.length} queries returned text\n`);

  if (!successfulCrawls.length) {
    console.error('❌ No results from crawl. Check SCRAPINGBEE_API_KEY and quota.');
    process.exit(1);
  }

  // ── Step 2: Extract ────────────────────────────────────────────────────────
  console.log('── Step 2/3: Extracting events via OpenAI ────────────────────');
  const events = await extractAllEvents(successfulCrawls, OPENAI_API_KEY);
  console.log(`  Done: ${events.length} events extracted\n`);

  if (!events.length) {
    console.log('ℹ️  No events extracted. Nothing to save.');
    printSummary({ crawled: successfulCrawls.length, extracted: 0, saved: 0, skipped: 0, errors: 0 });
    return;
  }

  // Log sample
  console.log('  Sample events:');
  events.slice(0, 3).forEach((e) =>
    console.log(`    • ${e.name} @ ${e.venue} — ${e.date || 'date TBD'}`)
  );
  if (events.length > 3) console.log(`    … and ${events.length - 3} more`);
  console.log('');

  // ── Step 3: Save ───────────────────────────────────────────────────────────
  if (isDryRun) {
    console.log('── Step 3/3: Dry run — skipping save ─────────────────────────');
    console.log('  All extracted events:');
    events.forEach((e) =>
      console.log(`    • ${e.name} @ ${e.venue} | ${e.date} | ${e.category}`)
    );
  } else {
    console.log('── Step 3/3: Saving to Supabase ──────────────────────────────');
    const { saved, skipped, errors } = await saveAllEvents(
      events,
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    printSummary({ crawled: successfulCrawls.length, extracted: events.length, saved, skipped, errors });
  }
}

function printSummary({ crawled, extracted, saved, skipped, errors }) {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Run Summary                                 ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Queries crawled:   ${String(crawled).padEnd(24)}║`);
  console.log(`║  Events extracted:  ${String(extracted).padEnd(24)}║`);
  console.log(`║  Saved to queue:    ${String(saved).padEnd(24)}║`);
  console.log(`║  Skipped (dedup):   ${String(skipped).padEnd(24)}║`);
  console.log(`║  Errors:            ${String(errors).padEnd(24)}║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  Finished: ${new Date().toISOString()}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
