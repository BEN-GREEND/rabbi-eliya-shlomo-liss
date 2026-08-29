import type { SupabaseClient } from '@supabase/supabase-js'
import type { VisitorStore } from './types'

const TABLE = 'site_visitors'

/**
 * Supabase store.
 *
 * Registering is one insert that ignores a duplicate. `token_hash` is UNIQUE,
 * so two simultaneous requests from the same browser cannot both create a row,
 * and there is no read-then-write race to guard against.
 */
export function createSupabaseVisitorStore(db: SupabaseClient): VisitorStore {
  async function count(): Promise<number> {
    const { count: n, error } = await db.from(TABLE).select('*', { count: 'exact', head: true })
    if (error) throw new Error(`ספירת המבקרים נכשלה: ${error.message}`)
    return n ?? 0
  }

  return {
    name: 'supabase',
    getCount: count,

    async register(tokenHash) {
      const { error } = await db
        .from(TABLE)
        .upsert({ token_hash: tokenHash }, { onConflict: 'token_hash', ignoreDuplicates: true })
      if (error) throw new Error(`רישום המבקר נכשל: ${error.message}`)
      return count()
    },
  }
}
