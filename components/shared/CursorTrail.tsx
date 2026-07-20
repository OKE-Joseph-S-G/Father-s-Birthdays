'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  decay: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let mouseX = -100
    let mouseY = -100
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const createSparkleParticles = (x: number, y: number) => {
      for (let i = 0; i < 2; i++) {
        const isWhite = Math.random() > 0.8
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          size: 3 + Math.random() * 7,
          alpha: 0.8 + Math.random() * 0.2,
          decay: 0.01 + Math.random() * 0.015,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.0 + 0.5, // slight drift down (gravity)
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.06,
          color: isWhite ? '#ffffff' : (Math.random() > 0.5 ? '#ffdf00' : '#d4af37'),
        })
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      createSparkleParticles(mouseX, mouseY)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      mouseX = e.touches[0].clientX
      mouseY = e.touches[0].clientY
      createSparkleParticles(mouseX, mouseY)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const drawSparkle = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number, rotation: number, color: string, alpha: number) => {
      c.save()
      c.translate(cx, cy)
      c.rotate(rotation)
      c.globalAlpha = alpha
      c.fillStyle = color
      
      // Draw 4-point star using quadratic curves for magical look
      c.beginPath()
      c.moveTo(0, -size)
      c.quadraticCurveTo(0, 0, size, 0)
      c.quadraticCurveTo(0, 0, 0, size)
      c.quadraticCurveTo(0, 0, -size, 0)
      c.quadraticCurveTo(0, 0, 0, -size)
      c.closePath()
      
      // Add subtle glow shadow
      c.shadowBlur = 5
      c.shadowColor = '#ffdf00'
      c.fill()
      
      c.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.alpha -= p.decay
        p.size *= 0.97

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1)
          continue
        }

        drawSparkle(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha)
      }

      if (particles.length > 200) {
        particles = particles.slice(-200)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }} // Make sure it shines over everything
    />
  )
}
