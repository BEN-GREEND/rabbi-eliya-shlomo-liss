/**
 * The reference table.
 *
 * This is the single declaration of every link between items on this site.
 * Two things are generated from it and therefore cannot drift apart:
 *
 *   1. build-time validation  (validate/validate.ts)
 *   2. the reverse index that powers "related items" and person pages
 *      (relations.ts)
 *
 * Adding a new kind of connection is one row here — not new code in two places.
 */
import type { Collection } from './types'

export type RefTarget =
  /** Must resolve to an item in this collection. */
  | { kind: 'collection'; collection: Collection }
  /** Must resolve to any item, in any collection. */
  | { kind: 'anyItem' }
  /** Must resolve to a term in a controlled vocabulary. */
  | { kind: 'vocab'; vocab: 'periods' | 'places' }
  /** Must resolve to a category defined for the *owning* collection. */
  | { kind: 'categories' }

export interface ReferenceRule {
  /** Collection that owns the field, or '*' for every collection. */
  from: Collection | '*'
  /** Front-matter field. `relations[].person` walks into an array of objects. */
  field: string
  target: RefTarget
  cardinality: 'single' | 'array'
  /** Reject an item pointing at itself. */
  noSelf?: boolean
  /**
   * Semantic role, used to group items on a person page
   * ("מכתבים ממנו" vs "מוזכר במסמך").
   */
  role?: string
}

const person = (
  from: Collection | '*',
  field: string,
  cardinality: 'single' | 'array',
  role: string,
): ReferenceRule => ({
  from,
  field,
  target: { kind: 'collection', collection: 'people' },
  cardinality,
  role,
})

export const REFERENCES: readonly ReferenceRule[] = [
  // --- links to people ------------------------------------------------------
  person('timeline', 'people', 'array', 'participant'),
  person('gallery', 'people', 'array', 'depicted'),
  person('torah', 'people', 'array', 'mentioned'),
  person('activities', 'people', 'array', 'participant'),
  person('archive', 'author', 'single', 'author'),
  person('archive', 'recipient', 'single', 'recipient'),
  person('archive', 'mentions', 'array', 'mentioned'),
  person('archive', 'people', 'array', 'related'),
  person('testimonies', 'narrator', 'single', 'narrator'),
  person('testimonies', 'mentions', 'array', 'mentioned'),
  person('testimonies', 'people', 'array', 'related'),
  person('people', 'people', 'array', 'related'),
  {
    from: 'people',
    field: 'relations[].person',
    target: { kind: 'collection', collection: 'people' },
    cardinality: 'array',
    noSelf: true,
    role: 'relation',
  },

  // --- free-form links between any two items --------------------------------
  { from: '*', field: 'related', target: { kind: 'anyItem' }, cardinality: 'array', noSelf: true },

  // --- controlled vocabularies ----------------------------------------------
  {
    from: '*',
    field: 'period',
    target: { kind: 'vocab', vocab: 'periods' },
    cardinality: 'single',
  },
  {
    from: '*',
    field: 'periods',
    target: { kind: 'vocab', vocab: 'periods' },
    cardinality: 'array',
  },
  { from: '*', field: 'places', target: { kind: 'vocab', vocab: 'places' }, cardinality: 'array' },
  { from: '*', field: 'categories', target: { kind: 'categories' }, cardinality: 'array' },
] as const

/** Every rule that applies to a given collection. */
export function rulesFor(collection: Collection): ReferenceRule[] {
  return REFERENCES.filter((r) => r.from === '*' || r.from === collection)
}

/** Every rule that points at people — the basis of the person reverse index. */
export function personRulesFor(collection: Collection): ReferenceRule[] {
  return rulesFor(collection).filter(
    (r) => r.target.kind === 'collection' && r.target.collection === 'people',
  )
}

/** Hebrew labels for the roles above, used as headings on a person page. */
export const ROLE_LABELS: Record<string, string> = {
  author: 'מכתבים ומסמכים מאת',
  recipient: 'מכתבים ומסמכים אל',
  mentioned: 'מוזכר',
  depicted: 'מופיע בתמונה',
  participant: 'השתתף',
  narrator: 'עדות שמסר',
  related: 'קשור',
  relation: 'קשר',
}

/**
 * Read a field out of front matter, following the `relations[].person` form.
 * Always returns a flat list of { value, path } so error messages can point at
 * the exact array index that is wrong.
 */
export function readRefField(
  data: Record<string, unknown>,
  field: string,
): Array<{ value: string; path: string }> {
  const nested = field.match(/^(\w+)\[\]\.(\w+)$/)
  if (nested) {
    const [, arrayField, key] = nested as unknown as [string, string, string]
    const arr = data[arrayField]
    if (!Array.isArray(arr)) return []
    return arr.flatMap((entry, i) => {
      const value = (entry as Record<string, unknown>)?.[key]
      return typeof value === 'string' && value
        ? [{ value, path: `${arrayField}[${i}].${key}` }]
        : []
    })
  }

  const raw = data[field]
  if (typeof raw === 'string' && raw) return [{ value: raw, path: field }]
  if (Array.isArray(raw)) {
    return raw.flatMap((v, i) =>
      typeof v === 'string' && v ? [{ value: v, path: `${field}[${i}]` }] : [],
    )
  }
  return []
}
