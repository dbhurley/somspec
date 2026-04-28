import Link from 'next/link'
import { Post, getCategory } from '@/data/posts'
import CategoryDot from './CategoryDot'

interface Props {
  post: Post
  /** Stagger index for fade-in animation. */
  index?: number
}

// Pre-built map so Tailwind / our raw CSS classes are statically discoverable.
const DELAY_CLASS = [
  'animate-fade-in',
  'animate-fade-in-delay-1',
  'animate-fade-in-delay-2',
  'animate-fade-in-delay-3',
  'animate-fade-in-delay-4',
  'animate-fade-in-delay-5',
] as const

export default function PostCard({ post, index = 0 }: Props) {
  const cat = getCategory(post.category)
  const delayClass = DELAY_CLASS[Math.min(index, DELAY_CLASS.length - 1)]

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`post-card group block ${delayClass}`}
      style={{ '--card-accent': cat.color } as React.CSSProperties}
    >
      <article className="relative h-full bg-surface border border-border rounded-card p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_-8px_rgba(28,18,9,0.18)] group-hover:border-[color:var(--card-accent)]">
        <div className="flex items-center gap-2 mb-4">
          <CategoryDot category={cat} size={9} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: cat.color }}>
            {cat.label}
          </span>
        </div>

        <h2 className="font-display text-xl text-text leading-snug transition-colors duration-300 group-hover:text-[color:var(--card-accent)] mb-3">
          {post.title}
        </h2>

        <p className="font-serif text-sm text-muted leading-relaxed mb-5 line-clamp-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted/70">
            <time>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
          <span
            aria-hidden="true"
            className="font-mono text-xs text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--card-accent)]"
          >
            Read →
          </span>
        </div>
      </article>
    </Link>
  )
}
