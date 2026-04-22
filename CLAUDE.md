# SOMspec — Agent Context

> The specification, validator, and reference docs for the **Semantic Object Model (SOM)** — an open format for representing web pages as structured JSON optimized for AI-agent consumption. Achieves ~17× (avg) to 800× (peak) token reduction vs raw HTML.
>
> This repo is the community home at `somspec.org`: spec, validator, directives proposal, implementations reference, economics calculator, publisher leaderboard, and launch blog. It does not implement SOM production — that lives in publisher libraries (e.g. Plasmate). It defines the contract.

---

## Related Repos

| Repo | Role | Relationship |
|------|------|--------------|
| `dbhurley/somspec` | The spec + validator + reference docs (this repo) | `somspec.org` — canonical source of truth |
| `dbhurley/somready` | Consumer checker + badge API for SOM Directives in `robots.txt` | `somready.com` — checks whether a domain advertises SOM |
| `dbhurley/somordom` | Private sibling — SOM-family tooling | Exact relationship TBD; confirm before assuming |
| `dbhurley/webtaskbench` | Benchmark that cites SOM in the leaderboard | Blog post "How to Read the WebTaskBench Leaderboard" lives in this repo |
| `plasmate-labs/plasmate` | Reference publisher implementation | Generates SOM; this repo defines the schema it targets |

---

## What SOM Is (One-Paragraph Primer)

A SOM document is a single flat JSON object:

```
{ som_version, url, title, lang, regions[{ id, role, elements[{ id, role, text?, attrs?, actions? }] }], meta{} }
```

Element IDs are **SHA-256-derived and stable** — the same element yields the same ID across page refreshes, which is what makes multi-step agent workflows reliable. Every element has a typed role + optional `actions` array (`click`, `type`, `clear`, `select`, `toggle`, `scroll`, `hover`). The format sits deliberately between Markdown (loses interactivity) and accessibility trees (inconsistent, non-serializable) and raw HTML (200×–800× the tokens of SOM for the same page).

"SOM Directives" is a companion proposal — a set of `SOM-*` keys publishers put in `robots.txt` to advertise a SOM endpoint:

```
SOM-Endpoint:     https://api.example.com/v1/som
SOM-Format:       SOM/1.0
SOM-Scope:        main-content
SOM-Freshness:    3600
SOM-Token-Budget: 15000
SOM-Rate-Limit:   60/min
SOM-Attribution:  https://example.com/attribution
```

---

## Directory Structure

```
somspec/
├── src/
│   ├── app/                               # Next.js 14 App Router
│   │   ├── page.tsx                       # Landing — what/why/compression comparison
│   │   ├── layout.tsx                     # Root layout, fonts (Fraunces/Source Serif 4)
│   │   ├── globals.css                    # Tailwind + custom theme tokens
│   │   │
│   │   ├── spec/page.tsx                  # Full SOM/1.0 specification (431 lines)
│   │   ├── reference/page.tsx             # Implementations reference (471 lines)
│   │   ├── directives/page.tsx            # robots.txt SOM Directives proposal (427 lines)
│   │   ├── validate/                      # Client-side JSON validator
│   │   │   ├── page.tsx                   # Textarea + validateSOM() + error rendering
│   │   │   └── layout.tsx                 # Tool metadata
│   │   ├── calculator/page.tsx            # Economics calculator (205 lines)
│   │   ├── publishers/page.tsx            # Publisher leaderboard / compliance roll
│   │   ├── compliance/page.tsx            # Framework compliance matrix
│   │   ├── changelog/page.tsx             # Spec version history
│   │   └── blog/
│   │       ├── page.tsx                   # Blog index (reads src/data/posts.ts)
│   │       ├── techcrunch-was-blocked/page.tsx
│   │       ├── the-discovery-gap/page.tsx
│   │       ├── the-publishers-third-option/page.tsx
│   │       └── reading-the-leaderboard/page.tsx
│   │
│   ├── components/
│   │   ├── Nav.tsx                        # Site nav (145 lines — includes mobile menu)
│   │   ├── Footer.tsx
│   │   ├── CodeBlock.tsx                  # Prism-less syntax highlight wrapper
│   │   ├── ComparisonTable.tsx            # Format comparison (HTML vs MD vs AX vs SOM)
│   │   ├── GetStartedTabs.tsx             # Multi-tab snippet tabs
│   │   ├── ImplementationCard.tsx         # Per-implementation card on /reference
│   │   └── SpecAccordion.tsx              # Expand/collapse section renderer for /spec
│   │
│   ├── data/
│   │   └── posts.ts                       # Blog post index (title, slug, date, tags)
│   │
│   └── lib/
│       └── validate-som.ts                # Pure JSON-schema-style validator (230 lines)
│
├── public/
│   ├── robots.txt                         # Currently no SOM-* directives (static spec site)
│   ├── sitemap.xml                        # Hand-maintained — update on page add
│   └── llms.txt
│
├── README.md                              # Full spec mirrored as README (482 lines)
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json                           # Next 14.2, React 18.3, TS 5.5
```

