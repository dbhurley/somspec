import Link from 'next/link'
import { Post, getCategory } from '@/data/posts'
import BlogSidebar from './BlogSidebar'
import CategoryDot from './CategoryDot'

interface Props {
  post: Post
  children: React.ReactNode
}

export default function BlogArticleLayout({ post, children }: Props) {
  const cat = getCategory(post.category)
  const url = `https://somspec.org/blog/${post.slug}`

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'SOMspec', url: 'https://somspec.org' },
    publisher: {
      '@type': 'Organization',
      name: 'Plasmate Labs',
      url: 'https://plasmate.app',
      sameAs: [
        'https://github.com/plasmate-labs/plasmate',
        'https://docs.plasmate.app',
        'https://www.w3.org/community/web-content-browser-ai/',
      ],
    },
    keywords: post.tags.join(', '),
    articleSection: cat.label,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  }

  return (
    <article className="min-h-screen py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-16">

          {/* Article column */}
          <div className="min-w-0">

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-block font-mono text-xs text-muted hover:text-accent transition-colors mb-10 animate-fade-in"
            >
              ← Writing
            </Link>

            {/* Header */}
            <header className="mb-12 animate-fade-in-delay-1">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2">
                  <CategoryDot category={cat} size={9} />
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: cat.color }}>
                    {cat.label}
                  </span>
                </span>
                <span className="text-muted/30" aria-hidden="true">·</span>
                <time className="font-mono text-xs text-muted/70">{post.date}</time>
                <span className="text-muted/30" aria-hidden="true">·</span>
                <span className="font-mono text-xs text-muted/70">{post.readingTime}</span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text leading-[1.1] mb-6">
                {post.title}
              </h1>

              <p className="font-serif text-lg text-muted leading-relaxed max-w-2xl">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-surface border border-border text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <hr className="hr-ornament mb-12" />

            {/* Body — children render here, wrapped in prose-som */}
            <div className="prose-som font-serif text-text/90 animate-fade-in-delay-2">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-10 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/blog"
                  className="font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  ← All writing
                </Link>
                <a
                  href={`https://github.com/dbhurley/somspec/edit/master/src/app/blog/${post.slug}/page.tsx`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  Suggest an edit on GitHub ↗
                </a>
              </div>
            </footer>
          </div>

          {/* Sidebar column */}
          <div className="lg:border-l lg:border-border lg:pl-12">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </article>
  )
}
