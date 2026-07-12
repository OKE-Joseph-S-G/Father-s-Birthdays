import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics, saveAnalytics } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, visitorId, page, duration, referrer } = body
    const data = await getAnalytics()

    const today = new Date().toISOString().split('T')[0]

    switch (type) {
      case 'visit': {
        data.totalVisits += 1

        if (!data.dailyVisits[today]) {
          data.dailyVisits[today] = 0
        }
        data.dailyVisits[today] += 1

        const last7days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.toISOString().split('T')[0]
        })
        const cleanedDaily: Record<string, number> = {}
        for (const day of last7days) {
          cleanedDaily[day] = data.dailyVisits[day] || 0
        }
        data.dailyVisits = cleanedDaily

        if (visitorId) {
          const existing = data.visits.find((v) => v.id === visitorId)
          if (!existing) {
            data.uniqueVisitors += 1
          }
        }

        data.visits.unshift({
          id: visitorId || 'unknown',
          timestamp: new Date().toISOString(),
          duration: 0,
          pages: [page || '/'],
          userAgent: navigator?.userAgent || '',
        })

        if (data.visits.length > 100) {
          data.visits = data.visits.slice(0, 100)
        }

        data.lastVisit = new Date().toISOString()
        break
      }

      case 'pageview': {
        data.totalViews += 1
        if (!data.pageViews[page || '/']) {
          data.pageViews[page || '/'] = 0
        }
        data.pageViews[page || '/'] += 1

        if (visitorId && data.visits.length > 0) {
          const visit = data.visits.find((v) => v.id === visitorId)
          if (visit && !visit.pages.includes(page)) {
            visit.pages.push(page)
          }
        }
        break
      }

      case 'time': {
        data.totalTimeSpent += duration || 0
        if (visitorId) {
          const visit = data.visits.find((v) => v.id === visitorId)
          if (visit) {
            visit.duration += duration || 0
          }
        }
        break
      }

      case 'share': {
        data.shares += 1
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    await saveAnalytics(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
