'use client'

import { useState, useEffect, useMemo } from 'react'

interface Visit {
  id: string
  timestamp: string
  duration: number
  pages: string[]
  site: string
}

interface Stats {
  totalVisits: number
  uniqueVisitors: number
  totalViews: number
  totalTimeSpent: number
  avgTimePerVisit: number
  shares: number
  lastVisit: string
  dailyVisits: Record<string, number>
  pageViews: Record<string, number>
  recentVisits: Visit[]
  siteBreakdown: Record<string, number>
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}m`
}

function formatDate(iso: string): string {
  if (!iso) return 'Jamais'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function toCSV(stats: Stats): string {
  const lines = ['Date,Heure,Duree (s),Pages,Visiteur,Site']
  for (const v of stats.recentVisits) {
    const d = new Date(v.timestamp)
    lines.push([
      d.toLocaleDateString('fr-FR'),
      d.toLocaleTimeString('fr-FR'),
      String(v.duration),
      v.pages.join(' > '),
      v.id.slice(0, 8),
      v.site || 'papa',
    ].join(','))
  }
  return lines.join('\n')
}

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(0)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [siteFilter, setSiteFilter] = useState('all')

  useEffect(() => {
    async function fetchStats() {
      try {
        const url = `/api/stats${siteFilter !== 'all' ? `?site=${siteFilter}` : ''}`
        const res = await fetch(url, {
          headers: { Authorization: 'Bearer admin2026' },
        })
        if (!res.ok) {
          setError('Erreur de connexion à la base de données')
          setLoading(false)
          return
        }
        const data = await res.json()
        setStats(data)
        setLastRefresh(Date.now())
      } catch {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [siteFilter])

  const filteredVisits = useMemo(() => {
    if (!stats) return []
    let visits = stats.recentVisits
    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      visits = visits.filter((v) => new Date(v.timestamp).getTime() >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000
      visits = visits.filter((v) => new Date(v.timestamp).getTime() < to)
    }
    return visits
  }, [stats, dateFrom, dateTo])

  function exportCSV() {
    if (!stats) return
    const csv = toCSV({ ...stats, recentVisits: filteredVisits })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${siteFilter}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const peakHours = useMemo(() => {
    if (!stats) return []
    const hours: Record<number, number> = {}
    for (let i = 0; i < 24; i++) hours[i] = 0
    for (const v of stats.recentVisits) {
      const h = new Date(v.timestamp).getHours()
      hours[h]++
    }
    return Object.entries(hours).map(([h, count]) => ({ hour: Number(h), count }))
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button onClick={onBack} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">← Retour</button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const maxDaily = Math.max(...Object.values(stats.dailyVisits), 1)
  const sortedDays = Object.entries(stats.dailyVisits).sort(([a], [b]) => a.localeCompare(b))
  const maxPeak = Math.max(...peakHours.map((h) => h.count), 1)

  const siteNames: Record<string, string> = { papa: 'Papa', irene: 'Irène' }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4e276] bg-clip-text text-transparent">Dashboard Admin</span>
            </h1>
            <p className="text-gray-400 mt-2">Statistiques des sites d&apos;anniversaire</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#d4af37]/30 transition-all text-sm">← Retour</button>
        </div>

        {/* Site Filter */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { key: 'all', label: 'Tous les sites' },
            { key: 'papa', label: 'Papa' },
            { key: 'irene', label: 'Irène' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSiteFilter(s.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                siteFilter === s.key
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {s.label}
              {s.key !== 'all' && stats.siteBreakdown[s.key] !== undefined && (
                <span className="ml-2 text-xs opacity-70">({stats.siteBreakdown[s.key] || 0})</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Visites" value={stats.totalVisits} icon="👁️" />
          <StatCard label="Visiteurs" value={stats.uniqueVisitors} icon="👤" />
          <StatCard label="Vues" value={stats.totalViews} icon="📄" />
          <StatCard label="Temps total" value={formatDuration(stats.totalTimeSpent)} icon="⏱️" isText />
          <StatCard label="Temps moyen" value={formatDuration(stats.avgTimePerVisit)} icon="📊" isText />
          <StatCard label="Partages" value={stats.shares} icon="🔗" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Visites (7 derniers jours)</h2>
            {sortedDays.length > 0 ? (
              <div className="flex items-end gap-2 h-48">
                {sortedDays.map(([day, count]) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400">{count}</span>
                    <div className="w-full bg-gradient-to-t from-[#d4af37] to-[#f4e276] rounded-t-md transition-all"
                      style={{ height: `${(count / maxDaily) * 100}%`, minHeight: count > 0 ? '4px' : '0' }} />
                    <span className="text-[10px] text-gray-500">{day.slice(5)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm text-center py-8">Aucune donnée</p>}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Heures de pointe</h2>
            <div className="flex items-end gap-1 h-48">
              {peakHours.map(({ hour, count }) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  {count > 0 && <span className="text-[10px] text-gray-400">{count}</span>}
                  <div className="w-full bg-gradient-to-t from-[#818cf8] to-[#c4b5fd] rounded-t-md transition-all"
                    style={{ height: `${(count / maxPeak) * 100}%`, minHeight: count > 0 ? '3px' : '0' }} />
                  {hour % 4 === 0 && <span className="text-[9px] text-gray-500">{hour}h</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Pages vues</h2>
            <div className="space-y-3">
              {Object.entries(stats.pageViews).sort(([, a], [, b]) => b - a).slice(0, 10).map(([page, count]) => {
                const maxPage = Math.max(...Object.values(stats.pageViews))
                return (
                  <div key={page} className="flex items-center gap-3">
                    <span className="text-sm text-gray-300 w-32 truncate">{page || '/'}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4e276] rounded-full" style={{ width: `${(count / maxPage) * 100}%` }} />
                    </div>
                    <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                  </div>
                )
              })}
              {Object.keys(stats.pageViews).length === 0 && <p className="text-gray-500 text-sm">Aucune donnée</p>}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Ratio</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Partages / Visites</span>
                <span className="text-white font-bold">{stats.totalVisits > 0 ? Math.round((stats.shares / stats.totalVisits) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#2dd4bf] rounded-full"
                  style={{ width: `${stats.totalVisits > 0 ? Math.min((stats.shares / stats.totalVisits) * 100, 100) : 0}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Vues / Visite</span>
                <span className="text-white font-bold">{stats.totalVisits > 0 ? (stats.totalViews / stats.totalVisits).toFixed(1) : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Temps moyen</span>
                <span className="text-white font-bold">{formatDuration(stats.avgTimePerVisit)}</span>
              </div>
              {Object.keys(stats.siteBreakdown).length > 1 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Par site :</p>
                  {Object.entries(stats.siteBreakdown).map(([site, count]) => (
                    <div key={site} className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{siteNames[site] || site}</span>
                      <span className="text-white font-bold">{count} visites</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-xl font-semibold text-[#d4af37]">Visites récentes</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#d4af37]/50" />
              <span className="text-gray-500 text-sm">→</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#d4af37]/50" />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo('') }}
                  className="text-xs text-gray-500 hover:text-white transition-colors">Effacer</button>
              )}
              <button onClick={exportCSV}
                className="px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-sm text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors">
                📥 CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Durée</th>
                  <th className="text-left py-2">Pages</th>
                  <th className="text-left py-2">Site</th>
                  <th className="text-left py-2">Visiteur</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 text-gray-300">{formatDate(visit.timestamp)}</td>
                    <td className="py-2 text-gray-300">{formatDuration(visit.duration)}</td>
                    <td className="py-2 text-gray-400">{visit.pages.join(' → ')}</td>
                    <td className="py-2">
                      <span className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: visit.site === 'irene' ? 'rgba(232,160,191,0.15)' : 'rgba(212,175,55,0.15)', color: visit.site === 'irene' ? '#e8a0bf' : '#d4af37' }}>
                        {siteNames[visit.site] || visit.site}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500 font-mono text-xs">{visit.id.slice(0, 8)}...</td>
                  </tr>
                ))}
                {filteredVisits.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-gray-500 text-center">
                    {dateFrom || dateTo ? 'Aucune visite pour cette période' : 'Aucune visite enregistrée'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600 text-xs">
          Dernière mise à jour : {lastRefresh ? formatDate(new Date(lastRefresh).toISOString()) : 'Jamais'} • Auto-refresh 10s
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, isText }: { label: string; value: number | string; icon: string; isText?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#d4af37]/30 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`font-bold text-white ${isText ? 'text-sm' : 'text-2xl'}`}>
        {isText ? value : (value as number).toLocaleString()}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}
