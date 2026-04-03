import Link from 'next/link'

const footerLinks = [
  { href: '/spec', label: 'Specification' },
  { href: '/reference', label: 'Reference' },
  { href: '/directives', label: 'Directives' },
  { href: '/validate', label: 'Validate' },
  { href: '/changelog', label: 'Changelog' },
  { href: 'https://github.com/nicholasgriffintn/som-spec', label: 'Spec on GitHub', external: true },
  { href: 'https://plasmate.app', label: 'plasmate.app', external: true },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center border border-accent/20" style={{ background: 'rgba(138, 100, 32, 0.06)' }}>
              <span className="text-accent font-display font-semibold text-[10px]">S</span>
            </div>
            <span className="text-sm text-muted font-display">SOMspec</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-muted hover:text-accent transition-colors font-serif"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <hr className="my-8 border-border" />

        <p className="text-sm text-muted text-center font-serif">
          SOM is an open standard. Apache 2.0 licensed. Contributions welcome.
        </p>
      </div>
    </footer>
  )
}
