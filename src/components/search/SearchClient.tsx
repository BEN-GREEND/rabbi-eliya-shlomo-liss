'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import MiniSearch from 'minisearch'
import { normalizeHebrew, tokenizeHebrew } from '@/lib/utils/hebrew'
import { cn } from '@/lib/utils/cn'

export interface SearchDoc {
  id: string
  collection: string
  url: string
  title: string
  text: string
  subtitle: string
  count?: number
}

/** Display order for result groups: people first, then the life, then the rest. */
const GROUP_ORDER = [
  'people',
  'timeline',
  'torah',
  'gallery',
  'archive',
  'testimonies',
  'activities',
  'sources',
]

const GROUP_LABELS: Record<string, string> = {
  people: 'אישים',
  timeline: 'תולדות חייו',
  torah: 'מתורתו',
  gallery: 'גלריה',
  archive: 'ארכיון',
  testimonies: 'זכרונות ועדויות',
  activities: 'פעילותו',
  sources: 'מקורות',
}

/**
 * Search across the whole archive.
 *
 * The index is fetched once, on first keystroke, and searched in the browser —
 * no request per query, and it works the same on a static host.
 *
 * Hebrew is folded on both sides (niqqud, geresh/gershayim, final letters) by
 * the same function, so what is indexed and what is typed always meet.
 */
export function SearchClient({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const requested = useRef(false)

  // Load the index the first time someone actually types.
  useEffect(() => {
    if (!query || requested.current) return
    requested.current = true
    setLoading(true)
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((d: SearchDoc[]) => setDocs(d))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }, [query])

  const engine = useMemo(() => {
    if (!docs) return null
    const ms = new MiniSearch<SearchDoc>({
      fields: ['title', 'subtitle', 'text'],
      storeFields: ['collection', 'url', 'title', 'subtitle', 'count'],
      idField: 'id',
      tokenize: tokenizeHebrew,
      processTerm: (term) => normalizeHebrew(term) || null,
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 4, subtitle: 2 },
      },
    })
    ms.addAll(docs)
    return ms
  }, [docs])

  const grouped = useMemo(() => {
    if (!engine || !query.trim()) return []
    const hits = engine.search(query) as unknown as Array<SearchDoc & { score: number }>
    const byCollection = new Map<string, typeof hits>()
    for (const hit of hits) {
      const list = byCollection.get(hit.collection)
      if (list) list.push(hit)
      else byCollection.set(hit.collection, [hit])
    }
    return GROUP_ORDER.filter((c) => byCollection.has(c)).map((c) => ({
      collection: c,
      hits: byCollection.get(c)!,
    }))
  }, [engine, query])

  const total = grouped.reduce((n, g) => n + g.hits.length, 0)

  return (
    <>
      <div className="border-rule border-y py-6">
        <label htmlFor="q" className="label-caps text-brass">
          חיפוש בארכיון
        </label>
        <input
          id="q"
          ref={inputRef}
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="שם, מקום, שנה, נושא…"
          className="font-display placeholder:text-ink-faint/60 mt-3 w-full border-0 bg-transparent p-0 text-3xl leading-tight outline-none sm:text-4xl"
        />
      </div>

      <div aria-live="polite" className="min-h-[3rem]">
        {query.trim() && (
          <p className="label-caps text-ink-faint py-6">
            {loading ? 'טוען את האינדקס…' : total === 0 ? 'לא נמצאו תוצאות' : `${total} תוצאות`}
          </p>
        )}
      </div>

      {grouped.map(({ collection, hits }) => (
        <section key={collection} className="border-rule border-t py-8">
          <h2 className="label-caps text-brass mb-5">
            {GROUP_LABELS[collection] ?? collection}
            <span className="numerals text-ink-faint ms-2">{hits.length}</span>
          </h2>
          <ul className="grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={hit.url}
                  className={cn(
                    'group border-rule hover:border-brass block border-s ps-4 no-underline transition-colors',
                  )}
                >
                  <span className="font-display group-hover:text-brass block text-lg leading-snug transition-colors">
                    {hit.title}
                  </span>
                  {hit.subtitle && (
                    <span className="text-ink-soft mt-1 block text-[0.9rem] leading-snug">
                      {hit.subtitle}
                    </span>
                  )}
                  {typeof hit.count === 'number' && hit.count > 0 && (
                    <span className="label-caps numerals text-brass mt-1 block">
                      {hit.count} מוצגים קשורים
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {!query.trim() && (
        <p className="text-ink-soft max-w-[38rem] py-10 leading-relaxed">
          החיפוש עובר על כל האוספים — אישים, אירועים, דברי תורה, תמונות, מסמכים, עדויות, פעילויות
          ומקורות. חיפוש שם של אדם מציג את דף האישיות שלו ואת כל המוצגים הקשורים אליו.
        </p>
      )}
    </>
  )
}
