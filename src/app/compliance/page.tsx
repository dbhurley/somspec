import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Framework Compliance — SOMspec',
  description: 'Empirical tracking of which AI agent frameworks honor SOM Directives when encountered in robots.txt.',
  alternates: { canonical: '/compliance' },
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-start gap-4 mb-5">
        <span className="font-mono text-xs text-accent/40 pt-[3px] select-none tabular-nums">{number}</span>
        <h2 className="text-lg font-display font-semibold text-text">{title}</h2>
      </div>
      <div className="pl-8 space-y-4 text-sm text-muted leading-relaxed font-serif">
        {children}
      </div>
    </section>
  )
}

function LevelBadge({ level }: { level: 0 | 1 | 2 }) {
  if (level === 2) return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-success/10 text-success border border-success/20">Level 2</span>
  if (level === 1) return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-accent/10 text-accent border border-accent/20">Level 1</span>
  return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20">Level 0</span>
}

const frameworks = [
  { name: 'LangChain', by: 'LangChain Inc.', level: 0 as const, notes: 'No robots.txt SOM parsing. HTML fetching via WebBaseLoader.' },
  { name: 'LlamaIndex', by: 'LlamaIndex Inc.', level: 0 as const, notes: 'SimpleWebPageReader fetches raw HTML. No SOM directive support.' },
  { name: 'Browser Use', by: 'browser-use', level: 0 as const, notes: 'Chromium-based. Does not check robots.txt directives.' },
  { name: 'CrewAI', by: 'CrewAI Inc.', level: 0 as const, notes: 'Uses LangChain tools underneath; inherits same gap.' },
  { name: 'AutoGen', by: 'Microsoft', level: 0 as const, notes: 'WebSurferAgent fetches HTML. No SOM awareness.' },
  { name: 'Smolagents', by: 'Hugging Face', level: 0 as const, notes: 'VisitWebpageTool fetches raw HTML.' },
  { name: 'Plasmate', by: 'Plasmate Labs', level: 2 as const, notes: 'Reference implementation. Checks robots.txt before fetching.' },
  { name: 'OpenClaw', by: 'OpenClaw', level: 1 as const, notes: 'Checks robots.txt. SOM endpoint discovery in progress.' },
]

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 mb-4">
            COMMUNITY RESEARCH · April 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-light text-text mb-4 leading-tight">
            Framework Compliance
          </h1>
          <p className="text-muted font-serif leading-body text-[15px] max-w-2xl">
            Empirical tracking of which AI agent frameworks honor SOM Directives when encountered in robots.txt.
            Based on the Discovery Gap research by Hurley (2026).
          </p>
          <p className="mt-4 text-xs font-mono text-accent/60 bg-surface border border-border rounded-card px-4 py-2 inline-block">
            As of April 2026, no major framework has reached Level 1 compliance. This page tracks progress.
          </p>
        </div>

        <hr className="hr-ornament mb-12" />

        <Section number="01" title="Compliance Levels">
          <p>
            The SOM Directives specification defines three compliance levels.
            See <Link href="/directives" className="text-accent hover:underline">Directives</Link> for the full spec.
          </p>
          <div className="space-y-3 mt-3">
            <div className="flex gap-3 items-start">
              <LevelBadge level={0} />
              <div>
                <span className="font-display text-text text-sm font-medium">Aware</span>
                <span className="text-muted"> — Parses robots.txt for SOM-* directives, does not change behavior.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <LevelBadge level={1} />
              <div>
                <span className="font-display text-text text-sm font-medium">Respectful</span>
                <span className="text-muted"> — Honors SOM-Endpoint and fetches SOM instead of raw HTML when present.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <LevelBadge level={2} />
              <div>
                <span className="font-display text-text text-sm font-medium">Full</span>
                <span className="text-muted"> — Honors all directives including rate limits, attribution, paywall paths.</span>
              </div>
            </div>
          </div>
        </Section>

        <Section number="02" title="Current Status">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Framework</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Maintained by</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Level</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Notes</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((fw) => (
                  <tr
                    key={fw.name}
                    className={`border-b border-border/50 ${
                      fw.level === 2 ? 'bg-success/[0.04]' : ''
                    }`}
                  >
                    <td className="py-3 pr-4 font-mono text-xs text-text whitespace-nowrap font-medium">{fw.name}</td>
                    <td className="py-3 pr-4 text-xs text-muted/70 font-serif whitespace-nowrap">{fw.by}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <LevelBadge level={fw.level} />
                    </td>
                    <td className={`py-3 text-xs font-serif leading-relaxed ${fw.level === 0 ? 'text-muted/60' : 'text-muted'}`}>
                      {fw.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number="03" title="What Level 1 Compliance Requires">
          <p>For framework authors implementing SOM directive support:</p>
          <ol className="list-decimal list-inside space-y-2 mt-3 pl-2">
            <li>On each fetch, retrieve <span className="font-mono text-code text-xs">robots.txt</span> for the target domain (if not already cached).</li>
            <li>Parse all <span className="font-mono text-code text-xs">SOM-*</span> directives using the spec at <Link href="/directives" className="text-accent hover:underline">somspec.org/directives</Link>.</li>
            <li>If <span className="font-mono text-code text-xs">SOM-Endpoint</span> is present and <span className="font-mono text-code text-xs">SOM-Format</span> is &quot;SOM/1.0&quot; (or preferred), fetch from endpoint instead of raw HTML.</li>
            <li>Pass the SOM JSON to the model context instead of the raw HTML response.</li>
            <li>Respect <span className="font-mono text-code text-xs">SOM-Freshness</span> by caching SOM responses appropriately.</li>
          </ol>
        </Section>

        <Section number="04" title="Open Source Tracking">
          <p>
            This page is manually maintained. If your framework has implemented compliance,
            open an issue or PR at{' '}
            <Link href="https://github.com/dbhurley/somspec" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              github.com/dbhurley/somspec
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="https://www.w3.org/community/web-content-browser-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-accent hover:underline"
            >
              W3C Community Group →
            </Link>
            <Link
              href="https://docs.plasmate.app/robots-txt-proposal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-accent hover:underline"
            >
              Full robots.txt proposal →
            </Link>
          </div>
        </Section>

      </div>
    </div>
  )
}
