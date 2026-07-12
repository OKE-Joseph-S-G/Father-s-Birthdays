'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  decay: number
  gravity: number
}

interface Firework {
  x: number
  y: number
  particles: Particle[]
  done: boolean
}

const COLORS = ['#d4af37', '#f0d060', '#ff6b6b', '#4ecdc4', '#fff', '#ff9f43', '#a29bfe']

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let fireworks: Firework[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const createFirework = (): Firework => {
      const x = Math.random() * canvas.width
      const y = canvas.height
      const targetY = Math.random() * canvas.height * 0.5
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const particles: Particle[] = []

      const angle = Math.atan2(targetY - y, -x + x)
      const speed = 4 + Math.random() * 2

      return {
        x,
        y,
        done: false,
        particles: [{
          x,
          y,
          vx: 0,
          vy: -speed,
          size: 2,
          color,
          alpha: 1,
          decay: 0,
          gravity: 0,
        }],
      }
    }

    const explode = (fw: Firework) => {
      const count = 60 + Math.floor(Math.random() * 40)
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      fw.particles = []
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
        const speed = 1 + Math.random() * 4
        fw.particles.push({
          x: fw.x,
          y: fw.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2,
          color,
          alpha: 1,
          decay: 0.01 + Math.random() * 0.02,
          gravity: 0.03,
        })
      }
      fw.done = false
    }

    let frameCount = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frameCount++
      if (frameCount % 60 === 0 && fireworks.length < 5) {
        const fw = createFirework()
        fireworks.push(fw)
      }

      for (const fw of fireworks) {
        if (!fw.done) {
          const p = fw.particles[0]
          if (p && p.vy < 0 && p.alpha > 0.5) {
            p.x += p.vx
            p.y += p.vy
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.alpha
            ctx.fill()

            if (p.y < canvas.height * 0.3 + Math.random() * canvas.height * 0.2) {
              fw.x = p.x
              fw.y = p.y
              explode(fw)
            }
          } else {
            fw.done = true
          }
        } else {
          let allDead = true
          for (const p of fw.particles) {
            if (p.alpha > 0) {
              allDead = false
              p.x += p.vx
              p.y += p.vy
              p.vy += p.gravity
              p.vx *= 0.99
              p.alpha -= p.decay

              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
              ctx.fillStyle = p.color
              ctx.globalAlpha = Math.max(0, p.alpha)
              ctx.fill()
            }
          }
          if (allDead) {
            fw.done = true
          }
        }
      }

      ctx.globalAlpha = 1
      fireworks = fireworks.filter(fw => !fw.done || fw.particles.some(p => p.alpha > 0))

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
