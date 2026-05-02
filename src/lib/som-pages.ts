// SOM document registry for somspec.org's own pages.
//
// This module is the data layer behind `/api/v1/som`. The site dogfoods the
// SOM/1.0 specification: every advertised page has a hand-curated structured
// representation here, served alongside the human-facing HTML rendering.
//
// To add a new page, create a new entry in PAGE_SOMS keyed by the URL path
// (with leading slash). Blog posts are generated automatically from posts.ts.

import { posts, getCategory } from '@/data/posts'

const SITE_ORIGIN = 'https://somspec.org'

// ── SOM types ────────────────────────────────────────────────────────────────

export interface SomElement {
  id:       string
  role:     string
  text?:    string
  attrs?:   Record<string, unknown>
  actions?: string[]
}

export interface SomRegion {
  id:       string
  role:     string
  elements: SomElement[]
}

export interface SomDocument {
  som_version: '1.0'
  url:         string
  title:       string
  lang:        string
  regions:     SomRegion[]
  meta?:       {
    html_bytes?:        number
    som_bytes?:         number
    element_count?:     number
    compression_ratio?: number
    generated_at?:      string
    notes?:             string
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Stable SHA-256-style ID prefix; Node's crypto isn't available in edge
// runtime so we use a deterministic FNV-1a + base16 fold for build-time use.
function stableId(prefix: 'r' | 'e', seed: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return `${prefix}_${h.toString(16).padStart(8, '0').slice(0, 8)}`
}

function elementCount(doc: SomDocument): number {
  return doc.regions.reduce((acc, r) => acc + r.elements.length, 0)
}

function withMeta(doc: SomDocument): SomDocument {
  const som_bytes = JSON.stringify(doc).length
  return {
    ...doc,
    meta: {
      ...(doc.meta ?? {}),
      element_count: elementCount(doc),
      som_bytes,
      generated_at: new Date().toISOString(),
    },
  }
}

// ── Per-page SOM documents ──────────────────────────────────────────────────

function homeDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/`
  return withMeta({
    som_version: '1.0',
    url,
    title: 'SOMspec — Structured Object Model Specification',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#nav`),
        role: 'navigation',
        elements: [
          { id: stableId('e', 'nav-spec'), role: 'link', text: 'Specification', actions: ['click'], attrs: { href: '/spec' } },
          { id: stableId('e', 'nav-reference'), role: 'link', text: 'Reference', actions: ['click'], attrs: { href: '/reference' } },
          { id: stableId('e', 'nav-directives'), role: 'link', text: 'Directives', actions: ['click'], attrs: { href: '/directives' } },
          { id: stableId('e', 'nav-validate'), role: 'link', text: 'Validate', actions: ['click'], attrs: { href: '/validate' } },
          { id: stableId('e', 'nav-blog'), role: 'link', text: 'Writing', actions: ['click'], attrs: { href: '/blog' } },
        ],
      },
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'h-home-1'), role: 'heading', text: 'The Structured Object Model', attrs: { level: 1 } },
          { id: stableId('e', 'p-home-1'), role: 'paragraph', text: 'An open specification for representing web pages as structured JSON for AI agents. Typed element roles, stable SHA-256 identifiers, and semantic regions — 17× fewer tokens than raw HTML on average, with peaks above 100×.' },
          { id: stableId('e', 'l-home-spec'), role: 'link', text: 'Read the SOM/1.0 specification', actions: ['click'], attrs: { href: '/spec' } },
          { id: stableId('e', 'l-home-validate'), role: 'link', text: 'Validate a SOM document', actions: ['click'], attrs: { href: '/validate' } },
          { id: stableId('e', 'l-home-directives'), role: 'link', text: 'robots.txt SOM Directives proposal', actions: ['click'], attrs: { href: '/directives' } },
        ],
      },
    ],
    meta: {
      notes: 'Curated SOM for the SOMspec landing page. Authoritative source: this site.',
    },
  })
}

function specDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/spec`
  return withMeta({
    som_version: '1.0',
    url,
    title: 'SOM/1.0 Specification — SOMspec',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'spec-h1'), role: 'heading', text: 'SOM/1.0 Specification', attrs: { level: 1 } },
          { id: stableId('e', 'spec-toc-h'), role: 'heading', text: 'Sections', attrs: { level: 2 } },
          { id: stableId('e', 'spec-s1'), role: 'paragraph', text: '1. What is SOM?' },
          { id: stableId('e', 'spec-s2'), role: 'paragraph', text: '2. Design Goals' },
          { id: stableId('e', 'spec-s3'), role: 'paragraph', text: '3. Document Structure' },
          { id: stableId('e', 'spec-s4'), role: 'paragraph', text: '4. Regions' },
          { id: stableId('e', 'spec-s5'), role: 'paragraph', text: '5. Elements' },
          { id: stableId('e', 'spec-s6'), role: 'paragraph', text: '6. Element Types' },
          { id: stableId('e', 'spec-s7'), role: 'paragraph', text: '7. Stable IDs' },
          { id: stableId('e', 'spec-s8'), role: 'paragraph', text: '8. Meta Block' },
          { id: stableId('e', 'spec-s9'), role: 'paragraph', text: '9. Structured Data' },
          { id: stableId('e', 'spec-s10'), role: 'paragraph', text: '10. Conformance' },
          { id: stableId('e', 'spec-s11'), role: 'paragraph', text: '11. SOM Directives for robots.txt' },
          { id: stableId('e', 'spec-l-readme'), role: 'link', text: 'Full specification on GitHub', actions: ['click'], attrs: { href: 'https://github.com/dbhurley/somspec' } },
          { id: stableId('e', 'spec-l-validate'), role: 'link', text: 'Try the validator', actions: ['click'], attrs: { href: '/validate' } },
        ],
      },
    ],
  })
}

function directivesDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/directives`
  return withMeta({
    som_version: '1.0',
    url,
    title: 'robots.txt SOM Directives — SOMspec',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'dir-h1'), role: 'heading', text: 'SOM Directives for robots.txt', attrs: { level: 1 } },
          { id: stableId('e', 'dir-p-intro'), role: 'paragraph', text: 'Publishers advertise an agent-readable structured endpoint via SOM-* directives in robots.txt. Five lines of opt-in convention, no schema migration required.' },
          { id: stableId('e', 'dir-d-endpoint'), role: 'paragraph', text: 'SOM-Endpoint — URL where SOM JSON is served (required for "ready" status)' },
          { id: stableId('e', 'dir-d-format'), role: 'paragraph', text: 'SOM-Format — format version, e.g. SOM/1.0 (required for "ready" status)' },
          { id: stableId('e', 'dir-d-scope'), role: 'paragraph', text: 'SOM-Scope — hint about what the endpoint covers (optional)' },
          { id: stableId('e', 'dir-d-fresh'), role: 'paragraph', text: 'SOM-Freshness — recommended re-fetch interval in seconds (optional)' },
          { id: stableId('e', 'dir-d-budget'), role: 'paragraph', text: 'SOM-Token-Budget — maximum token cost the publisher commits to (optional)' },
          { id: stableId('e', 'dir-d-rate'), role: 'paragraph', text: 'SOM-Rate-Limit — request rate ceiling, e.g. 60/min (optional)' },
          { id: stableId('e', 'dir-d-attr'), role: 'paragraph', text: 'SOM-Attribution — URL describing attribution requirements (optional)' },
          { id: stableId('e', 'dir-l-checker'), role: 'link', text: 'Check a domain at somready.com', actions: ['click'], attrs: { href: 'https://somready.com' } },
        ],
      },
    ],
  })
}

function validateDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/validate`
  return withMeta({
    som_version: '1.0',
    url,
    title: 'Validate — SOMspec',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'val-h1'), role: 'heading', text: 'Validate a SOM document', attrs: { level: 1 } },
          { id: stableId('e', 'val-p1'), role: 'paragraph', text: 'Paste a SOM/1.0 JSON document below to validate it against the specification. Validation runs entirely in your browser; nothing is sent to any server.' },
          { id: stableId('e', 'val-input'), role: 'textarea', actions: ['type', 'clear'], attrs: { name: 'som-document', placeholder: 'Paste SOM JSON here' } },
          { id: stableId('e', 'val-submit'), role: 'button', text: 'Validate', actions: ['click'] },
        ],
      },
    ],
  })
}

function referenceDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/reference`
  return withMeta({
    som_version: '1.0',
    url,
    title: 'Reference Implementations — SOMspec',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'ref-h1'), role: 'heading', text: 'Reference Implementations', attrs: { level: 1 } },
          { id: stableId('e', 'ref-p1'), role: 'paragraph', text: 'Open-source libraries and services that produce or consume SOM/1.0 documents.' },
          { id: stableId('e', 'ref-h2-plasmate'), role: 'heading', text: 'Plasmate', attrs: { level: 2 } },
          { id: stableId('e', 'ref-p-plasmate'), role: 'paragraph', text: 'Reference browser engine for AI agents. Open source, Apache 2.0. Available as pip / npm / cargo.' },
          { id: stableId('e', 'ref-l-plasmate'), role: 'link', text: 'plasmate.app', actions: ['click'], attrs: { href: 'https://plasmate.app' } },
          { id: stableId('e', 'ref-l-mcp'), role: 'link', text: 'plasmate-mcp on npm', actions: ['click'], attrs: { href: 'https://www.npmjs.com/package/plasmate-mcp' } },
        ],
      },
    ],
  })
}

