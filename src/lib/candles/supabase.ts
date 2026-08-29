import { createClient } from '@supabase/supabase-js'
import type { CandleStatus, CandleStore, LightResult } from './types'

const TABLE = 'memorial_candles'

/**
 * Supabase store.
 *
 * One table, and the total is COUNT(*). Access uses the service role from the
 * server only — the key never reaches the browser, and RLS denies the anon key
 * entirely, so there is no path to this table except through our route handler.
 */
export function createSupabaseStore(
  url: string,
  serviceRoleKey: string,
  cooldownHours: number,
): CandleStore {
  const db = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
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

    async lightCandle(tokenHash, displayName): Promise<LightResult> {
      const lastMs = await lastLitAt(tokenHash)
      if (lastMs > 0 && Date.now() - lastMs < cooldownMs) {
        return { ...statusFrom(await count(), lastMs), accepted: false }
      }

      const { error } = await db
        .from(TABLE)
        .insert({ token_hash: tokenHash, display_name: displayName })
      if (error) throw new Error(`הדלקת הנר נכשלה: ${error.message}`)

      return { ...statusFrom(await count(), Date.now()), accepted: true }
    },
  }
}
