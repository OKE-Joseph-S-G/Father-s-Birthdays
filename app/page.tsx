'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useMemo } from 'react'
import { themes, type Theme } from '@/lib/themes'

const SplashScreen = dynamic(() => import('@/components/SplashScreen'), { ssr: false })
const SecretGate = dynamic(() => import('@/components/SecretGate'), { ssr: false })
const AnimatedGradient = dynamic(() => import('@/components/AnimatedGradient'), { ssr: false })
const FireworksCanvas = dynamic(() => import('@/components/FireworksCanvas'), { ssr: false })
const FloatingParticles = dynamic(() => import('@/components/FloatingParticles'), { ssr: false })
const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false })
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false })
const Hero = dynamic(() => import('@/components/Hero'))
const LifeStats = dynamic(() => import('@/components/LifeStats'))
const FlipCounter = dynamic(() => import('@/components/FlipCounter'))
const Timeline = dynamic(() => import('@/components/Timeline'))
const Gallery = dynamic(() => import('@/components/Gallery'))
const LetterReveal = dynamic(() => import('@/components/LetterReveal'))
const Messages = dynamic(() => import('@/components/Messages'))
const FinalWish = dynamic(() => import('@/components/FinalWish'))
const SectionDivider = dynamic(() => import('@/components/SectionDivider'))
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { ssr: false })
const Analytics = dynamic(() => import('@/components/Analytics'), { ssr: false })
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), { ssr: false })

export default function Home() {
  const [mode, setMode] = useState<'none' | 'papa' | 'irene' | 'admin'>('none')

  const handleUnlock = useCallback((unlockMode: 'papa' | 'irene' | 'admin') => {
    setMode(unlockMode)
  }, [])

  const theme: Theme | null = useMemo(() => {
    if (mode === 'papa') return themes.papa
    if (mode === 'irene') return themes.irene
    return null
  }, [mode])

  return (
    <main className="relative">
      <SplashScreen />
      <SecretGate onUnlocked={handleUnlock} />

      {mode === 'admin' && (
        <AdminDashboard onBack={() => {
          sessionStorage.removeItem('secretGateAdmin')
          setMode('none')
        }} />
      )}

      {theme && (
        <>
          <Analytics site={theme.id} />
          <AnimatedGradient accent={theme.accent} accentRgb={theme.accentRgb} />
          <ScrollProgress />
          <MusicPlayer />
          <CursorTrail />
          <FloatingParticles />
          <FireworksCanvas />

          <div className="relative" style={{ zIndex: 2 }}>
            <Hero theme={theme} />
            <SectionDivider />
            <FlipCounter theme={theme} />
            <SectionDivider />
            <LifeStats theme={theme} />
            <SectionDivider />
            <Timeline theme={theme} />
            <SectionDivider />
            <Gallery theme={theme} />
            <SectionDivider />
            <LetterReveal theme={theme} />
            <SectionDivider />
            <Messages theme={theme} />
            <SectionDivider />
            <FinalWish theme={theme} />

            <footer className="py-12 text-center border-t border-white/5">
              <p className="text-white/20 font-body text-xs tracking-wider">
                {theme.footer}
              </p>
            </footer>
          </div>
        </>
      )}
    </main>
  )
}
