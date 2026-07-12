'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { type Theme } from '@/lib/themes'

function TimelineCard({ item, index, accent, accentRgb }: { item: { year: string; title: string; description: string }; index: number; accent: string; accentRgb: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex items-center mb-16 md:mb-0">
      <div className="md:hidden flex items-start gap-6 w-full">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center"
            style={{ border: `2px solid ${accent}`, boxShadow: `0 0 15px rgba(${accentRgb}, 0.3)` }}
          >
            <div className="w-4 h-4 rounded-full" style={{ background: accent }} />
          </motion.div>
          <div className="w-[2px] h-full min-h-[60px]" style={{ background: `linear-gradient(to bottom, rgba(${accentRgb}, 0.5), transparent)` }} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-700/50 rounded-2xl p-6 backdrop-blur-sm flex-1"
          style={{ border: `1px solid rgba(${accentRgb}, 0.2)` }}
        >
          <span className="font-display text-sm tracking-wider" style={{ color: accent }}>{item.year}</span>
          <h3 className="font-display text-xl font-bold text-white mt-1">{item.title}</h3>
          <p className="text-white/50 font-body text-sm mt-2">{item.description}</p>
        </motion.div>
      </div>

      <div className={`hidden md:flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-[calc(50%-40px)] bg-dark-700/50 rounded-2xl p-8 backdrop-blur-sm ${isLeft ? 'text-right mr-auto' : 'text-left ml-auto'}`}
          style={{ border: `1px solid rgba(${accentRgb}, 0.2)` }}
        >
          <span className="font-display text-sm tracking-wider" style={{ color: accent }}>{item.year}</span>
          <h3 className="font-display text-2xl font-bold text-white mt-1">{item.title}</h3>
          <p className="text-white/50 font-body mt-3">{item.description}</p>
        </motion.div>

        <div className="flex flex-col items-center mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center"
            style={{ border: `2px solid ${accent}`, boxShadow: `0 0 15px rgba(${accentRgb}, 0.3)` }}
          >
            <div className="w-4 h-4 rounded-full" style={{ background: accent }} />
          </motion.div>
        </div>

        <div className="w-[calc(50%-40px)]" />
      </div>
    </div>
  )
}

export default function Timeline({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: theme.accent }}>
            {theme.timelineSubtitle}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            {theme.timelineTitle}
          </h2>
        </motion.div>

        <div className="hidden md:block absolute left-1/2 top-64 bottom-32 w-[2px] -translate-x-1/2"
          style={{ background: `linear-gradient(to bottom, rgba(${theme.accentRgb}, 0.5), rgba(${theme.accentRgb}, 0.2), transparent)` }} />

        <div className="space-y-8 md:space-y-0">
          {theme.timeline.map((item, index) => (
            <TimelineCard key={item.year} item={item} index={index} accent={theme.accent} accentRgb={theme.accentRgb} />
          ))}
        </div>
      </div>
    </section>
  )
}
