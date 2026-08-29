import { getVisitorCount, registerVisitor } from '@/lib/visitors/provider'

/** The count changes; never cache it. */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return Response.json({ count: await getVisitorCount() })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 503 })
  }
}

/** Registers this browser if it is new, then returns the total. Idempotent. */
export async function POST() {
  try {
    return Response.json({ count: await registerVisitor() })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 503 })
  }
}
