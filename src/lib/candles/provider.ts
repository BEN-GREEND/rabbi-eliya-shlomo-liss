import 'server-only'

import { anonTokenHash } from '@/lib/anon-token'
import { getDb } from '@/lib/db'
import { createMockStore } from './mock'
import { createSupabaseStore } from './supabase'
import type { CandleStatus, CandleStore, LightResult, LighterPage } from './types'

export type { CandleStatus, Lighter, LighterPage, LightResult } from './types'

const MAX_NAME = 60

/** How many names one request may ask for. */
export const LIGHTERS_PAGE = 20
const MAX_PAGE = 50

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

/**
 * A name, reduced to plain text.
 *
 * Control and formatting characters go (they are invisible and can reorder a
 * line); anything shaped like a tag goes, and so does any angle bracket left
 * behind, so what is stored can only ever be read as text. React escapes on
 * render as well — this is the second lock, not the only one.
 *
 * Never used for identification or rate limiting: the cooldown keys on the
 * anonymous token hash and knows nothing about names.
 */
export function cleanName(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const text = input
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME)
    .trim()
  return text || null
}

/**
 * Whether this request consented to publication.
 *
 * Two conditions, both required: the box was ticked — literal `true`, not a
 * truthy string — and there is a name to publish. Anything else is a no.
 */
export function wantsPublish(input: unknown, name: string | null): boolean {
  return input === true && name !== null
}

/** Clamp a requested page size to something a public route may serve. */
export function pageSize(input: unknown): number {
  const n = Math.floor(Number(input))
  if (!Number.isFinite(n) || n <= 0) return LIGHTERS_PAGE
  return Math.min(n, MAX_PAGE)
}

/** Clamp an offset. A negative or unparseable offset means the first page. */
export function pageOffset(input: unknown): number {
  const n = Math.floor(Number(input))
  return Number.isFinite(n) && n > 0 ? n : 0
}

// ---- the site's interface --------------------------------------------------

export async function getCount(): Promise<number> {
  return getStore().getCount()
}

export async function getStatus(): Promise<CandleStatus> {
  return getStore().getStatus(await anonTokenHash('candle'))
}

export async function lightCandle(
  displayName?: unknown,
  publishName?: unknown,
): Promise<LightResult> {
  const name = cleanName(displayName)
  return getStore().lightCandle(
    await anonTokenHash('candle'),
    name,
    wantsPublish(publishName, name),
  )
}

export async function listLighters(limit: number, offset: number): Promise<LighterPage> {
  return getStore().listLighters(limit, offset)
}
