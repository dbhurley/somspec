import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Agent Directives Specification',
  description: 'A proposed standard for how web publishers express preferences for AI agent interaction. Covers rate limits, preferred formats, attribution, and content policies.',
  alternates: { canonical: '/directives' },
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-20 scroll-mt-24 relative">
      <div className="flex gap-6 items-start mb-6">
        <span className="font-display text-6xl font-light text-accent/[0.08] leading-none select-none hidden md:block shrink-0 -ml-2 pt-1">{number}</span>
        <div>
          <span className="text-xs font-mono text-accent/40 tracking-[0.15em] block mb-2">{number}</span>
          <h2 className="text-2xl font-display font-light text-text">{title}</h2>
        </div>
      </div>
      <div className="md:pl-[4.5rem] space-y-4 text-muted font-serif leading-body text-[15px]">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-display font-light text-text mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ name, type, required, children }: { name: string; type: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="pl-4 border-l-2 border-accent/15 py-2">
      <div className="flex items-center gap-2 mb-1">
        <code className="text-code text-sm font-mono">{name}</code>
        <span className="text-xs text-muted/50 font-mono">({type})</span>
        {required && <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded font-mono">required</span>}
      </div>
      <p className="text-sm text-muted font-serif">{children}</p>
    </div>
  )
}

const exampleDocument = `{
  "version": "0.1",
  "publisher": "Example Corp",
  "contact": "agents@example.com",
  "default_policy": "allow",
  "som": {
    "available": true,
    "endpoint": "/.well-known/som.json",
    "freshness": "1h"
  },
  "rate_limits": {
    "requests_per_minute": 60,
    "concurrent_sessions": 5,
    "burst_limit": 10
  },
  "content_policies": [
    {
      "path": "/api/*",
      "policy": "deny",
      "reason": "API endpoints are not content pages"
    },
    {
      "path": "/docs/*",
      "policy": "allow",
      "preferred_format": "som",
      "cache_ttl": "6h"
    },
    {
      "path": "/pricing",
      "policy": "allow",
      "preferred_format": "som",
      "cache_ttl": "15m",
      "note": "Pricing changes frequently"
    }
  ],
  "attribution": {
    "required": true,
    "format": "Source: {publisher} ({url})"
  },
  "monetization": {
    "model": "free",
    "paywall_paths": ["/premium/*"],
    "ad_supported": true,
    "note": "Please preserve attribution links"
  }
}`

