const rows = [
  {
    feature: 'Token overhead',
    note: 'Relative to content density',
    html: { text: 'High', sentiment: 'neg' },
    markdown: { text: 'Moderate', sentiment: 'neutral' },
    a11y: { text: 'Moderate', sentiment: 'neutral' },
    som: { text: 'Minimal', sentiment: 'pos' },
  },
  {
    feature: 'Structural typing',
    note: 'Typed element roles and semantic regions',
    html: { text: 'None', sentiment: 'neg' },
    markdown: { text: 'None', sentiment: 'neg' },
    a11y: { text: 'Partial', sentiment: 'neutral' },
    som: { text: 'Complete', sentiment: 'pos' },
  },
  {
    feature: 'Interactivity preserved',
    note: 'Clickable, typeable, scrollable elements',
    html: { text: 'Raw attributes', sentiment: 'neutral' },
    markdown: { text: 'Not preserved', sentiment: 'neg' },
    a11y: { text: 'Present', sentiment: 'neutral' },
    som: { text: 'Typed with actions', sentiment: 'pos' },
  },
  {
    feature: 'Stable element IDs',
    note: 'Reproducible across independent fetches',
    html: { text: 'None', sentiment: 'neg' },
    markdown: { text: 'None', sentiment: 'neg' },
    a11y: { text: 'None', sentiment: 'neg' },
    som: { text: 'SHA-256 derived', sentiment: 'pos' },
  },
  {
    feature: 'Publisher-servable',
    note: 'Cacheable as an alternate representation',
    html: { text: 'Yes', sentiment: 'neutral' },
    markdown: { text: 'Yes', sentiment: 'neutral' },
    a11y: { text: 'No', sentiment: 'neg' },
    som: { text: 'Yes', sentiment: 'neutral' },
  },
  {
    feature: 'Approx. tokens per page',
    note: 'Median across 51 representative sites',
    html: { text: '~80,000', sentiment: 'neg' },
    markdown: { text: '~12,000', sentiment: 'neutral' },
    a11y: { text: '~8,000', sentiment: 'neutral' },
    som: { text: '~4,600', sentiment: 'pos' },
  },
]

const formats = ['html', 'markdown', 'a11y', 'som'] as const
const formatLabels: Record<string, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  a11y: 'A11y Tree',
  som: 'SOM',
}

type Sentiment = 'pos' | 'neg' | 'neutral'

function cellClass(sentiment: Sentiment, isSom: boolean): string {
  if (isSom) {
    return sentiment === 'pos' ? 'text-success font-medium' : 'text-text font-medium'
  }
  if (sentiment === 'neg') return 'text-muted/50'
  if (sentiment === 'neutral') return 'text-muted'
  return 'text-text'
}

export default function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse" style={{ borderSpacing: 0 }}>
        <thead>
          <tr style={{ borderTop: '1px solid rgba(199,168,83,0.25)', borderBottom: '1px solid rgba(199,168,83,0.25)' }}>
            <th className="py-3 pr-6 text-left font-display font-medium text-text text-xs uppercase tracking-widest w-48">
              Property
            </th>
            {formats.map((f) => (
              <th
                key={f}
                className={`py-3 px-4 text-left font-display font-medium text-xs uppercase tracking-widest ${
                  f === 'som' ? 'text-accent' : 'text-muted/60'
                }`}
              >
                {formatLabels[f]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.feature}
              style={{
                borderBottom: i < rows.length - 1 ? '1px solid rgba(199,168,83,0.06)' : 'none',
              }}
            >
              <td className="py-4 pr-6 align-top">
                <span className="font-serif text-text block leading-snug">{row.feature}</span>
                <span className="font-mono text-[10px] text-muted/40 block mt-0.5 leading-tight">{row.note}</span>
              </td>
              {formats.map((f) => {
                const cell = row[f]
                const isSom = f === 'som'
                return (
                  <td
                    key={f}
                    className={`py-4 px-4 align-top font-serif leading-snug ${
                      isSom ? 'bg-accent/[0.025]' : ''
                    }`}
                  >
                    <span className={cellClass(cell.sentiment as Sentiment, isSom)}>
                      {cell.text}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '1px solid rgba(199,168,83,0.25)' }}>
            <td colSpan={5} className="pt-3 pb-0 font-mono text-[10px] text-muted/40 leading-relaxed">
              Token estimates derived from the Plasmate benchmark suite (51 sites, April 2026).
              A11y Tree figures represent Playwright accessibility snapshot output.
              SOM figures represent <code className="font-mono">plasmate fetch</code> output without selector filtering.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
