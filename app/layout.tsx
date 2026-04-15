import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import Analytics from './components/Analytics'

export const metadata: Metadata = {
  title: 'Steve Ronald | Full-Stack Developer & Brand Designer',
  description: 'OmniCreava Studio — Premium digital experiences, brand identity, and full-stack development.',
  keywords: ['Full-Stack Developer', 'React', 'Next.js', 'TypeScript', 'Brand Design', '3D Artist', 'UI/UX', 'Web Development', 'South Africa'],
  authors: [{ name: 'Steve Ronald', url: 'https://github.com/Steve1-7' }],
  creator: 'Steve Ronald',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://my-portfolio-six-virid-22.vercel.app',
    title: 'Steve Ronald | Full-Stack Developer & Brand Designer',
    description: 'OmniCreava Studio — Premium digital experiences, brand identity, and full-stack development.',
    siteName: 'Steve Ronald Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Steve Ronald Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steve Ronald | Full-Stack Developer & Brand Designer',
    description: 'OmniCreava Studio — Premium digital experiences, brand identity, and full-stack development.',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Steve Ronald',
    jobTitle: 'Full-Stack Developer & Brand Designer',
    email: 'stevezuluu@gmail.com',
    url: 'https://my-portfolio-six-virid-22.vercel.app',
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
      'Blender',
      'UI/UX Design',
      'Brand Design',
      '3D Modeling',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'South Africa',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
