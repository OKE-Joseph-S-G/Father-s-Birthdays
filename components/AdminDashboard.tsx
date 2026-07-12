'use client'

import { useState, useEffect } from 'react'
import { getAnalytics, type AnalyticsData } from '@/lib/analytics'

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  return `${hours}h ${remainMins}m`
}

function formatDate(iso: string): string {
  if (!iso) return 'Jamais'
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<AnalyticsData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStats(getAnalytics())

    const interval = setInterval(() => {
      setStats(getAnalytics())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const avgTime = stats.totalVisits > 0 ? Math.round(stats.totalTimeSpent / stats.totalVisits) : 0
  const maxDaily = Math.max(...Object.values(stats.dailyVisits), 1)
  const sortedDays = Object.entries(stats.dailyVisits).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4e276] bg-clip-text text-transparent">
                Dashboard Admin
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Statistiques du site d&apos;anniversaire de Papa</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#d4af37]/30 transition-all text-sm"
          >
            ← Retour
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Visites" value={stats.totalVisits} icon="👁️" />
          <StatCard label="Visiteurs" value={stats.uniqueVisitors} icon="👤" />
          <StatCard label="Vues" value={stats.totalViews} icon="📄" />
          <StatCard label="Temps total" value={formatDuration(stats.totalTimeSpent)} icon="⏱️" isText />
          <StatCard label="Temps moyen" value={formatDuration(avgTime)} icon="📊" isText />
          <StatCard label="Partages" value={stats.shares} icon="🔗" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Visites par jour</h2>
            {sortedDays.length > 0 ? (
              <div className="flex items-end gap-2 h-48">
                {sortedDays.map(([day, count]) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400">{count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-[#d4af37] to-[#f4e276] rounded-t-md transition-all"
                      style={{ height: `${(count / maxDaily) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                    />
                    <span className="text-[10px] text-gray-500">{day.slice(5)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">Aucune donnée pour le moment</p>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Pages vues</h2>
            <div className="space-y-3">
              {Object.entries(stats.pageViews)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([page, count]) => {
                  const maxPage = Math.max(...Object.values(stats.pageViews))
                  return (
                    <div key={page} className="flex items-center gap-3">
                      <span className="text-sm text-gray-300 w-32 truncate">{page || '/'}</span>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4e276] rounded-full"
                          style={{ width: `${(count / maxPage) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              {Object.keys(stats.pageViews).length === 0 && (
                <p className="text-gray-500 text-sm">Aucune donnée pour le moment</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#d4af37]">Visites récentes</h2>
            <button
              onClick={() => {
                if (confirm('Supprimer toutes les analytics ?')) {
                  localStorage.removeItem('birthdayAnalytics')
                  setStats(getAnalytics())
                }
              }}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Durée</th>
                  <th className="text-left py-2">Pages visitées</th>
                  <th className="text-left py-2">Visiteur</th>
                </tr>
              </thead>
              <tbody>
                {stats.visits.slice(0, 20).map((visit, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 text-gray-300">{formatDate(visit.timestamp)}</td>
                    <td className="py-2 text-gray-300">{formatDuration(visit.duration)}</td>
                    <td className="py-2 text-gray-400">{visit.pages.join(' → ')}</td>
                    <td className="py-2 text-gray-500 font-mono text-xs">{visit.id.slice(0, 8)}...</td>
                  </tr>
                ))}
                {stats.visits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-gray-500 text-center">Aucune visite enregistrée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600 text-xs">
          Dernière mise à jour : {stats.lastVisit ? formatDate(stats.lastVisit) : 'Jamais'} • Auto-refresh toutes les 5s
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
