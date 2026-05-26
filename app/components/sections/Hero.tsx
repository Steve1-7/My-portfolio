'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Calendar, MessageCircle, Briefcase } from 'lucide-react'
import { Button } from '../ui/Button'

const words = ['websites', 'dashboards', 'experiences', 'systems', 'brands']

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < words[wordIndex].length) {
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-10" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Available for new projects
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6"
        >
          Building modern{' '}
          <span className="relative inline-block">
            <span className="text-gradient">
              {words[wordIndex].slice(0, charIndex)}
            </span>
            <span className="animate-blink text-primary">|</span>
          </span>
          <br />
          <span className="text-muted-foreground">that evolve with your business</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Eva Tech Studio crafts premium digital experiences through full-stack development, 
          brand identity, and UI/UX design. We believe digital products should never remain static.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            icon={<Briefcase className="w-4 h-4" />}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => window.open('https://calendly.com', '_blank')}
          >
            Book a Call
          </Button>
          <Button
            size="lg"
            variant="ghost"
            icon={<MessageCircle className="w-4 h-4" />}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Me
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-border"
        >
          <div className="text-center">
            <div className="font-heading font-bold text-3xl md:text-4xl text-foreground">5+</div>
            <div className="text-sm text-muted-foreground mt-1">Years Experience</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="text-center">
            <div className="font-heading font-bold text-3xl md:text-4xl text-foreground">20+</div>
            <div className="text-sm text-muted-foreground mt-1">Projects Delivered</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="text-center">
            <div className="font-heading font-bold text-3xl md:text-4xl text-foreground">100%</div>
            <div className="text-sm text-muted-foreground mt-1">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
