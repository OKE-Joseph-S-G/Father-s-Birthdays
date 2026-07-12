'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

interface PhotoSlot {
  id: number
  label: string
}

const photoSlots: PhotoSlot[] = [
  { id: 1, label: 'Enfance' },
  { id: 2, label: 'Jeunesse' },
  { id: 3, label: 'Famille' },
  { id: 4, label: 'Moments' },
  { id: 5, label: 'Aventure' },
  { id: 6, label: 'Bonheur' },
  { id: 7, label: 'Souvenirs' },
  { id: 8, label: 'Rires' },
]

function PhotoCard({ slot, index }: { slot: PhotoSlot; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group cursor-pointer aspect-square"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full h-full rounded-2xl bg-dark-700 border border-gold-500/20 overflow-hidden transition-all duration-500 group-hover:border-gold-500/60 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        {/* Placeholder */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-dark-700 to-dark-800">
          <motion.div
            animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-12 h-12 text-gold-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <span className="text-white/30 font-body text-sm">{slot.label}</span>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-gold-500/10 backdrop-blur-[2px] flex items-center justify-center rounded-2xl"
        >
          <span className="text-gold-500 font-body text-sm tracking-wider uppercase">
            Ajouter une photo
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 font-body text-sm tracking-[0.3em] uppercase mb-4">
            Galerie
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gold-gradient">
            Nos Plus Beaux Souvenirs
          </h2>
          <p className="mt-4 text-white/40 font-body max-w-md mx-auto">
            Remplis cette galerie avec les photos qui comptent le plus
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photoSlots.map((slot, index) => (
            <PhotoCard key={slot.id} slot={slot} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
