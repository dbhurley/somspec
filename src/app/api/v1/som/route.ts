import { NextRequest, NextResponse } from 'next/server'
import {
  generateSomFor,
  listSomUrls,
  normalizeRequestUrl,
} from '@/lib/som-pages'

export const dynamic = 'force-static'

// GET /api/v1/som?url=<absolute-or-relative-url>
//
// Returns a SOM/1.0 document for the requested page on somspec.org.
// If no `url` parameter is supplied, returns a directory of available URLs.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  // No URL → return a directory of what we serve
  if (!url) {
    return NextResponse.json(
      {
        som_version: '1.0',
        endpoint: 'https://somspec.org/api/v1/som',
        format: 'SOM/1.0',
        scope: 'main-content',
        freshness_seconds: 3600,
        urls: listSomUrls(),
        usage: 'GET /api/v1/som?url=<absolute-or-relative-url-on-somspec.org>',
        documentation: 'https://somspec.org/spec',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }

  const path = normalizeRequestUrl(url)
  if (!path) {
    return NextResponse.json(
      {
        error: 'invalid_url',
        message:
          'URL must be on somspec.org (absolute https://somspec.org/... or a relative /path).',
      },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  const doc = generateSomFor(path)
  if (!doc) {
    return NextResponse.json(
      {
        error: 'not_found',
        message: `No SOM document available for ${path}. See /api/v1/som for the directory of supported URLs.`,
      },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  return NextResponse.json(doc, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
