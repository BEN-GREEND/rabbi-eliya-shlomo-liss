import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null | undefined

/**
 * The one Supabase client, or null when there are no credentials.
 *
 * Both tables live in the same project. Access is service-role and
 * server-side only — RLS denies the anon key entirely, and no key of any kind
 * reaches the browser.
 */
export function getDb(): SupabaseClient | null {
  if (client !== undefined) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  client =
    url && key
      ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      : null
  return client
}

export function hasDb(): boolean {
  return getDb() !== null
}
