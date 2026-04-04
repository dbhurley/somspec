import Link from 'next/link'

export const metadata = {
  title: 'The Discovery Gap: Why AI Agents Miss Your SOM Directives — SOMspec',
  description: 'Even when publishers correctly implement SOM Directives, most AI agents never find them. The research explains why — and what framework authors can do about it.',
}

export default function TheDiscoveryGap() {
  return (
    <article className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link href="/blog" className="inline-block font-mono text-xs text-muted hover:text-accent transition-colors mb-10">
          &larr; Writing
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <time className="font-mono text-xs text-muted/60">2026-04-04</time>
            <span className="text-muted/30">&middot;</span>
            <span className="font-mono text-xs text-muted/60">6 min read</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Research', 'Compliance', 'robots.txt'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text leading-tight">
            The Discovery Gap: Why AI Agents Miss Your SOM Directives
          </h1>
        </header>

        {/* Body */}
        <div className="prose-som font-serif text-text/90 leading-body space-y-6 text-[16.5px]">
          <p>
            The robots.txt SOM Directives proposal is technically elegant. A publisher adds five lines to an existing file. An AI agent reads those lines, discovers a structured SOM endpoint, and fetches compact JSON instead of raw HTML. Token costs drop 10&ndash;100&times;. The page still gets read. The publisher still gets visited. Everyone benefits.
          </p>
          <p>
            The problem is that in empirical testing, most agents never read those five lines.
          </p>
          <p>
            This is the &ldquo;discovery gap&rdquo; &mdash; the distance between a published standard and actual agent behavior. Hurley (2026) measured it in <em>Agent Compliance with robots.txt SOM Directives: Empirical Evidence of the Discovery Gap</em>. The findings are instructive for anyone invested in the future of cooperative web infrastructure.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What the research found</h2>
          <p>
            Most agent frameworks treat robots.txt as an access-control file. They parse <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">Disallow</code> and <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">Allow</code> directives. They check <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">Crawl-delay</code>. But unknown directives &mdash; including all <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">SOM-*</code> directives &mdash; are silently ignored. The framework never errors. The publisher never knows. The agent just keeps fetching raw HTML, consuming tens of thousands of tokens per page for content that could be represented in hundreds.
          </p>
          <p>
            This is not a bug. It is standard behavior for robust parsers: ignore what you don&rsquo;t understand. The same principle that makes robots.txt backward-compatible &mdash; allowing new directives to be added without breaking existing crawlers &mdash; is exactly what creates the discovery gap. Backward compatibility and forward discovery are, in this case, in direct tension.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Three causes</h2>
          <p>
            The research identifies three structural causes for the gap, none of which are individual failures of engineering:
          </p>
          <p>
            <strong className="text-text">1. No standard library.</strong> There is no widely-adopted robots.txt parsing library that implements SOM directive discovery. The popular libraries &mdash; in Python, JavaScript, Go, and Rust &mdash; parse the directives defined in the original 1994 standard and its subsequent extensions. SOM directives are new. Framework authors who want to support them would need to write the parsing themselves, or wait for upstream libraries to add support. Most wait.
          </p>
          <p>
            <strong className="text-text">2. No incentive signal.</strong> Until agents that honor SOM directives are measurably cheaper to run than those that don&rsquo;t, framework maintainers have no urgent reason to prioritize compliance. The cost savings are real &mdash; but they accrue downstream, at the LLM inference layer, not at the framework layer. The person who would save the most money is not the person who needs to write the code. This is a classic misaligned-incentive problem, and it does not resolve itself without measurement.
          </p>
          <p>
            <strong className="text-text">3. No visible compliance tracking.</strong> Before the compliance matrix at somspec.org existed, there was no public record of which frameworks were or weren&rsquo;t compliant. The gap was invisible. You cannot fix what you cannot see, and you cannot prioritize what nobody is measuring. The compliance matrix changes this &mdash; not by shaming anyone, but by making the state of the ecosystem legible.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What Level 1 compliance requires</h2>
          <p>
            The <Link href="/compliance" className="text-accent hover:underline">full compliance checklist</Link> defines three levels. Level 1 &mdash; the minimum &mdash; is deliberately simple. A framework must: parse <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">SOM-*</code> directives from robots.txt. Check for the presence of <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">SOM-Endpoint</code> and <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">SOM-Format</code>. If both are present, fetch from the SOM endpoint instead of the raw HTML URL.
          </p>
          <p>
            That is the complete change. No new protocol. No new authentication. No breaking change to existing behavior. Just: if the publisher has told you where to find structured content, go get it.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Why this matters</h2>
          <p>
            Token costs compound. Consider a framework serving 1 million page fetches per day at an average of 45,000 HTML tokens per page. At GPT-4o pricing ($0.0000025 per token), that is approximately $112,500 per day &mdash; $3,375,000 per month &mdash; just in input tokenization. The same traffic routed through SOM endpoints at a conservative 17&times; compression ratio: $6,600 per day. $198,000 per month.
          </p>
          <p>
            The gap is $3.17 million per month. Per framework. And that is a conservative estimate using a moderate compression ratio. Sites with heavy JavaScript and complex navigation structures routinely see 40&ndash;100&times; compression, which would widen the gap further.
          </p>
          <p>
            The discovery gap is not a technical problem. The five lines of robots.txt work. The SOM endpoints return valid, structured content. The specification is stable and public. This is an adoption problem &mdash; and adoption problems are solved by visibility, documentation, and a clear, public record of who has crossed the line and who has not.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Closing the gap</h2>
          <p>
            SOM Directives are in robots.txt. The endpoints are running. The cost math is not ambiguous. Framework authors who close the discovery gap will have lower-cost systems, more efficient users, and a competitive advantage that compounds with every page fetch.
          </p>
          <p>
            The <Link href="/compliance" className="text-accent hover:underline">compliance matrix</Link> at somspec.org tracks progress. The bar is low. The incentive is real. The gap is waiting to be closed.
          </p>
        </div>

        {/* See also */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="font-display text-lg text-text mb-4">See also</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/compliance" className="font-serif text-sm text-accent hover:underline">Compliance Matrix</Link>
            <span className="text-muted/30">&middot;</span>
            <Link href="/directives" className="font-serif text-sm text-accent hover:underline">Agent Directives</Link>
            <span className="text-muted/30">&middot;</span>
            <Link href="/spec" className="font-serif text-sm text-accent hover:underline">Specification</Link>
          </div>
        </div>
      </div>
    </article>
  )
}
