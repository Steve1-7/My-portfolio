'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const experiences = [
  {
    type: 'work',
    title: 'Freelance Full-Stack Developer',
    organization: 'Self-Employed',
    period: '2022 - Present',
    description: 'Building custom web applications and digital experiences for clients across South Africa.',
    highlights: ['20+ projects delivered', 'E-commerce solutions', 'Dashboard development'],
  },
  {
    type: 'education',
    title: 'Self-Taught Developer',
    organization: 'Online Learning & Practice',
    period: '2019 - Present',
    description: 'Continuous learning through online courses, documentation, and hands-on project development.',
    highlights: ['React & Next.js', 'Node.js & Databases', 'UI/UX Design'],
  },
]

const certifications = [
  'Meta Front-End Developer',
  'JavaScript Algorithms',
  'Responsive Web Design',
  'React Development',
]

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="About"
          title="My Journey"
          subtitle="A self-taught developer passionate about creating impactful digital experiences."
          centered={false}
        />

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass p-6 rounded-lg mb-6">
              <h3 className="font-heading font-semibold text-lg mb-4 text-foreground">
                Hi, I&apos;m Steve Ronald
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I&apos;m a full-stack developer and brand designer based in South Africa. 
                I specialize in building modern web applications that help businesses 
                grow and connect with their audiences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With a passion for clean code and beautiful design, I create digital 
                experiences that are both functional and visually stunning.
              </p>
            </div>

            {/* Certifications */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  Certifications
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 rounded-md bg-muted text-sm text-muted-foreground"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column - Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-0 md:pl-16 mb-8 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-primary hidden md:flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background" />
                  </div>

                  <div className="glass p-6 rounded-lg">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {exp.type === 'work' ? (
                          <Briefcase className="w-5 h-5" />
                        ) : (
                          <GraduationCap className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-lg text-foreground">
                            {exp.title}
                          </h3>
                          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {exp.organization}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
