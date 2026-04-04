export interface Post {
  slug:        string
  title:       string
  date:        string   // ISO 8601
  description: string
  readingTime: string   // e.g. "6 min read"
  tags:        string[]
}

export const posts: Post[] = [
  {
    slug:        'the-discovery-gap',
    title:       'The Discovery Gap: Why AI Agents Miss Your SOM Directives',
    date:        '2026-04-04',
    description: 'Even when publishers correctly implement SOM Directives, most AI agents never find them. The research explains why — and what framework authors can do about it.',
    readingTime: '6 min read',
    tags:        ['Research', 'Compliance', 'robots.txt'],
  },
  {
    slug:        'the-publishers-third-option',
    title:       'The Publisher\'s Third Option',
    date:        '2026-04-04',
    description: 'Publishers face a binary: block AI agents or serve them raw HTML at full cost. The robots.txt SOM Directives proposal offers a third path — cooperative, economically rational, and five minutes to implement.',
    readingTime: '5 min read',
    tags:        ['Publishers', 'robots.txt', 'Economics'],
  },
  {
    slug:        'reading-the-leaderboard',
    title:       'How to Read the WebTaskBench Leaderboard',
    date:        '2026-04-04',
    description: 'What does a 43x compression ratio actually mean for an AI agent? A practical guide to interpreting token efficiency data and why it matters for your publishing economics.',
    readingTime: '4 min read',
    tags:        ['Benchmarks', 'Token Economics', 'Guide'],
  },
]
