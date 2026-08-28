import fs from 'node:fs'
import path from 'node:path'
import { PUBLIC_DIR } from './content/paths'

/**
 * Does this asset exist under public/ right now?
 *
 * Checked at build time so a slot can stand empty and dignified until the
 * real file arrives, rather than being filled with a fabricated stand-in.
 */
export function assetExists(publicPath: string | undefined | null): boolean {
  if (!publicPath) return false
  if (/^https?:\/\//.test(publicPath)) return true
  return fs.existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\//, '')))
}
