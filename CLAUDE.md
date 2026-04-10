# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run crawl        # Run event crawler (writes to Supabase)
npm run crawl:dry    # Dry-run crawl (no writes)
```

There is no test suite configured in this project.

## Environment Setup

Copy `.env.example` to `.env` and populate:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Note: `.env.example` uses `VITE_` prefixes (legacy), but the actual client at `src/integrations/supabase/client.ts` expects `NEXT_PUBLIC_` prefixes.

## Architecture

**Framework**: Next.js 15 App Router with ISR (Incremental Static Regeneration). All pages under `src/app/` follow the Next.js file-based routing convention.

**Page / View separation**: App Router pages (`src/app/**/page.tsx`) are thin server components that fetch initial data and hand it off to view components in `src/views/`. Views are `'use client'` components that own all interactivity and React Query subscriptions.

**Data layer**:
- `src/integrations/supabase/client.ts` — typed Supabase client; always import from here
- `src/services/activityService.ts` — all CRUD for activities and categories; wraps Supabase calls, validates with Zod, transforms snake_case DB columns to camelCase `Activity` type
- `src/services/trendingService.ts`, `highlightsService.ts`, `scrapedActivityService.ts` — supplementary services
- Admin mutations go through Supabase RPC functions (`admin_create_activity`, `admin_update_activity`, `admin_delete_activity`, `verify_admin_credentials`) — direct table writes will fail due to RLS policies

**Caching**: React Query (`@tanstack/react-query`) with a 5-minute stale time and 30-minute GC time. Cache keys are managed in `src/hooks/useActivities.ts` (`activityKeys`). ISR seeds the initial React Query cache via `initialActivities`/`initialCategories` props passed from server pages.

**Auth**: Custom session-based admin auth in `src/contexts/AuthContext.tsx`. Sessions stored in `localStorage` (base64 encoded, 8-hour TTL). Rate limiting via `sessionStorage`. No Supabase Auth — credentials are verified via the `verify_admin_credentials` RPC. Use `useAuth()` hook and wrap admin pages with `<ProtectedRoute>`.

**UI components**: shadcn/ui primitives live in `src/components/ui/`. Application-specific components are directly in `src/components/`. Styling is Tailwind CSS with dark mode via `next-themes` (default theme: dark).

**Activity data model**: The DB uses snake_case (`price_range`, `category_ids`, `map_link`, `contact_info`). The frontend `Activity` type uses camelCase. `transformActivities()` in `activityService.ts` handles the mapping. Expired activities (past explicit dates) are filtered out before returning from service functions.

**Admin section** (`/admin`): Accessible only to authenticated admins. Provides CRUD for activities, import from BookMyShow (BMS) and Instagram, and a scraped events review queue.

**Blog**: Static pages at `src/app/blog/[slug]/page.tsx` — each blog post is a standalone TSX file, not dynamically rendered from a CMS.

**SEO**: Each page exports `generateMetadata()`. The sitemap is generated dynamically at `src/app/sitemap.ts` (revalidates hourly) and robots rules at `src/app/robots.ts`. Security headers are set in `next.config.ts`.

**Scripts**: `scripts/crawlEvents.js` uses Cheerio to scrape events and save them to the `scraped_events` Supabase table for admin review.
