'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { ArrowRight, Code, Zap, Globe, Database, Cpu, Palette } from 'lucide-react'
import Link from 'next/link'

export function About() {
  const skills = [
    { category: 'Frontend', icon: Code, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', icon: Zap, items: ['Node.js', 'Express', 'GraphQL', 'REST APIs', 'Serverless'] },
    { category: 'Database', icon: Database, items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
    { category: 'Cloud & DevOps', icon: Globe, items: ['AWS', 'Vercel', 'Docker', 'CI/CD', 'Git'] },
    { category: 'AI & ML', icon: Cpu, items: ['OpenAI API', 'TensorFlow', 'Python', 'Data Analysis'] },
    { category: 'Design', icon: Palette, items: ['Figma', 'UI/UX', 'Brand Design', '3D Modeling'] },
  ]

  const timeline = [
    { year: '2019', title: 'Creative Spark', description: 'Discovered passion for technology and digital creativity through self-study.' },
    { year: '2020', title: 'First Projects', description: 'Built first websites and learned graphic design fundamentals.' },
    { year: '2021', title: 'Professional Start', description: 'Started freelance work, delivering web solutions for local businesses.' },
    { year: '2023', title: 'Full-Stack Focus', description: 'Expanded into full-stack development and complex applications.' },
    { year: '2024', title: 'AI Integration', description: 'Integrated AI technologies into development workflow and products.' },
    { year: '2025', title: 'Eva Tech Studio', description: 'Founded Eva Tech Studio - comprehensive digital solutions platform.' },
  ]

  return (
    <section id="about" className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// About</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Digital Products</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              I don't just build websites—I architect, develop, deploy, maintain, and grow complete digital products and businesses.
            </p>
          </div>
        </FadeIn>

        {/* Personal Story */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <FadeIn>
            <div className="space-y-6">
              <h3 className="text-3xl font-syne font-bold mb-6">My Journey</h3>
              <p className="text-lg text-white/70 leading-relaxed">
                My journey in technology started with curiosity and self-driven learning. From discovering creative possibilities on school computers to building complex AI-powered platforms, I've always been driven by the desire to create impactful digital experiences.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Today, as the founder of Eva Tech Studio, I manage the complete end-to-end software lifecycle—from initial concept and design through development, deployment, and ongoing maintenance. This comprehensive approach ensures that every project I deliver is not just functional, but sustainable and scalable.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                My philosophy is simple: build with quality, think long-term, and never stop learning. Every project is an opportunity to push boundaries and deliver exceptional value.
              </p>
              <Button variant="outline" size="lg" asChild className="gap-2 mt-4">
                <Link href="/#contact">
                  Let's Work Together
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-syne font-bold mb-6">Current Focus: Eva Tech Studio</h3>
              <p className="text-white/70 mb-6">
                Eva Tech Studio is my primary professional focus—a comprehensive digital solutions platform providing end-to-end software services.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Website Design',
                  'UI/UX Design',
                  'Software Architecture',
                  'Frontend Development',
                  'Backend Development',
                  'API Integration',
                  'Database Design',
                  'Cloud Deployment',
                  'Website Maintenance',
                  'Performance Optimization',
                  'SEO Optimization',
                  'Technical Consulting',
                ].map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                    {service}
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-6 gap-2">
                <a href="https://www.eva-tech-studio.com" target="_blank" rel="noopener noreferrer">
                  Visit Eva Tech Studio
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </GlassCard>
          </FadeIn>
        </div>

        {/* Skills Grid */}
        <FadeIn delay={0.3}>
          <div className="mb-24">
            <h3 className="text-3xl font-syne font-bold mb-8 text-center">Technical Expertise</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skillGroup, index) => {
                const Icon = skillGroup.icon
                return (
                  <GlassCard key={skillGroup.category} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neon" />
                      </div>
                      <h4 className="font-syne font-bold text-lg">{skillGroup.category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* Timeline */}
        <FadeIn delay={0.4}>
          <div>
            <h3 className="text-3xl font-syne font-bold mb-8 text-center">Career Timeline</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon via-purple to-purple2" />
              
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    <div className="absolute left-6 w-4 h-4 rounded-full bg-neon border-4 border-black" />
                    <GlassCard className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{item.year}</Badge>
                        <h4 className="font-syne font-bold text-xl">{item.title}</h4>
                      </div>
                      <p className="text-white/60">{item.description}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
