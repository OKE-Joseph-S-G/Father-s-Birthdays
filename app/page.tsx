'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'

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

export default function Home() {
  const [unlocked, setUnlocked] = useState(false)

  const handleUnlock = useCallback(() => {
    setUnlocked(true)
  }, [])

  return (
    <main className="relative">
      <Analytics />
      <SplashScreen />
      <SecretGate onUnlocked={handleUnlock} />

      {unlocked && (
        <>
          <AnimatedGradient />
          <ScrollProgress />
          <MusicPlayer />
          <CursorTrail />
          <FloatingParticles />
          <FireworksCanvas />

          <div className="relative" style={{ zIndex: 2 }}>
            <Hero />
            <SectionDivider />
            <FlipCounter />
            <SectionDivider />
            <LifeStats />
            <SectionDivider />
            <Timeline />
            <SectionDivider />
            <Gallery />
            <SectionDivider />
            <LetterReveal />
            <SectionDivider />
            <Messages />
            <SectionDivider />
            <FinalWish />

            <footer className="py-12 text-center border-t border-white/5">
              <p className="text-white/20 font-body text-xs tracking-wider">
                Fait avec ❤️ pour Papa — 2026
              </p>
            </footer>
          </div>
        </>
      )}
    </main>
  )
}
