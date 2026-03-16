"use client";

import React, { useState, useRef } from "react";
import * as cheerio from "cheerio";
import { saveScrapedActivity } from "@/services/scrapedActivityService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Link2,
  ClipboardPaste,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Category detection ────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "1": ["outdoor", "nature", "camp", "hike"],
  "2": ["painting", "art", "sketch", "craft"],
  "3": ["event", "festival", "show", "live"],
  "4": ["football", "cricket", "run", "marathon", "sprint"],
  "5": ["theatre", "drama", "play", "improv"],
  "6": ["experience", "unique", "offbeat", "wine", "tasting"],
  "7": ["meditation", "yoga", "wellness", "fitness", "health"],
  "8": ["dj", "party", "club", "dance", "music night"],
  "9": ["food", "cook", "chef", "buffet", "culinary"],
  "10": ["trek", "trail", "hiking"],
  "11": ["kids", "family", "children", "parent", "toddler"],
};

function detectCategories(text: string): string[] {
  const matched = new Set<string>();
  const lower = text.toLowerCase();
  for (const [id, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) matched.add(id);
  }
  return matched.size ? Array.from(matched) : ["6"];
}

// ─── Coordinate extraction ─────────────────────────────────────────────────

function extractGoogleMapsCoords(url: string): { lat: number; lng: number } | null {
  const patterns = [
    /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }
  return null;
}

// ─── BMS URL helpers ───────────────────────────────────────────────────────

function extractEventCode(url: string): string | null {
  const m = url.match(/\/(ET\d{8})/i);
  return m ? m[1].toUpperCase() : null;
}

// ─── Layer 1: JSON-LD structured data (Schema.org Event) ──────────────────
// BMS always includes this for SEO — most structured and reliable source.

