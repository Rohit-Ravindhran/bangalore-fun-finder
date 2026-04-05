import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Weekend Treks Near Bangalore Under 100 km | Happenin Bangalore",
  description:
    "Skandagiri by moonlight, Savandurga's ancient granite monolith, Nandi Hills above the cloud line — everything you need for a proper Bangalore-area trek.",
  openGraph: {
    title: "Best Weekend Treks Near Bangalore Under 100 km",
    description:
      "The definitive guide to weekend treks from Bangalore — distances, difficulty, season, and what to actually expect.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Trekkers at sunrise on hills near Bangalore",
      },
    ],
  },
};

const treks = [
  {
    name: "Skandagiri (Kalavara Durga)",
    distance: "~70 km from Bangalore",
    elevation: "1,450 m",
    duration: "3–4 hours up, 2–3 hours down",
    difficulty: "Moderate",
    highlight: "Night trek + sunrise above cloud sea",
    season: "Oct–Feb (avoid monsoon)",
    description:
      "The single most iconic trek from Bangalore — not because it's the hardest, but because of what you get at the top. Skandagiri is famous for night treks: you start at midnight, reach the summit just before dawn, and watch the sun rise above a sea of clouds. On a clear morning the cloud layer sits at exactly summit level, giving you the sensation of standing on an island in the sky. The trek itself isn't technical but the night ascent on loose trail requires a good torch and decent footwear.",
    tips: [
      "Book through an organised group — the forest department restricts solo treks",
      "Carry 2–3 litres of water; there's none on the trail",
      "A light fleece is essential — summit temperatures in winter can drop to 8°C",
      "The ruins of a 17th-century fort at the top are worth exploring at dawn",
    ],
    mapLink: "https://maps.google.com/?q=Skandagiri+Chikkaballapura+Karnataka",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=75",
  },
  {
    name: "Savandurga",
    distance: "~50 km west of Bangalore",
    elevation: "1,226 m",
    duration: "2–3 hours up, 1.5–2 hours down",
    difficulty: "Easy to moderate",
    highlight: "Asia's largest monolith — sheer granite face, forest trails",
    season: "Oct–Mar",
    description:
      "Savandurga is two things: an enormous grey-pink granite monolith (one of the largest in Asia) and a quiet forest that most Bangaloreans drive past without stopping. The trek to the top follows the easier eastern slope — the western face is vertical and reserved for technical climbers. The view from the summit gives you the Arkavathi river below and Manchanabele reservoir glinting in the distance. The granite is warm underfoot in winter mornings and genuinely beautiful.",
    tips: [
      "Go on a weekday — weekends get crowded after 9 AM",
      "Start early (7 AM) before the sun hits the exposed granite sections",
      "The forest section near the base has birds — carry binoculars if that's your thing",
      "The Manchanabele dam nearby makes a good stop for breakfast before or after",
    ],
    mapLink: "https://maps.google.com/?q=Savandurga+Bangalore+Karnataka",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75",
  },
  {
    name: "Nandi Hills",
    distance: "~60 km north of Bangalore",
    elevation: "1,478 m",
    duration: "Drive up (paved road) or 2-hr trek from base",
    difficulty: "Easy (drive) / Moderate (trek)",
    highlight: "Cloud sea at dawn, cycling, historical fort",
    season: "Year-round; best Oct–Feb",
    description:
      "The most accessible high-altitude experience from Bangalore. Most people drive up (the road is paved all the way) but there's a proper trekking trail from the base village that most people skip. The draw is the sunrise: arrive before 6 AM on a clear morning and you'll find Nandi Hills sitting above a white cloud sea, with the city invisible below. The ruins of Tipu Sultan's summer retreat at the top add a quietly surreal historical layer. Cycling up from Devanahalli is a popular weekend challenge for the city's cycling crowd.",
    tips: [
      "Entry gates open at 6 AM — the sunrise window is 6–7 AM",
      "Weekends are very crowded; weekday trips are dramatically better",
      "The cycling route from Devanahalli is about 20 km of steady climbing",
      "Carry your own food — the stalls at the top are overpriced and uninspiring",
    ],
    mapLink: "https://maps.google.com/?q=Nandi+Hills+Karnataka",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75",
  },
  {
    name: "Anthargange",
    distance: "~68 km east of Bangalore",
    elevation: "1,226 m",
    duration: "2–3 hours total with cave exploration",
    difficulty: "Moderate (cave sections require scrambling)",
    highlight: "Volcanic rock formations + natural caves",
    season: "Oct–Mar",
    description:
      "Anthargange is unlike any other trek in this list. The terrain is volcanic — massive boulders tumbled at improbable angles, forming natural caves, tunnels, and passages that you navigate by torchlight. It's part hike, part scramble, part spelunking. The summit offers a view over the Kolar plains at first light, but the real drama is underground, squeezing through boulder gaps with a torch. Not for the claustrophobic — genuinely for everyone else.",
    tips: [
      "Carry a powerful torch or headlamp — the caves are pitch dark",
      "Wear clothes you don't mind getting dirty; the cave sections involve crawling",
      "A local guide for the cave network is recommended on your first visit",
      "The spring at the base (the 'anthargange') is sacred — treat it accordingly",
    ],
    mapLink: "https://maps.google.com/?q=Anthargange+Kolar+Karnataka",
    img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=75",
  },
  {
    name: "Bilikal Rangaswamy Betta",
    distance: "~80 km south of Bangalore",
    elevation: "1,067 m",
    duration: "3–4 hours return",
    difficulty: "Moderate",
    highlight: "Dense forest trail, ancient hilltop temple, solitude",
    season: "Oct–Feb",
    description:
      "The most underrated trek on this list. Bilikal (meaning 'white rock' in Kannada) sees a fraction of Skandagiri's crowds despite being a genuinely excellent trail through thick deciduous forest. The path narrows as you ascend and the canopy closes overhead. At the top, an old temple and the summit panorama over the Cauvery basin make for a surprisingly moving arrival. This one rewards the effort with rare quiet.",
    tips: [
      "Very few people on weekdays — you may have the trail to yourself",
      "The forest section has wildlife; make noise on the trail",
      "The temple priest often offers prasad to trekkers — it's a nice touch",
      "Combine with a stop at Bheemeshwari on the return for riverside lunch",
    ],
    mapLink: "https://maps.google.com/?q=Bilikal+Rangaswamy+Betta+Karnataka",
    img: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=75",
  },
  {
    name: "Makalidurga",
    distance: "~60 km north of Bangalore",
    elevation: "1,114 m",
    duration: "2–2.5 hours up, 1.5 hours down",
    difficulty: "Easy to moderate",
    highlight: "Railway tracks at the base, fort ruins, valley views",
    season: "Oct–Feb",
    description:
      "Makalidurga has a memorable approach: the trailhead sits beside the Bangalore–Guntakal railway line, and for the first 20 minutes you walk alongside tracks that see only a handful of trains per day. The hill itself is manageable even for first-time trekkers. At the top, fort walls from the medieval Chola period still stand in places, and the valley on the far side drops dramatically. The combination of railways, ruins, and open summit makes this a satisfying half-day from the city.",
    tips: [
      "Good first trek for beginners — manageable gradient, clear trail",
      "Trains on the line are infrequent but do run — stay clear of the tracks",
      "Very little shade on the upper section; hat and sunscreen essential",
      "Devanahalli town is 20 minutes away for good breakfast before or after",
    ],
    mapLink: "https://maps.google.com/?q=Makalidurga+Trek+Karnataka",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=75",
  },
];

