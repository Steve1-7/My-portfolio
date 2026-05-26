'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Headphones, Code, Rocket } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const values = [
  {
    icon: Code,
    title: 'End-to-End Development',
    description: 'From concept to deployment, I handle every aspect of your digital project with precision and care.',
  },
  {
    icon: Rocket,
    title: 'Modern Tech Stack',
    description: 'Built with the latest technologies like Next.js, React, and TypeScript for optimal performance.',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Clean, maintainable code with proper documentation and industry best practices.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Efficient workflows and clear communication ensure your project launches on time.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Responsive communication and regular updates keep you informed throughout the process.',
  },
  {
    icon: Headphones,
    title: 'Ongoing Support',
    description: 'Post-launch maintenance and support to ensure your digital product continues to evolve.',
  },
]

export function WhyWorkWithMe() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Why Choose Me"
          title="Why Work With Me"
          subtitle="I bring more than just technical skills to every project."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <value.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
