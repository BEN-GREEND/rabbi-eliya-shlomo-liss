/**
 * Catalogue numbers.
 *
 * Every exhibit carries one, the way a museum object does. It is derived —
 * a Hebrew letter for the collection plus the item's position within it — so
 * nobody has to assign or maintain numbers by hand.
 */
import type { Collection } from './content/types'

const COLLECTION_LETTER: Record<Collection, string> = {
  timeline: 'א',
  torah: 'ב',
  gallery: 'ג',
  archive: 'ד',
  testimonies: 'ה',
  activities: 'ו',
  people: 'ז',
  sources: 'ח',
}

export function catalogNumber(collection: Collection, index: number): string {
  return `${COLLECTION_LETTER[collection]}׳/${String(index + 1).padStart(2, '0')}`
}
