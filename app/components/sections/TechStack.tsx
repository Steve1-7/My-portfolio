'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'

const techCategories = [
  {
    name: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    name: 'Backend',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Prisma'],
  },
  {
    name: 'Tools & Platforms',
    technologies: ['Vercel', 'Git', 'Figma', 'VS Code', 'Docker'],
  },
  {
    name: 'Design',
    technologies: ['Figma', 'Adobe Creative Suite', 'Blender', 'Spline'],
  },
]

export function TechStack() {
  return (
    <section className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Tech Stack"
          title="Tools I Work With"
          subtitle="Modern technologies for building scalable, performant applications."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-6 rounded-lg"
            >
              <h3 className="font-heading font-semibold text-lg mb-4 text-foreground">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-md bg-muted text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee of all technologies */}
        <div className="mt-16 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <motion.div
            animate={{ x: [0, '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...techCategories, ...techCategories].flatMap((cat) =>
              cat.technologies.map((tech, i) => (
                <span
                  key={`${cat.name}-${tech}-${i}`}
                  className="inline-flex items-center gap-2 text-muted-foreground/50 font-mono text-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  {tech}
                </span>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
