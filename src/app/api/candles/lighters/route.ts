import { listLighters, pageOffset, pageSize } from '@/lib/candles/provider'

/** The list grows; never cache it. */
export const dynamic = 'force-dynamic'

/**
 * The published names, newest first, one page at a time.
 *
 * Only rows that carry both a name and consent are ever selected, and only
 * the name and the date are returned — no id, no token hash, nothing
 * technical. The page size is clamped so no request can ask for the lot.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  try {
    return Response.json(
      await listLighters(pageSize(params.get('limit')), pageOffset(params.get('offset'))),
    )
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 503 })
  }
}
