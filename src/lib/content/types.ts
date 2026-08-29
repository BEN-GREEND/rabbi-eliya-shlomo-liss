/**
 * Core content types.
 *
 * Every piece of content on this site is an "item" belonging to a collection.
 * Items reference each other exclusively by their globally unique `id` — never
 * by slug, path, or free text. That is what lets us rename a Hebrew title or
 * change a URL without breaking a single connection in the archive.
 */

export const COLLECTIONS = [
  'people',
  'timeline',
  'torah',
  'gallery',
  'archive',
  'testimonies',
  'activities',
  'sources',
  'pages',
] as const

export type Collection = (typeof COLLECTIONS)[number]

/**
 * Collections a visitor can browse — the ones with routes.
 *
 * `pages` holds standing prose that belongs inside another page (the
 * biographical essay, the legacy passage). It has no URL of its own, so it
 * must never appear in navigation or in the sitemap.
 */
export const BROWSABLE_COLLECTIONS = COLLECTIONS.filter(
  (c): c is Exclude<Collection, 'pages'> => c !== 'pages',
)

/** Hebrew display names, used in navigation, headings and validation output. */
export const COLLECTION_LABELS: Record<Collection, string> = {
  people: 'אישים',
  timeline: 'תולדות חייו',
  torah: 'מתורתו',
  gallery: 'גלריה',
  archive: 'ארכיון',
  testimonies: 'זכרונות ועדויות',
  activities: 'פעילותו',
  sources: 'מקורות',
  pages: 'טקסטים',
}

/** URL segment for each collection. */
export const COLLECTION_ROUTES: Record<Collection, string> = {
  people: '/people',
  timeline: '/timeline',
  torah: '/torah',
  gallery: '/gallery',
  archive: '/archive',
  testimonies: '/testimonies',
  activities: '/activities',
  sources: '/sources',
  // No route: pages are rendered inside other pages, never on their own.
  pages: '',
}

/** Singular Hebrew label — used for the exhibit label and for error messages. */
export const COLLECTION_SINGULAR: Record<Collection, string> = {
  people: 'אישיות',
  timeline: 'אירוע',
  torah: 'דבר תורה',
  gallery: 'תמונה',
  archive: 'מסמך',
  testimonies: 'עדות',
  activities: 'פעילות',
  sources: 'מקור',
  pages: 'טקסט',
}

/** A parsed item before cross-collection validation has run. */
export interface RawItem {
  collection: Collection
  /** Repo-relative path, e.g. content/gallery/foo.mdx — used in error messages. */
  filePath: string
  /** Raw MDX body, front matter stripped. */
  body: string
  data: Record<string, unknown>
}
