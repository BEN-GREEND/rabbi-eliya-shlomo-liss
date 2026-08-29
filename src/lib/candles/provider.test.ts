import { describe, expect, it } from 'vitest'
import { cleanName } from './provider'

/** U+200E LEFT-TO-RIGHT MARK — invisible, and stripped as a formatting char. */
const LRM = '‎'

describe('cleanName', () => {
  it('collapses whitespace and trims', () => {
    expect(cleanName('  שם   לבדיקה  ')).toBe('שם לבדיקה')
  })

  it('keeps an ordinary space between words', () => {
    expect(cleanName('שם לבדיקה')).toBe('שם לבדיקה')
  })

  it('caps at 60 characters', () => {
    expect(cleanName('א'.repeat(200))).toHaveLength(60)
  })

  it('strips invisible formatting characters', () => {
    expect(cleanName(`שם${LRM}`)).toBe('שם')
    expect(cleanName(`ש${LRM}ם`)).toBe('שם')
  })

  it('returns null for nothing usable', () => {
    expect(cleanName('   ')).toBeNull()
    expect(cleanName(LRM)).toBeNull()
    expect(cleanName(undefined)).toBeNull()
    expect(cleanName(42)).toBeNull()
  })
})
