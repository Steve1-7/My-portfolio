'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring',
      'disabled:opacity-50 disabled:pointer-events-none',
      fullWidth && 'w-full'
    )

    const variantStyles = {
      primary: cn(
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'shadow-lg shadow-primary/25',
        'hover:shadow-xl hover:shadow-primary/30'
      ),
      secondary: cn(
        'bg-secondary text-secondary-foreground',
        'hover:bg-secondary/90',
        'shadow-lg shadow-secondary/25',
        'hover:shadow-xl hover:shadow-secondary/30'
      ),
      outline: cn(
        'border border-border bg-transparent',
        'hover:bg-muted/50',
        'text-foreground'
      ),
      ghost: cn(
        'bg-transparent',
        'hover:bg-muted/50',
        'text-foreground'
      ),
    }

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
      md: 'h-10 px-5 text-sm gap-2 rounded-lg',
      lg: 'h-12 px-8 text-base gap-2.5 rounded-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
