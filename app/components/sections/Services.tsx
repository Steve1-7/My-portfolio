'use client'

import { motion } from 'framer-motion'
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Palette, 
  Fingerprint, 
  Search,
  ArrowRight
} from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { GlassCard } from '../ui/GlassCard'

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Responsive websites, dashboards, and web applications built with modern technologies for optimal performance.',
    features: ['Next.js & React', 'TypeScript', 'Performance Optimized', 'SEO Ready'],
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description: 'Full-stack applications with seamless user experiences across all devices and platforms.',
    features: ['Cross-Platform', 'Native Performance', 'Offline Support', 'Real-time Data'],
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Solutions',
    description: 'Online stores and marketplaces that drive conversions and grow your business.',
    features: ['Shopify', 'Payment Integration', 'Inventory Management', 'Analytics'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered designs that are beautiful, intuitive, and drive engagement.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    icon: Fingerprint,
    title: 'Brand Identity',
    description: 'Memorable brand identities that tell your story and connect with your audience.',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Marketing Assets'],
  },
  {
    icon: Search,
    title: 'SEO & Digital Marketing',
    description: 'Data-driven strategies to increase visibility and drive organic growth.',
    features: ['Technical SEO', 'Content Strategy', 'Analytics Setup', 'Performance Tracking'],
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Services"
          title="What I Build"
          subtitle="End-to-end digital solutions tailored to your unique needs and goals."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="h-full group">
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Learn more link */}
                  <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
