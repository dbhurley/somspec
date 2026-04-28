import Link from 'next/link'
import { categories, getPopularTags } from '@/data/posts'
import CategoryDot from './CategoryDot'

const agentLinks = [
  { href: '/llms.txt', label: 'llms.txt', sub: 'Plain-text site index for LLMs' },
  { href: '/api/blog/feed.json', label: 'JSON Feed 1.1', sub: 'Full posts, machine-parseable' },
  { href: '/sitemap.xml', label: 'sitemap.xml', sub: 'XML sitemap of every page' },
  { href: '/robots.txt', label: 'robots.txt', sub: 'Including SOM Directives' },
]

const resourceLinks = [
  { href: '/spec', label: 'SOM/1.0 Specification' },
  { href: '/directives', label: 'Directives Proposal' },
  { href: '/validate', label: 'Validator' },
  { href: '/reference', label: 'Reference Implementations' },
  { href: '/calculator', label: 'Token Calculator' },
  { href: 'https://webtaskbench.com', label: 'WebTaskBench', external: true },
  { href: 'https://github.com/dbhurley/somspec', label: 'GitHub', external: true },
]

export default function BlogSidebar() {
  const popular = getPopularTags(8)

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 self-start" aria-label="Blog sidebar">

      {/* For Agents */}
      <section
        className="rounded-card border border-accent/30 bg-surface p-5 animate-fade-in-delay-1"
        aria-labelledby="for-agents-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          <h3 id="for-agents-heading" className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent">
            For Agents
          </h3>
        </div>
        <p className="font-serif text-xs text-muted leading-relaxed mb-4">
          This blog is published for AI agents as a first-class consumer. Pull structured data directly:
        </p>
        <ul className="space-y-2">
          {agentLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block group rounded px-2 py-1.5 -mx-2 transition-colors hover:bg-accent/5"
              >
                <code className="font-mono text-[12px] text-code group-hover:text-accent transition-colors">
                  {link.label}
                </code>
                <span className="block font-serif text-[11px] text-muted mt-0.5">
                  {link.sub}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section
        className="animate-fade-in-delay-2"
        aria-labelledby="categories-heading"
      >
        <h3 id="categories-heading" className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3 px-1">
          Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <a
                href={`#cat-${cat.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm font-serif text-text/80 hover:text-text hover:bg-surface transition-colors"
              >
                <CategoryDot category={cat} size={8} />
                {cat.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular Tags */}
      <section
        className="animate-fade-in-delay-3"
        aria-labelledby="tags-heading"
      >
        <h3 id="tags-heading" className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3 px-1">
          Popular Tags
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {popular.map(({ tag, count }) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide px-2.5 py-1 rounded-full bg-surface border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors cursor-default">
                {tag}
                <span className="text-muted/50">{count}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Resources */}
      <section
        className="rounded-card border border-border bg-surface/60 p-5 animate-fade-in-delay-4"
        aria-labelledby="resources-heading"
      >
        <h3 id="resources-heading" className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
          Resources
        </h3>
        <ul className="space-y-1.5">
          {resourceLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="font-serif text-[13px] text-text/80 hover:text-accent transition-colors inline-flex items-center gap-1"
              >
                {link.label}
                {link.external && (
                  <span aria-hidden="true" className="text-muted/60 text-[10px]">↗</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        className="rounded-card border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-5 animate-fade-in-delay-5"
        aria-labelledby="cta-heading"
      >
        <h3 id="cta-heading" className="font-display text-base text-text mb-2">
          Make your site agent-ready
        </h3>
        <p className="font-serif text-xs text-muted leading-relaxed mb-4">
          Add five lines to <code className="font-mono text-[11px] bg-surface px-1.5 py-0.5 rounded text-code">robots.txt</code> and become discoverable to AI agents at a fraction of the token cost.
        </p>
        <Link
          href="https://somready.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide uppercase text-accent hover:text-text transition-colors"
        >
          Check your site
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </aside>
  )
}
