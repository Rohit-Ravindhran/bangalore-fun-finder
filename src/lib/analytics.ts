/**
 * Client-side analytics helper.
 * All functions are no-ops on the server (SSR/SSG) — safe to import anywhere.
 */

const ENDPOINT = '/api/analytics'

// ─── Session ID ──────────────────────────────────────────────────────────────
// One UUID per browser tab, persisted in sessionStorage so refreshes in the
// same tab share a session but new tabs start fresh.

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return 'ssr'
  let id = sessionStorage.getItem('_anl_sid')
  if (!id) {
    id = generateId()
    sessionStorage.setItem('_anl_sid', id)
  }
  return id
}

// ─── Session start time (for duration_seconds) ───────────────────────────────

export function getSessionStart(): number {
  if (typeof sessionStorage === 'undefined') return Date.now()
  const stored = sessionStorage.getItem('_anl_start')
  if (stored) return Number(stored)
  const now = Date.now()
  sessionStorage.setItem('_anl_start', String(now))
  return now
}

// ─── OS detection ────────────────────────────────────────────────────────────

export function detectOS(): string {
  if (typeof navigator === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/windows/i.test(ua)) return 'Windows'
  if (/macintosh|mac os x/i.test(ua)) return 'macOS'
  if (/linux/i.test(ua)) return 'Linux'
  return 'Unknown'
}

// ─── UTM / referrer (captured once on landing) ───────────────────────────────

type LandingInfo = {
  referrer: string | null
  landing_method: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

export function getLandingInfo(): LandingInfo {
  if (typeof sessionStorage === 'undefined') {
    return { referrer: null, landing_method: null, utm_source: null, utm_medium: null, utm_campaign: null }
  }

  const cached = sessionStorage.getItem('_anl_landing')
  if (cached) return JSON.parse(cached) as LandingInfo

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const ref = typeof document !== 'undefined' ? document.referrer || null : null

  let landing_method: string | null = null
  if (params.get('utm_source')) {
    landing_method = 'utm'
  } else if (ref) {
    landing_method = 'referral'
  } else {
    landing_method = 'direct'
  }

  const info: LandingInfo = {
    referrer: ref,
    landing_method,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }

  sessionStorage.setItem('_anl_landing', JSON.stringify(info))
  return info
}

// ─── Core send function ───────────────────────────────────────────────────────

export type EventPayload = {
  event_type: string
  pathname?: string
  activity_id?: string
  activity_title?: string
  duration_seconds?: number
}

export function sendEvent(payload: EventPayload): void {
  if (typeof window === 'undefined') return

  // Skip admin pages — no need to track admin activity
  if (window.location.pathname.startsWith('/admin')) return

  const landing = getLandingInfo()

  const body = JSON.stringify({
    event_type: payload.event_type,
    session_id: getSessionId(),
    pathname: payload.pathname ?? window.location.pathname,
    activity_id: payload.activity_id ?? null,
    activity_title: payload.activity_title ?? null,
    os: detectOS(),
    ...landing,
    duration_seconds: payload.duration_seconds ?? null,
  })

  // Use sendBeacon when available so events survive page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(ENDPOINT, blob)
  } else {
    fetch(ENDPOINT, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
  }
}
