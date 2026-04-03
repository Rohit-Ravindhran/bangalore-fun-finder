import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Things to Do in Bangalore This Weekend — 4 & 5 April 2026 | Happ'nin Bangalore",
  description:
    "Bollywood nights, a CBD run, live music, art workshops, and outdoor activities happening across Bangalore on Saturday 4 April and Sunday 5 April 2026.",
};

export default function BangaloreWeekendApril45() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Guides
      </Link>

      <div className="mb-2">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500 text-white mb-3">
          This Weekend
        </span>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
          Best Things to Do in Bangalore This Weekend — 4 &amp; 5 April 2026
        </h1>
        <p className="text-sm text-gray-400">Saturday &amp; Sunday · April 2026</p>
      </div>

      <p className="text-gray-600 leading-relaxed mt-5 mb-8">
        A packed weekend ahead in Bangalore — live music, night parties, a morning run, treks, and a
        handful of interesting day events scattered across the city. Here&apos;s everything worth
        knowing about, broken down by day.
      </p>

      {/* Saturday */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="bg-orange-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">SAT</span>
        Saturday, 4 April
      </h2>

      <div className="space-y-6 mb-10">

        <div className="border-l-2 border-orange-200 pl-4">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-0.5">Morning · Outdoor</p>
          <h3 className="font-semibold text-gray-900 mb-1">Cubbon Park to CBD Run</h3>
          <p className="text-sm text-gray-500 mb-1">Ambedkar Veedhi, Bengaluru</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Start your Saturday the right way. This popular community run goes from Cubbon Park
            through the CBD and is one of the best ways to see central Bangalore before the city
            wakes up. Runners of all paces welcome — from serious half-marathon trainers to people
            who just want a reason to get out of bed early. Bring water. The stretch through
            Kasturba Road and Raj Bhavan Road under the canopy is genuinely beautiful.
          </p>
        </div>

        <div className="border-l-2 border-purple-200 pl-4">
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-0.5">Afternoon · Workshop</p>
          <h3 className="font-semibold text-gray-900 mb-1">Weekend Art &amp; Craft Workshops</h3>
          <p className="text-sm text-gray-500 mb-1">Multiple venues, Indiranagar &amp; Koramangala</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Saturday afternoons in Bangalore have quietly become prime time for workshops —
            pottery, painting, macramé, and candle-making sessions fill up most weekends. Check
            the Happ&apos;nin listings for what&apos;s open today. Most run 2–4 hours, all
            materials included, and beginner-friendly. Good option if you want something
            productive before the evening kicks in.
          </p>
        </div>

        <div className="border-l-2 border-pink-200 pl-4">
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide mb-0.5">Evening · Music</p>
          <h3 className="font-semibold text-gray-900 mb-1">The Eternal Pulse — Live Percussion &amp; Music</h3>
          <p className="text-sm text-gray-500 mb-1">The Humming Tree, Indiranagar</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The Humming Tree has one of the best live music setups in the city — good sound,
            intimate space, serious crowd. This performance leans into rhythm and percussion with
            an ensemble that blends Indian classical elements with contemporary arrangements.
            Doors usually open at 7 PM; show starts 8–8:30 PM. Book tickets in advance — this
            venue sells out.
          </p>
        </div>

        <div className="border-l-2 border-indigo-200 pl-4">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">Night · Party</p>
          <h3 className="font-semibold text-gray-900 mb-1">Saturday Biggest Bollywood Ladies Night</h3>
          <p className="text-sm text-gray-500 mb-1">LUX Pub &amp; Kitchen, Koramangala</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every Saturday at LUX, Koramangala. Bollywood, Punjabi, and commercial hits all night.
            Starts late — 9 PM onwards — and runs past midnight. This is one of the more
            consistently good Bollywood nights in the city. Cover charges may apply; check the
            event listing for the latest entry details.
          </p>
        </div>

      </div>

      {/* Sunday */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="bg-gray-800 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">SUN</span>
        Sunday, 5 April
      </h2>

      <div className="space-y-6 mb-10">

        <div className="border-l-2 border-green-200 pl-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-0.5">Morning · Outdoor</p>
          <h3 className="font-semibold text-gray-900 mb-1">Sunday Trek — Nearby Hills &amp; Trails</h3>
          <p className="text-sm text-gray-500 mb-1">Nandi Hills / Savandurga / Ramanagara</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Sunday is the classic day for a Bangalore day-trek. Nandi Hills (60 km, 1.5 hrs) is the
            easiest if you want sunrise views and a leisurely morning. Savandurga (55 km) is better
            if you want a real climb — it&apos;s one of the largest monolith rocks in Asia and the
            trail is genuinely challenging. Ramanagara (60 km) is famous as the filming location
            for Sholay and has great bouldering. Leave by 5:30–6 AM to avoid the heat.
          </p>
        </div>

        <div className="border-l-2 border-amber-200 pl-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Morning · Food</p>
          <h3 className="font-semibold text-gray-900 mb-1">Sunday Breakfast — CTR or MTR</h3>
          <p className="text-sm text-gray-500 mb-1">Malleswaram</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you&apos;re not trekking, Sunday morning in Malleswaram is a ritual. Central Tiffin
            Room (CTR) opens at 7:30 AM and the benne masala dosa queue starts forming before that.
            MTR at Lalbagh Road is the other institution — rava idli was literally invented there.
            Get there before 9 AM or expect a 40-minute wait.
          </p>
        </div>

        <div className="border-l-2 border-orange-200 pl-4">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-0.5">Afternoon · Market</p>
          <h3 className="font-semibold text-gray-900 mb-1">Sunday Flea Markets &amp; Pop-ups</h3>
          <p className="text-sm text-gray-500 mb-1">Various — Koramangala, Whitefield, Jayanagar</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Sunday afternoons are prime flea market time in Bangalore. The Sunday Soul Sante (when
            it&apos;s on), Dyu Art Café market, and smaller pop-ups in Koramangala and HSR are worth
            checking. Local designers, vintage finds, and street food all in one place. Usually
            11 AM–7 PM. Follow Happ&apos;nin for confirmed Sunday market listings this week.
          </p>
        </div>

        <div className="border-l-2 border-rose-200 pl-4">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-0.5">Night · Music</p>
          <h3 className="font-semibold text-gray-900 mb-1">Biggest South Indian DJ Night @Vapour</h3>
          <p className="text-sm text-gray-500 mb-1">Vapour, Indiranagar</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Sunday night at Vapour with DJ VLSJ &amp; DJ Sandy spinning South Indian blockbusters.
            Vapour has a big basement floor, decent sound, and pulls a crowd that actually knows
            the songs. If you&apos;re into Tollywood, Kollywood, and Tamil chartbusters —
            this is the right room. Entry from 9 PM.
          </p>
        </div>

      </div>

      {/* Tips */}
      <div className="bg-orange-50 rounded-2xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">Weekend Logistics</h3>
        <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
          <li>
            <strong>Getting around:</strong> Rapido bikes work well for short hops in Indiranagar
            and Koramangala. Namma Metro covers the CBD corridor — useful for Saturday evening.
          </li>
          <li>
            <strong>Weather:</strong> April in Bangalore means warm days (28–32°C) and cooler
            evenings. Light clothes during the day; carry a layer for late nights at rooftop spots.
          </li>
          <li>
            <strong>Book ahead:</strong> The Humming Tree and popular Saturday night venues sell out.
            Book tickets online — walk-ins often get turned away after 9 PM.
          </li>
          <li>
            <strong>Sunday treks:</strong> Pre-book with a group operator for logistics — parking at
            Nandi Hills on a Sunday is chaos if you drive independently.
          </li>
        </ul>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 mb-3">See all events happening this weekend:</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Browse Weekend Activities →
        </Link>
      </div>
    </main>
  );
}
