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

  // --- citations ------------------------------------------------------------
  // Every claim's provenance is validated like any other link: cite a source
  // that does not exist and the build stops.
  {
    from: '*',
    field: 'sources[].source',
    target: { kind: 'collection', collection: 'sources' },
    cardinality: 'array',
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

/**
 * Convention: a relation's `type` names the OTHER person's role relative to
 * the subject. On Binyamin's record, `{person: rabbi, type: father}` reads
 * "the Rabbi is his father".
 *
 * The inverse lets a tie be declared once and read from both ends: the
 * students each name the Rabbi as their teacher, and his page lists them
 * without anyone maintaining a list of twelve names by hand.
 *
 * Where the inverse is genuinely ambiguous — a father's child may be a son or
 * a daughter — the neutral term is used rather than a guess.
 */
export const INVERSE_RELATION: Record<string, string> = {
  father: 'child',
  mother: 'child',
  son: 'parent',
  daughter: 'parent',
  brother: 'sibling',
  sister: 'sibling',
  sibling: 'sibling',
  child: 'parent',
  parent: 'child',
  spouse: 'spouse',
  wife: 'husband',
  husband: 'wife',
  'son-in-law': 'father-in-law',
  'father-in-law': 'son-in-law',
  'brother-in-law': 'brother-in-law',
  'sister-in-law': 'sister-in-law',
  'daughter-in-law': 'father-in-law',
  'mother-in-law': 'daughter-in-law',
  grandson: 'grandparent',
  granddaughter: 'grandparent',
  grandchild: 'grandparent',
  grandparent: 'grandchild',
  teacher: 'student',
  student: 'teacher',
  colleague: 'colleague',
  professional: 'professional',
}

/** Hebrew labels for the kinds of tie between two people. */
export const RELATION_LABELS: Record<string, string> = {
  father: 'אביו',
  mother: 'אמו',
  son: 'בנו',
  daughter: 'בתו',
  brother: 'אחיו',
  sister: 'אחותו',
  spouse: 'בן/בת זוגו',
  wife: 'רעייתו',
  husband: 'בעלה',
  'son-in-law': 'חתנו',
  'father-in-law': 'חותנו',
  'brother-in-law': 'גיסו',
  'sister-in-law': 'גיסתו',
  teacher: 'רבו',
  student: 'תלמידו',
  colleague: 'עמיתו',
  professional: 'קשר מקצועי',
  child: 'בנו/בתו',
  parent: 'הורהו',
  sibling: 'אחיו/אחותו',
  'daughter-in-law': 'כלתו',
  'mother-in-law': 'חמותו',
  grandson: 'נכדו',
  granddaughter: 'נכדתו',
  grandchild: 'נכדו/נכדתו',
  grandparent: 'סבו',
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
