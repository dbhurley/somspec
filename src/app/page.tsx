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

const stats = [
  '17x average token reduction',
  'Apache 2.0 - Open Standard',
  'W3C Community Group',
]

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">{label}</span>
      <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">{title}</h2>
      {subtitle && <p className="text-muted max-w-2xl">{subtitle}</p>}
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              The Web Format for{' '}
              <span className="gradient-text">AI Agents</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              SOM is an open specification for representing web pages as structured
              JSON - compact, typed, and built for LLM consumption.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-delay-1">
            {stats.map((stat) => (
              <span
                key={stat}
                className="px-4 py-2 text-sm text-muted bg-surface border border-border rounded-full"
              >
                {stat}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-delay-2">
            <Link
              href="/spec"
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Read the Spec &rarr;
            </Link>
            <a
              href="https://github.com/plasmate-labs/plasmate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-surface hover:bg-surface/80 text-text border border-border hover:border-accent/40 font-medium rounded-lg transition-all"
            >
              View on GitHub
            </a>
          </div>

          <div className="max-w-3xl mx-auto animate-fade-in-delay-3 glow-accent rounded-card">
            <CodeBlock code={heroCode} language="json" />
          </div>
        </div>
      </section>

      {/* Why SOM */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          label="Comparison"
          title="Why SOM?"
          subtitle="SOM replaces raw HTML, Markdown, and accessibility trees as the format AI agents use to understand web pages."
        />
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <ComparisonTable />
        </div>
      </section>

      {/* The Specification */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          label="Specification"
          title="The Specification"
          subtitle="SOM v1.0 defines a compact, typed JSON representation of web pages. Explore the core concepts below."
        />
        <SpecAccordion />
      </section>

      {/* Get Started */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          label="Quick Start"
          title="Get Started"
          subtitle="Install the reference implementation and start converting pages to SOM in seconds."
        />
        <div className="max-w-3xl">
          <GetStartedTabs />
        </div>
      </section>

      {/* Implementations */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          label="Ecosystem"
          title="Implementations"
          subtitle="Tools and libraries that produce or consume SOM documents."
        />
        <ImplementationCards />
      </section>
    </>
  )
}
