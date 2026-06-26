'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { Code, Globe, Users, TrendingUp, Zap, Award } from 'lucide-react'

interface StatItem {
  icon: any
  value: number
  suffix: string
  label: string
  description: string
}

const stats: StatItem[] = [
  { icon: Code, value: 50, suffix: '+', label: 'Projects Completed', description: 'From web apps to platforms' },
  { icon: Users, value: 20, suffix: '+', label: 'Happy Clients', description: 'Across various industries' },
  { icon: Globe, value: 5, suffix: '+', label: 'Years Experience', description: 'Building digital products' },
  { icon: TrendingUp, value: 100, suffix: '%', label: 'Client Satisfaction', description: 'Consistent quality delivery' },
  { icon: Zap, value: 15, suffix: '+', label: 'Technologies', label: 'Tech Stack Mastered', description: 'Modern development tools' },
  { icon: Award, value: 3, suffix: '', label: 'Businesses Founded', description: 'Entrepreneurial ventures' },
]

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function Statistics() {
  return (
    <section className="py-32 px-4 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// Impact</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              By The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Numbers</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Measurable impact through quality work and dedication
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <GlassCard className="p-8 text-center group hover:bg-white/10 transition-colors">
                  <div className="w-16 h-16 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-neon" />
                  </div>
                  
                  <div className="text-5xl font-syne font-bold text-white mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  <h3 className="text-lg font-syne font-bold text-white/90 mb-2">
                    {stat.label}
                  </h3>
                  
                  <p className="text-white/50 text-sm">
                    {stat.description}
                  </p>
                </GlassCard>
              </FadeIn>
            )
          })}
        </div>

        {/* Additional Stats Row */}
        <FadeIn delay={0.6}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-syne font-bold text-purple mb-2">
                <CountUp end={1000000} suffix="+" duration={2500} />
              </div>
              <p className="text-white/50 text-sm font-jetbrains">Lines of Code</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-syne font-bold text-neon mb-2">
                <CountUp end={24} suffix="/7" duration={2000} />
              </div>
              <p className="text-white/50 text-sm font-jetbrains">Support Available</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-syne font-bold text-purple mb-2">
                <CountUp end={98} suffix="%" duration={2000} />
              </div>
              <p className="text-white/50 text-sm font-jetbrains">On-Time Delivery</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-syne font-bold text-neon mb-2">
                <CountUp end={95} suffix="+" duration={2000} />
              </div>
              <p className="text-white/50 text-sm font-jetbrains">Lighthouse Score</p>
            </GlassCard>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
