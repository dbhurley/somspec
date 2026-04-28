import Link from 'next/link'
import BlogArticleLayout from '@/components/BlogArticleLayout'
import { posts } from '@/data/posts'

const post = posts.find((p) => p.slug === 'the-webs-second-reader')!

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

export default function TheWebsSecondReader() {
  return (
    <BlogArticleLayout post={post}>
      <p>
        For the first thirty years of the web, there was one reader. The format reflected that.
        HTML was designed for a human looking at a screen. Browsers were designed to compose
        layout, type, and colour from that markup into something a human eye could parse. The
        entire stack, from CSS to font shaping to scrolling behaviour, was a slow and beautiful
        accommodation of one species&rsquo; visual cortex. None of this was an accident. None of
        it was wrong. It was simply the obvious response to the situation: there was a reader,
        the reader had eyes, and the reader needed help.
      </p>

      <p>
        That world ended quietly. By the time anyone announced it, the second reader was
        already in the room.
      </p>

      <h2>The reader who was always coming</h2>

      <p>
        Tim Berners-Lee did not call his original 1989 proposal &ldquo;the World Wide Web.&rdquo;
        He called it <em>Information Management: A Proposal</em>. The title is more honest than
        what the system became famous for. He was not designing for browsers. He was designing
        for a kind of structured information retrieval that he hoped would let CERN&rsquo;s
        physicists find each other&rsquo;s notes. Hypertext was the means; coordinated
        knowledge was the end.
      </p>

      <p>
        What followed was a familiar pattern: a useful tool, made simple enough for general
        adoption, escapes its origin and absorbs every ambition the surrounding culture has on
        offer. The web became television, mail, banking, dating, lecture hall, marketplace,
        confessional, and panopticon. None of these uses were prefigured in the proposal.
        Through it all, the underlying format remained what it had been at the start: a markup
        language for documents, layered with whatever layout, scripting, and typographic
        conventions browsers happened to converge on.
      </p>

      <p>
        Berners-Lee was uneasy with this. In <em>Weaving the Web</em>, his 1999 retrospective,
        he described what he called a two-part dream. The first part was the web as a
        collaborative medium for humans. The second part was something else:
      </p>

      <blockquote>
        <p>
          I have a dream for the Web in which computers become capable of analyzing all the
          data on the Web, the content, links, and transactions between people and computers.
          A &ldquo;Semantic Web,&rdquo; which makes this possible, has yet to emerge, but when
          it does, the day-to-day mechanisms of trade, bureaucracy, and our daily lives will
          be handled by machines talking to machines.
        </p>
      </blockquote>

      <p>
        Two years later, in May 2001, the proposal was made formal in <em>Scientific
        American</em>. Berners-Lee, with James Hendler and Ora Lassila, sketched a future in
        which the web carried not only documents intended for human reading but a layer of
        machine-readable meaning underneath. The opening was a small piece of fiction. A
        woman&rsquo;s phone rings. Her brother needs a doctor. Her agent, listening, dispatches
        a query to nearby practices, cross-references their schedules, the brother&rsquo;s
        insurance, the relevant treatment protocols, and books an appointment. The story
        ended with a reassurance that the technology to support it was, in some form, already
        being built. RDF. OWL. Ontologies. A web that machines could reason over.
      </p>

      <p>
        The framing has aged unusually well. The mechanism has not.
      </p>

      <h2>Why the Semantic Web failed at being read</h2>

      <p>
        It is now possible, twenty-five years on, to be precise about why Berners-Lee&rsquo;s
        Semantic Web did not arrive on schedule. The reason is structural, and it is worth
        stating without rancor.
      </p>

      <p>
        The Semantic Web asked humans to do the writing. Not just the writing of HTML, which
        humans were already doing, but a second, parallel writing of formal triples,
        ontologies, and class hierarchies that described the meaning of the HTML they had just
        finished producing. RDF was elegant. OWL was logically rigorous. Both were almost
        entirely orthogonal to how a person tells a marketing team to ship a landing page on
        Friday. The first reader, the human, was satisfied with the HTML. The second reader,
        the imagined inference engine, needed a layer of metadata authored on its behalf by a
        philosopher. The publisher could not afford the philosopher.
      </p>

      <p>
        The few subsets of the Semantic Web vision that did succeed were the ones that gave up
        on broad ontological commitment in exchange for narrow, immediately useful structure.
        Schema.org, established in 2011 by a coalition of search engines, became the place
        publishers actually put their structured data, because the deal was simple: tell us
        you sell things, recipes, events, articles, and we will surface you better in search.
        That is structured data, narrowly. It is not the Semantic Web that Hendler and Lassila
        imagined. The fact that it is what the Semantic Web turned into, in practice, is the
        diagnosis.
      </p>

      <p>
        The deeper problem is that for two decades there was no compelling consumer for the
        machine-readable layer beyond search engines and a small population of academic
        reasoning systems. Publishers will accept work in proportion to the demand. Without a
        reader, even the most beautiful syntax is performed for an empty room.
      </p>

      <h2>The reader arrived anyway</h2>

      <p>
        What changed between 2020 and 2024 was that the second reader, the one
        Berners-Lee predicted, arrived from a direction nobody had been watching.
      </p>

      <p>
        The Semantic Web assumed that the second reader would be a logical inference engine.
        It would consume formal triples, traverse OWL hierarchies, and produce reasoning that
        was provably sound under classical first-order semantics. What actually showed up,
        starting with GPT-3 in 2020 and accelerating through every subsequent generation, was
        a statistical reader of unprecedented scale and unsettling competence. It did not need
        ontologies. It needed text. It would accept anything you gave it, parse it gamely, and
        deliver answers that ranged from astonishing to confidently wrong.
      </p>

      <p>
        These readers, large language models, were tolerant in a way that the inference
        engines were not. RDF would silently refuse to reason over malformed input. An LLM
        would happily reason over malformed HTML, half-rendered JavaScript, and the wreckage
        of a cookie-consent modal. This tolerance was a gift and also a kind of trap. It
        meant that the second reader could finally read the existing web. It also meant that
        the existing web could be served to the second reader at full token cost, and nobody
        would notice the inefficiency for several years.
      </p>

      <p>
        We noticed eventually. The
        <Link href="/blog/three-weeks-of-public-benchmarks">first public benchmarks</Link>
        suggest that the typical production page in 2026 carries roughly thirty times the
        tokens it would need if represented in a format designed for the second reader. The
        peak ratio is over one hundred. The average AI-agent fetch of a marketing page in the
        SaaS or news verticals burns somewhere between forty and one hundred and twenty
        thousand tokens to deliver a few hundred tokens of relevant content. The second reader
        was paying the first reader&rsquo;s bill. Then it was paying the publisher&rsquo;s
        analytics tag and the design system and the layout grid and the cookie banner. The
        bill kept growing.
      </p>

      <h2>The cost of conflation</h2>

      <p>
        When a publisher serves agents the same HTML it serves humans, three costs accrue.
      </p>

      <p>
        The first is the obvious one. Tokens cost money. Every agent visit pays for content
        that no agent will ever use, and the bill scales with the cost of inference. As
        agent traffic grows toward parity with human traffic, the publisher who has not
        addressed this is paying twice for every page: once to render it for humans, once to
        let agents wade through the rendering.
      </p>

      <p>
        The second is reliability. An LLM reading a forty-thousand-token marketing page is
        burning context budget that could have gone to reasoning. The same agent given a
        five-hundred-token structured representation of the same page will produce a more
        accurate summary, more reliable navigation, and fewer hallucinated facts. The cost of
        the conflation is paid in agent quality, not just agent dollars. The publisher whose
        page makes the agent unreliable is the publisher whose page the agent will not visit
        twice.
      </p>

      <p>
        The third is invisibility. A small fraction of the web has built infrastructure
        explicitly hostile to agent reading: anti-bot walls, JavaScript-only renders, cookie
        gates, and aggressive rate limits. The publishers in this set tend to be the ones with
        the most valuable content. They are also the ones least likely to know that they have
        already been removed from the canon. An agent that cannot read your page does not file
        a complaint. It selects another source. Over time, the publishers who decline to
        serve the second reader become invisible to the readers their first audience
        increasingly relies on. This is what happens when a category quietly shifts and the
        incumbents do not turn around to see it.
      </p>

      <h2>The format that serves both readers</h2>

      <p>
        The right response is not to rebuild the web. It is to recognise that for the first
        time in the medium&rsquo;s history, every meaningful page now has two readers, and
        the format that serves both natively is the one that will compound for the next
        decade.
      </p>

      <p>
        For the human reader, HTML works. It has had thirty years to be optimised for
        rendering, accessibility, search, and the rich set of human-centred conventions that
        browsers and screen readers have negotiated. There is no reason to disturb it. The
        cost of asking a publisher to author for a second medium has already been priced into
        twenty years of failed Semantic Web efforts. The lesson of those efforts is that the
        publisher will not pay it.
      </p>

      <p>
        For the second reader, what is needed is a separate artefact, derivable from the same
        source content, addressed under the same URL space, and delivered alongside the human
        rendering rather than in place of it. A structured object representation of the page,
        flat enough to traverse without recursion, typed enough to allow safe interaction,
        small enough to fit in a context window, and stable enough across re-fetches to
        support multi-step reasoning. Crucially, it must be generated <em>from</em> the
        human-facing content, not authored alongside it. The publisher cannot afford to do the
        work twice.
      </p>

      <p>
        This is the design constraint that the Semantic Object Model was built against.
        SOM is not a replacement for HTML. It is the second-reader artefact that the first
        reader was always going to need a counterpart to, once the second reader actually
        showed up. It is generated from existing content. It is advertised in a few lines of
        <code> robots.txt</code>. It is fetched only by the readers that benefit from it. The
        first reader continues to receive the first-reader artefact, unchanged.
      </p>

      <p>
        SOM&rsquo;s technical choices follow from this framing. Element IDs are derived from
        a stable hash of the content they represent so that an agent can refer back to the
        same element across page refreshes without anchoring on positional fragility. Roles
        are typed because tolerance of malformed input was the LLM era&rsquo;s gift and also
        its hidden cost; an explicit role lets the second reader reason about a button
        without first inferring its buttonness from a thousand tokens of unrelated styling.
        Actions are declared rather than discovered because declaration is faster and
        cheaper than discovery and no part of the HTML has ever been honest about which
        elements are interactive. The format is flat because stack depth in JSON is not free
        in token count and a deeply nested structure helps neither reader.
      </p>

      <p>
        These are not exotic decisions. They are the obvious ones once the second reader
        is admitted as a first-class audience. The reason they were not made earlier is not
        because they were difficult. It is because the second reader was not yet in the room.
      </p>

      <h2>What Berners-Lee was right about</h2>

      <p>
        It is fashionable, when discussing the Semantic Web, to treat its failure as a kind of
        morality play about the limits of top-down standards or the hubris of formal
        ontologies. This reading is unfair. Berners-Lee was right about the most important
        thing. He saw, more than two decades ahead of the rest of us, that the web&rsquo;s
        format would eventually need to serve a reader other than the human. He was wrong
        about the writer, not the reader. He thought the publisher would author for the
        machine. The machine, when it finally arrived, was generous enough to read what the
        publisher had already written. That was the gift; that is also why the cost of
        conflation accumulated for so long before anyone measured it.
      </p>

      <p>
        The format that serves both readers natively is what the Semantic Web was always
        meant to be. The novelty in 2026 is that the publisher does not have to write it. A
        small number of well-designed renderers can derive it from the content the publisher
        is already producing for humans, and a few lines of <code>robots.txt</code> can tell
        the second reader where to find it. The publisher&rsquo;s contribution is one deploy.
        The reader&rsquo;s contribution is one extra fetch. The savings, on current
        measurement, are between an order of magnitude and two orders of magnitude per
        page.
      </p>

      <h2>What comes next</h2>

      <p>
        The web is in the early years of a transition that lasts at least a decade. The first
        wave is publishers becoming aware that their pages are read by agents at all. The
        second wave, already underway, is publishers becoming aware that the cost of the
        conflation between first-reader and second-reader content is borne by them, in
        analytics-distorted traffic, in agent unreliability, and in the slow shadow-loss of
        the agent-mediated audience. The third wave will be the format settling. Some standard
        will win for the second-reader artefact. It might be SOM. It might be llms-full.txt
        with a more disciplined schema. It might be something nobody has yet drafted. What is
        certain is that there will be one, because the alternative is for every site to remain
        fluent only in the first reader&rsquo;s language while the second reader continues to
        accumulate share of every consequential question the web is asked to answer.
      </p>

      <p>
        Berners-Lee&rsquo;s phrase, <em>two-part dream</em>, deserves more than the
        retrospective curiosity it usually receives. He was describing a web with two
        readers. We are now the first generation of publishers, agent authors, and standards
        people who get to build the second part. The structure he proposed is not what we
        will use. The audience he described is exactly the one that arrived.
      </p>

      <p>
        The format that serves both readers wins. The publishers who recognise that their
        site has two readers, and ship for both, are the ones who will be legible in the
        decade that follows. The ones who continue to optimise for a single reader will
        discover, somewhere around 2028, that the other reader stopped visiting and that
        nobody told them.
      </p>

      <p>
        For the technical specification of the second-reader artefact, see the{' '}
        <Link href="/spec">SOM/1.0 specification</Link>. For the publisher-side adoption
        guide, see the <Link href="/directives">SOM Directives proposal</Link>. For the
        ongoing measurement of the cost of conflation, see{' '}
        <a href="https://webtaskbench.com" target="_blank" rel="noopener noreferrer">webtaskbench.com</a>.
        For a check of whether your own site already serves the second reader, see{' '}
        <a href="https://somready.com" target="_blank" rel="noopener noreferrer">somready.com</a>.
      </p>

      <p>
        Companion pieces: the practical deployment guide is{' '}
        <Link href="/blog/som-vs-llms-txt">SOM vs llms.txt: When to Use Which</Link>; the
        adjacent question of how an agent talks to its tools is covered in{' '}
        <Link href="/blog/som-vs-mcp">SOM vs MCP: How Publishers and Agents Are Different
        Problems</Link>; the empirical evidence for the cost claim is in{' '}
        <Link href="/blog/three-weeks-of-public-benchmarks">What Three Weeks of Public
        Benchmarks Reveal About the Web&rsquo;s Token Bill</Link>.
      </p>
    </BlogArticleLayout>
  )
}
