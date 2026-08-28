/**
 * Date presentation.
 *
 * An approximate date is ALWAYS rendered with an explicit marker. The site
 * never shows a guess as though it were a fact.
 */
export interface Datable {
  /** Scaffolding item. Its structural values are not facts and never display. */
  placeholder?: boolean
  date?: string
  approximateDate?: string
  year?: number
  hebrewDate?: string
  dateDisplay?: string
}

const heDate = new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(d: Datable): string | null {
  // A placeholder's year exists only to satisfy the schema. Showing it would
  // present scaffolding as history.
  if (d.placeholder) return null
  if (d.dateDisplay) return d.dateDisplay
  if (d.date) return heDate.format(new Date(d.date))
  if (d.approximateDate) return `בערך ${d.approximateDate}`
  if (typeof d.year === 'number') return String(d.year)
  return null
}

/** The machine-readable value for <time datetime="…">, when we have one. */
export function dateTimeAttr(d: Datable): string | undefined {
  if (d.placeholder) return undefined
  if (d.date) return d.date
  if (typeof d.year === 'number') return String(d.year)
  return undefined
}

/** Life years, e.g. "1900—1970". Returns null when neither is known. */
export function lifeSpan(p: {
  birthYear?: number
  deathYear?: number
  approximateDates?: boolean
}): string | null {
  if (!p.birthYear && !p.deathYear) return null
  const from = p.birthYear ?? '?'
  const to = p.deathYear ?? '?'
  return `${p.approximateDates ? 'בערך ' : ''}${from}–${to}`
}
