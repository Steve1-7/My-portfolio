'use client'

import React, { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      time += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create aurora effect with multiple gradient layers
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient1.addColorStop(0, `rgba(0, 255, 0, ${0.1 + Math.sin(time) * 0.05})`)
      gradient1.addColorStop(0.5, `rgba(199, 125, 255, ${0.1 + Math.cos(time) * 0.05})`)
      gradient1.addColorStop(1, `rgba(123, 47, 190, ${0.1 + Math.sin(time + 1) * 0.05})`)

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add moving orbs
      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(time + i * 2) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(time * 0.7 + i * 2) * 0.5 + 0.5) * canvas.height
        const radius = 300 + Math.sin(time + i) * 100

        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        orbGradient.addColorStop(0, i === 0 ? 'rgba(0, 255, 0, 0.15)' : i === 1 ? 'rgba(199, 125, 255, 0.15)' : 'rgba(123, 47, 190, 0.15)')
        orbGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = orbGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    // Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6, willChange: 'transform' }}
    />
  )
}
