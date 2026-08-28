/**
 * The content façade.
 *
 * This is the ONLY module pages and components import. No component reads a
 * file, parses front matter, or knows that content lives in MDX. When this
 * project moves to a CMS, this file is what gets reimplemented — the Zod
 * schemas stay the contract and every call site stays untouched.
 */
import 'server-only'

import { buildIndex, type ContentIndex, type PersonLink } from './relations'
import { COLLECTION_ROUTES, type Collection, type RawItem } from './types'
import { validateContent } from './validate/validate'

export type { PersonLink } from './relations'
export * from './types'
export { loadVocab, periodById, placeById, categoryById } from './vocab'
export { ROLE_LABELS } from './references'

/** A content item as the rest of the app sees it. */
export interface Item<T = Record<string, unknown>> {
  id: string
  slug: string
  collection: Collection
  url: string
  title: string
  body: string
  filePath: string
  data: T
}

let cache: { index: ContentIndex; items: Item[] } | null = null

function toItem(raw: RawItem): Item {
  const slug = raw.data.slug as string
  return {
    id: raw.data.id as string,
    slug,
    collection: raw.collection,
    url: `${COLLECTION_ROUTES[raw.collection]}/${slug}`,
    title: raw.data.title as string,
    body: raw.body,
    filePath: raw.filePath,
    data: raw.data,
  }
}

/**
 * Load, validate and index all content. Runs once per process.
 *
 * Validation runs here too, not only in `prebuild`, so a broken reference
 * surfaces in the dev error overlay instead of silently rendering an empty page.
 */
function load() {
  if (cache) return cache

  const { items: raw, errorCount, problems } = validateContent()

  if (errorCount > 0) {
    const first = problems.filter((p) => p.severity === 'error').slice(0, 5)
    const detail = first
      .map(
        (p) => `  • ${p.filePath} › ${p.field ?? ''} ${p.value ? `"${p.value}" ` : ''}${p.message}`,
      )
      .join('\n')
    throw new Error(
      `שלמות התוכן נכשלה — ${errorCount} שגיאות.\n${detail}\n\nהרץ  npm run content:check  לדוח המלא.`,
    )
  }

  const visible = raw.filter((r) => !r.data.draft)
  cache = { index: buildIndex(visible), items: visible.map(toItem) }
  return cache
}

// ---- reads -----------------------------------------------------------------

/**
 * Real, published content only — placeholders excluded.
 *
 * The home page is the front of the exhibition: it shows what actually
 * exists. Scaffolding items stay visible inside their own collections, where
 * they read as work in progress, but they never fill the shop window.
 */
export function getReal(collection: Collection): Item[] {
  return getAll(collection).filter((item) => !item.data.placeholder)
}

export function getAll(collection: Collection): Item[] {
  return load()
    .items.filter((i) => i.collection === collection)
    .sort(byNaturalOrder)
}

export function getBySlug(collection: Collection, slug: string): Item | undefined {
  return load().items.find((i) => i.collection === collection && i.slug === slug)
}

export function getById(id: string): Item | undefined {
  const raw = load().index.byId.get(id)
  return raw ? toItem(raw) : undefined
}

export function getFeatured(collection: Collection, limit?: number): Item[] {
  const featured = getAll(collection).filter((i) => i.data.featured)
  return limit ? featured.slice(0, limit) : featured
}

/** Every item that points at this person, grouped by the role of the link. */
export function getPersonLinks(personId: string): PersonLink[] {
  return load().index.personToItems.get(personId) ?? []
}

export function getPersonItems(personId: string): Array<Item & { role: string }> {
  const { index } = load()
  return getPersonLinks(personId).flatMap((link) => {
    const raw = index.byId.get(link.itemId)
    return raw ? [{ ...toItem(raw), role: link.role }] : []
  })
}

/** Symmetric related items — declared in one direction, readable from both. */
export function getRelated(id: string, limit?: number): Item[] {
  const { index } = load()
  const ids = [...(index.relatedGraph.get(id) ?? [])]
  const items = ids.flatMap((rid) => {
    const raw = index.byId.get(rid)
    return raw ? [toItem(raw)] : []
  })
  return limit ? items.slice(0, limit) : items
}

export function getByPeriod(periodId: string): Item[] {
  const { index } = load()
  return (index.byPeriod.get(periodId) ?? []).flatMap((id) => {
    const raw = index.byId.get(id)
    return raw ? [toItem(raw)] : []
  })
}

/** Deterministic pick — same item all day, so the page stays static. */
export function getDailyItem(collection: Collection): Item | undefined {
  const items = getReal(collection)
  if (!items.length) return undefined
  const now = new Date()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  return items[dayOfYear % items.length]
}

export function countPersonItems(personId: string): number {
  return getPersonLinks(personId).length
}

// ---- ordering --------------------------------------------------------------

function yearOf(item: Item): number {
  const d = item.data as { year?: number; date?: string; startYear?: number; birthYear?: number }
  if (typeof d.year === 'number') return d.year
  if (typeof d.startYear === 'number') return d.startYear
  if (typeof d.birthYear === 'number') return d.birthYear
  if (d.date) return new Date(d.date).getFullYear()
  return Number.POSITIVE_INFINITY
}

function byNaturalOrder(a: Item, b: Item): number {
  const ya = yearOf(a)
  const yb = yearOf(b)
  if (ya !== yb) return ya - yb
  const oa = (a.data.order as number) ?? 0
  const ob = (b.data.order as number) ?? 0
  if (oa !== ob) return oa - ob
  return a.title.localeCompare(b.title, 'he')
}

export { yearOf }
