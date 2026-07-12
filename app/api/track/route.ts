import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, visitorId, page, duration, site } = body

    const { error } = await supabase.from('visits').insert({
      visitor_id: visitorId || 'unknown',
      timestamp: new Date().toISOString(),
      duration: duration || 0,
      pages: page || '/',
      type: type || 'visit',
      site: site || 'papa',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
