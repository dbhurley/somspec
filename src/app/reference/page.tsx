import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reference',
  description: 'Complete reference for SOM element types, regions, attributes, and actions.',
  alternates: { canonical: '/reference' },
}

function RefSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-display font-light text-text mb-6 pb-3 border-b border-border">{title}</h2>
      {children}
    </section>
  )
}

function TypeCard({ name, description, attrs, actions, example }: {
  name: string
  description: string
  attrs: { name: string; type: string; description: string }[]
  actions: string[]
  example: string
}) {
  return (
    <div id={`type-${name}`} className="bg-surface border border-border rounded-card p-6 scroll-mt-24" style={{ borderLeftWidth: '3px', borderLeftColor: 'rgba(138, 100, 32, 0.15)' }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-display text-text font-mono">{name}</h3>
        {actions.length > 0 && (
          <div className="flex gap-1.5">
            {actions.map((a) => (
              <span key={a} className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-muted mb-4 font-serif">{description}</p>

      {attrs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-display text-text uppercase tracking-wider mb-2">Attributes</h4>
          <div className="space-y-2">
            {attrs.map((attr) => (
              <div key={attr.name} className="flex gap-3 text-sm">
                <code className="text-code font-mono shrink-0">{attr.name}</code>
                <span className="text-muted/40 font-mono text-xs mt-0.5">({attr.type})</span>
                <span className="text-muted font-serif">{attr.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-display text-text uppercase tracking-wider mb-2">Example</h4>
        <pre className="bg-bg border border-border rounded-card p-3 text-xs font-mono text-muted overflow-x-auto">
          <code>{example}</code>
        </pre>
      </div>
    </div>
  )
}

const elementTypes = [
  {
    name: 'link',
    description: 'Represents hyperlinks and anchor elements that navigate to other pages or resources.',
    attrs: [
      { name: 'href', type: 'string', description: 'Target URL of the link' },
      { name: 'visited', type: 'boolean', description: 'Whether the link has been visited' },
    ],
    actions: ['click'],
    example: `{
  "id": "e_1a5c8b3e7f2d",
  "role": "link",
  "text": "Documentation",
  "attrs": { "href": "/docs" },
  "actions": ["click"]
}`,
  },
  {
    name: 'button',
    description: 'Represents clickable controls including submit buttons, toggle buttons, and action triggers.',
    attrs: [
      { name: 'type', type: 'string', description: 'Button type: "button", "submit", or "reset"' },
      { name: 'form_action', type: 'string', description: 'Form submission URL if applicable' },
    ],
    actions: ['click'],
    example: `{
  "id": "e_4b2e9f1c8a3d",
  "role": "button",
  "text": "Submit Order",
  "attrs": { "type": "submit" },
  "actions": ["click"],
  "hints": { "primary": true }
}`,
  },
  {
    name: 'text_input',
    description: 'Single-line text entry fields including email, password, search, URL, and tel inputs.',
    attrs: [
      { name: 'value', type: 'string', description: 'Current field value' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text when empty' },
      { name: 'input_type', type: 'string', description: 'Input type: "text", "email", "password", "search", "url", "tel"' },
    ],
    actions: ['type', 'clear'],
    example: `{
  "id": "e_7c3a1d5e9b2f",
  "role": "text_input",
  "text": "Email address",
  "attrs": { "placeholder": "you@example.com", "input_type": "email" },
  "actions": ["type", "clear"],
  "aria": { "required": true }
}`,
  },
  {
    name: 'textarea',
    description: 'Multi-line text entry fields for longer content input.',
    attrs: [
      { name: 'value', type: 'string', description: 'Current field value' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text when empty' },
      { name: 'rows', type: 'integer', description: 'Visible number of text rows' },
    ],
    actions: ['type', 'clear'],
    example: `{
  "id": "e_2d8f4a6c1e3b",
  "role": "textarea",
  "text": "Message",
  "attrs": { "placeholder": "Write your message...", "rows": 5 },
  "actions": ["type", "clear"]
}`,
  },
  {
    name: 'select',
    description: 'Dropdown menus and listboxes that allow selection from predefined options.',
    attrs: [
      { name: 'value', type: 'string', description: 'Currently selected value' },
      { name: 'options', type: 'array', description: 'List of available options with value and label' },
      { name: 'multiple', type: 'boolean', description: 'Whether multiple selections are allowed' },
    ],
    actions: ['select'],
    example: `{
  "id": "e_5f1b3d7e9a2c",
  "role": "select",
  "text": "Country",
  "attrs": {
    "value": "us",
    "options": [
      { "value": "us", "label": "United States" },
      { "value": "uk", "label": "United Kingdom" }
    ]
  },
  "actions": ["select"]
}`,
  },
  {
    name: 'checkbox',
    description: 'Toggle checkboxes for binary on/off selections.',
    attrs: [
      { name: 'checked', type: 'boolean', description: 'Whether the checkbox is currently checked' },
      { name: 'value', type: 'string', description: 'Form submission value' },
    ],
    actions: ['toggle'],
    example: `{
  "id": "e_8a4c2e6f1d3b",
  "role": "checkbox",
  "text": "I agree to the terms",
  "attrs": { "checked": false },
  "actions": ["toggle"]
}`,
  },
  {
    name: 'radio',
    description: 'Radio button options within a mutually exclusive group.',
    attrs: [
      { name: 'checked', type: 'boolean', description: 'Whether this option is selected' },
      { name: 'value', type: 'string', description: 'Option value' },
      { name: 'name', type: 'string', description: 'Radio group name for mutual exclusion' },
    ],
    actions: ['click'],
    example: `{
  "id": "e_3b7d1f5a9c2e",
  "role": "radio",
  "text": "Express shipping",
  "attrs": { "checked": true, "value": "express", "name": "shipping" },
  "actions": ["click"]
}`,
  },
  {
    name: 'heading',
    description: 'Section headings at levels 1 through 6, providing document outline structure.',
    attrs: [
      { name: 'level', type: 'integer', description: 'Heading level from 1 (highest) to 6 (lowest)' },
    ],
    actions: [],
    example: `{
  "id": "e_6e2a8c4f1b3d",
  "role": "heading",
  "text": "Getting Started",
  "attrs": { "level": 2 }
}`,
  },
  {
    name: 'image',
    description: 'Visual content including photographs, illustrations, diagrams, and icons.',
    attrs: [
      { name: 'src', type: 'string', description: 'Image source URL' },
      { name: 'alt', type: 'string', description: 'Alternative text description' },
      { name: 'width', type: 'integer', description: 'Display width in pixels' },
      { name: 'height', type: 'integer', description: 'Display height in pixels' },
    ],
    actions: [],
    example: `{
  "id": "e_9c1d3f5b7a2e",
  "role": "image",
  "text": "Architecture diagram",
  "attrs": { "src": "/img/arch.png", "alt": "System architecture", "width": 800, "height": 400 }
}`,
  },
  {
    name: 'list',
    description: 'Ordered and unordered lists with nested item content.',
    attrs: [
      { name: 'items', type: 'array', description: 'Array of list item text strings' },
      { name: 'ordered', type: 'boolean', description: 'Whether the list is ordered (numbered)' },
    ],
    actions: [],
    example: `{
  "id": "e_4d6f8a2c1e3b",
  "role": "list",
  "text": "Features",
  "attrs": { "items": ["Fast", "Typed", "Compact"], "ordered": false }
}`,
  },
  {
    name: 'table',
    description: 'Tabular data with headers and rows.',
    attrs: [
      { name: 'headers', type: 'array', description: 'Column header labels' },
      { name: 'rows', type: 'array', description: 'Array of row arrays containing cell values' },
    ],
    actions: [],
    example: `{
  "id": "e_1b3d5f7a9c2e",
  "role": "table",
  "text": "Pricing",
  "attrs": {
    "headers": ["Plan", "Price", "Requests"],
    "rows": [["Free", "$0", "1,000/mo"], ["Pro", "$29", "100,000/mo"]]
  }
}`,
  },
  {
    name: 'paragraph',
    description: 'Block-level text content. The most common element type for body text.',
    attrs: [],
    actions: [],
    example: `{
  "id": "e_2e4f6a8c1d3b",
  "role": "paragraph",
  "text": "SOM provides a compact, typed representation of web pages."
}`,
  },
  {
    name: 'section',
    description: 'Content grouping containers that provide additional structural context.',
    attrs: [],
    actions: [],
    example: `{
  "id": "e_5a7c9e1b3d2f",
  "role": "section",
  "text": "Related Articles"
}`,
  },
  {
    name: 'separator',
    description: 'Visual dividers that separate content sections, typically rendered from hr elements.',
    attrs: [],
    actions: [],
    example: `{
  "id": "e_8b1d3f5a7c2e",
  "role": "separator",
  "text": ""
}`,
  },
  {
    name: 'details',
    description: 'Collapsible disclosure widgets that can be toggled open and closed.',
    attrs: [
      { name: 'open', type: 'boolean', description: 'Whether the details element is currently expanded' },
      { name: 'summary', type: 'string', description: 'The visible summary text shown when collapsed' },
    ],
    actions: ['toggle'],
    example: `{
  "id": "e_3c5e7a9b1d2f",
  "role": "details",
  "text": "Full error details...",
  "attrs": { "open": false, "summary": "Show error details" },
  "actions": ["toggle"]
}`,
  },
]

const regionRoles = [
  { role: 'main', description: 'The primary content area of the page. Corresponds to the HTML main element or role="main".', typical: 'Article body, product details, form content' },
  { role: 'navigation', description: 'Navigation links and menus. Detected from nav elements, role="navigation", or high link density areas.', typical: 'Top nav, sidebar nav, breadcrumbs, pagination' },
  { role: 'aside', description: 'Supplementary content tangentially related to the main content.', typical: 'Sidebar, related articles, advertising' },
  { role: 'header', description: 'Introductory content, typically containing logos, titles, and primary navigation.', typical: 'Site header, page banner' },
  { role: 'footer', description: 'Footer content with secondary links, copyright, and legal information.', typical: 'Site footer, article footer' },
  { role: 'search', description: 'Search functionality. Detected from role="search" or search form patterns.', typical: 'Site search, filter controls' },
  { role: 'form', description: 'Interactive form areas that collect user input.', typical: 'Login form, checkout, contact form' },
  { role: 'dialog', description: 'Modal or non-modal dialog content overlaying the page.', typical: 'Modals, alerts, popups' },
  { role: 'section', description: 'Generic named sections that do not fit other roles.', typical: 'Content sections with aria-label' },
  { role: 'generic', description: 'Fallback for content that cannot be classified into another role.', typical: 'Uncategorized content blocks' },
]

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="mb-20">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent/60 mb-4 block">Reference</span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-text mb-4">API Reference</h1>
        <p className="text-lg text-muted font-serif leading-body max-w-2xl">
          Complete reference for all SOM element types, region roles, attributes, actions, and semantic hints.
        </p>
      </div>

      <hr className="hr-ornament mb-16" />

      {/* Quick nav */}
      <nav className="mb-20 p-6 bg-surface border border-border rounded-card">
        <h2 className="text-sm font-display text-text uppercase tracking-wider mb-4">Jump to</h2>
        <div className="flex flex-wrap gap-2">
          <a href="#regions" className="text-sm text-muted hover:text-accent transition-colors px-3 py-1.5 bg-bg border border-border rounded-full font-serif">Regions</a>
          <a href="#element-types" className="text-sm text-muted hover:text-accent transition-colors px-3 py-1.5 bg-bg border border-border rounded-full font-serif">Element Types</a>
          <a href="#actions" className="text-sm text-muted hover:text-accent transition-colors px-3 py-1.5 bg-bg border border-border rounded-full font-serif">Actions</a>
          <a href="#hints" className="text-sm text-muted hover:text-accent transition-colors px-3 py-1.5 bg-bg border border-border rounded-full font-serif">Hints</a>
          <a href="#aria-states" className="text-sm text-muted hover:text-accent transition-colors px-3 py-1.5 bg-bg border border-border rounded-full font-serif">ARIA States</a>
        </div>
      </nav>

      <RefSection id="regions" title="Region Roles">
        <p className="text-muted mb-6 font-serif">
          Regions are the top-level grouping construct in SOM. Every element belongs to exactly one region.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-display font-medium text-text">Role</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Description</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Typical Content</th>
              </tr>
            </thead>
            <tbody>
              {regionRoles.map((r) => (
                <tr key={r.role} className="border-b border-border/30 hover:bg-surface/30">
                  <td className="py-3 px-4 font-mono text-code">{r.role}</td>
                  <td className="py-3 px-4 text-muted font-serif">{r.description}</td>
                  <td className="py-3 px-4 text-muted/50 text-xs font-serif">{r.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RefSection>

      <RefSection id="element-types" title="Element Types">
        <p className="text-muted mb-6 font-serif">
          Each element type below includes its description, allowed attributes, supported actions, and a JSON example.
        </p>
        <div className="space-y-4">
          {elementTypes.map((et) => (
            <TypeCard key={et.name} {...et} />
          ))}
        </div>
      </RefSection>

      <RefSection id="actions" title="Actions">
        <p className="text-muted mb-6 font-serif">
          Actions describe what an agent can do with an element. Each action maps to a specific interaction pattern.
        </p>
        <div className="space-y-3">
          {[
            ['click', 'Triggers the element. For links, navigates to the href. For buttons, submits forms or triggers handlers. For radio buttons, selects the option.'],
            ['type', 'Enters text into the element. Valid for text_input and textarea. Replaces any existing value.'],
            ['select', 'Selects an option from a dropdown. Valid for select elements. The agent specifies the option value to select.'],
            ['toggle', 'Toggles the element state. For checkboxes, switches checked/unchecked. For details, opens/closes.'],
            ['clear', 'Clears the current value of the element. Valid for text_input and textarea.'],
          ].map(([name, desc]) => (
            <div key={name} className="pl-4 border-l-2 border-accent/15 py-2">
              <code className="text-code font-mono text-sm">{name}</code>
              <p className="text-sm text-muted mt-1 font-serif">{desc}</p>
            </div>
          ))}
        </div>
      </RefSection>

      <RefSection id="hints" title="Hints">
        <p className="text-muted mb-6 font-serif">
          Hints are CSS-inferred semantic signals that provide additional context about an element&apos;s visual presentation and likely purpose.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-display font-medium text-text">Hint</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Type</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted font-serif">
              {[
                ['visually_hidden', 'boolean', 'Element is visually hidden but present in the accessibility tree (screen-reader only content)'],
                ['primary', 'boolean', 'Element appears to be a primary/prominent action based on visual styling (size, color, position)'],
                ['destructive', 'boolean', 'Element appears to be a destructive action based on red/warning styling'],
                ['disabled_visual', 'boolean', 'Element appears visually disabled (grayed out, reduced opacity) even without aria-disabled'],
                ['truncated', 'boolean', 'Text content appears to be truncated with ellipsis or overflow hidden'],
              ].map(([name, type, desc]) => (
                <tr key={name} className="border-b border-border/30">
                  <td className="py-3 px-4 font-mono text-code">{name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted/40">{type}</td>
                  <td className="py-3 px-4">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RefSection>

      <RefSection id="aria-states" title="ARIA States">
        <p className="text-muted mb-6 font-serif">
          ARIA states capture dynamic widget state from ARIA attributes. These are included in the element&apos;s aria field.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-display font-medium text-text">State</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Type</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Source</th>
                <th className="py-3 px-4 text-left font-display font-medium text-text">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted font-serif">
              {[
                ['expanded', 'boolean', 'aria-expanded', 'Whether a collapsible section is currently expanded'],
                ['checked', 'boolean | "mixed"', 'aria-checked', 'Check state of checkboxes and radio buttons'],
                ['selected', 'boolean', 'aria-selected', 'Whether an option or tab is currently selected'],
                ['disabled', 'boolean', 'aria-disabled', 'Whether the element is disabled for interaction'],
                ['pressed', 'boolean | "mixed"', 'aria-pressed', 'Toggle button pressed state'],
                ['invalid', 'boolean', 'aria-invalid', 'Whether the element has a validation error'],
                ['required', 'boolean', 'aria-required', 'Whether the element is required for form submission'],
                ['readonly', 'boolean', 'aria-readonly', 'Whether the element value is read-only'],
              ].map(([state, type, source, desc]) => (
                <tr key={state} className="border-b border-border/30">
                  <td className="py-3 px-4 font-mono text-code">{state}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted/40">{type}</td>
                  <td className="py-3 px-4 font-mono text-xs">{source}</td>
                  <td className="py-3 px-4">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RefSection>
    </div>
  )
}
