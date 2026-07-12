'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { type Theme } from '@/lib/themes'

const InteractiveCake = dynamic(() => import('./InteractiveCake'), { ssr: false })

function TypewriterText({ text, delay = 0, accent }: { text: string; delay?: number; accent: string }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [isInView, delay])

  useEffect(() => {
    if (!started || displayed.length >= text.length) return
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, 50)
    return () => clearTimeout(timer)
  }, [started, displayed, text])

  return (
    <span ref={ref}>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{ color: accent }} className="animate-pulse">|</span>
      )}
    </span>
  )
}

export default function FinalWish({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="relative py-40 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-16"
          >
            <InteractiveCake />
          </motion.div>

          <div className="font-display text-2xl md:text-3xl lg:text-4xl text-white/90 leading-relaxed space-y-6">
            {theme.finalWish.map((line, i) => (
              <p key={i} style={i === 1 ? { color: theme.accent } : {}}>
                <TypewriterText text={line} delay={500 + i * 2000} accent={theme.accent} />
              </p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 8, duration: 0.8 }}
            className="my-12 mx-auto w-48 h-[2px]"
            style={{ background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)` }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 9, duration: 1 }}
            className="font-display text-xl md:text-2xl italic"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {theme.finalSign}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 10, duration: 1 }}
            className="mt-6 text-white/30 font-body text-sm"
          >
            {theme.subtext}, aujourd&apos:hui et pour toujours ❤️
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
