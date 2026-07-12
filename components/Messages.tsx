'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useCallback } from 'react'

interface Message {
  name: string
  relation: string
  text: string
  emoji: string
}

const messages: Message[] = [
  {
    name: 'Maman',
    relation: 'Épouse',
    text: 'Merci d\'être le pilier de notre famille. Tu es l\'homme le plus incroyable que je connaisse. Je t\'aime.',
    emoji: '❤️',
  },
  {
    name: 'Tes enfants',
    relation: 'Fils & Fille',
    text: 'Papa, tu es notre héros. Merci pour tout l\'amour, la patience et les fous rires. Joyeux anniversaire !',
    emoji: '🎉',
  },
  {
    name: 'Ta famille',
    relation: 'Parents & Frères/Sœurs',
    text: 'Depuis 1978, tu illuminés nos vies. Que Dieu te bénisse pour de longues et belles années.',
    emoji: '🙏',
  },
  {
    name: 'Tes amis',
    relation: 'Les amis fidèles',
    text: 'Un homme droit, généreux et toujours prêt à aider. Tu mérites le meilleur. Joyeux anniversaire !',
    emoji: '🥂',
  },
]

function MessageCard({ msg, index }: { msg: Message; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (y - 0.5) * -12,
      y: (x - 0.5) * 12,
    })
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
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-dark-700/60 border border-gold-500/15 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.08)'
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Shine effect that follows mouse */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${(tilt.y / 12 + 0.5) * 100}% ${(tilt.x / -12 + 0.5) * 100}%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)`,
          }}
        />

        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-500/5 to-transparent rounded-bl-full" />

        <span className="text-3xl mb-4 block" style={{ transform: 'translateZ(20px)' }}>{msg.emoji}</span>

        <p className="font-body text-white/70 text-sm leading-relaxed italic mb-6 relative z-10" style={{ transform: 'translateZ(10px)' }}>
          &ldquo;{msg.text}&rdquo;
        </p>

        <div className="flex items-center gap-3" style={{ transform: 'translateZ(15px)' }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
            <span className="text-dark-900 font-display font-bold text-sm">
              {msg.name[0]}
            </span>
          </div>
          <div>
            <p className="font-display text-white font-semibold text-sm">{msg.name}</p>
            <p className="text-gold-500/60 font-body text-xs">{msg.relation}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Messages() {
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
            Les vœux
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gold-gradient">
            Ceux qui T&apos;aiment
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg, index) => (
            <MessageCard key={msg.name} msg={msg} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
