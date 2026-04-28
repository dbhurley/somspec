import Link from 'next/link'
import BlogArticleLayout from '@/components/BlogArticleLayout'
import { posts } from '@/data/posts'

const post = posts.find((p) => p.slug === 'som-vs-mcp')!

export const metadata = {
  title: `${post.title} — SOMspec`,
  description: post.description,
  keywords: [
    'MCP', 'Model Context Protocol', 'SOM', 'Semantic Object Model',
    'AI agent', 'LLM tool use', 'agent web fetching',
    'Plasmate', 'Claude', 'Cursor',
    'MCP vs SOM', 'SOM vs MCP', 'agent infrastructure',
  ],
  alternates: { canonical: `https://somspec.org/blog/${post.slug}` },
  openGraph: {
    type: 'article',
    title: post.title,
    description: post.description,
    url: `https://somspec.org/blog/${post.slug}`,
    publishedTime: post.date,
    authors: ['SOMspec'],
    tags: post.tags,
    siteName: 'SOMspec',
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
  },
}

// FAQ schema — boosts AEO for the canonical questions readers (and LLMs) ask
// about MCP vs SOM. Lives alongside the BlogPosting schema in BlogArticleLayout.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are SOM and MCP competing standards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. They occupy different layers of the agent stack. MCP (Model Context Protocol) is a transport-and-protocol layer that connects an AI client to its tools. SOM (Semantic Object Model) is a content-format layer that describes the contents of a web page. A typical deployment uses both: an MCP server fetches a page and returns its SOM document to the connected client. They compose; they do not substitute for each other.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a publisher need to ship an MCP server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Publishers ship a SOM endpoint, advertised in robots.txt via SOM Directives. MCP servers are run by tool-builders (such as Plasmate-MCP) on behalf of agents. The publisher is the source of content; the MCP server is the bridge between the agent and that content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who maintains MCP and who maintains SOM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCP is an open standard introduced by Anthropic in November 2024 and now hosted at modelcontextprotocol.io with broad multi-vendor adoption (Claude Desktop, Cursor, Continue, Zed, and many community implementations). SOM/1.0 is an open specification hosted at somspec.org under the W3C Web Content for AI Community Group, with Plasmate as the reference implementation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does a Plasmate-MCP server do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Plasmate-MCP is an MCP server that exposes Plasmate-style web fetching as MCP tools. An agent connected to it can call a fetch tool, the server retrieves the URL (preferring a SOM endpoint where one is advertised, falling back to deriving SOM from the HTML where one is not), and the SOM document is returned to the agent through the MCP transport. The agent receives clean structured content; the publisher receives a single fetch.',
      },
    },
  ],
}

