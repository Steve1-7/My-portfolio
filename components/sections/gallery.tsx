'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryItem {
  id: string
  image: string
  title: string
  description: string
  category: string
  relatedProject?: string
}

const galleryItems: GalleryItem[] = [
  { id: '1', image: '/img/chinake.jpg', title: 'Chinake Brands', description: 'Brand identity and logo design', category: 'Branding', relatedProject: 'Eva Tech Studio' },
  { id: '2', image: '/img/saseka.jpg', title: 'Saseka Holdings', description: 'Corporate branding and web design', category: 'Branding', relatedProject: 'Eva Tech Studio' },
  { id: '3', image: '/img/media.png', title: 'Media Co.', description: 'Digital media platform design', category: 'Web Design', relatedProject: 'Eva Tech Studio' },
  { id: '4', image: '/img/theo.jpg', title: 'Theo', description: 'Personal brand identity', category: 'Branding', relatedProject: 'Eva Tech Studio' },
  { id: '5', image: '/img/steve1.jpg', title: 'Steve Brand', description: 'Personal branding project', category: 'Branding', relatedProject: 'Portfolio' },
  { id: '6', image: '/img/Omni.png', title: 'Omni-Commute', description: 'Ride-sharing platform branding', category: 'UI/UX', relatedProject: 'Omni-Commute' },
  { id: '7', image: '/img/hytkk.jpg', title: 'Hytk', description: '3D modeling project', category: '3D', relatedProject: 'Portfolio' },
  { id: '8', image: '/img/lux.png', title: 'Lux Studio', description: 'Premium brand identity', category: 'Branding', relatedProject: 'Eva Tech Studio' },
  { id: '9', image: '/img/logo5.webp', title: 'Logo Design', description: 'Modern logo concept', category: 'Branding', relatedProject: 'Eva Tech Studio' },
  { id: '10', image: '/img/3d1.jpg', title: '3D Render I', description: 'Product visualization', category: '3D', relatedProject: 'Portfolio' },
  { id: '11', image: '/img/3d2.jpg', title: '3D Render II', description: 'Architectural visualization', category: '3D', relatedProject: 'Portfolio' },
  { id: '12', image: '/img/3d1 (1).jpg', title: '3D Render III', description: 'Abstract 3D art', category: '3D', relatedProject: 'Portfolio' },
  { id: '13', image: '/img/ball2.jpg', title: 'Orb', description: '3D sphere render', category: '3D', relatedProject: 'Portfolio' },
  { id: '14', image: '/img/2_05am.png', title: '2:05 AM', description: 'Night scene visualization', category: '3D', relatedProject: 'Portfolio' },
  { id: '15', image: '/img/ggnn.jpg', title: 'Abstract I', description: 'Abstract 3D composition', category: '3D', relatedProject: 'Portfolio' },
  { id: '16', image: '/img/ghgn.jpg', title: 'Abstract II', description: 'Geometric abstraction', category: '3D', relatedProject: 'Portfolio' },
  { id: '17', image: '/img/ice1.jpg', title: 'Ice', description: 'Ice texture render', category: '3D', relatedProject: 'Portfolio' },
  { id: '18', image: '/img/gonn.jpg', title: 'Gonn', description: 'Experimental 3D work', category: '3D', relatedProject: 'Portfolio' },
  { id: '19', image: '/img/cube1.jpg', title: 'Cube Study', description: 'Geometric study', category: '3D', relatedProject: 'Portfolio' },
  { id: '20', image: '/img/cookis.png', title: 'Cookies', description: 'Product render', category: '3D', relatedProject: 'Portfolio' },
]

const categories = ['All', 'Web Design', 'Software', 'Dashboard', 'Mobile', 'Branding', 'UI/UX', '3D']

export function Gallery() {
  const [filter, setFilter] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else {
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
    }
  }

  const currentItem = filteredItems[selectedIndex]

  return (
    <section id="gallery" className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-jetbrains text-neon uppercase tracking-widest">// Gallery</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold mt-4 mb-6">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple">Archive</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A collection of design work, 3D renders, and creative projects
            </p>
          </div>
        </FadeIn>

        {/* Filter Buttons */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full font-jetbrains text-sm transition-all ${
                  filter === category
                    ? 'bg-neon text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.05}>
                <GlassCard
                  className="group cursor-pointer overflow-hidden"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-square relative overflow-hidden bg-white/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-syne font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <ZoomIn className="w-4 h-4 text-white/60" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && currentItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev') }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-6"
              >
                <div className="relative max-w-full max-h-[70vh] overflow-hidden rounded-lg">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>

                <div className="text-center max-w-2xl">
                  <h3 className="text-2xl font-syne font-bold mb-2">{currentItem.title}</h3>
                  <p className="text-white/60 mb-4">{currentItem.description}</p>
                  <div className="flex items-center justify-center gap-3">
                    <Badge variant="outline">{currentItem.category}</Badge>
                    {currentItem.relatedProject && (
                      <span className="text-sm text-white/40">Related: {currentItem.relatedProject}</span>
                    )}
                  </div>
                  <div className="text-sm font-jetbrains text-white/40 mt-4">
                    {selectedIndex + 1} / {filteredItems.length}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
