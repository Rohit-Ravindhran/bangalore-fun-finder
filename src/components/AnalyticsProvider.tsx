'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { sendEvent, getSessionId, getSessionStart } from '@/lib/analytics'

export default function AnalyticsProvider() {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)

  // ── Initialise session on first mount ──────────────────────────────────────
  useEffect(() => {
    getSessionId()   // ensures session ID is created
    getSessionStart() // stamps session start time
  }, [])

  // ── Track page_view on every route change ──────────────────────────────────
  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    sendEvent({ event_type: 'page_view', pathname })
  }, [pathname])

  // ── Track session_end with duration on tab close / navigation away ─────────
  useEffect(() => {
    const handleEnd = () => {
      const duration_seconds = Math.round((Date.now() - getSessionStart()) / 1000)
      sendEvent({ event_type: 'session_end', pathname, duration_seconds })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleEnd()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleEnd)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleEnd)
    }
  }, [pathname])

  return null
}
