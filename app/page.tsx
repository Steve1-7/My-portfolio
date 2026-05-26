'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './components/ThemeProvider'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { Navigation } from './components/sections/Navigation'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Services } from './components/sections/Services'
import { WhyWorkWithMe } from './components/sections/WhyWorkWithMe'
import { Projects } from './components/sections/Projects'
import { Philosophy } from './components/sections/Philosophy'
import { TechStack } from './components/sections/TechStack'
import { Testimonials } from './components/sections/Testimonials'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'

// Page loader component
function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="font-heading font-bold text-4xl tracking-tight">
          <span className="text-primary">EVA</span>
          <span className="text-secondary">.</span>
          <span className="text-foreground">TECH</span>
        </span>
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>

      {/* Progress text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 font-mono text-xs text-muted-foreground"
      >
        Loading experience...
      </motion.p>
    </motion.div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <PageLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollProgress />
          <Navigation />
          
          <main>
            <Hero />
            <About />
            <Services />
            <WhyWorkWithMe />
            <Projects />
            <Philosophy />
            <TechStack />
            <Testimonials />
            <Contact />
          </main>

          <Footer />
        </motion.div>
      )}
    </ThemeProvider>
  )
}
