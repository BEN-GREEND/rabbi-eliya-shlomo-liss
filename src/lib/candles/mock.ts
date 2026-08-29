import fs from 'node:fs'
import path from 'node:path'
import type { CandleStatus, CandleStore, LightResult } from './types'

/**
 * Development store.
 *
 * Keeps the same shape as the real one so the whole memorial page — counter,
 * cooldown, the lot — works with no credentials at all. Backed by a file under
 * .content-cache so a restart does not reset the count while you are working.
 */
const FILE = path.join(process.cwd(), '.content-cache', 'candles.json')

interface Row {
  created_at: string
  token_hash: string
  display_name: string | null
}

function read(): Row[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as Row[]
  } catch {
    return []
  }
}

function write(rows: Row[]): void {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(rows, null, 2))
  } catch {
    // A read-only filesystem is fine here: the count simply does not persist.
  }
}

export function createMockStore(cooldownHours: number): CandleStore {
  const cooldownMs = cooldownHours * 60 * 60 * 1000

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
    async lightCandle(tokenHash, displayName): Promise<LightResult> {
      const rows = read()
      const status = statusFor(rows, tokenHash)
      if (status.hasLitRecently) return { ...status, accepted: false }

      rows.push({
        created_at: new Date().toISOString(),
        token_hash: tokenHash,
        display_name: displayName,
      })
      write(rows)
      return { ...statusFor(rows, tokenHash), accepted: true }
    },
  }
}
