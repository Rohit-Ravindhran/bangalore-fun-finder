'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  ArrowLeft,
  Sun,
  Moon,
  Heart,
  Shield,
  FileText,
  Info,
  Mail,
  MapPin,
  Zap,
  Star,
  Users,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const Settings: React.FC = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const links = [
    { label: 'My Favorites', icon: Heart, path: '/favorites', desc: 'Places you saved' },
    { label: 'About Us', icon: Info, path: '/about', desc: 'Our story' },
    { label: 'Contact Us', icon: Mail, path: '/contact', desc: 'Get in touch' },
    { label: 'Privacy Policy', icon: Shield, path: '/privacy', desc: '' },
    { label: 'Terms & Conditions', icon: FileText, path: '/terms', desc: '' },
  ]

  const features = [
    { icon: MapPin, label: 'Events & Places', desc: 'Curated activities happening in Bangalore right now' },
    { icon: Star, label: 'Trending Picks', desc: 'What people are loving this week' },
    { icon: Zap, label: 'Quick Explore', desc: 'Find dates, food, meetups and day-out ideas instantly' },
    { icon: Users, label: 'Community First', desc: 'Built by Bangaloreans, for Bangaloreans' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0F] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0D0D0F] border-b border-gray-100 dark:border-white/[0.06] [transform:translateZ(0)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD60A]/40 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">Settings</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-5">

        {/* ── Theme Toggle ── */}
        <section>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Appearance</p>
          <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="h-5 w-5 text-[#FFD60A]" />
                ) : (
                  <Sun className="h-5 w-5 text-[#FFD60A]" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {isDark ? 'Switch to light' : 'Switch to dark'}
                  </p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
                isDark ? "bg-[#FFD60A]" : "bg-gray-200"
              )}>
                <span className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                  isDark ? "translate-x-7" : "translate-x-1"
                )} />
              </div>
            </button>
          </div>
        </section>

        {/* ── What is Happenin Bangalore ── */}
        <section>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">About the app</p>
          <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            {/* Hero block */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD60A]" />
                </span>
                <span className="text-xs font-semibold text-[#FFD60A] uppercase tracking-widest">Live in Bangalore</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                What is <span className="text-[#FFD60A]">Happenin Bangalore</span>?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Happenin Bangalore is a real-time city discovery app — your local radar for events, experiences, food spots, meetups and date ideas happening around you in Bangalore.
              </p>
            </div>

            {/* Feature list */}
            <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.label} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[#FFD60A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{f.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mission statement */}
            <div className="px-5 py-4 bg-[#FFD60A]/5 dark:bg-[#FFD60A]/5 border-t border-[#FFD60A]/10">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                "Built by people who live here, for people who want to actually live here — not just exist here."
              </p>
            </div>
          </div>
        </section>

        {/* ── App Links ── */}
        <section>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">More</p>
          <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden divide-y divide-gray-100 dark:divide-white/[0.05]">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    {item.desc && <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                </Link>
              )
            })}

            {/* Submit activity external link */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfwejAJIbXP5oC3UdZUOoYM0AQLf4ZqjuPm4nRBKAsB_FdcBg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Submit an Activity</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Know something worth sharing?</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            </a>
          </div>
        </section>

        {/* Version / credit */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-600 pt-2">
          Happenin Bangalore · Made with ♥ in Bangalore
        </p>
      </main>

      <BottomNav />
    </div>
  )
}

export default Settings
