# Semantic Object Model (SOM) — Specification v1.0

**somspec.org** is the community home for the SOM specification, validator, and SOM Directives proposal.

> SOM is an open format for representing web pages as structured JSON optimized for AI agent consumption.
> It achieves an average **17x token reduction** compared to raw HTML.

**[somspec.org](https://somspec.org)** · [Specification](/spec) · [Validator](/validate) · [Directives](/directives) · [Reference](/reference)

---

## Contents

1. [What is SOM?](#1-what-is-som)
2. [Design Goals](#2-design-goals)
3. [Document Structure](#3-document-structure)
4. [Regions](#4-regions)
5. [Elements](#5-elements)
6. [Element Types](#6-element-types)
7. [Stable IDs](#7-stable-ids)
8. [Meta Block](#8-meta-block)
9. [Structured Data](#9-structured-data)
10. [Conformance](#10-conformance)
11. [SOM Directives for robots.txt](#11-som-directives-for-robotstxt)
12. [Example Document](#12-example-document)
13. [Implementations](#13-implementations)
14. [License](#14-license)

---

## 1. What is SOM?

The Semantic Object Model is a JSON-based format for representing the meaningful content and
interactive elements of web pages. It is designed as a replacement for raw HTML, Markdown
extraction, and accessibility tree dumps when the consumer is an AI agent or large language model.

HTML was designed for browsers. It carries layout directives, styling hooks, script blocks, and
deeply nested structures that are expensive to parse and wasteful to include in LLM context windows.
Markdown loses interactive elements entirely. Accessibility trees vary across browsers and are not
designed for serialization.

SOM addresses these limitations with a single, flat, typed representation that preserves both
content and interactivity while minimizing token usage.

```
Format          Tokens (typical page)    Notes
─────────────────────────────────────────────────────────────────────
Raw HTML        150,000 – 800,000        Includes scripts, styles, layout
Markdown        12,000 – 40,000          Loses interactive elements
Accessibility   15,000 – 60,000          Browser-dependent, not serializable
SOM             800 – 8,000              Typed, interactive, deterministic IDs
```

---

## 2. Design Goals

SOM is designed around five core principles:

**Token efficiency.** Minimize tokens an LLM must process to understand a web page.
Average 17x reduction; up to 800x on large SaaS dashboards.

**Type safety.** Every element has a well-defined role with role-specific attributes.
Agents reason about element types without heuristics.

**Interactivity preservation.** Interactive elements carry explicit action annotations.
Agents know what they can do — click, type, select, toggle — without inferring from HTML.

**Stable references.** SHA-256 derived element IDs are deterministic. The same element
produces the same ID across page refreshes, enabling reliable multi-step workflows.

**Publisher compatibility.** SOM documents can be served directly by publishers as an
alternative representation, similar to RSS. See [Section 11](#11-som-directives-for-robotstxt).

---

## 3. Document Structure

A SOM document is a single JSON object. The structure is flat: documents contain regions,
regions contain elements. There is no deeper nesting.

```json
{
  "som_version": "1.0",
  "url": "https://example.com/docs/getting-started",
  "title": "Getting Started",
  "lang": "en",
  "regions": [...],
  "meta": {...},
  "structured_data": {...}
}
```

### Top-level fields

| Field | Type | Required | Description |
|---|---|---|---|
| `som_version` | string | yes | Specification version. Currently `"1.0"`. |
| `url` | string | yes | Canonical URL of the source page. Used in stable ID hashing. |
| `title` | string | yes | Document title from HTML `<title>` or first `<h1>`. |
| `lang` | string | | BCP 47 language code (e.g., `"en"`, `"ja"`). |
| `regions` | array | yes | Ordered list of semantic page regions. Minimum one. |
| `meta` | object | yes | Compression and structure statistics. See §8. |
| `structured_data` | object | | Extracted semantic data (JSON-LD, OpenGraph, etc). See §9. |

---

## 4. Regions

Regions represent semantic zones of a page. They group elements by purpose and provide a
lightweight structural layer. Each region has a role describing its function.

### Detection precedence

Implementations detect regions using this precedence order:

1. ARIA roles — elements with explicit `role` attributes (`role="navigation"`, `role="main"`)
2. HTML5 landmarks — semantic elements (`<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`)
3. Class/ID heuristics — common naming patterns (`sidebar`, `nav`, `footer`)
4. Link density analysis — areas with high link-to-text ratio classified as navigation
5. Content heuristics — text density, heading presence, content patterns
6. Fallback — remaining content grouped under role `generic`

### Standard region roles

`main` `navigation` `aside` `header` `footer` `search` `form` `dialog` `section` `generic`

### Region fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Region identifier. Prefix `r_` followed by a descriptive slug. |
| `role` | string | yes | One of the standard region roles. |
| `label` | string | | Accessible name from `aria-label` or `aria-labelledby`. |
| `elements` | array | yes | Ordered list of elements within this region. |

---

## 5. Elements

Elements are the atomic units of a SOM document. Each element represents a single meaningful
content node or interactive control.

### Element fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Stable identifier. Format: `e_` + 12 hex chars. See §7. |
| `role` | string | yes | One of the 15 defined element types. See §6. |
| `text` | string | yes | Visible text content or computed accessible name. |
| `attrs` | object | | Role-specific attributes. Keys depend on element role. |
| `actions` | array | | Available interactions: `click`, `type`, `select`, `toggle`, `clear`. |
| `hints` | object | | CSS-inferred semantic signals: `primary`, `destructive`, `disabled_visual`, `truncated`, `visually_hidden`. |
| `aria` | object | | Dynamic ARIA widget state: `expanded`, `checked`, `selected`, `disabled`, `pressed`, `invalid`, `required`, `readonly`. |

### Element ordering

Elements within a region must be ordered by visual position (top-to-bottom, left-to-right),
not by DOM source order. This ensures agents process content in reading order.

---

## 6. Element Types

SOM defines 15 element types. Each type has a fixed set of allowed attributes.

| Role | Description | Attributes | Actions |
|---|---|---|---|
| `link` | Hyperlinks and anchor elements | `href`, `visited` | `click` |
| `button` | Clickable controls and submit buttons | `type`, `form_action` | `click` |
| `text_input` | Single-line text entry fields | `value`, `placeholder`, `input_type` | `type`, `clear` |
| `textarea` | Multi-line text entry fields | `value`, `placeholder`, `rows` | `type`, `clear` |
| `select` | Dropdown menus and listboxes | `value`, `options`, `multiple` | `select` |
| `checkbox` | Toggle checkboxes | `checked`, `value` | `toggle` |
| `radio` | Radio button options | `checked`, `value`, `name` | `click` |
| `heading` | Section headings (h1–h6) | `level` | — |
| `image` | Visual content | `src`, `alt`, `width`, `height` | — |
| `list` | Ordered and unordered lists | `items`, `ordered` | — |
| `table` | Tabular data | `headers`, `rows` | — |
| `paragraph` | Block-level text content | — | — |
| `section` | Content grouping containers | — | — |
| `separator` | Visual dividers (`<hr>` elements) | — | — |
| `details` | Collapsible disclosure widgets | `open`, `summary` | `toggle` |

---

## 7. Stable IDs

SOM generates deterministic element identifiers using SHA-256. The same element on the same
page produces the same ID across page refreshes, enabling reliable multi-step agent workflows.

### Algorithm

```
input = origin + "|" + role + "|" + accessible_name + "|" + dom_path
id    = "e_" + SHA256(input).hex()[0:12]
```

### Components

| Component | Description |
|---|---|
| `origin` | Scheme + host + port. Example: `"https://example.com"` |
| `role` | The SOM element type. Example: `"link"` |
| `accessible_name` | Computed accessible name per W3C algorithm. |
| `dom_path` | Simplified CSS path from root. Example: `"html>body>div>main>p>a"` |

### Guarantees

- **Deterministic** — same inputs always produce the same ID
- **Stable** — IDs do not change across refreshes when content is unchanged
- **Unique** — 12 hex characters (48 bits) makes collisions statistically negligible
- **Compact** — 14 characters total is efficient for LLM token budgets

---

## 8. Meta Block

Every SOM document includes a meta block with compression and structure statistics.
Consumers can assess document characteristics without parsing the full content.

```json
"meta": {
  "html_bytes": 184351,
  "som_bytes": 5376,
  "element_count": 47,
  "interactive_count": 12,
  "compression_ratio": 34.3
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `html_bytes` | integer | yes | Size of original HTML in bytes (after Content-Encoding removed). |
| `som_bytes` | integer | yes | Size of serialized SOM JSON in bytes (minified). |
| `element_count` | integer | yes | Total elements across all regions. |
| `interactive_count` | integer | yes | Elements with at least one entry in `actions`. |
| `compression_ratio` | number | yes | `html_bytes / som_bytes`, rounded to one decimal place. |

---

## 9. Structured Data

SOM extracts and normalizes structured data embedded in pages, available in the top-level
`structured_data` field.

| Field | Type | Description |
|---|---|---|
| `json_ld` | array | All JSON-LD blocks found in the page, parsed and deduplicated. |
| `open_graph` | object | OpenGraph meta tags, `og:` prefix stripped from keys. |
| `twitter_card` | object | Twitter Card meta tags, `twitter:` prefix stripped. |
| `links` | object | Link relations: `canonical`, `alternate`, `prev`, `next`, `icon`, `manifest`. |
| `meta` | object | Other meta tags: `description`, `robots`, `viewport`, `theme-color`, `author`. |

---

## 10. Conformance

An implementation conforms to this specification if it produces JSON documents satisfying
all of the following:

1. The document is valid JSON.
2. All required top-level fields are present with correct types.
3. All regions have valid roles from the standard set.
4. All elements have valid roles from the 15 defined types.
5. Element IDs are generated using the specified SHA-256 algorithm.
6. Element attributes conform to the allowed set for their role.
7. Elements are ordered by visual position, not DOM order.
8. The meta block accurately reflects document statistics.

Implementations may include additional fields not defined in this specification.
Consumers must ignore unrecognized fields rather than treating them as errors.

**Validate your documents at [somspec.org/validate](https://somspec.org/validate).**

---

## 11. SOM Directives for robots.txt

Publishers can advertise SOM availability and declare agent interaction preferences
by adding directives to their existing `robots.txt` file. No new files or discovery
mechanisms are required.

This proposal is rooted in the
[Plasmate Labs robots.txt proposal](https://docs.plasmate.app/robots-txt-proposal)
and discussed in the
[W3C Web Content Browser for AI Agents Community Group](https://www.w3.org/community/web-content-browser-ai/).

### Base directives

```
User-agent: *
Allow: /

# Semantic Object Model available
SOM-Endpoint: https://cache.example.com/v1/som
SOM-Format: SOM/1.0
SOM-Scope: main-content
SOM-Freshness: 3600
SOM-Token-Budget: 15000
```

| Directive | Type | Description |
|---|---|---|
| `SOM-Endpoint` | URL | Base URL of the SOM service. Agents append `?url=` with the target page. |
| `SOM-Format` | string | Format: `SOM/1.0`, `markdown`, `accessibility-tree`. |
| `SOM-Scope` | string | Coverage: `full-page`, `main-content`, `article-body`. |
| `SOM-Freshness` | seconds | Maximum cache age. Default: `86400`. |
| `SOM-Token-Budget` | integer | Suggested maximum token count before fetching. |

### Extended directives (proposed)

Additional directives proposed here for community discussion:

```
SOM-Rate-Limit: 60/minute
SOM-Concurrent: 5
SOM-Attribution: required
SOM-Attribution-Format: Source: {publisher} ({url})
SOM-Contact: agents@example.com
SOM-Paywall: /premium/* /members/*
```

Full documentation at [somspec.org/directives](https://somspec.org/directives).

### Relationship to robots.txt

SOM Directives extend robots.txt, they do not replace it. The distinction:

- `robots.txt` (RFC 9309) — **access**: may this agent access this URL?
- `SOM Directives` — **representation**: what format and endpoint should agents use?
- `SOM v1.0` — **format**: what does a structured page look like?
- `AWP Protocol` — **interaction**: how does an agent act on a fetched page?

An agent should check robots.txt first. If access is denied, directives are irrelevant.

---

## 12. Example Document

A minimal conforming SOM document:

```json
{
  "som_version": "1.0",
  "url": "https://example.com/pricing",
  "title": "Pricing — Example",
  "lang": "en",
  "regions": [
    {
      "id": "r_navigation",
      "role": "navigation",
      "elements": [
        {
          "id": "e_3a9f12c84d01",
          "role": "link",
          "text": "Home",
          "attrs": { "href": "/" },
          "actions": ["click"]
        },
        {
          "id": "e_7bc45e1f2a89",
          "role": "link",
          "text": "Pricing",
          "attrs": { "href": "/pricing" },
          "actions": ["click"]
        }
      ]
    },
    {
      "id": "r_main",
      "role": "main",
      "elements": [
        {
          "id": "e_a1d2e3f4b567",
          "role": "heading",
          "text": "Simple, transparent pricing",
          "attrs": { "level": 1 }
        },
        {
          "id": "e_c8d9f0a1b234",
          "role": "paragraph",
          "text": "Start free. Scale as you grow. No hidden fees."
        },
        {
          "id": "e_e5f6a7b8c901",
          "role": "button",
          "text": "Get started free",
          "actions": ["click"],
          "hints": { "primary": true }
        },
        {
          "id": "e_12b3c4d5e678",
          "role": "table",
          "text": "Plan comparison",
          "attrs": {
            "headers": ["Feature", "Free", "Growth", "Scale"],
            "rows": [
              ["Cache lookups / month", "1,000", "10,000", "100,000"],
              ["Price", "$0", "$199", "$799"],
              ["Fleet sessions", "—", "10,000", "100,000"]
            ]
          }
        }
      ]
    }
  ],
  "meta": {
    "html_bytes": 48210,
    "som_bytes": 1402,
    "element_count": 6,
    "interactive_count": 3,
    "compression_ratio": 34.4
  },
  "structured_data": {
    "open_graph": {
      "title": "Pricing — Example",
      "description": "Start free. Scale as you grow.",
      "url": "https://example.com/pricing"
    },
    "meta": {
      "description": "Start free. Scale as you grow. No hidden fees.",
      "robots": "index,follow"
    }
  }
}
```

---

## 13. Implementations

The reference implementation of SOM is [Plasmate](https://github.com/plasmate-labs/plasmate)
(Apache 2.0, Rust). It produces conforming SOM documents from any publicly accessible URL.

```bash
# Install
curl -fsSL https://plasmate.app/install.sh | sh

# Fetch a page as SOM
plasmate fetch https://example.com

# Validate a document
# paste output at somspec.org/validate
```

### Framework integrations

| Framework | Package |
|---|---|
| MCP (Claude, Cursor) | `plasmate-mcp` |
| LangChain | `plasmate-langchain` |
| LlamaIndex | `plasmate-llama-index` |
| CrewAI | `plasmate-crewai` |
| AutoGen | `plasmate-autogen` |
| Python SDK | `plasmate-python` |
| Node.js SDK | `plasmate-node` |
| Vercel AI SDK | `@plasmate/ai` |

Third-party implementations are encouraged. An implementation is conforming if its output
passes the validator at [somspec.org/validate](https://somspec.org/validate).

---

## 14. License

The SOM specification is published under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

The somspec.org website source is available at
[github.com/dbhurley/somspec](https://github.com/dbhurley/somspec).

The reference implementation (Plasmate) is published under Apache 2.0 at
[github.com/plasmate-labs/plasmate](https://github.com/plasmate-labs/plasmate).

---

**W3C Community Group:**
[web-content-browser-ai](https://www.w3.org/community/web-content-browser-ai/)
· **Research:** [dbhurley.com/papers](https://dbhurley.com/papers)
· **Live validator:** [somspec.org/validate](https://somspec.org/validate)
· **Benchmark data:** [webtaskbench.com](https://webtaskbench.com)
