'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const VIDEO_ID = 'dNEnzdcnWzE'

interface MusicPlayerProps {
  name?: string
}

export default function MusicPlayer({ name = 'Papa' }: MusicPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [volume, setVolume] = useState(80)
  const [showControls, setShowControls] = useState(false)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          playlist: VIDEO_ID,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          start: 0,
        },
        events: {
          onReady: () => {
            setPlayerReady(true)
            playerRef.current.setVolume(80)
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            }
          },
        },
      })
    }

    return () => {
      window.onYouTubeIframeAPIReady = () => {}
    }
  }, [])

  const handlePlay = useCallback(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.playVideo()
      setTimeout(() => {
        setShowOverlay(false)
        setTimeout(() => setShowControls(true), 600)
      }, 800)
    }
  }, [playerReady])

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value)
    setVolume(vol)
    if (playerRef.current) {
      playerRef.current.setVolume(vol)
    }
  }, [])

  return (
    <>
      {/* Hidden YouTube player */}
      <div ref={containerRef} className="fixed bottom-0 left-0 w-0 h-0 opacity-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div id="yt-player" />
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 100 }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-dark-900/95 backdrop-blur-md" />

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-gold-500/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] md:w-[700px] md:h-[700px] rounded-full border border-gold-500/5"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="mb-8"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center glow-border">
                  <span className="text-4xl">🎵</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient mb-3"
              >
                Joyeux Anniversaire
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-white/40 font-body text-lg mb-10"
              >
                {name} — 2026
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                disabled={!playerReady}
                className="group relative px-10 py-4 bg-gradient-to-r from-gold-600 to-gold-500 rounded-full font-display text-dark-900 font-bold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {playerReady ? 'Écouter la musique' : 'Chargement...'}
                </span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-6 text-white/20 font-body text-xs"
              >
                Naza — Happy Birthday 🎂
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 sm:gap-3 bg-dark-800/90 border border-gold-500/20 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md"
            style={{ zIndex: 50 }}
          >
            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-dark-900"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Song info */}
            <span className="text-white/30 text-xs font-body hidden sm:inline ml-1">♫</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
