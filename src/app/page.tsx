'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import ComparisonTable from '@/components/ComparisonTable'
import SpecAccordion from '@/components/SpecAccordion'
import GetStartedTabs from '@/components/GetStartedTabs'
import ImplementationCards from '@/components/ImplementationCard'

const heroCode = `{
  "som_version": "1.0",
  "url": "https://example.com",
  "title": "Example Domain",
  "regions": [{
    "id": "r_main",
    "role": "main",
    "elements": [{
      "id": "e_3f8a2b1c",
      "role": "heading",
      "text": "Example Domain",
      "attrs": { "level": 1 }
    }, {
      "id": "e_9d4e7f2a",
      "role": "paragraph",
      "text": "This domain is for use in illustrative examples."
    }, {
      "id": "e_1a5c8b3e",
      "role": "link",
      "text": "More information...",
      "attrs": { "href": "https://www.iana.org/domains/example" },
      "actions": ["click"]
    }]
  }],
  "meta": {
    "html_bytes": 1256,
    "som_bytes": 312,
    "element_count": 3,
    "compression_ratio": 4.0
  }
}`

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function SectionWithGutter({
  number,
  children,
  className = '',
}: {
  number: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Left gutter with section number */}
        <div className="hidden lg:flex w-[15%] shrink-0 justify-end pr-8 pt-2">
          <span className="section-number sticky top-24">{number}</span>
        </div>
        {/* Content */}
        <div className="w-full lg:w-[85%] max-w-[900px]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  useScrollReveal()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden noise-overlay">
        {/* Left gold accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-accent/40 to-transparent" />

        <div className="relative z-10">
          <div className="flex">
            {/* Left gutter — SOM watermark */}
            <div className="hidden lg:flex w-[15%] shrink-0 justify-end pr-6 pt-32">
              <div className="sticky top-24">
                <span className="font-display text-[10rem] font-light leading-none tracking-tight" style={{ color: 'rgba(199, 168, 83, 0.04)' }}>
                  S<br/>O<br/>M
                </span>
              </div>
            </div>

            {/* Main hero content */}
            <div className="w-full lg:w-[85%] max-w-[900px] px-6 pt-24 pb-16 md:pt-36 md:pb-24">
              <div className="animate-fade-in">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted block mb-6">
                  Open Specification v1.0
                </span>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1] text-text">
                  Structured Object Model
                </h1>
              </div>

              <p className="animate-fade-in-delay-1 font-serif text-lg md:text-xl text-muted max-w-2xl leading-body mb-10">
                An open specification for representing web pages as structured JSON.
                SOM defines typed element roles, stable identifiers, and semantic regions
                — producing documents an order of magnitude smaller than raw HTML.
              </p>

              <div className="animate-fade-in-delay-2 flex flex-wrap gap-4 mb-10">
                <Link
                  href="/spec"
                  className="px-7 py-3.5 bg-accent hover:bg-accent/90 text-bg font-display font-medium rounded-card transition-all hover:shadow-lg hover:shadow-accent/20 text-sm tracking-wide"
                >
                  Read the Specification
                </Link>
                <a
                  href="https://github.com/nicholasgriffintn/som-spec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 text-text border border-border hover:border-accent/40 font-display font-medium rounded-card transition-all text-sm tracking-wide"
                >
                  GitHub
                </a>
              </div>

              <div className="animate-fade-in-delay-2 mb-16 font-mono text-[11px] text-muted/50 tracking-wide">
                Version 1.0 &nbsp;&middot;&nbsp; Apache 2.0 License &nbsp;&middot;&nbsp; W3C Community Group Proposal
              </div>

              <div className="animate-fade-in-delay-3 glow-gold rounded-card">
                <CodeBlock code={heroCode} language="json" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="hr-ornament my-0" />

      {/* Why SOM */}
      <section className="py-24 reveal">
        <SectionWithGutter number="02">
          <div className="px-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Format Analysis</span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-text mb-3">Related Formats</h2>
            <p className="text-muted font-serif leading-body max-w-2xl mb-10">
              Prior to SOM, agent pipelines consumed web content as raw HTML, stripped Markdown, or accessibility trees — each a repurposing of a format designed for other consumers. The table below characterises the trade-offs.
            </p>
            <ComparisonTable />
          </div>
        </SectionWithGutter>
      </section>

      <hr className="hr-ornament my-0" />

      {/* Spec Accordion */}
      <section className="py-24 reveal">
        <SectionWithGutter number="03">
          <div className="px-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Specification</span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-text mb-3">The Specification</h2>
            <p className="text-muted font-serif leading-body max-w-2xl mb-10">
              SOM v1.0 defines a compact, typed JSON representation of web pages. Explore the core concepts below.
            </p>
            <SpecAccordion />
          </div>
        </SectionWithGutter>
      </section>

      <hr className="hr-ornament my-0" />

      {/* Get Started */}
      <section className="py-24 reveal">
        <SectionWithGutter number="04">
          <div className="px-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Quick Start</span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-text mb-3">Get Started</h2>
            <p className="text-muted font-serif leading-body max-w-2xl mb-10">
              Install the reference implementation and start converting pages to SOM in seconds.
            </p>
            <div className="max-w-3xl">
              <GetStartedTabs />
            </div>
          </div>
        </SectionWithGutter>
      </section>

      <hr className="hr-ornament my-0" />

      {/* Implementations */}
      <section className="py-24 reveal">
        <SectionWithGutter number="05">
          <div className="px-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Ecosystem</span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-text mb-3">Implementations</h2>
            <p className="text-muted font-serif leading-body max-w-2xl mb-10">
              Tools and libraries that produce or consume SOM documents.
            </p>
            <ImplementationCards />
          </div>
        </SectionWithGutter>
      </section>
    </>
  )
}
