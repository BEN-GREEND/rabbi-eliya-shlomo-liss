/**
 * Zod schemas — one per collection.
 *
 * These validate the shape of a single file in isolation. They deliberately do
 * NOT validate that referenced ids exist: at the moment a file is parsed the
 * other collections have not been read yet. Cross-collection integrity is a
 * separate pass — see ./validate/validate.ts.
 */
import { z } from 'zod'

/** Stable identifier. Never changes, even if the Hebrew spelling does. */
export const zId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'מזהה חייב להיות אותיות לטיניות קטנות, ספרות ומקפים')

/** URL segment. May be changed later without breaking references. */
export const zSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug חייב להיות אותיות לטיניות קטנות, ספרות ומקפים')

const zImage = z.object({
  src: z.string().min(1),
  /** Required. An archive without alt text is an archive half the public cannot use. */
  alt: z.string().min(1, 'חובה להזין alt לכל תמונה'),
  credit: z.string().optional(),
  caption: z.string().optional(),
})

const zMedia = z.object({
  type: z.enum(['video', 'audio']),
  src: z.string().min(1),
  duration: z.string().optional(),
})

/**
 * Provenance.
 *
 * Every claim on this site carries its sources and a confidence level. This
 * is what separates an archive from a blog: a reader — and a future editor —
 * can always ask "how do we know this?" and get an answer.
 *
 * Sources are references to items in the `sources` collection, so one
 * bibliographic record is described once and cited everywhere.
 */
const zSourceRef = z.object({
  source: zId,
  /** Page, issue, folio — where inside the source this claim sits. */
  locator: z.string().optional(),
  note: z.string().optional(),
})

export const confidenceLevels = ['high', 'medium', 'low'] as const

const provenance = {
  sources: z.array(zSourceRef).default([]),
  confidence: z.enum(confidenceLevels).optional(),
  /**
   * Settled by an authoritative source — in practice the family's own
   * document. A canonical claim is not shown as provisional, and it overrides
   * any secondary source that says otherwise.
   */
  canonical: z.boolean().default(false),
  /**
   * An unresolved question, a conflict between sources, or a claim awaiting a
   * primary source. Contradictions are recorded here, never quietly resolved.
   */
  researchNote: z.string().optional(),
  researchNeeded: z.boolean().default(false),
}

/**
 * Dating. A date is either known or approximate — never both, and never
 * invented. `approximateDate` always renders with an explicit "בערך" prefix.
 */
const dating = {
  date: z.iso.date().optional(),
  approximateDate: z.string().optional(),
  year: z.number().int().min(1000).max(2200).optional(),
  hebrewDate: z.string().optional(),
}

/** Fields every collection shares. */
const base = {
  ...provenance,
  id: zId,
  slug: zSlug,
  title: z.string().min(1),
  /** A second line under the title, where one clarifies what the item is about. */
  subtitle: z.string().optional(),
  summary: z.string().optional(),
  /** Marks an item as scaffolding awaiting real content. Rendered with a notice. */
  placeholder: z.boolean().default(false),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  period: z.string().optional(),
  places: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  related: z.array(zId).default([]),
  source: z.string().optional(),
  credit: z.string().optional(),
}

/**
 * What the archive can say about a physical object.
 *
 * A museum describes objects it does not hold: ones still in the family's
 * hands, ones known to exist but not yet scanned, and ones that are simply
 * gone. Each of these is a different statement and the site must not blur
 * them — "we have not digitised it" is not "we do not know if it survived".
 */
const zAssetStatus = z.enum([
  /** The file is in the archive and can be shown. */
  'present',
  /** The original is held, and confirmed to exist, but not yet scanned. */
  'not-digitized',
  /** Held privately by the family. Described here, not served from here. */
  'private-archive',
  /** Identified and described, but the file is not in hand. */
  'awaited',
  /** Found bibliographically; the object itself has not been obtained. */
  'located',
  /** Known to have existed; not located. */
  'sought',
  /** No longer extant. */
  'lost',
])

export const personRelationTypes = [
  'father',
  'mother',
  'son',
  'daughter',
  'brother',
  'sister',
  'spouse',
  'wife',
  'husband',
  'son-in-law',
  'father-in-law',
  'brother-in-law',
  'sister-in-law',
  'daughter-in-law',
  'mother-in-law',
  'grandson',
  'granddaughter',
  'grandchild',
  'grandparent',
  'teacher',
  'student',
  'colleague',
  'professional',
] as const

/**
 * How close a source stands to the events it describes. This, not prose
 * confidence, is what a reader needs in order to weigh a claim.
 */
export const sourceTypes = [
  'primary',
  'firsthand',
  'contemporary',
  'retrospective',
  'family',
  'secondary',
  'unverified',
] as const

