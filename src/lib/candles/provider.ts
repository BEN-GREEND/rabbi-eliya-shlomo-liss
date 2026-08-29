import 'server-only'

import { anonTokenHash } from '@/lib/anon-token'
import { getDb } from '@/lib/db'
import { createMockStore } from './mock'
import { createSupabaseStore } from './supabase'
import type { CandleStatus, CandleStore, LightResult } from './types'

export type { CandleStatus, LightResult } from './types'

const MAX_NAME = 60

function cooldownHours(): number {
  const raw = Number(process.env.CANDLE_COOLDOWN_HOURS)
  return Number.isFinite(raw) && raw > 0 ? raw : 24
}

let store: CandleStore | null = null

/**
 * Pick the store once.
 *
 * With credentials, Supabase. Without them, the mock — so the memorial page
 * works in full, cooldown included, before any account exists. This is the only
 * place that decides, and the only file to replace if the database ever changes.
 */
function getStore(): CandleStore {
  if (store) return store
  const db = getDb()
  store = db ? createSupabaseStore(db, cooldownHours()) : createMockStore(cooldownHours())
  return store
}

export function storeName(): string {
  return getStore().name
}

/** Text only, trimmed, capped. Never used for identification or rate limiting. */
export function cleanName(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const text = input
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME)
  return text || null
}

// ---- the site's interface --------------------------------------------------

export async function getCount(): Promise<number> {
  return getStore().getCount()
}

export async function getStatus(): Promise<CandleStatus> {
  return getStore().getStatus(await anonTokenHash('candle'))
}

export async function lightCandle(displayName?: unknown): Promise<LightResult> {
  return getStore().lightCandle(await anonTokenHash('candle'), cleanName(displayName))
}
