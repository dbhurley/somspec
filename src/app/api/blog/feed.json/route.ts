import { posts, categories, getCategory } from '@/data/posts'

export const dynamic = 'force-static'

const SITE_URL = 'https://somspec.org'
const FEED_URL = `${SITE_URL}/api/blog/feed.json`

// JSON Feed 1.1 — https://www.jsonfeed.org/version/1.1/
export async function GET() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'SOMspec Writing',
    home_page_url: `${SITE_URL}/blog`,
    feed_url: FEED_URL,
    description:
      'Analysis, research, and practical guides on the Semantic Object Model, agent-native publishing, and the economics of AI web fetching. Updated as the field evolves.',
    icon: `${SITE_URL}/og-image.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    language: 'en-US',
    authors: [
      {
        name: 'SOMspec',
        url: SITE_URL,
      },
    ],
    _categories: categories.map((c) => ({
      slug: c.slug,
      label: c.label,
      description: c.description,
      color: c.color,
    })),
    items: sorted.map((post) => {
      const cat = getCategory(post.category)
      const url = `${SITE_URL}/blog/${post.slug}`

      // Minimal HTML rendering of the post for content_html — full content lives at the URL.
      // We include the description as the article-level summary; agents wanting the full body
      // should fetch the URL or the SOM endpoint advertised in robots.txt.
      const contentHtml = `
        <p>${escapeHtml(post.description)}</p>
        <p><strong>Category:</strong> ${escapeHtml(cat.label)}.</p>
        <p><strong>Tags:</strong> ${post.tags.map(escapeHtml).join(', ')}.</p>
        <p><a href="${url}">Read the full article on somspec.org</a>.</p>
      `.trim()

      return {
        id: url,
        url,
        title: post.title,
        summary: post.description,
        content_html: contentHtml,
        date_published: `${post.date}T00:00:00Z`,
        date_modified: `${post.date}T00:00:00Z`,
        tags: [cat.label, ...post.tags],
        authors: [{ name: 'SOMspec', url: SITE_URL }],
        language: 'en-US',
        _meta: {
          category: {
            slug: cat.slug,
            label: cat.label,
            color: cat.color,
          },
          reading_time: post.readingTime,
          featured: post.featured ?? false,
        },
      }
    }),
  }

  return Response.json(feed, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
