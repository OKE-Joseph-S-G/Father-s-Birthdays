import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import crypto from 'crypto'

const ADMIN_PASSWORD = 'admin2026'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 })
    }

    const { data: allVisits, error } = await supabase
      .from('visits')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200)

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const visits = allVisits || []

    const totalVisits = visits.filter((v) => v.type === 'visit').length
    const uniqueVisitors = new Set(visits.map((v) => v.visitor_id)).size
    const totalViews = visits.filter((v) => v.type === 'pageview').length
    const totalTimeSpent = visits.reduce((sum, v) => sum + (v.duration || 0), 0)
    const shares = visits.filter((v) => v.type === 'share').length

    const dailyVisits: Record<string, number> = {}
    const last7days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })

    for (const visit of visits.filter((v) => v.type === 'visit')) {
      const day = visit.timestamp.split('T')[0]
      if (last7days.includes(day)) {
        dailyVisits[day] = (dailyVisits[day] || 0) + 1
      }
    }

    for (const day of last7days) {
      if (!dailyVisits[day]) dailyVisits[day] = 0
    }

    const pageViews: Record<string, number> = {}
    for (const visit of visits.filter((v) => v.type === 'pageview')) {
      const page = visit.pages || '/'
      pageViews[page] = (pageViews[page] || 0) + 1
    }

    const recentVisits = visits
      .filter((v) => v.type === 'visit')
      .slice(0, 20)
      .map((v) => ({
        id: v.visitor_id,
        timestamp: v.timestamp,
        duration: v.duration || 0,
        pages: (v.pages || '/').split(','),
      }))

    const lastVisit = visits.length > 0 ? visits[0].timestamp : ''
    const avgTimePerVisit = totalVisits > 0 ? Math.round(totalTimeSpent / totalVisits) : 0

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      totalViews,
      totalTimeSpent,
      avgTimePerVisit,
      shares,
      lastVisit,
      dailyVisits,
      pageViews,
      recentVisits,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
