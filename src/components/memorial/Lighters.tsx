'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { Glyph } from '@/components/primitives/Glyph'

interface Lighter {
  key: string
  name: string
  litAt: string
}

interface Page {
  lighters: Lighter[]
  hasMore: boolean
}

const PAGE = 20

/** Just the day. The hour a candle was lit is nobody's business. */
function litOn(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function fetchPage(offset: number): Promise<Page> {
  const res = await fetch(`/api/candles/lighters?limit=${PAGE}&offset=${offset}`)
  if (!res.ok) throw new Error('unavailable')
  return (await res.json()) as Page
}

/**
 * מדליקי נרות — the names of those who consented to be named.
 *
 * Only rows carrying both a name and explicit consent ever reach this
 * component; the route selects the name and the date and nothing else, so
 * there is no identifier here to leak. Names arrive newest first, twenty at a
 * time, and the rest only on request — the page never loads the lot.
 *
 * With no published names the section is absent entirely rather than showing
 * an empty case: an empty list of names would read as a failure, and there is
 * nothing missing here.
 */
export function Lighters({ reloadKey = 0 }: { reloadKey?: number }) {
  const [lighters, setLighters] = useState<Lighter[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // The first page, and again whenever a name has just been published. State
  // is set from the promise, never synchronously in the effect body.
  useEffect(() => {
    let cancelled = false
    fetchPage(0)
      .then((page) => {
        if (cancelled) return
        setLighters(page.lighters)
        setHasMore(page.hasMore)
      })
      .catch(() => {
        // The names are an addition to the page, not the page. If they cannot
        // be fetched the memorial still stands.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const loadMore = useCallback(async (offset: number) => {
    setBusy(true)
    try {
      const page = await fetchPage(offset)
      setLighters((prev) => [...prev, ...page.lighters])
      setHasMore(page.hasMore)
    } catch {
      // Same again: a page of names that will not load is not a failed page.
    } finally {
      setBusy(false)
    }
  }, [])

  if (!loaded || lighters.length === 0) return null

  return (
    <section className="mt-28" aria-labelledby="lighters-heading">
      <div className="mb-10 flex items-center gap-3">
        <span aria-hidden="true" className="bg-brass-line/30 h-px flex-1" />
        <Glyph name="person" className="text-brass-soft h-4 w-4" />
        <h2 id="lighters-heading" className="label-caps text-brass-soft">
          מדליקי נרות
        </h2>
        <span aria-hidden="true" className="bg-brass-line/30 h-px flex-1" />
      </div>

      <ul className="mx-auto max-w-[34rem]">
        {lighters.map((lighter) => (
          <li
            key={lighter.key}
            className="border-rule-navy flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4 last:border-b-0"
          >
            {/* A name may run to sixty characters; it wraps rather than
                pushing the date off the row. */}
            <span className="font-display text-paper min-w-0 flex-1 text-xl leading-snug break-words">
              {lighter.name}
            </span>
            <time dateTime={lighter.litAt} className="label-caps numerals text-paper/55 shrink-0">
              {litOn(lighter.litAt)}
            </time>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            variant="onDeep"
            disabled={busy}
            onClick={() => void loadMore(lighters.length)}
          >
            {busy ? 'טוען…' : 'הצג נוספים'}
          </Button>
        </div>
      )}
    </section>
  )
}
