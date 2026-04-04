'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const mainLinks = [
  { href: '/spec', label: 'Specification' },
  { href: '/reference', label: 'Reference' },
  { href: '/directives', label: 'Directives' },
  { href: '/validate', label: 'Validate' },
]

const communityLinks = [
  { href: '/compliance', label: 'Compliance' },
  { href: '/publishers', label: 'Publishers' },
  { href: '/calculator', label: 'Calculator' },
]

const allMobileLinks = [
  ...mainLinks,
  ...communityLinks,
  { href: '/blog', label: 'Blog' },
  { href: '/changelog', label: 'Changelog' },
  { href: 'https://github.com/dbhurley/somspec', label: 'GitHub', external: true },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCommunityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl" aria-label="Main navigation">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="SOMspec home">
          <div className="w-8 h-8 rounded flex items-center justify-center border border-accent/30 group-hover:border-accent/60 transition-colors" style={{ background: 'rgba(138, 100, 32, 0.08)' }}>
            <span className="text-accent font-display font-semibold text-sm">S</span>
          </div>
          <span className="font-display text-text tracking-tight text-[15px]">
            SOM<span className="text-muted font-serif font-normal">spec</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-accent transition-colors font-serif"
            >
              {link.label}
            </Link>
          ))}

          {/* Community dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="text-sm text-muted hover:text-accent transition-colors font-serif flex items-center gap-1"
            >
              Community
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${communityOpen ? 'rotate-180' : ''}`}>
                <path d="M2 4l3 3 3-3" />
              </svg>
            </button>
            {communityOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-bg border border-border rounded-card shadow-lg py-2">
                {communityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setCommunityOpen(false)}
                    className="block px-4 py-1.5 text-sm text-muted hover:text-accent hover:bg-surface transition-colors font-serif"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="text-sm text-muted hover:text-accent transition-colors font-serif">
            Blog
          </Link>
          <Link href="/changelog" className="text-sm text-muted hover:text-accent transition-colors font-serif">
            Changelog
          </Link>
          <Link
            href="https://github.com/dbhurley/somspec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent transition-colors font-serif"
            aria-label="GitHub (opens in new tab)"
          >
            GitHub
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted hover:text-text"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {allMobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={'external' in link && link.external ? '_blank' : undefined}
                rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-accent transition-colors py-1 font-serif"
                aria-label={'external' in link && link.external ? `${link.label} (opens in new tab)` : link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