export default function DirectivesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Proposal</span>
      <h1 className="font-display text-3xl md:text-4xl font-light text-text mb-3">Agent Directives</h1>
      <p className="text-muted font-serif leading-body max-w-2xl mb-4">
        A proposal for how web publishers express preferences for AI agent interaction.
      </p>
      <span className="inline-block text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded font-mono mb-16">
        Draft — v0.1
      </span>

      {/* Section 1: Introduction */}
      <Section id="introduction" number="01" title="Introduction">
        <p>
          Agent Directives is a machine-readable format that allows web publishers to declare preferences for how AI agents
          interact with their content. It complements <code className="text-code text-sm font-mono">robots.txt</code> (which
          controls crawl access) by expressing <em>how</em> content should be consumed once access is granted.
        </p>
        <p>
          The format is served at <code className="text-code text-sm font-mono">/.well-known/agent-directives.json</code>.
        </p>
        <p>
          For the structured page representation that Agent Directives can reference, see the{' '}
          <Link href="/spec" className="text-accent hover:underline">SOM specification</Link>. To test SOM documents
          against the spec, use the <Link href="/validate" className="text-accent hover:underline">validator</Link>.
        </p>
      </Section>

      {/* Section 2: Discovery */}
      <Section id="discovery" number="02" title="Discovery">
        <p>Agents discover directives through three mechanisms, in order of precedence:</p>
        <SubSection title="Discovery Methods">
          <div className="space-y-4">
            <div className="pl-4 border-l-2 border-accent/15 py-2">
              <p className="text-sm font-serif"><strong className="text-text">1. HTTP Link header</strong></p>
              <code className="text-code text-sm font-mono block mt-1">
                {'Link: </.well-known/agent-directives.json>; rel="agent-directives"'}
              </code>
            </div>
            <div className="pl-4 border-l-2 border-accent/15 py-2">
              <p className="text-sm font-serif"><strong className="text-text">2. HTML link element</strong></p>
              <code className="text-code text-sm font-mono block mt-1">
                {'<link rel="agent-directives" href="/.well-known/agent-directives.json">'}
              </code>
            </div>
            <div className="pl-4 border-l-2 border-accent/15 py-2">
              <p className="text-sm font-serif"><strong className="text-text">3. Well-known URI</strong></p>
              <code className="text-code text-sm font-mono block mt-1">
                GET /.well-known/agent-directives.json
              </code>
            </div>
          </div>
        </SubSection>
        <p className="mt-4">
          <strong className="text-text">Precedence:</strong> HTTP header &gt; HTML element &gt; well-known fallback.
        </p>
      </Section>

      {/* Section 3: Document Format */}
      <Section id="format" number="03" title="Document Format">
        <p>A complete Agent Directives document:</p>
        <pre className="bg-surface border border-border rounded-card p-4 overflow-x-auto text-sm font-mono text-text leading-relaxed mt-4">
          {exampleDocument}
        </pre>
      </Section>

      {/* Section 4: Field Reference */}
      <Section id="fields" number="04" title="Field Reference">
        <SubSection title="Top-level Fields">
          <Field name="version" type="string" required>Specification version. Currently &quot;0.1&quot;.</Field>
          <Field name="publisher" type="string">Human-readable publisher name.</Field>
          <Field name="contact" type="string">Email for agent-related issues.</Field>
          <Field name="default_policy" type="string">
            Default behavior for unlisted paths. One of: <code className="text-code text-sm font-mono">&quot;allow&quot;</code>,{' '}
            <code className="text-code text-sm font-mono">&quot;deny&quot;</code>, or{' '}
            <code className="text-code text-sm font-mono">&quot;som-only&quot;</code>.
          </Field>
        </SubSection>

        <SubSection title="som">
          <p className="text-sm text-muted font-serif mb-3">SOM availability declaration.</p>
          <Field name="available" type="boolean">Whether SOM representations are served.</Field>
          <Field name="endpoint" type="string">Path to publisher-served SOM.</Field>
          <Field name="freshness" type="string">Suggested cache duration (e.g., &quot;15m&quot;, &quot;1h&quot;, &quot;6h&quot;, &quot;24h&quot;).</Field>
        </SubSection>

        <SubSection title="rate_limits">
          <p className="text-sm text-muted font-serif mb-3">Agent rate limiting preferences.</p>
          <Field name="requests_per_minute" type="integer">Maximum requests per minute.</Field>
          <Field name="concurrent_sessions" type="integer">Maximum concurrent sessions.</Field>
          <Field name="burst_limit" type="integer">Maximum burst request count.</Field>
        </SubSection>

        <SubSection title="content_policies">
          <p className="text-sm text-muted font-serif mb-3">Per-path policy overrides. Array of objects with:</p>
          <Field name="path" type="string" required>Glob pattern matching URL paths.</Field>
          <Field name="policy" type="string" required>
            One of: <code className="text-code text-sm font-mono">&quot;allow&quot;</code>,{' '}
            <code className="text-code text-sm font-mono">&quot;deny&quot;</code>, or{' '}
            <code className="text-code text-sm font-mono">&quot;som-only&quot;</code>.
          </Field>
          <Field name="preferred_format" type="string">
            One of: <code className="text-code text-sm font-mono">&quot;som&quot;</code>,{' '}
            <code className="text-code text-sm font-mono">&quot;html&quot;</code>, or{' '}
            <code className="text-code text-sm font-mono">&quot;markdown&quot;</code>.
          </Field>
          <Field name="cache_ttl" type="string">Suggested cache duration for this path.</Field>
          <Field name="reason" type="string">Human-readable explanation for the policy.</Field>
          <Field name="note" type="string">Guidance for agent developers.</Field>
        </SubSection>

        <SubSection title="attribution">
          <p className="text-sm text-muted font-serif mb-3">Attribution requirements.</p>
          <Field name="required" type="boolean">Whether attribution is required.</Field>
          <Field name="format" type="string">
            Template string with variables: <code className="text-code text-sm font-mono">{'{publisher}'}</code>,{' '}
            <code className="text-code text-sm font-mono">{'{url}'}</code>,{' '}
            <code className="text-code text-sm font-mono">{'{title}'}</code>.
          </Field>
        </SubSection>

        <SubSection title="monetization">
          <p className="text-sm text-muted font-serif mb-3">Content monetization context.</p>
          <Field name="model" type="string">
            One of: <code className="text-code text-sm font-mono">&quot;free&quot;</code>,{' '}
            <code className="text-code text-sm font-mono">&quot;freemium&quot;</code>,{' '}
            <code className="text-code text-sm font-mono">&quot;subscription&quot;</code>, or{' '}
            <code className="text-code text-sm font-mono">&quot;ad-supported&quot;</code>.
          </Field>
          <Field name="paywall_paths" type="string[]">Glob patterns for paywalled content.</Field>
          <Field name="ad_supported" type="boolean">Whether content is ad-supported.</Field>
          <Field name="note" type="string">Guidance for agent developers regarding monetization.</Field>
        </SubSection>
      </Section>

      {/* Section 5: Relationship to robots.txt */}
      <Section id="robots-txt" number="05" title="Relationship to robots.txt">
        <p>
          Agent Directives does <strong className="text-text">not</strong> replace{' '}
          <code className="text-code text-sm font-mono">robots.txt</code>. Their purposes are distinct:
        </p>
        <div className="mt-4 space-y-3">
          <div className="pl-4 border-l-2 border-accent/15 py-2">
            <p className="text-sm font-serif">
              <strong className="text-text">robots.txt:</strong> &ldquo;Can this agent access this URL?&rdquo; (access control)
            </p>
          </div>
          <div className="pl-4 border-l-2 border-accent/15 py-2">
            <p className="text-sm font-serif">
              <strong className="text-text">Agent Directives:</strong> &ldquo;How should this agent consume this content?&rdquo; (interaction preferences)
            </p>
          </div>
        </div>
        <p className="mt-4">
          An agent should check <code className="text-code text-sm font-mono">robots.txt</code> first. If access is denied,
          Agent Directives is irrelevant. If access is allowed, Agent Directives provides guidance on <em>how</em> to
          interact — preferred formats, rate limits, attribution requirements.
        </p>
      </Section>

      {/* Section 6: Compliance Levels */}
      <Section id="compliance" number="06" title="Compliance Levels">
        <div className="space-y-4">
          <div className="pl-4 border-l-2 border-accent/15 py-3">
            <p className="text-sm font-serif">
              <strong className="text-text">Level 0 — Aware:</strong> Agent checks for{' '}
              <code className="text-code text-sm font-mono">agent-directives.json</code> but does not modify behavior.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-accent/15 py-3">
            <p className="text-sm font-serif">
              <strong className="text-text">Level 1 — Respectful:</strong> Agent honors{' '}
              <code className="text-code text-sm font-mono">rate_limits</code> and{' '}
              <code className="text-code text-sm font-mono">content_policies</code>.
            </p>
          </div>
          <div className="pl-4 border-l-2 border-accent/15 py-3">
            <p className="text-sm font-serif">
              <strong className="text-text">Level 2 — Full:</strong> Agent honors all fields including{' '}
              <code className="text-code text-sm font-mono">attribution</code> and{' '}
              <code className="text-code text-sm font-mono">monetization</code> preferences.
            </p>
          </div>
        </div>
        <p className="mt-6 p-4 bg-surface border border-border rounded-card text-sm">
          <strong className="text-text">Note:</strong> Compliance is voluntary. Agent Directives expresses publisher
          preferences, not enforcement mechanisms.
        </p>
      </Section>

      {/* Section 7: Security Considerations */}
      <Section id="security" number="07" title="Security Considerations">
        <ul className="list-disc list-inside space-y-2">
          <li>Agent Directives must be served over HTTPS.</li>
          <li>Agents should validate the JSON strictly (reject malformed documents).</li>
          <li>Rate limits in Agent Directives are advisory; servers should still enforce limits server-side.</li>
          <li>
            The <code className="text-code text-sm font-mono">contact</code> field should not be used for automated
            communication without human oversight.
          </li>
        </ul>
      </Section>

      <hr className="hr-ornament mb-12" />

      <div className="p-6 bg-surface border border-border rounded-card">
        <h2 className="text-sm font-display text-text uppercase tracking-wider mb-3">See also</h2>
        <ul className="space-y-2 text-sm font-serif">
          <li>
            <Link href="/spec" className="text-accent hover:underline">SOM Specification</Link>
            <span className="text-muted"> — The structured page format that Agent Directives references.</span>
          </li>
          <li>
            <Link href="/validate" className="text-accent hover:underline">SOM Validator</Link>
            <span className="text-muted"> — Test SOM documents against the specification.</span>
          </li>
          <li>
            <Link href="/reference" className="text-accent hover:underline">API Reference</Link>
            <span className="text-muted"> — Complete reference for all element types, region roles, and actions.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
