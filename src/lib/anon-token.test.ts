import { describe, expect, it } from 'vitest'
import { hashToken } from './anon-token'

const TOKEN = '7c1f5b4e-0000-4000-8000-abcdefabcdef'
const PEPPER = 'a-long-random-pepper'

describe('hashToken', () => {
  it('gives the same browser different hashes per domain', () => {
    // This is what stops the two tables from being joined.
    expect(hashToken('candle', TOKEN, PEPPER)).not.toBe(hashToken('visitor', TOKEN, PEPPER))
  })

  it('is stable for the same inputs', () => {
    expect(hashToken('candle', TOKEN, PEPPER)).toBe(hashToken('candle', TOKEN, PEPPER))
  })

  it('changes completely when the pepper changes', () => {
    expect(hashToken('candle', TOKEN, PEPPER)).not.toBe(hashToken('candle', TOKEN, 'other'))
  })

  it('never contains the token itself', () => {
    expect(hashToken('candle', TOKEN, PEPPER)).not.toContain(TOKEN)
  })

  it('produces a sha256 hex digest', () => {
    expect(hashToken('visitor', TOKEN, PEPPER)).toMatch(/^[0-9a-f]{64}$/)
  })
})
