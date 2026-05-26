'use client'

import { motion } from 'framer-motion'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={cycleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-muted/50 transition-colors focus-ring"
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : theme === 'dark' ? 180 : 90 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' && <Sun className="h-4 w-4 text-primary" />}
        {theme === 'dark' && <Moon className="h-4 w-4 text-primary" />}
        {theme === 'system' && <Monitor className="h-4 w-4 text-primary" />}
      </motion.div>
    </motion.button>
  )
}
