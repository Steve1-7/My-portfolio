'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  quote: string
  result: string
  rating: number
  project: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'Chinake Brands',
    avatar: 'SC',
    quote: 'Steve transformed our brand identity completely. The logo and website changed how clients perceive us overnight. His attention to detail and creative vision exceeded our expectations.',
    result: '3× Client Enquiries',
    rating: 5,
    project: 'Brand Identity & Web Design',
  },
  {
    id: '2',
    name: 'Michael Saseka',
    role: 'Director',
    company: 'Saseka Holdings',
    avatar: 'MS',
    quote: 'Seamless to work with. He understood the brief instantly and delivered beyond what we imagined. Highly professional and always available when we needed him.',
    result: 'On-time & On-budget',
    rating: 5,
    project: 'Web Development',
  },
  {
    id: '3',
    name: 'James Peterson',
    role: 'Operations Manager',
    company: 'Shagary Petroleum',
    avatar: 'JP',
    quote: 'Fast, creative, and professional. Steve built our entire web presence from scratch and kept us informed every step of the way. The end result was exactly what we needed.',
    result: 'Full Corporate Rebrand',
    rating: 5,
    project: 'Corporate Website',
  },
  {
    id: '4',
    name: 'Linda Mbeki',
    role: 'Owner',
    company: 'Kings Barber',
    avatar: 'LM',
    quote: 'Steve really understands small businesses. Our site looks as polished as any big brand. Customers keep complimenting it and our bookings have doubled.',
    result: 'Bookings Doubled',
    rating: 5,
    project: 'Small Business Website',
  },
  {
    id: '5',
    name: 'David Lux',
    role: 'Creative Director',
    company: 'Lux Studio',
    avatar: 'DL',
    quote: 'Exceptional detail. Every design has that premium touch that makes the brand feel intentional and high-end. Steve is a true professional.',
    result: 'Premium Rebranding',
    rating: 5,
    project: 'Brand Design',
  },
  {
    id: '6',
    name: 'Dr. Amanda Nkosi',
    role: 'Medical Director',
    company: 'Patient Portal',
    avatar: 'AN',
    quote: 'The dashboard is clean, intuitive, and exactly what our users needed. Steve\'s speed was genuinely impressive without compromising quality.',
    result: 'Launched in 2 Weeks',
    rating: 5,
    project: 'Healthcare Dashboard',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// Testimonials</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Voices</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              What clients say about working with me
            </p>
          </div>
        </FadeIn>

        {/* Featured Testimonial */}
        <FadeIn delay={0.2}>
          <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neon to-purple flex items-center justify-center text-2xl font-syne font-bold text-black">
                  {currentTestimonial.avatar}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <Quote className="w-8 h-8 text-neon/50 mb-4" />
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6 font-light">
                  {currentTestimonial.quote}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-neon text-neon" />
                    ))}
                  </div>
                  <Badge variant="secondary">{currentTestimonial.result}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-syne font-bold text-lg">{currentTestimonial.name}</div>
                    <div className="text-white/60">{currentTestimonial.role} at {currentTestimonial.company}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevTestimonial}
                      className="rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextTestimonial}
                      className="rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Testimonial Grid */}
        <FadeIn delay={0.4}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <GlassCard
                key={testimonial.id}
                className={`p-6 cursor-pointer transition-all ${
                  index === currentIndex ? 'border-neon/50 bg-neon/5' : 'hover:bg-white/10'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon/20 to-purple/20 flex items-center justify-center text-lg font-syne font-bold text-neon flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-syne font-bold text-sm mb-1">{testimonial.name}</div>
                    <div className="text-xs text-white/60">{testimonial.role}</div>
                    <div className="text-xs text-white/40">{testimonial.company}</div>
                  </div>
                </div>

                <p className="text-white/70 text-sm line-clamp-3 mb-4">
                  {testimonial.quote}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {testimonial.result}
                  </Badge>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-neon/70 text-neon/70" />
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <div className="text-center mt-16">
            <p className="text-white/60 mb-6">Ready to be my next success story?</p>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <a href="/#contact">
                Start Your Project
                <ChevronRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