export default function SomVsMcp() {
  return (
    <BlogArticleLayout post={post}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p>
        In conversations with publishers, framework authors, and AI engineers throughout 2026,
        the most frequently confused pair of acronyms in the agent-infrastructure landscape is
        MCP and SOM. The confusion is not surprising. Both arrived at the same moment, both
        carry similar surface-level promises about making the web friendlier to AI, and both
        are open standards backed by credible institutional sponsors. The conflation is a
        category error, but it is a forgivable one. The two specifications are different in
        kind, sit at different layers of the agent stack, and are designed to compose rather
        than compete.
      </p>

      <p>
        This piece settles the disambiguation. It is the companion piece to{' '}
        <Link href="/blog/som-vs-llms-txt">SOM vs llms.txt: When to Use Which</Link>, which
        does the same work for the publisher-side site-introduction layer. Together the two
        articles cover the most common axes of confusion that publishers and agent authors
        encounter when deciding what to ship and what to consume.
      </p>

      <h2>The short answer</h2>

      <p>
        <strong>MCP (Model Context Protocol)</strong> is a protocol that an AI client uses to
        talk to its tools. It defines a transport, a request and response shape, and a way for
        servers to expose tools, resources, and prompts to a client. The client is an
        LLM-powered application such as Claude Desktop, Cursor, Continue, or Zed. The server
        is a process that exposes capabilities to that client. MCP is, in essence, the wiring
        between an agent and the rest of its tool surface.
      </p>

      <p>
        <strong>SOM (Semantic Object Model)</strong> is a content format that a publisher uses
        to describe a web page in agent-native form. It defines the structure of a JSON
        document that represents the content, regions, elements, and available actions of an
        addressable page. SOM is, in essence, a wire format for the second reader of the web
        — see <Link href="/blog/the-webs-second-reader">The Web&rsquo;s Second Reader</Link>.
      </p>

      <p>
        These are different layers. MCP carries payloads. SOM is one of the payloads MCP can
        carry. A well-built agent stack uses both, and treating them as alternatives is the
        kind of mistake that suggests the team has not yet drawn the boundaries cleanly in
        their own architecture.
      </p>

      <h2>What MCP actually is</h2>

      <p>
        Anthropic introduced the Model Context Protocol on November 25, 2024, with a stated
        goal of making it easier to connect AI applications to data and tools. The
        specification has since accumulated multi-vendor adoption: every major AI-native
        client now speaks MCP, and the directory of open-source MCP servers numbers in the
        hundreds. It is the closest thing the agent ecosystem has to a settled cross-vendor
        standard for client-tool wiring.
      </p>

      <p>
        Concretely, the architecture has three roles:
      </p>

      <ol>
        <li>
          A <strong>host application</strong>, which is the user-facing AI product (Claude
          Desktop, Cursor, Continue, the Plasmate Notebook, an internal enterprise app).
        </li>
        <li>
          One or more <strong>MCP clients</strong> embedded in the host, each of which holds a
          one-to-one connection to an MCP server.
        </li>
        <li>
          One or more <strong>MCP servers</strong>, which are independent processes (often
          local, sometimes remote) that expose tools, resources, and prompts.
        </li>
      </ol>

      <p>
        Communication between client and server is JSON-RPC 2.0, transported over either
        standard input/output (for local servers) or HTTP with Server-Sent Events (for remote
        servers). The protocol exposes a small, deliberately constrained set of primitives:
      </p>

      <ul>
        <li><strong>Tools</strong> — functions the agent can invoke (e.g. <code>fetch_url</code>, <code>send_email</code>, <code>create_issue</code>).</li>
        <li><strong>Resources</strong> — read-only data the agent can reference (a file, a database row, a piece of context).</li>
        <li><strong>Prompts</strong> — reusable templated instructions the host can offer to the user.</li>
      </ul>

      <p>
        The win of MCP is that any client can connect to any server, and any server can be
        consumed by any client, without bespoke integration. The same Plasmate-MCP server that
        a developer connects to Claude Desktop in the morning works unchanged with Cursor in
        the afternoon. The cost of writing a new tool drops from one-per-client to
        one-per-tool. This is the same shape of win that Language Server Protocol delivered
        for code editors in 2016, and the analogy is not accidental — Anthropic&rsquo;s
        original framing referenced LSP explicitly.
      </p>

      <h2>What SOM actually is</h2>

      <p>
        SOM/1.0 is a JSON document that represents an addressable web page in a form designed
        for AI agent consumption rather than human rendering. The full specification lives at{' '}
        <Link href="/spec">/spec</Link>, but the shape is:
      </p>

      <pre><code>{`{
  "som_version": "1.0",
  "url": "https://example.com/page",
  "title": "Page title",
  "lang": "en",
  "regions": [
    {
      "id": "r_main",
      "role": "main",
      "elements": [
        { "id": "e_3f8a", "role": "heading", "text": "...", "attrs": { "level": 1 } },
        { "id": "e_9d4e", "role": "paragraph", "text": "..." },
        { "id": "e_c082", "role": "link", "text": "...", "actions": ["click"], "attrs": { "href": "/next" } }
      ]
    }
  ],
  "meta": { "html_bytes": 28104, "som_bytes": 412, "compression_ratio": 68.2 }
}`}</code></pre>

      <p>
        The content is flat. Element identifiers are derived from a stable hash so that an
        agent can refer back to the same element across re-fetches. Roles are typed. Available
        actions are declared. The format compresses the typical production page by between an
        order of magnitude and two orders of magnitude versus raw HTML; see the most recent
        public measurement at{' '}
        <Link href="/blog/three-weeks-of-public-benchmarks">three weeks of public benchmarks</Link>.
      </p>

      <p>
        Crucially, SOM is a <strong>publisher-side</strong> artefact. A publisher who runs
        <code>example.com</code> can ship a SOM endpoint at, say,{' '}
        <code>example.com/api/v1/som</code> and advertise it via{' '}
        <Link href="/directives">SOM Directives</Link> in <code>robots.txt</code>. Any agent
        with the discipline to read those directives can then fetch SOM in place of HTML and
        save the order-of-magnitude token cost.
      </p>

      <h2>The most common conflation, and why it persists</h2>

      <p>
        The conflation that drives the question &ldquo;should I use MCP or SOM?&rdquo; usually
        comes from one of three reasonable misreadings.
      </p>

      <p>
        <strong>The first misreading</strong> treats MCP as if its scope included the format
        of the data it transports. It does not. MCP is intentionally agnostic about payload
        content — it transports whatever JSON the tool returns. Whether that JSON is a SOM
        document, a Markdown blob, a raw HTML string, a database query result, or a custom
        domain-specific schema is up to the server. MCP is a wire protocol; SOM is one of the
        wire formats it can carry.
      </p>

      <p>
        <strong>The second misreading</strong> treats SOM as if it were a publisher-facing
        version of MCP. It is not. The publisher does not care about MCP. The publisher cares
        about being legible to agents, and the legibility surface is HTML for the human
        reader and SOM for the second reader. The MCP layer is invisible to the publisher
        entirely. It is a concern for the agent author and the tool-builder, not for the
        site operator.
      </p>

      <p>
        <strong>The third misreading</strong> treats them as competing claims for the same
        market position. They are not. There is no overlap in their addressable users. MCP is
        adopted by client teams (whoever ships Claude Desktop, Cursor, an enterprise
        chat-with-your-data product) and by tool-builders (whoever writes the GitHub MCP
        server, the Plasmate-MCP server, the Linear MCP server). SOM is adopted by content
        publishers (whoever runs nytimes.com, stripe.com, kubernetes.io). The two camps share
        agents as a downstream beneficiary but do not share a customer.
      </p>

      <h2>How they compose: a worked example</h2>

      <p>
        The cleanest way to see the relationship is to watch a single agent task all the way
        from user input to final result, paying attention to which layer is active at each
        step.
      </p>

      <p>
        Suppose a user asks Claude Desktop, <em>&ldquo;Summarise the latest pricing changes on
        stripe.com.&rdquo;</em> The flow is:
      </p>

      <ol>
        <li>
          <strong>Claude Desktop (MCP host)</strong> receives the request. It has previously
          been configured with a Plasmate-MCP server providing a <code>fetch_url</code> tool.
        </li>
        <li>
          <strong>The MCP client</strong> embedded in Claude Desktop calls the Plasmate-MCP
          server with <code>fetch_url(&quot;https://stripe.com/pricing&quot;)</code>. This call
          travels over JSON-RPC 2.0 across the MCP transport.
        </li>
        <li>
          <strong>Plasmate-MCP (the MCP server)</strong> receives the tool call. It first
          checks <code>stripe.com/robots.txt</code> for SOM Directives. It finds a{' '}
          <code>SOM-Endpoint</code> line. It fetches{' '}
          <code>stripe.com/api/v1/som?url=...pricing</code>. The response is a SOM document.
        </li>
        <li>
          <strong>The MCP server</strong> returns the SOM document to the MCP client as the
          result of the tool call. The MCP transport carries the JSON unchanged.
        </li>
        <li>
          <strong>Claude Desktop</strong> presents the structured content to the model as
          tool output. The model, given a few hundred tokens of structured JSON instead of
          forty thousand tokens of marketing-page HTML, produces a clean summary.
        </li>
      </ol>

      <p>
        Notice the layering. MCP carried the request and the response. SOM was the format of
        the response. Stripe (the publisher) did not know any agent visited; it served an HTTP
        request the same way it serves any other. Claude Desktop (the host) did not know the
        tool call would resolve via SOM; it received structured JSON and reasoned over it. The
        Plasmate-MCP server in the middle knew about both protocols and did the work of
        translating between them.
      </p>

      <p>
        This is what good infrastructure looks like. Every layer is replaceable. Cursor could
        substitute for Claude Desktop tomorrow. A different MCP server could substitute for
        Plasmate-MCP next quarter. Stripe could change its SOM endpoint implementation
        without anyone noticing. The composability of MCP and SOM is the point.
      </p>

      <h2>Where the responsibility for each lives</h2>

      <p>
        The cleanest way for a team to internalise the difference is to ask, for each of the
        two specifications, <em>who on our team owns this?</em>
      </p>

      <table>
        <thead>
          <tr>
            <th>Concern</th>
            <th>MCP</th>
            <th>SOM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Layer</td>
            <td>Transport / protocol</td>
            <td>Content / format</td>
          </tr>
          <tr>
            <td>Cardinality</td>
            <td>One per client-server pair</td>
            <td>One per addressable page</td>
          </tr>
          <tr>
            <td>Who ships it</td>
            <td>Client teams + tool-builders</td>
            <td>Publishers</td>
          </tr>
          <tr>
            <td>Discovery</td>
            <td>Client configuration (server registry)</td>
            <td>robots.txt SOM Directives</td>
          </tr>
          <tr>
            <td>Wire format</td>
            <td>JSON-RPC 2.0 over stdio or SSE</td>
            <td>JSON document, SOM/1.0 schema</td>
          </tr>
          <tr>
            <td>Reference impl</td>
            <td>
              <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">modelcontextprotocol.io</a>
            </td>
            <td>
              <a href="https://plasmate.app" target="_blank" rel="noopener noreferrer">plasmate.app</a>
            </td>
          </tr>
          <tr>
            <td>Maintainer</td>
            <td>Anthropic + multi-vendor community</td>
            <td>SOMspec community + W3C CG</td>
          </tr>
          <tr>
            <td>Validation</td>
            <td>Inspector / SDK conformance</td>
            <td>
              <Link href="/validate">somspec.org/validate</Link>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        Inside an organisation, MCP is owned by the platform or AI engineering team that ships
        the agent. SOM is owned by the publishing or web team that ships the site. In a
        company that does both — say, a SaaS vendor with a developer-facing product and a
        marketing site — the two efforts run in parallel and do not block each other.
      </p>

      <h2>What to do as an agent author</h2>

      <p>
        If you are building an agent product (whether the host or a tool-server inside the
        host), the practical checklist is short.
      </p>

      <ol>
        <li>
          <strong>Adopt MCP for your client-tool wiring.</strong> The compatibility win across
          the ecosystem is large and the cost of inventing a private protocol is permanent. Any
          server you build today should expose tools via MCP; any host you ship should consume
          MCP. Reference: <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">modelcontextprotocol.io</a>.
        </li>
        <li>
          <strong>Have your fetch tool prefer SOM where it is advertised.</strong> When your
          tool fetches a URL, check <code>robots.txt</code> first; if a SOM endpoint is listed,
          fetch that instead of the HTML. The token savings are substantial and the publisher
          has already opted in.
        </li>
        <li>
          <strong>Where SOM is not advertised, derive it locally.</strong> The Plasmate engine
          and similar libraries can produce a SOM document from raw HTML on the fly. The
          publisher does not benefit, but the model in your client does.
        </li>
        <li>
          <strong>Return the SOM document as the tool result.</strong> Let the model reason
          over typed structured content rather than raw markup. The reliability and accuracy
          gains are immediate.
        </li>
      </ol>

      <h2>What to do as a publisher</h2>

      <p>
        If you are a publisher, MCP is not your concern. SOM is. The full guide lives at{' '}
        <Link href="/directives">/directives</Link>, but the short version:
      </p>

      <ol>
        <li>Generate a SOM document for each page you serve. Most publishers can do this from their existing CMS or rendering pipeline with a single library call.</li>
        <li>Expose a SOM endpoint at a stable URL (typically <code>/api/v1/som?url=...</code>).</li>
        <li>Advertise the endpoint in <code>robots.txt</code> with five lines of SOM Directives.</li>
        <li>Verify with <a href="https://somready.com" target="_blank" rel="noopener noreferrer">somready.com</a>.</li>
      </ol>

      <p>
        That is the entire publisher-side surface. You do not need to know what MCP is. Your
        site has just become legible to the second reader through whatever MCP server an
        agent author chooses to deploy.
      </p>

      <h2>The deeper symmetry</h2>

      <p>
        It is worth ending with a structural observation. MCP and SOM are not just
        non-competing; they are filling complementary gaps that the previous generation of
        infrastructure left open.
      </p>

      <p>
        For two decades, two questions have lacked clean cross-vendor answers in agent-shaped
        systems. The first is, <em>how does an agent talk to its tools?</em> Every framework
        before MCP solved this with a bespoke convention, and every change of framework forced
        a rewrite. MCP closed that question. The second question is, <em>how does the web
        deliver content to an agent?</em> The previous answer was &ldquo;just send the HTML
        and let the model figure it out,&rdquo; which worked for a while at considerable
        cost. SOM is closing that question.
      </p>

      <p>
        The two specifications cover the two open boundaries of the agent stack: client to
        tool, and tool to content. A team that adopts both is, for the first time in the brief
        history of agent infrastructure, working with cross-vendor settled standards on both
        sides of its tool layer. That has not been true at any previous moment, and it is the
        practical reason 2026 feels different from 2024 if you are building agent-native
        products.
      </p>

      <p>
        For further reading: the <Link href="/spec">SOM/1.0 specification</Link>, the{' '}
        <Link href="/directives">SOM Directives proposal</Link>, the{' '}
        <Link href="/reference">reference implementations</Link>, and the canonical{' '}
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">MCP specification</a>.
        For the companion comparison piece, see{' '}
        <Link href="/blog/som-vs-llms-txt">SOM vs llms.txt: When to Use Which</Link>.
      </p>
    </BlogArticleLayout>
  )
}
