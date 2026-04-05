import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Rooftop Bars & Sunset Spots in Bangalore | Happenin Bangalore",
  description:
    "High-altitude sundowners, skyline views, and the city spread below you. The best rooftop bars, cafes, and open-air spaces in Bangalore for evenings worth remembering.",
  openGraph: {
    title: "Best Rooftop Bars & Sunset Spots in Bangalore",
    description:
      "The best rooftop bars and sunset spots in Bangalore — from Indiranagar terraces to Koramangala skyline views.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Bangalore rooftop at sunset",
      },
    ],
  },
};

const spots = [
  {
    name: "Arbor Brewing Company",
    area: "Indiranagar",
    description:
      "Three floors of craft beer culture with a rooftop terrace that catches the last hour of Bangalore sun perfectly. The IPA is brewed on-site — order a pint and watch the city cool down. Thursday evenings are the sweet spot: busy enough to have energy, quiet enough to hold a conversation.",
    vibe: "Craft beer + lively",
    bestTime: "6–8 PM weekdays",
    priceRange: "₹800–1,400 for two",
    mapLink: "https://maps.google.com/?q=Arbor+Brewing+Company+Indiranagar+Bangalore",
    img: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=75",
  },
  {
    name: "The Leela Palace Bangalore — Sky Bar",
    area: "Old Airport Road",
    description:
      "The most polished rooftop in the city. The Leela's Sky Bar sits at the top of the hotel and looks out over a surprisingly green Bangalore skyline. Cocktails are hotel-priced but meticulously made. Come for a birthday, an anniversary, or any night you want to feel like the city belongs to you.",
    vibe: "Luxury + date night",
    bestTime: "Sunset to 10 PM",
    priceRange: "₹3,000–5,000 for two",
    mapLink: "https://maps.google.com/?q=The+Leela+Palace+Bangalore",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=75",
  },
  {
    name: "Vapour Bar Exchange",
    area: "Koramangala 5th Block",
    description:
      "A mid-century-modern rooftop that introduced Bangalore to the concept of a stock-market-style fluctuating drinks menu — prices go up and down on a screen in real time. The novelty never really wears off. Good for groups who want something interactive. The view over Koramangala's canopy is genuinely beautiful at golden hour.",
    vibe: "Group fun + quirky",
    bestTime: "7–9 PM on weekends",
    priceRange: "₹1,000–2,000 for two",
    mapLink: "https://maps.google.com/?q=Vapour+Bar+Exchange+Koramangala+Bangalore",
    img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=75",
  },
  {
    name: "Monkey Bar Rooftop",
    area: "Indiranagar / Church Street (multiple)",
    description:
      "Monkey Bar has consistently been one of Bangalore's best restaurants and the rooftop space cements that reputation. The cocktails use Indian ingredients intelligently — kokum, tamarind, curry leaf — and the small plates are made for sharing. Late evenings here feel like the city's creative class at play.",
    vibe: "Creative crowd + great food",
    bestTime: "8 PM onwards",
    priceRange: "₹1,500–2,500 for two",
    mapLink: "https://maps.google.com/?q=Monkey+Bar+Indiranagar+Bangalore",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=75",
  },
  {
    name: "SKYYE — UB City",
    area: "UB City, Vittal Mallya Road",
    description:
      "Perched above UB City's luxury mall, SKYYE is one of the most cinematic rooftops in the city. The glass walls, the curated light installations, and the view make it a genuine spectacle. Best visited at dusk when the sky goes from orange to indigo. The cocktail menu is expansive; the mocktail menu is underrated.",
    vibe: "Statement evening + views",
    bestTime: "Dusk — around 6:30–8 PM",
    priceRange: "₹2,500–4,000 for two",
    mapLink: "https://maps.google.com/?q=SKYYE+UB+City+Bangalore",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75",
  },
  {
    name: "Windmills Craftworks",
    area: "HSR Layout / JP Nagar",
    description:
      "The rooftop at Windmills is less polished than UB City's options, but it's arguably more Bangalorean. Live jazz and blues most evenings, excellent tap list, and a crowd that actually listens to the music. The Hefeweizen is one of the best beers brewed in the city. Book a table in advance on weekends.",
    vibe: "Live music + craft beer",
    bestTime: "Show times — usually 8 PM",
    priceRange: "₹1,200–2,000 for two",
    mapLink: "https://maps.google.com/?q=Windmills+Craftworks+Bangalore",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=75",
  },
  {
    name: "Vidyarthi Bhavan Rooftop (aka just go early and eat nearby)",
    area: "Gandhi Bazaar, South Bangalore",
    description:
      "Not a rooftop spot itself — but Gandhi Bazaar on a Saturday evening has an energy that no bar can manufacture. Eat at Vidyarthi Bhavan (be there before 8 AM for breakfast or 5:30 PM for dinner), then walk the bazaar streets as the lights come on. The 'rooftop' here is the open sky over old Bangalore. Free and unrepeatable.",
    vibe: "Old Bangalore atmosphere",
    bestTime: "Saturday evenings",
    priceRange: "Under ₹200",
    mapLink: "https://maps.google.com/?q=Gandhi+Bazaar+Bangalore",
    img: "https://images.unsplash.com/photo-1516592673884-4a382d1124c2?w=800&q=75",
  },
];

export default function RooftopSpotsBangalore() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Guides
      </Link>

      {/* Hero image */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[2/1] bg-gray-100 dark:bg-white/5">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
          alt="Bangalore rooftop at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Header */}
      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 mb-4">
        Nightlife
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
        Best Rooftop Bars &amp; Sunset Spots in Bangalore
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Last updated: April 2026</p>

      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Bangalore is at 920 metres above sea level — and yet for years the city treated rooftops as afterthoughts. That's changed. In the last decade, some genuinely great elevated spaces have opened: places with views, thoughtful drinks, and the kind of atmosphere that makes an ordinary evening feel like an occasion. Here are the ones worth your time, roughly in order of how much they'll cost you.
      </p>

      {/* Spot cards */}
      <div className="space-y-8">
        {spots.map((spot, i) => (
          <div key={spot.name} className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="aspect-[16/7] bg-gray-100 dark:bg-white/5 overflow-hidden">
              <img
                src={spot.img}
                alt={spot.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {i + 1}. {spot.name}
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 mt-1">
                  {spot.area}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {spot.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-gray-50 dark:bg-white/[0.04] rounded-lg p-2.5">
                  <p className="text-gray-400 dark:text-gray-500 mb-0.5">Vibe</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{spot.vibe}</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/[0.04] rounded-lg p-2.5">
                  <p className="text-gray-400 dark:text-gray-500 mb-0.5">Best time</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{spot.bestTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/[0.04] rounded-lg p-2.5 col-span-2">
                  <p className="text-gray-400 dark:text-gray-500 mb-0.5">Price range</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{spot.priceRange}</p>
                </div>
              </div>
              <a
                href={spot.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFD60A] hover:underline"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                View on Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 p-5 rounded-2xl bg-[#FFD60A]/5 border border-[#FFD60A]/20">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">A note on timing</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Bangalore's golden hour sits between 5:30 and 6:30 PM depending on the season. That's the window to be on a rooftop — the temperature drops from uncomfortable to perfect and the light turns everything amber. Most rooftop bars in the city fill up after 8 PM; arrive an hour earlier and you'll have your pick of the best tables.
        </p>
      </div>
    </main>
  );
}
