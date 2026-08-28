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
  id: zId,
  slug: zSlug,
  title: z.string().min(1),
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

export const personRelationTypes = [
  'father',
  'mother',
  'son',
  'daughter',
  'brother',
  'sister',
  'son-in-law',
  'father-in-law',
  'teacher',
  'student',
  'colleague',
  'professional',
] as const

export const schemas = {
  people: z.object({
    ...base,
    name: z.string().min(1),
    displayName: z.string().optional(),
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
    shortBio: z.string().optional(),
    image: zImage.optional(),
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
    sources: z.array(z.string()).default([]),
    people: z.array(zId).default([]),
  }),

  timeline: z.object({
    ...base,
    ...dating,
    /** The spine of the biography page. Required. */
    year: z.number().int().min(1000).max(2200),
    dateDisplay: z.string().optional(),
    location: z.string().optional(),
    image: zImage.optional(),
    people: z.array(zId).default([]),
  }),

  torah: z.object({
    ...base,
    ...dating,
    kind: z.enum(['article', 'lecture', 'excerpt', 'letter', 'manuscript', 'quote']),
    topic: z.array(z.string()).default([]),
    parasha: z.string().optional(),
    coverImage: zImage.optional(),
    pdf: z.string().optional(),
    scans: z.array(z.string()).default([]),
    people: z.array(zId).default([]),
  }),

  gallery: z.object({
    ...base,
    ...dating,
    description: z.string().optional(),
    image: zImage,
    location: z.string().optional(),
    photographer: z.string().optional(),
    copyright: z.string().optional(),
    /** Drives the museum composition. Content decides emphasis, not the code. */
    emphasis: z.enum(['small', 'medium', 'large', 'full']).default('medium'),
    people: z.array(zId).default([]),
  }),

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
    /** Person ids. Empty when unknown — never guessed. */
    author: zId.optional(),
    recipient: zId.optional(),
    mentions: z.array(zId).default([]),
    preview: zImage.optional(),
    file: z.string().optional(),
    pages: z.array(z.string()).default([]),
    transcription: z.string().optional(),
    people: z.array(zId).default([]),
  }),

  testimonies: z.object({
    ...base,
    ...dating,
    /** Prefer a person id. Falls back to free text when no person item exists yet. */
    narrator: zId.optional(),
    narratorName: z.string().optional(),
    narratorRelation: z.string().optional(),
    pullQuote: z.string().optional(),
    topic: z.array(z.string()).default([]),
    image: zImage.optional(),
    media: zMedia.optional(),
    mentions: z.array(zId).default([]),
    people: z.array(zId).default([]),
  }),

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
  }),
} as const

export type Schemas = typeof schemas
export type ItemData<C extends keyof Schemas> = z.output<Schemas[C]>
