'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { type Theme } from '@/lib/themes'

function calculateAge(birthYear: number, birthMonth: number, birthDay: number) {
  const birth = new Date(birthYear, birthMonth, birthDay)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  let hours = now.getHours() - birth.getHours()
  let minutes = now.getMinutes() - birth.getMinutes()
  let seconds = now.getSeconds() - birth.getSeconds()

  if (seconds < 0) { seconds += 60; minutes-- }
  if (minutes < 0) { minutes += 60; hours-- }
  if (hours < 0) { hours += 24; days-- }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
    months--
  }
  if (months < 0) { months += 12; years-- }

  return { years, months, days, hours, minutes, seconds }
}

function FlipUnit({ value, label, accent }: { value: number; label: string; accent: string }) {
  const str = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-[2px]">
        {str.split('').map((digit, i) => (
          <div key={i} className="relative inline-flex flex-col items-center">
            <div
              className="relative w-10 h-14 sm:w-14 sm:h-20 md:w-20 md:h-28 overflow-hidden rounded-t-lg"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)',
                border: `1px solid rgba(${hexToRgb(accent)}, 0.2)`,
                borderBottom: 'none',
              }}
            >
              <motion.span
                key={`${label}-${digit}-${i}`}
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center font-display text-3xl sm:text-4xl md:text-6xl font-bold"
                style={{ color: accent }}
              >
                {digit}
              </motion.span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{ background: `rgba(${hexToRgb(accent)}, 0.15)` }} />
            </div>

            <div
              className="relative w-10 h-14 sm:w-14 sm:h-20 md:w-20 md:h-28 overflow-hidden rounded-b-lg"
              style={{
                background: 'linear-gradient(180deg, #0d0d0d 0%, #111 100%)',
                border: `1px solid rgba(${hexToRgb(accent)}, 0.2)`,
                borderTop: `1px solid rgba(${hexToRgb(accent)}, 0.05)`,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-display text-3xl sm:text-4xl md:text-6xl font-bold"
                style={{ color: accent, opacity: 0.3 }}>
                {digit}
              </span>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-black/60 z-10" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-[3px] w-1.5 h-1.5 rounded-full border"
              style={{ background: `${accent}66`, borderColor: `${accent}99` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -right-[3px] w-1.5 h-1.5 rounded-full border"
              style={{ background: `${accent}66`, borderColor: `${accent}99` }} />
          </div>
        ))}
      </div>
      <span className="mt-3 text-white/30 font-body text-[10px] sm:text-xs tracking-widest uppercase">{label}</span>
    </div>
  )
}

function Separator({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1 sm:px-2 pt-1">
      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
    </div>
  )
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export default function FlipCounter({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [age, setAge] = useState(() => calculateAge(theme.birthYear, theme.birthMonth, theme.birthDay))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAge(calculateAge(theme.birthYear, theme.birthMonth, theme.birthDay))
    const timer = setInterval(() => {
      setAge(calculateAge(theme.birthYear, theme.birthMonth, theme.birthDay))
    }, 1000)
    return () => clearInterval(timer)
  }, [theme])

  const units = mounted ? [
    { value: age.years, label: 'Années' },
    { value: age.months, label: 'Mois' },
    { value: age.days, label: 'Jours' },
    { value: age.hours, label: 'Heures' },
    { value: age.minutes, label: 'Minutes' },
    { value: age.seconds, label: 'Secondes' },
  ] : [
    { value: 0, label: 'Années' }, { value: 0, label: 'Mois' }, { value: 0, label: 'Jours' },
    { value: 0, label: 'Heures' }, { value: 0, label: 'Minutes' }, { value: 0, label: 'Secondes' },
  ]

  return (
    <section className="relative py-24 sm:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-body text-sm tracking-[0.3em] uppercase mb-8"
          style={{ color: theme.accent }}
        >
          Depuis le {theme.birthLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-start justify-center gap-1 sm:gap-2 md:gap-3 flex-wrap"
        >
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-start">
              <FlipUnit value={unit.value} label={unit.label} accent={theme.accent} />
              {i < units.length - 1 && <Separator accent={theme.accent} />}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 text-white/40 font-body text-lg max-w-lg mx-auto"
        >
          Chaque seconde passée est un cadeau précieux
        </motion.p>
      </div>
    </section>
  )
}
