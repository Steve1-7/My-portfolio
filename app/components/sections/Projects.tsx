'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { CaseStudyModal, type Project } from '../ui/CaseStudyModal'

const projects: Project[] = [
  {
    id: 'cleansmith',
    title: 'CleanSmith South Africa',
    type: 'Professional Services Website',
    description: 'Modern commercial cleaning company website focused on trust, professionalism, and service clarity. Built to generate leads and establish brand credibility.',
    problem: 'CleanSmith needed a professional digital presence to build customer trust and generate quality leads in the competitive cleaning services market.',
    solution: 'Built a responsive, SEO-optimized website with strong calls-to-action, professional branding, and clear service presentation to convert visitors into inquiries.',
    features: [
      'Responsive modern UI',
      'SEO optimization',
      'Service showcase',
      'Strong CTA system',
      'Mobile-first design',
      'Fast-loading performance',
      'Contact form integration',
      'Professional imagery',
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'Vercel', 'TypeScript'],
    results: ['Increased lead inquiries', 'Professional brand perception', 'Mobile engagement boost', 'Improved search ranking'],
    url: 'https://cleansmith.co.za',
    images: ['/projects/cleansmith-1.jpg', '/projects/cleansmith-2.jpg'],
    featured: true,
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Dashboard',
    type: 'Full-Stack Application',
    description: 'A comprehensive admin dashboard for managing e-commerce operations including inventory, orders, and analytics.',
    problem: 'The client needed a centralized platform to manage their growing online store operations efficiently.',
    solution: 'Developed a feature-rich dashboard with real-time data, intuitive interface, and powerful analytics to streamline business operations.',
    features: [
      'Real-time analytics',
      'Inventory management',
      'Order tracking',
      'Customer insights',
      'Sales reports',
      'Role-based access',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'Tailwind CSS'],
    results: ['50% faster order processing', 'Real-time visibility', 'Reduced manual work'],
    images: ['/projects/dashboard-1.jpg'],
    featured: true,
  },
  {
    id: 'portfolio-site',
    title: 'Creative Portfolio',
    type: 'Personal Branding',
    description: 'A stunning portfolio website for a creative professional showcasing their work and services.',
    problem: 'The client needed a unique online presence that would stand out and attract high-value clients.',
    solution: 'Created an immersive portfolio experience with smooth animations, dynamic project showcases, and compelling storytelling.',
    features: [
      'Custom animations',
      'Project galleries',
      'Contact integration',
      'Blog section',
      'SEO optimized',
      'Performance focused',
    ],
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
    results: ['Increased client inquiries', 'Strong brand identity', 'Portfolio engagement'],
    images: ['/projects/portfolio-1.jpg'],
    featured: false,
  },
  {
    id: 'saas-landing',
    title: 'SaaS Landing Page',
    type: 'Marketing Website',
    description: 'A conversion-focused landing page for a B2B SaaS product targeting enterprise customers.',
    problem: 'The startup needed a professional landing page that could effectively communicate their value proposition and convert visitors.',
    solution: 'Designed and built a high-converting landing page with clear messaging, social proof, and streamlined user journey.',
    features: [
      'A/B testing ready',
      'Lead capture forms',
      'Testimonials section',
      'Pricing tables',
      'CRM integration',
      'Analytics tracking',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'HubSpot'],
    results: ['25% conversion rate', 'Professional credibility', 'Lead generation'],
    images: ['/projects/saas-1.jpg'],
    featured: false,
  },
]

const categories = ['All', 'Website', 'Application', 'E-Commerce', 'Branding']

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState('All')

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => 
        p.type.toLowerCase().includes(filter.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(filter.toLowerCase()))
      )

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-background to-muted/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Portfolio"
          title="Featured Projects"
          subtitle="A selection of my recent work showcasing different skills and industries."
        />

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative overflow-hidden rounded-xl glass cursor-pointer ${
                    project.featured ? 'md:col-span-1' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-video bg-muted/50 relative overflow-hidden">
                    {project.images[0] ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="font-heading font-bold text-2xl text-foreground/50">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="font-heading font-bold text-4xl text-foreground/20">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                        aria-label="View case study"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground"
                          aria-label="Visit live site"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground"
                          aria-label="View source code"
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                      )}
                    </div>

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">
                      {project.type}
                    </span>
                    <h3 className="font-heading font-semibold text-xl mt-2 mb-3 text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('https://github.com/Steve1-7', '_blank')}
            icon={<Github className="w-4 h-4" />}
          >
            View More on GitHub
          </Button>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
