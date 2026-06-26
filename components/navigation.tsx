'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['hero', 'about', 'work', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
                <span className="font-syne font-bold text-neon">SR</span>
              </div>
              <span className="font-syne font-bold text-white hidden sm:block">Steve</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-jetbrains transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'text-neon'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-label={`Navigate to ${link.name} section`}
                  aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                >
                  {link.name}
                </button>
              ))}
              <Button asChild size="sm" className="gap-2">
                <Link href="/#contact" aria-label="Navigate to contact section to hire Steve">Hire Me</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-20"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-xl font-syne font-bold transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'text-neon'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-label={`Navigate to ${link.name} section`}
                >
                  {link.name}
                </button>
              ))}
              <Button asChild size="lg" className="gap-2 w-full max-w-xs">
                <Link href="/#contact" aria-label="Navigate to contact section to hire Steve">Hire Me</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
