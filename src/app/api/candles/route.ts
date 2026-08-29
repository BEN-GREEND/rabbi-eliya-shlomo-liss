import { getStatus, lightCandle } from '@/lib/candles/provider'

/** The count changes; never cache it. */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return Response.json(await getStatus())
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 503 })
  }
}

export async function POST(request: Request) {
  let displayName: unknown
  try {
    const body = await request.json()
    displayName = (body as { displayName?: unknown })?.displayName
  } catch {
    // A body is optional — lighting a candle without a name is the norm.
  }

  try {
    return Response.json(await lightCandle(displayName))
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 503 })
  }
}
