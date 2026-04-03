import type { Metadata } from 'next'
import { Fraunces, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'SOMspec - Structured Object Model Specification',
    template: '%s | SOMspec'
  },
  description: 'The open specification for representing web pages as structured JSON for AI agents. Typed element roles, stable SHA-256 identifiers, and semantic regions — 17x fewer tokens than raw HTML.',
  keywords: ['structured object model', 'SOM', 'web scraping', 'AI agents', 'LLM', 'JSON specification', 'agent web protocol', 'browser automation'],
  authors: [{ name: 'SOMspec Contributors' }],
  creator: 'Plasmate Labs',
  metadataBase: new URL('https://somspec.org'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://somspec.org',
    siteName: 'SOMspec',
    title: 'SOMspec - Structured Object Model Specification',
    description: 'Open specification for representing web pages as structured JSON for AI agents.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SOMspec - Structured Object Model' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOMspec - Structured Object Model Specification',
    description: 'Open specification for representing web pages as structured JSON for AI agents.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text min-h-screen font-serif">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
