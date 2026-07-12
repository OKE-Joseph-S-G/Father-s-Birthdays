'use client'

import dynamic from 'next/dynamic'
import { themes } from '@/lib/themes'

const SplashScreen = dynamic(() => import('@/components/shared/SplashScreen'), { ssr: false })
const AnimatedGradient = dynamic(() => import('@/components/shared/AnimatedGradient'), { ssr: false })
const FireworksCanvas = dynamic(() => import('@/components/shared/FireworksCanvas'), { ssr: false })
const FloatingParticles = dynamic(() => import('@/components/shared/FloatingParticles'), { ssr: false })
const CursorTrail = dynamic(() => import('@/components/shared/CursorTrail'), { ssr: false })
const ScrollProgress = dynamic(() => import('@/components/shared/ScrollProgress'), { ssr: false })
const MusicPlayer = dynamic(() => import('@/components/shared/MusicPlayer'), { ssr: false })
const SectionDivider = dynamic(() => import('@/components/shared/SectionDivider'))

const Hero = dynamic(() => import('@/components/birthday/Hero'))
const LifeStats = dynamic(() => import('@/components/birthday/LifeStats'))
const FlipCounter = dynamic(() => import('@/components/birthday/FlipCounter'))
const Timeline = dynamic(() => import('@/components/birthday/Timeline'))
const Gallery = dynamic(() => import('@/components/birthday/Gallery'))
const LetterReveal = dynamic(() => import('@/components/birthday/LetterReveal'))
const Messages = dynamic(() => import('@/components/birthday/Messages'))
const FinalWish = dynamic(() => import('@/components/birthday/FinalWish'))
const Analytics = dynamic(() => import('@/components/birthday/Analytics'), { ssr: false })

const theme = themes.irene

export default function AuntPage() {
  return (
    <main className="relative">
      <Analytics site={theme.id} />
      <SplashScreen />
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
    </main>
  )
}
