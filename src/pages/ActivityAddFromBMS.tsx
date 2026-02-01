"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as cheerio from "cheerio";

const CATEGORY_KEYWORDS = {
  Outdoor: ["trek", "camp", "hike"],
  Arts: ["painting", "art", "sketch", "craft"],
  Events: ["event", "festival", "show"],
  Sports: ["football", "cricket", "run", "marathon", "sprint"],
  Theatre: ["theatre", "drama", "play", "improv"],
  Unique: ["experience", "unique", "offbeat"],
  Wellness: ["meditation", "yoga", "wellness", "fitness", "health"],
  Parties: ["dj", "party", "club", "dance", "music night"],
  Foodie: ["food", "tasting", "cook", "chef", "buffet"],
  Trek: ["trek", "trail", "hiking"],
  "For Families": ["kids", "family", "children", "parent", "toddler"],
};

const CATEGORY_IDS = {
  Outdoor: "1",
  Arts: "2",
  Events: "3",
  Sports: "4",
  Theatre: "5",
  Unique: "6",
  Wellness: "7",
  Parties: "8",
  Foodie: "9",
  Trek: "10",
  "For Families": "11",
};

function detectCategories(text) {
  const matched = new Set();
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) matched.add(CATEGORY_IDS[category]);
    }
  }
  return matched.size ? Array.from(matched) : ["6"]; // fallback to 'Unique'
}

