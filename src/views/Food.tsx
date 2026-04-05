'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Utensils, MapPin, Clock, Star } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

const features = [
  { icon: MapPin, text: 'Hidden gems only locals know about' },
  { icon: Clock, text: 'Late-night spots, mapped and verified' },
  { icon: Star, text: '"Worth the drive" picks for weekend food trips' },
  { icon: Utensils, text: 'Food crawl routes — because one spot is never enough' },
]

const Food: React.FC = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0F] pb-24">
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0D0D0F] border-b border-gray-100 dark:border-white/[0.06] [transform:translateZ(0)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD60A]/40 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">Food Spots</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-10 max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFD60A]/10 border border-[#FFD60A]/20 flex items-center justify-center mx-auto mb-6">
          <Utensils className="h-8 w-8 text-[#FFD60A]" />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A] animate-pulse" />
            Coming Soon
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
          Food Spots
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          A curated guide to great food in Bangalore — from popular cafés and breweries to local favourites and hidden gems.
        </p>

        {/* Features */}
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/[0.06] divide-y divide-gray-100 dark:divide-white/[0.05] mb-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.text} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#FFD60A]" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{f.text}</p>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          We'll let you know when it's ready.
        </p>
      </main>

      <BottomNav />
    </div>
  )
}

export default Food
