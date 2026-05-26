'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { GitHubIcon } from './SocialIcons'

export interface Project {
  id: string
  title: string
  type: string
  description: string
  problem: string
  solution: string
  features: string[]
  techStack: string[]
  results?: string[]
  url?: string
  github?: string
  images: string[]
  featured?: boolean
}

interface CaseStudyModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const nextImage = useCallback(() => {
    if (project) {
      setCurrentImage((prev) => (prev + 1) % project.images.length)
    }
  }, [project])

  const prevImage = useCallback(() => {
    if (project) {
      setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }, [project])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, nextImage, prevImage])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setCurrentImage(0)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl glass-strong"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image gallery */}
            {project.images.length > 0 && (
              <div className="relative aspect-video bg-muted/50">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={project.images[currentImage]}
                  alt={`${project.title} screenshot ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />

                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImage ? 'bg-primary' : 'bg-foreground/30'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
                  {project.type}
                </span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                  {project.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Problem & Solution */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-lg bg-destructive/5 border border-destructive/20">
                  <h3 className="font-heading font-semibold text-lg mb-3 text-destructive">
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground">{project.problem}</p>
                </div>
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-heading font-semibold text-lg mb-3 text-primary">
                    The Solution
                  </h3>
                  <p className="text-muted-foreground">{project.solution}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-lg mb-4">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              {project.results && project.results.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading font-semibold text-lg mb-4">Results</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.results.map((result, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-lg bg-secondary/10 text-secondary text-sm"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-lg mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-md bg-muted text-sm font-mono text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                {project.url && (
                  <Button
                    as="a"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLink className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    View Live Site
                  </Button>
                )}
                {project.github && (
                  <Button
                    as="a"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    icon={<GitHubIcon className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    View Code
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
