'use client'

import { useState } from 'react'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        setError('Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) {
    return <AdminDashboard password={password} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'Playfair Display' }}
          >
            <span className="bg-gradient-to-r from-[#d4af37] to-[#f4e276] bg-clip-text text-transparent">
              Admin
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Accès au dashboard analytics</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors text-center text-lg tracking-widest"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#c9a02c] text-black font-semibold rounded-xl hover:from-[#f4e276] hover:to-[#d4af37] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Entrer'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
