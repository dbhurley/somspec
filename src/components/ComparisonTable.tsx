const rows = [
  {
    feature: 'Token efficient',
    html: { icon: 'x', text: 'Bloated' },
    markdown: { icon: 'check', text: 'Small' },
    a11y: { icon: 'warn', text: 'Varies' },
    som: { icon: 'check', text: 'Compact' },
  },
  {
    feature: 'Structurally typed',
    html: { icon: 'x', text: '' },
    markdown: { icon: 'x', text: '' },
    a11y: { icon: 'warn', text: 'Partial' },
    som: { icon: 'check', text: '' },
  },
  {
    feature: 'Interactive elements',
    html: { icon: 'warn', text: 'Raw attrs' },
    markdown: { icon: 'x', text: 'Lost' },
    a11y: { icon: 'check', text: '' },
    som: { icon: 'check', text: 'With actions' },
  },
  {
    feature: 'Stable element IDs',
    html: { icon: 'x', text: '' },
    markdown: { icon: 'x', text: '' },
    a11y: { icon: 'x', text: '' },
    som: { icon: 'check', text: 'SHA-256' },
  },
  {
    feature: 'Agent latency',
    html: { icon: 'slow', text: 'Slowest' },
    markdown: { icon: 'slow', text: 'Slow' },
    a11y: { icon: 'fast', text: 'Fast' },
    som: { icon: 'fast', text: 'Fastest' },
  },
  {
    feature: 'Publisher-servable',
    html: { icon: 'check', text: '' },
    markdown: { icon: 'check', text: '' },
    a11y: { icon: 'x', text: '' },
    som: { icon: 'check', text: '' },
  },
]

const formats = ['html', 'markdown', 'a11y', 'som'] as const
const formatLabels: Record<string, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  a11y: 'A11y Tree',
  som: 'SOM',
}

function CellContent({ icon, text, isSom }: { icon: string; text: string; isSom: boolean }) {
  const iconEl = (() => {
    switch (icon) {
      case 'check':
        return <span className="text-success text-base">&#10003;</span>
      case 'x':
        return <span className="text-highlight/70 text-base">&#10007;</span>
      case 'warn':
        return <span className="text-accent text-base">&#9888;</span>
      case 'slow':
        return <span className="text-base opacity-60">&#128034;</span>
      case 'fast':
        return <span className="text-base">&#9889;</span>
      default:
        return null
    }
  })()

  return (
    <div className="flex items-center gap-2">
      {iconEl}
      {text && <span className={`text-xs ${isSom ? 'text-text' : 'text-muted'}`}>{text}</span>}
    </div>
  )
}

export default function ComparisonTable() {
  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <div key={row.feature} className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Feature label */}
          <div className="col-span-2 md:col-span-1 flex items-center">
            <span className="text-sm font-display text-text">{row.feature}</span>
          </div>

          {/* Format cards */}
          {formats.map((format) => {
            const cell = row[format]
            const isSom = format === 'som'
            const isWin = cell.icon === 'check' || cell.icon === 'fast'
            const isLose = cell.icon === 'x' || cell.icon === 'slow'

            return (
              <div
                key={format}
                className={`px-4 py-3 rounded-card border transition-colors ${
                  isSom
                    ? 'bg-accent/[0.04] border-accent/20'
                    : isWin
                    ? 'bg-surface border-success/15'
                    : isLose
                    ? 'bg-surface border-highlight/10'
                    : 'bg-surface border-border'
                }`}
                style={
                  isSom && isWin
                    ? { borderLeftWidth: '3px', borderLeftColor: 'rgba(82, 183, 136, 0.4)' }
                    : isLose
                    ? { borderLeftWidth: '3px', borderLeftColor: 'rgba(230, 57, 70, 0.2)' }
                    : isWin
                    ? { borderLeftWidth: '3px', borderLeftColor: 'rgba(82, 183, 136, 0.2)' }
                    : {}
                }
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted/50 block mb-1.5">
                  {formatLabels[format]}
                </span>
                <CellContent icon={cell.icon} text={cell.text} isSom={isSom} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
