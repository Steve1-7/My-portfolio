'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Calendar, 
  MessageCircle,
  Loader2,
  Check
} from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'stevezuluu@gmail.com',
    href: 'mailto:stevezuluu@gmail.com',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+27 XX XXX XXXX',
    href: 'https://wa.me/27XXXXXXXXX',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'South Africa',
    href: null,
  },
]

const projectTypes = [
  'Website Development',
  'Web Application',
  'E-Commerce Store',
  'UI/UX Design',
  'Brand Identity',
  'Other',
]

const budgetRanges = [
  'Under R5,000',
  'R5,000 - R15,000',
  'R15,000 - R50,000',
  'R50,000+',
  'Let\'s discuss',
]

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
    preferredContact: 'email',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        message: '',
        preferredContact: 'email',
      })
    }, 3000)
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="Contact"
          title="Let&apos;s Work Together"
          subtitle="Have a project in mind? I'd love to hear about it. Let's create something amazing."
        />

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick contact methods */}
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{method.label}</div>
                    {method.href ? (
                      <a
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <div className="text-foreground">{method.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="space-y-3">
              <Button
                fullWidth
                variant="secondary"
                icon={<MessageCircle className="w-4 h-4" />}
                onClick={() => window.open('https://wa.me/27XXXXXXXXX', '_blank')}
              >
                Chat on WhatsApp
              </Button>
              <Button
                fullWidth
                variant="outline"
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => window.open('https://calendly.com', '_blank')}
              >
                Schedule a Call
              </Button>
            </div>

            {/* Availability */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Currently available for projects
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                I typically respond within 24 hours. For urgent inquiries, 
                WhatsApp is the fastest way to reach me.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  value={formState.company}
                  onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                  placeholder="Your company"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Project type */}
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
                  >
                    <option value="">Select a type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
                  >
                    <option value="">Select a range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Project Details <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Tell me about your project, goals, and timeline..."
                />
              </div>

              {/* Preferred contact */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  {['email', 'whatsapp', 'call'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        formState.preferredContact === method
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={formState.preferredContact === method}
                        onChange={(e) =>
                          setFormState({ ...formState, preferredContact: e.target.value })
                        }
                        className="sr-only"
                      />
                      <span className="capitalize text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting || isSubmitted}
                icon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSubmitted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting
                  ? 'Sending...'
                  : isSubmitted
                  ? 'Message Sent!'
                  : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
