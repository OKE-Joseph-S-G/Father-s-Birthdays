import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase

export interface AnalyticsData {
  totalVisits: number
  uniqueVisitors: number
  totalViews: number
  totalTimeSpent: number
  shares: number
  lastVisit: string
  dailyVisits: Record<string, number>
  pageViews: Record<string, number>
}

export interface VisitRecord {
  id?: number
  visitor_id: string
  timestamp: string
  duration: number
  pages: string
  type: string
}
