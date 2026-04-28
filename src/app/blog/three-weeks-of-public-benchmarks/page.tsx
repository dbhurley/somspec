import Link from 'next/link'
import BlogArticleLayout from '@/components/BlogArticleLayout'
import { posts } from '@/data/posts'

const post = posts.find((p) => p.slug === 'three-weeks-of-public-benchmarks')!

export const metadata = {
  title: `${post.title} — SOMspec`,
  description: post.description,
  alternates: { canonical: `https://somspec.org/blog/${post.slug}` },
  openGraph: {
    type: 'article',
    title: post.title,
    description: post.description,
    url: `https://somspec.org/blog/${post.slug}`,
    publishedTime: post.date,
    authors: ['SOMspec'],
    tags: post.tags,
  },
}

export default function ThreeWeeksOfPublicBenchmarks() {
  return (
    <BlogArticleLayout post={post}>
      <p>
        On April 4, 2026, the WebTaskBench observatory began publishing weekly,
        machine-readable token-efficiency measurements for AI agent web fetching against a
        curated battery of production sites. Three weeks later, two Plasmate releases later,
        and thirty-eight successful site fetches later, the public dataset is large enough to
        say something defensible about a question publishers and agent authors have been asking
        each other since 2024: <em>how much of the web&rsquo;s token cost is actually
        load-bearing?</em>
      </p>

      <p>
        The short answer is: <strong>not much</strong>. The average production page in the
        current run carries roughly thirty times the tokens it would need if represented in a
        format designed for AI agents. The peak ratio is over one hundred. The median is closer
        to ten. And the long tail — the small set of pages where structured representation is
        actually <em>worse</em> than raw HTML — turns out to be more interesting than the
        headline number.
      </p>

      <p>
        This piece walks through the public dataset as it stands on April 28, 2026. All numbers
        are reproducible from{' '}
        <a href="https://webtaskbench.com/api/v1/benchmark.json" target="_blank" rel="noopener noreferrer">
          webtaskbench.com/api/v1/benchmark.json
        </a>
        {' '}or by following the methodology at <a href="https://webtaskbench.com/protocol" target="_blank" rel="noopener noreferrer">/protocol</a>.
      </p>

      <h2>The setup, briefly</h2>

      <p>
        For each URL in the registry, the harness captures two values weekly:
      </p>

      <ol>
        <li>
          <strong>html_tokens</strong> — tokens in the raw HTML response from{' '}
          <code>curl -sL</code>, with a thirty-second timeout, tokenised using
          <code> tiktoken </code> with the <code> cl100k_base </code> encoding.
        </li>
        <li>
          <strong>som_tokens</strong> — tokens in the SOM/1.0 document produced by the current
          Plasmate release for the same URL, tokenised identically.
        </li>
      </ol>

      <p>
        The compression ratio is <code>html_tokens / som_tokens</code>. A ratio above 1.0
        means SOM is more compact than the raw HTML. The HTML baseline is intentionally
        conservative: <code>curl -sL</code> does not execute JavaScript, so it under-counts
        the tokens a real headless browser would see on JS-heavy pages. Real-world ratios in
        production are likely higher than what this benchmark reports.
      </p>

      <h2>The headline numbers</h2>

      <p>
        As of the most recent run (Plasmate v0.5.1, dated 2026-04-20):
      </p>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sites attempted</td>
            <td>38</td>
          </tr>
          <tr>
            <td>Sites succeeded</td>
            <td>38 (100%)</td>
          </tr>
          <tr>
            <td>Average compression ratio</td>
            <td>29.6×</td>
          </tr>
          <tr>
            <td>Median compression ratio</td>
            <td>9.8×</td>
          </tr>
          <tr>
            <td>Peak compression ratio</td>
            <td>118.5× (cloud.google.com)</td>
          </tr>
          <tr>
            <td>Sites where SOM is larger than HTML</td>
            <td>7 (ratio &lt; 1.0)</td>
          </tr>
        </tbody>
      </table>

      <p>
        The gap between the average (29.6×) and the median (9.8×) is itself the story. The
        distribution is heavily right-skewed: a small number of large, scaffolding-heavy pages
        are responsible for most of the aggregate token cost, and they are also the pages
        where a structured representation pays off most dramatically. The median page does well
        — call it order-of-magnitude. The 90th-percentile page does spectacularly.
      </p>

      <h2>Where the compression actually lives</h2>

      <p>
        Sorted by compression ratio, the top of the leaderboard is dominated by enterprise
        marketing pages and reference documentation:
      </p>

      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>HTML tokens</th>
            <th>SOM tokens</th>
            <th>Ratio</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>cloud.google.com</td>
            <td>762,516</td>
            <td>6,435</td>
            <td>118.5×</td>
            <td>SaaS &amp; Cloud</td>
          </tr>
          <tr>
            <td>arstechnica.com</td>
            <td>139,906</td>
            <td>1,294</td>
            <td>108.1×</td>
            <td>News &amp; Media</td>
          </tr>
          <tr>
            <td>kubernetes.io/docs</td>
            <td>123,418</td>
            <td>1,210</td>
            <td>102.0×</td>
            <td>Dev Tools</td>
          </tr>
          <tr>
            <td>techcrunch.com</td>
            <td>139,498</td>
            <td>1,398</td>
            <td>99.8×</td>
            <td>News &amp; Media</td>
          </tr>
          <tr>
            <td>nytimes.com</td>
            <td>375,828</td>
            <td>4,294</td>
            <td>87.5×</td>
            <td>News &amp; Media</td>
          </tr>
          <tr>
            <td>linear.app</td>
            <td>893,116</td>
            <td>11,046</td>
            <td>80.9×</td>
            <td>SaaS &amp; Cloud</td>
          </tr>
          <tr>
            <td>docker.com</td>
            <td>139,097</td>
            <td>2,596</td>
            <td>53.6×</td>
            <td>SaaS &amp; Cloud</td>
          </tr>
        </tbody>
      </table>

      <p>
        The pattern is consistent. Pages that ship hundreds of kilobytes of JSON state, build-tool
        runtime hydration, ad-tech beacons, analytics initialisers, design-system tokens, and
        nested layout containers are pages where the human-relevant content (the headline, the
        body, the actionable controls) is one or two percent of the byte budget. The other
        ninety-eight percent is scaffolding for browsers, telemetry, and the publisher&rsquo;s
        own authoring pipeline. None of it is information an AI agent needs.
      </p>

      <p>
        cloud.google.com at 118× is not an outlier in kind. It is an outlier in degree. A
        marketing page at <code>cloud.google.com/products/databases</code> has to load the
        Google design system, the ads SDK, the consent management script, the localisation
        runtime, the visitor analytics, four flavours of A/B testing harness, and the rest. The
        actual page content — twelve sentences of marketing copy and a feature grid — fits in
        about three thousand tokens of SOM.
      </p>

      <h2>Per-vertical: news, SaaS, dev docs, and the long tail</h2>

      <p>
        Aggregating by category gives a cleaner picture of where structured representation
        delivers the most value:
      </p>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>n</th>
            <th>Average ratio</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>News &amp; Media</td>
            <td>~8</td>
            <td>~41×</td>
            <td>Anti-bot walls were the binding constraint until v0.5.0</td>
          </tr>
          <tr>
            <td>SaaS &amp; Cloud</td>
            <td>~12</td>
            <td>~47×</td>
            <td>Highest-bloat category; design-system overhead dominates</td>
          </tr>
          <tr>
            <td>Dev Tools / Documentation</td>
            <td>~18</td>
            <td>~12×</td>
            <td>Already structured for human reading; less to compress</td>
          </tr>
          <tr>
            <td>General</td>
            <td>~6</td>
            <td>~4×</td>
            <td>Mostly small pages; SOM overhead can dominate</td>
          </tr>
        </tbody>
      </table>

      <p>
        SaaS &amp; Cloud and News &amp; Media are the two verticals where the payoff is the
        largest. For both, the agent-native economic argument is unambiguous: a publisher
        serving SOM cuts agent token cost by an order of magnitude or more, which translates
        directly into more agent visits, deeper agent reasoning, and lower agent-side cost per
        successful session. Developer documentation sits in the middle of the distribution.
        Documentation sites have already done much of the work of structuring information for
        human readers, and the marginal compression of SOM over a well-formed Markdown rendering
        of a docs page is real but smaller.
      </p>

      <h2>The long tail: where SOM is bigger than HTML</h2>

      <p>
        Seven of the thirty-eight current sites have a compression ratio below 1.0 — meaning
        the SOM document is <em>larger</em> than the raw HTML. This is the most diagnostically
        useful part of the dataset, because the explanation is structural rather than
        accidental. Examples:
      </p>

      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>HTML tokens</th>
            <th>SOM tokens</th>
            <th>Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>example.com</td>
            <td>152</td>
            <td>331</td>
            <td>0.5×</td>
          </tr>
          <tr>
            <td>crates.io</td>
            <td>71</td>
            <td>372</td>
            <td>0.2×</td>
          </tr>
          <tr>
            <td>news.ycombinator.com</td>
            <td>11,924</td>
            <td>14,573</td>
            <td>0.8×</td>
          </tr>
          <tr>
            <td>jsonplaceholder.typicode.com</td>
            <td>2,476</td>
            <td>3,282</td>
            <td>0.8×</td>
          </tr>
          <tr>
            <td>postgresql.org</td>
            <td>6,322</td>
            <td>9,321</td>
            <td>0.7×</td>
          </tr>
        </tbody>
      </table>

      <p>
        Two distinct cases are visible. The first — <code>example.com</code> and{' '}
        <code>crates.io</code> at the bottom — are pages whose entire HTML is so small (under
        200 tokens) that the structural overhead of SOM (region headers, element role
        annotations, stable IDs) exceeds the content itself. SOM has a non-zero floor; on
        sub-kilobyte pages, the floor is the dominant cost.
      </p>

      <p>
        The second case — <code>news.ycombinator.com</code>, <code>postgresql.org</code> — is
        more useful. These are pages whose HTML is already aggressively minimal: no
        design-system runtime, minimal styling, content-first markup. Hacker News is famously
        a single nested table with inline styles. PostgreSQL.org has thirty years of editorial
        discipline. SOM&rsquo;s value is the <em>delta from typical</em>; on these pages, the
        delta is negative because the typical bloat isn&rsquo;t there in the first place.
      </p>

      <p>
        The lesson for publishers: SOM is not a universal good. It is a structural improvement
        over the kind of HTML that ships in 2026. Pages that already practice a 1996 discipline
        of minimal markup get little benefit. Most pages do not.
      </p>

      <h2>What changed between v0.5.0 and v0.5.1</h2>

      <p>
        The v0.5.0 release on April 4 made one decisive change: it broke through anti-bot
        infrastructure that had been blocking benchmark fetches on major news sites. The
        cleanest example is TechCrunch, which had been on the &ldquo;failed sites&rdquo; list
        for the entire pre-launch period and which now sits at 77× to 100× depending on the run.
        Five other news domains followed the same trajectory in the same release.
      </p>

      <p>
        v0.5.1 on April 20 was a stability release — improved retry behaviour, tighter
        per-URL timeouts, better handling of large multi-region SaaS pages. The aggregate
        numbers shifted by less than a point (29.7× &rarr; 29.6× average) but the sites at the
        long tail tightened their ratios, suggesting more reliable extraction on the
        marginal cases.
      </p>

      <p>
        Two trajectories are now visible across the three weeks of data: <strong>the previously
        unreachable becomes reachable</strong>, and <strong>the unstable becomes stable</strong>.
        The first is what unlocks new categories; the second is what makes the benchmark
        defensible quarter-over-quarter.
      </p>

      <h2>What this means for publishers</h2>

      <p>
        Three implications follow from the dataset, in increasing order of how often
        publishers seem to miss them:
      </p>

      <p>
        <strong>The first</strong>: if your site is in the SaaS &amp; Cloud or News &amp; Media
        categories, you are paying somewhere between 30× and 100× more agent tokens than you
        need to. Every AI agent fetch is an inefficient one, and there are now substantially more
        AI agent fetches than there are humans on most marketing pages. A SOM endpoint is the
        single highest-leverage performance optimisation available to a publisher in 2026, and
        it is one that no human visitor will ever see.
      </p>

      <p>
        <strong>The second</strong>: if your compression ratio is below ten, the right move is
        not to skip SOM. The right move is to ship SOM and use it as a forcing function for
        editorial discipline. Pages where SOM is barely better than HTML are pages where the
        underlying HTML is bloated; the ratio is a rough proxy for <em>how much of your page
        is content versus apparatus</em>. A useful number, even if it&rsquo;s embarrassing.
      </p>

      <p>
        <strong>The third</strong>: the failed-sites list is the most uncomfortable part of the
        public benchmark and the most important. Seven sites are currently invisible to AI
        agents because of anti-bot infrastructure or aggressive JavaScript-only rendering.
        Those publishers are paying full hosting and rendering cost for traffic from agents
        that cannot read the page, and they are doing so without knowing it. The long-term fix
        is not to harden the wall but to publish a SOM endpoint that returns the same content
        in a form designed for the visitor. This is a single deploy, not a project.
      </p>

      <h2>What changes the next time we update this</h2>

      <p>
        Three things are due in the next one to three benchmark runs and will materially shift
        the dataset:
      </p>

      <ul>
        <li>
          <strong>Plasmate v0.6.0</strong> is expected to add structured-data extraction (JSON-LD,
          microdata, OpenGraph) directly into the SOM <code>meta</code> block. This will not
          change ratios meaningfully but will raise the floor on what a SOM document carries.
        </li>
        <li>
          <strong>Vertical expansion.</strong> The benchmark is currently weighted toward the
          marketing-page surface of the web. Adding e-commerce category and product pages,
          long-form journalism with comments, and forum / community pages will broaden the
          distribution and likely lower the average (these categories tend to compress less
          dramatically) while exposing new failure modes.
        </li>
        <li>
          <strong>Third-party submissions under Protocol v1.0.</strong> The first non-Plasmate
          tool that publishes results under the same protocol — and the protocol is open,
          documented at <Link href="/directives">/directives</Link> and{' '}
          <a href="https://webtaskbench.com/protocol" target="_blank" rel="noopener noreferrer">webtaskbench.com/protocol</a> — will be the first chance
          to compare engines on equal footing. Until that arrives, the dataset is
          single-engine, which is a bound on how strong the conclusions can be.
        </li>
      </ul>

      <h2>Bottom line</h2>

      <p>
        Three weeks of public benchmarks across thirty-eight production sites suggest that the
        web&rsquo;s typical page is between an order of magnitude and two orders of magnitude
        more expensive for AI agents to read than it needs to be. The fix is not a new
        framework, a new browser, or a new tax on the publisher. It is a small structured
        endpoint, advertised in five lines of <code>robots.txt</code>, that returns the
        agent-relevant content of a page in agent-native form. The numbers are now public,
        reproducible, and updated weekly.
      </p>

      <p>
        For the underlying methodology, see <Link href="/blog/reading-the-leaderboard">How to
        Read the WebTaskBench Leaderboard</Link>. For the specification this benchmark
        validates against, see the <Link href="/spec">SOM/1.0 specification</Link>. To check
        whether your own site is currently SOM-ready, use{' '}
        <a href="https://somready.com" target="_blank" rel="noopener noreferrer">somready.com</a>.
        To compare a single URL live, use{' '}
        <a href="https://somordom.com" target="_blank" rel="noopener noreferrer">somordom.com</a>.
      </p>

      <p>
        The next quarterly retrospective will publish after the next major Plasmate release
        and the addition of e-commerce and community-forum verticals to the registry.
      </p>
    </BlogArticleLayout>
  )
}
