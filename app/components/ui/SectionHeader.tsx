'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={cn(
        'mb-12 md:mb-16',
        centered && 'text-center',
        className
      )}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6',
            centered && 'mx-auto'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-neon" />
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            {badge}
          </span>
        </motion.div>
      )}

      <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
