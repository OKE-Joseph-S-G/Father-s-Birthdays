'use client'

import { useEffect, useRef } from 'react'

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('visitorId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('visitorId', id)
  }
  return id
}

async function track(type: string, site: string, data: Record<string, string | number> = {}) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        visitorId: getVisitorId(),
        site,
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        ...data,
      }),
    })
  } catch {}
}

export default function Analytics({ site = 'papa' }: { site?: string }) {
  const startTime = useRef<number>(Date.now())
  const hasTrackedVisit = useRef(false)
  const siteRef = useRef(site)
  siteRef.current = site

  useEffect(() => {
    if (hasTrackedVisit.current) return
    hasTrackedVisit.current = true

    track('visit', siteRef.current)
    track('pageview', siteRef.current)

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.round((Date.now() - startTime.current) / 1000)
        if (elapsed > 0) {
          navigator.sendBeacon(
            '/api/track',
            new Blob(
              [
                JSON.stringify({
                  type: 'time',
                  visitorId: getVisitorId(),
                  site: siteRef.current,
                  duration: elapsed,
                }),
              ],
              { type: 'application/json' }
            )
          )
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      const elapsed = Math.round((Date.now() - startTime.current) / 1000)
      if (elapsed > 0) {
        track('time', siteRef.current, { duration: elapsed })
      }
    }
  }, [])

  return null
}
