'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="py-8 flex justify-center">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="flex items-center gap-4"
      >
        <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-gold-500/50" />
        <div className="w-2 h-2 rotate-45 bg-gold-500/60" />
        <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-gold-500/50" />
      </motion.div>
    </div>
  )
}
