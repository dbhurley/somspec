'use client'

import { useState } from 'react'
import Link from 'next/link'

const models = [
  { name: 'GPT-4o', price: 0.0000025 },
  { name: 'GPT-4o Mini', price: 0.00000015 },
  { name: 'Claude Sonnet 4', price: 0.000003 },
  { name: 'Claude Opus', price: 0.000015 },
  { name: 'Gemini 2.5 Pro', price: 0.00000125 },
]

const ratios = [
  { label: 'Conservative 10×', value: 10 },
  { label: 'Average 17×', value: 17 },
  { label: 'Aggressive 40×', value: 40 },
]

function fmt(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
}

export default function CalculatorPage() {
  const [pagesPerDay, setPagesPerDay] = useState(10000)
  const [htmlTokens, setHtmlTokens] = useState(45000)
  const [ratioIdx, setRatioIdx] = useState(1)
  const [somOverride, setSomOverride] = useState<string>('')
  const [modelIdx, setModelIdx] = useState(2)

  const ratio = ratios[ratioIdx].value
  const somTokens = somOverride !== '' ? parseInt(somOverride) || 0 : Math.round(htmlTokens / ratio)
  const price = models[modelIdx].price

  const monthlyHtml = pagesPerDay * htmlTokens * 30 * price
  const monthlySom = pagesPerDay * somTokens * 30 * price
  const monthlySavings = monthlyHtml - monthlySom
  const annualSavings = monthlySavings * 12
  const barWidth = monthlyHtml > 0 ? Math.max((monthlySom / monthlyHtml) * 100, 2) : 100

  return (
    <div className="min-h-screen bg-bg pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent/60 mb-4">
            TOOLING
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-light text-text mb-4 leading-tight">
            Token Economics Calculator
          </h1>
          <p className="text-muted font-serif leading-body text-[15px] max-w-2xl">
            Calculate how much AI agent traffic is costing you — and how much SOM could save.
          </p>
        </div>

        <hr className="hr-ornament mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Inputs */}
          <div className="bg-surface border border-border rounded-card p-6">
            <h2 className="text-sm font-display text-text uppercase tracking-wider mb-6">Inputs</h2>
            <div className="space-y-5">
              <label className="block">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Pages served to AI agents / day</span>
                <input
                  type="number"
                  value={pagesPerDay}
                  onChange={(e) => setPagesPerDay(parseInt(e.target.value) || 0)}
                  className="mt-1.5 w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/50"
                />
              </label>

              <label className="block">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Average HTML tokens / page</span>
                <input
                  type="number"
                  value={htmlTokens}
                  onChange={(e) => setHtmlTokens(parseInt(e.target.value) || 0)}
                  className="mt-1.5 w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/50"
                />
              </label>

              <label className="block">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Compression ratio</span>
                <select
                  value={ratioIdx}
                  onChange={(e) => { setRatioIdx(parseInt(e.target.value)); setSomOverride('') }}
                  className="mt-1.5 w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/50"
                >
                  {ratios.map((r, i) => (
                    <option key={r.label} value={i}>{r.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">
                  Average SOM tokens / page
                  <span className="text-muted/40 ml-1">(auto-calculated, or override)</span>
                </span>
                <input
                  type="number"
                  value={somOverride !== '' ? somOverride : Math.round(htmlTokens / ratio)}
                  onChange={(e) => setSomOverride(e.target.value)}
                  className="mt-1.5 w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/50"
                />
              </label>

              <label className="block">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Model (token pricing)</span>
                <select
                  value={modelIdx}
                  onChange={(e) => setModelIdx(parseInt(e.target.value))}
                  className="mt-1.5 w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/50"
                >
                  {models.map((m, i) => (
                    <option key={m.name} value={i}>{m.name} — ${m.price}/token</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Output */}
          <div className="bg-surface border border-border rounded-card p-6 flex flex-col">
            <h2 className="text-sm font-display text-text uppercase tracking-wider mb-6">Results</h2>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Monthly HTML cost</span>
                <span className="font-mono text-sm text-text">{fmt(monthlyHtml)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Monthly SOM cost</span>
                <span className="font-mono text-sm text-text">{fmt(monthlySom)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Monthly savings</span>
                <span className="font-mono text-sm text-success font-medium">{fmt(monthlySavings)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">Annual savings</span>
                <span className="font-mono text-sm text-success font-medium">{fmt(annualSavings)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center">
                <span className="text-xs font-mono text-muted/60 uppercase tracking-wider block mb-2">You could save</span>
                <span className="text-3xl font-display font-light text-accent">{fmt(annualSavings)}<span className="text-lg text-muted/60">/year</span></span>
              </p>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-surface border border-border rounded-card p-6 mb-12">
          <h3 className="text-sm font-display text-text uppercase tracking-wider mb-4">Cost Comparison</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-muted/60 mb-1">
                <span>Current HTML cost</span>
                <span>{fmt(monthlyHtml)}/mo</span>
              </div>
              <div className="h-6 bg-[#8B1A1A]/15 rounded overflow-hidden">
                <div className="h-full bg-[#8B1A1A]/60 rounded" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-muted/60 mb-1">
                <span>With SOM</span>
                <span>{fmt(monthlySom)}/mo</span>
              </div>
              <div className="h-6 bg-success/10 rounded overflow-hidden">
                <div className="h-full bg-success/60 rounded transition-all duration-300" style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="space-y-3 text-xs text-muted/60 font-serif">
          <p>
            Token prices as of April 2026. SOM compression ratios from{' '}
            <Link href="https://webtaskbench.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">webtaskbench.com</Link>{' '}
            benchmark data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="https://somready.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono">
              Ready to capture these savings? → somready.com
            </Link>
            <Link href="https://dbhurley.com/papers" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono">
              See the research behind these numbers → dbhurley.com/papers
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
