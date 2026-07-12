'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      time += 0.003

      const w = canvas.width
      const h = canvas.height

      const x1 = w * 0.5 + Math.sin(time * 0.7) * w * 0.4
      const y1 = h * 0.3 + Math.cos(time * 0.5) * h * 0.3
      const x2 = w * 0.5 + Math.cos(time * 0.6) * w * 0.3
      const y2 = h * 0.7 + Math.sin(time * 0.8) * h * 0.2

      ctx.clearRect(0, 0, w, h)

      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.5)
      g1.addColorStop(0, 'rgba(212, 175, 55, 0.04)')
      g1.addColorStop(1, 'rgba(212, 175, 55, 0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.4)
      g2.addColorStop(0, 'rgba(138, 109, 0, 0.03)')
      g2.addColorStop(1, 'rgba(138, 109, 0, 0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

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
      style={{ zIndex: 0 }}
    />
  )
}
