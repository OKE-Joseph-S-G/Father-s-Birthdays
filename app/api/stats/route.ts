import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

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

    const siteFilter = request.nextUrl.searchParams.get('site')

    let query = supabase.from('visits').select('*').order('timestamp', { ascending: false }).limit(500)
    if (siteFilter && siteFilter !== 'all') {
      query = query.eq('site', siteFilter)
    }

    const { data: visits, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const all = visits || []

    const totalVisits = all.filter((v) => v.type === 'visit').length
    const uniqueVisitors = new Set(all.map((v) => v.visitor_id)).size
    const totalViews = all.filter((v) => v.type === 'pageview').length
    const totalTimeSpent = all.reduce((sum, v) => sum + (v.duration || 0), 0)
    const shares = all.filter((v) => v.type === 'share').length

    const dailyVisits: Record<string, number> = {}
    const last7days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })

    for (const visit of all.filter((v) => v.type === 'visit')) {
      const day = visit.timestamp.split('T')[0]
      if (last7days.includes(day)) {
        dailyVisits[day] = (dailyVisits[day] || 0) + 1
      }
    }

    for (const day of last7days) {
      if (!dailyVisits[day]) dailyVisits[day] = 0
    }

    const pageViews: Record<string, number> = {}
    for (const visit of all.filter((v) => v.type === 'pageview')) {
      const page = visit.pages || '/'
      pageViews[page] = (pageViews[page] || 0) + 1
    }

    const recentVisits = all
      .filter((v) => v.type === 'visit')
      .slice(0, 20)
      .map((v) => ({
        id: v.visitor_id,
        timestamp: v.timestamp,
        duration: v.duration || 0,
        pages: (v.pages || '/').split(','),
        site: v.site || 'papa',
      }))

    const siteBreakdown: Record<string, number> = {}
    for (const visit of all.filter((v) => v.type === 'visit')) {
      const s = visit.site || 'papa'
      siteBreakdown[s] = (siteBreakdown[s] || 0) + 1
    }

    const lastVisit = all.length > 0 ? all[0].timestamp : ''
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
      siteBreakdown,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
