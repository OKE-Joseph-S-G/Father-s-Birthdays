'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const CORRECT_ANSWER = '1978'
const MAX_ATTEMPTS = 3

export default function SecretGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [unlocked, setUnlocked] = useState(false)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = sessionStorage.getItem('secretGate')
    if (saved === 'unlocked') {
      onUnlocked()
    }
  }, [onUnlocked])

  useEffect(() => {
    if (mounted && !unlocked && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mounted, unlocked])

  if (!mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim() === CORRECT_ANSWER) {
      setShowConfetti(true)
      sessionStorage.setItem('secretGate', 'unlocked')
      setTimeout(() => {
        setUnlocked(true)
        setTimeout(() => onUnlocked(), 600)
      }, 1500)
    } else {
      setError(true)
      setAttempts((prev) => prev + 1)
      setAnswer('')
      setTimeout(() => setError(false), 600)
    }
  }

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex flex-col items-center justify-center px-4"
          style={{ zIndex: 200 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-dark-900/98 backdrop-blur-lg" />

          {/* Decorative rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full border border-gold-500/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[550px] h-[550px] sm:w-[700px] sm:h-[700px] rounded-full border border-gold-500/3"
          />

          {/* Confetti */}
          <AnimatePresence>
            {showConfetti && (
              <>
                {Array.from({ length: 60 }).map((_, i) => {
                  const colors = ['#d4af37', '#f0d060', '#ff6b6b', '#4ecdc4', '#fff', '#ff9f43']
                  const color = colors[i % colors.length]
                  const angle = (Math.PI * 2 * i) / 60
                  const velocity = 5 + Math.random() * 8
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * velocity * 40,
                        y: Math.sin(angle) * velocity * 40 + 100,
                        opacity: [1, 1, 0],
                        rotate: Math.random() * 720,
                      }}
                      transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
                      className="absolute rounded-sm pointer-events-none"
                      style={{
                        width: 6 + Math.random() * 6,
                        height: 4 + Math.random() * 4,
                        background: color,
                      }}
                    />
                  )
                })}
              </>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            {/* Lock icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mb-8"
            >
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center glow-border"
                  style={{
                    background: showConfetti
                      ? 'radial-gradient(circle, #4ade80, #166534)'
                      : 'radial-gradient(circle at 30% 30%, #d4af37, #8a6d00)',
                    boxShadow: showConfetti
                      ? '0 0 40px rgba(74, 222, 128, 0.4)'
                      : '0 0 30px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <motion.span
                    animate={showConfetti ? { rotate: [0, -20, 20, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-4xl sm:text-5xl"
                  >
                    {showConfetti ? '🔓' : '🔒'}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-2xl sm:text-3xl font-bold gold-gradient mb-3"
            >
              {showConfetti ? 'Bienvenue !' : 'Accès Réservé'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/40 font-body text-sm mb-8"
            >
              {showConfetti
                ? 'Que la fête commence...'
                : 'Réponds à la question pour accéder au site'}
            </motion.p>

            {/* Form */}
            {!showConfetti && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="w-full"
              >
                {/* Question */}
                <div className="bg-dark-700/50 border border-gold-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                  <p className="text-gold-500/80 font-body text-xs tracking-[0.2em] uppercase mb-3">
                    Question secrète
                  </p>
                  <p className="font-display text-lg sm:text-xl text-white/90 font-semibold">
                    En quelle année est né Papa ?
                  </p>
                </div>

                {/* Input */}
                <div className="relative mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value)
                      setError(false)
                    }}
                    placeholder="Ta réponse..."
                    maxLength={4}
                    className="w-full bg-dark-700/60 border border-gold-500/30 rounded-xl px-6 py-4 text-center font-display text-2xl sm:text-3xl text-white tracking-[0.3em] placeholder:text-white/15 placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-gold-500/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!answer}
                  className="w-full py-4 rounded-xl font-display text-dark-900 font-bold text-lg tracking-wide transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #f0d060)',
                    boxShadow: answer ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                  }}
                >
                  Déverrouiller
                </motion.button>

                {/* Attempts */}
                {attempts > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center font-body text-sm"
                  >
                    {attempts >= MAX_ATTEMPTS ? (
                      <span className="text-gold-500/60">
                        Indice : Pense à l&apos;année de sa naissance...
                      </span>
                    ) : (
                      <span className="text-red-400/60">
                        Mauvaise réponse... {MAX_ATTEMPTS - attempts} essai{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} restant{MAX_ATTEMPTS - attempts > 1 ? 's' : ''}
                      </span>
                    )}
                  </motion.p>
                )}
              </motion.form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
