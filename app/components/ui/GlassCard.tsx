'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'primary' | 'secondary' | 'none'
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = 'none',
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-lg glass p-6',
        hover && 'cursor-pointer',
        glow === 'primary' && 'glow-primary',
        glow === 'secondary' && 'glow-secondary',
        className
      )}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-lg gradient-border" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

interface GlassCardHeaderProps {
  icon?: ReactNode
  title: string
  subtitle?: string
}

export function GlassCardHeader({ icon, title, subtitle }: GlassCardHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-4">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
