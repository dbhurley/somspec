import type { Metadata } from 'next'
import { Fraunces, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

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
    <html lang="en" className={`dark ${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text min-h-screen font-serif">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
