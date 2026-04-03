'use client'

import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/spec', label: 'Specification' },
  { href: '/reference', label: 'Reference' },
  { href: '/directives', label: 'Directives' },
  { href: '/validate', label: 'Validate' },
  { href: '/changelog', label: 'Changelog' },
  { href: 'https://github.com/dbhurley/somspec', label: 'GitHub', external: true },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-sm text-muted hover:text-accent transition-colors font-serif"
              aria-label={link.external ? `${link.label} (opens in new tab)` : link.label}
            >
              {link.label}
            </Link>
          ))}
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-accent transition-colors py-1 font-serif"
                aria-label={link.external ? `${link.label} (opens in new tab)` : link.label}
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
