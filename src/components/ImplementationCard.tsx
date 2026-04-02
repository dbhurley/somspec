const implementations = [
  {
    name: 'Plasmate',
    badge: 'Reference Implementation',
    description: 'Open source Rust engine. CLI + MCP server + WASM.',
    link: 'https://plasmate.app',
    linkLabel: 'plasmate.app',
  },
  {
    name: 'plasmate-wasm',
    description: 'SOM compiler as WebAssembly. Run in Node.js, Deno, edge workers.',
    link: 'https://www.npmjs.com/package/plasmate-wasm',
    linkLabel: 'npm: plasmate-wasm',
  },
  {
    name: 'plasmate-python',
    description: 'Python SDK with async support.',
    link: 'https://pypi.org/project/plasmate/',
    linkLabel: 'PyPI: plasmate',
  },
  {
    name: 'plasmate-mcp',
    description: 'MCP server. Works with Claude Desktop, Cursor, VS Code Copilot, Windsurf.',
    link: 'https://www.npmjs.com/package/plasmate-mcp',
    linkLabel: 'npm: plasmate-mcp',
  },
  {
    name: 'somordom.com',
    description: 'Browser-based SOM vs DOM comparison tool with badges and certifications.',
    link: 'https://somordom.com',
    linkLabel: 'somordom.com',
  },
]

export default function ImplementationCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {implementations.map((impl) => (
        <a
          key={impl.name}
          href={impl.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 bg-surface border border-border rounded-card card-hover group"
          style={{ borderLeftWidth: '3px', borderLeftColor: 'rgba(199, 168, 83, 0.25)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-text group-hover:text-accent transition-colors">
              {impl.name}
            </h3>
            {impl.badge && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                {impl.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted mb-4 font-serif leading-body">{impl.description}</p>
          <span className="text-xs text-accent/60 font-mono">{impl.linkLabel}</span>
        </a>
      ))}
    </div>
  )
}
