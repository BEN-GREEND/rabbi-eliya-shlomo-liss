import 'server-only'

import {
  BROWSABLE_COLLECTIONS,
  COLLECTION_LABELS,
  getAll,
  getPersonItems,
  type Collection,
} from '@/lib/content'

/** One searchable record. Kept small — the index ships to the browser. */
export interface SearchDoc {
  id: string
  collection: Collection
  url: string
  title: string
  /** Everything worth matching on, already flattened. */
  text: string
  subtitle: string
  /** For a person: how many exhibits point at them. */
  count?: number
}

function fieldsOf(data: Record<string, unknown>): string[] {
  const out: string[] = []
  for (const key of [
    'summary',
    'description',
    'shortBio',
    'relationToRabbi',
    'name',
    'displayName',
    'maidenName',
    'honorific',
    'pullQuote',
    'narratorName',
    'narratorRelation',
    'location',
    'birthPlace',
    'deathPlace',
    'burialPlace',
    'source',
    'author',
    'publication',
    'tractate',
    'chapter',
    'parasha',
    'hebrewDate',
    'approximateDate',
  ]) {
    const v = data[key]
    if (typeof v === 'string' && v) out.push(v)
  }
  for (const key of ['aliases', 'roles', 'tags', 'topic']) {
    const v = data[key]
    if (Array.isArray(v)) out.push(...v.filter((x): x is string => typeof x === 'string'))
  }
  if (typeof data.year === 'number') out.push(String(data.year))
  return out
}

/**
 * Build the client search index.
 *
 * A person carries the titles of everything connected to them, so searching a
 * name surfaces the person first and their photographs, documents and events
 * along with them — which is what someone looking for a name actually wants.
 */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = []

  for (const collection of BROWSABLE_COLLECTIONS) {
    for (const item of getAll(collection)) {
      const data = item.data as Record<string, unknown>
      const parts = [item.title, ...fieldsOf(data), item.body.slice(0, 600)]

      let count: number | undefined
      if (collection === 'people') {
        const linked = getPersonItems(item.id)
        count = linked.length
        parts.push(...linked.map((l) => l.title))
      }

      docs.push({
        id: item.id,
        collection,
        url: item.url,
        title: item.title,
        subtitle:
          (data.relationToRabbi as string) ||
          (data.summary as string) ||
          COLLECTION_LABELS[collection],
        text: parts.join(' \n '),
        ...(count !== undefined ? { count } : {}),
      })
    }
  }

  return docs
}
