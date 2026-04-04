import Link from 'next/link'

export const metadata = {
  title: 'The Publisher\'s Third Option — SOMspec',
  description: 'Publishers face a binary: block AI agents or serve them raw HTML at full cost. The robots.txt SOM Directives proposal offers a third path.',
}

export default function ThePublishersThirdOption() {
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
            <span className="font-mono text-xs text-muted/60">5 min read</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Publishers', 'robots.txt', 'Economics'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text leading-tight">
            The Publisher&rsquo;s Third Option
          </h1>
        </header>

        {/* Body */}
        <div className="prose-som font-serif text-text/90 leading-body space-y-6 text-[16.5px]">
          <p>
            Every website owner who has thought about AI agents has eventually arrived at the same binary. Block them with robots.txt and lose whatever discovery, traffic, or relevance they might deliver. Or let them through and watch them consume your content at the full cost of raw HTML &mdash; which is to say, at a cost you bear but cannot control.
          </p>
          <p>
            Neither option is good. There is a third.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The cost nobody is calculating</h2>
          <p>
            When an AI agent reads a page on your site, it sends your HTML &mdash; all of it &mdash; to a language model. A typical news article might be 150,000 tokens of raw HTML. Of those, perhaps 3,000 are the actual article. The other 147,000 are navigation elements, ad slots, footer links, tracking scripts, stylesheet references, and the accumulated detritus of a modern web page.
          </p>
          <p>
            You do not pay for this directly. But you are subsidizing it. The AI companies running these agents are paying to process your layout. Their models are spending context window on your script tags. Their users are waiting longer for responses because the model is reading your cookie consent banner.
          </p>
          <p>
            Nobody wins. The publisher bears the server cost of serving full pages to agents that don&rsquo;t render them. The AI company bears the token cost of processing markup that carries no semantic value. The end user gets slower responses. The economics are misaligned at every layer.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">What robots.txt SOM Directives change</h2>
          <p>
            The proposal is simple. Add five lines to your existing robots.txt file that say: &ldquo;Yes, you can read my content, and here is a more efficient way to get it.&rdquo; The SOM endpoint returns only the meaningful content &mdash; typed, structured, and semantic. No scripts. No styles. No navigation chrome. Ten to one hundred times fewer tokens. Same information.
          </p>
          <p>
            This is cooperative content negotiation. The publisher controls the representation. The publisher decides what content is included and how it is structured. The agent gets what it needs in a format optimized for machine consumption. The cost drops for everyone involved.
          </p>
          <p>
            The key word is <em>cooperative</em>. This is not scraping. This is not blocking. This is the publisher saying: &ldquo;I want you to read my content. Here is the best way to do it.&rdquo; It is the same principle behind RSS, behind sitemaps, behind Open Graph tags &mdash; infrastructure that publishers deploy voluntarily because it serves their interests.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The economics</h2>
          <p>
            For a publisher serving 50,000 AI agent page views per day, the downstream token economics look like this:
          </p>
          <div className="bg-surface border border-border rounded-card p-5 my-6 font-mono text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Raw HTML</span>
              <span className="text-text">~45,000 tokens/page &rarr; 2.25B tokens/day &rarr; ~$5,625/day</span>
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between">
              <span className="text-muted">SOM</span>
              <span className="text-text">~2,650 tokens/page &rarr; 132.5M tokens/day &rarr; ~$331/day</span>
            </div>
          </div>
          <p>
            The publisher is not paying these token costs directly. But the agents consuming their content are. And agents that pay less to read your content have more reason to read it. More reason to index it. More reason to surface it in responses. The economic alignment is genuine: making your content cheaper to consume makes it more likely to be consumed.
          </p>
          <p>
            This is not a theoretical argument. It is arithmetic. The <Link href="/calculator" className="text-accent hover:underline">economics calculator</Link> on this site will compute the numbers for your traffic volume.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The five-minute implementation</h2>
          <p>
            The implementation path for most publishers is straightforward. Add a CNAME record pointing your SOM subdomain to a SOM-compatible service. Add five lines to your robots.txt declaring the endpoint, the format, and the version. Use a service like somready.com to handle the actual SOM generation and serving.
          </p>
          <p>
            That is the complete implementation. No code changes to your site. No new dependencies. No migration. Your existing pages continue to serve normally to browsers and traditional crawlers. The SOM endpoint serves structured content to agents that discover it. Check your configuration at somready.com/check.
          </p>

          <h2 className="font-display text-2xl font-light text-text mt-12 mb-4">The binary was never real</h2>
          <p>
            The binary &mdash; block or be consumed &mdash; was never the only option. It was the only option when the tooling did not exist to support anything else. Publishers have always had the ability to serve different representations to different consumers. We do it for mobile browsers. We do it for screen readers. We do it for search engine crawlers with structured data markup.
          </p>
          <p>
            Serving a structured representation to AI agents is the same principle, applied to a new class of consumer. The <Link href="/directives" className="text-accent hover:underline">robots.txt SOM Directives</Link> proposal gives publishers the mechanism. The tooling gives them the implementation path. The economics give them the reason.
          </p>
          <p>
            The third option has always been there. Now it has infrastructure.
          </p>
        </div>

        {/* See also */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="font-display text-lg text-text mb-4">See also</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/directives" className="font-serif text-sm text-accent hover:underline">Agent Directives</Link>
            <span className="text-muted/30">&middot;</span>
            <Link href="/validate" className="font-serif text-sm text-accent hover:underline">Validate</Link>
            <span className="text-muted/30">&middot;</span>
            <a href="https://somready.com" target="_blank" rel="noopener noreferrer" className="font-serif text-sm text-accent hover:underline">somready.com</a>
          </div>
        </div>
      </div>
    </article>
  )
}
