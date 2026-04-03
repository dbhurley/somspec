'use client'

import Link from 'next/link'
import type { Metadata } from 'next'

// Note: metadata export doesn't work in 'use client' — see layout or separate export
// We keep the static content here and rely on parent layout for base metadata

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-start gap-4 mb-5">
        <span className="font-mono text-xs text-accent/40 pt-[3px] select-none tabular-nums">{number}</span>
        <h2 className="text-lg font-display font-semibold text-text">{title}</h2>
      </div>
      <div className="pl-8 space-y-4 text-sm text-muted leading-relaxed font-serif">
        {children}
      </div>
    </section>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-surface border border-border rounded-card p-4 font-mono text-xs text-code overflow-x-auto leading-relaxed whitespace-pre">
      {children}
    </pre>
  )
}

function DirectiveRow({ name, type, desc }: { name: string; type: string; desc: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 pr-6 font-mono text-xs text-accent align-top whitespace-nowrap">{name}</td>
      <td className="py-3 pr-6 font-mono text-xs text-muted/70 align-top whitespace-nowrap">{type}</td>
      <td className="py-3 text-xs text-muted font-serif leading-relaxed">{desc}</td>
    </tr>
  )
}

export default function DirectivesPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 mb-4">
            PROPOSAL · DRAFT v0.1
          </p>
          <h1 className="font-display text-3xl font-light text-text mb-4">
            SOM Directives for robots.txt
          </h1>
          <p className="font-serif text-base text-muted leading-relaxed max-w-2xl">
            A proposed extension to the robots.txt standard that lets publishers advertise
            SOM availability and declare interaction preferences for AI agents.
            Rooted in the{' '}
            <a
              href="https://docs.plasmate.app/robots-txt-proposal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Plasmate Labs proposal
            </a>
            {' '}and the{' '}
            <a
              href="https://www.w3.org/community/web-content-browser-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              W3C Web Content Browser for AI Agents Community Group
            </a>
            .
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted/60">
            <span>RFC 9309 compatible</span>
            <span className="text-border">·</span>
            <span>No new files required</span>
            <span className="text-border">·</span>
            <span>Extends existing crawl contract</span>
          </div>
        </div>

        {/* Sections */}
        <Section number="01" title="Why Extend robots.txt">
          <p>
            The robots.txt standard has governed crawler behavior since 1994. Today it is
            also how website owners signal their preferences to AI agents — yet it only
            answers one question: <em>may this agent access this URL?</em>
          </p>
          <p>
            It cannot say: <em>yes, you may read my content, and here is a more efficient
            representation of it.</em> Publishers are left with a binary choice — block
            agents entirely, or serve them raw HTML at full bandwidth and token cost.
          </p>
          <p>
            SOM Directives extend robots.txt to express a third option: cooperative
            content negotiation. A publisher can advertise a structured SOM endpoint,
            declare freshness preferences, suggest token budgets, and set interaction
            policies — all within the file agents already check.
          </p>
          <p>
            Extending robots.txt is preferable to a new discovery file because it requires
            no new infrastructure, no additional HTTP round-trips, and builds on a
            well-understood trust model that every crawler and agent already implements.
          </p>
        </Section>

        <Section number="02" title="Base Directives">
          <p>
            The following five directives form the base proposal, as specified by{' '}
            <a
              href="https://dbhurley.com/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Hurley (2026)
            </a>
            {' '}and documented at{' '}
            <a
              href="https://docs.plasmate.app/robots-txt-proposal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              docs.plasmate.app/robots-txt-proposal
            </a>
            .
          </p>

          <CodeBlock>{`User-agent: *
Allow: /

# Semantic Object Model available
SOM-Endpoint: https://cache.example.com/v1/som
SOM-Format: SOM/1.0
SOM-Scope: main-content
SOM-Freshness: 3600
SOM-Token-Budget: 15000`}</CodeBlock>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-6 font-mono text-xs text-muted/60 font-normal">Directive</th>
                  <th className="text-left py-2 pr-6 font-mono text-xs text-muted/60 font-normal">Type</th>
                  <th className="text-left py-2 font-mono text-xs text-muted/60 font-normal">Description</th>
                </tr>
              </thead>
              <tbody>
                <DirectiveRow name="SOM-Endpoint" type="URL" desc="Base URL of the SOM service. Agents append ?url= with the target page URL." />
                <DirectiveRow name="SOM-Format" type="string" desc="Format of the representation. Values: SOM/1.0, markdown, accessibility-tree." />
                <DirectiveRow name="SOM-Scope" type="string" desc="Content coverage. Values: full-page, main-content, article-body." />
                <DirectiveRow name="SOM-Freshness" type="seconds" desc="Maximum age of a cached SOM representation. Default: 86400 (24 hours)." />
                <DirectiveRow name="SOM-Token-Budget" type="integer" desc="Suggested maximum token count, helping agents estimate costs before fetching." />
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-muted/60 font-mono">
            When an agent encounters these directives it should prefer the SOM endpoint
            over fetching raw HTML, using the endpoint as:{' '}
            <span className="text-code">{'{SOM-Endpoint}?url={encoded-page-url}'}</span>
          </p>
        </Section>

        <Section number="03" title="Extended Directives (Proposed)">
          <p>
            The following directives extend the base proposal. They are not yet part of
            the Plasmate Labs specification but are proposed here for community discussion
            via the W3C CG. They follow the same robots.txt syntax and are ignored by
            agents that do not understand them.
          </p>

          <CodeBlock>{`# Extended interaction preferences
SOM-Rate-Limit: 60/minute
SOM-Concurrent: 5
SOM-Attribution: required
SOM-Attribution-Format: Source: {publisher} ({url})
SOM-Contact: agents@example.com
SOM-Paywall: /premium/* /members/*`}</CodeBlock>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-6 font-mono text-xs text-muted/60 font-normal">Directive</th>
                  <th className="text-left py-2 pr-6 font-mono text-xs text-muted/60 font-normal">Type</th>
                  <th className="text-left py-2 font-mono text-xs text-muted/60 font-normal">Description</th>
                </tr>
              </thead>
              <tbody>
                <DirectiveRow name="SOM-Rate-Limit" type="N/period" desc="Advisory rate limit for SOM endpoint requests. Format: integer/minute or integer/hour." />
                <DirectiveRow name="SOM-Concurrent" type="integer" desc="Advisory limit on simultaneous sessions per agent identity." />
                <DirectiveRow name="SOM-Attribution" type="required | optional" desc="Whether the publisher requests attribution when content is cited or summarized." />
                <DirectiveRow name="SOM-Attribution-Format" type="template" desc="Attribution template. Variables: {publisher}, {url}, {title}." />
                <DirectiveRow name="SOM-Contact" type="email" desc="Contact address for agent-related issues. Not for automated use." />
                <DirectiveRow name="SOM-Paywall" type="glob patterns" desc="Space-separated path patterns indicating gated content. Agents should not attempt SOM fetch for these paths." />
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            These directives are advisory. Publishers declare preferences; enforcement
            remains the publisher's responsibility through server-side controls.
            Agents that honor extended directives are considered Level 2 compliant (see Section 05).
          </p>
        </Section>

        <Section number="04" title="Per-Path Overrides">
          <p>
            Standard robots.txt user-agent blocks allow per-path scoping. SOM directives
            inherit this mechanism naturally:
          </p>

          <CodeBlock>{`# Default: SOM available site-wide
User-agent: *
Allow: /
SOM-Endpoint: https://cache.example.com/v1/som
SOM-Format: SOM/1.0
SOM-Freshness: 3600

# Documentation: longer freshness, full-page scope
User-agent: *
SOM-Scope: full-page
SOM-Freshness: 86400
Disallow:

# API routes: not content, no SOM served
User-agent: *
Disallow: /api/`}</CodeBlock>

          <p>
            Where multiple blocks apply to the same agent, the most specific match wins,
            consistent with RFC 9309 precedence rules.
          </p>
        </Section>

        <Section number="05" title="Compliance Levels">
          <p>
            Compliance is voluntary. SOM Directives express publisher preferences, not
            enforcement mechanisms. Three levels are defined for interoperability:
          </p>

          <div className="space-y-3 mt-2">
            {[
              {
                level: 'Level 0 — Aware',
                desc: 'Agent parses robots.txt for SOM-* directives but does not modify its fetching behavior. Useful for logging and research.',
              },
              {
                level: 'Level 1 — Respectful',
                desc: 'Agent honors SOM-Endpoint, SOM-Format, SOM-Scope, SOM-Freshness, and SOM-Token-Budget. Prefers SOM over raw HTML when directives are present.',
              },
              {
                level: 'Level 2 — Full',
                desc: 'Agent honors all base and extended directives including SOM-Rate-Limit, SOM-Concurrent, SOM-Attribution, and SOM-Paywall.',
              },
            ].map(({ level, desc }) => (
              <div key={level} className="flex gap-4 p-4 bg-surface rounded-card border border-border">
                <div className="font-mono text-xs text-accent pt-[2px] whitespace-nowrap">{level}</div>
                <div className="text-sm text-muted font-serif">{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section number="06" title="Relationship to Other Standards">
          <p>
            SOM Directives sit within an emerging stack of standards for the agentic web:
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-6 font-mono text-muted/60 font-normal">Standard</th>
                  <th className="text-left py-2 pr-6 font-mono text-muted/60 font-normal">Layer</th>
                  <th className="text-left py-2 font-mono text-muted/60 font-normal">Question answered</th>
                </tr>
              </thead>
              <tbody className="font-serif">
                <tr className="border-b border-border/40">
                  <td className="py-3 pr-6 font-mono text-xs text-muted">robots.txt (RFC 9309)</td>
                  <td className="py-3 pr-6 text-muted">Access</td>
                  <td className="py-3 text-muted">May this agent access this URL?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 pr-6 font-mono text-xs text-accent">SOM Directives</td>
                  <td className="py-3 pr-6 text-muted">Representation</td>
                  <td className="py-3 text-muted">What format and endpoint should agents use?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 pr-6 font-mono text-xs text-muted">SOM (v1.0)</td>
                  <td className="py-3 pr-6 text-muted">Format</td>
                  <td className="py-3 text-muted">What does a structured page representation look like?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 pr-6 font-mono text-xs text-muted">AWP Protocol</td>
                  <td className="py-3 pr-6 text-muted">Interaction</td>
                  <td className="py-3 text-muted">How does an agent act on a page once fetched?</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-mono text-xs text-muted">schema.org / JSON-LD</td>
                  <td className="py-3 pr-6 text-muted">Semantics</td>
                  <td className="py-3 text-muted">What does this content mean?</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            SOM Directives do not replace robots.txt — they extend it. An agent should
            check robots.txt first. If access is denied, directives are irrelevant.
            If access is allowed, directives provide guidance on how to fetch efficiently.
          </p>
        </Section>

        <Section number="07" title="The Discovery Gap">
          <p>
            Empirical research by Hurley (2026) in{' '}
            <em>Agent Compliance with robots.txt SOM Directives: Empirical Evidence of
            the Discovery Gap</em> found that even agents capable of honoring SOM
            directives frequently fail to check for them. The primary causes are:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>robots.txt is fetched once per session and cached, but SOM directives are ignored even when present</li>
            <li>Most agent frameworks treat robots.txt as access-only and do not parse unknown directives</li>
            <li>No standard library implements SOM-directive parsing, creating friction for framework authors</li>
          </ul>
          <p className="mt-3">
            Closing this gap requires adoption at the framework level — LangChain,
            LlamaIndex, Browser Use, CrewAI, and other orchestration tools adding
            robots.txt directive parsing to their fetch pipelines.
          </p>
          <p>
            This page is intended to serve as a reference that framework authors can
            point to when implementing compliance.
          </p>
        </Section>

        <Section number="08" title="Publisher Quickstart">
          <p>Add to your <span className="font-mono text-code text-xs">robots.txt</span>:</p>
          <CodeBlock>{`# Minimal — advertise SOM endpoint only
User-agent: *
Allow: /
SOM-Endpoint: https://cache.plasmate.app/v1/som
SOM-Format: SOM/1.0
SOM-Freshness: 3600`}</CodeBlock>
          <p>
            If you self-host Plasmate, replace the endpoint with your own instance.
            If you use the Plasmate SOM Cache, the endpoint is{' '}
            <span className="font-mono text-code text-xs">https://cache.plasmate.app/v1/som</span>.
          </p>
          <p>
            Verify your configuration at{' '}
            <Link href="/validate" className="text-accent hover:underline">
              somspec.org/validate
            </Link>
            {' '}or use{' '}
            <a
              href="https://somordom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              somordom.com
            </a>
            {' '}for a live head-to-head comparison.
          </p>
        </Section>

        <Section number="09" title="Get Involved">
          <p>
            This proposal is discussed in the{' '}
            <a
              href="https://www.w3.org/community/web-content-browser-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              W3C Web Content Browser for AI Agents Community Group
            </a>
            . The extended directives in Section 03 are not yet adopted and are
            open for comment.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <a
              href="https://github.com/plasmate-labs/plasmate/blob/master/docs/ROBOTS-TXT-PROPOSAL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-card text-xs font-mono text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              Full proposal (GitHub)
            </a>
            <a
              href="https://www.w3.org/community/web-content-browser-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-card text-xs font-mono text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              W3C Community Group
            </a>
            <a
              href="https://dbhurley.com/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-card text-xs font-mono text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              Research papers
            </a>
            <Link
              href="/spec"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-card text-xs font-mono text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              SOM Specification
            </Link>
          </div>
        </Section>

      </div>
    </div>
  )
}
