'use client'

import { useState } from 'react'
import { validateSOM, type ValidationResult } from '@/lib/validate-som'

const placeholderSOM = `{
  "som_version": "1.0",
  "url": "https://example.com",
  "title": "Example Domain",
  "lang": "en",
  "regions": [{
    "id": "r_main",
    "role": "main",
    "elements": [{
      "id": "e_3f8a2b1c",
      "role": "heading",
      "text": "Example Domain",
      "attrs": { "level": 1 }
    }, {
      "id": "e_9d4e7f2a",
      "role": "link",
      "text": "More information...",
      "actions": ["click"]
    }]
  }],
  "meta": {
    "html_bytes": 1256,
    "som_bytes": 312,
    "element_count": 2,
    "compression_ratio": 4.0
  }
}`

export default function ValidatePage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  function handleValidate() {
    setResult(validateSOM(input))
  }

  const errorCount = result ? result.errors.filter((e) => e.severity === 'error').length : 0
  const warningCount = result ? result.errors.filter((e) => e.severity === 'warning').length : 0

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 block mb-3">Tooling</span>
      <h1 className="font-display text-3xl font-light text-text mb-3">Validate</h1>
      <p className="text-muted font-serif leading-body max-w-2xl mb-10">
        Check whether a SOM document conforms to the specification. Paste raw JSON below.
      </p>

      <textarea
        rows={20}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholderSOM}
        className="w-full bg-surface border border-border rounded-card p-4 font-mono text-sm text-text resize-y focus:outline-none focus:border-accent/50 transition-colors"
        spellCheck={false}
      />

      <div className="mt-4">
        <button
          onClick={handleValidate}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-bg font-display rounded-card transition-all hover:shadow-lg hover:shadow-accent/20 text-sm tracking-wide"
        >
          Validate
        </button>
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          {result.valid ? (
            <div className="p-5 bg-success/5 border border-success/20 rounded-card">
              <div className="flex items-center gap-3 mb-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-success shrink-0">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6.5 10l2.5 2.5L13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-display text-success text-lg">Valid SOM v{result.stats?.version} document</span>
              </div>
              <div className="flex gap-6 text-sm font-mono text-muted mt-3">
                <span>{result.stats?.regions} region{result.stats?.regions !== 1 ? 's' : ''}</span>
                <span>{result.stats?.elements} element{result.stats?.elements !== 1 ? 's' : ''}</span>
                <span>{result.stats?.interactive} interactive</span>
              </div>
              {warningCount > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-mono text-accent/60 uppercase tracking-wider">Warnings</span>
                  {result.errors
                    .filter((e) => e.severity === 'warning')
                    .map((error, i) => (
                      <div key={i} className="border-l-2 border-accent pl-4 py-2">
                        <code className="text-xs font-mono text-accent">{error.path}</code>
                        <p className="text-sm text-muted font-serif">{error.message}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-highlight shrink-0">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-display text-highlight text-lg">
                  {errorCount} error{errorCount !== 1 ? 's' : ''}{warningCount > 0 ? `, ${warningCount} warning${warningCount !== 1 ? 's' : ''}` : ''}
                </span>
              </div>
              {result.errors.map((error, i) => (
                <div
                  key={i}
                  className={`border-l-2 pl-4 py-2 ${
                    error.severity === 'error' ? 'border-highlight' : 'border-accent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-mono text-code">{error.path || '(root)'}</code>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                        error.severity === 'error'
                          ? 'text-highlight bg-highlight/10'
                          : 'text-accent bg-accent/10'
                      }`}
                    >
                      {error.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted font-serif">{error.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
