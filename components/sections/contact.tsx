'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { Mail, Calendar, Clock, MapPin, ExternalLink, Copy, Check } from 'lucide-react'
import Link from 'next/link'

export function Contact() {
  const [emailCopied, setEmailCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('stevezuluu@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'stevezuluu@gmail.com',
      href: 'mailto:stevezuluu@gmail.com',
      color: 'text-neon',
    },
    {
      icon: ExternalLink,
      label: 'LinkedIn',
      value: 'steve-ronald1710s',
      href: 'https://www.linkedin.com/in/steve-ronald1710s/',
      color: 'text-purple',
    },
    {
      icon: ExternalLink,
      label: 'GitHub',
      value: 'Steve1-7',
      href: 'https://github.com/Steve1-7',
      color: 'text-neon',
    },
  ]

  return (
    <section id="contact" className="py-32 px-4 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// Contact</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Something Epic</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Have a vision? Whether it's a premium product or a passion project—I'd love to hear it.
            </p>
          </div>
        </FadeIn>

        {/* Availability Status */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-8 mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-neon animate-pulse" />
              <span className="text-lg font-syne font-bold">Available for New Projects</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Responds within 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">South Africa · Global</span>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <MagneticButton strength={0.2}>
              <Button size="xl" asChild className="gap-2">
                <Link href="mailto:stevezuluu@gmail.com">
                  <Mail className="w-5 h-5" />
                  Send a Message
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <Button variant="secondary" size="xl" asChild className="gap-2">
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5" />
                  Schedule a Meeting
                </a>
              </Button>
            </MagneticButton>

            <Button
              variant="outline"
              size="xl"
              onClick={copyEmail}
              className="gap-2"
            >
              {emailCopied ? (
                <>
                  <Check className="w-5 h-5" />
                  Email Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Email
                </>
              )}
            </Button>
          </div>
        </FadeIn>

        {/* Contact Cards */}
        <FadeIn delay={0.3}>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contacts.map((contact) => {
              const Icon = contact.icon
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <GlassCard className="p-6 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                      <Icon className={`w-6 h-6 ${contact.color}`} />
                    </div>
                    <h3 className="font-syne font-bold text-lg mb-2">{contact.label}</h3>
                    <p className={`text-white/60 ${contact.color}`}>{contact.value}</p>
                  </GlassCard>
                </a>
              )
            })}
          </div>
        </FadeIn>

        {/* Eva Tech Studio CTA */}
        <FadeIn delay={0.4}>
          <GlassCard className="p-8 text-center border-neon/30">
            <div className="mb-6">
              <h3 className="text-2xl font-syne font-bold mb-2">Eva Tech Studio</h3>
              <p className="text-white/60">
                My comprehensive digital solutions platform for end-to-end software development
              </p>
            </div>
            <Button asChild className="gap-2">
              <a href="https://www.eva-tech-studio.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
                Visit Eva Tech Studio
              </a>
            </Button>
          </GlassCard>
        </FadeIn>

        {/* Footer Info */}
        <FadeIn delay={0.5}>
          <div className="text-center mt-12 text-white/40 text-sm">
            <p className="font-jetbrains mb-2">
              © {new Date().getFullYear()} Steve Ronald. All rights reserved.
            </p>
            <p className="font-jetbrains">
              Built with Next.js, React, TypeScript, and Framer Motion
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
