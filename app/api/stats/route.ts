import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/kv'
import crypto from 'crypto'

const ADMIN_PASSWORD_HASH = crypto
  .createHash('sha256')
  .update('papa1978')
  .digest('hex')

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    if (tokenHash !== ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 })
    }

    const data = await getAnalytics()
    const avgTime = data.totalVisits > 0 ? Math.round(data.totalTimeSpent / data.totalVisits) : 0

    return NextResponse.json({
      totalVisits: data.totalVisits,
      uniqueVisitors: data.uniqueVisitors,
      totalViews: data.totalViews,
      totalTimeSpent: data.totalTimeSpent,
      avgTimePerVisit: avgTime,
      shares: data.shares,
      lastVisit: data.lastVisit,
      dailyVisits: data.dailyVisits,
      pageViews: data.pageViews,
      recentVisits: data.visits.slice(0, 20),
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
