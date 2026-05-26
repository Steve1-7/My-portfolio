'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, CleanSmith SA',
    content: 'Steve transformed our online presence completely. The website he built has generated more leads than we ever expected. His attention to detail and understanding of our business goals was impressive.',
    rating: 5,
    image: null,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, TechStart',
    content: 'Working with Eva Tech Studio was a game-changer for our startup. The dashboard Steve built streamlined our operations and the design is absolutely stunning. Highly recommended!',
    rating: 5,
    image: null,
  },
  {
    id: 3,
    name: 'Amanda Peters',
    role: 'Marketing Director',
    content: 'The brand identity and website Steve created for us perfectly captures our vision. His technical skills combined with creative flair made the collaboration smooth and the results exceptional.',
    rating: 5,
    image: null,
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout>()

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    autoplayRef.current = setInterval(next, 5000)
    return () => clearInterval(autoplayRef.current)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Testimonials"
          title="Client Stories"
          subtitle="What people say about working with me."
        />

        <div className="relative">
          {/* Testimonial card */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full glass p-8 md:p-12 rounded-2xl text-center"
              >
                {/* Quote icon */}
                <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="font-heading text-xl md:text-2xl text-foreground leading-relaxed mb-8 text-balance">
                  &ldquo;{testimonials[current].content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      {testimonials[current].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[current].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > current ? 1 : -1)
                    setCurrent(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === current
                      ? 'w-8 bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
