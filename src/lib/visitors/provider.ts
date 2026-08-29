import 'server-only'

import { anonTokenHash } from '@/lib/anon-token'
import { getDb } from '@/lib/db'
import { createMockVisitorStore } from './mock'
import { createSupabaseVisitorStore } from './supabase'
import type { VisitorStore } from './types'

let store: VisitorStore | null = null

/**
 * Pick the store once. Supabase with credentials, the mock without them — so
 * the counter works in development before any account exists, and switches
 * over on its own once the environment variables are set.
 */
function getStore(): VisitorStore {
  if (store) return store
  const db = getDb()
  store = db ? createSupabaseVisitorStore(db) : createMockVisitorStore()
  return store
}

export function visitorStoreName(): string {
  return getStore().name
}

// ---- the site's interface --------------------------------------------------

export async function getVisitorCount(): Promise<number> {
  return getStore().getCount()
}

/** Record this browser if it is new, and return the total either way. */
export async function registerVisitor(): Promise<number> {
  return getStore().register(await anonTokenHash('visitor'))
}
