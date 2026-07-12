'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SecretGate = dynamic(() => import('@/components/SecretGate'), { ssr: false })

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const saved = sessionStorage.getItem('secretGate')
    if (saved === 'unlocked') {
      // Already unlocked, show SecretGate which will handle routing
    }
  }, [])

  return (
    <main className="relative min-h-screen">
      <SecretGate />
    </main>
  )
}