---

## Pages & What Lives Where

| Path | Purpose | File |
|------|---------|------|
| `/` | Landing, format comparison, ComparisonTable, calls to spec/validate | `src/app/page.tsx` |
| `/spec` | Full specification (10 sections) | `src/app/spec/page.tsx` + `SpecAccordion` |
| `/reference` | Reference implementations list | `src/app/reference/page.tsx` + `ImplementationCard` |
| `/directives` | robots.txt `SOM-*` directives proposal | `src/app/directives/page.tsx` |
| `/validate` | Paste JSON → run `validateSOM` client-side | `src/app/validate/page.tsx` |
| `/publishers` | Publisher leaderboard (who's SOM-Ready) | `src/app/publishers/page.tsx` |
| `/compliance` | Compliance matrix of frameworks + agents | `src/app/compliance/page.tsx` |
| `/calculator` | Token/cost economics calculator | `src/app/calculator/page.tsx` |
| `/changelog` | Version history | `src/app/changelog/page.tsx` |
| `/blog` | Blog index | `src/app/blog/page.tsx` |
| `/blog/<slug>` | Individual posts (hand-authored React) | `src/app/blog/<slug>/page.tsx` |

---

## Validator (`src/lib/validate-som.ts`)

Pure client-side validator. No server involvement. Used by `/validate` page. Exports:

- `validateSOM(input: string): ValidationResult`
- `ValidationResult = { valid, errors: ValidationError[], stats?: { regions, elements, interactive, version } }`
- `ValidationError = { path, message, severity: 'error' | 'warning' }`

Enforces (error severity):

- `som_version` present and string; must be `"1.0"` or `"0.1"`
- `url` present, string, `http(s)://` prefix
- `regions` present, array
- Region role in: `main, navigation, aside, header, footer, search, form, dialog, section, generic, content`
- Element role in: `heading, paragraph, link, button, text_input, select, checkbox, radio, textarea, image, table, list, listitem, section, details, generic, separator`
- Action in: `click, type, clear, select, toggle, scroll, hover`

Emits warnings for missing optional-but-recommended fields (e.g. `meta.compression_ratio`, `meta.html_bytes`).

When extending SOM, this file is the source of truth for what the `/validate` page accepts. The README spec, the `/spec` page, and this validator must all stay in sync.

---

## Blog / Content Authoring

Posts are hand-authored React components, not MDX. To add a post:

1. Add an entry to `src/data/posts.ts` (slug, title, date ISO 8601, description, readingTime, tags).
2. Create `src/app/blog/<slug>/page.tsx` with the post body.
3. Add the URL to `public/sitemap.xml` (hand-maintained — no generator).

Current posts (all Apr 2026 launch window):
- `techcrunch-was-blocked` — Plasmate v0.5.0 anti-bot story, 77× compression on TechCrunch
- `the-discovery-gap` — Why agents miss SOM Directives even when publishers comply
- `the-publishers-third-option` — Positioning vs block-vs-scrape framing
- `reading-the-leaderboard` — How to interpret WebTaskBench results

---

## Key Design Decisions

1. **Spec and website are a single repo.** The `/spec` page and `README.md` are both authoritative; both are maintained by hand. This is intentional for launch velocity but creates a real risk of drift — see "Known Limitations."

2. **Entirely static, zero backend.** No API routes, no database, no auth. The validator runs client-side. Build output is pure static HTML + JS. Vercel (or any static host) serves it.

3. **Hand-maintained sitemap.** `public/sitemap.xml` is not generated. Add new pages there manually. The current sitemap lists only the "canonical" pages (`/`, `/spec`, `/reference`, `/changelog`) — blog posts, `/validate`, `/calculator`, `/publishers`, `/compliance`, `/directives` are not in it. Update this.

4. **Visual identity: "Scholar's Dark" → "warm light."** The site went through a deliberate design shift (commits `7f8b675` → `ec16fd6`). Typography uses Fraunces + Source Serif 4 as serif display/body; look for those in `layout.tsx`. The goal is academic/reference-authority feel, not SaaS-marketing.

5. **Validator as pedagogical surface.** The `/validate` page is both a tool and a spec-exposition — the placeholder SOM example is a teaching document. Keep the placeholder minimal, correct, and expressive of SOM's core moves (stable IDs, actions arrays, meta stats).

6. **No MDX, no CMS, no headless.** Posts are React components. This is fine for ~5 posts but will bottleneck if the cadence accelerates.

---

## Deployment / Infra

- **Host:** Vercel (default Next.js platform, no `vercel.json` in repo)
- **Domain:** `somspec.org`
- **Runtime:** Next.js 14.2, React 18.3, entirely SSG (no server routes)
- **Build:** `next build` → fully static output
- **Analytics:** none declared in the repo
- **Errors / monitoring:** none declared

---

## Environment Variables

**None.** The site has no runtime secrets, no third-party API calls from the server, no database. Everything is static.

---

## Local Dev

```bash
npm install
npm run dev       # localhost:3000
npm run lint
npm run build     # static production build — catches SSG/type errors
```

Test the validator by pasting known-good SOM into `/validate`; the placeholder in `src/app/validate/page.tsx` is a valid example.

---

## Testing / CI

**None.** No `.github/workflows/`, no test framework in `package.json`.

High-value additions if testing gets prioritized:
- Unit tests for `validateSOM` against known-good and known-bad fixtures (easy win — pure function)
- Snapshot test that `README.md` sections match `/spec` page sections (drift detector)
- Lighthouse / CI accessibility check on the static build

---

## Known Limitations / Current State

- **Spec lives in two places.** `README.md` and `src/app/spec/page.tsx` both render the full spec. Any change must be made in both. No drift detector. This will bite eventually.
- **Sitemap does not cover all pages** (see Key Design Decision #3). Current sitemap excludes `/blog/*`, `/validate`, `/calculator`, `/publishers`, `/compliance`, `/directives`. Search visibility is leaking.
- **No API.** The claim that SOM Directives advertise a real endpoint is currently only editorial. There is no `/api/validate` or JSON API on this repo. If you need programmatic validation, `validateSOM` is a library function — import it or move it to its own npm package.
- **Blog posts hardcoded in TSX.** No scheduled-publish, no drafts, no preview mode. Editing requires a commit.
- **No analytics or error tracking.** Hard to tell if the validator is being used or if pages are broken.
- **No internal link validator.** Manual `[nicholasgriffintn/som-spec]` → `[dbhurley/somspec]` fixes (commit `e920351`) suggest a prior fork or rename with surviving dead links.
- **Hand-maintained compliance matrix.** `/compliance` and `/publishers` are static; no automated checks against live domains. (Compare: `somready.com` does live checks — possibly an opportunity to cross-pollinate.)

---

## Roadmap / Open Threads

(Inferred from commit history — zero open issues or PRs.)

Recent commit clusters:

1. **Blog launch (Apr 4, 2026)** — 4 posts shipped (`d223ff0`), one follow-up on TechCrunch (`7c72e45`). Suggests active content marketing push.
2. **Leaderboard + economics surface** (`33e6708`) — compliance matrix, publisher leaderboard, calculator, bibliography. Positions somspec.org as the authoritative measurement + discovery layer.
3. **Directives proposal** (`bc5119b`, `40f5fb8`) — the `robots.txt` SOM-* convention is being pushed as a formal proposal; consistent with somready.com's checker.
4. **Rebrand** (`7f8b675` → `ec16fd6`) — visual overhaul twice in short succession.

**Likely next moves (speculative, but consistent with trajectory):**
- Spec versioning — a `1.1` or `1.0.1` update, with a machine-readable changelog endpoint
- Formalize the Directives proposal — perhaps an IETF-style draft or a GitHub RFC repo
- Auto-refresh the publisher leaderboard (scrape `somready.com` or run it here directly)
- JSON Schema export of the SOM spec (so validators in other languages can target it)
- Convert blog posts to MDX + add RSS feed
- Search on `/spec` (long document, no in-page search today)
- Cross-repo drift detector for README spec vs `/spec` page

---

## Conventions for Changes

- Spec change = update both `README.md` and `src/app/spec/page.tsx`. Add a row to `/changelog`. Bump `som_version` values in `validateSOM` if the JSON contract changed.
- Validator change = always add a fixture-style test mentally: what input should pass? fail? produce warning? Keep the placeholder on `/validate` a live demonstration.
- New pages = add to `sitemap.xml` **and** to `Nav.tsx` if it's a top-level surface.
- Blog posts = `src/data/posts.ts` + new `src/app/blog/<slug>/page.tsx` + sitemap update.
- Styling: Tailwind utility classes directly in JSX. Use theme tokens defined in `tailwind.config.ts`, not raw hex. Default branch is `master`, not `main`.
