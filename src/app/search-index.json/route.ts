import { buildSearchIndex } from '@/lib/search'

/**
 * The search index, served as a static file.
 *
 * Prerendered at build time, so it costs nothing at request time and can never
 * drift from the content it was built from. The browser fetches it once, on
 * the first search.
 */
export const dynamic = 'force-static'

export function GET() {
  return Response.json(buildSearchIndex())
}
