'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function SplashScreen() {
  const [show, setShow] = useState(true)
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 1800)
    const t2 = setTimeout(() => {
      setShow(false)
      setTimeout(() => setPhase('done'), 500)
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-dark-900"
          style={{ zIndex: 9999 }}
        >
          {/* Background radial glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.15 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
          />

          {/* Spinning ring */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute w-32 h-32 md:w-40 md:h-40"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: '2px solid transparent',
                borderTopColor: '#d4af37',
                borderRightColor: 'rgba(212, 175, 55, 0.3)',
              }}
            />
          </motion.div>

          {/* Inner spinning ring (reverse) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: -360 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute w-24 h-24 md:w-28 md:h-28"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: '1.5px solid transparent',
                borderBottomColor: '#f0d060',
                borderLeftColor: 'rgba(240, 208, 96, 0.3)',
              }}
            />
          </motion.div>

          {/* Center content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Cake emoji with glow */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <span className="text-5xl md:text-6xl drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">🎂</span>
            </motion.div>

            {/* Loading bar */}
            <div className="mt-8 w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8a6d00, #d4af37, #f0d060)' }}
              />
            </div>

            {/* Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-4 text-white/30 font-body text-xs tracking-[0.3em] uppercase"
            >
              Préparation...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
