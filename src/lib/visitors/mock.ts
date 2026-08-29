import fs from 'node:fs'
import path from 'node:path'
import type { VisitorStore } from './types'

/** Development store — same shape as the real one, backed by a file. */
const FILE = path.join(process.cwd(), '.content-cache', 'visitors.json')

function read(): string[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as string[]
  } catch {
    return []
  }
}

function write(hashes: string[]): void {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(hashes, null, 2))
  } catch {
    // Read-only filesystem: the count simply does not persist.
  }
}

export function createMockVisitorStore(): VisitorStore {
  return {
    name: 'mock',
    async getCount() {
      return read().length
    },
    async register(tokenHash) {
      const hashes = read()
      if (!hashes.includes(tokenHash)) {
        hashes.push(tokenHash)
        write(hashes)
      }
      return hashes.length
    },
  }
}
