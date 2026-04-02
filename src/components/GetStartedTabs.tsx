'use client'

import { useState } from 'react'
import CodeBlock from './CodeBlock'

const tabs = [
  {
    id: 'cli',
    label: 'CLI',
    language: 'bash',
    code: `# Install
npm install -g plasmate
# or: brew install plasmate-labs/tap/plasmate

# Fetch any page as SOM
plasmate fetch https://example.com

# With selector to strip nav/footer
plasmate fetch https://example.com --selector main

# Compile existing HTML to SOM
cat page.html | plasmate compile`,
  },
  {
    id: 'npm',
    label: 'npm',
    language: 'javascript',
    code: `import { compile } from 'plasmate-wasm'

const html = await fetch('https://example.com').then(r => r.text())
const som = await compile(html, { url: 'https://example.com' })
console.log(som.regions[0].elements)`,
  },
  {
    id: 'python',
    label: 'Python',
    language: 'python',
    code: `from plasmate import PlasmateClient

async with PlasmateClient() as client:
    som = await client.fetch("https://example.com")
    for region in som.regions:
        for element in region.elements:
            print(element.role, element.text)`,
  },
]

export default function GetStartedTabs() {
  const [activeTab, setActiveTab] = useState('cli')
  const active = tabs.find((t) => t.id === activeTab)!

  return (
    <div>
      <div className="flex gap-1 mb-4 bg-surface/50 rounded-lg p-1 inline-flex border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock
        code={active.code}
        language={active.language}
        showLineNumbers={false}
      />
    </div>
  )
}
