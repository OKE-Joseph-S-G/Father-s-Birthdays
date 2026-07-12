'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface TimelineItem {
  year: string
  title: string
  description: string
}

const timelineData: TimelineItem[] = [
  {
    year: '1978',
    title: 'La naissance d\'un héros',
    description: 'Le jour où le monde a gagné une personne extraordinaire.',
  },
  {
    year: '1998',
    title: 'Jeune & Ambitieux',
    description: 'Le début d\'une belle aventure, pleine de rêves et de détermination.',
  },
  {
    year: '2005',
    title: 'Fondation',
    description: 'La création de notre famille, le plus beau des cadeaux.',
  },
  {
    year: '2010',
    title: 'Années de croissance',
    description: 'Chaque jour une nouvelle leçon, chaque année un nouveau souvenir.',
  },
  {
    year: '2020',
    title: 'Force & Sagesse',
    description: 'Prouver que rien ne peut arrêter un cœur déterminé.',
  },
  {
    year: '2026',
    title: 'Joyeux Anniversaire !',
    description: '48 ans de bonheur partagé. Le meilleur reste à venir !',
  },
]

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex items-center mb-16 md:mb-0">
      {/* Mobile layout */}
      <div className="md:hidden flex items-start gap-6 w-full">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 rounded-full bg-dark-700 border-2 border-gold-500 flex items-center justify-center glow-border"
          >
            <div className="w-4 h-4 rounded-full bg-gold-500" />
          </motion.div>
          <div className="w-[2px] h-full bg-gradient-to-b from-gold-500/50 to-transparent min-h-[60px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-700/50 border border-gold-500/20 rounded-2xl p-6 backdrop-blur-sm flex-1"
        >
          <span className="text-gold-500 font-display text-sm tracking-wider">{item.year}</span>
          <h3 className="font-display text-xl font-bold text-white mt-1">{item.title}</h3>
          <p className="text-white/50 font-body text-sm mt-2">{item.description}</p>
        </motion.div>
      </div>

      {/* Desktop layout */}
      <div className={`hidden md:flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-[calc(50%-40px)] bg-dark-700/50 border border-gold-500/20 rounded-2xl p-8 backdrop-blur-sm ${
            isLeft ? 'text-right mr-auto' : 'text-left ml-auto'
          }`}
        >
          <span className="text-gold-500 font-display text-sm tracking-wider">{item.year}</span>
          <h3 className="font-display text-2xl font-bold text-white mt-1">{item.title}</h3>
          <p className="text-white/50 font-body mt-3">{item.description}</p>
        </motion.div>

        <div className="flex flex-col items-center mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-dark-700 border-2 border-gold-500 flex items-center justify-center glow-border"
          >
            <div className="w-4 h-4 rounded-full bg-gold-500" />
          </motion.div>
        </div>

        <div className="w-[calc(50%-40px)]" />
      </div>
    </div>
  )
}

export default function Timeline() {
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
          <p className="text-gold-500 font-body text-sm tracking-[0.3em] uppercase mb-4">
            Son parcours
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gold-gradient">
            Une Vie Extraordinaire
          </h2>
        </motion.div>

        {/* Vertical line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-64 bottom-32 w-[2px] bg-gradient-to-b from-gold-500/50 via-gold-500/20 to-transparent -translate-x-1/2" />

        <div className="space-y-8 md:space-y-0">
          {timelineData.map((item, index) => (
            <TimelineCard key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
