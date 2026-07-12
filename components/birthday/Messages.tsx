'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useCallback } from 'react'
import { type Theme } from '@/lib/themes'

function MessageCard({ msg, index, accent, accentRgb }: { msg: { name: string; relation: string; text: string; emoji: string }; index: number; accent: string; accentRgb: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group"
      style={{ perspective: '800px' }}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: isHovered ? -8 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-dark-700/60 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden"
        style={{
          border: `1px solid rgba(${accentRgb}, 0.15)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(${accentRgb}, 0.08)`
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{ background: `radial-gradient(circle at ${(tilt.y / 12 + 0.5) * 100}% ${(tilt.x / -12 + 0.5) * 100}%, rgba(${accentRgb}, 0.08) 0%, transparent 60%)` }} />

        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
          style={{ background: `linear-gradient(to bottom left, rgba(${accentRgb}, 0.05), transparent)` }} />

        <span className="text-3xl mb-4 block" style={{ transform: 'translateZ(20px)' }}>{msg.emoji}</span>
        <p className="font-body text-white/70 text-sm leading-relaxed italic mb-6 relative z-10" style={{ transform: 'translateZ(10px)' }}>
          &ldquo;{msg.text}&rdquo;
        </p>
        <div className="flex items-center gap-3" style={{ transform: 'translateZ(15px)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
            <span className="font-display font-bold text-sm" style={{ color: '#0a0a0a' }}>{msg.name[0]}</span>
          </div>
          <div>
            <p className="font-display text-white font-semibold text-sm">{msg.name}</p>
            <p className="font-body text-xs" style={{ color: `${accent}99` }}>{msg.relation}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Messages({ theme }: { theme: Theme }) {
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
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: theme.accent }}>
            Les vœux
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Ceux qui T&apos;aiment
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theme.messages.map((msg, index) => (
            <MessageCard key={msg.name} msg={msg} index={index} accent={theme.accent} accentRgb={theme.accentRgb} />
          ))}
        </div>
      </div>
    </section>
  )
}
