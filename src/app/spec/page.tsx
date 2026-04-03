import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Specification v1.0',
  description: 'The complete Semantic Object Model specification, version 1.0.',
  alternates: { canonical: '/spec' },
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

export default function SpecPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="mb-20">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent/60 mb-4 block">Specification</span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-text mb-4 leading-tight">
          Semantic Object Model <span className="text-muted/30">v1.0</span>
        </h1>
        <p className="text-lg text-muted font-serif leading-body max-w-2xl">
          SOM is an open specification for representing web pages as structured JSON documents
          optimized for consumption by large language models and AI agents.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono text-muted">
          <span className="px-3 py-1.5 border border-border/60 rounded-full">Version 1.0</span>
          <span className="px-3 py-1.5 border border-border/60 rounded-full">April 2026</span>
          <span className="px-3 py-1.5 border border-border/60 rounded-full">Apache 2.0</span>
        </div>
      </div>

      <hr className="hr-ornament mb-16" />

      {/* Table of Contents */}
      <nav className="mb-20 p-6 bg-surface border border-border rounded-card">
        <h2 className="text-sm font-display text-text uppercase tracking-wider mb-4">Contents</h2>
        <ol className="space-y-2 text-sm font-serif">
          {[
            ['1', 'introduction', 'Introduction'],
            ['2', 'design-goals', 'Design Goals'],
            ['3', 'document-structure', 'Document Structure'],
            ['4', 'regions', 'Regions'],
            ['5', 'elements', 'Elements'],
            ['6', 'element-types', 'Element Types'],
            ['7', 'stable-ids', 'Stable IDs'],
            ['8', 'meta-block', 'Meta Block'],
            ['9', 'structured-data', 'Structured Data'],
            ['10', 'conformance', 'Conformance'],
          ].map(([num, id, title]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-muted hover:text-accent transition-colors">
                <span className="text-accent/30 font-mono mr-3 text-xs">{num.padStart(2, '0')}</span>
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="introduction" number="01" title="Introduction">
        <p>
          The Semantic Object Model (SOM) is a JSON-based format for representing the meaningful content
          and interactive elements of web pages. It is designed as a replacement for raw HTML, Markdown
          extraction, and accessibility tree dumps when the consumer is an AI agent or large language model.
        </p>
        <p>
          HTML was designed for browsers. It carries layout directives, styling hooks, script blocks, and
          deeply nested structures that are expensive to parse and wasteful to include in LLM context windows.
          Markdown loses interactive elements entirely. Accessibility trees vary across browsers and are not
          designed for serialization.
        </p>
        <p>
          SOM addresses these limitations by providing a single, flat, typed representation that preserves
          both content and interactivity while minimizing token usage. On average, SOM documents use 17x
          fewer tokens than the equivalent HTML.
        </p>
      </Section>

      <Section id="design-goals" number="02" title="Design Goals">
        <p>SOM is designed around five core principles:</p>
        <ul className="list-none space-y-3 mt-4">
          {[
            ['Token efficiency', 'Minimize the number of tokens an LLM must process to understand a web page. SOM achieves an average 17x reduction compared to raw HTML.'],
            ['Type safety', 'Every element has a well-defined role with role-specific attributes. Agents can reason about element types without parsing heuristics.'],
            ['Interactivity preservation', 'Interactive elements (links, buttons, inputs, selects) carry explicit action annotations. Agents know what they can do with each element.'],
            ['Stable references', 'SHA-256 derived element IDs are deterministic. The same element produces the same ID across page refreshes, enabling reliable multi-step workflows.'],
            ['Publisher compatibility', 'SOM documents can be served directly by publishers as an alternative representation of their pages, similar to RSS or JSON feeds.'],
          ].map(([title, desc]) => (
            <li key={title} className="pl-4 border-l-2 border-accent/15 py-1">
              <strong className="text-text font-display">{title}.</strong> {desc}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="document-structure" number="03" title="Document Structure">
        <p>
          A SOM document is a single JSON object. The structure is intentionally flat: documents contain
          regions, regions contain elements. There is no deeper nesting.
        </p>
        <SubSection title="Top-level fields">
          <Field name="som_version" type="string" required>
            The specification version. Currently &quot;1.0&quot;. Implementations must reject documents
            with unrecognized major versions.
          </Field>
          <Field name="url" type="string" required>
            The canonical URL of the source page. Used as part of the stable ID hash input.
          </Field>
          <Field name="title" type="string" required>
            The document title, extracted from the HTML title element or first h1.
          </Field>
          <Field name="lang" type="string">
            BCP 47 language code (e.g., &quot;en&quot;, &quot;ja&quot;). Extracted from the html element
            lang attribute.
          </Field>
          <Field name="regions" type="array" required>
            Ordered list of semantic page regions. Must contain at least one region.
          </Field>
          <Field name="meta" type="object" required>
            Compression and structure metadata. See section 8.
          </Field>
          <Field name="structured_data" type="object">
            Extracted semantic data from the page. See section 9.
          </Field>
        </SubSection>
      </Section>

      <Section id="regions" number="04" title="Regions">
        <p>
          Regions represent semantic zones of a web page. They provide a lightweight grouping layer
          between the document and its elements. Each region has a role that describes its purpose.
        </p>
        <SubSection title="Region detection precedence">
          <p>Implementations must detect regions using the following precedence order:</p>
          <ol className="list-decimal list-inside space-y-2 mt-3">
            <li><strong className="text-text font-display">ARIA roles</strong> - Elements with explicit role attributes (role=&quot;navigation&quot;, role=&quot;main&quot;)</li>
            <li><strong className="text-text font-display">HTML5 landmarks</strong> - Semantic elements (nav, main, aside, header, footer)</li>
            <li><strong className="text-text font-display">Class/ID heuristics</strong> - Common naming patterns (&quot;sidebar&quot;, &quot;nav&quot;, &quot;footer&quot;)</li>
            <li><strong className="text-text font-display">Link density analysis</strong> - Areas with high link density are classified as navigation</li>
            <li><strong className="text-text font-display">Content heuristics</strong> - Text density, heading presence, content patterns</li>
            <li><strong className="text-text font-display">Fallback</strong> - Remaining content is grouped under role &quot;generic&quot;</li>
          </ol>
        </SubSection>
        <SubSection title="Standard roles">
          <p>
            The following region roles are defined: <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">main</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">navigation</code>,{' '}
            <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">aside</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">header</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">footer</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">search</code>,{' '}
            <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">form</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">dialog</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">section</code>, <code className="text-code bg-surface px-1.5 py-0.5 rounded text-sm font-mono">generic</code>.
          </p>
        </SubSection>
        <SubSection title="Region fields">
          <Field name="id" type="string" required>
            Region identifier, prefixed with &quot;r_&quot; followed by a descriptive slug.
          </Field>
          <Field name="role" type="string" required>
            One of the standard region roles listed above.
          </Field>
          <Field name="label" type="string">
            Accessible name of the region if available (from aria-label or aria-labelledby).
          </Field>
          <Field name="elements" type="array" required>
            Ordered list of elements within this region.
          </Field>
        </SubSection>
      </Section>

      <Section id="elements" number="05" title="Elements">
        <p>
          Elements are the atomic units of a SOM document. Each element represents a single meaningful
          content node or interactive control on the page.
        </p>
        <SubSection title="Element fields">
          <Field name="id" type="string" required>
            Stable identifier derived from SHA-256 hash. Format: &quot;e_&quot; + 12 hex chars. See section 7.
          </Field>
          <Field name="role" type="string" required>
            One of the 15 defined element types. See section 6.
          </Field>
          <Field name="text" type="string" required>
            Visible text content or computed accessible name. Must not be empty.
          </Field>
          <Field name="attrs" type="object">
            Role-specific attributes. The allowed keys depend on the element role.
          </Field>
          <Field name="actions" type="array">
            Available interactions. Values: &quot;click&quot;, &quot;type&quot;, &quot;select&quot;, &quot;toggle&quot;, &quot;clear&quot;.
          </Field>
          <Field name="hints" type="object">
            CSS-inferred semantic signals. Keys include: visually_hidden, primary, destructive, disabled_visual, truncated.
          </Field>
          <Field name="aria" type="object">
            Dynamic ARIA widget state. Keys include: expanded, checked, selected, disabled, pressed, invalid, required, readonly.
          </Field>
        </SubSection>
        <SubSection title="Element ordering">
          <p>
            Elements within a region must be ordered by their visual position on the page
            (top-to-bottom, left-to-right), not by DOM source order. This ensures agents process
            content in the order a human would read it.
          </p>
        </SubSection>
      </Section>

      <Section id="element-types" number="06" title="Element Types">
        <p>
          SOM defines 15 element types. Each type has a fixed set of allowed attributes.
          Implementations must map HTML elements to the most appropriate SOM type.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-display font-medium text-text">Type</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Description</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Attributes</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody className="text-muted font-serif">
              {[
                ['link', 'Hyperlinks and anchor elements', 'href, visited', 'click'],
                ['button', 'Clickable controls and submit buttons', 'type, form_action', 'click'],
                ['text_input', 'Single-line text entry fields', 'value, placeholder, input_type', 'type, clear'],
                ['textarea', 'Multi-line text entry fields', 'value, placeholder, rows', 'type, clear'],
                ['select', 'Dropdown menus and listboxes', 'value, options, multiple', 'select'],
                ['checkbox', 'Toggle checkboxes', 'checked, value', 'toggle'],
                ['radio', 'Radio button options', 'checked, value, name', 'click'],
                ['heading', 'Section headings (h1-h6)', 'level', '-'],
                ['image', 'Visual content', 'src, alt, width, height', '-'],
                ['list', 'Ordered and unordered lists', 'items, ordered', '-'],
                ['table', 'Tabular data', 'headers, rows', '-'],
                ['paragraph', 'Block-level text content', '-', '-'],
                ['section', 'Content grouping containers', '-', '-'],
                ['separator', 'Visual dividers (hr elements)', '-', '-'],
                ['details', 'Collapsible disclosure widgets', 'open, summary', 'toggle'],
              ].map(([type, desc, attrs, actions]) => (
                <tr key={type} className="border-b border-border/30 hover:bg-surface/30">
                  <td className="py-3 px-4 font-mono text-code text-sm">{type}</td>
                  <td className="py-3 px-4">{desc}</td>
                  <td className="py-3 px-4 font-mono text-xs">{attrs}</td>
                  <td className="py-3 px-4 font-mono text-xs">{actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="stable-ids" number="07" title="Stable IDs">
        <p>
          SOM generates deterministic element identifiers using SHA-256 hashing. This ensures the
          same element on a page produces the same ID across page loads, enabling agents to build
          reliable multi-step workflows that reference specific elements.
        </p>
        <SubSection title="Hash algorithm">
          <div className="bg-surface border border-border rounded-card p-4 font-mono text-sm mt-2">
            <p className="text-muted/40 mb-2">// Hash input construction</p>
            <p className="text-text">input = origin + &quot;|&quot; + role + &quot;|&quot; + accessible_name + &quot;|&quot; + dom_path</p>
            <p className="text-text mt-2">id = &quot;e_&quot; + SHA256(input).hex()[0:12]</p>
          </div>
        </SubSection>
        <SubSection title="Components">
          <Field name="origin" type="string" required>
            The page origin (scheme + host + port). Example: &quot;https://example.com&quot;.
          </Field>
          <Field name="role" type="string" required>
            The SOM element type (e.g., &quot;link&quot;, &quot;button&quot;, &quot;heading&quot;).
          </Field>
          <Field name="accessible_name" type="string" required>
            The computed accessible name of the element, following the W3C Accessible Name computation algorithm.
          </Field>
          <Field name="dom_path" type="string" required>
            The simplified CSS path from the document root to the element. Example: &quot;html&gt;body&gt;div&gt;main&gt;p&gt;a&quot;.
          </Field>
        </SubSection>
        <SubSection title="Guarantees">
          <ul className="list-none space-y-2">
            <li className="pl-4 border-l-2 border-success/20 py-1"><strong className="text-text font-display">Deterministic:</strong> Same inputs always produce the same ID.</li>
            <li className="pl-4 border-l-2 border-success/20 py-1"><strong className="text-text font-display">Stable:</strong> IDs do not change across page refreshes when content is unchanged.</li>
            <li className="pl-4 border-l-2 border-success/20 py-1"><strong className="text-text font-display">Unique:</strong> Hash collisions are statistically negligible at 12 hex characters (48 bits).</li>
            <li className="pl-4 border-l-2 border-success/20 py-1"><strong className="text-text font-display">Compact:</strong> 14 characters total (e_ prefix + 12 hex) is efficient for token usage.</li>
          </ul>
        </SubSection>
      </Section>

      <Section id="meta-block" number="08" title="Meta Block">
        <p>
          Every SOM document includes a meta block with compression and structure statistics.
          This allows consumers to assess document characteristics without parsing the full content.
        </p>
        <SubSection title="Fields">
          <Field name="html_bytes" type="integer" required>
            Size of the original HTML document in bytes, after removing any Content-Encoding.
          </Field>
          <Field name="som_bytes" type="integer" required>
            Size of the serialized SOM JSON in bytes (minified, no whitespace).
          </Field>
          <Field name="element_count" type="integer" required>
            Total number of elements across all regions.
          </Field>
          <Field name="interactive_count" type="integer" required>
            Number of elements that have at least one entry in their actions array.
          </Field>
          <Field name="compression_ratio" type="number" required>
            The ratio of html_bytes to som_bytes, rounded to one decimal place.
          </Field>
        </SubSection>
      </Section>

      <Section id="structured-data" number="09" title="Structured Data">
        <p>
          SOM extracts and normalizes structured data embedded in web pages. This data is included
          in the structured_data top-level field, making it directly accessible without HTML parsing.
        </p>
        <SubSection title="Supported formats">
          <Field name="json_ld" type="array">
            All JSON-LD blocks found in the page, parsed into objects and deduplicated.
          </Field>
          <Field name="open_graph" type="object">
            OpenGraph meta tags, with the &quot;og:&quot; prefix stripped from keys.
          </Field>
          <Field name="twitter_card" type="object">
            Twitter Card meta tags, with the &quot;twitter:&quot; prefix stripped from keys.
          </Field>
          <Field name="links" type="object">
            Link relations extracted from link elements: canonical, alternate, prev, next, icon, manifest.
          </Field>
          <Field name="meta" type="object">
            Other meta tags: description, robots, viewport, theme-color, author.
          </Field>
        </SubSection>
      </Section>

      <Section id="conformance" number="10" title="Conformance">
        <p>
          An implementation conforms to this specification if it produces JSON documents that satisfy
          all of the following:
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-4">
          <li>The document is valid JSON.</li>
          <li>All required top-level fields are present with correct types.</li>
          <li>All regions have valid roles from the standard set.</li>
          <li>All elements have valid roles from the 15 defined types.</li>
          <li>Element IDs are generated using the specified SHA-256 algorithm.</li>
          <li>Element attributes conform to the allowed set for their role.</li>
          <li>Elements are ordered by visual position, not DOM order.</li>
          <li>The meta block accurately reflects the document statistics.</li>
        </ol>
        <p className="mt-6">
          Implementations may include additional fields not defined in this specification.
          Consumers must ignore unrecognized fields rather than treating them as errors.
        </p>
      </Section>

      <hr className="hr-ornament mb-12" />

      <div className="p-6 bg-surface border border-border rounded-card">
        <h2 className="text-sm font-display text-text uppercase tracking-wider mb-3">See also</h2>
        <ul className="space-y-2 text-sm font-serif">
          <li>
            <Link href="/reference" className="text-accent hover:underline">API Reference</Link>
            <span className="text-muted"> — Complete reference for all element types, region roles, attributes, and actions.</span>
          </li>
          <li>
            <Link href="/changelog" className="text-accent hover:underline">Changelog</Link>
            <span className="text-muted"> — Version history of the SOM specification.</span>
          </li>
          <li>
            <Link href="/directives" className="text-accent hover:underline">Agent Directives</Link>
            <span className="text-muted"> — A proposal for how publishers express AI agent interaction preferences.</span>
          </li>
          <li>
            <Link href="/validate" className="text-accent hover:underline">SOM Validator</Link>
            <span className="text-muted"> — Check whether a SOM document conforms to the specification.</span>
          </li>
        </ul>
      </div>

      <div className="mt-12 p-6 bg-surface border border-border rounded-card">
        <h2 className="text-sm font-display text-text uppercase tracking-wider mb-4">References</h2>
        <ol className="space-y-2 font-mono text-xs text-muted leading-relaxed list-none">
          <li>[1] Hurley, D. (2026). The Semantic Object Model: A Token-Efficient Web Representation for AI Agents. arXiv cs.IR/cs.AI. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[2] Hurley, D. (2026). The Agentic Web: Rethinking Web Infrastructure for Machine Consumption. arXiv cs.AI/cs.CY. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[3] Hurley, D. (2026). Agent Web Protocol: A Purpose-Built Communication Protocol for AI Agent-Web Interaction. arXiv cs.NI/cs.SE. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[4] Hurley, D. (2026). Cooperative Content Negotiation for the Agentic Web: Extending robots.txt for AI Agents. arXiv cs.CY/cs.IR. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[5] Hurley, D. (2026). The Hidden Tax: Quantifying Token Waste in Agent-Web Interaction. arXiv cs.AI/cs.CY. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[6] Hurley, D. (2026). Does Format Matter? Agent Task Performance Across Web Representations. arXiv. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[7] Hurley, D. (2026). The Publisher&apos;s Calculus: A Cost-Benefit Analysis of Serving Structured Representations to AI Agents. arXiv cs.AI/cs.CY. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[8] Hurley, D. (2026). Information Fidelity Under Semantic Compression. arXiv cs.AI/cs.CY. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
          <li>[9] Hurley, D. (2026). Agent Compliance with robots.txt SOM Directives: Empirical Evidence of the Discovery Gap. arXiv cs.AI/cs.CY. <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dbhurley.com/papers</Link></li>
        </ol>
      </div>
    </div>
  )
}
