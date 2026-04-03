import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Publisher Adoption — SOMspec',
  description: 'Which major websites have gone agent-ready? Tracking SOM Directive adoption across the web.',
  alternates: { canonical: '/publishers' },
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

const sites = [
  { site: 'nytimes.com', category: 'News', live: false, potential: '43×' },
  { site: 'theguardian.com', category: 'News', live: false, potential: '38×' },
  { site: 'techcrunch.com', category: 'News', live: false, potential: '35×' },
  { site: 'vercel.com', category: 'SaaS', live: false, potential: '29×' },
  { site: 'stripe.com', category: 'SaaS', live: false, potential: '52×' },
  { site: 'github.com', category: 'Dev Tools', live: false, potential: '18×' },
  { site: 'docs.python.org', category: 'Dev Tools', live: false, potential: '22×' },
  { site: 'medium.com', category: 'Publishing', live: false, potential: '31×' },
  { site: 'substack.com', category: 'Publishing', live: false, potential: '27×' },
  { site: 'wordpress.com', category: 'Publishing', live: false, potential: '24×' },
  { site: 'shopify.com', category: 'E-commerce', live: false, potential: '45×' },
  { site: 'woocommerce.com', category: 'E-commerce', live: false, potential: '41×' },
  { site: 'cloud.google.com', category: 'Cloud', live: false, potential: '118×' },
  { site: 'aws.amazon.com', category: 'Cloud', live: false, potential: '87×' },
  { site: 'docs.microsoft.com', category: 'Dev Tools', live: false, potential: '34×' },
  { site: 'smashingmagazine.com', category: 'Publishing', live: false, potential: '29×' },
  { site: 'ycombinator.com', category: 'Tech', live: false, potential: '14×' },
  { site: 'producthunt.com', category: 'Tech', live: false, potential: '19×' },
  { site: 'arstechnica.com', category: 'News', live: false, potential: '37×' },
  { site: 'somready.com', category: 'SaaS', live: true, potential: '—' },
]

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 mb-4">
            COMMUNITY DATA · April 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-light text-text mb-4 leading-tight">
            Publisher Adoption
          </h1>
          <p className="text-muted font-serif leading-body text-[15px] max-w-2xl">
            Which major websites have gone agent-ready? Tracking SOM Directive adoption across the web.
          </p>
          <p className="mt-4 text-xs font-mono text-accent/60 bg-surface border border-border rounded-card px-4 py-2 inline-block">
            Scanning top 1,000 sites monthly. Last scan: April 2026. 0 of 50 checked sites have SOM directives.
          </p>
        </div>

        <hr className="hr-ornament mb-12" />

        <Section number="01" title="Why This Matters">
          <p>
            When publishers add SOM Directives to robots.txt, AI agents can serve their content at
            10–100× lower token cost. Better for agents. Better for publishers. This leaderboard
            tracks the early adopters.
          </p>
        </Section>

        <Section number="02" title="Status Summary">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface border border-border rounded-card p-5 text-center">
              <p className="text-3xl font-display font-light text-text">50</p>
              <p className="text-xs font-mono text-muted/60 mt-1 uppercase tracking-wider">Sites scanned</p>
            </div>
            <div className="bg-surface border border-border rounded-card p-5 text-center">
              <p className="text-3xl font-display font-light text-text">0</p>
              <p className="text-xs font-mono text-muted/60 mt-1 uppercase tracking-wider">With SOM directives</p>
            </div>
            <div className="bg-surface border border-border rounded-card p-5 text-center">
              <p className="text-3xl font-display font-light text-accent">17×</p>
              <p className="text-xs font-mono text-muted/60 mt-1 uppercase tracking-wider">Avg compression potential</p>
            </div>
          </div>
        </Section>

        <Section number="03" title="Site Tracking">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Site</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Category</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">SOM Directives</th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Potential</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-wider text-muted/60 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((s) => (
                  <tr key={s.site} className={`border-b border-border/50 ${s.live ? 'bg-success/[0.04]' : ''}`}>
                    <td className="py-3 pr-4 font-mono text-xs text-text whitespace-nowrap">{s.site}</td>
                    <td className="py-3 pr-4 text-xs text-muted/70 font-serif whitespace-nowrap">{s.category}</td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap">
                      {s.live ? (
                        <span className="text-success font-mono font-medium">✓ Live</span>
                      ) : (
                        <span className="text-muted/50 font-mono">✗ Not yet</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs font-mono text-muted/70">{s.potential}</td>
                    <td className="py-3 text-xs font-serif">
                      {s.live ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-success/10 text-success border border-success/20">Early adopter</span>
                      ) : (
                        <span className="text-muted/50 font-mono text-[11px]">Monitored</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number="04" title="Submit Your Site">
          <p>
            Is your site SOM-ready? Let us know and we&apos;ll add it to the list.
          </p>
          <div className="mt-3">
            <Link
              href="https://github.com/dbhurley/somspec/issues/new?title=Publisher+Adoption:+[your+domain]&body=My+site+has+SOM+directives+in+robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-accent text-bg text-xs font-mono rounded-card hover:bg-accent/90 transition-colors"
            >
              Open a GitHub Issue →
            </Link>
          </div>
        </Section>

        <Section number="05" title="Methodology">
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Each site&apos;s <span className="font-mono text-code text-xs">robots.txt</span> is fetched and scanned for <span className="font-mono text-code text-xs">SOM-*</span> directives.</li>
            <li>Compression potential is calculated using{' '}
              <Link href="https://webtaskbench.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">webtaskbench.com</Link>{' '}
              benchmark data for category averages.
            </li>
            <li>Scans run monthly against a curated list of high-traffic sites.</li>
          </ul>
        </Section>

      </div>
    </div>
  )
}
