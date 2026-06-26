import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Work } from '@/components/sections/work'
import { Statistics } from '@/components/sections/statistics'
import { Testimonials } from '@/components/sections/testimonials'
import { Gallery } from '@/components/sections/gallery'
import { Contact } from '@/components/sections/contact'
import { AIAssistant } from '@/components/ai-assistant'
import { AuroraBackground } from '@/components/animations/aurora-background'
import { MeshGradient } from '@/components/animations/mesh-gradient'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <AuroraBackground />
      <MeshGradient />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Statistics />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
