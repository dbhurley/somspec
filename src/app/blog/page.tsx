import Link from 'next/link'
import { posts } from '@/data/posts'

export const metadata = {
  title: 'Writing — SOMspec',
  description: 'Analysis, research, and practical guides from the SOM community.',
}

export default function BlogIndex() {
  return (
    <section className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">
          Community Writing
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-text mb-4">
          Writing
        </h1>
        <p className="font-serif text-lg text-muted leading-body max-w-2xl mb-12">
          Analysis, research, and practical guides from the SOM community.
        </p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-surface border border-border rounded-card p-6 hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <time className="font-mono text-xs text-muted/60">{post.date}</time>
                <span className="text-muted/30">&middot;</span>
                <span className="font-mono text-xs text-muted/60">{post.readingTime}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-xl text-text group-hover:text-accent transition-colors mb-2">
                {post.title}
              </h2>
              <p className="font-serif text-sm text-muted leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
