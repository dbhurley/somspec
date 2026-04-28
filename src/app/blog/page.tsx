import { categories, getFeaturedPost, getPostsByCategory, posts } from '@/data/posts'
import FeaturedPostCard from '@/components/FeaturedPostCard'
import PostCard from '@/components/PostCard'
import BlogSidebar from '@/components/BlogSidebar'
import CategoryDot from '@/components/CategoryDot'

export const metadata = {
  title: 'Writing — SOMspec',
  description: 'Analysis, research, and practical guides on the Semantic Object Model, agent-native publishing, and the economics of AI web fetching. Updated as the field evolves.',
  alternates: {
    canonical: 'https://somspec.org/blog',
    types: {
      'application/feed+json': 'https://somspec.org/api/blog/feed.json',
    },
  },
}

export default function BlogIndex() {
  const featured = getFeaturedPost()
  const otherPosts = posts.filter((p) => p.slug !== featured.slug)

  // Group remaining posts by category, preserving the categories order
  const groupedSections = categories
    .map((cat) => ({
      category: cat,
      posts: otherPosts
        .filter((p) => p.category === cat.slug)
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .filter((section) => section.posts.length > 0)

  // Schema for the blog index page
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SOMspec Writing',
    description: metadata.description,
    url: 'https://somspec.org/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Plasmate Labs',
      url: 'https://plasmate.app',
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://somspec.org/blog/${post.slug}`,
      keywords: post.tags.join(', '),
    })),
  }

  return (
    <section className="min-h-screen pt-12 pb-24 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero — page title; the Featured card overlaps it visually */}
      <div className="relative pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl animate-fade-in">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent/70 block mb-4">
              The SOMspec Journal
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-text leading-[1.05] mb-5">
              Writing
            </h1>
            <p className="font-serif text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
              Analysis, research, and practical guides on the Semantic Object Model, agent-native publishing, and the economics of AI web fetching. Updated as the field evolves.
            </p>
          </div>
        </div>
      </div>

      {/* Featured + sidebar (sidebar pushed below featured on mobile) */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-16">

          {/* Main column */}
          <div className="min-w-0">

            {/* Featured */}
            <div className="-mt-4 mb-16">
              <FeaturedPostCard post={featured} />
            </div>

            {/* Category sections */}
            <div className="space-y-20">
              {groupedSections.map((section, sectionIdx) => (
                <section
                  key={section.category.slug}
                  id={`cat-${section.category.slug}`}
                  className="scroll-mt-24"
                  aria-labelledby={`cat-${section.category.slug}-heading`}
                >
                  <header className="flex items-baseline justify-between gap-4 mb-7">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <CategoryDot category={section.category} size={10} />
                        <h2
                          id={`cat-${section.category.slug}-heading`}
                          className="font-display text-2xl text-text"
                          style={{ color: section.category.color }}
                        >
                          {section.category.label}
                        </h2>
                      </div>
                      <p className="font-serif text-sm text-muted leading-relaxed max-w-xl">
                        {section.category.description}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted/60 tracking-wide uppercase whitespace-nowrap">
                      {section.posts.length} {section.posts.length === 1 ? 'piece' : 'pieces'}
                    </span>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {section.posts.map((post, idx) => (
                      <PostCard
                        key={post.slug}
                        post={post}
                        index={sectionIdx + idx}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-24 pt-10 border-t border-border">
              <p className="font-serif text-sm text-muted leading-relaxed">
                Subscribe via{' '}
                <a
                  href="/api/blog/feed.json"
                  className="text-accent hover:text-text transition-colors underline decoration-accent/30 underline-offset-4"
                >
                  JSON Feed
                </a>
                {' '}or{' '}
                <a
                  href="/sitemap.xml"
                  className="text-accent hover:text-text transition-colors underline decoration-accent/30 underline-offset-4"
                >
                  XML sitemap
                </a>
                . Agents can also fetch{' '}
                <a
                  href="/llms.txt"
                  className="text-accent hover:text-text transition-colors underline decoration-accent/30 underline-offset-4"
                >
                  llms.txt
                </a>
                {' '}for a structured site index.
              </p>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="lg:border-l lg:border-border lg:pl-12">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  )
}
