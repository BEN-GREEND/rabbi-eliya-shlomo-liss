import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createMockStore } from './mock'
import type { CandleStore } from './types'

/**
 * The consent rules, exercised against a real store.
 *
 * The mock is the same contract as Supabase, so what holds here is what the
 * route handler does in production: a name alone never publishes, consent
 * alone never publishes, and only both together put a name on the page.
 */
let dir: string
let file: string
let store: CandleStore

const TOKEN = 'a'.repeat(64)
const other = (n: number) => String(n).repeat(64).slice(0, 64)

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'candles-'))
  file = path.join(dir, 'candles.json')
  store = createMockStore(24, file)
})

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true })
})

const published = async () => (await store.listLighters(20, 0)).lighters.map((l) => l.name)

describe('lighting without a name', () => {
  it('saves the candle and publishes nothing', async () => {
    const result = await store.lightCandle(TOKEN, null, false)

    expect(result.accepted).toBe(true)
    expect(result.count).toBe(1)
    expect(result.displayName).toBeNull()
    expect(result.publishName).toBe(false)
    expect(await published()).toEqual([])
  })
})

describe('a name without consent', () => {
  it('is stored but never shown publicly', async () => {
    const result = await store.lightCandle(TOKEN, 'שרה', false)

    expect(result.accepted).toBe(true)
    expect(result.publishName).toBe(false)
    expect(await published()).toEqual([])

    // Stored — the name is on the row, it is simply not published.
    const [row] = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<Record<string, unknown>>
    expect(row?.display_name).toBe('שרה')
    expect(row?.publish_name).toBe(false)
  })
})

describe('a name with consent', () => {
  it('is stored and appears in the list', async () => {
    const result = await store.lightCandle(TOKEN, 'שרה', true)

    expect(result.publishName).toBe(true)
    expect(await published()).toEqual(['שרה'])
  })
})

describe('consent without a name', () => {
  it('is turned down to false and shows nothing', async () => {
    const result = await store.lightCandle(TOKEN, null, true)

    expect(result.accepted).toBe(true)
    expect(result.publishName).toBe(false)
    expect(await published()).toEqual([])

    const [row] = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<Record<string, unknown>>
    expect(row?.publish_name).toBe(false)
  })
})

describe('the public list', () => {
  it('shows the most recent first', async () => {
    // Distinct tokens, so the cooldown does not block the later ones.
    await store.lightCandle(other(1), 'ראשון', true)
    await new Promise((r) => setTimeout(r, 5))
    await store.lightCandle(other(2), 'שני', true)
    await new Promise((r) => setTimeout(r, 5))
    await store.lightCandle(other(3), 'שלישי', true)

    expect(await published()).toEqual(['שלישי', 'שני', 'ראשון'])
  })

  it('pages, and says whether more remain', async () => {
    for (let i = 0; i < 5; i++) {
      await store.lightCandle(other(i), `שם ${i}`, true)
      await new Promise((r) => setTimeout(r, 5))
    }

    const first = await store.listLighters(2, 0)
    expect(first.lighters).toHaveLength(2)
    expect(first.hasMore).toBe(true)

    const last = await store.listLighters(2, 4)
    expect(last.lighters).toHaveLength(1)
    expect(last.hasMore).toBe(false)
  })

  it('exposes only a name and a date — never the token hash', async () => {
    await store.lightCandle(TOKEN, 'שרה', true)
    const [entry] = (await store.listLighters(20, 0)).lighters

    expect(Object.keys(entry ?? {}).sort()).toEqual(['key', 'litAt', 'name'])
    expect(JSON.stringify(entry)).not.toContain(TOKEN)
  })

  it('leaves out candles whose owner did not consent', async () => {
    await store.lightCandle(other(1), 'מוצג', true)
    await store.lightCandle(other(2), 'חסוי', false)

    expect(await published()).toEqual(['מוצג'])
  })

  it('does not publish rows written before consent existed', async () => {
    // A 0001-era row: a name, and no publish_name column at all.
    fs.writeFileSync(
      file,
      JSON.stringify([
        { created_at: new Date().toISOString(), token_hash: TOKEN, display_name: 'ותיק' },
      ]),
    )

    expect(await published()).toEqual([])
  })
})

describe('the cooldown', () => {
  it('still blocks a second candle from the same token', async () => {
    await store.lightCandle(TOKEN, 'שרה', true)
    const second = await store.lightCandle(TOKEN, 'שרה שוב', true)

    expect(second.accepted).toBe(false)
    expect(second.count).toBe(1)
    expect(await published()).toEqual(['שרה'])
  })

  it('does not block a different token', async () => {
    await store.lightCandle(other(1), null, false)
    const second = await store.lightCandle(other(2), null, false)

    expect(second.accepted).toBe(true)
    expect(second.count).toBe(2)
  })
})
