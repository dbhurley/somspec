import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'SOM Specification - The Web Format for AI Agents',
  description: 'SOM is an open specification for representing web pages as structured JSON - compact, typed, and built for LLM consumption.',
  openGraph: {
    title: 'SOM Specification',
    description: 'The Web Format for AI Agents. Open specification for structured JSON web representation.',
    url: 'https://somspec.org',
    siteName: 'SOMspec',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOM Specification',
    description: 'The Web Format for AI Agents',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text min-h-screen">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
