'use client'

import dynamic from 'next/dynamic'
import { themes } from '@/lib/themes'

const SplashScreen = dynamic(() => import('@/components/shared/SplashScreen'), { ssr: false })
const AnimatedGradient = dynamic(() => import('@/components/shared/AnimatedGradient'), { ssr: false })
const FireworksCanvas = dynamic(() => import('@/components/shared/FireworksCanvas'), { ssr: false })
const FloatingParticles = dynamic(() => import('@/components/shared/FloatingParticles'), { ssr: false })
const CursorTrail = dynamic(() => import('@/components/shared/CursorTrail'), { ssr: false })
const MusicPlayer = dynamic(() => import('@/components/shared/MusicPlayer'), { ssr: false })

const BookLayout = dynamic(() => import('@/components/birthday/BookLayout'), { ssr: false })
const Analytics = dynamic(() => import('@/components/birthday/Analytics'), { ssr: false })

const theme = themes.irene

export default function AuntPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col justify-center bg-dark-900">
      <Analytics site={theme.id} />
      <SplashScreen accent={theme.accent} />
      <AnimatedGradient accent={theme.accent} accentRgb={theme.accentRgb} />
      <MusicPlayer name={theme.shortName} />
      <CursorTrail />
      <FloatingParticles />
      <FireworksCanvas />

      <div className="relative w-full h-full flex flex-col justify-center items-center" style={{ zIndex: 2 }}>
        <BookLayout theme={theme} />
      </div>
    </main>
  )
}
