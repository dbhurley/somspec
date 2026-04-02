import Link from 'next/link'

const footerLinks = [
  { href: 'https://github.com/plasmate-labs/plasmate', label: 'Spec on GitHub', external: true },
  { href: 'https://plasmate.app', label: 'plasmate.app', external: true },
  { href: '/changelog', label: 'Changelog' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center border border-accent/30">
              <span className="text-accent font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-muted">SOMspec</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted">
            SOM is an open standard. Apache 2.0 licensed. Contributions welcome.
          </p>
        </div>
      </div>
    </footer>
  )
}
