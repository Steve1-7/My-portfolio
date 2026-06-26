import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/case-studies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/fade-in'
import { GlassCard } from '@/components/animations/glass-card'
import { ArrowLeft, ExternalLink, Calendar, Clock, User, CheckCircle, Zap, Shield, Globe, Database, Code, Server, Lock } from 'lucide-react'
import Link from 'next/link'

interface CaseStudyPageParams {
  slug: string
}

interface CaseStudyPageProps {
  params: Promise<CaseStudyPageParams>
}

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies()
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getCaseStudyBySlug(slug)
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${caseStudy.title} | Case Study`,
    description: caseStudy.description,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      images: [caseStudy.heroImage],
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  const iconMap = {
    'Frontend': Code,
    'Backend': Server,
    'Database': Database,
    'Cloud': Globe,
    'Mobile': Zap,
    'AI': Shield,
    'DevOps': Server,
    'Design': Zap,
    'Payments': Lock,
    'Deployment': Globe,
    'API': Server,
    'Media': Database,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <FadeIn>
            <Link href="/#work" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Work
            </Link>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-4">
                  {caseStudy.type}
                </Badge>
                <h1 className="text-5xl md:text-7xl font-syne font-bold mb-6 tracking-tight">
                  {caseStudy.title}
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mb-8">
                  {caseStudy.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    {caseStudy.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Clock className="w-4 h-4" />
                    {caseStudy.status}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <User className="w-4 h-4" />
                    {caseStudy.role}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {caseStudy.liveUrl && caseStudy.liveUrl !== '#' && (
                    <Button asChild size="lg" className="gap-2">
                      <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Live Website
                      </a>
                    </Button>
                  )}
                  {caseStudy.githubUrl && (
                    <Button variant="outline" size="lg" className="gap-2" asChild>
                      <a href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        GitHub Repository
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-80">
                <GlassCard className="p-6">
                  <h3 className="font-syne font-bold text-lg mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-white/60">Client</div>
                      <div className="font-medium">{caseStudy.client}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Project Type</div>
                      <div className="font-medium">{caseStudy.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Status</div>
                      <Badge variant={caseStudy.status === 'Live' ? 'default' : 'secondary'}>
                        {caseStudy.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Duration</div>
                      <div className="font-medium">{caseStudy.duration}</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {caseStudy.techStack.map((tech) => {
                const Icon = iconMap[tech.category as keyof typeof iconMap] || Code
                return (
                  <GlassCard key={tech.name} className="p-4 text-center">
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <div className="font-medium text-sm">{tech.name}</div>
                    <div className="text-xs text-white/60 mt-1">{tech.category}</div>
                  </GlassCard>
                )
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-6">The Problem</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              {caseStudy.problem}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Research */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-6">Research & Planning</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              {caseStudy.research}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-6">Design Process</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              {caseStudy.designProcess}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Development */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">Development</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-neon" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.architecture}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple" />
                    Frontend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.frontend}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-neon" />
                    Backend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.backend}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.database}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-neon" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.authentication}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple" />
                    Hosting & Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{caseStudy.development.hosting}</p>
                  <p className="text-white/70 mt-2">{caseStudy.development.deployment}</p>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.features.map((feature, index) => (
                <GlassCard key={index} className="p-6">
                  <h3 className="font-syne font-bold text-xl mb-3">{feature.name}</h3>
                  <p className="text-white/70 mb-4">{feature.description}</p>
                  <div className="text-sm text-white/50">
                    <span className="font-medium">Implementation:</span> {feature.implementation}
                  </div>
                </GlassCard>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Functionality */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">System Functionality</h2>
            <div className="space-y-4">
              {caseStudy.functionality.map((func, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle className="w-6 h-6 text-neon flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-syne font-bold text-lg mb-2">{func.name}</h3>
                    <p className="text-white/70">{func.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">Challenges & Solutions</h2>
            <div className="space-y-6">
              {caseStudy.challenges.map((challenge, index) => (
                <Card key={index} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-purple">Challenge {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">{challenge.problem}</p>
                    <div className="p-4 bg-neon/10 rounded-lg border border-neon/20">
                      <p className="text-neon font-medium mb-2">Solution</p>
                      <p className="text-white/80">{challenge.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-8">Results & Impact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.results.map((result, index) => (
                <GlassCard key={index} className="p-6 text-center">
                  <div className="text-4xl font-syne font-bold text-neon mb-2">{result.value}</div>
                  <div className="text-lg font-medium mb-3">{result.metric}</div>
                  <p className="text-white/60 text-sm">{result.impact}</p>
                </GlassCard>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gallery */}
      {caseStudy.gallery.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-syne font-bold mb-8">Gallery</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {caseStudy.gallery.map((item, index) => (
                  <GlassCard key={index} className="overflow-hidden">
                    <div className="aspect-video bg-white/5 flex items-center justify-center">
                      <span className="text-white/30 text-sm">{item.title}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-white/60">{item.description}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl font-syne font-bold mb-4">Want to build something similar?</h2>
            <p className="text-lg text-white/70 mb-8">
              Let's work together to bring your vision to life.
            </p>
            <Button size="xl" asChild>
              <Link href="/#contact">Get in Touch</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
