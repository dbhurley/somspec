import Link from 'next/link'

export const metadata = {
  title: 'TechCrunch Was Blocked. Now It\'s 77×. What Changed? — SOMspec',
  description: 'Plasmate v0.5.0 quietly fixed something important: major news sites that were previously unreachable due to anti-bot protection now fetch cleanly — with some of the highest compression ratios in the benchmark.',
}

export default function TechCrunchWasBlocked() {
  return (
    <article className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="inline-block font-mono text-xs text-muted hover:text-accent transition-colors mb-10">
          &larr; Writing
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <time className="font-mono text-xs text-muted/60">2026-04-04</time>
            <span className="text-muted/30">&middot;</span>
            <span className="font-mono text-xs text-muted/60">5 min read</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Benchmarks', 'v0.5.0', 'News & Media'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text leading-tight">
            TechCrunch Was Blocked. Now It&apos;s 77&times;. What Changed?
          </h1>
        </header>

        <div className="prose-som font-serif text-text/90 leading-body space-y-6 text-[16.5px]">
          <p>
            When we ran the first WebTaskBench benchmark in early April, TechCrunch was in the failure list. Not because the site is poorly structured or agent-hostile by policy, but because Cloudflare&apos;s anti-bot protection was returning a challenge page instead of content. The raw HTML tokens for a challenge page are essentially zero. The SOM was empty. We marked it as a failed fetch and moved on.
          </p>
          <p>
            After upgrading to Plasmate v0.5.0 and re-running the benchmark, TechCrunch fetched cleanly: 108,481 HTML tokens compressed to 1,398 SOM tokens. A ratio of 77.5&times; &mdash; the highest compression we have measured on any news site, and among the highest in the entire benchmark.
          </p>
          <p>
            That number is worth pausing on. An AI agent reading TechCrunch through raw HTML consumes roughly the same token budget as reading a short novel. The same page, served as SOM, fits comfortably in a single fast API call. The content is equivalent. The cost is not.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What v0.5.0 changed</h2>
          <p>
            The TechCrunch fix is a byproduct of improved browser fingerprinting in v0.5.0. Cloudflare&apos;s challenge pages are triggered by HTTP client signatures that look automated: missing headers, incorrect TLS extension ordering, suspicious ALPN values. Plasmate&apos;s v0.5.0 release tightened its browser emulation at the network layer, making its requests indistinguishable from a standard Chrome session to most bot-detection systems. TechCrunch was not a specific target; it was simply one of the sites that had been blocking Plasmate for this reason.
          </p>
          <p>
            A second change had a more systematic effect on news sites specifically: GDPR consent overlay stripping. Modern news publishers in Europe and the United States are legally required to present cookie consent banners to visitors. These banners are implemented as full-page overlays with substantial DOM footprints. The New York Times consent layer, for example, contains several hundred elements, multiple tracking script declarations, and a complete alternative navigation structure for non-consenting users. None of this is content. All of it inflates HTML token counts.
          </p>
          <p>
            Plasmate v0.5.0 detects and removes these overlays before extraction. The effect on our benchmark was immediate. The New York Times moved from an estimated 43&times; compression ratio to a measured 59.9&times;. The Guardian, which has a particularly complex consent implementation, showed different results &mdash; its SOM is now larger relative to its HTML because Plasmate is correctly capturing more article-body content, including elements that were previously hidden behind the consent layer. The compression ratio dropped; the quality of what is captured increased.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The measurement problem</h2>
          <p>
            This creates an interesting tension in how we report benchmark numbers. Compression ratio is a useful proxy for efficiency, but it is not the same thing as usefulness to an agent. A SOM that captures 95% of the article body at 13&times; compression is more useful than one that captures 40% of the article body at 43&times; compression. The Guardian&apos;s apparent regression in our numbers is likely an improvement in practice.
          </p>
          <p>
            Plasmate&apos;s own internal benchmarks for v0.5.0 report a 4&times; average compression across 100 agent tasks on 50 real websites. Our measurement of 17.7&times; average on 45 sites uses a different methodology: we compare raw HTML bytes to SOM JSON bytes, without normalization for content relevance. Neither number is wrong. They measure different things. Plasmate&apos;s number answers &ldquo;how much cheaper is an agent task?&rdquo;. Ours answers &ldquo;how much smaller is the structured representation?&rdquo;
          </p>
          <p>
            The distinction matters because publishers making implementation decisions care primarily about the first question. How much will this reduce the cost of agents reading my site? That depends on what those agents are doing, not just on how compressible the page is.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What the numbers suggest for publishers</h2>
          <p>
            Across the news vertical specifically, the v0.5.0 data shows compression ratios ranging from 13&times; to 78&times;, with an average in the high thirties. These are homepage measurements; article pages, which have higher signal-to-noise ratios, tend to compress even more favorably.
          </p>
          <p>
            For a publisher receiving meaningful AI agent traffic &mdash; crawlers researching recent coverage, summarization services, research agents building knowledge bases &mdash; the economics of serving SOM vs. raw HTML are straightforward. At 40&times; compression and a standard LLM API pricing of $3 per million input tokens, serving one million agent page-reads through a SOM endpoint costs approximately $75 in model fees. Serving the same traffic as raw HTML costs approximately $3,000. The SOM Directives robots.txt implementation that routes agents to the SOM endpoint takes about five minutes to add.
          </p>
          <p>
            The barrier is not technical. It is awareness.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Next in the data</h2>
          <p>
            The WebTaskBench benchmark now runs automatically each week against the latest Plasmate release. As v0.5.x improvements continue &mdash; particularly in table extraction, ARIA state handling, and the <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">compile</code> subcommand for publisher-side pre-rendering &mdash; we will track the real-world effect on compression ratios across all three verticals.
          </p>
          <p>
            The TechCrunch story is, in a small way, a model for what this ecosystem is trying to do. A site that was invisible to structured agent fetching is now accessible at 77&times; compression. No change was required on TechCrunch&apos;s side. The improvement came from the tooling getting better. When publishers add SOM Directives, agents that respect them get the same result automatically, without waiting for the next round of tooling improvements on either side.
          </p>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="font-mono text-xs text-muted/60 mb-3">Further reading</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/reading-the-leaderboard" className="text-accent hover:underline">
                  How to Read the WebTaskBench Leaderboard &rarr;
                </Link>
              </li>
              <li>
                <Link href="/blog/the-publishers-third-option" className="text-accent hover:underline">
                  The Publisher&apos;s Third Option &rarr;
                </Link>
              </li>
              <li>
                <a href="https://webtaskbench.com/news" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  News &amp; Media vertical benchmark &rarr;
                </a>
              </li>
              <li>
                <a href="https://somready.com/check" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Check your site&apos;s SOM readiness &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}
