function highlightJSON(code: string): string {
  return code
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="key">$1</span>$2')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="string">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="number">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="boolean">$1</span>')
    .replace(/"((?:[^"\\]|\\.)*)"(?=\s*[,\]\}]|\s*$)/gm, '<span class="string">"$1"</span>')
}

function highlightBash(code: string): string {
  return code
    .replace(/^(#.*)$/gm, '<span class="comment">$1</span>')
    .replace(/(npm|brew|plasmate|cat|pip)\b/g, '<span class="function">$1</span>')
    .replace(/(install|fetch|compile)\b/g, '<span class="keyword">$1</span>')
    .replace(/(-g|--selector|--format)\b/g, '<span class="variable">$1</span>')
}

function highlightJS(code: string): string {
  return code
    .replace(/\b(import|from|const|await|async|export)\b/g, '<span class="import">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
    .replace(/\b(console)\b/g, '<span class="variable">$1</span>')
    .replace(/\.(log|text|then|compile|fetch)\b/g, '.<span class="function">$1</span>')
}

function highlightPython(code: string): string {
  return code
    .replace(/\b(from|import|async|with|as|await|for|in|def|class|print)\b/g, '<span class="import">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>')
    .replace(/(#.*$)/gm, '<span class="comment">$1</span>')
    .replace(/\.(fetch|regions|elements|role|text)\b/g, '.<span class="variable">$1</span>')
}

const highlighters: Record<string, (code: string) => string> = {
  json: highlightJSON,
  bash: highlightBash,
  javascript: highlightJS,
  js: highlightJS,
  python: highlightPython,
}

export default function CodeBlock({
  code,
  language = 'json',
  showLineNumbers = true,
  className = '',
}: {
  code: string
  language?: string
  showLineNumbers?: boolean
  className?: string
}) {
  const highlight = highlighters[language] || ((c: string) => c)
  const lines = code.trim().split('\n')

  return (
    <div className={`code-block ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-[11px] text-muted/60 uppercase tracking-[0.15em] font-mono">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-highlight/40" />
          <div className="w-2 h-2 rounded-full bg-accent/40" />
          <div className="w-2 h-2 rounded-full bg-success/40" />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed">
              {showLineNumbers && (
                <span className="line-number">{i + 1}</span>
              )}
              <span dangerouslySetInnerHTML={{ __html: highlight(line) }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
