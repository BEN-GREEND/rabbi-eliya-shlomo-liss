import type { SupabaseClient } from '@supabase/supabase-js'
import type { CandleStatus, CandleStore, LightResult, LighterPage } from './types'

const TABLE = 'memorial_candles'

/**
 * Supabase store.
 *
 * One table, and the total is COUNT(*). Access uses the service role from the
 * server only — the key never reaches the browser, and RLS denies the anon key
 * entirely, so there is no path to this table except through our route handler.
 *
 * The public list selects two columns and no more. `token_hash` and `id` are
 * never read into a response, so there is no route by which they could reach
 * a page.
 */
export function createSupabaseStore(db: SupabaseClient, cooldownHours: number): CandleStore {
  const cooldownMs = cooldownHours * 60 * 60 * 1000

  async function count(): Promise<number> {
    const { count: n, error } = await db.from(TABLE).select('*', { count: 'exact', head: true })
    if (error) throw new Error(`ספירת הנרות נכשלה: ${error.message}`)
    return n ?? 0
  }

  async function lastLitAt(tokenHash: string): Promise<number> {
    const { data, error } = await db
      .from(TABLE)
      .select('created_at')
      .eq('token_hash', tokenHash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw new Error(`בדיקת הצינון נכשלה: ${error.message}`)
    return data ? new Date(data.created_at as string).getTime() : 0
  }

  function statusFrom(total: number, lastMs: number): CandleStatus {
    const hasLitRecently = lastMs > 0 && Date.now() - lastMs < cooldownMs
    return {
      count: total,
      hasLitRecently,
      nextAllowedAt: hasLitRecently ? new Date(lastMs + cooldownMs).toISOString() : null,
    }
  }

  return {
    name: 'supabase',
    getCount: count,

    async getStatus(tokenHash) {
      const [total, lastMs] = await Promise.all([count(), lastLitAt(tokenHash)])
      return statusFrom(total, lastMs)
    },

    async lightCandle(tokenHash, displayName, publishName): Promise<LightResult> {
      // A name is what makes publication possible; without one there is
      // nothing to publish, whatever the request asked for. The table carries
      // the same rule as a check constraint.
      const publish = publishName === true && displayName !== null

      const lastMs = await lastLitAt(tokenHash)
      if (lastMs > 0 && Date.now() - lastMs < cooldownMs) {
        return {
          ...statusFrom(await count(), lastMs),
          accepted: false,
          displayName,
          publishName: publish,
        }
      }

      const { error } = await db
        .from(TABLE)
        .insert({ token_hash: tokenHash, display_name: displayName, publish_name: publish })
      if (error) throw new Error(`הדלקת הנר נכשלה: ${error.message}`)

      return {
        ...statusFrom(await count(), Date.now()),
        accepted: true,
        displayName,
        publishName: publish,
      }
    },

    async listLighters(limit, offset): Promise<LighterPage> {
      // One row past the page answers "is there another page?" without a
      // second round trip.
      const { data, error } = await db
        .from(TABLE)
        .select('created_at, display_name')
        .eq('publish_name', true)
        .not('display_name', 'is', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit)
      if (error) throw new Error(`טעינת רשימת המדליקים נכשלה: ${error.message}`)

      const rows = (data ?? []) as Array<{ created_at: string; display_name: string }>
      return {
        lighters: rows.slice(0, limit).map((r, i) => ({
          key: `${r.created_at}-${offset + i}`,
          name: r.display_name,
          litAt: r.created_at,
        })),
        hasMore: rows.length > limit,
      }
    },
  }
}
