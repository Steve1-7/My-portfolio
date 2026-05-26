'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from '../ui/SectionHeader'

export function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60])

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Philosophy"
          title="My Development Philosophy"
        />

        <motion.div
          style={{ opacity, y }}
          className="relative"
        >
          {/* Quote */}
          <div className="relative glass p-8 md:p-12 rounded-2xl">
            {/* Decorative quote marks */}
            <div className="absolute -top-4 -left-2 text-8xl font-heading text-primary/20 select-none">
              &ldquo;
            </div>

            <blockquote className="relative z-10">
              <p className="font-heading text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground text-balance">
                We believe websites and software should{' '}
                <span className="text-primary">never remain static</span>.
                Modern digital products must continuously{' '}
                <span className="text-secondary">evolve</span>,{' '}
                <span className="text-secondary">improve</span>, and{' '}
                <span className="text-secondary">adapt</span> to stay ahead.
              </p>
            </blockquote>

            {/* Decorative closing quote */}
            <div className="absolute -bottom-8 -right-2 text-8xl font-heading text-primary/20 select-none rotate-180">
              &ldquo;
            </div>
          </div>

          {/* Principles */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: 'Iterate',
                description: 'Continuous improvement based on real user feedback and data.',
              },
              {
                title: 'Optimize',
                description: 'Performance-first development for exceptional user experiences.',
              },
              {
                title: 'Scale',
                description: 'Architecture designed to grow with your business needs.',
              },
            ].map((principle, idx) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xl mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-foreground">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
