import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Steve Ronald | Full-Stack Developer & Brand Designer',
  description: 'OmniCreava Studio — Premium digital experiences, brand identity, and full-stack development.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
