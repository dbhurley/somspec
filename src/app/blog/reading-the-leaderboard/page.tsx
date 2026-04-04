import Link from 'next/link'

export const metadata = {
  title: 'How to Read the WebTaskBench Leaderboard — SOMspec',
  description: 'What does a 43x compression ratio actually mean for an AI agent? A practical guide to interpreting token efficiency data.',
}

export default function ReadingTheLeaderboard() {
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
            <span className="font-mono text-xs text-muted/60">4 min read</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Benchmarks', 'Token Economics', 'Guide'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text leading-tight">
            How to Read the WebTaskBench Leaderboard
          </h1>
        </header>

        {/* Body */}
        <div className="prose-som font-serif text-text/90 leading-body space-y-6 text-[16.5px]">
          <p>
            webtaskbench.com publishes compression ratios comparing raw HTML token counts to SOM token counts across 44 major websites. If you have looked at the leaderboard and wondered what a 117.9&times; ratio actually means for your publishing operation, this is the practical guide.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What the ratio measures</h2>
          <p>
            The ratio is simple: <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">html_tokens / som_tokens</code>. A ratio of 43&times; for nytimes.com means the SOM representation of a New York Times page uses 43 times fewer tokens than the raw HTML. Not 43% fewer &mdash; 43 <em>times</em> fewer.
          </p>
          <p>
            The tokenizer is <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">tiktoken cl100k_base</code>, the same tokenizer used by GPT-3.5, GPT-4, and GPT-4o. This makes the numbers directly comparable to actual API costs. When the leaderboard says a page is 45,000 HTML tokens, that is the same 45,000 tokens your API bill reflects.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Why the range is so wide</h2>
          <p>
            The leaderboard shows ratios from roughly 4&times; to 118&times;. This range is not noise &mdash; it reflects genuine structural differences in how websites are built.
          </p>
          <p>
            Cloud dashboard pages like cloud.google.com have extreme ratios (117.9&times;) because their raw HTML is dominated by large navigation structures, dynamically loaded JavaScript bundles, and deeply nested component trees. The actual semantic content &mdash; the text, the headings, the links, the interactive elements a user or agent cares about &mdash; is a small fraction of the total HTML payload. SOM extracts that fraction. The rest disappears.
          </p>
          <p>
            Simple editorial pages compress less dramatically because their HTML is already closer to their content. A well-structured article page with minimal JavaScript might compress only 4&ndash;8&times;. That is still significant &mdash; it still means 75&ndash;87% fewer tokens &mdash; but it is not the headline-grabbing 100&times; number. The ratio tells you how much of your HTML is <em>not</em> your content. A high ratio means your pages are heavy with structure. A low ratio means your HTML is already relatively clean.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The dollar math</h2>
          <p>
            The practical formula is straightforward:
          </p>
          <div className="bg-surface border border-border rounded-card p-5 my-6 font-mono text-sm space-y-1">
            <p className="text-muted">daily_html_cost = pages_per_day &times; html_tokens &times; token_price</p>
            <p className="text-muted">daily_som_cost &nbsp;= pages_per_day &times; som_tokens &times; token_price</p>
            <p className="text-text mt-2">daily_savings &nbsp;&nbsp;= daily_html_cost &minus; daily_som_cost</p>
          </div>
          <p>
            At GPT-4o pricing ($0.0000025 per token), a publisher serving 10,000 AI agent page views per day on a site averaging 45,000 HTML tokens per page spends $1,125 per day in downstream token costs. At 17&times; compression, that drops to $66 per day. The savings are $1,059 per day &mdash; $31,770 per month &mdash; and they scale linearly with traffic.
          </p>
          <p>
            The <Link href="/calculator" className="text-accent hover:underline">economics calculator</Link> on this site will compute these numbers for your specific traffic volume and compression ratio.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What the leaderboard does not measure</h2>
          <p>
            Compression is necessary but not sufficient. A compressed page that loses meaningful content is worse than a larger page that retains it. Token efficiency matters only if the resulting representation still contains the information the agent needs to complete its task.
          </p>
          <p>
            The companion research &mdash; <em>Does Format Matter?</em> (Hurley, 2026) &mdash; addresses this directly. It measures task completion accuracy across formats: raw HTML, stripped Markdown, accessibility tree, and SOM. The finding is that SOM maintains task accuracy while substantially reducing token count. But this is worth verifying for your own content type and your own agent workflows. Compression without fidelity is just data loss.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">Start with your own numbers</h2>
          <p>
            The leaderboard is a starting point, not a guarantee. Your actual compression ratio depends on your site&rsquo;s HTML structure, your JavaScript footprint, your navigation complexity, and the density of your semantic content relative to your total markup.
          </p>
          <p>
            The only way to know your number is to measure it. Use somready.com/check to see if your site already has SOM configured, or look up your domain on webtaskbench.com to see if it appears in the benchmark dataset. If it does not, the reference implementation at the <Link href="/spec" className="text-accent hover:underline">specification page</Link> includes tooling to generate SOM for any URL and measure the resulting compression.
          </p>
        </div>

        {/* See also */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="font-display text-lg text-text mb-4">See also</h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://webtaskbench.com" target="_blank" rel="noopener noreferrer" className="font-serif text-sm text-accent hover:underline">WebTaskBench</a>
            <span className="text-muted/30">&middot;</span>
            <Link href="/calculator" className="font-serif text-sm text-accent hover:underline">Economics Calculator</Link>
            <span className="text-muted/30">&middot;</span>
            <a href="https://somready.com" target="_blank" rel="noopener noreferrer" className="font-serif text-sm text-accent hover:underline">somready.com</a>
          </div>
        </div>
      </div>
    </article>
  )
}