export const schemas = {
  /**
   * Standing prose that belongs to a page rather than to an exhibit — the
   * biographical essay, the passage on the family's continuation. Kept in
   * content so it can be rewritten without touching a component, and so it
   * carries sources like everything else.
   */
  pages: z.object({
    ...base,
    people: z.array(zId).default([]),
  }),

  /**
   * The bibliography. One record per source, cited by id from anywhere.
   * A source we have located but not yet read is still a record — knowing
   * what we have not read is part of the archive.
   */
  sources: z.object({
    ...base,
    sourceType: z.enum(sourceTypes),
    author: z.string().optional(),
    publication: z.string().optional(),
    issue: z.string().optional(),
    /** Locator inside the publication, e.g. "עמ׳ 41". Distinct from an
        archive item's `pages`, which lists scan files. */
    pageRef: z.string().optional(),
    publishedDate: z.string().optional(),
    hebrewYear: z.string().optional(),
    url: z.string().optional(),
    /** The url is publicly readable, so the site may link straight to it. */
    publicSource: z.boolean().default(false),
    /** obtained = read in full. located = found but not yet read. sought = not found. */
    status: z.enum(['obtained', 'located', 'sought']).default('sought'),
    priority: z.enum(['very-high', 'high', 'normal']).optional(),
    people: z.array(zId).default([]),
  }).strict(),

  people: z.object({
    ...base,
    name: z.string().min(1),
    displayName: z.string().optional(),
    maidenName: z.string().optional(),
    honorific: z.string().optional(),
    ...dating,
    birthDate: z.iso.date().optional(),
    deathDate: z.iso.date().optional(),
    birthYear: z.number().int().optional(),
    deathYear: z.number().int().optional(),
    /** Explicit flag. We never present a guessed year as a fact. */
    approximateDates: z.boolean().default(false),
    roles: z.array(z.string()).default([]),
    relationToRabbi: z.string().optional(),
    /**
     * Named in a source as connected to the Rabbi, but the connection itself
     * has not been verified. Such a person is listed apart, never presented
     * as an established student or colleague.
     */
    researchCandidate: z.boolean().default(false),
    shortBio: z.string().optional(),
    image: zImage.optional(),
    birthHebrewDate: z.string().optional(),
    deathHebrewDate: z.string().optional(),
    birthPlace: z.string().optional(),
    deathPlace: z.string().optional(),
    burialPlace: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    periods: z.array(z.string()).default([]),
    relations: z
      .array(
        z.object({
          person: zId,
          type: z.enum(personRelationTypes),
          note: z.string().optional(),
        }),
      )
      .default([]),
    people: z.array(zId).default([]),
  }).strict(),

  timeline: z.object({
    ...base,
    ...dating,
    /**
     * Omitted for an undated episode. A life does not arrive pre-dated, and
     * inventing a year to fill the field would be inventing history.
     */
    undated: z.boolean().default(false),
    /**
     * Ordering metadata only — never rendered anywhere. Lets an undated
     * episode sit in the right place on the spine without asserting a date.
     */
    sortYear: z.number().int().optional(),
    dateDisplay: z.string().optional(),
    location: z.string().optional(),
    image: zImage.optional(),
    people: z.array(zId).default([]),
  }).strict(),

  torah: z.object({
    ...base,
    ...dating,
    kind: z.enum(['article', 'lecture', 'excerpt', 'letter', 'manuscript', 'quote', 'book']),
    topic: z.array(z.string()).default([]),
    parasha: z.string().optional(),
    /** Who prepared the volume for print — distinct from its author. */
    editor: z.array(zId).default([]),
    tractate: z.string().optional(),
    chapter: z.string().optional(),
    /** How many parts have actually appeared. Never more than we know of. */
    publishedParts: z.number().int().optional(),
    coverImage: zImage.optional(),
    pdf: z.string().optional(),
    scans: z.array(z.string()).default([]),
    people: z.array(zId).default([]),
  }).strict(),

  gallery: z.object({
    ...base,
    ...dating,
    description: z.string().optional(),
    assetStatus: zAssetStatus.default('present'),
    image: zImage.optional(),
    location: z.string().optional(),
    photographer: z.string().optional(),
    copyright: z.string().optional(),
    /** Drives the museum composition. Content decides emphasis, not the code. */
    emphasis: z.enum(['small', 'medium', 'large', 'full']).default('medium'),
    people: z.array(zId).default([]),
  }).strict(),

  archive: z.object({
    ...base,
    ...dating,
    docType: z.enum([
      'letter',
      'manuscript',
      'certificate',
      'invitation',
      'article',
      'scan',
      'document',
    ]),
    description: z.string().optional(),
    assetStatus: zAssetStatus.default('present'),
    /** Who holds the original. Family-held material is described, never served. */
    custodian: zId.optional(),
    /** Person ids. Empty when unknown — never guessed. */
    author: zId.optional(),
    recipient: zId.optional(),
    mentions: z.array(zId).default([]),
    preview: zImage.optional(),
    file: z.string().optional(),
    pages: z.array(z.string()).default([]),
    transcription: z.string().optional(),
    people: z.array(zId).default([]),
  }).strict(),

  testimonies: z.object({
    ...base,
    ...dating,
    /** Prefer a person id. Falls back to free text when no person item exists yet. */
    narrator: zId.optional(),
    narratorName: z.string().optional(),
    narratorRelation: z.string().optional(),
    /** Free-text place, alongside the controlled `places` vocabulary. */
    location: z.string().optional(),
    pullQuote: z.string().optional(),
    topic: z.array(z.string()).default([]),
    image: zImage.optional(),
    media: zMedia.optional(),
    mentions: z.array(zId).default([]),
    people: z.array(zId).default([]),
  }).strict(),

  activities: z.object({
    ...base,
    ...dating,
    kind: z.enum(['institution', 'role', 'community', 'initiative', 'event', 'enterprise']),
    startYear: z.number().int().optional(),
    endYear: z.number().int().optional(),
    ongoing: z.boolean().default(false),
    location: z.string().optional(),
    image: zImage.optional(),
    periods: z.array(z.string()).default([]),
    people: z.array(zId).default([]),
  }).strict(),
} as const

export type Schemas = typeof schemas
export type ItemData<C extends keyof Schemas> = z.output<Schemas[C]>
