import { describe, expect, it } from 'vitest'
import { normalizeHebrew, tokenizeHebrew } from './hebrew'

describe('normalizeHebrew', () => {
  it('strips niqqud so a pointed title matches an unpointed query', () => {
    expect(normalizeHebrew('שְׁלֹמֹה')).toBe(normalizeHebrew('שלמה'))
  })

  it('treats gershayim and a straight double quote as the same', () => {
    expect(normalizeHebrew('תשכ״ג')).toBe(normalizeHebrew('תשכ"ג'))
  })

  it('treats geresh and a straight apostrophe as the same', () => {
    expect(normalizeHebrew('ר׳ נח')).toBe(normalizeHebrew("ר' נח"))
  })

  it('folds final letters', () => {
    expect(normalizeHebrew('חיים')).toBe(normalizeHebrew('חיימ'))
    expect(normalizeHebrew('שך')).toBe(normalizeHebrew('שכ'))
  })

  it('collapses whitespace and trims', () => {
    expect(normalizeHebrew('  קלצק   ')).toBe('קלצק')
  })
})

describe('tokenizeHebrew', () => {
  it('splits on punctuation and keeps numbers', () => {
    expect(tokenizeHebrew('קלצק, 1927 — סלוצק')).toEqual(['קלצק', '1927', 'סלוצק'])
  })

  it('returns nothing for empty input', () => {
    expect(tokenizeHebrew('   ')).toEqual([])
  })
})
