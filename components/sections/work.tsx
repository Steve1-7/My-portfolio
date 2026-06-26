'use client'

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAllCaseStudies, getFeaturedCaseStudies } from '@/lib/case-studies'

export function Work() {
  const [filter, setFilter] = useState('All')
  const allCaseStudies = getAllCaseStudies()
  const featuredCaseStudies = getFeaturedCaseStudies()
  
  const categories = ['All', 'Featured', ...new Set(allCaseStudies.map(cs => cs.type))]
  const filtered = filter === 'All' 
    ? allCaseStudies 
    : filter === 'Featured' 
      ? featuredCaseStudies 
      : allCaseStudies.filter(cs => cs.type === filter)

  return (
    <section id="work" className="py-32 px-4 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// Work</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Projects</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Comprehensive case studies showcasing end-to-end product development
            </p>
          </div>
        </FadeIn>

        {/* Filter Buttons */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-jetbrains text-sm transition-all ${
                  filter === category
                    ? 'bg-neon text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                aria-pressed={filter === category}
                aria-label={`Show ${category.toLowerCase()} projects`}
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((caseStudy, index) => (
              <FadeIn key={caseStudy.id} delay={index * 0.1}>
                <GlassCard 
                  className="group h-full overflow-hidden cursor-pointer"
                  onClick={() => window.location.href = `/work/${caseStudy.slug}`}
                >
                  {/* Hero Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-syne font-bold text-white/20">
                        {caseStudy.title.split(' ').map(w => w[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button size="sm" asChild className="w-full gap-2">
                        <Link href={`/work/${caseStudy.slug}`} className="inline-flex w-full items-center justify-center">
                          View Case Study
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant={caseStudy.status === 'Live' ? 'default' : 'secondary'}>
                        {caseStudy.status}
                      </Badge>
                      <span className="text-xs font-jetbrains text-white/40">{caseStudy.duration}</span>
                    </div>

                    <h3 className="text-2xl font-syne font-bold mb-2 group-hover:text-neon transition-colors">
                      {caseStudy.title}
                    </h3>

                    <p className="text-white/60 mb-4 line-clamp-2">
                      {caseStudy.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseStudy.techStack.slice(0, 4).map((tech) => (
                        <span key={tech.name} className="text-xs px-2 py-1 bg-white/5 rounded text-white/60">
                          {tech.name}
                        </span>
                      ))}
                      {caseStudy.techStack.length > 4 && (
                        <span className="text-xs px-2 py-1 bg-white/5 rounded text-white/60">
                          +{caseStudy.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-white/40">{caseStudy.type}</span>
                      {caseStudy.liveUrl && caseStudy.liveUrl !== '#' && (
                        <a
                          href={caseStudy.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-neon hover:text-neon/80 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </GlassCard>
              </FadeIn>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <FadeIn delay={0.5}>
          <div className="text-center mt-16">
            <p className="text-white/60 mb-6">Want to see more details?</p>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/#contact">
                Discuss Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
