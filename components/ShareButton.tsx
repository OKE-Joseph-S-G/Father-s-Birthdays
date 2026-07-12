'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackShare } from '@/components/Analytics'

const SITE_URL = 'https://father-s-birthdays.vercel.app'
const MESSAGE = "Regarde le site d'anniversaire de Papa ! 🎂"

export default function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function shareWhatsApp() {
    trackShare()
    window.open(`https://wa.me/?text=${encodeURIComponent(MESSAGE + '\n' + SITE_URL)}`, '_blank')
    setOpen(false)
  }

  async function shareInstagram() {
    trackShare()
    window.open(`https://www.instagram.com/`, '_blank')
    setOpen(false)
  }

  async function copyLink() {
    trackShare()
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = SITE_URL
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function shareNative() {
    trackShare()
    if (navigator.share) {
      navigator.share({ title: "Site d'anniversaire de Papa", text: MESSAGE, url: SITE_URL })
    }
    setOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 100 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-[#1a1a1a] border border-white/10 rounded-2xl p-3 shadow-2xl min-w-[200px]"
          >
            <p className="text-white/40 text-xs px-3 pb-2 uppercase tracking-wider">Partager</p>
            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg">💬</span>
              <span className="text-white text-sm">WhatsApp</span>
            </button>
            <button
              onClick={shareInstagram}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg">📸</span>
              <span className="text-white text-sm">Instagram</span>
            </button>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg">{copied ? '✅' : '🔗'}</span>
              <span className="text-white text-sm">{copied ? 'Copié !' : 'Copier le lien'}</span>
            </button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={shareNative}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-lg">📤</span>
                <span className="text-white text-sm">Partager...</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          background: open
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(135deg, #d4af37, #f0d060)',
          boxShadow: open
            ? 'none'
            : '0 4px 20px rgba(212, 175, 55, 0.4)',
        }}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl"
        >
          {open ? '✕' : '📤'}
        </motion.span>
      </motion.button>
    </div>
  )
}
