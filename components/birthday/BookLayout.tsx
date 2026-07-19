'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Theme } from '@/lib/themes'
import { Lightbox } from './Gallery'

// Types
interface BookLayoutProps {
  theme: Theme
}

// Web Audio API Page Flip sound synthesizer
const playPageFlipSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Create white noise buffer to simulate paper friction
    const sampleRate = ctx.sampleRate;
    const duration = 0.35; // 350ms
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Bandpass filter to sculpt the noise into a "rustle"
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    
    // Sweep the frequency downwards to mimic the page sliding through the air
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);
    
    // Gain envelope (fade out)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noiseSource.start();
  } catch (e) {
    console.warn("AudioContext blocked or failed:", e);
  }
}

export default function BookLayout({ theme }: BookLayoutProps) {
  const [currentSheet, setCurrentSheet] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [letterOpen, setLetterOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [lockUnlocked, setLockUnlocked] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)
  const [mounted, setMounted] = useState(false)

  
  // Calculate live age stats
  const [ageStats, setAgeStats] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
    totalDays: 0, totalWeeks: 0, heartbeats: 0
  })

  // Check mobile viewport and screen dimensions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setWindowWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Listen to sheet changes to play sound
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      playPageFlipSound()
    }
  }, [currentSheet])

  // Live timer for age calculation
  useEffect(() => {
    const calculateStats = () => {
      const birth = new Date(theme.birthYear, theme.birthMonth, theme.birthDay)
      const now = new Date()
      const diff = now.getTime() - birth.getTime()
      
      const totalSeconds = Math.floor(diff / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)
      const totalWeeks = Math.floor(totalDays / 7)
      const heartbeats = Math.floor(totalSeconds * 1.15)

      let years = now.getFullYear() - birth.getFullYear()
      let months = now.getMonth() - birth.getMonth()
      let days = now.getDate() - birth.getDate()
      let hours = now.getHours() - birth.getHours()
      let minutes = now.getMinutes() - birth.getMinutes()
      let seconds = now.getSeconds() - birth.getSeconds()

      if (seconds < 0) { seconds += 60; minutes-- }
      if (minutes < 0) { minutes += 60; hours-- }
      if (hours < 0) { hours += 24; days-- }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += prevMonth.getDate()
        months--
      }
      if (months < 0) { months += 12; years-- }

      setAgeStats({
        years, months, days, hours, minutes, seconds,
        totalDays, totalWeeks, heartbeats
      })
    }

    calculateStats()
    const timer = setInterval(calculateStats, 1000)
    return () => clearInterval(timer)
  }, [theme])

  const totalSheets = 5 

  const handleNext = () => {
    if (currentSheet === 0 && !lockUnlocked) {
      setLockUnlocked(true)
      setTimeout(() => {
        setCurrentSheet(1)
      }, 700)
    } else if (currentSheet < totalSheets) {
      setCurrentSheet((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSheet > 0) {
      if (currentSheet === 1) {
        setLockUnlocked(false)
      }
      setCurrentSheet((prev) => prev - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSheet, lockUnlocked])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const jumpToSheet = (sheetIndex: number) => {
    if (sheetIndex > 0) {
      setLockUnlocked(true)
    } else {
      setLockUnlocked(false)
    }
    setCurrentSheet(sheetIndex)
  }

  // Page contents rendering helpers
  const renderCover = () => (
    <div 
      className="w-full h-full rounded-r-2xl p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-[inset_-12px_0_40px_rgba(0,0,0,0.6),10px_10px_25px_rgba(0,0,0,0.4)] border-l border-white/10 relative overflow-hidden group"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #3a2c24 0%, #1a120e 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] mix-blend-overlay opacity-30 pointer-events-none" />

      <div className="absolute inset-4 border-2 border-dashed border-[#d4af37]/40 rounded-xl pointer-events-none" />
      <div className="absolute inset-6 border border-[#d4af37]/25 rounded-lg pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute w-2 h-2 bg-[#d4af37] rounded-full filter blur-[1px] top-[20%] left-[15%] animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-[#f0d060] rounded-full filter blur-[1px] top-[75%] left-[80%] animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
        <div className="absolute w-2.5 h-2.5 bg-[#ffdf00] rounded-full filter blur-[2px] top-[80%] left-[25%] animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '2.5s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[85%] animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '5s' }} />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative px-8 py-6 rounded-xl border border-[#ffdf00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_4px_rgba(255,255,255,0.4)] mb-8 overflow-hidden animate-shimmer-gold max-w-[280px] w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        <span className="text-3xl sm:text-4xl block mb-2 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">📖</span>
        <h2 className="font-display text-sm tracking-[0.2em] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] uppercase">
          Livre de Souvenirs
        </h2>
      </motion.div>

      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f9e4a0] to-[#d4af37] drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
        {theme.greeting}
      </h1>
      
      <p className="font-handwritten text-3xl text-[#f0d060] mb-8 font-semibold select-text">
        {theme.name}
      </p>

      <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mb-6" />

      <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#d4af37]/75 font-semibold uppercase mb-12">
        {theme.yearsRange}
      </p>

      <motion.div 
        animate={{
          x: lockUnlocked ? 30 : 0,
          opacity: lockUnlocked ? 0 : 1,
          rotate: lockUnlocked ? 45 : 0
        }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-16 bg-gradient-to-b from-[#e5c060] via-[#b8860b] to-[#996515] rounded-l-lg border-y border-l border-[#ffdf00] shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer z-50 group-hover:scale-105 transition-transform"
        onClick={handleNext}
      >
        <span className="text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{lockUnlocked ? '🔓' : '🔒'}</span>
        <div className="absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-[#ffdf00]/60 border border-black/20" />
        <div className="absolute left-1 bottom-2 w-1.5 h-1.5 rounded-full bg-[#ffdf00]/60 border border-black/20" />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,175,55,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f9e4a0] text-dark-900 font-display font-bold text-sm tracking-widest uppercase transition-all shadow-lg border border-[#ffdf00]/40 relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Commencer <span className="animate-bounce">➔</span>
        </span>
      </motion.button>
    </div>
  )

  const renderIntro = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:100%_26px] pointer-events-none mt-20" />
      
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="flex-1 flex flex-col min-h-0 pl-6 z-10 overflow-y-auto scrollbar-thin mt-4 pr-1">
        <span className="font-handwritten text-xl sm:text-2xl font-bold tracking-wider" style={{ color: theme.accent }}>
          {theme.subtext}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-3 tracking-wide leading-none" style={{ color: '#2c241c' }}>
          {theme.greeting}
        </h2>
        <div className="font-handwritten text-2xl sm:text-3xl font-semibold italic text-[#4a3f35] mb-3">
          {theme.name}
        </div>
        
        <div className="w-20 h-[3px] rounded mb-5 shadow-sm" style={{ background: theme.accent }} />

        <div className="font-handwritten text-lg sm:text-xl leading-relaxed text-[#5c4f43] space-y-4 max-w-md">
          <p>
            Chaque instant de notre existence est une page précieuse qui s&apos;écrit. 
          </p>
          <p>
            Ce cahier virtuel a été conçu avec amour pour immortaliser tes souvenirs, tes accomplissements et l&apos;affection de tes proches.
          </p>
          <p className="font-bold flex items-center gap-2">
            Tourne la page pour commencer la lecture... 
            <span className="text-xl animate-pulse">✨</span>
          </p>
        </div>
      </div>

      <div className="pl-6 flex justify-between items-center mb-1 pr-4 z-10">
        <span className="font-handwritten text-base text-[#8c7a6b] italic">
          {theme.birthLabel}
        </span>
        <span className="text-lg opacity-60 text-red-500 animate-pulse">❤</span>
      </div>
    </div>
  )

  const renderStats = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="flex-1 flex flex-col min-h-0 pl-6 z-10 overflow-y-auto scrollbar-thin mt-4 pr-1">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2c241c] mb-0.5">
          {theme.lifeStatsLabel}
        </h3>
        <p className="font-handwritten text-base text-[#8c7a6b] mb-4">
          Depuis ton arrivée le {theme.birthLabel}
        </p>

        {/* Live Age Flip */}
        <div className="bg-[#f2efe2] border border-[#dcd6bf] rounded-xl p-3 mb-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent h-[1px]" />
          
          <p className="font-body text-[9px] tracking-widest text-[#8c7a6b] uppercase mb-2 text-center font-bold">
            Âge exact en temps réel
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-white/80 rounded-lg p-1.5 border border-[#e5dfc9] shadow-sm">
              <span className="font-display text-lg sm:text-xl font-bold block" style={{ color: theme.accent }}>
                {ageStats.years}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#8c7a6b] font-semibold">Ans</span>
            </div>
            <div className="bg-white/80 rounded-lg p-1.5 border border-[#e5dfc9] shadow-sm">
              <span className="font-display text-lg sm:text-xl font-bold block" style={{ color: theme.accent }}>
                {ageStats.months}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#8c7a6b] font-semibold">Mois</span>
            </div>
            <div className="bg-white/80 rounded-lg p-1.5 border border-[#e5dfc9] shadow-sm">
              <span className="font-display text-lg sm:text-xl font-bold block" style={{ color: theme.accent }}>
                {ageStats.days}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#8c7a6b] font-semibold">Jours</span>
            </div>
            <div className="bg-white/80 rounded p-1.5 border border-[#e5dfc9] mt-0.5 shadow-sm">
              <span className="font-display text-xs font-semibold block text-[#5c5240]">
                {String(ageStats.hours).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase text-[#8c7a6b]">Heures</span>
            </div>
            <div className="bg-white/80 rounded p-1.5 border border-[#e5dfc9] mt-0.5 shadow-sm">
              <span className="font-display text-xs font-semibold block text-[#5c5240]">
                {String(ageStats.minutes).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase text-[#8c7a6b]">Min</span>
            </div>
            <div className="bg-white/80 rounded p-1.5 border border-[#e5dfc9] mt-0.5 shadow-sm">
              <span className="font-display text-xs font-semibold block text-[#5c5240] animate-pulse">
                {String(ageStats.seconds).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase text-[#8c7a6b]">Sec</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 border-b border-[#e5dfc9] pb-1.5">
            <span className="text-lg">☀️</span>
            <div className="flex-1 flex justify-between items-baseline">
              <span className="font-handwritten text-base text-[#5c4f43]">Jours vécus</span>
              <span className="font-display text-lg font-bold text-[#2c241c]">
                {ageStats.totalDays.toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-b border-[#e5dfc9] pb-1.5">
            <span className="text-lg">📅</span>
            <div className="flex-1 flex justify-between items-baseline">
              <span className="font-handwritten text-base text-[#5c4f43]">Semaines</span>
              <span className="font-display text-lg font-bold text-[#2c241c]">
                {ageStats.totalWeeks.toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-b border-[#e5dfc9] pb-1.5 relative group">
            <span className="text-lg">❤️</span>
            <div className="flex-1 flex justify-between items-baseline z-10">
              <span className="font-handwritten text-base text-[#5c4f43] font-bold">Battements de cœur</span>
              
              <div 
                className="absolute right-0 bottom-[4px] h-[14px] w-[130px] opacity-25 rounded-md -rotate-1 pointer-events-none"
                style={{ background: theme.accent }} 
              />
              
              <span className="font-display text-lg font-bold text-[#2c241c]">
                {ageStats.heartbeats.toLocaleString('fr-FR')}
              </span>
            </div>
            
            <div className="absolute right-[-10px] bottom-[-20px] flex items-center gap-1 opacity-60">
              <span className="font-handwritten text-[9px] text-gray-500 italic rotate-6">Rythme de vie !</span>
              <span className="text-[9px]">↙</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center font-handwritten text-sm text-[#8c7a6b] italic mt-6 mb-1 z-10 pl-6">
        &ldquo;Et chaque seconde de vie est une bénédiction.&rdquo;
      </p>
    </div>
  )

  const renderTimeline = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="flex-1 overflow-y-auto scrollbar-thin pl-6 pr-1 mt-4 z-10 min-h-0">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2c241c] mb-4">
          {theme.timelineTitle}
        </h3>

        <div className="relative pl-6 border-l-2 border-dashed border-[#dcd6bf] ml-2 space-y-5 py-1">
          {theme.timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              <div 
                className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-[#fcfaf2] flex items-center justify-center shadow-md scale-110 hover:scale-125 transition-transform"
                style={{ background: theme.accent }}
              />
              <div>
                <span className="font-display text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-black/5" style={{ background: `${theme.accent}20`, color: theme.accent }}>
                  {item.year}
                </span>
                <h4 className="font-display text-sm sm:text-base font-bold text-[#2c241c] mt-1.5">
                  {item.title}
                </h4>
                <p className="font-handwritten text-base sm:text-lg text-[#5c4f43] mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGallery = () => {
    const hasPhotos = theme.galleryImages.length > 0;

    return (
      <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

        <div className="flex-1 flex flex-col min-h-0 pl-6 z-10 mt-4 pr-1">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2c241c] mb-3">
            Souvenirs en Images
          </h3>

          {!hasPhotos ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#dcd6bf] rounded-2xl bg-white/40 shadow-sm">
              <span className="text-3xl mb-2">📸</span>
              <p className="font-handwritten text-lg text-[#8c7a6b]">
                Les photos de notre album seront épinglées ici.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 items-center justify-items-center mt-1 pb-4">
                {theme.galleryImages.slice(0, 4).map((src, idx) => {
                  const rotations = [-3, 4, -2, 3];
                  const rot = rotations[idx % rotations.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="relative bg-white p-2 pb-4 shadow-md border border-[#e2dcc5] cursor-pointer hover:rotate-0 hover:scale-105 hover:shadow-lg transition-all duration-300 max-w-[110px] sm:max-w-[125px]"
                      style={{ 
                        transform: `rotate(${rot}deg)`,
                      }}
                    >
                      <div 
                        className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-12 h-3.5 backdrop-blur-[1px] border border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rotate-[-3deg] z-10 opacity-75"
                        style={{
                          background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(212,175,55,0.3) 100%)',
                        }} 
                      />

                      <div className="aspect-square w-full overflow-hidden bg-gray-100 border border-black/5">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center font-handwritten text-[10px] text-[#8c7a6b] mt-1.5 italic">
                        Photo {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasPhotos && theme.galleryImages.length > 4 && (
            <button 
              onClick={() => setLightboxIndex(0)}
              className="mt-2 text-center font-handwritten text-base font-bold underline text-[#8c7a6b] hover:text-[#4a3f35] transition-colors mb-1"
            >
              Voir toutes les {theme.galleryImages.length} photos ➔
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderLetter = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="mt-4 pl-6 flex-1 flex flex-col justify-center items-center z-10 pr-1">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2c241c] mb-6 text-center">
          Une Lettre Secrète
        </h3>

        <div className="relative w-full max-w-[260px] aspect-[4/3] mt-2">
          <AnimatePresence>
            {!letterOpen ? (
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => setLetterOpen(true)}
                className="w-full h-full rounded-xl cursor-pointer shadow-md flex flex-col items-center justify-center border"
                style={{
                  background: 'linear-gradient(135deg, #30261c 0%, #1e1711 100%)',
                  borderColor: theme.accent,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${theme.accent}, ${theme.accent}cc)`,
                  }}
                >
                  <span className="text-[#0a0a0a] text-sm font-bold animate-pulse">❤</span>
                </div>
                <p className="font-handwritten text-lg text-white/80 mt-4">
                  Ouvrir l&apos;enveloppe
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-[-35px] sm:inset-[-50px] bg-[#faf6e8] p-4 sm:p-6 shadow-xl border border-[#dcd6bf] rounded-xl flex flex-col justify-between overflow-y-auto max-h-[350px]"
                style={{ zIndex: 100 }}
              >
                <div className="font-handwritten text-base sm:text-lg leading-relaxed text-[#3a2f1a]">
                  <p className="font-bold mb-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    {theme.letterSalutation}
                  </p>
                  {theme.letterBody.map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                  <p className="font-bold text-right mt-4 whitespace-pre-line italic" style={{ fontFamily: 'Georgia, serif' }}>
                    {theme.letterSign}
                  </p>
                </div>
                
                <button
                  onClick={() => setLetterOpen(false)}
                  className="mt-4 text-center font-handwritten text-xs text-[#8c7a6b] font-bold underline hover:text-[#4a3f35] pb-2"
                >
                  Refermer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="flex-1 flex flex-col min-h-0 pl-6 z-10 mt-4 pr-1">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2c241c] mb-3">
          Vœux Chaleureux
        </h3>

        <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {theme.messages.map((msg, idx) => {
              const bgColors = ['bg-[#fff9db]', 'bg-[#e3faf2]', 'bg-[#f4f2ff]', 'bg-[#fff0f6]'];
              const stickies = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]'];
              
              return (
                <div 
                  key={idx}
                  className={`${bgColors[idx % bgColors.length]} ${stickies[idx % stickies.length]} p-3 rounded shadow-md border border-black/5 flex flex-col justify-between min-h-[140px] hover:rotate-0 hover:scale-105 hover:shadow-lg transition-all duration-200`}
                >
                  <p className="font-handwritten text-xs sm:text-sm text-[#4a3f35] leading-tight italic">
                    &ldquo;{msg.text.length > 90 ? msg.text.substring(0, 87) + '...' : msg.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 border-t border-black/5 pt-1.5">
                    <span className="text-xs">{msg.emoji}</span>
                    <div className="leading-none">
                      <p className="font-display text-[9px] font-bold text-dark-900">{msg.name}</p>
                      <p className="font-handwritten text-[9px] text-gray-500">{msg.relation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderFinalWish = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="flex-1 flex flex-col min-h-0 pl-6 z-10 overflow-y-auto scrollbar-thin mt-4 pr-1 flex justify-center">
        <span className="text-center text-2xl mb-3 block animate-bounce">✨</span>
        <div className="font-handwritten text-xl sm:text-2xl text-center leading-relaxed text-[#4a3f35] space-y-3 max-w-sm mx-auto p-3 border border-[#e2dcc5] rounded-xl bg-white/20">
          {theme.finalWish.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        
        <div className="mt-6 text-center font-handwritten text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: theme.accent }}>
          {theme.finalSign}
        </div>
      </div>
    </div>
  )

  const renderClosing = () => (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col items-center justify-between bg-[#fcfaf2] text-[#2c241c] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/30" />

      <div className="pl-6 mt-10 text-center z-10">
        <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">
          Fin du Cahier
        </h3>
        <p className="font-handwritten text-lg text-[#8c7a6b] max-w-xs mx-auto leading-relaxed">
          Ce cahier reste ouvert pour y écrire de nouvelles pages de bonheur dans les années futures.
        </p>
      </div>

      <div className="w-full border-t border-[#e2dcc5] pt-4 pb-2 text-center pl-6 z-10">
        <p className="font-handwritten text-base text-[#8c7a6b]">
          {theme.footer}
        </p>
      </div>
    </div>
  )

  const renderBackCover = () => (
    <div 
      className="w-full h-full rounded-l-2xl shadow-[inset_12px_0_40px_rgba(0,0,0,0.6),-10px_10px_25px_rgba(0,0,0,0.4)] border-r border-white/10 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 70% 30%, #3a2c24 0%, #1a120e 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] mix-blend-overlay opacity-30 pointer-events-none" />
      <div className="absolute inset-4 border-2 border-dashed border-[#d4af37]/20 rounded-xl pointer-events-none" />
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div 
          className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center mb-6"
          style={{
            background: 'radial-gradient(circle, #221814 0%, #0d0806 100%)',
          }}
        >
          <span className="text-xl">❤️</span>
        </div>
        <p className="font-display text-sm tracking-[0.2em] text-[#d4af37]/45 uppercase text-center font-bold">
          {theme.yearsRange}
        </p>
      </div>
    </div>
  )

  // Double-page Layout (Desktop)
  const renderDoublePageLayout = () => {
    return (
      <div 
        className="relative w-full max-w-[1000px] h-[600px] select-none flex justify-center items-center"
        style={{ perspective: '2000px' }}
      >
        {/* Book cover spine shadow in the background */}
        <div className="absolute top-[-10px] bottom-[-10px] left-[5%] right-[5%] bg-[#1a1411]/90 rounded-2xl shadow-2xl border border-white/5 pointer-events-none" />
        
        {/* Realistic paper stack depth behind left side of the book */}
        <div className="absolute top-1 bottom-1 left-[5.5%] w-[44%] bg-[#e5dfc9] rounded-l-xl shadow-md border-r border-[#dcd6bf] z-[-1] pointer-events-none" />
        <div className="absolute top-2 bottom-2 left-[5.1%] w-[44%] bg-[#dfd9c0] rounded-l-xl shadow-md border-r border-[#dcd6bf] z-[-2] pointer-events-none" />

        {/* Realistic paper stack depth behind right side of the book */}
        <div className="absolute top-1 bottom-1 right-[5.5%] w-[44%] bg-[#e5dfc9] rounded-r-xl shadow-md border-l border-[#dcd6bf] z-[-1] pointer-events-none" />
        <div className="absolute top-2 bottom-2 right-[5.1%] w-[44%] bg-[#dfd9c0] rounded-r-xl shadow-md border-l border-[#dcd6bf] z-[-2] pointer-events-none" />

        {/* Outer pages container with animated translate-x for realistic opening center effect */}
        <motion.div 
          className="relative w-[90%] h-full flex overflow-visible"
          animate={{
            x: currentSheet === 0 ? '-25%' : currentSheet === totalSheets ? '25%' : '0%'
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 1, 0.5, 1]
          }}
        >
          {/* STATIC BASE LAYOUT */}
          {/* Left stiff page (under flipped pages) */}
          <motion.div 
            className="w-1/2 h-full bg-[#f6f2e4] rounded-l-xl overflow-hidden border-r border-black/10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] relative"
            animate={{
              opacity: currentSheet === 0 ? 0 : 1
            }}
            transition={{ duration: 0.4 }}
          >
            {currentSheet === 0 ? (
              <div className="w-full h-full bg-transparent" />
            ) : currentSheet === 1 ? (
              renderIntro()
            ) : currentSheet === 2 ? (
              renderTimeline()
            ) : currentSheet === 3 ? (
              renderLetter()
            ) : currentSheet === 4 ? (
              renderFinalWish()
            ) : (
              renderClosing()
            )}
          </motion.div>

          {/* Right stiff page (under unflipped pages) */}
          <motion.div 
            className="w-1/2 h-full bg-[#f6f2e4] rounded-r-xl overflow-hidden shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] relative"
            animate={{
              opacity: currentSheet === totalSheets ? 0 : 1
            }}
            transition={{ duration: 0.4 }}
          >
            {currentSheet === 0 ? (
              renderCover()
            ) : currentSheet === 1 ? (
              renderStats()
            ) : currentSheet === 2 ? (
              renderGallery()
            ) : currentSheet === 3 ? (
              renderMessages()
            ) : currentSheet === 4 ? (
              renderClosing()
            ) : (
              renderBackCover()
            )}
          </motion.div>

          {/* DYNAMIC FLIPPING SHEETS */}
          {Array.from({ length: totalSheets }).map((_, idx) => {
            const isFlipped = idx < currentSheet
            let zIndex = isFlipped ? idx + 1 : totalSheets - idx
            
            if (idx === currentSheet || idx === currentSheet - 1) {
              zIndex = 50
            }

            return (
              <motion.div
                key={idx}
                className="absolute top-0 left-1/2 w-1/2 h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  zIndex: zIndex,
                  pointerEvents: (idx === currentSheet || idx === currentSheet - 1) ? 'auto' : 'none'
                }}
                animate={{
                  rotateY: isFlipped ? -180 : 0
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.25, 1, 0.5, 1]
                }}
              >
                {/* FRONT FACE (Visible when page is on the right) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#fcfaf2] rounded-r-xl overflow-hidden shadow-[inset_10px_0_25px_rgba(0,0,0,0.12)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {idx === 0 && renderCover()}
                  {idx === 1 && renderStats()}
                  {idx === 2 && renderGallery()}
                  {idx === 3 && renderMessages()}
                  {idx === 4 && renderClosing()}
                </div>

                {/* BACK FACE (Visible when page is flipped to the left) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-[#fcfaf2] rounded-l-xl overflow-hidden shadow-[inset_-10px_0_25px_rgba(0,0,0,0.12)] border-r border-black/10"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {idx === 0 && renderIntro()}
                  {idx === 1 && renderTimeline()}
                  {idx === 2 && renderLetter()}
                  {idx === 3 && renderFinalWish()}
                  {idx === 4 && renderBackCover()}
                </div>
              </motion.div>
            )
          })}

          {/* Gold Satin Ribbon Bookmark hanging down */}
          {currentSheet > 0 && currentSheet < totalSheets && (
            <div 
              className="absolute top-0 left-[50.5%] w-4 h-56 bg-gradient-to-b from-[#d4af37] via-[#f0d060] to-[#b8860b] shadow-md origin-top z-40 pointer-events-none rounded-b-md" 
              style={{ 
                animation: 'sway 4s ease-in-out infinite' 
              }} 
            />
          )}

          {/* Spine Crease / Binding Rings down the center */}
          {currentSheet > 0 && currentSheet < totalSheets && (
            <>
              {/* Binder spiral rings */}
              <div className="absolute top-0 bottom-0 left-[50%] -translate-x-1/2 w-6 flex flex-col justify-around py-8 z-[100] pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="relative flex justify-center items-center">
                    {/* Ring Loop */}
                    <div 
                      className="w-4 h-7 rounded-full border-2 border-r-gray-300 border-t-gray-100 border-l-gray-400 border-b-gray-400 shadow-lg"
                      style={{
                        background: 'linear-gradient(90deg, #888 0%, #eee 50%, #666 100%)',
                        boxShadow: '0 4px 5px rgba(0,0,0,0.3)',
                      }}
                    />
                    {/* Tiny punched paper hole back shadow */}
                    <div className="absolute left-[-6px] w-2 h-2 rounded-full bg-black/35" />
                    <div className="absolute right-[-6px] w-2 h-2 rounded-full bg-black/35" />
                  </div>
                ))}
              </div>
              
              {/* Spine Crease Shadow overlay */}
              <div 
                className="absolute top-0 bottom-0 left-[50%] -translate-x-1/2 w-2 shadow-[0_0_12px_rgba(0,0,0,0.45)] pointer-events-none z-[99]" 
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.2) 100%)'
                }}
              />
            </>
          )}

        </motion.div>
      </div>
    )
  }

  // Single-page Layout (Mobile/Tablet)
  const renderSinglePageLayout = () => {
    const mobilePagesCount = 10

    const nextMobilePage = () => {
      if (mobilePage === 0 && !lockUnlocked) {
        setLockUnlocked(true)
        setTimeout(() => {
          setMobilePage(1)
        }, 600)
      } else if (mobilePage < mobilePagesCount - 1) {
        setMobilePage((prev) => prev + 1)
      }
    }

    const prevMobilePage = () => {
      if (mobilePage > 0) {
        if (mobilePage === 1) {
          setLockUnlocked(false)
        }
        setMobilePage((prev) => prev - 1)
      }
    }

    const jumpToMobilePage = (pageIdx: number) => {
      if (pageIdx > 0) {
        setLockUnlocked(true)
      } else {
        setLockUnlocked(false)
      }
      setMobilePage(pageIdx)
    }

    return (
      <div className="w-full max-w-[450px] min-h-[500px] flex flex-col justify-between items-center px-4 relative select-none">
        
        {/* Book frame background */}
        <div className="relative w-full h-[525px] rounded-2xl bg-[#faf6e8] shadow-2xl border border-[#dcd6bf] overflow-hidden flex flex-col">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={mobilePage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex-1"
            >
              {mobilePage === 0 && renderCover()}
              {mobilePage === 1 && renderIntro()}
              {mobilePage === 2 && renderStats()}
              {mobilePage === 3 && renderTimeline()}
              {mobilePage === 4 && renderGallery()}
              {mobilePage === 5 && renderLetter()}
              {mobilePage === 6 && renderMessages()}
              {mobilePage === 7 && renderFinalWish()}
              {mobilePage === 8 && renderClosing()}
              {mobilePage === 9 && renderBackCover()}
            </motion.div>
          </AnimatePresence>

          {/* Page index indicator */}
          <div className="absolute bottom-2 left-6 text-[10px] font-body text-[#8c7a6b] font-semibold">
            Page {mobilePage + 1} / 10
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center w-full mt-6 bg-dark-700/60 backdrop-blur border border-white/5 p-3 rounded-full shadow-lg">
          <button
            onClick={prevMobilePage}
            disabled={mobilePage === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#faf6e8] border border-[#dcd6bf] text-[#2c241c] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            ◀
          </button>

          <div className="font-handwritten text-xl font-bold text-white/90">
            {mobilePage === 0 && "Couverture"}
            {mobilePage === 1 && "Intro"}
            {mobilePage === 2 && "Chiffres"}
            {mobilePage === 3 && "Parcours"}
            {mobilePage === 4 && "Photos"}
            {mobilePage === 5 && "Lettre"}
            {mobilePage === 6 && "Vœux"}
            {mobilePage === 7 && "Vœu Final"}
            {mobilePage === 8 && "Fin"}
            {mobilePage === 9 && "Dos"}
          </div>

          <button
            onClick={nextMobilePage}
            disabled={mobilePage === mobilePagesCount - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#faf6e8] border border-[#dcd6bf] text-[#2c241c] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            ▶
          </button>
        </div>

        {/* Small tabs menu underneath */}
        <div className="flex gap-1.5 flex-wrap justify-center mt-4 max-w-full">
          <button onClick={() => jumpToMobilePage(0)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 0 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Couv</button>
          <button onClick={() => jumpToMobilePage(2)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 2 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Stats</button>
          <button onClick={() => jumpToMobilePage(3)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 3 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Parcours</button>
          <button onClick={() => jumpToMobilePage(4)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 4 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Photos</button>
          <button onClick={() => jumpToMobilePage(5)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 5 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Lettre</button>
          <button onClick={() => jumpToMobilePage(6)} className={`px-2.5 py-1 rounded-md text-[10px] font-body transition-colors ${mobilePage === 6 ? 'bg-[#d4af37] text-dark-900 font-bold' : 'bg-dark-800 text-white/50 hover:bg-dark-700'}`}>Vœux</button>
        </div>
      </div>
    )
  }

  // Sidebar bookmark tabs (Desktop only)
  const renderSidebarTabs = () => {
    if (isMobile) return null

    const tabs = [
      { label: 'Couv', sheet: 0 },
      { label: 'Stats', sheet: 1 },
      { label: 'Parcours', sheet: 2 },
      { label: 'Lettre', sheet: 3 },
      { label: 'Vœux', sheet: 4 },
    ]

    return (
      <div className="absolute right-[-68px] top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-50">
        {tabs.map((tab, idx) => {
          const isActive = currentSheet === tab.sheet
          
          return (
            <button
              key={idx}
              onClick={() => jumpToSheet(tab.sheet)}
              className="pl-4 pr-2 py-2 rounded-r-xl font-handwritten text-lg font-bold shadow-md hover:translate-x-1.5 transition-all border-y border-r border-[#dcd6bf] text-left w-[75px]"
              style={{
                background: isActive ? theme.accent : '#faf6e8',
                color: isActive ? '#0a0a0a' : '#2c241c',
                boxShadow: isActive ? `0 0 15px rgba(${theme.accentRgb}, 0.5)` : 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-4 select-none relative z-10 font-body">
      
      {/* Self-contained CSS Animations for Sway & Plaque Shimmer */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: translate(10px) rotate(0deg); }
          50% { transform: translate(10px) rotate(2deg) translateX(3px); }
        }
        @keyframes shimmer-gold {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .animate-shimmer-gold {
          background: linear-gradient(135deg, #b8860b 0%, #e5c060 25%, #ffdf00 50%, #e5c060 75%, #b8860b 100%);
          background-size: 400px 100%;
          animation: shimmer-gold 6s infinite linear;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2dcc5;
          border-radius: 2px;
        }
      `}</style>

      {/* Book Container with responsive layout */}
      <div className="relative w-full max-w-[1000px] flex justify-center items-center">
        {isMobile ? renderSinglePageLayout() : renderDoublePageLayout()}
        {renderSidebarTabs()}
      </div>

      {/* Outer Navigation Controls (Desktop) */}
      {!isMobile && (
        <div className="mt-8 flex justify-center items-center gap-6 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentSheet === 0}
            className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-dark-700/50 backdrop-blur text-white text-xs tracking-widest uppercase transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
          >
            ◀ Précédent
          </motion.button>
          
          <span className="font-handwritten text-2xl text-white/70">
            {currentSheet === 0 ? "Fermé" : `Double-page ${currentSheet} / ${totalSheets - 1}`}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentSheet === totalSheets}
            className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-[#faf6e8] text-[#2c241c] hover:bg-white text-xs tracking-widest uppercase transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md font-bold"
          >
            Suivant ▶
          </motion.button>
        </div>
      )}

      {/* Gallery Lightbox Integration */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={theme.galleryImages}
            index={lightboxIndex}
            accent={theme.accent}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