const difficultyColor: Record<string, string> = {
  "Easy": "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "Easy to moderate": "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "Moderate": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  "Moderate to hard": "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
};

export default function WeekendTreksBangalore() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Guides
      </Link>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[2/1] bg-gray-100 dark:bg-white/5">
        <img
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80"
          alt="Trekkers at sunrise near Bangalore"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 mb-4">
        Outdoors
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
        Best Weekend Treks Near Bangalore Under 100 km
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Last updated: April 2026</p>

      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Bangalore is surrounded by the Deccan Plateau, the Nandi range to the north, and the Western Ghats foothills to the south and west. Within a two-hour drive you can be standing on a summit above the clouds, scrambling through volcanic boulder caves, or walking the ruins of a 17th-century hill fort. The city doesn't advertise this well. Here are the six treks that earn their place.
      </p>
      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        All distances are from Majestic / Central Bangalore. All times assume a reasonable pace — not racing, not stopping every five minutes.
      </p>

      {/* Quick reference table */}
      <div className="rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden mb-10">
        <div className="bg-gray-50 dark:bg-white/[0.04] px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Reference</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
          {treks.map((t) => (
            <div key={t.name} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t.distance}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${difficultyColor[t.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                {t.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trek cards */}
      <div className="space-y-10">
        {treks.map((trek, i) => (
          <div key={trek.name}>
            <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/7] bg-gray-100 dark:bg-white/5">
              <img
                src={trek.img}
                alt={trek.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                {i + 1}. {trek.name}
              </h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-1 ${difficultyColor[trek.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                {trek.difficulty}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: trek.distance },
                { label: `Elev: ${trek.elevation}` },
                { label: trek.duration },
                { label: `Season: ${trek.season}` },
              ].map((m) => (
                <span key={m.label} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.08]">
                  {m.label}
                </span>
              ))}
            </div>

            {/* Highlight */}
            <p className="text-xs font-semibold text-[#FFD60A] mb-3 uppercase tracking-wider">
              ★ {trek.highlight}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {trek.description}
            </p>

            {/* Tips */}
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 mb-4 border border-gray-100 dark:border-white/[0.06]">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Practical tips</p>
              <ul className="space-y-1.5">
                {trek.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-[#FFD60A] mt-0.5 shrink-0">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={trek.mapLink}
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
        ))}
      </div>

      {/* Closing */}
      <div className="mt-12 p-5 rounded-2xl bg-[#FFD60A]/5 border border-[#FFD60A]/20">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What to carry on any Bangalore-area trek</h3>
        <ul className="space-y-1.5">
          {[
            "2–3 litres of water minimum — sources on trail are rare",
            "Snacks: banana, nuts, and a few glucose biscuits cover most half-day treks",
            "Headlamp with fresh batteries for night treks or early starts",
            "Layered clothing — summit temperatures drop 6–8°C below the base",
            "ID card — some forest areas require it at the entry point",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-[#FFD60A] mt-0.5 shrink-0">›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
