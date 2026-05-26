'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowUp } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../ui/SocialIcons'

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { icon: GitHubIcon, href: 'https://github.com/Steve1-7', label: 'GitHub' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/steve-ronald1710s/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:stevezuluu@gmail.com', label: 'Email' },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="font-heading font-bold text-2xl tracking-tight">
                <span className="text-primary">EVA</span>
                <span className="text-secondary">.</span>
                <span className="text-foreground">TECH</span>
              </span>
            </motion.a>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Building modern websites, dashboards, and digital systems that evolve 
              with your business. Based in South Africa, working globally.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="mailto:stevezuluu@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  stevezuluu@gmail.com
                </a>
              </li>
              <li>South Africa</li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Available for projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} Eva Tech Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.eva-tech-studio.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              www.eva-tech-studio.com
            </a>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
