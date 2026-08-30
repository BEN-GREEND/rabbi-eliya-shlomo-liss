import fs from 'node:fs'
import path from 'node:path'
import type { CandleStatus, CandleStore, LightResult, LighterPage } from './types'

/**
 * Development store.
 *
 * Keeps the same shape as the real one so the whole memorial page — counter,
 * cooldown, consent, the public list — works with no credentials at all.
 * Backed by a file under .content-cache so a restart does not reset the count
 * while you are working.
 */
const DEFAULT_FILE = path.join(process.cwd(), '.content-cache', 'candles.json')

interface Row {
  created_at: string
  token_hash: string
  display_name: string | null
  publish_name: boolean
}

export function createMockStore(cooldownHours: number, file: string = DEFAULT_FILE): CandleStore {
  const cooldownMs = cooldownHours * 60 * 60 * 1000

  function read(): Row[] {
    try {
      const rows = JSON.parse(fs.readFileSync(file, 'utf8')) as Row[]
      // Rows written before consent existed have no flag, and an absent answer
      // is not a yes.
      return rows.map((r) => ({ ...r, publish_name: r.publish_name === true }))
    } catch {
      return []
    }
  }

  function write(rows: Row[]): void {
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, JSON.stringify(rows, null, 2))
    } catch {
      // A read-only filesystem is fine here: the count simply does not persist.
    }
  }

  const statusFor = (rows: Row[], tokenHash: string): CandleStatus => {
    const last = rows
      .filter((r) => r.token_hash === tokenHash)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
    const lastMs = last ? new Date(last.created_at).getTime() : 0
    const hasLitRecently = Boolean(last) && Date.now() - lastMs < cooldownMs
    return {
      count: rows.length,
      hasLitRecently,
      nextAllowedAt: hasLitRecently ? new Date(lastMs + cooldownMs).toISOString() : null,
    }
  }

  return {
    name: 'mock',
    async getCount() {
      return read().length
    },
    async getStatus(tokenHash) {
      return statusFor(read(), tokenHash)
    },

    async lightCandle(tokenHash, displayName, publishName): Promise<LightResult> {
      // A name is what makes publication possible; without one there is
      // nothing to publish, whatever the request asked for.
      const publish = publishName === true && displayName !== null

      const rows = read()
      const status = statusFor(rows, tokenHash)
      if (status.hasLitRecently) {
        return { ...status, accepted: false, displayName, publishName: publish }
      }

      rows.push({
        created_at: new Date().toISOString(),
        token_hash: tokenHash,
        display_name: displayName,
        publish_name: publish,
      })
      write(rows)
      return {
        ...statusFor(rows, tokenHash),
        accepted: true,
        displayName,
        publishName: publish,
      }
    },

    async listLighters(limit, offset): Promise<LighterPage> {
      const published = read()
        .filter((r) => r.publish_name && r.display_name)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))

      // One extra row answers "is there another page?" without a second count.
      const window = published.slice(offset, offset + limit + 1)
      return {
        lighters: window.slice(0, limit).map((r, i) => ({
          key: `${r.created_at}-${offset + i}`,
          name: r.display_name as string,
          litAt: r.created_at,
        })),
        hasMore: window.length > limit,
      }
    },
  }
}
