import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Version history of the SOM specification.',
  alternates: { canonical: '/changelog' },
}

const releases = [
  {
    version: '1.0',
    date: 'April 2026',
    title: 'Initial Release',
    description: 'The first stable release of the Semantic Object Model specification.',
    changes: [
      {
        category: 'Specification',
        items: [
          'Defined the SOM document structure with flat region/element hierarchy',
          'Established 15 element types covering all common web interaction patterns',
          'Specified SHA-256 based stable ID generation algorithm',
          'Defined 10 standard region roles with detection precedence rules',
          'Documented meta block fields for compression statistics',
          'Specified structured data extraction for JSON-LD, OpenGraph, Twitter Card, link relations, and meta tags',
        ],
      },
      {
        category: 'Element System',
        items: [
          'Defined role-specific attribute schemas for all 15 element types',
          'Established 5 action types: click, type, select, toggle, clear',
          'Added CSS-inferred semantic hints: visually_hidden, primary, destructive, disabled_visual, truncated',
          'Added ARIA state capture: expanded, checked, selected, disabled, pressed, invalid, required, readonly',
        ],
      },
      {
        category: 'Conformance',
        items: [
          'Defined 8 conformance requirements for implementations',
          'Established forward-compatibility rules: consumers must ignore unknown fields',
          'Specified version negotiation: reject unrecognized major versions',
        ],
      },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="mb-20">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent/60 mb-4 block">History</span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-text mb-4">Changelog</h1>
        <p className="text-lg text-muted font-serif leading-body max-w-2xl">
          Version history of the SOM specification. Each release documents changes to the format,
          new element types, and conformance updates.
        </p>
      </div>

      <hr className="hr-ornament mb-16" />

      <div className="space-y-12">
        {releases.map((release) => (
          <article
            key={release.version}
            className="relative pl-8 border-l-2 border-accent/20"
          >
            <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-accent border-4 border-[#FAF8F3]" />

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-display font-light text-text">v{release.version}</h2>
                <span className="text-sm text-muted/50 font-mono">{release.date}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
                  Latest
                </span>
              </div>
              <h3 className="text-lg text-muted font-display mb-2">{release.title}</h3>
              <p className="text-sm text-muted/60 font-serif">{release.description}</p>
            </div>

            <div className="space-y-8">
              {release.changes.map((group) => (
                <div key={group.category}>
                  <h4 className="text-sm font-display text-text uppercase tracking-wider mb-3">
                    {group.category}
                  </h4>
                  <ul className="space-y-2">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted font-serif leading-body">
                        <span className="text-accent mt-0.5 shrink-0">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 p-6 bg-surface border border-border rounded-card text-center">
        <p className="text-muted font-serif">
          Subscribe to specification updates on{' '}
          <a
            href="https://github.com/nicholasgriffintn/som-spec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  )
}
