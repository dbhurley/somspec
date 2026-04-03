import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Validate SOM Document',
  description: 'Check whether a SOM document conforms to the v1.0 specification. Paste JSON and get instant validation with detailed error reporting.',
  alternates: { canonical: '/validate' },
}

export default function ValidateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
