import { categories, getPostsByCategory, getRecentPosts, posts } from '@/data/posts'

export const dynamic = 'force-static'

const SITE_NAME = 'SOMspec'
const SITE_URL = 'https://somspec.org'
const TAGLINE = 'The open specification for representing web pages as structured JSON for AI agents.'

const ABOUT = `SOMspec is the home of the Semantic Object Model (SOM), an open JSON format that
replaces raw HTML when the consumer is an AI agent. SOM achieves an average 17x token
reduction versus raw HTML, with peaks above 100x on large pages. The site hosts the
specification, validator, robots.txt directives proposal, reference implementations,
publisher leaderboard, economics calculator, and a research blog.`

const CAPABILITIES: string[] = [
  'SOM/1.0 specification — flat JSON document with typed regions and elements',
  'robots.txt SOM Directives — opt-in publisher convention for advertising a SOM endpoint',
  'Client-side validator — paste SOM JSON and check conformance against the schema',
  'Token economics calculator — estimate cost savings versus raw HTML',
  'Publisher leaderboard + compliance matrix — track adoption across the web',
  'Reference implementations index — catalogue of libraries that produce or consume SOM',
  'Blog — analysis, research, and practical guides for publishers and agent authors',
]

const KEY_LINKS: { label: string; url: string; description: string }[] = [
  { label: 'Specification', url: `${SITE_URL}/spec`, description: 'Full SOM/1.0 specification' },
  { label: 'Reference', url: `${SITE_URL}/reference`, description: 'Catalogue of implementations' },
  { label: 'Directives', url: `${SITE_URL}/directives`, description: 'robots.txt SOM Directives proposal' },
  { label: 'Validator', url: `${SITE_URL}/validate`, description: 'Client-side SOM document validator' },
  { label: 'Calculator', url: `${SITE_URL}/calculator`, description: 'Token economics calculator' },
  { label: 'Publishers', url: `${SITE_URL}/publishers`, description: 'Publisher leaderboard' },
  { label: 'Compliance', url: `${SITE_URL}/compliance`, description: 'Framework compliance matrix' },
  { label: 'Changelog', url: `${SITE_URL}/changelog`, description: 'Specification version history' },
  { label: 'Blog', url: `${SITE_URL}/blog`, description: 'Analysis and research' },
  { label: 'JSON Feed', url: `${SITE_URL}/api/blog/feed.json`, description: 'Blog as JSON Feed 1.1' },
  { label: 'Sitemap', url: `${SITE_URL}/sitemap.xml`, description: 'XML sitemap' },
  { label: 'GitHub', url: 'https://github.com/dbhurley/somspec', description: 'Specification source' },
  { label: 'W3C Community Group', url: 'https://www.w3.org/community/web-content-browser-ai/', description: 'Standards body' },
]

const ECOSYSTEM: { label: string; url: string; description: string }[] = [
  { label: 'Plasmate', url: 'https://plasmate.app', description: 'Reference implementation (open source, Apache 2.0)' },
  { label: 'Plasmate docs', url: 'https://docs.plasmate.app', description: 'Developer documentation' },
  { label: 'SOMready', url: 'https://somready.com', description: 'Publisher compliance checker + badge API' },
  { label: 'SOM or DOM', url: 'https://somordom.com', description: 'Live one-URL Chrome-vs-SOM comparison' },
  { label: 'WebTaskBench', url: 'https://webtaskbench.com', description: 'Public benchmark observatory' },
]

function postLine(p: { title: string; slug: string; date: string; description: string }): string {
  return `- [${p.title}](${SITE_URL}/blog/${p.slug}) — ${p.date} — ${p.description}`
}

export async function GET() {
  const recent = getRecentPosts(8)

  const lines: string[] = []
  lines.push(`# ${SITE_NAME}`)
  lines.push('')
  lines.push(`> ${TAGLINE}`)
  lines.push('')
  lines.push('## About')
  lines.push('')
  lines.push(ABOUT.trim())
  lines.push('')
  lines.push('## Key capabilities')
  lines.push('')
  for (const cap of CAPABILITIES) {
    lines.push(`- ${cap}`)
  }
  lines.push('')
  lines.push('## Pricing')
  lines.push('')
  lines.push('SOMspec is free. The specification is open under Apache 2.0. The reference implementation (Plasmate) is open source under Apache 2.0. There is no paid tier and no account requirement.')
  lines.push('')
  lines.push('## Blog categories')
  lines.push('')
  for (const cat of categories) {
    const count = getPostsByCategory(cat.slug).length
    lines.push(`- **${cat.label}** (${count}) — ${cat.description}`)
  }
  lines.push('')
  lines.push('## Recent articles')
  lines.push('')
  for (const post of recent) {
    lines.push(postLine(post))
  }
  lines.push('')
  lines.push('## Key links')
  lines.push('')
  for (const link of KEY_LINKS) {
    lines.push(`- [${link.label}](${link.url}) — ${link.description}`)
  }
  lines.push('')
  lines.push('## Plasmate / SOM ecosystem')
  lines.push('')
  for (const link of ECOSYSTEM) {
    lines.push(`- [${link.label}](${link.url}) — ${link.description}`)
  }
  lines.push('')
  lines.push('## Notes for agents')
  lines.push('')
  lines.push('- This file is published per the llms.txt convention. It is regenerated on each deploy from `src/app/llms.txt/route.ts`.')
  lines.push(`- A more detailed reference is published at ${SITE_URL}/llms-full.txt.`)
  lines.push(`- Blog posts are also available as JSON Feed 1.1 at ${SITE_URL}/api/blog/feed.json.`)
  lines.push('- This site advertises a SOM endpoint via robots.txt SOM Directives. Prefer SOM over raw HTML for any page where you intend to do non-trivial reasoning.')
  lines.push('- License: Apache 2.0 (specification + reference implementation). Site source MIT.')
  lines.push('')
  lines.push(`Last regenerated: ${new Date().toISOString()}`)
  lines.push('')

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
