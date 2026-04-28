import Link from 'next/link'
import { Post, getCategory } from '@/data/posts'
import CategoryDot from './CategoryDot'

interface Props {
  post: Post
}

export default function FeaturedPostCard({ post }: Props) {
  const cat = getCategory(post.category)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="featured-card group block animate-fade-in"
      aria-label={`Featured: ${post.title}`}
    >
      <article
        className="relative overflow-hidden rounded-card border border-[#2a1a08] bg-[#1A1209] text-[#F2EDE3] px-8 py-10 md:px-14 md:py-16 transition-all duration-500 group-hover:border-[color:var(--card-accent)] group-hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
        style={{ '--card-accent': cat.color } as React.CSSProperties}
      >
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
          style={{ background: cat.color }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A09070]">
              Featured
            </span>
            <span className="text-[#3a2c18]" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <CategoryDot category={cat} size={8} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: cat.color }}>
                {cat.label}
              </span>
            </div>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6 transition-colors duration-500 group-hover:text-[color:var(--card-accent)]">
            {post.title}
          </h2>

          <p className="font-serif text-base md:text-lg text-[#C8BDA8] leading-relaxed mb-8 max-w-2xl">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span
              className="font-mono text-xs tracking-wide uppercase transition-all duration-300 group-hover:translate-x-1"
              style={{ color: cat.color }}
            >
              Read the article →
            </span>
            <span className="text-[#3a2c18]" aria-hidden="true">·</span>
            <time className="font-mono text-xs text-[#9a8e74]">{post.date}</time>
            <span className="text-[#3a2c18]" aria-hidden="true">·</span>
            <span className="font-mono text-xs text-[#9a8e74]">{post.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
