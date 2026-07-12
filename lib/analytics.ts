export interface AnalyticsData {
  totalVisits: number
  uniqueVisitors: number
  totalViews: number
  totalTimeSpent: number
  shares: number
  lastVisit: string
  visits: VisitRecord[]
  dailyVisits: Record<string, number>
  pageViews: Record<string, number>
  visitorIds: string[]
}

export interface VisitRecord {
  id: string
  timestamp: string
  duration: number
  pages: string[]
}

const STORAGE_KEY = 'birthdayAnalytics'

function getDefault(): AnalyticsData {
  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    totalViews: 0,
    totalTimeSpent: 0,
    shares: 0,
    lastVisit: '',
    visits: [],
    dailyVisits: {},
    pageViews: {},
    visitorIds: [],
  }
}

export function getAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') return getDefault()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefault()
    return { ...getDefault(), ...JSON.parse(raw) }
  } catch {
    return getDefault()
  }
}

export function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function trackEvent(type: string, extra: Record<string, string | number> = {}) {
  const data = getAnalytics()
  const today = new Date().toISOString().split('T')[0]
  const visitorId = getVisitorId()

  switch (type) {
    case 'visit': {
      data.totalVisits += 1
      data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1

      if (!data.visitorIds.includes(visitorId)) {
        data.uniqueVisitors += 1
        data.visitorIds.push(visitorId)
      }

      data.visits.unshift({
        id: visitorId,
        timestamp: new Date().toISOString(),
        duration: 0,
        pages: [String(extra.page || '/')],
      })

      if (data.visits.length > 100) data.visits = data.visits.slice(0, 100)
      if (data.visitorIds.length > 500) data.visitorIds = data.visitorIds.slice(-500)
      data.lastVisit = new Date().toISOString()
      break
    }
    case 'pageview': {
      data.totalViews += 1
      const page = String(extra.page || '/')
      data.pageViews[page] = (data.pageViews[page] || 0) + 1

      const visit = data.visits.find((v) => v.id === visitorId)
      if (visit && !visit.pages.includes(page)) {
        visit.pages.push(page)
      }
      break
    }
    case 'time': {
      const duration = Number(extra.duration) || 0
      data.totalTimeSpent += duration
      const visit = data.visits.find((v) => v.id === visitorId)
      if (visit) visit.duration += duration
      break
    }
    case 'share': {
      data.shares += 1
      break
    }
  }

  saveAnalytics(data)
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('visitorId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('visitorId', id)
  }
  return id
}
