import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Bangalore Guide — Local Picks & Hidden Spots | Happenin Bangalore",
  description:
    "Guides, lists, and local picks for things to do in Bangalore. Cafes, morning spots, hidden gems, and more — written for people who actually live here.",
};

const posts = [
  {
    slug: "bangalore-weekend-april-4-5",
    title: "Best Things to Do in Bangalore This Weekend — 4 & 5 April 2026",
    description:
      "Bollywood nights, a CBD run, live music, outdoor treks, and more happening across Bangalore this Saturday and Sunday.",
    tag: "This Weekend",
  },
  {
    slug: "things-to-do-in-bangalore",
    title: "27 Best Things to Do in Bangalore You Actually Can't Miss",
    description:
      "From rooftop breweries in Indiranagar to hidden lakes in Whitefield — the best Bangalore has to offer, without the filler.",
    tag: "City Guide",
  },
  {
    slug: "cafes-in-indiranagar",
    title: "Best Cafes in Indiranagar — Where Locals Actually Go",
    description:
      "Specialty roasters, all-day breakfast spots, and neighbourhood institutions on and around 100 Feet Road.",
    tag: "Cafes",
  },
  {
    slug: "rooftop-spots-bangalore",
    title: "Best Rooftop Bars & Sunset Spots in Bangalore",
    description:
      "High-altitude sundowners, skyline views, and the city below you — the best rooftops in Bangalore for evenings worth remembering.",
    tag: "Nightlife",
  },
  {
    slug: "weekend-treks-bangalore",
    title: "Best Weekend Treks Near Bangalore Under 100 km",
    description:
      "Skandagiri by moonlight, Savandurga's granite monolith, Nandi Hills above the clouds — everything you need for a proper Bangalore trek.",
    tag: "Outdoors",
  },
  {
    slug: "hidden-places-in-bangalore",
    title: "Hidden Places in Bangalore Most Locals Don't Know About",
    description:
      "A 16th-century watchtower, a community-restored lake, the last dry forest inside city limits — the Bangalore that doesn't trend.",
    tag: "Hidden Gems",
  },
  {
    slug: "bangalore-morning-spots",
    title: "Best Morning Spots in Bangalore for Early Risers",
    description:
      "CTR dosas at 7:30 AM, Cubbon Park before the crowds, Nandi Hills above the clouds — Bangalore rewards early risers.",
    tag: "Mornings",
  },
];

const tagColors: Record<string, string> = {
  "This Weekend": "bg-[#FFD60A] text-black",
  "City Guide": "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  Cafes: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  "Hidden Gems": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Mornings: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
  Nightlife: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Outdoors: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

export default function BlogIndex() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bangalore Guide</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Local picks for people who live here — not tourists.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-5 hover:border-[#FFD60A]/40 dark:hover:border-[#FFD60A]/30 hover:shadow-sm dark:hover:bg-white/[0.05] transition-all"
          >
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
                tagColors[post.tag] ?? "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
              }`}
            >
              {post.tag}
            </span>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
