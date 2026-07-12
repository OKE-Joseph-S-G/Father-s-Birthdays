'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { type Theme } from '@/lib/themes'

export default function LetterReveal({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: theme.accent }}>
            Une lettre pour toi
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Du Fond du Cœur
          </h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/30 font-body text-sm">
            {isOpen ? 'Clique pour refermer' : 'Clique pour ouvrir l\'enveloppe'}
          </motion.p>
        </motion.div>

        <div className="relative mx-auto max-w-lg">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -30, scaleY: 0.8 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -30, scaleY: 0.8 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="origin-bottom rounded-xl p-6 sm:p-8 md:p-10 mb-4"
                style={{
                  background: 'linear-gradient(180deg, #faf6e8 0%, #f5edd6 100%)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  zIndex: 2,
                }}
              >
                <div className="font-body text-xs sm:text-sm md:text-base leading-relaxed" style={{ color: '#3a2f1a' }}>
                  <p className="mb-4 text-base sm:text-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {theme.letterSalutation}
                  </p>
                  {theme.letterBody.map((p, i) => (
                    <p key={i} className="mb-3">{p}</p>
                  ))}
                  <p className="font-bold mt-4 text-right whitespace-pre-line" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {theme.letterSign}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen((prev) => !prev)}
            animate={isOpen ? { scale: 0.85, opacity: 0.6 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[4/3] rounded-2xl cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #2a2215 0%, #1a1610 100%)',
              border: `2px solid rgba(${theme.accentRgb}, 0.3)`,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <motion.div
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-1/2 origin-top"
              style={{ perspective: '500px', transformStyle: 'preserve-3d', zIndex: 3 }}
            >
              <div className="w-full h-full"
                style={{
                  background: 'linear-gradient(180deg, #3a2f1a 0%, #2a2215 100%)',
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  backfaceVisibility: 'hidden',
                }} />
            </motion.div>

            <AnimatePresence>
              {!isOpen && (
                <motion.div exit={{ scale: 2, opacity: 0 }} transition={{ duration: 0.4 }}
                  className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 4 }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${theme.accent}, ${theme.accent}88)`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
                    }}>
                    <span className="font-display font-bold text-xs" style={{ color: '#0a0a0a' }}>❤</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 h-1/2"
              style={{
                background: 'linear-gradient(0deg, #1a1610 0%, #2a2215 100%)',
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                zIndex: 2,
              }} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
