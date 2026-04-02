'use client'

import { useState } from 'react'

const sections = [
  {
    title: 'Document Structure',
    content: `Every SOM document is a single JSON object with the following top-level fields:

- **som_version** (string, required) - Specification version, currently "1.0"
- **url** (string, required) - The canonical URL of the source page
- **title** (string, required) - The document title extracted from the page
- **lang** (string, optional) - BCP 47 language code (e.g., "en", "fr")
- **regions** (array, required) - Ordered list of semantic page regions
- **meta** (object, required) - Compression and structure metadata
- **structured_data** (object, optional) - Extracted semantic data (JSON-LD, OpenGraph, etc.)

The document structure is intentionally flat. There is exactly one level of nesting: document contains regions, regions contain elements. This avoids the deeply nested trees that make HTML expensive for LLMs to process.`,
  },
  {
    title: 'Regions',
    content: `Regions represent semantic page zones. Each region has a role that describes its purpose on the page.

**Detection precedence:**
1. ARIA roles (role="navigation", role="main", etc.)
2. HTML5 landmarks (<nav>, <main>, <aside>, <header>, <footer>)
3. Class/ID heuristics (common patterns like "sidebar", "nav", "footer")
4. Link density analysis (high link density suggests navigation)
5. Content heuristics (text density, heading presence)
6. Fallback to "generic"

**Standard roles:** main, navigation, aside, header, footer, search, form, dialog, section, generic

Each region contains:
- **id** (string) - Region identifier, prefixed with "r_"
- **role** (string) - One of the standard region roles
- **label** (string, optional) - Accessible name if available
- **elements** (array) - Ordered list of elements within this region`,
  },
  {
    title: 'Elements',
    content: `Elements are the atomic units of a SOM document. Each element represents a meaningful interactive or content node on the page.

**Core fields:**
- **id** (string, required) - Stable identifier, prefixed with "e_", derived from SHA-256 hash
- **role** (string, required) - One of the 15 element types
- **text** (string, required) - Visible text content or accessible name
- **attrs** (object, optional) - Role-specific attributes (e.g., href for links, level for headings)
- **actions** (array, optional) - Available interactions: click, type, select, toggle, clear
- **hints** (object, optional) - CSS-inferred semantic signals (e.g., visually hidden, primary button styling)
- **aria** (object, optional) - Dynamic widget state (expanded, checked, selected, disabled, etc.)

Elements are ordered by their visual position on the page (top-to-bottom, left-to-right), not by DOM order.`,
  },
  {
    title: 'Element Types',
    content: `SOM defines 15 element types, each with role-specific attributes:

| Type | Description | Key Attributes |
|------|-------------|----------------|
| **link** | Hyperlinks | href, visited |
| **button** | Clickable controls | type, form_action |
| **text_input** | Single-line text fields | value, placeholder, input_type |
| **textarea** | Multi-line text fields | value, placeholder, rows |
| **select** | Dropdown menus | value, options, multiple |
| **checkbox** | Toggle checkboxes | checked, value |
| **radio** | Radio buttons | checked, value, name |
| **heading** | Section headings | level (1-6) |
| **image** | Visual content | src, alt, width, height |
| **list** | Ordered/unordered lists | items, ordered |
| **table** | Tabular data | headers, rows |
| **paragraph** | Text blocks | (none) |
| **section** | Content groups | (none) |
| **separator** | Visual dividers | (none) |
| **details** | Collapsible content | open, summary |`,
  },
  {
    title: 'Stable IDs',
    content: `SOM generates deterministic, stable element IDs using SHA-256 hashing. The same element produces the same ID across page refreshes, enabling reliable element references in agent workflows.

**ID format:** \`e_\` + first 12 hex characters of the SHA-256 hash

**Hash input:** \`origin + "|" + role + "|" + accessible_name + "|" + dom_path\`

**Example:**
- Origin: \`https://example.com\`
- Role: \`link\`
- Accessible name: \`More information...\`
- DOM path: \`html>body>div>main>p>a\`
- Hash input: \`https://example.com|link|More information...|html>body>div>main>p>a\`
- Result: \`e_1a5c8b3e7f2d\`

This approach ensures that:
- The same element gets the same ID across page refreshes
- Different elements on the same page get unique IDs
- IDs are short enough for efficient token usage
- No server-side state is required`,
  },
  {
    title: 'Meta Block',
    content: `The meta block provides compression and structure statistics for every SOM document.

**Fields:**
- **html_bytes** (integer) - Size of the original HTML in bytes
- **som_bytes** (integer) - Size of the SOM JSON output in bytes
- **element_count** (integer) - Total number of elements across all regions
- **interactive_count** (integer) - Number of elements with at least one action
- **compression_ratio** (number) - Ratio of html_bytes to som_bytes

The compression ratio is the primary metric for SOM efficiency. Across a sample of 10,000 web pages, SOM achieves an average compression ratio of 17x compared to raw HTML, measured in LLM tokens (not bytes).`,
  },
  {
    title: 'Structured Data',
    content: `SOM extracts and normalizes structured data embedded in web pages, making it directly accessible without HTML parsing.

**Supported formats:**
- **json_ld** (array) - All JSON-LD blocks, parsed and deduplicated
- **open_graph** (object) - OpenGraph meta tags (og:title, og:description, og:image, etc.)
- **twitter_card** (object) - Twitter Card meta tags
- **links** (object) - Link relations (canonical, alternate, prev, next, etc.)
- **meta** (object) - Other meta tags (description, robots, viewport, etc.)

Structured data is extracted as-is from the source page. SOM does not validate or transform the data beyond basic parsing and deduplication. This preserves publisher intent while making the data accessible to agents without HTML parsing.`,
  },
]

export default function SpecAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {sections.map((section, i) => (
        <div key={section.title} className="border border-border rounded-card overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium text-text">{section.title}</span>
            </div>
            <svg
              className={`w-4 h-4 text-muted transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-6 border-t border-border/50">
              <div className="pt-4 prose-dark prose-sm max-w-none">
                {section.content.split('\n\n').map((paragraph, j) => {
                  if (paragraph.startsWith('|')) {
                    const lines = paragraph.trim().split('\n')
                    const headers = lines[0].split('|').filter(Boolean).map(h => h.trim())
                    const dataRows = lines.slice(2).map(line =>
                      line.split('|').filter(Boolean).map(cell => cell.trim())
                    )
                    return (
                      <div key={j} className="overflow-x-auto mt-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              {headers.map((h, hi) => (
                                <th key={hi} className="py-2 px-3 text-left font-medium text-text">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, ri) => (
                              <tr key={ri} className="border-b border-border/30">
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className="py-2 px-3 text-muted"
                                    dangerouslySetInnerHTML={{
                                      __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text">$1</strong>'),
                                    }}
                                  />
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                  if (paragraph.startsWith('- ') || paragraph.match(/^\d\./)) {
                    const items = paragraph.split('\n')
                    return (
                      <ul key={j} className="mt-3 space-y-1.5">
                        {items.map((item, k) => (
                          <li
                            key={k}
                            className="text-muted text-sm pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/40"
                            dangerouslySetInnerHTML={{
                              __html: item
                                .replace(/^[-\d.]+\s*/, '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="text-green bg-surface px-1 py-0.5 rounded text-xs">$1</code>'),
                            }}
                          />
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p
                      key={j}
                      className="mt-3 text-sm text-muted leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text">$1</strong>')
                          .replace(/`([^`]+)`/g, '<code class="text-green bg-surface px-1 py-0.5 rounded text-xs">$1</code>'),
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
