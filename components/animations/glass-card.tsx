'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg',
        hover && 'hover:bg-white/10 hover:border-white/20 transition-all duration-300',
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
