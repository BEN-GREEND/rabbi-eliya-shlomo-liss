import 'server-only'

import { createHash, randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { createMockStore } from './mock'
import { createSupabaseStore } from './supabase'
import type { CandleStatus, CandleStore, LightResult } from './types'

export type { CandleStatus, LightResult } from './types'

const COOKIE = 'candle_token'
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
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  store =
    url && key ? createSupabaseStore(url, key, cooldownHours()) : createMockStore(cooldownHours())
  return store
}

export function storeName(): string {
  return getStore().name
}

/**
 * A per-browser token, issued by us.
 *
 * A random value in an httpOnly cookie — not a fingerprint. Nothing is read
 * from the device, and the token is never stored as-is: the database only ever
 * sees a SHA-256 of it salted with a server-side pepper, so a row cannot be
 * traced back to a visitor even with full access to the table.
 */
async function tokenHash(): Promise<string> {
  const jar = await cookies()
  let token = jar.get(COOKIE)?.value

  if (!token) {
    token = randomUUID()
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 5,
    })
  }

  const pepper = process.env.CANDLE_TOKEN_PEPPER ?? 'development-pepper'
  return createHash('sha256').update(`${token}:${pepper}`).digest('hex')
}

/** Text only, trimmed, capped. Never used for identification or rate limiting. */
function cleanName(input: unknown): string | null {
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
  return getStore().getStatus(await tokenHash())
}

export async function lightCandle(displayName?: unknown): Promise<LightResult> {
  return getStore().lightCandle(await tokenHash(), cleanName(displayName))
}
