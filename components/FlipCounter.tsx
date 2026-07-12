'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const BIRTH_DATE = new Date(1978, 0, 1)

function calculateAge() {
  const now = new Date()
  let years = now.getFullYear() - BIRTH_DATE.getFullYear()
  let months = now.getMonth() - BIRTH_DATE.getMonth()
  let days = now.getDate() - BIRTH_DATE.getDate()
  let hours = now.getHours() - BIRTH_DATE.getHours()
  let minutes = now.getMinutes() - BIRTH_DATE.getMinutes()
  let seconds = now.getSeconds() - BIRTH_DATE.getSeconds()

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

function FlipUnit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-[2px]">
        {str.split('').map((digit, i) => (
          <div key={i} className="relative inline-flex flex-col items-center">
            {/* Top half */}
            <div
              className="relative w-10 h-14 sm:w-14 sm:h-20 md:w-20 md:h-28 overflow-hidden rounded-t-lg"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderBottom: 'none',
              }}
            >
              <motion.span
                key={`${label}-${digit}-${i}`}
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center font-display text-3xl sm:text-4xl md:text-6xl font-bold gold-gradient"
              >
                {digit}
              </motion.span>
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{ background: 'rgba(212, 175, 55, 0.15)' }}
              />
            </div>

            {/* Bottom half */}
            <div
              className="relative w-10 h-14 sm:w-14 sm:h-20 md:w-20 md:h-28 overflow-hidden rounded-b-lg"
              style={{
                background: 'linear-gradient(180deg, #0d0d0d 0%, #111 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderTop: '1px solid rgba(212, 175, 55, 0.05)',
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center font-display text-3xl sm:text-4xl md:text-6xl font-bold gold-gradient"
                style={{ opacity: 0.3 }}
              >
                {digit}
              </span>
            </div>

            {/* Center line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-black/60 z-10" />
            {/* Screws */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-[3px] w-1.5 h-1.5 rounded-full bg-gold-500/40 border border-gold-500/60" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-[3px] w-1.5 h-1.5 rounded-full bg-gold-500/40 border border-gold-500/60" />
          </div>
        ))}
      </div>
      <span className="mt-3 text-white/30 font-body text-[10px] sm:text-xs tracking-widest uppercase">{label}</span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1 sm:px-2 pt-1">
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-gold-500"
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-gold-500"
      />
    </div>
  )
}

export default function FlipCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [age, setAge] = useState(calculateAge)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAge(calculateAge())
    const timer = setInterval(() => {
      setAge(calculateAge())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const units = mounted ? [
    { value: age.years, label: 'Années' },
    { value: age.months, label: 'Mois' },
    { value: age.days, label: 'Jours' },
    { value: age.hours, label: 'Heures' },
    { value: age.minutes, label: 'Minutes' },
    { value: age.seconds, label: 'Secondes' },
  ] : [
    { value: 0, label: 'Années' },
    { value: 0, label: 'Mois' },
    { value: 0, label: 'Jours' },
    { value: 0, label: 'Heures' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Secondes' },
  ]

  return (
    <section className="relative py-24 sm:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-gold-500 font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Depuis le 1er Janvier 1978
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-start justify-center gap-1 sm:gap-2 md:gap-3 flex-wrap"
        >
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-start">
              <FlipUnit value={unit.value} label={unit.label} />
              {i < units.length - 1 && <Separator />}
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
