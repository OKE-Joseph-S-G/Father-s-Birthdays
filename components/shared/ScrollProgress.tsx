'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #8a6d00, #d4af37, #f0d060, #d4af37, #8a6d00)',
        zIndex: 100,
        boxShadow: '0 0 10px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.3)',
      }}
    />
  )
}
