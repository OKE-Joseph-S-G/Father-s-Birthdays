import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default redis

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
}

export interface VisitRecord {
  id: string
  timestamp: string
  duration: number
  pages: string[]
  userAgent: string
}

const DEFAULT_DATA: AnalyticsData = {
  totalVisits: 0,
  uniqueVisitors: 0,
  totalViews: 0,
  totalTimeSpent: 0,
  shares: 0,
  lastVisit: '',
  visits: [],
  dailyVisits: {},
  pageViews: {},
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const data = await redis.get<AnalyticsData>('analytics')
  return data || DEFAULT_DATA
}

export async function saveAnalytics(data: AnalyticsData): Promise<void> {
  await redis.set('analytics', data)
}
