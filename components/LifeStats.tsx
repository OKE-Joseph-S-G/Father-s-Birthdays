'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const BIRTH_DATE = new Date(1978, 0, 1)

function calculateStats() {
  const now = new Date()
  const diff = now.getTime() - BIRTH_DATE.getTime()
  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)
  const totalWeeks = Math.floor(totalDays / 7)
  const heartbeats = Math.floor(totalSeconds * 1.15)

  return { totalDays, totalHours, totalMinutes, totalSeconds, totalWeeks, heartbeats }
}

function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR')
}

function CountUp({ target, duration = 2, delay = 0 }: { target: number; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      const steps = 60
      const increment = target / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, (duration * 1000) / steps)
      return () => clearInterval(timer)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [isInView, target, duration, delay])

  return <span ref={ref}>{formatNumber(count)}</span>
}

export default function LifeStats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const stats = calculateStats()

  const items = [
    { value: stats.totalDays, label: 'Jours vécus', icon: '☀️', suffix: '' },
    { value: stats.totalWeeks, label: 'Semaines', icon: '📅', suffix: '' },
    { value: stats.totalHours, label: 'Heures', icon: '⏰', suffix: '' },
    { value: stats.totalMinutes, label: 'Minutes', icon: '⏱️', suffix: '' },
    { value: stats.totalSeconds, label: 'Secondes', icon: '⚡', suffix: '' },
    { value: stats.heartbeats, label: 'Battements de cœur', icon: '❤️', suffix: '' },
  ]

  return (
    <section className="relative py-24 sm:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 font-body text-sm tracking-[0.3em] uppercase mb-4">
            Le volume d&apos;une vie
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gold-gradient mb-4">
            48 Ans en Chiffres
          </h2>
          <p className="text-white/30 font-body text-sm max-w-md mx-auto">
            Chaque chiffre raconte une partie de ton histoire
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative bg-dark-700/40 border border-gold-500/10 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm overflow-hidden group"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 70%)' }}
              />

              <span className="text-2xl sm:text-3xl mb-3 block">{item.icon}</span>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient leading-none mb-2">
                <CountUp target={item.value} delay={0.2 + i * 0.1} />
              </p>
              <p className="text-white/40 font-body text-xs sm:text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Emotional line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center mt-12 text-white/20 font-body text-xs italic"
        >
          Et chaque seconde de plus est un cadeau
        </motion.p>
      </div>
    </section>
  )
}
