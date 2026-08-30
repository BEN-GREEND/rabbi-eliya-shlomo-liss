import { describe, expect, it } from 'vitest'
import { cleanName, pageOffset, pageSize, wantsPublish } from './provider'

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

  it('does not leave a trailing space when the cut lands on one', () => {
    const cut = cleanName(`${'א'.repeat(59)} ${'ב'.repeat(10)}`)
    expect(cut).toBe('א'.repeat(59))
  })

  it('strips invisible formatting characters', () => {
    expect(cleanName(`שם${LRM}`)).toBe('שם')
    expect(cleanName(`ש${LRM}ם`)).toBe('שם')
  })

  it('keeps HTML as text by removing the markup', () => {
    expect(cleanName('<b>שם</b>')).toBe('שם')
    expect(cleanName('<script>alert(1)</script>')).toBe('alert(1)')
    expect(cleanName('<img src=x onerror=alert(1)>')).toBeNull()
  })

  it('leaves no stray angle bracket behind', () => {
    expect(cleanName('שם > אחר')).toBe('שם אחר')
    expect(cleanName('<<שם')).toBe('שם')
  })

  it('returns null for nothing usable', () => {
    expect(cleanName('   ')).toBeNull()
    expect(cleanName(LRM)).toBeNull()
    expect(cleanName(undefined)).toBeNull()
    expect(cleanName(42)).toBeNull()
  })
})

describe('wantsPublish', () => {
  it('is true only for a ticked box together with a name', () => {
    expect(wantsPublish(true, 'שם')).toBe(true)
  })

  it('is false when the box was not ticked', () => {
    expect(wantsPublish(false, 'שם')).toBe(false)
    expect(wantsPublish(undefined, 'שם')).toBe(false)
  })

  it('is false when there is no name to publish', () => {
    expect(wantsPublish(true, null)).toBe(false)
  })

  it('does not accept a truthy value in place of consent', () => {
    // A form that posts "on", or "false" as a string, has not consented.
    expect(wantsPublish('on', 'שם')).toBe(false)
    expect(wantsPublish('true', 'שם')).toBe(false)
    expect(wantsPublish(1, 'שם')).toBe(false)
  })
})

describe('pageSize / pageOffset', () => {
  it('defaults to a page of twenty', () => {
    expect(pageSize(null)).toBe(20)
    expect(pageSize('0')).toBe(20)
    expect(pageSize('nonsense')).toBe(20)
  })

  it('never serves more than fifty at once', () => {
    expect(pageSize('5000')).toBe(50)
  })

  it('treats a missing or negative offset as the first page', () => {
    expect(pageOffset(null)).toBe(0)
    expect(pageOffset('-10')).toBe(0)
    expect(pageOffset('40')).toBe(40)
  })
})