function blogIndexDoc(): SomDocument {
  const url = `${SITE_ORIGIN}/blog`
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  return withMeta({
    som_version: '1.0',
    url,
    title: 'Writing — SOMspec',
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', 'blog-h1'), role: 'heading', text: 'Writing', attrs: { level: 1 } },
          { id: stableId('e', 'blog-p-intro'), role: 'paragraph', text: 'Analysis, research, and practical guides on the Semantic Object Model, agent-native publishing, and the economics of AI web fetching.' },
          ...sortedPosts.flatMap((p, idx): SomElement[] => {
            const cat = getCategory(p.category)
            return [
              { id: stableId('e', `blog-h-${p.slug}`), role: 'heading', text: p.title, attrs: { level: 2 } },
              { id: stableId('e', `blog-meta-${p.slug}`), role: 'paragraph', text: `${p.date} · ${cat.label} · ${p.readingTime}` },
              { id: stableId('e', `blog-desc-${p.slug}`), role: 'paragraph', text: p.description },
              { id: stableId('e', `blog-link-${p.slug}`), role: 'link', text: 'Read', actions: ['click'], attrs: { href: `/blog/${p.slug}` } },
            ]
          }),
        ],
      },
    ],
  })
}

function blogPostDoc(slug: string): SomDocument | null {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return null
  const cat = getCategory(post.category)
  const url = `${SITE_ORIGIN}/blog/${slug}`
  return withMeta({
    som_version: '1.0',
    url,
    title: post.title,
    lang: 'en',
    regions: [
      {
        id: stableId('r', `${url}#main`),
        role: 'main',
        elements: [
          { id: stableId('e', `${slug}-h1`), role: 'heading', text: post.title, attrs: { level: 1 } },
          { id: stableId('e', `${slug}-meta`), role: 'paragraph', text: `${post.date} · ${cat.label} · ${post.readingTime}` },
          { id: stableId('e', `${slug}-desc`), role: 'paragraph', text: post.description },
          ...post.tags.map((tag): SomElement => ({
            id: stableId('e', `${slug}-tag-${tag}`),
            role: 'generic',
            text: tag,
            attrs: { rel: 'tag' },
          })),
          { id: stableId('e', `${slug}-link-canonical`), role: 'link', text: 'Read the full article on somspec.org', actions: ['click'], attrs: { href: `/blog/${slug}` } },
        ],
      },
      {
        id: stableId('r', `${url}#related`),
        role: 'aside',
        elements: posts
          .filter((p) => p.slug !== slug)
          .slice(0, 4)
          .map((p): SomElement => ({
            id: stableId('e', `${slug}-rel-${p.slug}`),
            role: 'link',
            text: p.title,
            actions: ['click'],
            attrs: { href: `/blog/${p.slug}` },
          })),
      },
    ],
    meta: {
      notes: `Curated SOM for blog post "${post.title}". Full prose lives at the URL.`,
    },
  })
}

// ── Public API ───────────────────────────────────────────────────────────────

export function generateSomFor(pathname: string): SomDocument | null {
  const path = pathname.replace(/\/$/, '') || '/'

  if (path === '/' || path === '') return homeDoc()
  if (path === '/spec') return specDoc()
  if (path === '/directives') return directivesDoc()
  if (path === '/validate') return validateDoc()
  if (path === '/reference') return referenceDoc()
  if (path === '/blog') return blogIndexDoc()

  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/)
  if (blogMatch) return blogPostDoc(blogMatch[1])

  return null
}

// List of URLs we serve SOM for — used by /api/v1/som/sitemap
export function listSomUrls(): string[] {
  return [
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/spec`,
    `${SITE_ORIGIN}/directives`,
    `${SITE_ORIGIN}/validate`,
    `${SITE_ORIGIN}/reference`,
    `${SITE_ORIGIN}/blog`,
    ...posts.map((p) => `${SITE_ORIGIN}/blog/${p.slug}`),
  ]
}

// Normalize a request URL down to a same-origin path for lookup.
export function normalizeRequestUrl(input: string): string | null {
  try {
    let trimmed = input.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const u = new URL(trimmed)
      // Only serve SOM for our own domain
      if (u.host !== 'somspec.org' && u.host !== 'www.somspec.org') return null
      return u.pathname || '/'
    }
    if (trimmed.startsWith('/')) return trimmed
    return null
  } catch {
    return null
  }
}
