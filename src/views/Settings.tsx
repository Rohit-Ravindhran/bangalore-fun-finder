'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  ArrowLeft,
  Moon,
  Bell,
  MapPin,
  Heart,
  Info,
  Mail,
  Shield,
  FileText,
  ChevronRight,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { cn } from '@/lib/utils'
import {
  SETTINGS_STRINGS,
  SETTINGS_TOGGLES,
  SETTINGS_STORAGE_KEYS,
  SETTINGS_LINKS,
  SETTINGS_EXTERNAL,
} from '@/constants'

/** Icons for the support link rows, keyed by the constant's `icon` field. */
const LINK_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  info: Info,
  mail: Mail,
  shield: Shield,
  file: FileText,
}

/** iOS-style switch. */
const Switch: React.FC<{ checked: boolean }> = ({ checked }) => (
  <div
    className={cn(
      'relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0',
      checked ? 'bg-[#FFD60A]' : 'bg-gray-200 dark:bg-white/10',
    )}
  >
    <span
      className={cn(
        'absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
        checked && 'translate-x-5',
      )}
    />
  </div>
)

/** A tappable row with a leading icon, label/description and a switch. */
const ToggleRow: React.FC<{
  icon: LucideIcon
  label: string
  desc: string
  checked: boolean
  onToggle: () => void
}> = ({ icon: Icon, label, desc, checked, onToggle }) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={checked}
    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
  >
    <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
    <div className="flex-1 min-w-0 text-left">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
    </div>
    <Switch checked={checked} />
  </button>
)

/** Section wrapper: uppercase label + rounded card with divided rows. */
const Group: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <section>
    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
      {label}
    </p>
    <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden divide-y divide-gray-100 dark:divide-white/[0.05]">
      {children}
    </div>
  </section>
)

/** Persisted boolean toggle backed by localStorage. */
const usePersistedToggle = (storageKey: string, defaultValue = false) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) setValue(saved === 'true')
  }, [storageKey])

  const toggle = () =>
    setValue((prev) => {
      const next = !prev
      localStorage.setItem(storageKey, String(next))
      return next
    })

  return [value, toggle] as const
}

const Settings: React.FC = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const [notifications, toggleNotifications] = usePersistedToggle(
    SETTINGS_STORAGE_KEYS.notifications,
  )
  const [location, toggleLocation] = usePersistedToggle(SETTINGS_STORAGE_KEYS.location)

  const rowClass =
    'flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0F] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0D0D0F] border-b border-gray-100 dark:border-white/[0.06] [transform:translateZ(0)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD60A]/40 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">{SETTINGS_STRINGS.title}</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* ── Preferences ── */}
        <Group label={SETTINGS_STRINGS.groups.preferences}>
          <ToggleRow
            icon={Moon}
            label={SETTINGS_TOGGLES.theme.label}
            desc={isDark ? SETTINGS_TOGGLES.theme.descOn : SETTINGS_TOGGLES.theme.descOff}
            checked={isDark}
            onToggle={() => setTheme(isDark ? 'light' : 'dark')}
          />
          <ToggleRow
            icon={Bell}
            label={SETTINGS_TOGGLES.notifications.label}
            desc={SETTINGS_TOGGLES.notifications.desc}
            checked={notifications}
            onToggle={toggleNotifications}
          />
          <ToggleRow
            icon={MapPin}
            label={SETTINGS_TOGGLES.location.label}
            desc={SETTINGS_TOGGLES.location.desc}
            checked={location}
            onToggle={toggleLocation}
          />
        </Group>

        {/* ── Support ── */}
        <Group label={SETTINGS_STRINGS.groups.support}>
          {SETTINGS_LINKS.map((item) => {
            const Icon = LINK_ICONS[item.icon]
            return (
              <Link key={item.path} href={item.path} className={rowClass}>
                <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  {'desc' in item && item.desc && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              </Link>
            )
          })}

          <a
            href={SETTINGS_EXTERNAL.url}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
          >
            <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {SETTINGS_EXTERNAL.label}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{SETTINGS_EXTERNAL.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          </a>
        </Group>

        {/* Version */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-600 pt-1">
          {SETTINGS_STRINGS.version}
        </p>
      </main>

      <BottomNav />
    </div>
  )
}

export default Settings
