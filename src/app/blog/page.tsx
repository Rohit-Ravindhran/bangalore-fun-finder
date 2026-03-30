import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bangalore Blog — Local Guides & Hidden Spots | Happ'nin Bangalore",
  description:
    "Guides, lists, and local picks for things to do in Bangalore. Cafes, morning spots, hidden gems, and more — written for people who actually live here.",
};

const posts = [
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
  "City Guide": "bg-orange-50 text-orange-600",
  Cafes: "bg-amber-50 text-amber-600",
  "Hidden Gems": "bg-emerald-50 text-emerald-700",
  Mornings: "bg-sky-50 text-sky-600",
};

export default function BlogIndex() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Bangalore Guides</h1>
        <p className="text-gray-500 text-sm">
          Local picks for people who live here — not tourists.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-gray-100 bg-white p-5 hover:border-orange-200 hover:shadow-sm transition-all"
          >
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
                tagColors[post.tag] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {post.tag}
            </span>
            <h2 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
