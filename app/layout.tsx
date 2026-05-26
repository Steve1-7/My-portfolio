import type { Metadata, Viewport } from 'next'
import { Inter, Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import Analytics from './components/Analytics'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.eva-tech-studio.com'),
  title: {
    default: 'Eva Tech Studio | Premium Digital Experiences',
    template: '%s | Eva Tech Studio',
  },
  description: 'Eva Tech Studio — Building modern websites, dashboards, and digital systems that evolve with your business. Full-stack development, brand identity, and premium digital experiences.',
  keywords: ['Full-Stack Developer', 'React', 'Next.js', 'TypeScript', 'Brand Design', 'Web Development', 'South Africa', 'Eva Tech Studio', 'Digital Agency', 'UI/UX Design'],
  authors: [{ name: 'Steve Ronald', url: 'https://www.eva-tech-studio.com' }],
  creator: 'Steve Ronald',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.eva-tech-studio.com',
    title: 'Eva Tech Studio | Premium Digital Experiences',
    description: 'Building modern websites, dashboards, and digital systems that evolve with your business.',
    siteName: 'Eva Tech Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eva Tech Studio - Premium Digital Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eva Tech Studio | Premium Digital Experiences',
    description: 'Building modern websites, dashboards, and digital systems that evolve with your business.',
    images: ['/og-image.jpg'],
    creator: '@SteveRonald',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.eva-tech-studio.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eva Tech Studio',
    url: 'https://www.eva-tech-studio.com',
    logo: 'https://www.eva-tech-studio.com/logo.png',
    founder: {
      '@type': 'Person',
      name: 'Steve Ronald',
      jobTitle: 'Full-Stack Developer & Brand Designer',
      email: 'stevezuluu@gmail.com',
      sameAs: [
        'https://github.com/Steve1-7',
        'https://www.linkedin.com/in/steve-ronald1710s/',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'South Africa',
    },
    sameAs: [
      'https://github.com/Steve1-7',
      'https://www.linkedin.com/in/steve-ronald1710s/',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Figma',
      'UI/UX Design',
      'Brand Design',
      'Web Development',
      'E-Commerce',
    ],
    offers: {
      '@type': 'Offer',
      itemOffered: [
        {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Custom websites, dashboards, and web applications',
        },
        {
          '@type': 'Service',
          name: 'Brand Identity',
          description: 'Logo design, visual identity, and brand systems',
        },
        {
          '@type': 'Service',
          name: 'E-Commerce Solutions',
          description: 'Online stores and e-commerce platforms',
        },
      ],
    },
  }

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Analytics />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
