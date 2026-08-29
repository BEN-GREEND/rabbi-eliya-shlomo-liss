import 'server-only'

import { createHash, randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'site_anon_token'
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5

/**
 * One anonymous token per browser, shared by everything on the site that needs
 * to tell one browser from another.
 *
 * It is a random value the server issued — not a fingerprint. Nothing is read
 * from the device: no IP, no user agent, no canvas, no screen metrics.
 *
 * The token itself is never stored. Each feature stores only a hash, and each
 * hash is domain-separated, so the same browser yields a different value for
 * the candle than for the visitor count. The two tables therefore cannot be
 * joined, even by someone holding both.
 */
export type TokenDomain = 'candle' | 'visitor'

/** Pure and testable: the hashing rule, with no cookie involved. */
export function hashToken(domain: TokenDomain, token: string, pepper: string): string {
  return createHash('sha256').update(`${domain}:${token}:${pepper}`).digest('hex')
}

function pepper(): string {
  return process.env.ANON_TOKEN_PEPPER ?? 'development-pepper'
}

/** Read this browser's token, issuing one the first time we see it. */
export async function anonTokenHash(domain: TokenDomain): Promise<string> {
  const jar = await cookies()
  let token = jar.get(COOKIE)?.value

  if (!token) {
    token = randomUUID()
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: FIVE_YEARS,
    })
  }

  return hashToken(domain, token, pepper())
}
