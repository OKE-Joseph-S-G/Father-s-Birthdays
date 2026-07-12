'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect, useRef } from 'react'

function ConfettiParticle({ x, y }: { x: number; y: number }) {
  const colors = ['#d4af37', '#f0d060', '#ff6b6b', '#4ecdc4', '#fff', '#ff9f43', '#a29bfe']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const angle = Math.random() * Math.PI * 2
  const velocity = 3 + Math.random() * 6
  const dx = Math.cos(angle) * velocity
  const dy = Math.sin(angle) * velocity - 5

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: dx * 30,
        y: dy * 30 + 120,
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.5],
        rotate: Math.random() * 720 - 360,
      }}
      transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 8 + Math.random() * 6,
        height: 4 + Math.random() * 4,
        background: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  )
}

function Candle({ index, lit, onExtinguish }: { index: number; lit: boolean; onExtinguish: () => void }) {
  return (
    <motion.div
      className="relative cursor-pointer flex flex-col items-center"
      onClick={(e) => {
        e.stopPropagation()
        if (lit) onExtinguish()
      }}
      whileHover={lit ? { scale: 1.1 } : {}}
      whileTap={lit ? { scale: 0.9 } : {}}
    >
      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative mb-1"
          >
            <motion.div
              animate={{
                scaleY: [1, 1.2, 0.9, 1.1, 1],
                scaleX: [1, 0.9, 1.1, 0.95, 1],
              }}
              transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.3 }}
              className="w-3 h-5 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at bottom, #fff 0%, #ffd700 30%, #ff8c00 60%, #ff4500 100%)',
                filter: 'blur(0.5px)',
              }}
            />
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 200, 0, 0.3) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candle body */}
      <div
        className="w-2 h-8 rounded-t-full"
        style={{
          background: `linear-gradient(180deg, #f0d060 0%, #d4af37 50%, #b8960f 100%)`,
        }}
      />

      {/* Wax drip */}
      <div className="absolute top-3 -left-0.5 w-3 h-2 rounded-b-full bg-gold-400/60" />
    </motion.div>
  )
}

export default function InteractiveCake({ onAllExtinguished }: { onAllExtinguished?: () => void }) {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true, true, true])
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number }[]>([])
  const [allDone, setAllDone] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)
  const confettiId = useRef(0)
  const cakeRef = useRef<HTMLDivElement>(null)

  const extinguishCandle = useCallback((index: number) => {
    setCandlesLit((prev) => {
      const next = [...prev]
      next[index] = false
      return next
    })

    const rect = cakeRef.current?.getBoundingClientRect()
    if (rect) {
      const newConfetti = Array.from({ length: 15 }, () => ({
        id: confettiId.current++,
        x: rect.width / 2 + (Math.random() - 0.5) * 40,
        y: rect.height / 2 - 40,
      }))
      setConfetti((prev) => [...prev, ...newConfetti])
      setTimeout(() => {
        setConfetti((prev) => prev.filter((c) => !newConfetti.find((n) => n.id === c.id)))
      }, 2500)
    }
  }, [])

  useEffect(() => {
    if (candlesLit.every((l) => !l)) {
      setAllDone(true)
      onAllExtinguished?.()
    }
  }, [candlesLit, onAllExtinguished])

  const handleCakeClick = () => {
    setClickCount((prev) => {
      const next = prev + 1
      if (next >= 3 && !easterEgg) {
        setEasterEgg(true)
        const rect = cakeRef.current?.getBoundingClientRect()
        if (rect) {
          const bigConfetti = Array.from({ length: 80 }, () => ({
            id: confettiId.current++,
            x: rect.width / 2 + (Math.random() - 0.5) * 200,
            y: rect.height / 2 - 60,
          }))
          setConfetti((prev) => [...prev, ...bigConfetti])
          setTimeout(() => {
            setConfetti((prev) => prev.filter((c) => !bigConfetti.find((n) => n.id === c.id)))
          }, 3000)
        }
      }
      return next
    })
  }

  return (
    <div ref={cakeRef} className="relative inline-block" onClick={handleCakeClick}>
      {/* Confetti container */}
      <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
        <AnimatePresence>
          {confetti.map((c) => (
            <ConfettiParticle key={c.id} x={c.x} y={c.y} />
          ))}
        </AnimatePresence>
      </div>

      {/* Cake */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative flex flex-col items-center select-none"
      >
        {/* Candles */}
        <div className="flex items-end gap-3 mb-1 -mt-2">
          {candlesLit.map((lit, i) => (
            <Candle key={i} index={i} lit={lit} onExtinguish={() => extinguishCandle(i)} />
          ))}
        </div>

        {/* Top tier */}
        <div className="relative">
          <div
            className="w-32 h-10 rounded-t-lg"
            style={{
              background: 'linear-gradient(180deg, #d4af37 0%, #b8960f 100%)',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[110%] h-3 rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #f0d060 0%, #d4af37 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Middle tier */}
        <div className="relative -mt-1">
          <div
            className="w-44 h-10 rounded-t-lg"
            style={{
              background: 'linear-gradient(180deg, #b8960f 0%, #8a6d00 100%)',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          />
          {/* Frosting drips */}
          {[20, 40, 60, 80].map((pos) => (
            <div
              key={pos}
              className="absolute -top-1 rounded-b-full bg-gold-400/80"
              style={{
                left: `${pos}%`,
                width: 6 + Math.random() * 4,
                height: 8 + Math.random() * 6,
              }}
            />
          ))}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[115%] h-3 rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #f0d060 0%, #d4af37 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Bottom tier */}
        <div className="relative -mt-1">
          <div
            className="w-56 h-12 rounded-t-lg"
            style={{
              background: 'linear-gradient(180deg, #8a6d00 0%, #5c4a00 100%)',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          />
          {[15, 30, 50, 70, 85].map((pos) => (
            <div
              key={pos}
              className="absolute -top-1 rounded-b-full bg-gold-500/70"
              style={{
                left: `${pos}%`,
                width: 5 + Math.random() * 5,
                height: 6 + Math.random() * 8,
              }}
            />
          ))}
        </div>

        {/* Plate */}
        <div
          className="w-64 h-4 rounded-b-full -mt-0.5"
          style={{
            background: 'linear-gradient(180deg, #f0d060 0%, #d4af37 50%, #b8960f 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          }}
        />
      </motion.div>

      {/* Status text */}
      <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          {allDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <p className="font-display text-2xl md:text-3xl gold-gradient font-bold">
                Joyeux Anniversaire Papa !
              </p>
              <p className="text-white/40 font-body text-sm mt-2">
                48 bougies éteintes, 48 vœux exaucés
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/30 font-body text-sm"
            >
              Souffle les bougies en cliquant dessus
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
