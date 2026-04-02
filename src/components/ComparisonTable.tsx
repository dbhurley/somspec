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
    html: { icon: 'warn', text: 'Raw attributes' },
    markdown: { icon: 'x', text: 'Lost' },
    a11y: { icon: 'check', text: '' },
    som: { icon: 'check', text: 'With actions' },
  },
  {
    feature: 'Stable element IDs',
    html: { icon: 'x', text: '' },
    markdown: { icon: 'x', text: '' },
    a11y: { icon: 'x', text: '' },
    som: { icon: 'check', text: 'SHA-256 stable' },
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

function CellIcon({ type }: { type: string }) {
  switch (type) {
    case 'check':
      return <span className="text-green text-lg">&#10003;</span>
    case 'x':
      return <span className="text-red-400 text-lg">&#10007;</span>
    case 'warn':
      return <span className="text-yellow-400 text-lg">&#9888;</span>
    case 'slow':
      return <span className="text-lg">&#128034;</span>
    case 'fast':
      return <span className="text-lg">&#9889;</span>
    default:
      return null
  }
}

export default function ComparisonTable() {
  const headers = ['', 'HTML', 'Markdown', 'Accessibility Tree', 'SOM']

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h, i) => (
              <th
                key={h || i}
                className={`py-3 px-4 text-left font-medium ${
                  i === headers.length - 1
                    ? 'text-accent'
                    : i === 0
                    ? 'text-text'
                    : 'text-muted'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
              <td className="py-3.5 px-4 font-medium text-text">{row.feature}</td>
              {(['html', 'markdown', 'a11y', 'som'] as const).map((col) => (
                <td
                  key={col}
                  className={`py-3.5 px-4 ${col === 'som' ? 'bg-accent/5' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <CellIcon type={row[col].icon} />
                    {row[col].text && (
                      <span className={col === 'som' ? 'text-text' : 'text-muted'}>
                        {row[col].text}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
