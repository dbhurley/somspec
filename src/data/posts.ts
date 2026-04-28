export interface Post {
  slug:        string
  title:       string
  date:        string   // ISO 8601
  description: string
  readingTime: string   // e.g. "6 min read"
  tags:        string[]
  category:    CategorySlug
  featured?:   boolean  // exactly one post should be featured at a time
}

export type CategorySlug =
  | 'specification'
  | 'benchmarks'
  | 'compliance'
  | 'publishers'
  | 'industry'

export interface Category {
  slug:        CategorySlug
  label:       string
  description: string
  color:       string   // hex — used as colored dot + accent
}

export const categories: Category[] = [
  {
    slug:        'specification',
    label:       'Specification',
    description: 'SOM/1.0 format mechanics, schema design, conformance.',
    color:       '#8A6420',  // gold (matches accent)
  },
  {
    slug:        'benchmarks',
    label:       'Benchmarks',
    description: 'Empirical token efficiency data from WebTaskBench and the field.',
    color:       '#1A6B3A',  // forest green
  },
  {
    slug:        'compliance',
    label:       'Compliance',
    description: 'robots.txt SOM Directives, agent discovery, framework adoption.',
    color:       '#2B5EA7',  // deep blue
  },
  {
    slug:        'publishers',
    label:       'Publishers',
    description: 'Adoption guidance, publisher economics, implementation patterns.',
    color:       '#7A3E12',  // rust
  },
  {
    slug:        'industry',
    label:       'Industry',
    description: 'Standards landscape, regulation, and the agent-native web.',
    color:       '#8B1A1A',  // maroon
  },
]

export function getCategory(slug: CategorySlug): Category {
  const c = categories.find((c) => c.slug === slug)
  if (!c) throw new Error(`Unknown category: ${slug}`)
  return c
}

export const posts: Post[] = [
  {
    slug:        'som-vs-llms-txt',
    title:       'SOM vs llms.txt: When to Use Which',
    date:        '2026-04-27',
    description: 'llms.txt tells an agent what your site is. SOM tells an agent what your page contains. They are different layers of the same problem, and publishers should ship both.',
    readingTime: '7 min read',
    tags:        ['llms.txt', 'Specification', 'Publishers', 'Comparison'],
    category:    'industry',
    featured:    true,
  },
  {
    slug:        'techcrunch-was-blocked',
    title:       'TechCrunch Was Blocked. Now It\'s 77×. What Changed?',
    date:        '2026-04-04',
    description: 'Plasmate v0.5.0 fixed something important: major news sites blocked by anti-bot protection now fetch cleanly. TechCrunch went from the failure list to 77× compression — the highest in the news vertical.',
    readingTime: '5 min read',
    tags:        ['Benchmarks', 'v0.5.0', 'News & Media'],
    category:    'benchmarks',
  },
  {
    slug:        'the-discovery-gap',
    title:       'The Discovery Gap: Why AI Agents Miss Your SOM Directives',
    date:        '2026-04-04',
    description: 'Even when publishers correctly implement SOM Directives, most AI agents never find them. The research explains why — and what framework authors can do about it.',
    readingTime: '6 min read',
    tags:        ['Research', 'Compliance', 'robots.txt'],
    category:    'compliance',
  },
  {
    slug:        'the-publishers-third-option',
    title:       'The Publisher\'s Third Option',
    date:        '2026-04-04',
    description: 'Publishers face a binary: block AI agents or serve them raw HTML at full cost. The robots.txt SOM Directives proposal offers a third path — cooperative, economically rational, and five minutes to implement.',
    readingTime: '5 min read',
    tags:        ['Publishers', 'robots.txt', 'Economics'],
    category:    'publishers',
  },
  {
    slug:        'reading-the-leaderboard',
    title:       'How to Read the WebTaskBench Leaderboard',
    date:        '2026-04-04',
    description: 'What does a 43× compression ratio actually mean for an AI agent? A practical guide to interpreting token efficiency data and why it matters for your publishing economics.',
    readingTime: '4 min read',
    tags:        ['Benchmarks', 'Token Economics', 'Guide'],
    category:    'benchmarks',
  },
]

export function getPostsByCategory(slug: CategorySlug): Post[] {
  return posts.filter((p) => p.category === slug)
}

export function getFeaturedPost(): Post {
  return posts.find((p) => p.featured) ?? posts[0]
}

export function getRecentPosts(limit = 5): Post[] {
  return [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

// Aggregate of all tags across posts, sorted by frequency descending.
export function getPopularTags(limit = 10): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
