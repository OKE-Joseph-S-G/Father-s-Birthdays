'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), { ssr: false })

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('secretGate') === 'unlocked') {
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="bg-dark-700/50 border border-gold-500/20 rounded-2xl p-8 backdrop-blur-sm max-w-sm w-full mx-4">
          <h1 className="font-display text-2xl font-bold gold-gradient text-center mb-6">
            Administration
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (password === 'admin2026') {
                sessionStorage.setItem('secretGate', 'unlocked')
                setAuthenticated(true)
              } else {
                setError(true)
                setPassword('')
                setTimeout(() => setError(false), 600)
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="Mot de passe admin..."
              className="w-full bg-dark-800/60 border border-gold-500/30 rounded-xl px-4 py-3 text-center font-body text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/60 transition-all mb-4"
            />
            {error && (
              <p className="text-red-400/60 text-sm text-center mb-4 font-body">
                Mot de passe incorrect
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-display text-dark-900 font-bold tracking-wide transition-all duration-300 disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)' }}
            >
              Entrer
            </button>
          </form>
          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full text-center text-white/30 font-body text-sm hover:text-white/60 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminDashboard onBack={() => router.push('/')} />
    </div>
  )
}
