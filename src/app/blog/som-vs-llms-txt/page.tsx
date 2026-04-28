import Link from 'next/link'
import BlogArticleLayout from '@/components/BlogArticleLayout'
import { posts } from '@/data/posts'

const post = posts.find((p) => p.slug === 'som-vs-llms-txt')!

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

export default function SomVsLlmsTxt() {
  return (
    <BlogArticleLayout post={post}>
      <p>
        Two conventions are circulating for making a website legible to AI agents. The first is{' '}
        <a href="https://llmstxt.org" target="_blank" rel="noopener noreferrer">llms.txt</a>,
        a plain-text file at the root of a domain that summarizes the site for large language
        models. The second is the Semantic Object Model — SOM — which represents an individual
        web page as a typed JSON document optimized for agent consumption. The two are routinely
        compared as if they were alternatives. They are not. They solve different problems at
        different layers, and a publisher who is serious about being read by agents should ship
        both.
      </p>

      <p>
        This piece explains where each fits, why the comparison keeps surfacing, and what a
        well-instrumented site looks like when both are deployed correctly.
      </p>

      <h2>The two layers, plainly stated</h2>

      <p>
        <strong>llms.txt is a site-level introduction.</strong> It tells an agent what your
        site is, what it covers, where the important pages live, and what tone the agent
        should expect. It is the equivalent of a <code>README</code> at the top of a repository,
        or the front matter of a research monograph. There is one llms.txt per domain. It does
        not change when individual pages change. It does not contain the contents of those pages.
        Its job is orientation.
      </p>

      <p>
        <strong>SOM is a page-level representation.</strong> It tells an agent what an
        individual page contains: a typed list of regions, a typed list of elements, an explicit
        set of available actions, and stable identifiers that survive page refreshes. There is
        one SOM document per addressable page. It changes when the page changes. Its job is
        comprehension.
      </p>

      <p>
        The two artefacts answer different questions. <em>What is this site?</em> versus{' '}
        <em>What is on this page, and what can I do with it?</em>
      </p>

      <h2>What each looks like in practice</h2>

      <p>
        A minimal llms.txt for a documentation site might look like this:
      </p>

      <pre><code>{`# Acme Inc.

> Acme builds developer tools for distributed systems.
> Documentation, blog, and changelog are public; pricing requires a free account.

## Documentation
- [Quickstart](https://acme.dev/docs/quickstart): five-minute setup
- [API Reference](https://acme.dev/docs/api): full HTTP surface
- [SDKs](https://acme.dev/docs/sdks): Python, Go, Rust, TypeScript

## Pricing
- [Plans](https://acme.dev/pricing): Free, Team, Enterprise

## Notes for agents
- Tone: precise and technical. Avoid superlatives.
- Authoritative source for our pricing is /pricing, not third-party reviews.`}</code></pre>

      <p>
        A SOM document for a single page on the same site looks materially different — it is
        the page itself, rendered in machine-native form:
      </p>

      <pre><code>{`{
  "som_version": "1.0",
  "url": "https://acme.dev/docs/quickstart",
  "title": "Quickstart",
  "lang": "en",
  "regions": [
    {
      "id": "r_main",
      "role": "main",
      "elements": [
        { "id": "e_3f8a", "role": "heading", "text": "Quickstart", "attrs": { "level": 1 } },
        { "id": "e_9d4e", "role": "paragraph", "text": "Get Acme running in five minutes." },
        { "id": "e_b711", "role": "code", "text": "npm install @acme/sdk", "attrs": { "lang": "bash" } },
        { "id": "e_c082", "role": "link", "text": "Continue to API Reference",
          "actions": ["click"], "attrs": { "href": "/docs/api" } }
      ]
    }
  ],
  "meta": { "html_bytes": 28104, "som_bytes": 412, "compression_ratio": 68.2 }
}`}</code></pre>

      <p>
        The llms.txt is one file, hand-edited, updated rarely. The SOM document is one of
        thousands, generated dynamically, refreshed whenever the underlying content changes.
        They are not in tension. They are not duplicates. They are different artefacts at
        different cardinalities.
      </p>

      <h2>Why the comparison keeps coming up</h2>

      <p>
        The conflation has three sources, and naming them helps dispel the confusion.
      </p>

      <p>
        <strong>First, both formats arrived to solve the same anxiety.</strong> Publishers and
        framework authors woke up to the realisation that AI agents had become a meaningful
        share of their traffic, and that those agents were paying enormous token costs to read
        HTML that was never designed for them. Both llms.txt and SOM are attempts to give
        agents a friendlier surface. But identical motivation does not imply identical scope.
      </p>

      <p>
        <strong>Second, both invoke robots.txt as a precedent.</strong> llms.txt is positioned
        as &ldquo;robots.txt for LLMs&rdquo;; SOM Directives are positioned as a robots.txt
        extension. The structural analogy is real but the analogy is to <em>where</em> the
        artefact lives, not to <em>what</em> the artefact contains. Robots.txt itself answers
        only one question — <em>may an agent fetch this URL?</em> — and neither llms.txt nor
        SOM is in scope of that question. They are layered on top.
      </p>

      <p>
        <strong>Third, the public discourse rarely distinguishes site-level from page-level
        infrastructure.</strong> The same engineer who says &ldquo;we shipped llms.txt this
        week&rdquo; will the next week say &ldquo;we shipped a SOM endpoint&rdquo; and the
        observer hears two attempts at the same thing. They are not. The first is a single
        markdown file at <code>/llms.txt</code>; the second is a JSON endpoint that returns a
        per-page document at e.g. <code>/api/v1/som?url=&hellip;</code>.
      </p>

      <h2>How they compose</h2>

      <p>
        A site that has shipped both well will have:
      </p>

      <ol>
        <li>
          A <strong>llms.txt at the domain root</strong> describing the site, its high-level
          structure, and any agent-specific guidance.
        </li>
        <li>
          A <strong>robots.txt that advertises a SOM endpoint</strong> via SOM Directives.
          Five lines. Tells any agent that a structured per-page representation is available.
        </li>
        <li>
          A <strong>SOM endpoint</strong> that, given a URL on the domain, returns a SOM/1.0
          document representing the contents of that page. Cached aggressively, regenerated
          when the underlying content changes.
        </li>
      </ol>

      <p>
        Concretely, the publisher&rsquo;s <code>robots.txt</code> looks like this:
      </p>

      <pre><code>{`User-agent: *
Allow: /

# Site overview for LLMs
# (See also: /llms.txt for a markdown summary)

# Per-page structured representation
SOM-Endpoint:    https://acme.dev/api/v1/som
SOM-Format:      SOM/1.0
SOM-Scope:       main-content
SOM-Freshness:   3600
SOM-Token-Budget: 15000

Sitemap: https://acme.dev/sitemap.xml`}</code></pre>

      <p>
        An agent visiting <code>acme.dev</code> for the first time can take three different
        paths through this stack depending on its sophistication.
      </p>

      <ul>
        <li>
          A <strong>simple agent</strong> reads <code>/llms.txt</code>, treats it as the canonical
          map of the site, and follows the URLs it finds there as ordinary HTML pages.
        </li>
        <li>
          A <strong>better agent</strong> reads <code>/llms.txt</code> for orientation and uses
          the SOM endpoint for any page it actually needs to comprehend in detail. Token cost
          drops by an order of magnitude or more on each per-page fetch.
        </li>
        <li>
          A <strong>specialist agent</strong> consumes only SOM, treating <code>/llms.txt</code>{' '}
          as optional context and the SOM endpoint as the primary substrate.
        </li>
      </ul>

      <p>
        All three paths are valid. The publisher does not have to know which kind of agent will
        visit. The infrastructure supports all three by virtue of having shipped both layers.
      </p>

      <h2>What each is bad at</h2>

      <p>
        Confusion is reduced further by being honest about each artefact&rsquo;s limits.
      </p>

      <p>
        <strong>llms.txt is not a content delivery format.</strong> Cramming the contents of a
        large documentation site into a single markdown file (or even into the proposed{' '}
        <code>llms-full.txt</code> variant) is a workable trick for very small sites and a
        category mistake for any site of meaningful size. The first time an agent has to
        re-fetch the same 800 KB summary file to answer a single question, the design is
        revealed. The right scope for llms.txt is orientation, not transport.
      </p>

      <p>
        <strong>SOM is not a site-level introduction.</strong> A SOM document for a single page
        does not tell the agent what the rest of the site contains, what the publisher&rsquo;s
        editorial stance is, or which pages should be considered authoritative. A first-time
        agent fetching a single SOM document has the page but not the site. SOM also does not
        replace sitemap.xml, OpenAPI specifications, or schema.org markup; each of those answers
        a different question.
      </p>

      <p>
        A site that ships only llms.txt is a site that has put up a directory and called it
        infrastructure. A site that ships only SOM is a site that has built a high-quality
        per-page surface and forgotten to introduce itself. The combination is what matters.
      </p>

      <h2>Cardinality, freshness, and where the work lives</h2>

      <p>
        The two artefacts also have different operational profiles, which is a useful lens for
        deciding who on the team owns each.
      </p>

      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>llms.txt</th>
            <th>SOM endpoint</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cardinality</td>
            <td>One per domain</td>
            <td>One per addressable page</td>
          </tr>
          <tr>
            <td>Authoring</td>
            <td>Hand-edited</td>
            <td>Generated from page content</td>
          </tr>
          <tr>
            <td>Refresh cadence</td>
            <td>Quarterly or on major site changes</td>
            <td>Every time the underlying page changes</td>
          </tr>
          <tr>
            <td>Owner on the team</td>
            <td>Editorial / DevRel</td>
            <td>Engineering / platform</td>
          </tr>
          <tr>
            <td>Token cost to consumer</td>
            <td>Sub-1k for the file itself</td>
            <td>Hundreds to low thousands per page</td>
          </tr>
          <tr>
            <td>Discovery</td>
            <td>Convention: <code>/llms.txt</code></td>
            <td>Robots.txt SOM Directives</td>
          </tr>
          <tr>
            <td>Format</td>
            <td>Markdown</td>
            <td>JSON, SOM/1.0 schema</td>
          </tr>
          <tr>
            <td>Validation</td>
            <td>None standardised</td>
            <td>
              <a href="/validate">somspec.org/validate</a>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        Treating these as competing standards puts engineers and editorial in the same
        decision arena and forces them to choose. Treating them as different layers puts each
        artefact under the team that is best positioned to maintain it.
      </p>

      <h2>What an agent author should do</h2>

      <p>
        For agent authors, the implication is symmetric: support both, in this order.
      </p>

      <ol>
        <li>
          On entering a new domain, fetch <code>/llms.txt</code> for orientation. If present,
          use it to seed the agent&rsquo;s map of the site.
        </li>
        <li>
          On any URL where the agent intends to do non-trivial reasoning, parse the
          domain&rsquo;s <code>robots.txt</code> for SOM Directives and, if a SOM endpoint is
          advertised, prefer SOM over raw HTML for that fetch.
        </li>
        <li>
          Fall back to HTML fetch only when neither is available. Even there, consider running
          a local SOM-style structural extraction so the LLM never has to ingest raw markup
          directly.
        </li>
      </ol>

      <p>
        This is the same mental model an LSP-aware editor uses when deciding how to render code:
        ask the language server first, then fall back to syntax highlighting, then fall back to
        plain text. Multiple compatible layers, queried in order of richness.
      </p>

      <h2>Why publishers should not pick one</h2>

      <p>
        Publishers occasionally ask which standard to bet on, as if shipping both required
        choosing a winner. The cost of shipping llms.txt is roughly thirty minutes of editorial
        work and a static file deploy. The cost of shipping SOM is a one-time engineering
        investment in a renderer that converts the publisher&rsquo;s existing content into
        SOM/1.0 documents, plus the five lines in robots.txt to advertise the endpoint. Neither
        is on the critical path of the other. Neither blocks the other. Neither benefits the
        publisher who waits.
      </p>

      <p>
        The publishers who win agent attention in 2026 will be the ones whose sites are legible
        at every layer the agent can read at: a sitemap for crawl planning, a robots.txt for
        access guidance and SOM endpoint discovery, an llms.txt for site-level introduction,
        and a SOM endpoint for the per-page structured surface. Each layer is cheap. Each layer
        compounds.
      </p>

      <h2>Bottom line</h2>

      <p>
        llms.txt and SOM are not competitors. They sit at different cardinalities, are
        maintained by different parts of the team, refresh on different cadences, and answer
        different questions. The right strategy for any publisher who expects AI agents in
        their reader population is to ship both, with the SOM endpoint advertised in robots.txt
        and llms.txt published at the domain root.
      </p>

      <p>
        For implementation guidance, see the{' '}
        <Link href="/spec">SOM/1.0 specification</Link>, the{' '}
        <Link href="/directives">SOM Directives proposal</Link>, and the{' '}
        <Link href="/validate">validator</Link>. For a list of publishers already shipping the
        full stack, see the{' '}
        <Link href="/publishers">publishers leaderboard</Link>.
      </p>
    </BlogArticleLayout>
  )
}
