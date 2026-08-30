'use client'

import { useEffect, useState } from 'react'

/**
 * How many candles have been lit, for the footer's memorial block.
 *
 * Reads the same endpoint the memorial page reads — there is no second counter
 * and no new state anywhere. Until the number arrives nothing is shown: a
 * memorial that says "0 נרות" while it is still loading tells the visitor
 * something untrue about this man's memory.
 */
export function CandleCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candles')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('unavailable'))))
      .then((d: { count: number }) => {
        if (!cancelled) setCount(d.count)
      })
      .catch(() => {
        // The block still reads correctly without a number.
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (count === null) return null

  return (
    <span className="text-paper/70 mt-2 block text-[0.9rem]">
      <span dir="ltr" className="numerals text-brass-soft inline-block font-semibold">
        {count.toLocaleString('he-IL')}
      </span>{' '}
      {count === 1 ? 'נר הודלק לזכרו' : 'נרות הודלקו לזכרו'}
    </span>
  )
}
