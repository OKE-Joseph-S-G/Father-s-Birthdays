'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, getVisitorId } from '@/lib/analytics'

export default function Analytics() {
  const startTime = useRef<number>(Date.now())
  const hasTrackedVisit = useRef(false)

  useEffect(() => {
    if (hasTrackedVisit.current) return
    hasTrackedVisit.current = true

    trackEvent('visit', { page: window.location.pathname })
    trackEvent('pageview', { page: window.location.pathname })

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.round((Date.now() - startTime.current) / 1000)
        if (elapsed > 0) {
          trackEvent('time', { duration: elapsed })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      const elapsed = Math.round((Date.now() - startTime.current) / 1000)
      if (elapsed > 0) {
        trackEvent('time', { duration: elapsed })
      }
    }
  }, [])

  return null
}

export function trackShare() {
  trackEvent('share')
}
