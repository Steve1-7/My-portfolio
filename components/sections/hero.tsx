'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { FadeIn } from '@/components/animations/fade-in'
import { ArrowRight, Download, Mail, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const roles = ['Software Engineer', 'AI Builder', 'Founder', 'Product Architect']

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple2/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#00FF00 1px, transparent 1px), linear-gradient(90deg, #00FF00 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Availability Badge */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-8" role="status" aria-live="polite">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" aria-hidden="true" />
              <span className="text-sm font-jetbrains text-neon">AVAILABLE FOR WORK</span>
            </div>
          </FadeIn>

          {/* Name */}
          <FadeIn delay={0.2}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-syne font-bold tracking-tight mb-6">
              <span className="block text-white">Steve</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon via-purple to-purple2">
                Ronald
              </span>
            </h1>
          </FadeIn>

          {/* Roles */}
          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon" />
              <p className="text-lg md:text-xl text-purple font-jetbrains">
                Software Engineer • AI Builder • Founder • Product Architect
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon" />
            </div>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              I build scalable software, AI-powered platforms, and digital products that solve real-world problems.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <MagneticButton strength={0.2}>
                <Button size="xl" asChild className="gap-2">
                  <Link href="/#work">
                    View My Work
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Button variant="secondary" size="xl" asChild className="gap-2">
                  <Link href="/#contact">
                    Schedule a Meeting
                    <Calendar className="w-5 h-5" />
                  </Link>
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Button variant="outline" size="xl" asChild className="gap-2">
                  <Link href="/#contact">
                    <Download className="w-5 h-5" />
                    Download Resume
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>

          {/* Social Links */}
          <FadeIn delay={0.6}>
            <div className="flex items-center justify-center gap-4">
              <MagneticButton strength={0.15}>
                <Button variant="ghost" size="icon" asChild className="text-white/60 hover:text-white">
                  <a href="https://github.com/Steve1-7" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <Button variant="ghost" size="icon" asChild className="text-white/60 hover:text-white">
                  <a href="https://www.linkedin.com/in/steve-ronald1710s/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <Button variant="ghost" size="icon" asChild className="text-white/60 hover:text-white">
                  <a href="mailto:stevezuluu@gmail.com">
                    <Mail className="w-6 h-6" />
                  </a>
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>

          {/* Scroll Indicator */}
          <FadeIn delay={0.8}>
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-jetbrains text-white/30 uppercase tracking-widest">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-neon to-transparent" />
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
