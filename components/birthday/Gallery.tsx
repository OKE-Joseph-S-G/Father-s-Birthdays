'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { type Theme } from '@/lib/themes'

function PhotoCard({ src, index, accent, accentRgb }: { src: string; index: number; accent: string; accentRgb: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative group cursor-pointer aspect-square"
    >
      <div className="w-full h-full rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          border: `1px solid rgba(${accentRgb}, 0.2)`,
        }}
      >
        <img
          src={src}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.5), transparent)` }} />
      </div>
    </motion.div>
  )
}

function PlaceholderCard({ index, accent, accentRgb }: { index: number; accent: string; accentRgb: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const labels = ['Enfance', 'Jeunesse', 'Famille', 'Moments', 'Aventure', 'Bonheur', 'Souvenirs', 'Rires']

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative group cursor-pointer aspect-square"
    >
      <div className="w-full h-full rounded-2xl bg-dark-700 flex flex-col items-center justify-center gap-3"
        style={{ border: `1px solid rgba(${accentRgb}, 0.2)` }}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: `${accent}66` }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-white/30 font-body text-sm">{labels[index % labels.length]}</span>
      </div>
    </motion.div>
  )
}

export default function Gallery({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasPhotos = theme.galleryImages.length > 0

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: theme.accent }}>
            Galerie
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Nos Plus Beaux Souvenirs
          </h2>
        </motion.div>

        <div className={`grid gap-4 ${hasPhotos ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'}`}>
          {hasPhotos
            ? theme.galleryImages.map((src, i) => (
                <PhotoCard key={src} src={src} index={i} accent={theme.accent} accentRgb={theme.accentRgb} />
              ))
            : Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} index={i} accent={theme.accent} accentRgb={theme.accentRgb} />
              ))
          }
        </div>
      </div>
    </section>
  )
}