function parseJsonLd(html: string): Partial<BMSPreview> | null {
  try {
    const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const m of matches) {
      const data = JSON.parse(m[1]);
      const event = Array.isArray(data) ? data.find((d: any) => d["@type"] === "Event") : data["@type"] === "Event" ? data : null;
      if (!event) continue;

      const name = event.name || "";
      const description = event.description || "";
      const image = typeof event.image === "string" ? event.image : (Array.isArray(event.image) ? event.image[0] : "");

      // Location
      const place = event.location;
      const venueName = place?.name || "";
      const addressLocality = place?.address?.addressLocality || place?.address?.addressRegion || "";
      const location = venueName
        ? `${venueName}${addressLocality ? `, ${addressLocality}` : ", Bangalore"}`
        : addressLocality || "Bangalore";

      // Date / time from ISO string
      let date = "";
      let time = "";
      if (event.startDate) {
        const d = new Date(event.startDate);
        if (!isNaN(d.getTime())) {
          date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
          time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
        } else {
          date = event.startDate;
        }
      }

      // Price
      const offer = Array.isArray(event.offers) ? event.offers[0] : event.offers;
      let priceRange = "";
      if (offer?.price != null) {
        priceRange = offer.price === 0 || offer.price === "0" ? "Free" : `₹${offer.price}`;
      }

      if (!name) continue;
      return { title: name, description, image, location, date, time, priceRange, categoryIds: detectCategories(`${name} ${description}`), tags: ["Event"] };
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Layer 2: OG / meta tags ───────────────────────────────────────────────
// BMS includes og:title, og:description, og:image — stable across redesigns.

function parseMetaTags(html: string): Partial<BMSPreview> {
  const $ = cheerio.load(html);

  const og = (prop: string) =>
    $(`meta[property="og:${prop}"]`).attr("content") ||
    $(`meta[property="og:${prop}"]`).attr("value") || "";

  const meta = (name: string) =>
    $(`meta[name="${name}"]`).attr("content") || "";

  // Title: OG > page <title> (strip " - BookMyShow" suffix)
  const rawTitle = og("title") || $("title").first().text() || "";
  const title = rawTitle.replace(/\s*[|\-–]\s*BookMyShow.*$/i, "").trim();

  const description = og("description") || meta("description") || "";

  // Image: OG first, then BMS CDN banner <img> as fallback (OG may be absent on closed events)
  const image = og("image") ||
    $('img[src*="bmscdn.com/nmcms/events/banner"]').first().attr("src") || "";

  // Body text — remove footer to avoid footer link text polluting extractions
  const $body = $("body").clone();
  $body.find("footer, script, style").remove();
  const bodyText = $body.text();

  // Price: look for ₹ amounts
  const priceMatch = bodyText.match(/₹\s?\d[\d,]*/);
  const priceRange = priceMatch ? priceMatch[0].replace(/\s/, "") : "";

  // Date — search main content only (footer has no dates, avoids false matches)
  let date = "";
  const datePatterns = [
    /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[,\s]+\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/gi,
    /\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/gi,
    /\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi,
  ];
  for (const p of datePatterns) {
    const m = bodyText.match(p);
    if (m) { date = m[0]; break; }
  }

  // Time
  const timeMatch = bodyText.match(/\b\d{1,2}:\d{2}\s?(?:AM|PM)\b/i);
  const time = timeMatch ? timeMatch[0] : "";

  // Location — search main content only (footer has "VenueName: Bangalore" links that pollute)
  // Only use the first ~2000 chars of body text where the venue section appears
  const mainText = bodyText.slice(0, 2000);
  const descText = description + " " + mainText;
  const knownAreas = [
    "Koramangala", "Indiranagar", "Whitefield", "Electronic City",
    "HSR Layout", "BTM Layout", "Jayanagar", "Malleshwaram",
    "Rajajinagar", "JP Nagar", "Marathahalli", "Sarjapur",
    "MG Road", "Brigade Road", "Cunningham Road", "Richmond Town",
    "Church Street", "UB City",
  ];
  let location = "";
  // BMS shows "VenueName: Bengaluru" or "VenueName, Bengaluru" in the event header area
  const venueMatch = mainText.match(/([A-Za-z][A-Za-z0-9\s&'.-]{3,50})\s*[,:]\s*(?:Bengaluru|Bangalore)/);
  if (venueMatch) {
    location = venueMatch[1].trim() + ", Bangalore";
  } else {
    for (const area of knownAreas) {
      if (descText.includes(area)) { location = `${area}, Bangalore`; break; }
    }
  }

  // Enrich description with key info that BMS shows prominently
  let enhancedDesc = description;
  const duration = bodyText.match(/\d+\s+(?:hour|minute)[s]?(?:\s+\d+\s+(?:hour|minute)[s]?)?/i)?.[0];
  const ageLimit = bodyText.match(/Age\s*Limit\s*[:\-]?\s*\d+\s*(?:yrs?|years?)\s*\+?/i)?.[0];
  if (duration) enhancedDesc += ` Duration: ${duration}.`;
  if (ageLimit) enhancedDesc += ` ${ageLimit}.`;

  return { title, description: enhancedDesc, image, location: location || "Bangalore", date, time, priceRange: priceRange || "Free", categoryIds: detectCategories(`${title} ${description}`), tags: ["Event"] };
}

// ─── Layer 3: __NEXT_DATA__ with known BMS paths ───────────────────────────
// Targeted path traversal instead of blind recursive search.

function parseNextData(html: string): Partial<BMSPreview> | null {
  try {
    const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!m) return null;
    const root = JSON.parse(m[1]);
    const candidates = [
      root?.props?.pageProps?.data,
      root?.props?.pageProps?.eventData,
      root?.props?.pageProps?.activityDetails,
      root?.props?.pageProps?.pageData,
      root?.props?.pageProps,
    ].filter(Boolean);

    for (const d of candidates) {
      const name =
        d?.EventName || d?.eventName || d?.Name || d?.name ||
        d?.title || d?.Title || "";
      if (!name) continue;

      const desc = d?.Description || d?.description || d?.About || d?.about || "";
      const img  = d?.BannerImage || d?.bannerImage || d?.PosterImage || d?.posterImage ||
                   d?.ImageURL || d?.imageUrl || d?.ImageUrl || "";
      const venue = d?.VenueName || d?.venueName || d?.Venue || d?.venue || "";
      const city  = d?.CityName  || d?.cityName  || d?.City  || d?.city  || "Bangalore";
      const price = d?.MinCost   || d?.minCost   || d?.MinPrice || d?.minPrice;
      const sDate = d?.StartDate || d?.startDate || d?.EventDate || d?.eventDate || "";
      const sTime = d?.StartTime || d?.startTime || d?.EventTime || d?.eventTime || "";

      return {
        title: name,
        description: desc,
        image: typeof img === "string" ? img : "",
        location: venue ? `${venue}, ${city}` : city,
        date: sDate,
        time: sTime,
        priceRange: price != null ? (price === 0 ? "Free" : `₹${price}`) : "",
        categoryIds: detectCategories(`${name} ${desc}`),
        tags: ["Event"],
      };
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Layer 4: window.__INITIAL_STATE__ (BMS Redux store, most complete source)
// BMS embeds its Redux store as window.__INITIAL_STATE__ = {...} in a script tag.
// It contains ldSchema.eventSchema (same as JSON-LD but always present), price,
// venue details, and Google Maps URLs with exact lat/lng coordinates.

function parseInitialState(html: string): Partial<BMSPreview> | null {
  try {
    // Extract the raw JSON — stop at the closing </script> tag
    const m = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?});\s*<\/script>/);
    if (!m) return null;
    const root = JSON.parse(m[1]);

    // ldSchema lives under seo.queries[path].data.ldSchema.eventSchema
    const seoQueries = root?.seo?.queries || {};
    for (const key of Object.keys(seoQueries)) {
      const schemas = seoQueries[key]?.data?.ldSchema?.eventSchema;
      if (!Array.isArray(schemas) || !schemas.length) continue;

      const event = schemas.find((s: any) => s["@type"] === "Event");
      if (!event || !event.name) continue;

      const name        = event.name as string;
      const description = (event.description as string) || "";

      // BMS puts several images in the array; prefer CDN desktop banner
      const imgs = Array.isArray(event.image) ? event.image : (event.image ? [event.image] : []);
      const image = (imgs.find((i: any) => typeof i === "string" && i.includes("bmscdn")) as string) ||
                    (imgs.find((i: any) => typeof i === "string") as string) || "";

      // Location — strip city suffix from venue name ("Wonderla Amusement Park: Bengaluru" → "Wonderla Amusement Park")
      const locArr  = Array.isArray(event.location) ? event.location : (event.location ? [event.location] : []);
      const place   = locArr[0];
      const rawVenue = (place?.name as string) || "";
      const venueName = rawVenue.replace(/\s*[:|]\s*(Bengaluru|Bangalore|Hyderabad|Mumbai|Delhi|Chennai|Pune)\s*$/i, "").trim();
      const city      = place?.address?.addressLocality || "Bangalore";
      const location  = venueName ? `${venueName}, ${city}` : city;

      // Date & time from ISO startDate
      let date = "", time = "";
      if (event.startDate) {
        const d = new Date(event.startDate as string);
        if (!isNaN(d.getTime())) {
          date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
          time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
        }
      }

      // Price — find minimum offer price
      const offers = Array.isArray(event.offers) ? event.offers : (event.offers ? [event.offers] : []);
      let priceRange = "";
      const prices = offers.map((o: any) => parseFloat(o.price)).filter((p: number) => !isNaN(p) && p > 0);
      if (prices.length) {
        const min = Math.min(...prices);
        priceRange = `₹${Math.round(min)} onwards`;
      }

      return {
        title: name,
        description,
        image,
        location,
        date,
        time,
        priceRange: priceRange || "Free",
        categoryIds: detectCategories(`${name} ${description}`),
        tags: ["Event"],
      };
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Extract Google Maps coordinates from BMS __INITIAL_STATE__ ─────────────
// BMS stores venue map links as: https://www.google.com/maps/search/?api=1&query=lat,lng
// These are embedded in window.__INITIAL_STATE__ JSON — much more reliable than
// asking the user to paste a map link manually.

function extractMapLinkFromInitialState(html: string): { lat: number; lng: number; mapLink: string } | null {
  // Search raw HTML for the BMS Google Maps URL pattern
  const m = html.match(/google\.com\/maps\/search\/\?[^"'\s]*query=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  return { lat, lng, mapLink: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` };
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface BMSPreview {
  title: string;
  description: string;
  image: string;
  priceRange: string;
  location: string;
  date: string;
  time: string;
  mapLink: string;
  url: string;
  tags: string[];
  categoryIds: string[];
  latitude?: number;
  longitude?: number;
}

// ─── Component ─────────────────────────────────────────────────────────────

type Step = "url" | "paste" | "preview";

export default function ActivityAddFromBMS() {
  const [step, setStep] = useState<Step>("url");
  const [bmsUrl, setBmsUrl] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [html, setHtml] = useState("");
  const [preview, setPreview] = useState<BMSPreview | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [resolvingMap, setResolvingMap] = useState(false);

  const { getAdminId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  // ── Step 1: Handle URL paste ──────────────────────────────────────────

  const handleUrlSubmit = async () => {
    const url = bmsUrl.trim();
    if (!url.includes("bookmyshow.com")) {
      toast({ title: "Invalid URL", description: "Paste a BookMyShow link", variant: "destructive" });
      return;
    }
    const code = extractEventCode(url);
    setEventCode(code || "");

    setIsFetching(true);
    try {
      // Fetch via Supabase Edge Function → ScrapingBee (renders JS, bypasses Cloudflare)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
      if (supabaseUrl) {
        const res = await fetch(`${supabaseUrl}/functions/v1/fetch-bms-page`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.success && data.html) {
          setHtml(data.html);
          parseAndPreview(data.html, url);
          return;
        }
      }
    } catch {
      // Network failure — fall through to manual paste
    } finally {
      setIsFetching(false);
    }

    // All auto-fetch attempts failed → guide user to paste manually
    setStep("paste");
  };

  // ── Step 2: Parse HTML ────────────────────────────────────────────────

  const parseAndPreview = (rawHtml: string, sourceUrl = bmsUrl) => {
    setIsParsing(true);
    try {
      // Layer 1: JSON-LD <script> tags
      const fromJsonLd = parseJsonLd(rawHtml);
      // Layer 2: OG / meta tags
      const fromMeta   = parseMetaTags(rawHtml);
      // Layer 3: __NEXT_DATA__ (standard Next.js)
      const fromNext   = parseNextData(rawHtml);
      // Layer 4: window.__INITIAL_STATE__ (BMS Redux store — most complete)
      const fromState  = parseInitialState(rawHtml);

      // Merge: Layer 4 wins for structured fields, others fill gaps
      const pick = (...vals: (string | undefined)[]) => vals.find(v => v && v.trim()) || "";

      const location = pick(fromState?.location, fromJsonLd?.location, fromNext?.location, fromMeta?.location) || "Bangalore";

      const merged: BMSPreview = {
        title:       pick(fromState?.title,       fromJsonLd?.title,       fromNext?.title,       fromMeta?.title),
        description: pick(fromState?.description, fromJsonLd?.description, fromNext?.description, fromMeta?.description),
        image:       pick(fromState?.image,       fromJsonLd?.image,       fromNext?.image,       fromMeta?.image),
        priceRange:  pick(fromState?.priceRange,  fromJsonLd?.priceRange,  fromNext?.priceRange,  fromMeta?.priceRange) || "Free",
        location,
        date:        pick(fromState?.date,        fromJsonLd?.date,        fromNext?.date,        fromMeta?.date),
        time:        pick(fromState?.time,        fromJsonLd?.time,        fromNext?.time,        fromMeta?.time),
        categoryIds: fromState?.categoryIds || fromJsonLd?.categoryIds || fromNext?.categoryIds || fromMeta?.categoryIds || ["6"],
        tags:        ["Event"],
        url:         sourceUrl,
        mapLink:     `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      };

      // Auto-extract exact venue coordinates from BMS's own Google Maps URL
      // (BMS stores ?api=1&query=lat,lng in __INITIAL_STATE__ — no manual map link needed)
      const autoCoords = extractMapLinkFromInitialState(rawHtml);
      if (autoCoords) {
        merged.latitude  = autoCoords.lat;
        merged.longitude = autoCoords.lng;
        merged.mapLink   = autoCoords.mapLink;
      }

      setPreview(merged);
      setStep("preview");
    } finally {
      setIsParsing(false);
    }
  };

  const handleHtmlPaste = () => {
    if (!html.trim()) {
      toast({ title: "Nothing to parse", description: "Paste the page HTML first", variant: "destructive" });
      return;
    }
    if (!html.toLowerCase().includes('bookmyshow')) {
      toast({ title: "Wrong page HTML", description: "This doesn't look like a BookMyShow page — did you copy the right tab?", variant: "destructive" });
      return;
    }
    parseAndPreview(html);
  };

  // ── Map link resolution ───────────────────────────────────────────────

  const resolveMapLink = async (mapUrl: string) => {
    if (!mapUrl) return;
    setResolvingMap(true);
    const coords = extractGoogleMapsCoords(mapUrl);
    if (coords) {
      setPreview(prev => prev ? { ...prev, latitude: coords.lat, longitude: coords.lng } : prev);
      setResolvingMap(false);
      return;
    }
    // Try edge function for short URLs
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
      const res = await fetch(`${supabaseUrl}/functions/v1/resolve-map-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ url: mapUrl }),
      });
      const data = await res.json();
      if (data.success && data.lat != null) {
        setPreview(prev => prev ? { ...prev, latitude: data.lat, longitude: data.lng } : prev);
      }
    } catch { /* ignore */ } finally {
      setResolvingMap(false);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!preview) return;
    if (!preview.mapLink) {
      toast({ title: "Map link required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const result = await saveScrapedActivity(
        {
          title:       preview.title,
          description: preview.description,
          image:       preview.image,
          priceRange:  preview.priceRange,
          location:    preview.location,
          date:        preview.date,
          time:        preview.time,
          mapLink:     preview.mapLink,
          url:         preview.url,
          categoryIds: preview.categoryIds,
          tags:        preview.tags,
          contactInfo: "",
          latitude:    preview.latitude,
          longitude:   preview.longitude,
          source:      "bms",
        },
        getAdminId() || undefined
      );
      if (result.error) throw new Error(result.error);
      const isdup = result.status === "duplicate";
      toast({
        title: isdup ? "Saved — possible duplicate" : "Saved for review!",
        description: isdup
          ? `"${preview.title}" added to scraped queue as a duplicate`
          : `"${preview.title}" added to scraped queue (quality: ${result.qualityScore}/100)`,
      });
      navigate("/admin/scraped-events");
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import from BookMyShow</h1>
        <p className="text-sm text-gray-500 mt-1">Auto-fill activity details from a BMS link</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {(["url", "paste", "preview"] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
              ${step === s ? "bg-orange-500 text-white" : i < ["url","paste","preview"].indexOf(step) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {i < ["url","paste","preview"].indexOf(step) && <CheckCircle2 className="h-3.5 w-3.5" />}
              {s === "url" ? "URL" : s === "paste" ? "HTML" : "Preview"}
            </div>
            {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 1: URL ── */}
      {step === "url" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">BookMyShow URL</label>
            <div className="flex gap-2">
              <Input
                value={bmsUrl}
                onChange={(e) => setBmsUrl(e.target.value)}
                placeholder="https://in.bookmyshow.com/activities/..."
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <Button onClick={handleUrlSubmit} disabled={isFetching || !bmsUrl} className="flex-shrink-0 bg-orange-500 hover:bg-orange-600">
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Paste any BMS activity link — we'll try to fetch it automatically
            </p>
          </div>
        </div>
      )}

      {/* ── Step 2: Manual HTML paste (fallback when fetch is blocked) ── */}
      {step === "paste" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">Auto-fetch was blocked by BookMyShow</p>
            <p className="text-xs text-amber-700 mb-3">Follow these steps to copy the page HTML:</p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal pl-4">
              <li>
                <a href={bmsUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center gap-1">
                  Open this BMS page <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Press <kbd className="bg-amber-100 px-1 rounded">F12</kbd> → Console tab</li>
              <li>Paste this and press Enter:
                <pre className="mt-1 bg-amber-100 rounded p-2 text-xs overflow-x-auto select-all">
{`copy(document.documentElement.outerHTML)`}
                </pre>
              </li>
              <li>Come back here and paste (<kbd className="bg-amber-100 px-1 rounded">Ctrl+V</kbd>) below</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Paste HTML here</label>
            <Textarea
              ref={htmlRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={8}
              placeholder="Paste the page HTML (from browser console `copy(document.documentElement.outerHTML)`)..."
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-400 mt-1">{html.length > 0 && `${(html.length / 1024).toFixed(0)} KB pasted`}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("url")} className="flex-1">Back</Button>
            <Button onClick={handleHtmlPaste} disabled={isParsing || !html} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {isParsing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Parsing...</> : <><ClipboardPaste className="h-4 w-4 mr-2" />Parse & Preview</>}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Preview + Edit ── */}
      {step === "preview" && preview && (
        <div className="space-y-4">
          {/* Image preview */}
          {preview.image && (
            <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
              <img src={preview.image} alt={preview.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}

          {/* Editable fields */}
          <Field label="Title *">
            <Input value={preview.title} onChange={(e) => setPreview({ ...preview, title: e.target.value })} />
          </Field>

          <Field label="Description">
            <Textarea rows={4} value={preview.description} onChange={(e) => setPreview({ ...preview, description: e.target.value })} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input value={preview.date} onChange={(e) => setPreview({ ...preview, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <Input value={preview.time} onChange={(e) => setPreview({ ...preview, time: e.target.value })} placeholder="e.g. 7:00 PM" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price Range">
              <Input value={preview.priceRange} onChange={(e) => setPreview({ ...preview, priceRange: e.target.value })} placeholder="e.g. ₹500" />
            </Field>
            <Field label="Location">
              <Input value={preview.location} onChange={(e) => setPreview({ ...preview, location: e.target.value })} />
            </Field>
          </div>

          <Field label={<>Map Link * <span className="text-orange-500">(required for map view)</span></>}>
            <div className="flex gap-2">
              <Input
                value={preview.mapLink}
                onChange={(e) => setPreview({ ...preview, mapLink: e.target.value })}
                onBlur={(e) => resolveMapLink(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
              <Button type="button" variant="outline" size="sm" disabled={resolvingMap} onClick={() => resolveMapLink(preview.mapLink)} className="flex-shrink-0">
                {resolvingMap ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              </Button>
            </div>
            {preview.latitude != null ? (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {preview.latitude.toFixed(5)}, {preview.longitude?.toFixed(5)}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Paste a Google Maps link to pin exact location on the map
              </p>
            )}
          </Field>

          <Field label="Image URL">
            <Input value={preview.image} onChange={(e) => setPreview({ ...preview, image: e.target.value })} placeholder="https://..." />
          </Field>

          <Field label="BMS URL">
            <Input value={preview.url} onChange={(e) => setPreview({ ...preview, url: e.target.value })} />
          </Field>

          {/* Categories */}
          <div className="text-xs text-gray-500">
            <span className="font-medium">Categories auto-detected:</span>{" "}
            {preview.categoryIds.join(", ")}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(html ? "paste" : "url")} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" /> Re-parse
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !preview.title || !preview.mapLink} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Send to Review Queue"}
            </Button>
          </div>

          {/* Raw HTML toggle */}
          <button className="text-xs text-gray-400 flex items-center gap-1 mt-2" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showRaw ? "Hide" : "Show"} raw HTML
          </button>
          {showRaw && (
            <Textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={6} className="font-mono text-xs" />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Small helper component ──────────────────────────────────────────────

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700">{label}</label>
      {children}
    </div>
  );
}