export default function AddEvent() {
  const [html, setHtml] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = () => {
    setLoading(true);
    const $ = cheerio.load(html);

    // Enhanced title extraction
    const title =
      $("h1.sc-7o7nez-0").first().text().trim() ||
      $("h1").first().text().trim() ||
      $('[class*="title"]:first').text().trim();

    // Enhanced image extraction
    const image =
      $('img[src*="media-desktop-"]').first().attr("src") ||
      $('img[alt*="event"], img[alt*="banner"]').first().attr("src") ||
      $('img[src*="bmscdn.com/nmcms"]').first().attr("src") ||
      "";

    // Enhanced description extraction
    const descNodes = $("div.sc-omw9zj-1").find("p");
    const description =
      descNodes
        .map((i, el) => $(el).text().trim())
        .get()
        .join(" ") ||
      $("[class*='description'], [class*='about']").text().trim();

    // Enhanced price extraction - look for multiple patterns
    const priceText =
      $("body")
        .text()
        .match(/₹\d+[,\d]*/)?.[0] ||
      $("[class*='price'], [class*='amount']").text().match(/₹\d+/)?.[0] ||
      "₹0";

    // Enhanced location extraction for BMS venues
    const extractVenueLocation = () => {
      const bodyText = $("body").text();

      // First, try to extract the specific venue from BMS location structure
      // Look for patterns like "Bloom Creative Zone, HSR: Bengaluru"
      const bmsLocationPattern =
        /([A-Za-z\s&,.-]+(?:Zone|Mall|Centre|Center|Complex|Theatre|Theater|Hall|Studio|Club|Lounge|Cafe|Restaurant)[^:]*?):\s*(?:Bengaluru|Bangalore)/gi;
      const bmsMatch = bmsLocationPattern.exec(bodyText);
      if (bmsMatch && bmsMatch[1]) {
        return bmsMatch[1].trim() + ", Bangalore";
      }

      // Look for venue patterns in BMS HTML (common patterns)
      const venuePatterns = [
        // Specific BMS venue pattern: "Venue Name, Area: City"
        /([A-Z][a-zA-Z\s&,.-]+)(?::\s*(?:Bangalore|Bengaluru))/gi,
        // Mall patterns: "Mall Name, Location, Bangalore"
        /([A-Z][a-zA-Z\s&]+(?:Mall|Market|Centre|Center|Complex))[,\s]*([A-Z][a-zA-Z\s]+)[,\s]*(?:Bangalore|Bengaluru)/gi,
        // Theatre patterns: "Theatre Name, Location, Bangalore"
        /([A-Z][a-zA-Z\s&]+(?:Theatre|Theater|Cinemas?|PVR|INOX))[,\s]*([A-Z][a-zA-Z\s]+)[,\s]*(?:Bangalore|Bengaluru)/gi,
        // Road/Street patterns: "Location Road/Street, Bangalore"
        /((?:MG|Brigade|Commercial|Residency|Richmond|St\. Marks?|Cunningham)\s+(?:Road|Street))[,\s]*(?:Bangalore|Bengaluru)/gi,
        // General venue patterns: "Venue Name, Area, Bangalore"
        /([A-Z][a-zA-Z\s&]+)[,\s]*([A-Z][a-zA-Z\s]+(?:Road|Street|Circle|Cross|Junction|Nagar|pur|bad))[,\s]*(?:Bangalore|Bengaluru)/gi,
        // Simple area patterns: "Area Name, Bangalore"
        /([A-Z][a-zA-Z\s]+(?:Road|Street|Circle|Cross|Junction|Nagar|pur|bad))[,\s]*(?:Bangalore|Bengaluru)/gi,
      ];
      for (const pattern of venuePatterns) {
        const matches = [...bodyText.matchAll(pattern)];
        if (matches.length > 0) {
          const match = matches[0];
          if (match[2]) {
            // Venue name + Area, Bangalore
            return `${match[1].trim()}, ${match[2].trim()}, Bangalore`;
          } else if (match[1]) {
            // Just Area, Bangalore
            return `${match[1].trim()}, Bangalore`;
          }
        }
      }

      // Fallback: look for specific area names in Bangalore
      const knownAreas = [
        "Koramangala",
        "Indiranagar",
        "Whitefield",
        "Electronic City",
        "HSR Layout",
        "BTM Layout",
        "Jayanagar",
        "Malleshwaram",
        "Rajajinagar",
        "JP Nagar",
        "Marathahalli",
        "Sarjapur Road",
        "Outer Ring Road",
        "MG Road",
        "Brigade Road",
        "Commercial Street",
        "Cunningham Road",
        "UB City",
        "Forum Mall",
        "Phoenix Marketcity",
        "Orion Mall",
        "Mantri Square",
        "VR Bengaluru",
        "Elements Mall",
      ];

      for (const area of knownAreas) {
        if (bodyText.includes(area)) {
          return `${area}, Bangalore`;
        }
      }

      // Final fallback
      return "Bangalore";
    };

    const location = extractVenueLocation();

    // Enhanced date extraction - look for multiple patterns
    const bodyText = $("body").text();
    const datePatterns = [
      /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/gi,
      /\d{1,2}(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/gi,
      /\d{1,2}(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
    ];
    let date = "";
    for (const pattern of datePatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        date = match[0];
        break;
      }
    }

    // Enhanced time extraction
    const timeMatch = bodyText.match(
      /\b(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\b/i
    );
    const time = timeMatch ? timeMatch[0] : "";

    // Duration extraction
    const durationMatch =
      bodyText.match(/(\d+)\s+hour[s]?\s+(\d+)\s+minute[s]?/i) ||
      bodyText.match(/(\d+)\s+hour[s]?/i) ||
      bodyText.match(/(\d+)\s+minute[s]?/i);
    const duration = durationMatch ? durationMatch[0] : "";

    // Age limit extraction
    const ageLimitMatch = bodyText.match(
      /Age\s+Limit\s*[-:]?\s*(\d+[+]?\s*yrs?[+]?)/i
    );
    const ageLimit = ageLimitMatch ? ageLimitMatch[0] : "";

    // Language extraction
    const languageMatch = bodyText.match(
      /(?:English|Hindi|Tamil|Telugu|Kannada|Malayalam|Bengali|Marathi|Gujarati)(?:[,\s]+(?:English|Hindi|Tamil|Telugu|Kannada|Malayalam|Bengali|Marathi|Gujarati))*/gi
    );
    const languages = languageMatch ? languageMatch[0] : "";

    // Genre extraction
    const genreMatch = bodyText.match(
      /(?:Comedy|Music|Drama|Dance|Art|Workshop|Conference|Business|Tech|Food|Sports|Fitness|Wellness)/gi
    );
    const genre = genreMatch ? genreMatch[0] : "";

    // Artists/Performers extraction from HTML structure
    const artists = [];
    $('[class*="artist"], [class*="performer"]').each((i, el) => {
      const artistName = $(el).find('[class*="name"]').text().trim();
      if (artistName && artistName.length > 2) {
        artists.push(artistName);
      }
    });

    // Also try text-based artist extraction from your sample
    if (artists.length === 0) {
      // Look for common artist patterns in the text
      const artistMatches = bodyText.match(
        /(?:Artists?|Performers?|Featuring)[:\s]+([^.]+)/gi
      );
      if (artistMatches) {
        artistMatches.forEach((match) => {
          const names = match
            .replace(/(?:Artists?|Performers?|Featuring)[:\s]+/gi, "")
            .split(/[,&]/);
          names.forEach((name) => {
            const cleanName = name.trim();
            if (cleanName.length > 2) artists.push(cleanName);
          });
        });
      }
    }

    // Interest count extraction
    const interestMatch = bodyText.match(/(\d+)\s+are\s+interested/i);
    const interestCount = interestMatch ? parseInt(interestMatch[1]) : 0;

    const category_ids = detectCategories(`${title} ${description} ${genre}`);

    // Enhanced description with additional details
    let enhancedDescription = description;
    if (duration) enhancedDescription += ` Duration: ${duration}.`;
    if (ageLimit) enhancedDescription += ` ${ageLimit}.`;
    if (languages) enhancedDescription += ` Languages: ${languages}.`;
    if (artists.length > 0)
      enhancedDescription += ` Artists: ${artists.join(", ")}.`;
    if (interestCount > 0)
      enhancedDescription += ` ${interestCount} people are interested.`;

    const previewData = {
      title,
      image,
      description: enhancedDescription,
      price_range: priceText,
      location,
      date,
      time,
      map_link: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      url: "",
      tags: ["Event", genre].filter(Boolean),
      category_ids,
      section_type: "event",
      contact_info: "",
      enabled: true,
    };

    setPreview(previewData);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setLoading(true);
    const { error } = await supabase.from("activities").insert([preview]);
    setLoading(false);
    if (error) {
      alert("❌ Error: " + error.message);
    } else {
      alert("✅ Event saved to Supabase!");
      setHtml("");
      setPreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Paste BookMyShow HTML</h1>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={15}
        className="w-full border p-2 mb-4 rounded"
        placeholder="Paste full HTML here..."
      />
      <button
        onClick={handlePreview}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Parsing..." : "Preview"}
      </button>

      {preview && (
        <div className="border rounded p-4 space-y-4">
          <h2 className="text-lg font-semibold">Edit & Preview</h2>

          <input
            className="w-full border p-2 rounded"
            value={preview.title}
            onChange={(e) => setPreview({ ...preview, title: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            value={preview.date}
            onChange={(e) => setPreview({ ...preview, date: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="e.g., 10:00 PM"
            value={preview.time}
            onChange={(e) => setPreview({ ...preview, time: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Duration (e.g., 1 hour 30 minutes)"
            value={preview.duration || ""}
            onChange={(e) =>
              setPreview({ ...preview, duration: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Artists/Performers"
            value={preview.artists || ""}
            onChange={(e) =>
              setPreview({ ...preview, artists: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            value={preview.location}
            onChange={(e) =>
              setPreview({
                ...preview,
                location: e.target.value,
                map_link: `https://maps.google.com/?q=${encodeURIComponent(
                  e.target.value
                )}`,
              })
            }
          />

          <div className="text-sm text-gray-600">
            <strong>Map Link Preview:</strong>
            <a
              href={preview.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2"
            >
              {preview.map_link}
            </a>
          </div>

          {preview.interest_count > 0 && (
            <div className="text-sm text-green-600 font-medium">
              🎯 {preview.interest_count} people are interested in this event
            </div>
          )}

          <input
            className="w-full border p-2 rounded"
            value={preview.price_range}
            onChange={(e) =>
              setPreview({ ...preview, price_range: e.target.value })
            }
          />

          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            value={preview.description}
            onChange={(e) =>
              setPreview({ ...preview, description: e.target.value })
            }
          />

          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <div>
              <strong>Note:</strong> Additional details like duration,
              languages, genre, and artists have been included in the
              description.
            </div>
          </div>

          <img
            src={preview.image}
            alt="event banner"
            className="mt-2 max-h-52 object-cover rounded"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit to Supabase
          </button>
        </div>
      )}
    </div>
  );
}
